const { Router } = require('express');

const authRoutes = require('./auth.routes');
const healthRoutes = require('./health.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

module.exports = router;
