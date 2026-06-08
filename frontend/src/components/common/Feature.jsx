export default function Feature({ icon: Icon, title, text }) {
  return (
    <div className="feature">
      <Icon size={18} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}
