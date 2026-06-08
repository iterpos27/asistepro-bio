export default function MetricCard({ label, value, icon: Icon, tone = 'primary', detail }) {
  return (
    <div className="metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
      <div className={`metric-icon ${tone}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
