import axios from "axios";
import {API_URL, CLONE} from "../../api/config";
import {getAllRepositories} from "../get-repos/repo-slice";

const postCloneResponse = async (repositoryURL) => {
	const response = await axios.post(API_URL + CLONE,
		{
			url:repositoryURL
		},
		{
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			}
		})
	return response.data

}

export const postCloneService = {postCloneResponse}
