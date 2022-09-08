import {useDispatch, useSelector} from "react-redux";
import {getAllRepositories, getInnerFolders, selectAllRepositories, selectAllRepositoriesInfo} from "./repo-slice";
import {useEffect, useState} from "react";


export const useRepositories = () => {
	const dispatch = useDispatch();
	const repositories = useSelector(state => selectAllRepositories(state))
	const {isLoading, isError, isSuccess, qty} = useSelector(selectAllRepositoriesInfo)
	const [parent, setParent] = useState('')

	const paths = repositories.path
	const repos = repositories.repositories

	useEffect(() => {
		if (!qty) {
			dispatch(getAllRepositories())
			// setParent('')
		}
	}, [qty, dispatch]);

	const folderHandler = (e) => {
		e.preventDefault();
		dispatch(getInnerFolders(e.target.attributes.href.value))
			.then((result) => {
				let linkArr = result.payload.path.split('/')
				linkArr.pop();
				setParent(linkArr.join('/'))
				dispatch(result)
			})
	}
	return [{isError, isLoading, isSuccess}, paths, repos, folderHandler, parent]
}
