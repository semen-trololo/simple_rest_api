import {API_URL, PULL} from "../../api/config"
import axios from "axios";

const pullRepository = async (repositoryName) => {
    const response = await axios.post(API_URL + PULL,
        {
            name: repositoryName
        },
        {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        })
        return response.data
}

export const pullService = {pullRepository}
