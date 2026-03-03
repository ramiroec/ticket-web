import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginClient from "./pages/LoginClient";
import LoginTech from "./pages/LoginTech";
import LoginChoice from "./pages/LoginChoice";
import Access from "./pages/Access";
import ClientDashboard from "./pages/ClientDashboard";
import ClientTicketDetail from "./pages/ClientTicketDetail";
import ClientNewTicket from "./pages/ClientNewTicket";
import TechDashboard from "./pages/TechDashboard";
import TechTicketDetail from "./pages/TechTicketDetail";

const PrivateRoute: React.FC<{ children: React.ReactNode; type: "cliente" | "tecnico" }> = ({ children, type }) => {
  const auth = useAuth();
  if (!auth.user || auth.type !== type) {
    // redirect to appropriate login
    return <Navigate to={type === 'cliente' ? '/login/client' : '/login/tech'} replace />;
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
          <Route path="/access" element={<Access />} />

          <Route path="/client" element={<PrivateRoute type="cliente"><ClientDashboard /></PrivateRoute>} />
          <Route path="/client/new" element={<PrivateRoute type="cliente"><ClientNewTicket /></PrivateRoute>} />
          <Route path="/client/tickets/:id" element={<PrivateRoute type="cliente"><ClientTicketDetail /></PrivateRoute>} />

          <Route path="/tech" element={<PrivateRoute type="tecnico"><TechDashboard /></PrivateRoute>} />
          <Route path="/tech/tickets/:id" element={<PrivateRoute type="tecnico"><TechTicketDetail /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
