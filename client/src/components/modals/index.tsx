import React from "react";
import {
	ModalContainerStyle,
	ModalContentBodyStyle,
	ModalHeaderStyle,
} from "../../utils/styles/index.tsx";

export const ModalHeader: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return <ModalHeaderStyle>{children}</ModalHeaderStyle>;
};

export const ModalContentBody: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return <ModalContentBodyStyle>{children}</ModalContentBodyStyle>;
};

export const ModalContainer: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	return <ModalContainerStyle>{children}</ModalContainerStyle>;
};
