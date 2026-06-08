import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { clearSession } from '../services/api';

export default function DashboardLayout({ user, children }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function logout() {
    clearSession();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <Sidebar open={open} onNavigate={() => setOpen(false)} />
      <div className="content-area">
        <Topbar user={user} onOpenMenu={() => setOpen(true)} onLogout={logout} />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
