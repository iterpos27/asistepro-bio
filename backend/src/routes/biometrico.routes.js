const { Router } = require('express');
const biometricoController = require('../controllers/biometrico.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/', biometricoController.listBiometricos);
router.get('/resumen', biometricoController.getResumen);
router.get('/:id', biometricoController.getBiometrico);
router.put('/:id', biometricoController.updateBiometrico);
router.delete('/:id', biometricoController.deleteBiometrico);

module.exports = router;
