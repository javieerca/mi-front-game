import api from "./axios";
import type { AuthResponse, User } from "../types";

export const login = async (data: { email: string; password: string }) => {
    const response = await api.post<AuthResponse>("/users/login", data);
    return response.data;
};

export const register = async (data: { username: string; email: string; password: string }) => {
    const response = await api.post<{ user: User }>("/users/register", data);
    return response.data;
};

export const updateProfile = async (data: Partial<User>) => {
    const response = await api.put<{ user: User }>("/users/profile", data);
    return response.data;
};
