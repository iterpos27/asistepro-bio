function getHealth(req, res) {
  res.json({
    ok: true,
    service: 'asistepro-api',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  getHealth,
};
