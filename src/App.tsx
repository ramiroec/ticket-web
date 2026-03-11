import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginClient from "./pages/LoginClient";
import LoginTech from "./pages/LoginTech";
import LoginAdmin from "./pages/LoginAdmin";
import LoginChoice from "./pages/LoginChoice";
import Access from "./pages/Access";
import ClientDashboard from "./pages/ClientDashboard";
import ClientTicketDetail from "./pages/ClientTicketDetail";
import ClientNewTicket from "./pages/ClientNewTicket";
import TechDashboard from "./pages/TechDashboard";
import TechTicketDetail from "./pages/TechTicketDetail";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuditoria from "./pages/AdminAuditoria";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminClientes from "./pages/AdminClientes";
import AdminServicios from "./pages/AdminServicios";

const PrivateRoute: React.FC<{ children: React.ReactNode; type: "cliente" | "tecnico" | "admin" }> = ({ children, type }) => {
  const auth = useAuth();
  if (!auth.user || auth.type !== type) {
    // redirect to appropriate login
    const loginPath = type === 'cliente' ? '/login/client' : type === 'tecnico' ? '/login/tech' : '/login/admin';
    return <Navigate to={loginPath} replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginChoice />} />
          <Route path="/login/client" element={<LoginClient />} />
          <Route path="/login/tech" element={<LoginTech />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route path="/access" element={<Access />} />

          <Route path="/client" element={<PrivateRoute type="cliente"><ClientDashboard /></PrivateRoute>} />
          <Route path="/client/new" element={<PrivateRoute type="cliente"><ClientNewTicket /></PrivateRoute>} />
          <Route path="/client/tickets/:id" element={<PrivateRoute type="cliente"><ClientTicketDetail /></PrivateRoute>} />

          <Route path="/tech" element={<PrivateRoute type="tecnico"><TechDashboard /></PrivateRoute>} />
          <Route path="/tech/tickets/:id" element={<PrivateRoute type="tecnico"><TechTicketDetail /></PrivateRoute>} />

          <Route path="/admin" element={<PrivateRoute type="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/auditoria" element={<PrivateRoute type="admin"><AdminAuditoria /></PrivateRoute>} />
          <Route path="/admin/usuarios" element={<PrivateRoute type="admin"><AdminUsuarios /></PrivateRoute>} />
          <Route path="/admin/clientes" element={<PrivateRoute type="admin"><AdminClientes /></PrivateRoute>} />
          <Route path="/admin/servicios" element={<PrivateRoute type="admin"><AdminServicios /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
