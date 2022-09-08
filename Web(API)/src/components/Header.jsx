import {FaRegFolderOpen, FaSignOutAlt, FaUserTimes} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector, useDispatch} from "react-redux";
import {logout, reset} from "../features/auth/auth-slice";

export function Header() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {token} = useSelector((state) => state.auth);

	const onLogout = () => {
		dispatch(logout())
		dispatch(reset())
		navigate('/')
	}

	return <>
		<header className="header">
			<Link className="header-icon" to='/'>
				<FaRegFolderOpen/>
			</Link>
			<label className="header-title">
				Список репозиториев
			</label>
			<button className="header-logout-btn" onClick={onLogout}>
					<FaSignOutAlt/>
					ВЫХОД
			</button>
		</header>
	</>
}
