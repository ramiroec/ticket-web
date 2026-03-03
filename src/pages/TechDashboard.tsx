import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './TechDashboard.css';

interface Ticket {
  id: number;
  resumen: string;
  estado: string;
  fecha_creacion: string;
  urgencia?: string;
  cliente_id?: number;
}

const TechDashboard: React.FC = () => {
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
      api.get(`/tickets?asignado_a=${user.id}`)
        .then((data) => setTickets(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  const getStatusColor = (estado: string) => {
    const lowerEstado = estado.toLowerCase();
    if (lowerEstado === 'abierto' || lowerEstado === 'open') return 'status-open';
    if (lowerEstado === 'cerrado' || lowerEstado === 'closed') return 'status-closed';
    if (lowerEstado === 'en progreso' || lowerEstado === 'in progress') return 'status-progress';
    return 'status-default';
  };

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

  const openTickets = tickets.filter(t => 
    t.estado?.toLowerCase() === 'abierto' || t.estado?.toLowerCase() === 'open'
  );

  const inProgressTickets = tickets.filter(t =>
    t.estado?.toLowerCase() === 'en progreso' || t.estado?.toLowerCase() === 'in progress'
  );

  return (
    <div className="tech-dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Panel Técnico de Soporte</h1>
          <p className="user-email">Bienvenido, <strong>{user?.nombre || user?.email}</strong></p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="tech-dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{tickets.length}</div>
            <div className="stat-label">Tickets Asignados</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{openTickets.length}</div>
            <div className="stat-label">Abiertos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{inProgressTickets.length}</div>
            <div className="stat-label">En Progreso</div>
          </div>
        </div>

        <div className="tickets-section">
          <h2>Tickets Asignados</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <p>No tienes tickets asignados</p>
            </div>
          ) : (
            <div className="tickets-table">
              {tickets.map(t => (
                <Link
                  key={t.id}
                  to={`/tech/tickets/${t.id}`}
                  className="ticket-row"
                >
                  <div className="ticket-col ticket-id">#{t.id}</div>
                  <div className="ticket-col ticket-summary">{t.resumen}</div>
                  <div className="ticket-col ticket-status">
                    <span className={`status-badge ${getStatusColor(t.estado)}`}>
                      {t.estado}
                    </span>
                  </div>
                  {t.urgencia && (
                    <div className="ticket-col ticket-urgency">
                      <span className={`urgency-badge ${getUrgencyColor(t.urgencia)}`}>
                        {t.urgencia}
                      </span>
                    </div>
                  )}
                  <div className="ticket-col ticket-date">
                    {new Date(t.fecha_creacion).toLocaleDateString()}
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

export default TechDashboard;
