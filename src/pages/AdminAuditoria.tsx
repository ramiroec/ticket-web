import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import './AdminAuditoria.css';

interface AuditoriaRecord {
  id: number;
  tabla: string;
  operacion: string;
  usuario_id: number;
  usuario_nombre: string;
  fecha: string;
  datos_anteriores: any;
  datos_nuevos: any;
}

const AdminAuditoria: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<AuditoriaRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    tabla: '',
    operacion: '',
    usuario_id: ''
  });

  useEffect(() => {
    fetchAuditoria();
  }, [filters]);

  const fetchAuditoria = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.tabla) params.append('tabla', filters.tabla);
      if (filters.operacion) params.append('operacion', filters.operacion);
      if (filters.usuario_id) params.append('usuario_id', filters.usuario_id);

      const data = await api.get(`/auditoria?${params.toString()}`);
      setRecords(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('es-ES');
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
            <h1>📋 Registro de Auditoría</h1>
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
        <div className="filters-card">
          <h3>Filtros</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Tabla</label>
              <select
                value={filters.tabla}
                onChange={e => handleFilterChange('tabla', e.target.value)}
              >
                <option value="">Todas las tablas</option>
                <option value="usuarios">Usuarios</option>
                <option value="clientes">Clientes</option>
                <option value="servicios">Servicios</option>
                <option value="tickets">Tickets</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Operación</label>
              <select
                value={filters.operacion}
                onChange={e => handleFilterChange('operacion', e.target.value)}
              >
                <option value="">Todas las operaciones</option>
                <option value="INSERT">Crear (INSERT)</option>
                <option value="UPDATE">Actualizar (UPDATE)</option>
                <option value="DELETE">Eliminar (DELETE)</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Usuario ID</label>
              <input
                type="number"
                placeholder="ID del usuario"
                value={filters.usuario_id}
                onChange={e => handleFilterChange('usuario_id', e.target.value)}
                min="0"
              />
            </div>
          </div>
          <button className="reset-button" onClick={() => {
            setFilters({ tabla: '', operacion: '', usuario_id: '' });
          }}>
            Limpiar Filtros
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Cargando registros de auditoría...</div>
        ) : records.length === 0 ? (
          <div className="no-records">No hay registros de auditoría que coincidan con los filtros</div>
        ) : (
          <div className="records-container">
            <div className="records-info">
              Mostrando {records.length} registros
            </div>
            <div className="records-list">
              {records.map(record => (
                <div key={record.id} className="audit-record">
                  <div className="record-header">
                    <div className="record-main">
                      <span className="record-id">#{record.id}</span>
                      <span className="record-table">{record.tabla}</span>
                      <span className={`operation-badge ${record.operacion.toLowerCase()}`}>
                        {record.operacion}
                      </span>
                    </div>
                    <div className="record-meta">
                      <span className="record-user">Por: {record.usuario_nombre || 'Sistema'}</span>
                      <span className="record-date">{formatDate(record.fecha)}</span>
                    </div>
                  </div>

                  {record.operacion === 'UPDATE' && (
                    <div className="record-details">
                      <div className="changes-grid">
                        {record.datos_anteriores && Object.keys(record.datos_anteriores).length > 0 && (
                          <div className="change-section">
                            <h4>Datos Anteriores</h4>
                            <pre className="json-display">
                              {JSON.stringify(record.datos_anteriores, null, 2)}
                            </pre>
                          </div>
                        )}
                        {record.datos_nuevos && Object.keys(record.datos_nuevos).length > 0 && (
                          <div className="change-section">
                            <h4>Datos Nuevos</h4>
                            <pre className="json-display">
                              {JSON.stringify(record.datos_nuevos, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(record.operacion === 'INSERT' || record.operacion === 'DELETE') && record.datos_nuevos && (
                    <div className="record-details">
                      <div className="single-data">
                        <h4>Datos {record.operacion === 'INSERT' ? 'Creados' : 'Eliminados'}</h4>
                        <pre className="json-display">
                          {JSON.stringify(record.datos_nuevos, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminAuditoria;
