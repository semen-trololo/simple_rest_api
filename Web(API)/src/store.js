import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./features/auth/auth-slice";
import {repositoriesReducer} from "./features/get-repos/repo-slice";
import {cloneReducer} from "./features/clone-repos/clone-slice";
import {deleteReducer} from "./features/delete/delele-slice";
import {pullReducer} from "./features/pull/pull-slice";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		repositories: repositoriesReducer,
		clone: cloneReducer,
		delete: deleteReducer,
		pull: pullReducer
	}
})

