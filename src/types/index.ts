export interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    avatarUrl?: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    refreshToken: string;
    user: User;
}

export interface Game {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    platform: string[];
    genre: string[];
    releaseDate: string;
    price: number;
}

export interface CollectionItem {
    _id: string;
    game: Game;
    status: "pending" | "playing" | "completed" | "abandoned";
    rating?: number;
    addedAt: string;
}

export interface PaginatedResponse<T> {
    games: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
