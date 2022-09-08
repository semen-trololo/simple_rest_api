import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {postCloneResponse, selectCloneRepositories} from "./clone-slice";
import {getAllRepositories, selectAllRepositories} from "../get-repos/repo-slice";

export const useCloneForm = () => {
	const dispatch = useDispatch();
	const {isLoading, isSuccess, isError, data} = useSelector(selectCloneRepositories)
	const [repositoryURL, setRepositoryURL] = useState('');


	const cloneHandler = (e) => {
		e.preventDefault();
		dispatch(postCloneResponse(repositoryURL))
	}

	useEffect(() => {
		dispatch(getAllRepositories())
	}, [isSuccess]);

	return [{isLoading, isSuccess, isError}, cloneHandler, repositoryURL, setRepositoryURL]
}
