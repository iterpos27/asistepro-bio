import PageHeader from '../../components/common/PageHeader';
import PanelTitle from '../../components/common/PanelTitle';
import { EMPRESA_ID_KEY, getStoredUser } from '../../utils/auth';

export default function Settings() {
  const user = getStoredUser();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  return (
    <>
      <PageHeader title="Ajustes" description="Configuracion local del panel React/Vite." />
      <div className="panel">
        <PanelTitle title="Sesion" subtitle="Datos almacenados localmente" />
        <div className="settings-grid">
          <label>
            API URL
            <input readOnly value={apiUrl} />
          </label>
          <label>
            Usuario
            <input readOnly value={user?.email || ''} />
          </label>
          <label>
            Empresa seleccionada
            <input
              defaultValue={localStorage.getItem(EMPRESA_ID_KEY) || ''}
              onBlur={(event) => localStorage.setItem(EMPRESA_ID_KEY, event.target.value)}
              placeholder="Necesario para SUPER_ADMIN en rutas tenant"
            />
          </label>
        </div>
      </div>
    </>
  );
}
