import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './ClientDashboard.css';

interface Ticket {
  id: number;
  resumen: string;
  estado: string;
  fecha_creacion: string;
  urgencia?: string;
}

const ClientDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login/choice');
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      api.get(`/tickets?cliente_id=${user.id}`)
        .then((data) => setTickets(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getUrgencyColor = (urgencia?: string) => {
    switch (urgencia?.toLowerCase()) {
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Panel de Soporte</h1>
          <p className="user-email">Bienvenido, <strong>{user?.email || 'Cliente'}</strong></p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Mis Tickets</h2>
            <Link to="/client/new" className="btn-new-ticket">
              + Crear Nuevo Ticket
            </Link>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <p>No tienes tickets aún</p>
              <Link to="/client/new" className="btn-create-first">
                Crear Mi Primer Ticket
              </Link>
            </div>
          ) : (
            <div className="tickets-grid">
              {tickets.map(t => (
                <Link
                  key={t.id}
                  to={`/client/tickets/${t.id}`}
                  className="ticket-card"
                >
                  <div className="ticket-header">
                    <span className="ticket-id">#{t.id}</span>
                    <span className={`ticket-status ${getStatusColor(t.estado)}`}>
                      {t.estado}
                    </span>
                  </div>
                  <h3 className="ticket-resumen">{t.resumen}</h3>
                  <div className="ticket-footer">
                    <span className="ticket-date">
                      {new Date(t.fecha_creacion).toLocaleDateString()}
                    </span>
                    {t.urgencia && (
                      <span className={`ticket-urgency ${getUrgencyColor(t.urgencia)}`}>
                        {t.urgencia}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
