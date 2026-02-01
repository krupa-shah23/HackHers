import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    // Check if user exists (or robust check for token)
    // Since useAuth loads user from token on mount, 'user' is the truth.
    // However, if token exists but user fetch fails, AuthProvider clears it.
    // So !user is sufficient.
    
    // Double check localStorage for immediate feedback if AuthContext is slow
    const token = localStorage.getItem('token');

    // If no user and no token, definitely redirect
    if (!user && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
