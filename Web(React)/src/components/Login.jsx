import {postLogin} from "../api/requests";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../context/AuthProvider";
import {Repositories} from "./Repositories";
import {Form} from "react-bootstrap";
import {Button} from "react-bootstrap";

export function Login() {
	const {setAuth} = useContext(AuthContext);
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState('');
	const [password, setPassword] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('')
	}, [user, password]);

	useEffect(() => {
		setSuccess(JSON.parse(window.localStorage.getItem('state')))
	}, []);

	useEffect(() => {
		window.localStorage.setItem('state', success)
	}, [success]);



	const handleSubmit = async (e) => {
		e.preventDefault();
		postLogin(user, password)
			.then(response => {
				localStorage.setItem('token', response.access_token);
				setAuth({user, password});
				setUser('');
				setPassword('');
				setSuccess(true);
			})
			.catch((Error) => setErrMsg(Error))
	}

	return <>
		{success
			? (<section>
				<Repositories/>
			</section>)
			: (<section>
				<Form onSubmit={handleSubmit} className='text-center text-bg-light bg-gradient w-50 position-absolute top-50 start-50 translate-middle shadow p-3 mb-5 bg-body rounded'>
					<h1>Вход</h1>
					<Form.Group className='mb-3'>
						<Form.Label htmlFor="username">Логин</Form.Label>
						<Form.Control className='login-input'
						       type="text"
						       id="username"
						       ref={userRef}
						       autoComplete="off"
						       onChange={(e) => setUser(e.target.value)}
						       value={user}
						       required
						/>
					</Form.Group>
					<Form.Group className='mb-3'>
						<Form.Label className='login-label' htmlFor="password">Пароль</Form.Label>
						<Form.Control className='login-input'
						       type="text"
						       id="password"
						       onChange={(e) => setPassword(e.target.value)}
						       value={password}
						       required
						/>
					</Form.Group>
						<Button className='w-25' variant='outline-warning' onClick={handleSubmit}>Войти</Button>
						<p ref={errRef}
						   className={errMsg ? "text-danger p-3" : "offscreen"}
						   aria-live="assertive">{errMsg}</p>
				</Form>
			</section>)
		}
	</>
}
