function notFoundHandler(req, res) {
  res.status(404).json({
    ok: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl,
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    message: error.message || 'Error interno del servidor',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
