import ResourcePage from '../common/ResourcePage';

export default function HistorialMarcaciones() {
  return (
    <ResourcePage
      title="Marcaciones"
      description="Historial QR + GPS."
      path="/marcaciones?limit=100"
      columns={['empleado_codigo', 'sucursal_nombre', 'tipo', 'estado', 'marcado_en']}
    />
  );
}
