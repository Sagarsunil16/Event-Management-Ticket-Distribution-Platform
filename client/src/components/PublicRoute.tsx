import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { token, role } = useContext(AuthContext);

  if (token) {
    if (role === "organizer") return <Navigate to="/organizer/dashboard" replace />;
    if (role === "attendee") return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
