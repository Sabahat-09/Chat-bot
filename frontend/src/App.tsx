import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuth';
import { Login } from './features/auth';
import { Register } from './features/auth';
import { ChatInterface } from './features/chat';
import { DocumentUpload } from './features/admin';
import { DocumentList } from './features/admin';
import { ThemeSwitcher } from './common/ThemeSwitcher';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/chat" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <div className="app">
        <ThemeSwitcher />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute requireAdmin>
                <DocumentUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/list"
            element={
              <ProtectedRoute requireAdmin>
                <DocumentList />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/chat" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

