import PageHeader from '../../components/common/PageHeader';
import DataPanel from '../../components/tables/DataPanel';
import useResource from '../../hooks/useResource';

export default function ResourcePage({ title, description, path, columns }) {
  const { data, loading } = useResource(path, { items: [], total: 0 }, [path]);
  const rows = Array.isArray(data) ? data : data.items || [];
  const total = Array.isArray(data) ? data.length : data.total || rows.length;

  return (
    <>
      <PageHeader title={title} description={description} actions={<span className="status-pill">{loading ? 'Cargando' : `${total} registros`}</span>} />
      <DataPanel title={title} rows={rows} columns={columns} />
    </>
  );
}
