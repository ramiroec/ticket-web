import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import './ClientTicketDetail.css';

interface Comment {
  id: number;
  autor_id: number;
  tipo: string;
  mensaje: string;
  fecha: string;
}

interface Attachment {
  id: number;
  archivo_url: string;
  tipo?: string;
}

interface Ticket {
  id: number;
  resumen: string;
  descripcion: string;
  estado: string;
  urgencia: string;
  fecha_creacion: string;
  comentarios: Comment[];
  adjuntos: Attachment[];
}

const ClientTicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/tickets/${id}`)
        .then(t => setTicket(t))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const getUrgencyColor = (urgencia: string) => {
    const lower = urgencia?.toLowerCase();
    switch (lower) {
      case 'critical':
      case 'crítico':
        return 'urgency-critical';
      case 'high':
      case 'alto':
        return 'urgency-high';
      case 'medium':
      case 'medio':
        return 'urgency-medium';
      default:
        return 'urgency-low';
    }
  };

  const getStatusColor = (estado: string) => {
    const lowerEstado = estado.toLowerCase();
    if (lowerEstado === 'abierto' || lowerEstado === 'open') return 'status-open';
    if (lowerEstado === 'cerrado' || lowerEstado === 'closed') return 'status-closed';
    if (lowerEstado === 'en progreso' || lowerEstado === 'in progress') return 'status-progress';
    return 'status-default';
  };

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <div className="spinner"></div>
        <p>Cargando detalle del ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="ticket-detail-error">
        <h2>Ticket no encontrado</h2>
        <Link to="/client" className="btn-back">Volver al dashboard</Link>
      </div>
    );
  }

  return (
    <div className="ticket-detail-container">
      <Link to="/client" className="btn-back">← Volver</Link>
      
      <div className="ticket-header">
        <div className="header-left">
          <h1>Ticket #{ticket.id}</h1>
          <p className="ticket-subtitle">{ticket.resumen}</p>
        </div>
        <div className="header-badges">
          <span className={`badge status ${getStatusColor(ticket.estado)}`}>
            {ticket.estado}
          </span>
          <span className={`badge urgency ${getUrgencyColor(ticket.urgencia)}`}>
            {ticket.urgencia}
          </span>
        </div>
      </div>

      <div className="ticket-content">
        <div className="ticket-main">
          <div className="ticket-section">
            <h2>Descripción</h2>
            <p className="ticket-description">{ticket.descripcion}</p>
          </div>

          <div className="ticket-section">
            <h2>Información</h2>
            <div className="ticket-info">
              <div className="info-item">
                <span className="info-label">Fecha de Creación:</span>
                <span className="info-value">
                  {new Date(ticket.fecha_creacion).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          {ticket.comentarios && ticket.comentarios.length > 0 && (
            <div className="ticket-section">
              <h2>Comentarios ({ticket.comentarios.length})</h2>
              <div className="comments-list">
                {ticket.comentarios.map(c => (
                  <div key={c.id} className="comment">
                    <div className="comment-header">
                      <span className={`comment-type ${c.tipo?.toLowerCase()}`}>
                        {c.tipo}
                      </span>
                      <span className="comment-date">
                        {new Date(c.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    <p className="comment-text">{c.mensaje}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ticket.adjuntos && ticket.adjuntos.length > 0 && (
            <div className="ticket-section">
              <h2>Adjuntos ({ticket.adjuntos.length})</h2>
              <div className="attachments">
                {ticket.adjuntos.map(a => (
                  <a
                    key={a.id}
                    href={a.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-item"
                  >
                    📎 {a.archivo_url.split('/').pop() || 'Descargar'}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientTicketDetail;
