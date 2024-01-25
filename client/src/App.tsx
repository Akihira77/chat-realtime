import { Route, Routes } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ConversationPage from "./pages/ConversationPage.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import { AuthContext } from "./utils/context/AuthContext.tsx";
import { User } from "./utils/types.ts";
import React from "react";
import { ToastContainer } from "react-toastify";

const cookieValue = document.cookie
	.split("; ")
	.find((row) => row.startsWith("token="))
	?.split("=")[1];

function App() {
	const [user, setUser] = React.useState<User>();
	const [token, setToken] = React.useState<string>(cookieValue ?? "");
	const wsClient = React.useRef<WebSocket>();

	// console.log(token);
	React.useEffect(() => {
		if (!wsClient.current) {
			wsClient.current = new WebSocket(
				`ws://localhost:7001/api/conversations`
			);
		}
	}, [token]);

	return (
		<AuthContext.Provider
			value={{
				user,
				updateAuthUser: setUser,
				token,
				updateToken: setToken,
				webSocket: wsClient.current,
				unreads: new Map()
			}}
		>
			<Routes>
				<Route index element={<div>Hai</div>} />
				<Route path="/register" element={<RegisterPage />}></Route>
				<Route path="/login" element={<LoginPage />}></Route>
				<Route
					path="conversations"
					element={
						<AuthenticatedRoute>
							<ConversationPage />
						</AuthenticatedRoute>
					}
				>
					{/* <Route
						path=":id"
						element={<ConversationChannelPage />}
					></Route> */}
				</Route>
			</Routes>
			<ToastContainer />
		</AuthContext.Provider>
	);
}

export default App;
