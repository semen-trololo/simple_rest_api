import {FaSignInAlt} from "react-icons/fa"
import {useLogin} from "./use-login";

export function Login() {

	const [onSubmit, onChange, user, password] = useLogin();

	return <>
		<div className="login-wrapper">
			<section className="login-title">
				<p>ВХОД</p>
			</section>
				<form onSubmit={onSubmit} className="login-form">
					<div>
						<input
							type="text"
							className="login-form-control"
							id="user"
							name="user"
							value={user}
							placeholder="Введите логин"
							onChange={onChange}
						/>
					</div>
					<div>
						<input
							type="text"
							className="login-form-control"
							id="password"
							name="password"
							value={password}
							placeholder="Введите пароль"
							onChange={onChange}
						/>
					</div>
					<button type="submit" className="login-btn">
						<FaSignInAlt/>
						ВОЙТИ</button>
				</form>
		</div>
	</>
}
