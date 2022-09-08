import React from "react";
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {Home} from "./components/Home";
import 'react-toastify/dist/ReactToastify.css'
import {Login} from "./features/auth/Login";
import {NotFound} from "./components/NotFound";
import {PrivateRoutes} from "./features/auth/PrivateRoute";


function App() {
	return (
		<>
			<Router>

				<div className="main-container">
					<Routes>
						<Route path='/' element={<Login/>}/>
						<Route element={<PrivateRoutes/>}>
							<Route exact path='/home' element={<Home/>}/>
						</Route>
						<Route path='*' element={<NotFound/>}/>
					</Routes>
				</div>

			</Router>
			<ToastContainer/>
		</>
	)
}

export default App;
