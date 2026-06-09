const { z } = require('zod');
const { emptyBody, emptyParams, idParamSchema, idParams, paginationQuery, updateBodySchema, uuid } = require('./common.validator');

const empresaBody = z.object({
  plan_id: uuid('plan_id').optional().nullable(),
  nombre: z.string().trim().min(1, 'nombre es requerido').max(160),
  identificacion_fiscal: z.string().trim().max(40).optional().nullable(),
  email: z.email('email invalido').optional().nullable(),
  telefono: z.string().trim().max(40).optional().nullable(),
  direccion: z.string().trim().max(260).optional().nullable(),
  estado: z.enum(['activa', 'suspendida', 'cancelada']).optional(),
});

const listEmpresasSchema = z.object({
  body: emptyBody,
  query: paginationQuery.extend({
    estado: z.enum(['activa', 'suspendida', 'cancelada']).optional(),
  }),
  params: emptyParams,
});

const createEmpresaSchema = z.object({
  body: empresaBody,
  query: z.object({}).passthrough(),
  params: emptyParams,
});

const updateEmpresaSchema = z.object({
  body: updateBodySchema(empresaBody),
  query: z.object({}).passthrough(),
  params: idParams,
});

const updateMiEmpresaSchema = z.object({
  body: updateBodySchema(empresaBody),
  query: z.object({}).passthrough(),
  params: emptyParams,
});

module.exports = {
  createEmpresaSchema,
  idParamSchema,
  listEmpresasSchema,
  updateEmpresaSchema,
  updateMiEmpresaSchema,
};
