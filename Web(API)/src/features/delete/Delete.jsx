import {useDispatch, useSelector} from "react-redux";
import {deleteRepository, selectDeleteRepositories} from "./delele-slice";
import {getAllRepositories} from "../get-repos/repo-slice";
import {useEffect} from "react";

export function Delete(props) {
	const {name: repositoryName} = props;
	const dispatch = useDispatch();
	const {isLoading, isSuccess, isError, data} = useSelector(selectDeleteRepositories)
	const deleteHandler = () => {
		dispatch(deleteRepository(repositoryName))
	}

	useEffect(() => {
		dispatch(getAllRepositories())
	}, [data]);


	return <>
	<button className="rep-action-btn" onClick={deleteHandler}>del</button>
	</>
}
