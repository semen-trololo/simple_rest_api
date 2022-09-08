import {Preloader} from "./Preloader";
import {useRepositories} from "../features/get-repos/use-repositories";
import {CloneForm} from "../features/clone-repos/CloneForm";
import {Delete} from "../features/delete/Delete";
import {FaAngleLeft, FaRegFile, FaRegFolder} from "react-icons/fa";
import {Pull} from "../features/pull/Pull";


export function Repository() {

	const [{isError, isLoading, isSuccess}, paths, repos, folderHandler, parent] = useRepositories();

	return <>

		{isLoading && <Preloader/>}
		{isError && <h1>Ошибка запроса</h1>}
		{isSuccess &&
			<div className='rep-wrapper'>
				<CloneForm/>
				<div>
					<div className="rep-path-wrapper">
						<FaAngleLeft className="rep-back-icon" href={parent} onClick={folderHandler}/>
						<div className="rep-path-title">
							Текущий путь: {paths === '' ? '/' : paths}
						</div>
					</div>
					<ul className="rep-list">
						{repos.map(i => {
							if (i.dir) {
								return <li key={i.name}>
									<div id="folder" className="rep-list-item">
										<FaRegFolder  className="rep-list-folder-icon"
										             href={paths + '/' + i.name}
										             onClick={folderHandler}/>
										{i.name}
										{paths === '' ? <Pull key={repos.name} name={i.name}/> : null}
										{paths === '' ? <Delete key={repos.name} name={i.name}/> : null}
									</div>
								</li>
							} else {
								return <li id="file" className="rep-list-item" key={i.name}>
									<FaRegFile  className="rep-list-file-icon"/>
									{i.name}
								</li>
							}
						})}
					</ul>
				</div>
			</div>
		}
	</>
}
