import axios, { AxiosRequestConfig } from "axios";
import {
	CreateUserParams,
	UpdateReadMessageFlag,
	User,
	UserCredentialsParams
} from "./types.ts";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
const config: AxiosRequestConfig = {
	withCredentials: true
};

export const postRegisterUser = (data: CreateUserParams) => {
	return axios.post(`${API_URL}/users/auth/register`, data, config);
};

export const postLoginUser = (data: UserCredentialsParams) => {
	return axios.post(`${API_URL}/users/auth/login`, data, config);
};

export const getAuthUser = () => {
	return axios.get<User>(`${API_URL}/users/auth/status`, config);
};

export const getUserConversations = () => {
	return axios.get(`${API_URL}/conversations/get-my-conversations`, config);
};

export const getAllContacts = () => {
	return axios.get(`${API_URL}/users`, config);
};

export const getConversationByUserToId = (userToId: string) => {
	return axios.get(`${API_URL}/conversations/${userToId}`, config);
};

export const updateReadMessageFlag = (data: UpdateReadMessageFlag) => {
	return axios.put(`${API_URL}/conversations/update-reads`, data, config);
};
