export interface UserDTO {
    id: string;
    fullName: string;
    phoneNumber: string;
    messages?: number;
    lastOnline: Date;
}

export interface UserMessagesDTO extends UserDTO {
    messageForMe: Record<string, string | number | boolean | Date | null>[];
}
