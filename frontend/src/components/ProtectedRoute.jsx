import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// roles is optional, e.g. roles={["admin"]}. The server still checks roles too.
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-8 text-slate-500">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
