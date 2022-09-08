import {toast} from "react-toastify";

export function Preloader() {
	return <>
	<div className="preloader-container">
		<div className="preloader">{`>>>>>LOADING<<<<<`}</div>
	</div>
	</>
}
