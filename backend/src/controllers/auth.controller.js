const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: 'Email y password son requeridos',
      });
    }

    const result = await authService.login({ email, password });

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        ok: false,
        message: 'Refresh token requerido',
      });
    }

    const result = await authService.refresh(refreshToken);

    return res.json({
      ok: true,
      data: result,
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.revokeRefreshToken(refreshToken);
    }

    return res.json({
      ok: true,
      message: 'Sesion cerrada correctamente',
    });
  } catch (error) {
    return next(error);
  }
}

function me(req, res) {
  return res.json({
    ok: true,
    data: req.auth.user,
  });
}

module.exports = {
  login,
  refresh,
  logout,
  me,
};
