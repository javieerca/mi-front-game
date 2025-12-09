import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicGames } from "../api/games.api";
import { GameCard } from "../components/games/GameCard";
import { Input } from "../components/ui/input";
import { Loader2, Search } from "lucide-react";

export default function HomePage() {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // Simple debounce effect
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        // Debounce logic could be here, but for now we'll just update on blur or use a timeout if needed.
        // For simplicity in this step, let's just trigger on Enter or wait for user to stop typing.
        // Actually, let's just use a timeout here to update the query trigger.
    };

    // Use a timer to debounce the actual query update
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, isLoading, error } = useQuery({
        queryKey: ["publicGames", debouncedSearch],
        queryFn: () => getPublicGames(debouncedSearch),
    });

    console.log("HomePage Render - Search:", debouncedSearch, "Data:", data, "Error:", error);

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Featured Games</h1>
                    <p className="text-muted-foreground text-lg">
                        Explore our collection of the hottest titles right now.
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input placeholder="Search games..." className="pl-9" value={search} onChange={handleSearch} />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">Failed to load games. Please try again later.</div>
            ) : (
                <>
                    {data?.games?.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            No games found matching "{debouncedSearch}"
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {data?.games?.map((game) => (
                                <GameCard key={game._id} game={game} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
