import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import {pullService} from "./pull-service";


const initialState = {
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    answer: null
}

export const pullRepository = createAsyncThunk(
    'repositories/pullRepository',
    async(repositoryName, thunkAPI) => {
        try {
            return await pullService.pullRepository(repositoryName)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message)
				|| error.message || error.toString()
			return thunkAPI.rejectWithValue(message)
        }
    }
)

export const pullSlice = createSlice({
    name: 'pull',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(pullRepository.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(pullRepository.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.answer = action.payload;
            })
            .addCase(pullRepository.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.answer = null;
            })
    }
})
export const selectPullRepository = (state) => ({
    isError: state.pull.isError,
    isSuccess: state.pull.isSuccess,
    isLoading: state.pull.isLoading,
    answer: state.pull.answer
})
export const pullReducer = pullSlice.reducer;
