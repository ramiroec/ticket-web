import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminUsuarios.css';

interface Cliente {
  id: number;
  empresa: string;
  contacto: string;
  email: string;
  sla?: string;
}

const AdminClientes: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    empresa: '',
    contacto: '',
    email: '',
    sla: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await api.get('/clientes');
      setClientes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.empresa || !formData.email) {
      setError('Empresa y email son obligatorios');
      return;
    }

    try {
      const data = await api.post('/clientes', formData);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear cliente');
      }

      setMessage('Cliente creado exitosamente');
      setFormData({ empresa: '', contacto: '', email: '', sla: '' });
      setShowForm(false);
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este cliente?')) return;

    try {
      await api.del(`/clientes/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar cliente');
      }

      setMessage('Cliente eliminado exitosamente');
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!auth.user || auth.type !== 'admin') {
    navigate('/login');
    return null;
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="header-content">
          <div className="header-title">
            <button className="back-button" onClick={handleBack}>←</button>
            <h1>🏢 Gestión de Clientes</h1>
          </div>
          <div className="header-actions">
            <span className="user-info">{auth.user.email}</span>
            <button onClick={auth.logout} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="admin-page-main">
        <div className="content-card">
          <div className="card-header">
            <h2>Clientes de la Plataforma</h2>
            <button
              className="add-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Crear Cliente'}
            </button>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  placeholder="Nombre de la empresa"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contacto</label>
                <input
                  type="text"
                  name="contacto"
                  value={formData.contacto}
                  onChange={handleInputChange}
                  placeholder="Nombre del contacto"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="cliente@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>SLA</label>
                <input
                  type="text"
                  name="sla"
                  value={formData.sla}
                  onChange={handleInputChange}
                  placeholder="Ej: 24 horas, Estándar"
                />
              </div>

              <button type="submit" className="submit-button">
                Crear Cliente
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading">Cargando clientes...</div>
          ) : clientes.length === 0 ? (
            <div className="no-records">No hay clientes registrados</div>
          ) : (
            <div className="table-container">
              <table className="clientes-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Empresa</th>
                    <th>Contacto</th>
                    <th>Email</th>
                    <th>SLA</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td className="id-cell">#{cliente.id}</td>
                      <td>{cliente.empresa}</td>
                      <td>{cliente.contacto}</td>
                      <td><a href={`mailto:${cliente.email}`} className="info-link">{cliente.email}</a></td>
                      <td>
                        {cliente.sla ? (
                          <span className="role-badge cliente">{cliente.sla}</span>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(cliente.id)}
                          title="Eliminar cliente"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminClientes;
