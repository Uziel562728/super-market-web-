import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/admin/login', { replace: true });
    } catch (err) {
      console.error('Error closing session:', err);
    }
  };

  return (
    <div className="admin-dashboard-layout">
      {/* Admin Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <h3>Big Sale</h3>
          <span>Administración</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink 
            to="/admin/products" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            📦 Productos
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            🏷️ Categorías
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => navigate('/')} className="sidebar-btn btn-view-site">
            🌐 Ir al Sitio Público
          </button>
          <button onClick={handleLogout} className="sidebar-btn btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="admin-content-area">
        <header className="admin-content-header">
          <h2>Panel de Administración</h2>
          <div className="admin-badge">🔐 Privado</div>
        </header>
        <div className="admin-page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
