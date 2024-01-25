import React from "react";
import { OverlayStyle } from "../../utils/styles/index.tsx";
import CreateConversationForm from "../forms/CreateConversationForm.tsx";
import { ModalContainer, ModalContentBody, ModalHeader } from "./index.tsx";
import { MdClose } from "react-icons/md";

type Props = {
	setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateConversationModal: React.FC<Props> = ({ setShowModal }) => {
	const ref = React.createRef<HTMLDivElement>();

	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) =>
			e.key === "Escape" && setShowModal(false);

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const handleOverlayClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		const { current } = ref;
		if (current === e.target) {
			// console.log("Close Modal");
			setShowModal(false);
		}
	};

	return (
		<OverlayStyle ref={ref} onClick={handleOverlayClick}>
			<ModalContainer>
				<ModalHeader>
					<h1>Start a Conversation</h1>
					<MdClose size={32} onClick={() => setShowModal(false)} />
				</ModalHeader>
				<ModalContentBody>
					<CreateConversationForm />
				</ModalContentBody>
			</ModalContainer>
		</OverlayStyle>
	);
};

export default CreateConversationModal;
