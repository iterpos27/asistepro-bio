const { pool } = require('../config/database');

function parseTime(value) {
  if (typeof value !== 'string' || !/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return null;
  }

  return value.length === 5 ? `${value}:00` : value;
}

function normalizeDiasSemana(diasSemana) {
  if (!Array.isArray(diasSemana)) {
    return null;
  }

  return [...new Set(diasSemana.map((dia) => Number.parseInt(dia, 10)))].sort((a, b) => a - b);
}

function validateHorarioPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial || payload.nombre !== undefined) {
    if (!payload.nombre?.trim()) errors.push('nombre es requerido');
  }

  if (!partial || payload.dias_semana !== undefined) {
    const dias = normalizeDiasSemana(payload.dias_semana);
    if (!dias?.length || dias.some((dia) => dia < 1 || dia > 7)) {
      errors.push('dias_semana debe contener valores entre 1 y 7');
    }
  }

  if (!partial || payload.hora_inicio !== undefined) {
    if (!parseTime(payload.hora_inicio)) errors.push('hora_inicio invalida');
  }

  if (!partial || payload.hora_fin !== undefined) {
    if (!parseTime(payload.hora_fin)) errors.push('hora_fin invalida');
  }

  if (payload.tolerancia_minutos !== undefined && Number(payload.tolerancia_minutos) < 0) {
    errors.push('tolerancia_minutos no puede ser negativa');
  }

  if (payload.descanso_minutos !== undefined && Number(payload.descanso_minutos) < 0) {
    errors.push('descanso_minutos no puede ser negativo');
  }

  if (errors.length) {
    const error = new Error(errors.join(', '));
    error.statusCode = 400;
    throw error;
  }
}

async function assertSucursalInTenant(empresaId, sucursalId) {
  if (!sucursalId) return;

  const result = await pool.query(
    `
      SELECT id
      FROM sucursales
      WHERE empresa_id = $1
        AND id = $2
      LIMIT 1
    `,
    [empresaId, sucursalId],
  );

  if (!result.rows.length) {
    const error = new Error('sucursal_id no pertenece a la empresa');
    error.statusCode = 400;
    throw error;
  }
}

async function assertEmpleadoInTenant(empresaId, empleadoId) {
  const result = await pool.query(
    `
      SELECT id
      FROM empleados
      WHERE empresa_id = $1
        AND id = $2
      LIMIT 1
    `,
    [empresaId, empleadoId],
  );

  if (!result.rows.length) {
    const error = new Error('empleado_id no pertenece a la empresa');
    error.statusCode = 400;
    throw error;
  }
}

async function assertHorarioInTenant(empresaId, horarioId) {
  const result = await pool.query(
    `
      SELECT id
      FROM horarios
      WHERE empresa_id = $1
        AND id = $2
      LIMIT 1
    `,
    [empresaId, horarioId],
  );

  if (!result.rows.length) {
    const error = new Error('horario_id no pertenece a la empresa');
    error.statusCode = 400;
    throw error;
  }
}

async function listHorarios({ empresaId, search, activo, sucursalId, limit = 20, offset = 0 }) {
  const filters = ['h.empresa_id = $1'];
  const values = [empresaId];

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    filters.push(`LOWER(h.nombre) LIKE $${values.length}`);
  }

  if (activo !== undefined) {
    values.push(activo);
    filters.push(`h.activo = $${values.length}`);
  }

  if (sucursalId) {
    values.push(sucursalId);
    filters.push(`h.sucursal_id = $${values.length}`);
  }

  values.push(limit);
  const limitParam = values.length;
  values.push(offset);
  const offsetParam = values.length;

  const result = await pool.query(
    `
      SELECT
        h.*,
        s.nombre AS sucursal_nombre,
        COUNT(*) OVER() AS total
      FROM horarios h
      LEFT JOIN sucursales s ON s.id = h.sucursal_id
      WHERE ${filters.join(' AND ')}
      ORDER BY h.creado_en DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `,
    values,
  );

  return {
    items: result.rows.map(({ total, ...horario }) => horario),
    total: Number(result.rows[0]?.total || 0),
    limit,
    offset,
  };
}

async function findHorarioById(empresaId, id) {
  const result = await pool.query(
    `
      SELECT h.*, s.nombre AS sucursal_nombre
      FROM horarios h
      LEFT JOIN sucursales s ON s.id = h.sucursal_id
      WHERE h.empresa_id = $1
        AND h.id = $2
      LIMIT 1
    `,
    [empresaId, id],
  );

  return result.rows[0] || null;
}

async function createHorario(empresaId, payload) {
  validateHorarioPayload(payload);
  await assertSucursalInTenant(empresaId, payload.sucursal_id);

  const result = await pool.query(
    `
      INSERT INTO horarios (
        empresa_id,
        sucursal_id,
        nombre,
        descripcion,
        dias_semana,
        hora_inicio,
        hora_fin,
        tolerancia_minutos,
        descanso_minutos,
        activo
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `,
    [
      empresaId,
      payload.sucursal_id || null,
      payload.nombre.trim(),
      payload.descripcion?.trim() || null,
      normalizeDiasSemana(payload.dias_semana),
      parseTime(payload.hora_inicio),
      parseTime(payload.hora_fin),
      Number.parseInt(payload.tolerancia_minutos ?? 10, 10),
      Number.parseInt(payload.descanso_minutos ?? 0, 10),
      payload.activo !== undefined ? Boolean(payload.activo) : true,
    ],
  );

  return findHorarioById(empresaId, result.rows[0].id);
}

