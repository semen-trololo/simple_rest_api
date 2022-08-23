import {deleteRepository, getRepos} from "../api/requests";

export function RepositoryItem(props) {

	const {name, files} = props;

	const handleDelete = () => {
		deleteRepository(props.name);
	}

	return <>
		<ol className="list-group bg-secondary mb-2">
			<li className="list-group-item d-flex justify-content-between align-items-start bg-gradient">
				<div className="ms-3 me-auto">
					<div className="fw-bold"> {name}</div>
				({files.length}): {files}
				</div>
				<button onClick={handleDelete}>x</button>
			</li>
		</ol>
	</>
}
