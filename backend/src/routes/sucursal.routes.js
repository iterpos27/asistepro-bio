const { Router } = require('express');

const sucursalController = require('../controllers/sucursal.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/', sucursalController.listSucursales);
router.post('/', sucursalController.createSucursal);
router.get('/:id', sucursalController.getSucursal);
router.put('/:id', sucursalController.updateSucursal);
router.delete('/:id', sucursalController.deleteSucursal);
router.get('/:id/qr', sucursalController.getQr);
router.post('/:id/qr/rotate', sucursalController.rotateQr);

module.exports = router;
