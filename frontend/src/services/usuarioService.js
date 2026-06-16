import { api } from './api';

export async function listPermisosUsuarios() {
  const response = await api.get('/usuarios/permisos');
  return response.data.data;
}

export async function updatePermisosUsuario(id, modulos) {
  const response = await api.put(`/usuarios/${id}/permisos`, { modulos });
  return response.data.data;
}
