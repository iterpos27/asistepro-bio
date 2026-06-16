const usuarioService = require('../services/usuario.service');

async function listPermisos(req, res, next) {
  try {
    const result = await usuarioService.listUsuariosPermisos({
      empresaId: req.tenant.empresa_id,
      actorRole: req.auth.rol,
    });

    return res.json({ ok: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function updatePermisos(req, res, next) {
  try {
    const result = await usuarioService.updateUsuarioPermisos({
      empresaId: req.tenant.empresa_id,
      actorRole: req.auth.rol,
      usuarioId: req.params.id,
      modulos: req.body.modulos || {},
    });

    return res.json({ ok: true, data: result });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listPermisos,
  updatePermisos,
};
