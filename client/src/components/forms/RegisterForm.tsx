import React from "react";
import {
	Button,
	InputContainer,
	InputField,
	InputLabel,
} from "../../utils/styles/index.tsx";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { postRegisterUser } from "../../utils/api.ts";
import { CreateUserParams } from "../../utils/types.ts";
import { toast } from "react-toastify";

const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateUserParams>();

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

	const onSubmit = async (data: CreateUserParams) => {
		try {
			await postRegisterUser(data);
			notify("Register Success", "success");
		} catch (error) {
			console.log(error);
		}
	};

	const displayErrors = () => {
		if (errors.fullName && errors.fullName.message) {
			notify(errors.fullName.message, "error");
		}

		if (errors.phoneNumber && errors.phoneNumber.message) {
			notify(errors.phoneNumber.message, "error");
		}
	};

	return (
		<>
			{Object.keys(errors).length !== 0 && displayErrors()}
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<InputContainer>
					<InputLabel htmlFor="username">Full Name</InputLabel>
					<InputField
						id="username"
						type="text"
						required
						{...register("fullName", {
							required: "Username is required",
						})}
					/>
				</InputContainer>
				<InputContainer>
					<InputLabel htmlFor="phone-number">Phone Number</InputLabel>
					<InputField
						id="phone-number"
						type="tel"
						required
						{...register("phoneNumber", {
							required: "Phone Number is required",
						})}
					/>
				</InputContainer>
				<Button className={styles.button}>Create My Account</Button>
				<div className={styles.footerText}>
					<span>Already have an account? </span>
					<Link to="/login">Login</Link>
				</div>
			</form>
		</>
	);
};

export default RegisterForm;
