import { useEffect, useState } from 'react';
import { Cpu, Edit, RefreshCw, Trash2, Search, CheckCircle, XCircle, Play, Layers } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import PanelTitle from '../../components/common/PanelTitle';
import ActionDialog from '../../components/common/ActionDialog';
import * as biometricoService from '../../services/biometricoService';
import * as sucursalService from '../../services/sucursalService';
import { toast } from '../../services/toastService';

export default function BiometricosDashboard() {
  const [activeTab, setActiveTab] = useState('devices'); // 'devices' | 'logs'
  const [devices, setDevices] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [sucursales, setSucursales] = useState([]);
  
  // States for Logs tab
  const [logs, setLogs] = useState([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [logFilter, setLogFilter] = useState({
    procesado: '',
    serial: '',
    empleado_codigo: '',
    fecha_desde: '',
    fecha_hasta: '',
    limit: 20,
    offset: 0
  });

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ nombre: '', sucursal_id: '' });
  const [pendingDelete, setPendingDelete] = useState(null);

  // Load baseline statistics and devices
  async function loadResumenAndDevices() {
    setLoading(true);
    try {
      const devList = await biometricoService.listBiometricos();
      setDevices(devList || []);
      
      const resData = await biometricoService.getBiometricoResumen();
      setResumen(resData);

      const sucData = await sucursalService.listSucursales({ limit: 100 });
      setSucursales(sucData.items || []);
    } catch (err) {
      console.error(err);
      toast.error('No se pudo cargar la información de biométricos.');
    } finally {
      setLoading(false);
    }
  }

  // Load raw sync logs
  async function loadSyncLogs() {
    setLoading(true);
    try {
      const data = await biometricoService.listMarcacionesBiometricas(logFilter);
      setLogs(data.items || []);
      setTotalLogs(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error('No se pudieron cargar los registros de sincronización.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumenAndDevices();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      loadSyncLogs();
    }
  }, [activeTab, logFilter.procesado, logFilter.serial, logFilter.offset]);

  // Handle manual log processing
  async function handleProcesarMarcacion(id) {
    try {
      const result = await biometricoService.procesarMarcacionBiometrica(id);
      toast.success(result.message || 'Marcación procesada correctamente.');
      loadSyncLogs();
      loadResumenAndDevices();
    } catch (err) {
      console.error(err);
    }
  }

  // Handle processing all pending
  async function handleProcesarPendientes() {
    setSyncing(true);
    try {
      const result = await biometricoService.procesarMarcacionesPendientes();
      toast.success(`Procesamiento finalizado. Exitosos: ${result.data.exitosos}, Fallidos: ${result.data.fallidos}`);
      if (activeTab === 'logs') {
        loadSyncLogs();
      }
      loadResumenAndDevices();
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  }

  // Edit device modal
  function openEditModal(device) {
    setSelectedDevice(device);
    setEditForm({
      nombre: device.nombre,
      sucursal_id: device.sucursal_id || ''
    });
    setShowEditModal(true);
  }

  async function handleSaveDevice(e) {
    e.preventDefault();
    try {
      await biometricoService.updateBiometrico(selectedDevice.id, editForm);
      toast.success('Dispositivo biométrico actualizado.');
      setShowEditModal(false);
      loadResumenAndDevices();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteDevice() {
    try {
      await biometricoService.deleteBiometrico(pendingDelete.id);
      toast.success('Dispositivo eliminado correctamente.');
      setPendingDelete(null);
      loadResumenAndDevices();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container-fluid page-content">
      <PageHeader
        title="Gestión de Biométricos"
        subtitle="Monitoreo y sincronización de terminales ZKTeco (G1 y MB10-VL) vía ADMS"
      />

      {/* Summary Cards */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card-stat">
            <div className="card-stat-icon info">
              <Cpu size={24} />
            </div>
            <div className="card-stat-info">
              <span className="card-stat-label">Total Dispositivos</span>
              <span className="card-stat-value">{resumen.dispositivos?.total || 0}</span>
            </div>
          </div>
          
          <div className="card-stat">
            <div className="card-stat-icon success">
              <CheckCircle size={24} />
            </div>
            <div className="card-stat-info">
              <span className="card-stat-label">Dispositivos Online</span>
              <span className="card-stat-value">{resumen.dispositivos?.online || 0}</span>
            </div>
          </div>

          <div className="card-stat">
            <div className="card-stat-icon warning">
              <Layers size={24} />
            </div>
            <div className="card-stat-info">
              <span className="card-stat-label">Logs Recibidos (24h)</span>
              <span className="card-stat-value">{resumen.stats_24h?.total_recibido || 0}</span>
            </div>
          </div>

          <div className="card-stat">
            <div className="card-stat-icon danger">
              <XCircle size={24} />
            </div>
            <div className="card-stat-info">
              <span className="card-stat-label">Errores Sync (24h)</span>
              <span className="card-stat-value">{resumen.stats_24h?.con_error || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="tab-container flex gap-2">
          <button
            className={`btn-tab ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            Dispositivos
          </button>
          <button
            className={`btn-tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            Registros de Sincronización
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            className="btn btn-secondary flex items-center gap-1"
            onClick={loadResumenAndDevices}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
          <button
            className="btn btn-primary flex items-center gap-1"
            onClick={handleProcesarPendientes}
            disabled={syncing}
          >
            <Play size={16} className={syncing ? 'animate-pulse' : ''} />
            Procesar Pendientes
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="card bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        {activeTab === 'devices' ? (
          <div>
            <PanelTitle title="Terminales Registradas" />
            <div className="overflow-x-auto mt-4">
              <table className="table-standard w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold">
                    <th className="p-3">Nombre / Descripción</th>
                    <th className="p-3">Número de Serie</th>
                    <th className="p-3">Modelo</th>
                    <th className="p-3">Sucursal Asignada</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Último Sync</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-500">
                        No se han detectado dispositivos biométricos en el sistema.
                      </td>
                    </tr>
                  ) : (
                    devices.map((dev) => (
                      <tr key={dev.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                        <td className="p-3 font-medium text-gray-800">{dev.nombre}</td>
                        <td className="p-3 font-mono text-gray-600">{dev.serial}</td>
                        <td className="p-3 text-gray-600">{dev.modelo || 'N/A'}</td>
                        <td className="p-3">
                          {dev.sucursal_nombre ? (
                            <span className="text-gray-800 font-medium">{dev.sucursal_nombre}</span>
                          ) : (
                            <span className="text-red-500 italic text-xs">Sin sucursal asignada</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`status-pill ${dev.estado === 'online' ? '' : 'danger'}`}>
                            {dev.estado === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600">
                          {dev.ultimo_sync ? new Date(dev.ultimo_sync).toLocaleString() : 'Nunca'}
                        </td>
                        <td className="p-3 text-right flex justify-end gap-2">
                          <button
                            className="btn btn-icon"
                            onClick={() => openEditModal(dev)}
                            title="Editar Configuración"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-icon danger"
                            onClick={() => setPendingDelete(dev)}
                            title="Eliminar Dispositivo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <PanelTitle title="Historial de Marcaciones Crudas (ADMS)" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filtrar por Estado:</span>
                <select
                  className="input-select py-1 px-3 text-sm"
                  value={logFilter.procesado}
                  onChange={(e) => setLogFilter({ ...logFilter, procesado: e.target.value, offset: 0 })}
                >
                  <option value="">Todos</option>
                  <option value="true">Procesados</option>
                  <option value="false">Pendientes/Error</option>
                </select>
              </div>
            </div>

            {/* Filter Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código Empleado (PIN)"
                  className="input-text py-1 px-3 text-sm w-full"
                  value={logFilter.empleado_codigo}
                  onChange={(e) => setLogFilter({ ...logFilter, empleado_codigo: e.target.value })}
                />
                <button className="btn btn-secondary btn-sm" onClick={loadSyncLogs}>
                  <Search size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="table-standard w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm font-semibold">
                    <th className="p-3">Biométrico (Serial)</th>
                    <th className="p-3">Cod. Empleado (PIN)</th>
                    <th className="p-3">Nombre Empleado</th>
                    <th className="p-3">Fecha y Hora</th>
                    <th className="p-3">Dirección</th>
                    <th className="p-3">Estado Procesado</th>
                    <th className="p-3">Detalle/Error</th>
                    <th className="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-gray-500">
                        No se encontraron registros de sincronización.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
                        <td className="p-3 font-mono text-xs text-gray-600">
                          {log.biometrico_nombre || log.biometrico_serial}
                        </td>
                        <td className="p-3 font-semibold text-gray-800">{log.empleado_codigo}</td>
                        <td className="p-3">
                          {log.empleado_nombres ? (
                            `${log.empleado_nombres} ${log.empleado_apellidos || ''}`
                          ) : (
                            <span className="text-yellow-600 text-xs italic">No emparejado</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-600">
                          {new Date(log.fecha_hora).toLocaleString()}
                        </td>
                        <td className="p-3 text-xs">
                          <span className={`status-pill ${log.estado === '0' || log.estado === 'entrada' ? 'success' : 'info'}`}>
                            {log.estado === '0' || log.estado === 'entrada' ? 'Entrada' : 'Salida'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`status-pill ${log.procesado ? 'success' : 'danger'}`}>
                            {log.procesado ? 'Procesado' : 'Pendiente/Error'}
                          </span>
                        </td>
                        <td className="p-3 text-xs max-w-xs truncate" title={log.error_procesamiento}>
                          {log.procesado ? (
                            <span className="text-green-600">Marcación #{log.marcacion_id?.slice(0, 8)}...</span>
                          ) : (
                            <span className="text-red-500 italic">{log.error_procesamiento || 'Pendiente de procesar'}</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!log.procesado && (
                            <button
                              className="btn btn-secondary btn-sm flex items-center gap-1"
                              onClick={() => handleProcesarMarcacion(log.id)}
                              title="Procesar manualmente"
                            >
                              <Play size={12} />
                              Procesar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalLogs > logFilter.limit && (
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-600">
                  Mostrando {logFilter.offset + 1} - {Math.min(logFilter.offset + logFilter.limit, totalLogs)} de {totalLogs}
                </span>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={logFilter.offset === 0}
                    onClick={() => setLogFilter({ ...logFilter, offset: Math.max(0, logFilter.offset - logFilter.limit) })}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={logFilter.offset + logFilter.limit >= totalLogs}
                    onClick={() => setLogFilter({ ...logFilter, offset: logFilter.offset + logFilter.limit })}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-md bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <PanelTitle title={`Editar Biométrico: ${selectedDevice?.serial}`} />
            <form onSubmit={handleSaveDevice} className="mt-4 flex flex-col gap-4">
              <div>
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Nombre Descriptivo</label>
                <input
                  type="text"
                  required
                  className="input-text w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium text-gray-700 mb-1">Sucursal Asignada</label>
                <select
                  required
                  className="input-select w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editForm.sucursal_id}
                  onChange={(e) => setEditForm({ ...editForm, sucursal_id: e.target.value })}
                >
                  <option value="">Seleccione una Sucursal...</option>
                  {sucursales.map((suc) => (
                    <option key={suc.id} value={suc.id}>
                      {suc.nombre} ({suc.codigo})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Las marcaciones recibidas por este biométrico se registrarán automáticamente en esta sucursal.
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {pendingDelete && (
        <ActionDialog
          title="Eliminar Dispositivo"
          message={`¿Está seguro de que desea eliminar el dispositivo biométrico "${pendingDelete.nombre}" (Serial: ${pendingDelete.serial})? Esta acción no eliminará las marcaciones ya registradas.`}
          onConfirm={handleDeleteDevice}
          onCancel={() => setPendingDelete(null)}
          confirmText="Eliminar"
          cancelText="Cancelar"
          isDanger
        />
      )}
    </div>
  );
}
