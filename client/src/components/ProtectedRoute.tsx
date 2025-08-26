import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  role?: "attendee" | "organizer"; 
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { token, role: userRole } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
