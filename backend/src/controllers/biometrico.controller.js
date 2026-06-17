const biometricoService = require('../services/biometrico.service');

function getEmpresaId(req) {
  return req.tenant.empresa_id;
}

async function listBiometricos(req, res, next) {
  try {
    const list = await biometricoService.listBiometricos(getEmpresaId(req));
    return res.json({ ok: true, data: list });
  } catch (error) {
    return next(error);
  }
}

async function getBiometrico(req, res, next) {
  try {
    const biometrico = await biometricoService.findBiometricoById(getEmpresaId(req), req.params.id);
    if (!biometrico) {
      return res.status(404).json({ ok: false, message: 'Dispositivo biométrico no encontrado' });
    }
    return res.json({ ok: true, data: biometrico });
  } catch (error) {
    return next(error);
  }
}

async function updateBiometrico(req, res, next) {
  try {
    const updated = await biometricoService.updateBiometrico(getEmpresaId(req), req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ ok: false, message: 'Dispositivo biométrico no encontrado para actualizar' });
    }
    return res.json({ ok: true, data: updated });
  } catch (error) {
    return next(error);
  }
}

async function deleteBiometrico(req, res, next) {
  try {
    const deleted = await biometricoService.deleteBiometrico(getEmpresaId(req), req.params.id);
    if (!deleted) {
      return res.status(404).json({ ok: false, message: 'Dispositivo biométrico no encontrado para eliminar' });
    }
    return res.json({ ok: true, message: 'Dispositivo biométrico eliminado exitosamente' });
  } catch (error) {
    return next(error);
  }
}

async function getResumen(req, res, next) {
  try {
    const resumen = await biometricoService.getAsistenciaBiometricaResumen(getEmpresaId(req));
    return res.json({ ok: true, data: resumen });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBiometricos,
  getBiometrico,
  updateBiometrico,
  deleteBiometrico,
  getResumen
};
