// Guarda inversa: si el usuario YA está autenticado, redirige al feed.
// Evita que alguien con sesión activa pueda volver a /login o /register.
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
