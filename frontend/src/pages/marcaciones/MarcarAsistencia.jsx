import { useState } from 'react';
import { MapPin, QrCode, Send } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import PanelTitle from '../../components/common/PanelTitle';
import * as marcacionService from '../../services/marcacionService';
import { obtenerUbicacion } from '../../utils/gps';

const motivos = ['Reemplazo', 'Apoyo temporal', 'Emergencia', 'Autorizacion supervisor', 'Otro'];

export default function MarcarAsistencia() {
  const [qrToken, setQrToken] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [motivoNovedad, setMotivoNovedad] = useState('');
  const [detalleNovedad, setDetalleNovedad] = useState('');
  const [ubicacion, setUbicacion] = useState(null);
  const [loadingGps, setLoadingGps] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function requestGps() {
    setLoadingGps(true);
    setError('');

    try {
      setUbicacion(await obtenerUbicacion());
    } catch (gpsError) {
      setError(gpsError.message);
    } finally {
      setLoadingGps(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!qrToken.trim()) {
      setError('Ingresa o escanea un QR valido');
      return;
    }

    if (!ubicacion) {
      setError('Primero debes obtener la ubicacion GPS');
      return;
    }

    setSubmitting(true);

    try {
      const response = await marcacionService.registrarMarcacion({
        qr_token: qrToken.trim(),
        tipo,
        latitud: ubicacion.latitud,
        longitud: ubicacion.longitud,
        motivo_novedad: motivoNovedad || undefined,
        detalle_novedad: detalleNovedad || undefined,
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'No se pudo registrar la marcacion');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Marcar asistencia" description="Registra entrada o salida con QR y ubicacion GPS." />

      {error ? <div className="alert-error">{error}</div> : null}
      {result ? (
        <div className={result.marcacion?.estado === 'rechazada' ? 'alert-error' : 'alert-success'}>
          {result.mensaje || result.marcacion?.mensaje || `Marcacion ${result.marcacion?.estado || 'registrada'}`}
        </div>
      ) : null}

      <div className="panel">
        <PanelTitle title="Datos de marcacion" subtitle="El escaneo con camara se incorporara en la fase QR dedicada" />
        <form className="module-form" onSubmit={submit}>
          <div className="form-grid">
            <label className="wide-field">
              QR token
              <div className="input-with-icon">
                <QrCode size={16} />
                <input value={qrToken} onChange={(event) => setQrToken(event.target.value)} placeholder="Pega el qr_token de la sucursal" />
              </div>
            </label>
            <label>
              Tipo
              <select value={tipo} onChange={(event) => setTipo(event.target.value)}>
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </label>
            <label>
              Motivo novedad
              <select value={motivoNovedad} onChange={(event) => setMotivoNovedad(event.target.value)}>
                <option value="">Sin novedad</option>
                {motivos.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide-field">
              Detalle novedad
              <input value={detalleNovedad} onChange={(event) => setDetalleNovedad(event.target.value)} placeholder="Opcional" />
            </label>
          </div>

          <div className="gps-status">
            <MapPin size={18} />
            <div>
              <strong>{ubicacion ? 'GPS listo' : 'GPS requerido'}</strong>
              <span>
                {ubicacion
                  ? `${ubicacion.latitud.toFixed(7)}, ${ubicacion.longitud.toFixed(7)} · precision ${Math.round(ubicacion.precision_metros || 0)} m`
                  : 'Solicita ubicacion antes de marcar'}
              </span>
            </div>
          </div>

          <div className="form-actions">
            <button className="outline-button" type="button" onClick={requestGps} disabled={loadingGps}>
              <MapPin size={16} />
              {loadingGps ? 'Obteniendo...' : 'Obtener GPS'}
            </button>
            <button className="primary-button compact" disabled={submitting || loadingGps}>
              <Send size={16} />
              {submitting ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
