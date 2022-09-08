import {useCloneForm} from "./use-clone";
import {useEffect} from "react";
import {getAllRepositories} from "../get-repos/repo-slice";
import {postCloneResponse} from "./clone-slice";

export function CloneForm() {
	const [{isLoading, isSuccess, isError}, cloneHandler, repositoryURL, setRepositoryURL] = useCloneForm()


	return <>
		<div className="clone-wrapper">
			<input className="clone-input" type="url" placeholder="URL репозитория" value={repositoryURL} onChange={(e) => {setRepositoryURL(e.target.value)}}/>
			<button className="clone-btn"onClick={cloneHandler}>Clone</button>
		</div>
	</>
}
