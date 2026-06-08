import { BarChart3, Building2, CreditCard, UserCheck } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import PanelTitle from '../../components/common/PanelTitle';
import DataPanel from '../../components/tables/DataPanel';
import { branchActivity, weeklyAttendance } from '../../data/fallback';
import useResource from '../../hooks/useResource';

export default function Dashboard() {
  const empresas = useResource('/empresas?limit=100', { items: [], total: 0 });
  const planes = useResource('/planes', []);
  const facturas = useResource('/facturacion/facturas?limit=100', { items: [], total: 0 });
  const marcaciones = useResource('/marcaciones?limit=100', { items: [], total: 0 });
  const reportes = useResource('/reportes/novedades?limit=10', { items: [], total: 0 });

  const invoiceTotal = Array.isArray(facturas.data.items)
    ? facturas.data.items.reduce((total, item) => total + Number(item.total || 0), 0)
    : 0;

  return (
    <>
      <PageHeader title="Dashboard final" description="KPIs operativos, facturacion y asistencia en tiempo real." />
      <section className="metrics-grid">
        <MetricCard label="Empresas" value={empresas.data.total || empresas.data.items?.length || 0} icon={Building2} />
        <MetricCard label="Planes activos" value={Array.isArray(planes.data) ? planes.data.filter((p) => p.activo).length : 0} icon={CreditCard} tone="success" />
        <MetricCard label="Marcaciones" value={marcaciones.data.total || 0} icon={UserCheck} tone="accent" />
        <MetricCard label="Facturacion" value={`$${invoiceTotal.toFixed(2)}`} icon={BarChart3} tone="warning" />
      </section>
      <section className="dashboard-grid">
        <div className="panel wide">
          <PanelTitle title="Asistencia semanal" subtitle="Vista de referencia del diseno original" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyAttendance}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="presentes" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tarde" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ausentes" fill="#64748b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="panel">
          <PanelTitle title="Sucursales" subtitle="Actividad por ubicacion" />
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={branchActivity} dataKey="value" nameKey="name" innerRadius={54} outerRadius={86} paddingAngle={3}>
                {branchActivity.map((_, index) => (
                  <Cell key={index} fill={['#4f46e5', '#10b981', '#06b6d4', '#f59e0b'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <DataPanel title="Novedades recientes" rows={reportes.data.items || []} columns={['empleado_codigo', 'motivo_novedad', 'sucursal_nombre']} />
        <DataPanel title="Empresas recientes" rows={empresas.data.items || []} columns={['nombre', 'estado', 'email']} />
      </section>
    </>
  );
}
