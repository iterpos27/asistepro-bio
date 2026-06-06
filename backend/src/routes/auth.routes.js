const { Router } = require('express');

const authController = require('../controllers/auth.controller');
const { authGuard } = require('../middlewares/auth.middleware');

const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authGuard, authController.me);

module.exports = router;
