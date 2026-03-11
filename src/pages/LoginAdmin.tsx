import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginAdmin.css';

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isDev = import.meta.env.DEV;
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.loginAdmin(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAccess = () => {
    setEmail('admin@local');
    setPassword('devpass');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="header-icon">⚙️</div>
          <h2>Acceso Administrador</h2>
          <p>Panel de Administración del Sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {isDev && (
          <div className="dev-section">
            <button
              type="button"
              className="quick-access-button"
              onClick={handleQuickAccess}
              disabled={loading}
            >
              🚀 Acceso Rápido Desarrollo
            </button>
            <p className="dev-hint">admin@local / devpass</p>
          </div>
        )}

        <div className="back-link">
          <a href="/login">← Volver a selección de rol</a>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
