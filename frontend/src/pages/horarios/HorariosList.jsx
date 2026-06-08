import ResourcePage from '../common/ResourcePage';

export default function HorariosList() {
  return (
    <ResourcePage
      title="Horarios"
      description="Turnos y asignaciones."
      path="/horarios?limit=100"
      columns={['nombre', 'hora_inicio', 'hora_fin', 'tolerancia_minutos', 'activo']}
    />
  );
}
