const { Router } = require('express');
const express = require('express');
const zktecoController = require('../controllers/zktecoController');

const router = Router();

// ZKTeco envía cuerpos en formato de texto plano con cabeceras no estándar.
// Este middleware captura todo tipo de request body como string/texto plano.
router.use(express.text({ type: '*/*', limit: '10mb' }));

router.get('/test', zktecoController.test);
router.get('/cdata', zktecoController.getInitOptions);
router.post('/cdata', zktecoController.receiveCdata);
router.get('/getrequest', zktecoController.getRequests);
router.post('/devicecmd', zktecoController.postDeviceCmd);

module.exports = router;
