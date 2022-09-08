import {useDispatch, useSelector} from "react-redux";
import {pullRepository, selectPullRepository} from "./pull-slice";
import {useEffect} from "react";
import {getAllRepositories} from "../get-repos/repo-slice";

export function Pull(props) {
	const {name: repositoryName} = props;
	const dispatch = useDispatch()
	const {isLoading, isSuccess, isError, answer} = useSelector(state => selectPullRepository(state))

	const pullHandler = (e) => {
		e.preventDefault();
		dispatch(pullRepository(repositoryName))
		alert(answer.message)
	}

	return <>
		<button className="rep-action-btn" onClick={pullHandler}>pull</button>
	</>
}
