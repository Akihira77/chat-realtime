import React from "react";
import {
	Button,
	InputContainer,
	InputField,
	InputLabel,
} from "../../utils/styles/index.tsx";
import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserCredentialsParams } from "../../utils/types.ts";
import { postLoginUser } from "../../utils/api.ts";
import { AuthContext } from "../../utils/context/AuthContext.tsx";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const LoginForm = () => {
	const { register, handleSubmit } = useForm<UserCredentialsParams>();
	const navigate = useNavigate();
	const { updateToken } = React.useContext(AuthContext);

	const notify = (
		message: string,
		type: "error" | "success" | "default" | "info" | "warning"
	) => {
		return toast(message, {
			type,
			position: "top-right",
			autoClose: 2000,
			hideProgressBar: true,
			pauseOnHover: false,
			draggable: false,
			progress: undefined,
			theme: "dark",
		});
	};

	const onSubmit = async (input: UserCredentialsParams) => {
		try {
			const { data } = await postLoginUser(input);
			// document.cookie = `token=${data.token}; max-age=${60 * 60};`;
			// document.cookie = `userId=${data.token}; max-age=${60 * 60}`;
			// localStorage.setItem("token", data.token);
			updateToken(data.token);
			navigate("/conversations");
		} catch (error) {
			notify(
				(error as AxiosError<{ error: string }>).response!.data.error,
				"error"
			);
			console.log(error);
		}
	};

	return (
		<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
			<InputContainer>
				<InputLabel htmlFor="phone-number">Phone Number</InputLabel>
				<InputField
					id="phone-number"
					type="text"
					{...register("phoneNumber", {
						required: true,
					})}
				/>
			</InputContainer>
			<Button className={styles.button}>Login</Button>
			<div className={styles.footerText}>
				<span>Don't have an account? </span>
				<Link to="/register">Sign Up</Link>
			</div>
		</form>
	);
};

export default LoginForm;
