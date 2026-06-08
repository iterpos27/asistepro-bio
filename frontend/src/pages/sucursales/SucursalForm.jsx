import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const sucursalSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  codigo: z.string().min(1, 'Codigo requerido'),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  latitud: z.coerce.number().min(-90, 'Latitud invalida').max(90, 'Latitud invalida'),
  longitud: z.coerce.number().min(-180, 'Longitud invalida').max(180, 'Longitud invalida'),
  radio_metros: z.coerce.number().int().min(1, 'Radio requerido'),
  estado: z.enum(['activa', 'inactiva', 'mantenimiento']),
});

const defaultValues = {
  nombre: '',
  codigo: '',
  direccion: '',
  ciudad: '',
  latitud: '',
  longitud: '',
  radio_metros: 100,
  estado: 'activa',
};

export default function SucursalForm({ sucursal, loading, onCancel, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sucursalSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(
      sucursal
        ? {
            nombre: sucursal.nombre || '',
            codigo: sucursal.codigo || '',
            direccion: sucursal.direccion || '',
            ciudad: sucursal.ciudad || '',
            latitud: Number(sucursal.latitud || 0),
            longitud: Number(sucursal.longitud || 0),
            radio_metros: Number(sucursal.radio_metros || 100),
            estado: sucursal.estado || 'activa',
          }
        : defaultValues,
    );
  }, [reset, sucursal]);

  function submit(values) {
    onSubmit({
      ...values,
      codigo: values.codigo.toUpperCase(),
      direccion: values.direccion || null,
      ciudad: values.ciudad || null,
    });
  }

  return (
    <form className="module-form" onSubmit={handleSubmit(submit)}>
      <div className="form-grid">
        <label>
          Nombre
          <input {...register('nombre')} placeholder="Matriz" />
          {errors.nombre && <small>{errors.nombre.message}</small>}
        </label>
        <label>
          Codigo
          <input {...register('codigo')} placeholder="MAT" />
          {errors.codigo && <small>{errors.codigo.message}</small>}
        </label>
        <label className="wide-field">
          Direccion
          <input {...register('direccion')} placeholder="Av. principal y calle secundaria" />
        </label>
        <label>
          Ciudad
          <input {...register('ciudad')} placeholder="Quito" />
        </label>
        <label>
          Radio metros
          <input {...register('radio_metros')} type="number" min="1" />
          {errors.radio_metros && <small>{errors.radio_metros.message}</small>}
        </label>
        <label>
          Latitud
          <input {...register('latitud')} type="number" step="0.0000001" placeholder="-0.180653" />
          {errors.latitud && <small>{errors.latitud.message}</small>}
        </label>
        <label>
          Longitud
          <input {...register('longitud')} type="number" step="0.0000001" placeholder="-78.467834" />
          {errors.longitud && <small>{errors.longitud.message}</small>}
        </label>
        <label>
          Estado
          <select {...register('estado')}>
            <option value="activa">Activa</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </label>
      </div>
      <div className="form-actions">
        <button className="outline-button" type="button" onClick={onCancel}>
          Cancelar
        </button>
        <button className="primary-button compact" disabled={loading}>
          {loading ? 'Guardando...' : sucursal ? 'Actualizar' : 'Crear sucursal'}
        </button>
      </div>
    </form>
  );
}
