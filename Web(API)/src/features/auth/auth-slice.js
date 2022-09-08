import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {authService} from "./auth-service";

export const token = localStorage.getItem('token')

const initialState = {
	token: token ? token : null, isError: false, isSuccess: false, message: ''
}

export const login = createAsyncThunk(
	'auth/login',
	async (user, thunkAPI) => {
	try {
		return await authService.login(user)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message)
			|| error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

export const logout = createAsyncThunk(
	'auth/logout',
	async () => {
		await authService.logout()
	}
)

const authSlice = createSlice({
	name: 'auth', initialState, reducers: {
		reset: (state) => {
			state.isError = false;
			state.isSuccess = false;
			state.message = ''
		}
	}, extraReducers: (builder) => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.isSuccess = true;
				state.token = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isError = true;
				state.message = action.payload;
				state.token = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.token = null;
			})
	}
})

export const {reset} = authSlice.actions;
export const authReducer = authSlice.reducer;
