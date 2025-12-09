import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGameById } from "../api/games.api";
import { addToCollection } from "../api/collection.api";
import { useAuthStore } from "../store/auth.store";
import { Button } from "../components/ui/button";
import { Loader2, Plus, Calendar, Monitor, Tag } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "../lib/utils";

export default function GameDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    const {
        data: game,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["game", id],
        queryFn: () => getGameById(id!),
        enabled: !!id,
    });

    const addMutation = useMutation({
        mutationFn: () => addToCollection(game!._id, "playing"),
        onSuccess: () => {
            toast.success("Game added to collection");
            navigate("/collection");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to add game");
        },
    });

    if (isLoading)
        return (
            <div className="flex justify-center p-10">
                <Loader2 className="animate-spin" />
            </div>
        );
    if (error || !game) return <div className="text-center p-10">Game not found</div>;

    // Normalize data (cast to any to handle inconsistent API schema)
    const g = game as any;
    const title = g.title || g.name || "Untitled Game";
    const imagePath = g.imageUrl || g.image || g.cover;
    const platforms = g.platform || g.platforms || [];
    const genres = g.genre || g.genres || [];
    const date = g.releaseDate || g.released;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img
                    src={getImageUrl(imagePath)}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/800x400";
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                    <div className="flex gap-4 text-white/80">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />{" "}
                            {date && !isNaN(new Date(date).getTime()) ? new Date(date).getFullYear() : "TBA"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Tag className="w-4 h-4" /> {Array.isArray(genres) ? genres.join(", ") : "Unknown"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold">About</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">{g.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                            <span className="text-sm text-muted-foreground block mb-1">Platforms</span>
                            <div className="font-medium flex items-center gap-2">
                                <Monitor className="w-4 h-4" />{" "}
                                {Array.isArray(platforms) ? platforms.join(", ") : "Unknown"}
                            </div>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <span className="text-sm text-muted-foreground block mb-1">Price</span>
                            <div className="font-medium text-green-500">${g.price}</div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-card p-6 rounded-xl border sticky top-24">
                        <h3 className="font-bold mb-4 text-xl">Actions</h3>
                        {user ? (
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => addMutation.mutate()}
                                disabled={addMutation.isPending}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                {addMutation.isPending ? "Adding..." : "Add to Collection"}
                            </Button>
                        ) : (
                            <Button className="w-full" variant="secondary" onClick={() => navigate("/login")}>
                                Login to Add
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
