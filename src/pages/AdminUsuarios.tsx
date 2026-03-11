import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminUsuarios.css';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

const AdminUsuarios: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'tecnico'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await api.get('/usuarios');
      setUsuarios(data);
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

    if (!formData.nombre || !formData.email || !formData.password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      const data = await api.post('/usuarios', formData);

      if (!Response.ok) {
        const errorData = await Response.json();
        throw new Error(errorData.error || 'Error al crear usuario');
      }

      setMessage('Usuario creado exitosamente');
      setFormData({ nombre: '', email: '', password: '', rol: 'tecnico' });
      setShowForm(false);
      fetchUsuarios();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;

    try {
      await api.del(`/usuarios/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar usuario');
      }

      setMessage('Usuario eliminado exitosamente');
      fetchUsuarios();
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
            <h1>👥 Gestión de Usuarios</h1>
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
            <h2>Usuarios del Sistema</h2>
            <button
              className="add-button"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Crear Usuario'}
            </button>
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          {showForm && (
            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="usuario@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rol</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                >
                  <option value="tecnico">Técnico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <button type="submit" className="submit-button">
                Crear Usuario
              </button>
            </form>
          )}

          {loading ? (
            <div className="loading">Cargando usuarios...</div>
          ) : usuarios.length === 0 ? (
            <div className="no-records">No hay usuarios registrados</div>
          ) : (
            <div className="table-container">
              <table className="usuarios-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(usuario => (
                    <tr key={usuario.id}>
                      <td className="id-cell">#{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td><a href={`mailto:${usuario.email}`}>{usuario.email}</a></td>
                      <td>
                        <span className={`role-badge ${usuario.rol}`}>
                          {usuario.rol === 'tecnico' ? '👨‍💻 Técnico' : '⚙️ Admin'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(usuario.id)}
                          title="Eliminar usuario"
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

export default AdminUsuarios;
