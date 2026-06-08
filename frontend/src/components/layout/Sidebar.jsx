import { Link, useLocation } from 'react-router-dom';
import { ScanFace } from 'lucide-react';
import { navItems } from '../../config/navigation';

export default function Sidebar({ open, onNavigate, user }) {
  const location = useLocation();
  const visibleItems = navItems.filter((item) => !item.roles?.length || item.roles.includes(user?.rol));

  return (
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="sidebar-brand">
        <ScanFace size={22} />
        <div>
          <strong>AsistePro</strong>
          <span>Attendance OS</span>
        </div>
      </div>
      <nav>
        {visibleItems.map((item) => {
          const active = location.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} className={active ? 'nav-link active' : 'nav-link'} to={item.href} onClick={onNavigate}>
              <Icon size={18} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
