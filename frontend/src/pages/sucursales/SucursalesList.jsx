import ResourcePage from '../common/ResourcePage';

export default function SucursalesList() {
  return (
    <ResourcePage
      title="Sucursales"
      description="Ubicaciones, geocercas y QR."
      path="/sucursales?limit=100"
      columns={['nombre', 'codigo', 'ciudad', 'radio_metros', 'estado']}
    />
  );
}
