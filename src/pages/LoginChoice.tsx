import React from 'react';
import { Link } from 'react-router-dom';
import './LoginChoice.css';

const LoginChoice: React.FC = () => (
  <div className="choice-container">
    <div className="choice-header">
      <h1>Sistema de Gestión de Tickets</h1>
      <p>Selecciona tu tipo de acceso</p>
    </div>
    
    <div className="choice-grid">
      <Link to="/login/client" className="choice-card client-card">
        <div className="card-icon">👤</div>
        <h2>Cliente</h2>
        <p>Iniciar sesión como cliente para reportar y hacer seguimiento de tickets</p>
      </Link>
      
      <Link to="/login/tech" className="choice-card tech-card">
        <div className="card-icon">👨‍💻</div>
        <h2>Técnico</h2>
        <p>Panel de técnicos para gestionar y resolver tickets de soporte</p>
      </Link>
      
      <Link to="/login/admin" className="choice-card admin-card">
        <div className="card-icon">👑</div>
        <h2>Administrador</h2>
        <p>Acceso de administrador para gestionar usuarios, servicios y auditorías</p>
      </Link>
    </div>
  </div>
);

export default LoginChoice;
