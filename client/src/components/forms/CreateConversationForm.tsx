import React from "react";
import {
	Button,
	InputContainer,
	InputField,
	InputLabel,
	TextField,
} from "../../utils/styles/index.tsx";
import styles from "./index.module.scss";

const CreateConversationForm = () => {
	return (
		<form className={styles.startConversationForm}>
			<section>
				<InputContainer $backgroundColor="#161616">
					<InputLabel>Recipient</InputLabel>
					<InputField />
				</InputContainer>
			</section>
			<section className={styles.message}>
				<InputContainer $backgroundColor="#161616">
					<InputLabel>Message (optional)</InputLabel>
					<TextField />
				</InputContainer>
			</section>
			<Button onClick={(e) => e.preventDefault()}>
				Create Conversation
			</Button>
		</form>
	);
};

export default CreateConversationForm;
