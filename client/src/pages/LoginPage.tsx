import React from "react";
import LoginForm from "../components/forms/LoginForm.tsx";
import { Page } from "../utils/styles/index.tsx";

const LoginPage = () => {
	return (
		<Page $display="flex" $justifyContent="center" $alignItems="center">
			<h2 style={{ marginBottom: "3rem" }}>Login</h2>
			<LoginForm />
		</Page>
	);
};

export default LoginPage;
