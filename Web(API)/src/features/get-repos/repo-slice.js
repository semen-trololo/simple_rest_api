import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {repositoriesService} from "./repo-service";

const initialState = {
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	list: [],
}

export const getAllRepositories = createAsyncThunk(
	'repositories/getAllRepositories',
	async (_, thunkAPI) => {
		try {
			return await repositoriesService.getAllRepositories()
		} catch (error) {
			const message = (error.response && error.response.data && error.response.data.message)
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

export const getInnerFolders = createAsyncThunk(
	'repositories/getInnerFolders',
	async (path, thunkAPI) => {
		try {
			return await repositoriesService.getInnerFolders(path)
		} catch (error) {
			const message = (error.response && error.response.data && error.response.data.message)
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

export const repositoriesSlice = createSlice({
	name: 'repositories',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getAllRepositories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getAllRepositories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.list = action.payload;
			})
			.addCase(getAllRepositories.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.message = action.payload;
				state.list = null;
			})
			.addCase(getInnerFolders.fulfilled, (state, action) => {
				state.list = action.payload;
			})
	}
})

export const selectAllRepositories = (state) => state.repositories.list;
export const selectAllRepositoriesInfo = (state) => ({
	isError: state.repositories.isError,
	isSuccess: state.repositories.isSuccess,
	isLoading: state.repositories.isLoading,
	qty: state.repositories.list.length,
})

export const repositoriesReducer = repositoriesSlice.reducer;
