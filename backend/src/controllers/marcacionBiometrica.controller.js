const zktecoService = require('../services/zktecoService');
const biometricoAsistenciaService = require('../services/biometricoAsistenciaService');
const { parsePagination } = require('../utils/pagination.util');

function getEmpresaId(req) {
  return req.tenant.empresa_id;
}

async function listMarcaciones(req, res, next) {
  try {
    const { limit, offset } = parsePagination(req.query);
    const filters = {
      procesado: req.query.procesado,
      serial: req.query.serial,
      empleadoCodigo: req.query.empleado_codigo,
      fechaDesde: req.query.fecha_desde,
      fechaHasta: req.query.fecha_hasta,
      limit,
      offset
    };
    
    const result = await zktecoService.listMarcacionesBiometricas(getEmpresaId(req), filters);
    return res.json({ ok: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function getMarcacion(req, res, next) {
  try {
    const log = await zktecoService.findMarcacionBiometricaById(getEmpresaId(req), req.params.id);
    if (!log) {
      return res.status(404).json({ ok: false, message: 'Marcación biométrica no encontrada' });
    }
    return res.json({ ok: true, data: log });
  } catch (error) {
    return next(error);
  }
}

async function procesarMarcacion(req, res, next) {
  try {
    // Verificar pertenencia primero
    const log = await zktecoService.findMarcacionBiometricaById(getEmpresaId(req), req.params.id);
    if (!log) {
      return res.status(404).json({ ok: false, message: 'Marcación biométrica no encontrada' });
    }

    const result = await biometricoAsistenciaService.procesarMarcacionBiometrica(req.params.id);
    if (!result.ok) {
      return res.status(400).json({ ok: false, message: result.error || 'Error de procesamiento' });
    }

    return res.json({ ok: true, message: 'Marcación biométrica procesada exitosamente', marcacionId: result.marcacionId });
  } catch (error) {
    return next(error);
  }
}

async function procesarPendientes(req, res, next) {
  try {
    // Procesar todos los pendientes de la empresa
    const result = await biometricoAsistenciaService.procesarMarcacionesPendientes();
    return res.json({ ok: true, data: result });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listMarcaciones,
  getMarcacion,
  procesarMarcacion,
  procesarPendientes
};
