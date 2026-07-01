import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "./Loader";

function ProtectedRoute({ children, redirectIfAuthenticated = false }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (redirectIfAuthenticated) {
        // Authenticated users shouldn't see Login/Register, send them to chat
        return user ? <Navigate to="/chat" replace /> : children;
    }

    // Unauthenticated users shouldn't see Chat/Profile, send them to login
    return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;