import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const empresaSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  identificacion_fiscal: z.string().optional(),
  email: z.union([z.string().email('Email invalido'), z.literal('')]).optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
  estado: z.enum(['activa', 'suspendida', 'cancelada']),
});

const defaultValues = {
  nombre: '',
  identificacion_fiscal: '',
  email: '',
  telefono: '',
  direccion: '',
  estado: 'activa',
};

export default function EmpresaForm({ empresa, loading, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(empresaSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      empresa
        ? {
            nombre: empresa.nombre || '',
            identificacion_fiscal: empresa.identificacion_fiscal || '',
            email: empresa.email || '',
            telefono: empresa.telefono || '',
            direccion: empresa.direccion || '',
            estado: empresa.estado || 'activa',
          }
        : defaultValues,
    );
  }, [empresa, reset]);

  function submit(values) {
    onSubmit({
      ...values,
      identificacion_fiscal: values.identificacion_fiscal || null,
      email: values.email || null,
      telefono: values.telefono || null,
      direccion: values.direccion || null,
    });
  }

  return (
    <form className="module-form" onSubmit={handleSubmit(submit)}>
      <div className="form-grid">
        <label>
          Nombre
          <input {...register('nombre')} placeholder="Empresa demo" />
          {errors.nombre && <small>{errors.nombre.message}</small>}
        </label>
        <label>
          Identificacion fiscal
          <input {...register('identificacion_fiscal')} placeholder="RUC / RFC / NIT" />
        </label>
        <label>
          Email
          <input {...register('email')} type="email" placeholder="admin@empresa.com" />
          {errors.email && <small>{errors.email.message}</small>}
        </label>
        <label>
          Telefono
          <input {...register('telefono')} placeholder="+593..." />
        </label>
        <label className="wide-field">
          Direccion
          <input {...register('direccion')} placeholder="Direccion principal" />
        </label>
        <label>
          Estado
          <select {...register('estado')}>
            <option value="activa">Activa</option>
            <option value="suspendida">Suspendida</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="outline-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary-button compact" disabled={loading}>
          {loading ? 'Guardando...' : empresa ? 'Actualizar' : 'Crear empresa'}
        </button>
      </div>
    </form>
  );
}
