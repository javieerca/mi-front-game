import api from "./axios";
import type { CollectionItem } from "../types";

export const getCollection = async () => {
    const response = await api.get<any>("/collection");
    // Normalize response: swagger says it returns { items: [...] }
    return response.data.items || response.data || [];
};

export const addToCollection = async (gameId: string, status: string = "playing") => {
    const response = await api.post("/collection/add", { gameId, status });
    return response.data;
};

export const removeFromCollection = async (id: string) => {
    const response = await api.delete(`/collection/${id}`);
    return response.data;
};

export const updateCollectionItem = async (id: string, data: Partial<CollectionItem>) => {
    const response = await api.put(`/collection/${id}`, data);
    return response.data;
};
