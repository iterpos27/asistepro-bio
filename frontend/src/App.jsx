import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';

export default function App() {
  const auth = useAuth();

  return <AppRoutes auth={auth} />;
}
