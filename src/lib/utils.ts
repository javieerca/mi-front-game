import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | undefined): string {
    if (!path) return "https://placehold.co/600x400?text=No+Image";
    if (path.startsWith("http")) return path;
    return `http://localhost:3500/${path.replace(/^\//, "")}`; // Ensure no double slash
}
