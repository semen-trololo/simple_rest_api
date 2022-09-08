import axios from "axios";
import {API_URL, DEF_PATH, DISCOVERY} from "../../api/config";

const getAllRepositories = async () => {
	const response = await axios.post(API_URL + DISCOVERY,
		{
			path: DEF_PATH,
		},
		{
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
		})
	return response.data
}


const getInnerFolders = async (path) => {
	const response = await axios.post(API_URL + DISCOVERY,
		{
			path,
		},
		{
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			},
		})
	return response.data
}




export const repositoriesService = {getAllRepositories, getInnerFolders}
