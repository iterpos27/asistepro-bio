const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function signAccessToken(user) {
  return jwt.sign(
    {
      usuario_id: user.id,
      empresa_id: user.empresa_id,
      rol: user.rol_codigo,
    },
    ACCESS_SECRET,
    {
      subject: user.id,
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      usuario_id: user.id,
      token_type: 'refresh',
      jti: crypto.randomUUID(),
    },
    REFRESH_SECRET,
    {
      subject: user.id,
      expiresIn: REFRESH_EXPIRES_IN,
    },
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

function getRefreshExpiration() {
  const days = Number.parseInt(REFRESH_EXPIRES_IN, 10);
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + (Number.isNaN(days) ? 7 : days));
  return expiresAt;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiration,
};
