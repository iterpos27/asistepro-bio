const { verifyAccessToken } = require('../config/jwt');
const { findUserById, sanitizeUser } = require('../services/auth.service');

function getBearerToken(req) {
  const authorization = req.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice(7);
}

async function authGuard(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'Token requerido',
      });
    }

    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.usuario_id);

    if (!user || user.estado !== 'activo') {
      return res.status(401).json({
        ok: false,
        message: 'Usuario no autorizado',
      });
    }

    req.auth = {
      usuario_id: user.id,
      empresa_id: user.empresa_id,
      rol: user.rol_codigo,
      user: sanitizeUser(user),
    };

    return next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token invalido o expirado',
    });
  }
}

function roleGuard(allowedRoles) {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.rol)) {
      return res.status(403).json({
        ok: false,
        message: 'Permisos insuficientes',
      });
    }

    return next();
  };
}

module.exports = {
  authGuard,
  roleGuard,
};
