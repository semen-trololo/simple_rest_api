import axios from "axios";
import {API_URL, LOGIN} from "../../api/config";

const login = async (userData) => {
	const response = await axios.post(API_URL + LOGIN, userData,{
	})

	if (response.data) {
		localStorage.setItem('token', response.data.access_token)
	}

	return response.data
}

const logout = () => {
	localStorage.removeItem('token')
}

export const authService = {
	login,
	logout
}

