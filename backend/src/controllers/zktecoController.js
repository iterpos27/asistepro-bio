const zktecoService = require('../services/zktecoService');
const biometricoAsistenciaService = require('../services/biometricoAsistenciaService');

/**
 * Endpoint de prueba básico
 * GET /iclock/test
 */
async function test(req, res, next) {
  try {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK');
  } catch (error) {
    return next(error);
  }
}

/**
 * Handshake inicial / GET Options
 * GET /iclock/cdata
 */
async function getInitOptions(req, res, next) {
  try {
    const { SN } = req.query;
    if (!SN) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('ERROR: SN required');
    }

    const responseText = await zktecoService.getDeviceInitOptions(SN);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(responseText);
  } catch (error) {
    console.error('Error in getInitOptions:', error);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('ERROR');
  }
}

/**
 * Recepción de datos (Marcaciones ATTLOG, Logs de operación OPERLOG, etc.)
 * POST /iclock/cdata
 */
async function receiveCdata(req, res, next) {
  try {
    const { SN, table } = req.query;
    const rawBody = req.body;

    if (!SN) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('ERROR: SN required');
    }

    if (table === 'ATTLOG') {
      // Procesar lote de marcaciones recibidas
      const result = await zktecoService.processAttlog(SN, rawBody);
      
      // Gatillar inmediatamente el procesamiento para convertir marcaciones_biometricas a marcaciones reales
      // Lo corremos de forma asíncrona para no bloquear la respuesta al biométrico
      biometricoAsistenciaService.procesarMarcacionesPendientes()
        .then((resumen) => {
          if (resumen.total_leidos > 0) {
            console.log(`[ZKTeco Job] Marcaciones procesadas tras sync: Exitosas: ${resumen.exitosos}, Fallidas: ${resumen.fallidos}`);
          }
        })
        .catch((err) => {
          console.error('[ZKTeco Job] Error al procesar marcaciones pendientes en background:', err);
        });

      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send('OK');
    } else {
      // Otras tablas como OPERLOG
      await zktecoService.logZktecoEvent(SN, `table_${table || 'unknown'}`, rawBody);
      res.setHeader('Content-Type', 'text/plain');
      return res.status(200).send('OK');
    }
  } catch (error) {
    console.error('Error in receiveCdata:', error);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('ERROR');
  }
}

/**
 * Heartbeat / Dispositivo solicita comandos pendientes
 * GET /iclock/getrequest
 */
async function getRequests(req, res, next) {
  try {
    const { SN } = req.query;
    if (!SN) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('ERROR: SN required');
    }

    // Por el momento, el servidor no envía comandos dinámicos a los dispositivos
    // Retornamos OK para mantener la conexión activa / heartbeat
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error in getRequests:', error);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('ERROR');
  }
}

/**
 * Recepción del resultado de comandos ejecutados en el dispositivo
 * POST /iclock/devicecmd
 */
async function postDeviceCmd(req, res, next) {
  try {
    const { SN } = req.query;
    const rawBody = req.body;

    if (!SN) {
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('ERROR: SN required');
    }

    await zktecoService.logZktecoEvent(SN, 'device_cmd_response', rawBody);
    
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send('OK');
  } catch (error) {
    console.error('Error in postDeviceCmd:', error);
    res.setHeader('Content-Type', 'text/plain');
    return res.status(500).send('ERROR');
  }
}

module.exports = {
  test,
  getInitOptions,
  receiveCdata,
  getRequests,
  postDeviceCmd
};
