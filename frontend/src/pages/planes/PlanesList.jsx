import ResourcePage from '../common/ResourcePage';

export default function PlanesList() {
  return (
    <ResourcePage
      title="Planes"
      description="Catalogo de planes comerciales."
      path="/planes"
      columns={['nombre', 'codigo', 'precio_mensual', 'activo']}
    />
  );
}
