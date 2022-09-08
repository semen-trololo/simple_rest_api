import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {postCloneService} from "./clone-service";
import {getAllRepositories} from "../get-repos/repo-slice";

const initialState = {
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	data: null
}

export const postCloneResponse = createAsyncThunk(
	'clone/postCloneRepositories',
	async (repositoryURL, thunkAPI) => {
		try {
			return await postCloneService.postCloneResponse(repositoryURL)
		} catch (error) {
			const message = (error.response && error.response.data && error.response.data.message)
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

export const cloneSlice = createSlice({
	name: 'clone',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(postCloneResponse.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(postCloneResponse.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload;
			})
			.addCase(postCloneResponse.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
	}
})

export const selectCloneRepositories = (state) => ({
	isError: state.clone.isError,
	isSuccess: state.clone.isSuccess,
	isLoading: state.clone.isLoading,
	data: state.delete.data
})

export const cloneReducer = cloneSlice.reducer;
