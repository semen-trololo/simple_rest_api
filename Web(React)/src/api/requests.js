import {API_URL, LOGIN, GIT, CLONE} from "../config";


const postLogin = async (user, password) => {
	const response = await fetch(API_URL + LOGIN,
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({user, password})
		})

	const result = await response.json();

	if (response.ok) {
		return result;
	}

	let err = () => {
		if (response.status === 400) {
			return 'Неверный запрос'
		}
		if (response.status === 401) {
			return 'Неверное имя пользователя или пароль'
		}
		if (response.status === 500) {
			return 'Ошибка сервера'
		}
		if (!response.status) {
			return 'Нет ответа от сервера'
		}
	}

	throw (JSON.stringify(`${err()}`))
}


const getRepos = async () => {
	const token = localStorage.getItem('token')
	const response = await fetch(API_URL + GIT,
		{
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}
		}
	)
	return await response.json();
}

const postClone = async (repositoryURL) => {
	const token = localStorage.getItem('token')
	const response = await fetch(API_URL + CLONE,
		{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({url: repositoryURL})
		}
	)

	return await response.json();
}

const deleteRepository = async (repositoryName) => {
	const token = localStorage.getItem('token')
	const response = await fetch(API_URL + GIT + `/${repositoryName}`,
		{
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			}
		}
	)

	return await response.json();
}


export {postLogin, getRepos, postClone, deleteRepository}
