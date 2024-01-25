export type SenderMessageType = {
	id: number;
	isRead: boolean;
};

export type User = {
	id: string;
	fullName: string;
	phoneNumber: string;
	messages: number;
};

export type MessageType = {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	message: Buffer;
	senderId: string;
};

export type ConversationType = {
	id: number;
	recipient: User;
	messages: MessageType[];
};

export type CreateUserParams = {
	phoneNumber: string;
	fullName: string;
};

export type UserCredentialsParams = {
	phoneNumber: string;
};

export type Contact = {
	user: User;
	unread: number;
};

export type UpdateReadMessageFlag = {
	senderId: string;
	receiverId: string;
};
