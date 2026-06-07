const { Router } = require('express');

const horarioController = require('../controllers/horario.controller');
const { authGuard, roleGuard } = require('../middlewares/auth.middleware');
const { tenantGuard, subscriptionGuard } = require('../middlewares/tenant.middleware');

const router = Router();

router.use(authGuard);
router.use(roleGuard(['SUPER_ADMIN', 'ADMIN_EMPRESA', 'RRHH']));
router.use(tenantGuard);
router.use(subscriptionGuard);

router.get('/asignaciones', horarioController.listAsignaciones);
router.post('/asignaciones', horarioController.assignHorario);
router.delete('/asignaciones/:id', horarioController.deleteAsignacion);

router.get('/', horarioController.listHorarios);
router.post('/', horarioController.createHorario);
router.get('/:id', horarioController.getHorario);
router.put('/:id', horarioController.updateHorario);
router.delete('/:id', horarioController.deleteHorario);

module.exports = router;
