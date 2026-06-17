const { Router } = require('express');
const marcacionBiometricaController = require('../controllers/marcacionBiometrica.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/', marcacionBiometricaController.listMarcaciones);
router.post('/procesar-pendientes', marcacionBiometricaController.procesarPendientes);
router.get('/:id', marcacionBiometricaController.getMarcacion);
router.post('/:id/procesar', marcacionBiometricaController.procesarMarcacion);

module.exports = router;
