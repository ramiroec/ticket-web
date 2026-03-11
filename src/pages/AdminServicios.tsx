import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminServicios.css';

interface Servicio {
  id: number;
  cliente_id: number;
  nombre: string;
  tipo: string;
}

interface Cliente {
  id: number;
  empresa: string;
}

const AdminServicios: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    nombre: '',
    tipo: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviciosData, clientesData] = await Promise.all([
        api.get('/servicios'),
        api.get('/clientes')
      ]);

      setServicios(serviciosData);
      setClientes(clientesData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!formData.cliente_id || !formData.nombre) {
      setError('Cliente y nombre son obligatorios');
      return;
    }

    try {
      await api.post('/servicios', {
        ...formData,
        cliente_id: parseInt(formData.cliente_id)
      });

      setMessage('Servicio creado exitosamente');
      setFormData({ cliente_id: '', nombre: '', tipo: '' });
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este servicio?')) return;

    try {
      await api.del(`/servicios/${id}`);
      setMessage('Servicio eliminado exitosamente');
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getClienteName = (clienteId: number): string => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.empresa : 'Desconocido';
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
            <h1>⚙️ Gestión de Servicios</h1>
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
            <h2>Servicios de Soporte</h2>
            <button
              className="add-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Crear Servicio'}
            </button>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Cliente</label>
                <select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.empresa}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Nombre del Servicio</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Soporte Técnico 24/7"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  placeholder="Ej: Premium, Estándar"
                />
              </div>

              <button type="submit" className="submit-button">
                Crear Servicio
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading">Cargando servicios...</div>
          ) : servicios.length === 0 ? (
            <div className="no-records">No hay servicios registrados</div>
          ) : (
            <div className="table-container">
              <table className="servicios-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map(servicio => (
                    <tr key={servicio.id}>
                      <td className="id-cell">#{servicio.id}</td>
                      <td>{getClienteName(servicio.cliente_id)}</td>
                      <td>{servicio.nombre}</td>
                      <td>
                        {servicio.tipo ? (
                          <span className="role-badge cliente">{servicio.tipo}</span>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(servicio.id)}
                          title="Eliminar servicio"
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

export default AdminServicios;