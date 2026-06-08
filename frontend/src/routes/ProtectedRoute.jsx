import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ auth, allowedRoles, children }) {
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles?.length && auth.user?.rol && !allowedRoles.includes(auth.user.rol)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
