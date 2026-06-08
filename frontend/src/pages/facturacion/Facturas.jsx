import ResourcePage from '../common/ResourcePage';

export default function Facturas() {
  return (
    <ResourcePage
      title="Facturacion"
      description="Facturas y pagos manuales."
      path="/facturacion/facturas?limit=100"
      columns={['numero', 'empresa_nombre', 'estado', 'total', 'total_pagado']}
    />
  );
}
