import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { FileUploadComponent } from './components/FileUploadComponent';
import { ImageList } from './components/ImageList';
import { ReportGenerator } from './components/ReportGenerator';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Login } from './components/auth/Login';
import { Signup } from './components/auth/Signup';
import { ResetPassword } from './components/auth/ResetPassword';
import { IntegrationConfig } from './components/integrations/IntegrationConfig';
import { ClaimProvider } from './contexts/ClaimContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Toast } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <LoadingSpinner size="lg" color="white" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Dashboard component
const Dashboard = () => {
  const [currentView, setCurrentView] = useState('upload');
  
  return (
    <ClaimProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell currentView={currentView} onViewChange={setCurrentView}>
          {currentView === 'upload' && <FileUploadComponent />}
          {currentView === 'photos' && <ImageList />}
          {currentView === 'reports' && <ReportGenerator />}
          {currentView === 'analytics' && <Analytics />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'integrations' && <IntegrationConfig />}
        </AppShell>
      </div>
    </ClaimProvider>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <Toast />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
