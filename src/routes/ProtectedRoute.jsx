// Guarda de ruta: si el usuario no está autenticado lo redirige a /login.
// replace=true evita que /login quede en el historial, así el botón "atrás" no vuelve ahí.
// <Outlet /> renderiza la ruta hija que coincida (por ejemplo, Home → Feed).
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
