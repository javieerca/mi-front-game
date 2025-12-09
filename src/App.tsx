import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Layout from "./components/common/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CollectionPage from "./pages/CollectionPage";
import GameDetailsPage from "./pages/GameDetailsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <Routes>
                <Route element={<Layout />}>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/games/:id" element={<GameDetailsPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/collection" element={<CollectionPage />} />
                        {/* Add more protected routes here */}
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;
