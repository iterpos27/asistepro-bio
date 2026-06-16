import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/common/ToastProvider';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';

function AppContent() {
  const auth = useAuth();

  return <AppRoutes auth={auth} />;
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
