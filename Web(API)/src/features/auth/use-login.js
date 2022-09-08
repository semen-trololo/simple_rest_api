import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {login, reset} from "./auth-slice";

export const useLogin = () => {

	const [formData, setFormData] = useState({
		user: '',
		password: '',
	});

	const {user, password} = formData;

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const {token, isError, isSuccess, message} = useSelector((state) => state.auth);

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}))
	}

	useEffect(() => {
		if (isError) {
			toast.error(message)
		}
		if (isSuccess || token) {
			navigate('/home')
		}
		dispatch(reset)
	}, [token, isError, isSuccess, message, navigate, dispatch]);

	const onSubmit = (e) => {
		e.preventDefault();
		const userData = {
			user,
			password
		}
		dispatch(login(userData))
	}
	return [onSubmit, onChange, user, password]
}
