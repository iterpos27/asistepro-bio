import ResourcePage from '../common/ResourcePage';

export default function EmpresasList() {
  return (
    <ResourcePage
      title="Empresas"
      description="Gestion de tenants SaaS."
      path="/empresas?limit=100"
      columns={['nombre', 'estado', 'email', 'identificacion_fiscal']}
    />
  );
}
