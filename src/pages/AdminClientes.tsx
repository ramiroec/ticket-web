import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminClientes.css';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  direccion?: string;
}

const AdminClientes: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.nombre || !formData.email) {
      setError('Nombre y email son obligatorios');
      return;
    }

    try {
      await api.post('/clientes', formData);
      setMessage('Cliente creado exitosamente');
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      setShowForm(false);
      fetchClientes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de eliminar este cliente?')) return;

    try {
      await api.del(`/clientes/${id}`);
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
            <h1>👥 Gestión de Clientes</h1>
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
            <h2>Clientes</h2>
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
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <textarea
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  rows={3}
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
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td className="id-cell">#{cliente.id}</td>
                      <td>{cliente.nombre}</td>
                      <td><a href={`mailto:${cliente.email}`}>{cliente.email}</a></td>
                      <td>{cliente.telefono || '—'}</td>
                      <td>{cliente.direccion || '—'}</td>
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