import React from "react";
import { ConversationChannelPageStyle } from "../utils/styles/index.tsx";
import { AuthContext } from "../utils/context/AuthContext.tsx";
import {
	getConversationByUserToId,
	updateReadMessageFlag
} from "../utils/api.ts";
import { Contact, MessageType, User } from "../utils/types.ts";
import { RandomizeAvatar } from "../__mocks__/avatars.ts";
import {
	compressText,
	convertBufferToString,
	convertTextToBuffer,
	decompressText
} from "../utils/libs/compress-data.ts";

type Chat = {
	chatId: number;
	sender: string;
	message: Buffer;
};

type Props = {
	id: string;
	setId: React.Dispatch<React.SetStateAction<string | undefined>>;
	onNotificationFrom: (authorId: string) => void;
	contacts: Contact[];
	setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
};

const ConversationChannelPage: React.FC<Props> = ({
	id,
	setId,
	onNotificationFrom,
	contacts,
	setContacts
}) => {
	// const { id } = useParams();
	const { user, webSocket, unreads } = React.useContext(AuthContext);
	const [recipient, setRecipient] = React.useState<User>();
	const [chat, setChat] = React.useState<Chat[] | null>(null);
	const [text, setText] = React.useState("");
	const [avatar, setAvatar] = React.useState(RandomizeAvatar());
	const messagesContainerRef = React.useRef<HTMLDivElement | null>(null);

	// console.log(id);
	React.useEffect(() => {
		const getConversation = async () => {
			// read all message from this user
			const who = contacts.find((contact) => contact.user.id === id);

			if (who) {
				await updateReadMessageFlag({
					senderId: who.user.id,
					receiverId: id
				});
				const others = contacts.filter(
					(contact) => contact.user.id !== who.user.id
				);
				unreads.set(id, 0);
				setContacts([{ user: who.user, unread: 0 }, ...others]);
			}

			const { data } = await getConversationByUserToId(id!);
			const messages: Chat[] = await Promise.all(
				data.conversations.map(async (chat: MessageType) => {
					return {
						chatId: chat.id,
						sender: chat.senderId,
						message: await decompressText(chat.message)
					};
				})
			);

			setRecipient(data.recipient);
			setChat(messages);
		};

		const payload = {
			type: "START",
			sender: user?.id,
			receiver: id,
			content: ""
		};
		webSocket?.send(JSON.stringify(payload));

		getConversation();
		setAvatar(RandomizeAvatar());
	}, [id]);

	async function submitChat(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!webSocket) {
			return;
		}

		const message = JSON.stringify({
			type: "SENDING-CHAT",
			sender: user?.id,
			receiver: id!,
			content: text
		});
		webSocket.send(message);

		const prevChat = chat ?? [];
		const index =
			prevChat.length === 0
				? 1
				: prevChat[prevChat.length - 1].chatId + 1;
		// console.log(prevChat);
		setChat([
			...prevChat,
			{
				chatId: index,
				message: convertTextToBuffer(text),
				sender: user!.id
			}
		]);

		scrollToBottom();
	}

	if (webSocket) {
		webSocket.onmessage = async (ev: MessageEvent) => {
			try {
				const data = JSON.parse(ev.data.toString());

				if (data.type === "RECEIVE-CHAT") {
					const prevChat = chat ?? [];
					setChat([
						...prevChat,
						{
							chatId: data.messageId,
							message: await decompressText(data.content),
							sender: data.sender.id
						}
					]);
					scrollToBottom();
				} else if (data.type === "NOTIFICATION") {
					console.log(data, user);
					if (data.receiverId === user?.id) {
						onNotificationFrom(data.senderId);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
	}

	// Fungsi untuk melakukan scroll ke bawah
	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	document.addEventListener("keydown", (event: KeyboardEvent) => {
		if (event.key === "Escape") {
			setId(undefined);
		}
	});

	window.addEventListener("beforeunload", () => {
		clientDisconnect();
	});

	const clientDisconnect = () => {
		webSocket?.close();
	};

	const autoExpandTextarea = (event: any) => {
		const textarea = event.target;
		textarea.style.height = "auto";
		textarea.style.height = `${textarea.scrollHeight}px`;

		// Ambil elemen form dan atur tingginya
		const form = textarea.closest("form");
		if (form) {
			form.style.height = `${textarea.scrollHeight + 20}px`; // Tambahkan padding jika diperlukan
		}
	};

	return (
		<ConversationChannelPageStyle>
			<div className="row heading">
				<div className="col-sm-1 heading-avatar">
					<div className="heading-avatar-icon">
						<img src={avatar.src} alt={avatar.alt} />
					</div>
				</div>
				<div className="col-sm-10 heading-name">
					<p className="heading-name-meta">{recipient?.fullName}</p>
					<span className="heading-online">Online</span>
				</div>
				<div className="col-sm-1 heading-dot pull-right">
					<i
						className="fa fa-ellipsis-v fa-2x  pull-right"
						aria-hidden="true"
					></i>
				</div>
			</div>

			<div
				className="row message flex-nowrap py-2"
				id="conversation"
				ref={messagesContainerRef}
			>
				{chat &&
					chat.map(({ chatId, message, sender }) => (
						<div
							key={chatId}
							className={`${
								sender !== id
									? "d-flex justify-content-end"
									: ""
							} message-body`}
						>
							<div className="message-main-receiver">
								<div className="receiver">
									<div className="message-text">
										{convertBufferToString(message)}
									</div>
								</div>
							</div>
						</div>
					))}
			</div>

			<form
				className="d-flex justify-content-around reply"
				onSubmit={(e) => submitChat(e)}
			>
				<button className="reply-emojis" type="button">
					<i className="fa fa-smile-o fa-xl"></i>
				</button>
				<div className="col-sm-10 reply-main">
					<textarea
						id="comment"
						tabIndex={0}
						rows={1}
						placeholder=""
						maxLength={1000}
						className="form-control"
						onChange={(e) => setText(e.target.value)}
						onInput={autoExpandTextarea}
					></textarea>
				</div>
				<button className="reply-recording" type="button">
					<i
						className="fa fa-microphone fa-xl"
						aria-hidden="true"
					></i>
				</button>
				<button className="reply-send" type="submit">
					<i className="fa fa-send fa-xl" aria-hidden="true"></i>
				</button>
			</form>
		</ConversationChannelPageStyle>
	);
};

export default ConversationChannelPage;
