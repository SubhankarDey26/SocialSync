import { useAuth } from "../features/Auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for getMe to finish before deciding
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading…</span>
      </div>
    );
  }

  // If user NOT logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → allow access
  return children;
};

export default ProtectedRoute;