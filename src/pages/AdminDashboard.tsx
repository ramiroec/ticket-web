import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminDashboard.css';

interface DashboardStats {
  resumen: {
    totalTickets: number;
    totalAbiertos: number;
    totalCriticos: number;
    totalClientes: number;
    totalUsuarios: number;
    totalServicios: number;
  };
  porCliente: Array<{ id: number; empresa: string; total_tickets: number }>;
  porServicio: Array<{ id: number; nombre: string; total_tickets: number }>;
  productividadTecnico: Array<{ id: number; nombre: string; resueltos: number; total: number }>;
}

const AdminDashboard: React.FC = () => {
  const auth = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // use helper to ensure base URL and headers
        const data = await api.get('/tickets/stats/dashboard');
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    auth.logout();
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1>👨‍💼 Panel de Administración</h1>
          <div className="header-actions">
            <span className="user-info">{auth.user?.email}</span>
            <button onClick={handleLogout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Resumen de Estadísticas */}
        <section className="stats-section">
          <h2>Resumen General</h2>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">🎫</div>
              <div className="stat-content">
                <h3>Total Tickets</h3>
                <p className="stat-number">{stats?.resumen.totalTickets}</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Abiertos</h3>
                <p className="stat-number">{stats?.resumen.totalAbiertos}</p>
              </div>
            </div>

            <div className="stat-card danger">
              <div className="stat-icon">🔴</div>
              <div className="stat-content">
                <h3>Críticos</h3>
                <p className="stat-number">{stats?.resumen.totalCriticos}</p>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Clientes</h3>
                <p className="stat-number">{stats?.resumen.totalClientes}</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">👨‍💻</div>
              <div className="stat-content">
                <h3>Técnicos</h3>
                <p className="stat-number">{stats?.resumen.totalUsuarios}</p>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">⚙️</div>
              <div className="stat-content">
                <h3>Servicios</h3>
                <p className="stat-number">{stats?.resumen.totalServicios}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Matriz de Administración */}
        <section className="management-section">
          <h2>Gestión del Sistema</h2>
          <div className="management-grid">
            <Link to="/admin/usuarios" className="management-card">
              <div className="card-icon">👥</div>
              <h3>Usuarios</h3>
              <p>Crear, editar y eliminar técnicos y administradores</p>
              <span className="card-count">{stats?.resumen.totalUsuarios} técnicos</span>
            </Link>

            <Link to="/admin/clientes" className="management-card">
              <div className="card-icon">🏢</div>
              <h3>Clientes</h3>
              <p>Gestionar datos de clientes y empresas</p>
              <span className="card-count">{stats?.resumen.totalClientes} clientes</span>
            </Link>

            <Link to="/admin/servicios" className="management-card">
              <div className="card-icon">⚙️</div>
              <h3>Servicios</h3>
              <p>Administrar servicios y tipos de soporte</p>
              <span className="card-count">{stats?.resumen.totalServicios} servicios</span>
            </Link>

            <Link to="/admin/auditoria" className="management-card">
              <div className="card-icon">📋</div>
              <h3>Auditoría</h3>
              <p>Visualizar registro de cambios en el sistema</p>
              <span className="card-count">Historial completo</span>
            </Link>
          </div>
        </section>

        {/* Productividad por Técnico */}
        {stats && stats.productividadTecnico.length > 0 && (
          <section className="productivity-section">
            <h2>Productividad por Técnico</h2>
            <div className="table-container">
              <table className="productivity-table">
                <thead>
                  <tr>
                    <th>Técnico</th>
                    <th>Tickets Resueltos</th>
                    <th>Total Asignados</th>
                    <th>Tasa de Resolución</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.productividadTecnico.map(tech => (
                    <tr key={tech.id}>
                      <td>{tech.nombre}</td>
                      <td className="text-success">{tech.resueltos}</td>
                      <td>{tech.total}</td>
                      <td>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${tech.total > 0 ? (tech.resueltos / tech.total) * 100 : 0}%`
                            }}
                          />
                        </div>
                        {tech.total > 0 ? `${Math.round((tech.resueltos / tech.total) * 100)}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tickets por Cliente */}
        {stats && stats.porCliente.length > 0 && (
          <section className="clients-section">
            <h2>Tickets por Cliente</h2>
            <div className="table-container">
              <table className="clients-table">
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Total Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.porCliente.slice(0, 10).map(client => (
                    <tr key={client.id}>
                      <td>{client.empresa}</td>
                      <td className="badge">{client.total_tickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tickets por Servicio */}
        {stats && stats.porServicio.length > 0 && (
          <section className="services-section">
            <h2>Tickets por Servicio</h2>
            <div className="table-container">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Total Tickets</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.porServicio.slice(0, 10).map(service => (
                    <tr key={service.id}>
                      <td>{service.nombre}</td>
                      <td className="badge">{service.total_tickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
