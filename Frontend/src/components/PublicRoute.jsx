import { useAuth } from "../features/Auth/hooks/useAuth";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  // If already logged in → prevent going to login/register
  if (user) {
    return <Navigate to="/" replace />;
  }

  // If not logged in → allow access
  return children;
};

export default PublicRoute;