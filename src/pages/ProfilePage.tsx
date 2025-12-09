import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { updateProfile } from "@/api/auth.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
    const { user, updateUser } = useAuthStore();
    const [name, setName] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");

    const mutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (data) => {
            updateUser(data.user);
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update profile");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ username: name, email });
    };

    if (!user) {
        return <div className="text-center py-10">Please login to view your profile.</div>;
    }

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
