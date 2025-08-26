import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './components/Login';
import ProductList from './components/ProductList';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <div>
        {user && (
          <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
            <span>Welcome, {user.email}</span>
            <button 
              onClick={logout}
              style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
            >
              Logout
            </button>
          </nav>
        )}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;