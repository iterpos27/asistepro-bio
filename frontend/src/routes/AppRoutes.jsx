import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import EmpleadosList from '../pages/empleados/EmpleadosList';
import EmpresasList from '../pages/empresas/EmpresasList';
import Facturas from '../pages/facturacion/Facturas';
import HorariosList from '../pages/horarios/HorariosList';
import HistorialMarcaciones from '../pages/marcaciones/HistorialMarcaciones';
import Reportes from '../pages/reportes/Reportes';
import Settings from '../pages/settings/Settings';
import SucursalesList from '../pages/sucursales/SucursalesList';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes({ auth }) {
  return (
    <Routes>
      <Route path="/" element={auth.isAuthenticated ? <Navigate to="/admin" replace /> : <Login onLogin={auth.setUser} />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute auth={auth}>
            <DashboardLayout user={auth.user}>
              <Routes>
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/empresas" element={<EmpresasList />} />
                <Route path="/sucursales" element={<SucursalesList />} />
                <Route path="/empleados" element={<EmpleadosList />} />
                <Route path="/horarios" element={<HorariosList />} />
                <Route path="/marcaciones" element={<HistorialMarcaciones />} />
                <Route path="/facturacion" element={<Facturas />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
