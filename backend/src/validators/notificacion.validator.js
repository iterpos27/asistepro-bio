const { z } = require('zod');
const { emptyBody, idParamSchema, paginationQuery } = require('./common.validator');

const listNotificacionesSchema = z.object({
  body: emptyBody,
  query: paginationQuery,
  params: z.object({}).passthrough(),
});

module.exports = {
  listNotificacionesSchema,
  idParamSchema,
};
