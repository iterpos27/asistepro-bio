import { api } from './api';

export async function listBiometricos() {
  const response = await api.get('/biometricos');
  return response.data.data;
}

export async function getBiometricoResumen() {
  const response = await api.get('/biometricos/resumen');
  return response.data.data;
}

export async function updateBiometrico(id, payload) {
  const response = await api.put(`/biometricos/${id}`, payload);
  return response.data.data;
}

export async function deleteBiometrico(id) {
  const response = await api.delete(`/biometricos/${id}`);
  return response.data.data;
}

export async function listMarcacionesBiometricas(params = {}) {
  const response = await api.get('/marcaciones-biometricas', {
    params: {
      procesado: params.procesado || undefined,
      serial: params.serial || undefined,
      empleado_codigo: params.empleado_codigo || undefined,
      fecha_desde: params.fecha_desde || undefined,
      fecha_hasta: params.fecha_hasta || undefined,
      limit: params.limit || 50,
      offset: params.offset || 0
    }
  });
  return response.data.data;
}

export async function procesarMarcacionBiometrica(id) {
  const response = await api.post(`/marcaciones-biometricas/${id}/procesar`);
  return response.data.data;
}

export async function procesarMarcacionesPendientes() {
  const response = await api.post('/marcaciones-biometricas/procesar-pendientes');
  return response.data.data;
}
