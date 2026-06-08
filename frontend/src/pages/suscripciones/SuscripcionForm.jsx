import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const suscripcionSchema = z.object({
  empresa_id: z.string().min(1, 'Empresa requerida'),
  plan_id: z.string().min(1, 'Plan requerido'),
  estado: z.enum(['activa', 'vencida', 'cancelada', 'suspendida']),
  fecha_inicio: z.string().optional(),
  fecha_fin: z.string().optional(),
  monto_mensual: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
});

const defaultValues = {
  empresa_id: '',
  plan_id: '',
  estado: 'activa',
  fecha_inicio: '',
  fecha_fin: '',
  monto_mensual: '',
};

function dateOnly(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

export default function SuscripcionForm({ suscripcion, empresas, planes, loading, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(suscripcionSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      suscripcion
        ? {
            empresa_id: suscripcion.empresa_id || '',
            plan_id: suscripcion.plan_id || '',
            estado: suscripcion.estado || 'activa',
            fecha_inicio: dateOnly(suscripcion.fecha_inicio),
            fecha_fin: dateOnly(suscripcion.fecha_fin),
            monto_mensual: suscripcion.monto_mensual ?? '',
          }
        : defaultValues,
    );
  }, [reset, suscripcion]);

  function submit(values) {
    onSubmit({
      ...values,
      fecha_inicio: values.fecha_inicio || null,
      fecha_fin: values.fecha_fin || null,
      monto_mensual: values.monto_mensual === '' ? undefined : Number(values.monto_mensual),
    });
  }

  return (
    <form className="module-form" onSubmit={handleSubmit(submit)}>
      <div className="form-grid">
        <label>
          Empresa
          <select {...register('empresa_id')} disabled={Boolean(suscripcion)}>
            <option value="">Seleccionar empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.nombre}
              </option>
            ))}
          </select>
          {errors.empresa_id && <small>{errors.empresa_id.message}</small>}
        </label>
        <label>
          Plan
          <select {...register('plan_id')}>
            <option value="">Seleccionar plan</option>
            {planes
              .filter((plan) => plan.activo)
              .map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre}
                </option>
              ))}
          </select>
          {errors.plan_id && <small>{errors.plan_id.message}</small>}
        </label>
        <label>
          Estado
          <select {...register('estado')}>
            <option value="activa">Activa</option>
            <option value="suspendida">Suspendida</option>
            <option value="vencida">Vencida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
        <label>
          Monto mensual
          <input {...register('monto_mensual')} type="number" min="0" step="0.01" placeholder="Segun plan" />
        </label>
        <label>
          Fecha inicio
          <input {...register('fecha_inicio')} type="date" />
        </label>
        <label>
          Fecha fin
          <input {...register('fecha_fin')} type="date" />
        </label>
      </div>
      <div className="form-actions">
        <button className="outline-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary-button compact" disabled={loading}>
          {loading ? 'Guardando...' : suscripcion ? 'Actualizar' : 'Crear suscripcion'}
        </button>
      </div>
    </form>
  );
}
