import api from "./axios";
import type { Game, PaginatedResponse } from "../types";

export interface GetGamesParams {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
}

export const getPublicGames = async (search?: string) => {
    if (search) {
        const response = await api.get<any>("/games/search", { params: { q: search } });
        // Normalize response to match PaginatedResponse structure expected by HomePage
        return {
            games: response.data.results || [],
            totalDocs: response.data.results?.length || 0,
            limit: 0,
            page: 1,
            totalPages: 1,
            hasNextPage: false,
            hasPrevPage: false,
        } as PaginatedResponse<Game>;
    }
    const response = await api.get<PaginatedResponse<Game>>("/public/games");
    return response.data;
};

export const getGames = async (params: GetGamesParams) => {
    const response = await api.get<PaginatedResponse<Game>>("/games", { params });
    return response.data;
};

export const getGameById = async (id: string) => {
    const response = await api.get<Game>(`/games/${id}`);
    return response.data;
};
