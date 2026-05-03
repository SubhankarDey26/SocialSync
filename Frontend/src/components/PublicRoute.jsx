import { useAuth } from "../features/Auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
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

  // If already logged in → prevent going to login/register
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not logged in → allow access
  return children;
};

export default PublicRoute;