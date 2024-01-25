import React from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { getAuthUser } from "../api.ts";

export function useAuth() {
	const [loading, setLoading] = React.useState(true);
	const { user, updateAuthUser } = React.useContext(AuthContext);
	const controller = new AbortController();

	React.useEffect(() => {
		getAuthUser()
			.then(({ data }) => {
				updateAuthUser(data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});

		return () => {
			controller.abort();
		};
	}, []);

	return { user, loading };
}
