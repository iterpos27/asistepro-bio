const { Router } = require('express');

const empresaController = require('../controllers/empresa.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');

const router = Router();

router.use(authGuard);

router.get('/me', roleGuard(['ADMIN_EMPRESA', 'RRHH', 'EMPLEADO']), empresaController.getMiEmpresa);
router.put('/me', roleGuard(['ADMIN_EMPRESA']), empresaController.updateMiEmpresa);

router.get('/', roleGuard(['SUPER_ADMIN']), empresaController.listEmpresas);
router.post('/', roleGuard(['SUPER_ADMIN']), empresaController.createEmpresa);
router.get('/:id', roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA']), empresaController.getEmpresa);
router.put('/:id', roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA']), empresaController.updateEmpresa);
router.delete('/:id', roleGuard(['SUPER_ADMIN']), empresaController.deleteEmpresa);

module.exports = router;
