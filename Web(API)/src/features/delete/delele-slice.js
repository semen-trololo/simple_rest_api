import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {deleteService} from "./delete-service";
import {getAllRepositories} from "../get-repos/repo-slice";

const initialState = {
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	data: null
}

export const deleteRepository = createAsyncThunk(
	'delete/delete-repository',
	async (repositoryName, {thunkAPI, rejectWithValue}) => {
		try {
			return await deleteService.deleteRepository(repositoryName)
		} catch (error) {
			const message = (error.response && error.response.data && error.response.data.message)
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

export const deleteSlice = createSlice({
	name: 'delete',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(deleteRepository.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteRepository.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.data = action.payload
			})
			.addCase(deleteRepository.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
			})
	}
})

export const selectDeleteRepositories = (state) => ({
	isError: state.delete.isError,
	isSuccess: state.delete.isSuccess,
	isLoading: state.delete.isLoading,
	data: state.delete.data
})

export const deleteReducer = deleteSlice.reducer;
