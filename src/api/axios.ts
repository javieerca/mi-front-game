import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = useAuthStore.getState().refreshToken;

            if (refreshToken) {
                try {
                    const response = await axios.post("/api/users/refresh-token", { token: refreshToken });
                    const { token: newToken, refreshToken: newRefreshToken, user } = response.data;

                    useAuthStore.getState().setAuth(newToken, newRefreshToken, user);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    useAuthStore.getState().clearAuth();
                    // Optional: Redirect to login or let the app handle auth state change
                    return Promise.reject(refreshError);
                }
            } else {
                useAuthStore.getState().clearAuth();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
