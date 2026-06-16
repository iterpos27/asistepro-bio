import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '../../components/common/PageHeader';
import PanelTitle from '../../components/common/PanelTitle';
import { useAuthContext } from '../../context/AuthContext';
import EmpresaSelector from '../../components/layout/EmpresaSelector';
import { ROLES, getRoleLabel } from '../../utils/roles';
import * as authService from '../../services/authService';
import * as usuarioService from '../../services/usuarioService';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Contrasena actual requerida'),
    newPassword: z.string().min(8, 'Minimo 8 caracteres'),
    confirmPassword: z.string().min(8, 'Confirma la nueva contrasena'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
  });

export default function Settings() {
  const { user } = useAuthContext();
  const isSuperAdmin = user?.rol === ROLES.SUPER_ADMIN;
  const canManagePermissions = [ROLES.SUPER_ADMIN, ROLES.ADMIN_EMPRESA].includes(user?.rol);
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [permissionData, setPermissionData] = useState({ modules: [], items: [] });
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissionsStatus, setPermissionsStatus] = useState({ type: '', message: '' });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function submitPassword(values) {
    setPasswordStatus({ type: '', message: '' });
    try {
      const result = await authService.changePassword(values);
      reset();
      setPasswordStatus({
        type: 'success',
        message: result.message || 'Contrasena actualizada correctamente',
      });
    } catch (error) {
      setPasswordStatus({
        type: 'error',
        message: error.response?.data?.message || 'No se pudo actualizar la contrasena',
      });
    }
  }

  async function loadPermissions() {
    if (!canManagePermissions) return;

    setPermissionsLoading(true);
    setPermissionsStatus({ type: '', message: '' });

    try {
      setPermissionData(await usuarioService.listPermisosUsuarios());
    } catch (error) {
      setPermissionsStatus({
        type: 'error',
        message: error.response?.data?.message || 'No se pudieron cargar permisos de usuarios',
      });
    } finally {
      setPermissionsLoading(false);
    }
  }

  useEffect(() => {
    loadPermissions();
  }, [canManagePermissions]);

  async function toggleUserModule(targetUser, moduleKey) {
    const nextModules = {
      ...(targetUser.overrides || targetUser.modulos || {}),
      [moduleKey]: !(targetUser.modulos?.[moduleKey] === true),
    };

    setPermissionsStatus({ type: '', message: '' });
    setPermissionsLoading(true);

    try {
      setPermissionData(await usuarioService.updatePermisosUsuario(targetUser.id, nextModules));
      setPermissionsStatus({ type: 'success', message: 'Permisos actualizados correctamente' });
    } catch (error) {
      setPermissionsStatus({
        type: 'error',
        message: error.response?.data?.message || 'No se pudieron actualizar los permisos',
      });
    } finally {
      setPermissionsLoading(false);
    }
  }

  return (
    <>
      <PageHeader title="Ajustes" description="Informacion de tu cuenta y contexto de trabajo." />

      <div className="panel">
        <PanelTitle title="Perfil" subtitle="Datos de la sesion actual" />
        <div className="settings-grid">
          <label>
            Nombre
            <input readOnly value={user?.nombre ? `${user.nombre} ${user.apellido || ''}`.trim() : '-'} />
          </label>
          <label>
            Email
            <input readOnly value={user?.email || ''} />
          </label>
          <label>
            Rol
            <input readOnly value={getRoleLabel(user?.rol)} />
          </label>
          <label>
            Empresa
            <input readOnly value={user?.empresa || (isSuperAdmin ? 'Plataforma (sin tenant fijo)' : '-')} />
          </label>
        </div>
      </div>

      <div className="panel">
        <PanelTitle title="Seguridad" subtitle="Actualiza la contrasena de acceso a tu cuenta." />
        <form className="module-form" onSubmit={handleSubmit(submitPassword)}>
          <div className="form-grid">
            <label>
              Contrasena actual
              <input {...register('currentPassword')} type="password" autoComplete="current-password" />
              {errors.currentPassword && <small>{errors.currentPassword.message}</small>}
            </label>
            <label>
              Nueva contrasena
              <input {...register('newPassword')} type="password" autoComplete="new-password" />
              {errors.newPassword && <small>{errors.newPassword.message}</small>}
            </label>
            <label>
              Confirmar nueva contrasena
              <input {...register('confirmPassword')} type="password" autoComplete="new-password" />
              {errors.confirmPassword && <small>{errors.confirmPassword.message}</small>}
            </label>
          </div>
          {passwordStatus.message ? (
            <p className={passwordStatus.type === 'success' ? 'alert-success compact-alert' : 'alert-error compact-alert'}>
              {passwordStatus.message}
            </p>
          ) : null}
          <div className="form-actions">
            <button className="primary-button compact" disabled={isSubmitting}>
              {isSubmitting ? 'Actualizando...' : 'Cambiar contrasena'}
            </button>
          </div>
        </form>
      </div>

      {isSuperAdmin ? (
        <div className="panel">
          <PanelTitle
            title="Contexto de empresa"
            subtitle="Selecciona la empresa con la que operaras en modulos tenant."
          />
          <div className="settings-selector">
            <EmpresaSelector />
          </div>
          <p className="helper-text">
            El super admin necesita una empresa activa para consultar sucursales, empleados y marcaciones de un tenant.
          </p>
        </div>
      ) : null}

      {canManagePermissions ? (
        <div className="panel">
          <PanelTitle
            title="Permisos por usuario"
            subtitle={
              isSuperAdmin
                ? 'Habilita modulos para el administrador de la empresa seleccionada.'
                : 'Habilita modulos para recursos humanos y empleados.'
            }
          />
          {permissionsStatus.message ? (
            <p className={permissionsStatus.type === 'success' ? 'alert-success compact-alert' : 'alert-error compact-alert'}>
              {permissionsStatus.message}
            </p>
          ) : null}
          <div className="form-actions">
            <button className="outline-button" type="button" onClick={loadPermissions} disabled={permissionsLoading}>
              {permissionsLoading ? 'Cargando...' : 'Actualizar permisos'}
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Rol</th>
                  {permissionData.modules.map((module) => (
                    <th key={module.key}>{module.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissionData.items.length ? (
                  permissionData.items.map((targetUser) => (
                    <tr key={targetUser.id}>
                      <td>
                        <strong>{`${targetUser.nombre || ''} ${targetUser.apellido || ''}`.trim() || targetUser.email}</strong>
                        <span className="table-subtext">{targetUser.email}</span>
                      </td>
                      <td>{getRoleLabel(targetUser.rol)}</td>
                      {permissionData.modules.map((module) => {
                        const availableForRole = module.roles?.includes(targetUser.rol);
                        return (
                          <td key={module.key}>
                            {availableForRole ? (
                              <label className="switch-field compact-switch">
                                <input
                                  type="checkbox"
                                  checked={targetUser.modulos?.[module.key] === true}
                                  disabled={permissionsLoading}
                                  onChange={() => toggleUserModule(targetUser, module.key)}
                                />
                                <span>{targetUser.modulos?.[module.key] === true ? 'Activo' : 'Inactivo'}</span>
                              </label>
                            ) : (
                              <span className="status-pill muted">N/A</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={(permissionData.modules?.length || 0) + 2}>
                      {permissionsLoading ? 'Cargando permisos...' : 'No hay usuarios administrables para este contexto.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
