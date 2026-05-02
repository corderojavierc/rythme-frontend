import { Navigate, Outlet } from "react-router-dom";
import { useVerified } from "../auth/VerifiedProvider";

export default function ProtectedRoute() {
  const { isVerified } = useVerified();

  if (!isVerified) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
