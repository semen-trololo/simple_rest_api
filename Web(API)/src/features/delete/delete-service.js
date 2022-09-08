import axios from "axios";
import {API_URL, GIT} from "../../api/config";

const deleteRepository = async (repositoryName) => {
	const response = await axios.delete(API_URL + GIT + `/${repositoryName}`,
		{
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
			}
		})
	return response.data
}

export const deleteService = {deleteRepository}
