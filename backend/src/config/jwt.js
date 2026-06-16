const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const DEFAULT_SESSION_DAYS = process.env.SESSION_DAYS || '30';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || `${DEFAULT_SESSION_DAYS}d`;

function durationToMs(value, fallbackDays = 30) {
  if (!value) return fallbackDays * 24 * 60 * 60 * 1000;

  const match = String(value).trim().match(/^(\d+)([dhm])?$/i);
  if (!match) return fallbackDays * 24 * 60 * 60 * 1000;

  const amount = Number.parseInt(match[1], 10);
  const unit = (match[2] || 'd').toLowerCase();

  if (unit === 'm') return amount * 60 * 1000;
  if (unit === 'h') return amount * 60 * 60 * 1000;
  return amount * 24 * 60 * 60 * 1000;
}

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
  return new Date(Date.now() + durationToMs(REFRESH_EXPIRES_IN, Number.parseInt(DEFAULT_SESSION_DAYS, 10) || 30));
}

module.exports = {
  REFRESH_EXPIRES_IN,
  durationToMs,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiration,
};
