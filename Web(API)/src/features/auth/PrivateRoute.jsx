import {Navigate, Outlet} from "react-router-dom";
import {useSelector} from "react-redux";

export const PrivateRoutes = () => {
	const {token} = useSelector((state) => state.auth);

	return (
		token ? <Outlet/> : <Navigate to='/'/>
	)
}
