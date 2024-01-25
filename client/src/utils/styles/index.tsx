import styled from "styled-components";
import { InputContainerProps, PageProps } from "./styleTypes.ts";

export const SIDEBAR_WIDTH = 320;
export const InputField = styled.input`
	&:-webkit-autofill,
	&:-webkit-autofill:hover,
	&:-webkit-autofill:focus,
	&:-webkit-autofill:active {
		background: #131313;
	}
	background: inherit;
	outline: none;
	border: none;
	color: #fff;
	font-family: "Inter";
	font-size: 18px;
	width: 100%;
	box-sizing: border-box;
	padding: 0;
	margin: 4px 0;
`;

export const InputContainer = styled.div<InputContainerProps>`
	background-color: ${(props) => props.$backgroundColor || "#131313;"};
	padding: 12px 16px;
	width: 100%;
	border-radius: 10px;
	box-sizing: border-box;
	::-webkit-scrollbar {
		display: none;
	}
`;

export const InputLabel = styled.label`
	display: block;
	color: #8f8f8f;
	font-size: 14px;
	margin: 4px 0;
`;

export const Button = styled.button`
	width: 100%;
	background-color: #2b09ff;
	outline: none;
	border: none;
	font-family: "Inter";
	color: #fff;
	font-size: 16px;
	border-radius: 10px;
	padding: 20px 0;
	font-weight: 500;
	transition: 250ms background-color ease;
	box-sizing: border-box;
	&:hover {
		cursor: pointer;
		background-color: #3415ff;
	}
	&:active {
		background-color: #3a1cff;
	}
`;

export const Page = styled.div<PageProps>`
	height: 100%;
	display: ${(props) => props.$display};
	background-color: #1a1a1a;
	justify-content: ${(props) => props.$justifyContent};
	align-items: ${(props) => props.$alignItems};
	flex-direction: column;
`;

export const ConversationSidebarStyle = styled.aside`
	position: absolute;
	top: 0;
	left: 0;
	background-color: #1a1a1a;
	width: ${SIDEBAR_WIDTH}px;
	height: 100%;
	border-right: 1px solid #5454543d;
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 10px;
		height: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #2d2d2d;
	}
`;

