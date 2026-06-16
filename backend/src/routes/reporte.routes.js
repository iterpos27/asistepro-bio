const { Router } = require('express');

const reporteController = require('../controllers/reporte.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard, featureGuard } = require('../middlewares/tenant.middleware');
const { validateSchema } = require('../middlewares/validation.middleware');
const {
  asistenciaDiariaSchema,
  asistenciaMensualSchema,
  atrasosSchema,
  entradasSalidasSchema,
  exportAsistenciaDiariaSchema,
  exportAtrasosSchema,
  exportEntradasSalidasSchema,
  exportNovedadesSchema,
  novedadesSchema,
} = require('../validators/reporte.validator');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/asistencia-diaria', validateSchema(asistenciaDiariaSchema), reporteController.asistenciaDiaria);
router.get('/asistencia-mensual', validateSchema(asistenciaMensualSchema), reporteController.asistenciaMensual);
router.get('/entradas-salidas', validateSchema(entradasSalidasSchema), reporteController.entradasSalidas);
router.get('/novedades', validateSchema(novedadesSchema), reporteController.novedades);
router.get('/atrasos', validateSchema(atrasosSchema), reporteController.atrasos);
router.get(
  '/export/asistencia-diaria.csv',
  featureGuard('reportes_avanzados'),
  validateSchema(exportAsistenciaDiariaSchema),
  reporteController.exportarAsistenciaDiaria,
);
router.get(
  '/export/entradas-salidas.xls',
  featureGuard('reportes_avanzados'),
  validateSchema(exportEntradasSalidasSchema),
  reporteController.exportarEntradasSalidasExcel,
);
router.get(
  '/export/novedades.csv',
  featureGuard('reportes_avanzados'),
  validateSchema(exportNovedadesSchema),
  reporteController.exportarNovedades,
);
router.get(
  '/export/atrasos.csv',
  featureGuard('reportes_avanzados'),
  validateSchema(exportAtrasosSchema),
  reporteController.exportarAtrasos,
);

module.exports = router;
