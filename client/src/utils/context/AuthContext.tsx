import React from "react";
import { User } from "../types.ts";

type AuthContextType = {
	user?: User;
	token: string;
	webSocket?: WebSocket;
	unreads: Map<string, number>;
	updateToken: (input: string) => void;
	updateAuthUser: (data: User) => void;
};
export const AuthContext = React.createContext<AuthContextType>({
	updateAuthUser: () => { },
	updateToken: () => { },
	token: "",
	unreads: new Map()
});