async function updateHorario(empresaId, id, payload) {
  validateHorarioPayload(payload, { partial: true });
  const current = await findHorarioById(empresaId, id);

  if (!current) return null;

  const next = {
    sucursal_id: payload.sucursal_id !== undefined ? payload.sucursal_id || null : current.sucursal_id,
    nombre: payload.nombre !== undefined ? payload.nombre.trim() : current.nombre,
    descripcion: payload.descripcion !== undefined ? payload.descripcion?.trim() || null : current.descripcion,
    dias_semana:
      payload.dias_semana !== undefined ? normalizeDiasSemana(payload.dias_semana) : current.dias_semana,
    hora_inicio: payload.hora_inicio !== undefined ? parseTime(payload.hora_inicio) : current.hora_inicio,
    hora_fin: payload.hora_fin !== undefined ? parseTime(payload.hora_fin) : current.hora_fin,
    tolerancia_minutos:
      payload.tolerancia_minutos !== undefined
        ? Number.parseInt(payload.tolerancia_minutos, 10)
        : current.tolerancia_minutos,
    descanso_minutos:
      payload.descanso_minutos !== undefined
        ? Number.parseInt(payload.descanso_minutos, 10)
        : current.descanso_minutos,
    activo: payload.activo !== undefined ? Boolean(payload.activo) : current.activo,
  };

  await assertSucursalInTenant(empresaId, next.sucursal_id);

  await pool.query(
    `
      UPDATE horarios
      SET sucursal_id = $3,
          nombre = $4,
          descripcion = $5,
          dias_semana = $6,
          hora_inicio = $7,
          hora_fin = $8,
          tolerancia_minutos = $9,
          descanso_minutos = $10,
          activo = $11,
          actualizado_en = NOW()
      WHERE empresa_id = $1
        AND id = $2
    `,
    [
      empresaId,
      id,
      next.sucursal_id,
      next.nombre,
      next.descripcion,
      next.dias_semana,
      next.hora_inicio,
      next.hora_fin,
      next.tolerancia_minutos,
      next.descanso_minutos,
      next.activo,
    ],
  );

  return findHorarioById(empresaId, id);
}

async function deactivateHorario(empresaId, id) {
  const result = await pool.query(
    `
      UPDATE horarios
      SET activo = FALSE,
          actualizado_en = NOW()
      WHERE empresa_id = $1
        AND id = $2
      RETURNING id
    `,
    [empresaId, id],
  );

  if (!result.rows.length) return null;

  return findHorarioById(empresaId, id);
}

async function assignHorario(empresaId, payload) {
  if (!payload.empleado_id || !payload.horario_id) {
    const error = new Error('empleado_id y horario_id son requeridos');
    error.statusCode = 400;
    throw error;
  }

  await assertEmpleadoInTenant(empresaId, payload.empleado_id);
  await assertHorarioInTenant(empresaId, payload.horario_id);

  const result = await pool.query(
    `
      INSERT INTO empleado_horarios (
        empresa_id,
        empleado_id,
        horario_id,
        fecha_inicio,
        fecha_fin,
        activo
      ) VALUES ($1, $2, $3, COALESCE($4::date, CURRENT_DATE), $5, $6)
      RETURNING *
    `,
    [
      empresaId,
      payload.empleado_id,
      payload.horario_id,
      payload.fecha_inicio || null,
      payload.fecha_fin || null,
      payload.activo !== undefined ? Boolean(payload.activo) : true,
    ],
  );

  return result.rows[0];
}

async function listEmpleadoHorarios({ empresaId, empleadoId, activo, limit = 20, offset = 0 }) {
  const filters = ['eh.empresa_id = $1'];
  const values = [empresaId];

  if (empleadoId) {
    values.push(empleadoId);
    filters.push(`eh.empleado_id = $${values.length}`);
  }

  if (activo !== undefined) {
    values.push(activo);
    filters.push(`eh.activo = $${values.length}`);
  }

  values.push(limit);
  const limitParam = values.length;
  values.push(offset);
  const offsetParam = values.length;

  const result = await pool.query(
    `
      SELECT
        eh.*,
        h.nombre AS horario_nombre,
        e.codigo AS empleado_codigo,
        e.nombres AS empleado_nombres,
        e.apellidos AS empleado_apellidos,
        COUNT(*) OVER() AS total
      FROM empleado_horarios eh
      INNER JOIN horarios h ON h.id = eh.horario_id
      INNER JOIN empleados e ON e.id = eh.empleado_id
      WHERE ${filters.join(' AND ')}
      ORDER BY eh.creado_en DESC
      LIMIT $${limitParam}
      OFFSET $${offsetParam}
    `,
    values,
  );

  return {
    items: result.rows.map(({ total, ...assignment }) => assignment),
    total: Number(result.rows[0]?.total || 0),
    limit,
    offset,
  };
}

async function deactivateEmpleadoHorario(empresaId, id) {
  const result = await pool.query(
    `
      UPDATE empleado_horarios
      SET activo = FALSE,
          fecha_fin = COALESCE(fecha_fin, CURRENT_DATE),
          actualizado_en = NOW()
      WHERE empresa_id = $1
        AND id = $2
      RETURNING *
    `,
    [empresaId, id],
  );

  return result.rows[0] || null;
}

module.exports = {
  listHorarios,
  findHorarioById,
  createHorario,
  updateHorario,
  deactivateHorario,
  assignHorario,
  listEmpleadoHorarios,
  deactivateEmpleadoHorario,
};
