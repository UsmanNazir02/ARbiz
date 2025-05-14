import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './components/pages/HomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/Dashboard';
import DesignCardPage from './components/pages/DesignCardPage';
import './App.css';
import MyCardsPage from './components/pages/MyCardsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage onLogin={handleLogin} />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
        <Route path="/card/new" element={isAuthenticated ? <DesignCardPage /> : <Navigate to="/login" replace />} />
        <Route path="/card/edit/:id" element={isAuthenticated ? <DesignCardPage /> : <Navigate to="/login" replace />} />
        <Route path="/my-cards" element={isAuthenticated ? <MyCardsPage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;