export const ConversationSidebarHeader = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	width: ${SIDEBAR_WIDTH}px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 24px;
	background-color: #151515;
	box-sizing: border-box;
	height: 75px;
	border-bottom: 1px solid #5454543d;

	.identity {
		display: flex;
		align-items: center;
		gap: 1rem;
		.heading-avatar {
			padding: 0;
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.heading-avatar-icon img {
			border-radius: 50%;
			height: 40px;
			width: 40px;
		}
	}

	& h3 {
		overflow: hidden;
		max-width: 120px;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-weight: 500;
		font-size: 16px;
	}
`;

export const ConversationChannelPageStyle = styled.div`
	height: 100%;
	margin-left: ${SIDEBAR_WIDTH}px;

	.message {
		margin: 0 !important;
		flex-direction: column;
		background-size: cover;
		overflow-y: auto;
		height: calc(100% - 23%);

		&::-webkit-scrollbar {
			width: 10px;
			height: 5px;
		}
		&::-webkit-scrollbar-thumb {
			background-color: #2d2d2d;
		}
	}

	.message-body {
		margin: 0 !important;
		padding: 0 !important;
		height: auto;
	}

	.message-main-receiver {
		padding: 10px 20px;
		max-width: 60%;
	}

	.message-main-sender {
		padding: 3px 20px !important;
		margin-left: 40% !important;
		max-width: 60%;
	}

	.message-text {
		margin: 0 !important;
		padding: 5px !important;
		word-wrap: break-word;
		font-weight: 200;
		font-size: 14px;
		padding-bottom: 0 !important;
		color: #fff;
	}

	.message-time {
		margin: 0 !important;
		margin-left: 50px !important;
		font-size: 12px;
		text-align: right;
		color: #000;
	}

	.receiver {
		width: auto !important;
		padding: 4px 10px 7px !important;
		border-radius: 10px 10px 10px 0;
		background: #131313;
		font-size: 12px;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		word-wrap: break-word;
		display: inline-block;
	}

	.sender {
		float: right;
		width: auto !important;
		background: #dcf8c6;
		border-radius: 10px 10px 0 10px;
		padding: 4px 10px 7px !important;
		font-size: 12px;
		text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
		display: inline-block;
		word-wrap: break-word;
	}

	/*Reply*/

	.reply {
		min-height: 70px;
		max-height: 200px;
		width: 79%;
		background-color: #131313;
		padding: 10px 5px 10px 5px !important;
		z-index: 1000;
		position: absolute;
		bottom: 4px;

		& > button {
			background-color: inherit;
			outline: none;
			border: none;
		}
	}

	.reply-emojis {
		padding: 5px !important;
	}

	.reply-emojis i {
		text-align: center;
		padding: 5px 5px 5px 5px !important;
		color: #93918f;
		cursor: pointer;
	}

	.reply-recording {
		padding: 5px !important;
	}

	.reply-recording i {
		text-align: center;
		padding: 5px !important;
		color: #93918f;
		cursor: pointer;
	}

	.reply-send {
		padding: 5px !important;
	}

	.reply-send i {
		text-align: center;
		padding: 5px !important;
		color: #93918f;
		cursor: pointer;
	}

	.reply-main {
		padding: 2px 5px !important;
		position: relative;

		> textarea {
			background-color: #1a1a1a;
			color: #fff;
			max-height: 170px;
			width: 100%;
			resize: none;
			overflow-y: auto;
			padding: 5px !important;
			outline: none;
			border: none;
			text-indent: 5px;
			box-shadow: none;
			font-size: 16px;
			position: absolute;
			bottom: 5px;
		}
	}

	.reply-main textarea:focus {
		outline: none;
		border: none;
		text-indent: 5px;
		box-shadow: none;
	}

	.avatar-icon img {
		border-radius: 50%;
		height: 49px;
		width: 49px;
	}

	.heading {
		padding: 10px 16px 10px 15px;
		margin: 0;
		height: 75px;
		width: 100%;
		color: #fff;
		background-color: #151515;
		z-index: 1000;
	}

	.heading-avatar {
		padding: 0;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.heading-avatar-icon img {
		border-radius: 50%;
		height: 40px;
		width: 40px;
	}

	.heading-name {
		padding: 0 !important;
		cursor: pointer;
	}

	.heading-name-meta {
		font-weight: 700;
		font-size: 100%;
		padding-bottom: 0;
		margin-bottom: 0;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #fff;
	}

	.heading-dot {
		padding: 0;
		display: flex;
		justify-content: end;
		align-items: center;
	}

	.heading-dot i {
		text-align: right;
		padding: 5px;
		color: #93918f;
		cursor: pointer;
	}
`;
// width: 100%;

export const ConversationSidebarContainer = styled.div`
	margin-top: 75px;
`;

export const ConversationSidebarItem = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 10px 20px;
	box-sizing: border-box;
	border-bottom: 1px solid #5454543d;
	background-color: #131313;
	&:hover {
		background-color: #202020;
		cursor: pointer;
	}
`;

export const OverlayStyle = styled.div`
	height: 100%;
	width: 100%;
	top: 0;
	background-color: #000000c4;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 99;
`;

export const ModalContainerStyle = styled.div`
	background-color: #121212;
	width: 500px;
	box-sizing: border-box;
	border-radius: 10px;
`;

export const ModalHeaderStyle = styled.header`
	width: 100%;
	text-align: center;
	box-sizing: border-box;
	padding: 8px 16px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 10px;
	& h1 {
		font-size: 18px;
		margin: 0;
	}
`;

export const ModalContentBodyStyle = styled.div`
	padding: 10px;
`;

export const TextField = styled.textarea`
	background: inherit;
	outline: none;
	border: none;
	color: #fff;
	font-family: "Inter";
	font-size: 18px;
	max-width: 100%;
	max-height: 250px;
	box-sizing: border-box;
	padding: 0;
	margin: 4px 0;
	resize: none;
`;
