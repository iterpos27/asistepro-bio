import { useState } from 'react';
import { Activity, FileBarChart, UserCheck, Users } from 'lucide-react';
import MetricCard from '../../components/cards/MetricCard';
import PageHeader from '../../components/common/PageHeader';
import DataPanel from '../../components/tables/DataPanel';
import useResource from '../../hooks/useResource';
import { api } from '../../services/api';

export default function Reportes() {
  const today = new Date().toISOString().slice(0, 10);
  const diaria = useResource(`/reportes/asistencia-diaria?fecha=${today}`, { resumen: {}, items: [] });
  const mensual = useResource(`/reportes/asistencia-mensual?mes=${new Date().toISOString().slice(0, 7)}`, { resumen: {}, items: [] });
  const [csvStatus, setCsvStatus] = useState('');

  async function downloadDailyCsv() {
    try {
      setCsvStatus('Preparando CSV');
      const response = await api.get(`/reportes/export/asistencia-diaria.csv?fecha=${today}`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asistencia-diaria-${today}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setCsvStatus('CSV descargado');
    } catch {
      setCsvStatus('No se pudo descargar');
    }
  }

  return (
    <>
      <PageHeader
        title="Reportes"
        description="Asistencia diaria, mensual, novedades y exportaciones."
        actions={
          <>
            <button className="outline-button" type="button" onClick={downloadDailyCsv}>
              CSV diario
            </button>
            {csvStatus ? <span className="status-pill muted">{csvStatus}</span> : null}
          </>
        }
      />
      <section className="metrics-grid">
        <MetricCard label="Presentes hoy" value={diaria.data.resumen?.presentes || 0} icon={UserCheck} tone="success" />
        <MetricCard label="Ausentes hoy" value={diaria.data.resumen?.ausentes || 0} icon={Users} tone="warning" />
        <MetricCard label="Marcaciones mes" value={mensual.data.resumen?.total_marcaciones || 0} icon={Activity} />
        <MetricCard label="Novedades mes" value={mensual.data.resumen?.novedades || 0} icon={FileBarChart} tone="accent" />
      </section>
      <DataPanel title="Asistencia diaria" rows={diaria.data.items || []} columns={['empleado_codigo', 'empleado_nombres', 'estado_asistencia', 'novedades']} />
    </>
  );
}
