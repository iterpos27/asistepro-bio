import ResourcePage from '../common/ResourcePage';

export default function EmpleadosList() {
  return (
    <ResourcePage
      title="Empleados"
      description="Directorio por empresa."
      path="/empleados?limit=100"
      columns={['codigo', 'nombres', 'apellidos', 'cargo', 'estado']}
    />
  );
}
