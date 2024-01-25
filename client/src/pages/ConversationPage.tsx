import React from "react";
import { Page } from "../utils/styles/index.tsx";
import ConversationSidebar from "../components/conversations/ConversationSidebar.tsx";
import { Outlet } from "react-router-dom";
import ConversationPanel from "../components/conversations/ConversationPanel.tsx";
import { getAllContacts } from "../utils/api.ts";
import { Contact, User } from "../utils/types.ts";
import { AuthContext } from "../utils/context/AuthContext.tsx";
import ConversationChannelPage from "./ConversationChannelPage.tsx";

const ConversationPage = () => {
	const [userId, setUserId] = React.useState<string>();
	const { user, webSocket, unreads } = React.useContext(AuthContext);
	const [contacts, setContacts] = React.useState<Contact[]>([]);

	React.useEffect(() => {
		async function showAllContacts() {
			const { data } = await getAllContacts();
			const users = data.users
				.filter((account: User) => account.id !== user?.id)
				.map(({ id, fullName, phoneNumber, messages }: User) => {
					console.log();
					unreads.set(id, messages);
					return {
						user: { id, fullName, phoneNumber },
						unread: messages
					};
				});

			setContacts(users);
		}

		showAllContacts();
	}, []);

	if (webSocket) {
		interface WebSocketResponse {
			type: string;
			authorId: string;
		}

		webSocket.onmessage = (ev: MessageEvent<WebSocketResponse>) => {
			const { type, receiverId, senderId } = JSON.parse(
				ev.data.toString()
			);
			if (type === "NOTIFICATION") {
				console.log(receiverId, user);
				if (receiverId === user?.id) {
					onNotificationFrom(senderId);
				}
			}
		};
	}

	const onNotificationFrom = (senderId: string) => {
		const from = contacts.find((contact) => contact.user.id === senderId);
		if (from) {
			const previousUnread = unreads.get(senderId) ?? 0;
			unreads.set(senderId, previousUnread + 1);

			const excludedFrom = contacts.filter(
				(contact) => contact.user.id !== from.user.id
			);

			setContacts([
				{ user: from.user, unread: unreads.get(senderId)! },
				...excludedFrom
			]);
		} else {
			console.log("Got a message");
		}
	};

	return (
		<Page>
			{/* App Bar */}
			{/* Side Bar */}
			<ConversationSidebar users={contacts} setUserId={setUserId} />
			{!userId && <ConversationPanel />}
			{userId && (
				<ConversationChannelPage
					id={userId}
					setId={setUserId}
					onNotificationFrom={onNotificationFrom}
					contacts={contacts}
					setContacts={setContacts}
				/>
			)}
			{/* Main/Channel Chat */}
			<Outlet />
			{/* Form Chat */}
		</Page>
	);
};

export default ConversationPage;
