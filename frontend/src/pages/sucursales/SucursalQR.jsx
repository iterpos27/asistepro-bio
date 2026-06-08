import { RefreshCcw } from 'lucide-react';
import PanelTitle from '../../components/common/PanelTitle';

export default function SucursalQR({ qrData, loading, onRotate }) {
  if (!qrData) return null;

  const payload = JSON.stringify(qrData.qr_payload, null, 2);

  return (
    <div className="panel">
      <PanelTitle title="QR de sucursal" subtitle="Payload usado para marcaciones QR + GPS" />
      <div className="qr-box">
        <div className="qr-token">
          <strong>Token</strong>
          <span>{qrData.qr_token}</span>
        </div>
        <pre>{payload}</pre>
        <div className="form-actions">
          <button className="outline-button" type="button" onClick={onRotate} disabled={loading}>
            <RefreshCcw size={16} />
            {loading ? 'Rotando...' : 'Rotar QR'}
          </button>
        </div>
      </div>
    </div>
  );
}
