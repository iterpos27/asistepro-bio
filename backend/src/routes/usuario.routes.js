const { Router } = require('express');

const usuarioController = require('../controllers/usuario.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/permisos', usuarioController.listPermisos);
router.put('/:id/permisos', usuarioController.updatePermisos);

module.exports = router;
