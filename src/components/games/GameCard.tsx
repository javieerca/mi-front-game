import type { Game } from "../../types";
import { Link } from "react-router-dom";
import { Calendar, Monitor, Tag } from "lucide-react";

import { getImageUrl } from "@/lib/utils";

interface GameCardProps {
    game: Game;
}

export function GameCard({ game }: GameCardProps) {
    // Normalize data (cast to any to handle inconsistent API schema)
    const g = game as any;
    const title = g.title || g.name || "Untitled Game";
    const imagePath = g.imageUrl || g.image || g.cover;
    const platforms = g.platform || g.platforms || [];
    const genres = g.genre || g.genres || [];
    const date = g.releaseDate || g.released;

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all">
            <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                    src={getImageUrl(imagePath)}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image"; // Fallback
                    }}
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                    ${g.price}
                </div>
            </div>

            <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>

                <p className="text-sm text-muted-foreground line-clamp-2">{g.description}</p>

                <div className="mt-auto pt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{date && !isNaN(new Date(date).getTime()) ? new Date(date).getFullYear() : "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Monitor className="w-3 h-3" />
                        <span>{Array.isArray(platforms) ? platforms.join(", ") : "Unknown Platform"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{Array.isArray(genres) ? genres.join(", ") : "Unknown Genre"}</span>
                    </div>
                </div>
            </div>

            <Link to={`/games/${g._id}`} className="absolute inset-0 z-10">
                <span className="sr-only">View game</span>
            </Link>
        </div>
    );
}
