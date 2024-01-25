import React from "react";
import RegisterForm from "../components/forms/RegisterForm.tsx";
import { Page } from "../utils/styles/index.tsx";

const RegisterPage = () => {
	return (
		<Page $display="flex" $justifyContent="center" $alignItems="center">
			<h2 style={{ marginBottom: "3rem" }}>Register</h2>
			<RegisterForm />
		</Page>
	);
};

export default RegisterPage;
