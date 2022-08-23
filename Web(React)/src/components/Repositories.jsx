import {useEffect, useRef, useState} from "react";
import {deleteRepository, getRepos, postClone} from "../api/requests";
import {Preloader} from "./Preloader";
import {RepositoryList} from "./RepositoryList";
import {Header} from "./Header";

export function Repositories() {
	const [repos, setRepos] = useState([]);
	const [repositoryURL, setRepositoryURL] = useState('');

	useEffect(() => {
		getRepos().then(data => setRepos(data.repos))
	}, []);


	const handleClone = () => {
		postClone(repositoryURL)
			.then(response => {
				setRepositoryURL('');
				getRepos().then(data => setRepos(data.repos))
			})
	}




	return <>
		<Header/>
		<div className="input-group mb-3 clone">
			<input type="text" className="form-control" placeholder="URL репозитория"
			        aria-describedby="button-addon2"
					value={repositoryURL}
                   onChange={(e) => {setRepositoryURL(e.target.value)}}
			/>
			<button onClick={handleClone} className="btn btn-outline-secondary" type="button" id="button-addon2">CLONE
			</button>
		</div>
		{!repos.length ? <Preloader/> : <RepositoryList repos={repos}/>}
	</>
}
