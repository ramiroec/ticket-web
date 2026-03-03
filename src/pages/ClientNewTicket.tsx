import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import './ClientNewTicket.css';

interface Service {
  id: number;
  cliente_id: number;
  nombre: string;
  tipo?: string;
}

const ClientNewTicket: React.FC = () => {
  const { user } = useAuth();
  const [servicios, setServicios] = useState<Service[]>([]);
  const [datos, setDatos] = useState({ servicio_id: '', resumen: '', descripcion: '', urgencia: 'Normal' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/servicios')
      .then((list: Service[]) => {
        if (user) {
          setServicios(list.filter(s => s.cliente_id === user.id));
        } else {
          setServicios(list);
        }
      })
      .catch(console.error);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!user) throw new Error('Sin usuario');
      const payload = {
        cliente_id: user.id,
        servicio_id: parseInt(datos.servicio_id),
        resumen: datos.resumen,
        descripcion: datos.descripcion,
        urgencia: datos.urgencia,
      };
      const ticket = await api.post('/tickets', payload);
      navigate(`/client/tickets/${ticket.id}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-ticket-container">
      <div className="new-ticket-header">
        <Link to="/client" className="btn-back">← Volver</Link>
        <h1>Crear Nuevo Ticket</h1>
      </div>

      <div className="new-ticket-form-container">
        <form onSubmit={handleSubmit} className="new-ticket-form">
          <div className="form-section">
            <h2>Información del Ticket</h2>

            <div className="form-group">
              <label htmlFor="servicio">Servicio Contratado *</label>
              <select
                id="servicio"
                value={datos.servicio_id}
                onChange={e => setDatos({ ...datos, servicio_id: e.target.value })}
                required
                disabled={loading}
              >
                <option value="">-- Selecciona un servicio --</option>
                {servicios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              {servicios.length === 0 && (
                <small className="form-help">No tienes servicios asociados</small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="resumen">Resumen del Problema *</label>
              <input
                id="resumen"
                type="text"
                placeholder="Describe brevemente el problema"
                value={datos.resumen}
                onChange={e => setDatos({ ...datos, resumen: e.target.value })}
                required
                disabled={loading}
                maxLength={200}
              />
              <small className="form-help">
                {datos.resumen.length}/200 caracteres
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción Detallada *</label>
              <textarea
                id="descripcion"
                placeholder="Proporciona detalles adicionales que nos ayuden a resolver el problema"
                value={datos.descripcion}
                onChange={e => setDatos({ ...datos, descripcion: e.target.value })}
                required
                disabled={loading}
                rows={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="urgencia">Nivel de Urgencia</label>
              <select
                id="urgencia"
                value={datos.urgencia}
                onChange={e => setDatos({ ...datos, urgencia: e.target.value })}
                disabled={loading}
              >
                <option value="Baja">🟢 Baja</option>
                <option value="Normal">🟡 Normal</option>
                <option value="Alta">🔴 Alta</option>
                <option value="Crítica">⚫ Crítica</option>
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Creando Ticket...' : 'Crear Ticket'}
            </button>
            <Link to="/client" className="btn-cancel">
              Cancelar
            </Link>
          </div>
        </form>

        <div className="form-info">
          <h3>Consejos para mejor experiencia:</h3>
          <ul>
            <li>Sé lo más específico posible en la descripción</li>
            <li>Incluye pasos para reproducir el problema si aplica</li>
            <li>Adjunta capturas de pantalla o archivos relevantes cuando sea posible</li>
            <li>Selecciona correctamente el nivel de urgencia</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientNewTicket;
