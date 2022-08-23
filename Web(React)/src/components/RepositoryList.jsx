import {RepositoryItem} from "./RepositoryItem";


export function RepositoryList(props) {
	const {repos} = props;

	return <>
				{repos.map(repo => <RepositoryItem key={repo.name} {...repo}/>)}
		</>

}
