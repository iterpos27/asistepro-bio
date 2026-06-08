import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ auth, children }) {
  if (!auth.isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
