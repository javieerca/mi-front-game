import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import { Gamepad2, LogOut, User } from "lucide-react";
import { toast } from "sonner";

export default function Layout() {
    const { user, clearAuth } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <Gamepad2 className="w-6 h-6" />
                        <span>GameManager</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                            Browse Games
                        </Link>
                        {user && (
                            <Link to="/collection" className="text-sm font-medium hover:text-primary transition-colors">
                                My Collection
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span>{user.username}</span>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button size="sm">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t py-6 bg-card">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Game Manager. Built with React & Vite.
                </div>
            </footer>
        </div>
    );
}
