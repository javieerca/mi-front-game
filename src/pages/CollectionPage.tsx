import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCollection, removeFromCollection } from "../api/collection.api";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

import { getImageUrl } from "../lib/utils";

export default function CollectionPage() {
    const queryClient = useQueryClient();
    const {
        data: collection,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["collection"],
        queryFn: getCollection,
    });

    // API returns array (normalized in api file) or we handle fallbacks
    const items = Array.isArray(collection) ? collection : collection?.items || collection?.docs || [];

    const removeMutation = useMutation({
        mutationFn: removeFromCollection,
        onSuccess: () => {
            toast.success("Removed from collection");
            queryClient.invalidateQueries({ queryKey: ["collection"] });
        },
        onError: () => {
            toast.error("Failed to remove game");
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Failed to load collection.</div>;
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2">Your collection is empty</h2>
                <p className="text-muted-foreground">Go to the catalog and add some games!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">My Collection</h1>
                <p className="text-muted-foreground text-lg">Manage your game library and track progress.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.map((item: any) => {
                    // Normalize game data inside collection item
                    const g = item.game || {};
                    const title = g.title || g.name || "Untitled Game";
                    const imagePath = g.imageUrl || g.image || g.cover;

                    return (
                        <div
                            key={item._id}
                            className="bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden"
                        >
                            <div className="aspect-video relative">
                                <img
                                    src={getImageUrl(imagePath)}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400";
                                    }}
                                />
                                <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded capitalize">
                                    {item.status}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg mb-1">{title}</h3>
                                <div className="mt-auto flex justify-between items-center pt-4">
                                    <span className="text-sm text-muted-foreground">
                                        Added: {new Date(item.addedAt).toLocaleDateString()}
                                    </span>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => removeMutation.mutate(item._id)}
                                        disabled={removeMutation.isPending}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
