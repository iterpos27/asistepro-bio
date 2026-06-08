import { LogOut, Menu, Search } from 'lucide-react';

export default function Topbar({ user, onOpenMenu, onLogout }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-only" onClick={onOpenMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <div className="topbar-title">
        <strong>AsistePro</strong>
        <span>{user?.email || 'Sesion activa'}</span>
      </div>
      <div className="search-box">
        <Search size={16} />
        <input placeholder="Buscar empleados, sucursales..." />
      </div>
      <button className="outline-button" onClick={onLogout}>
        <LogOut size={16} />
        Salir
      </button>
    </header>
  );
}
