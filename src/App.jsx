import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import PetPassport from './pages/PetPassport';
import HotelDaycare from './pages/HotelDaycare';
import Health from './pages/Health';
import Login from './pages/Login';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pets':
        return <PetPassport />;
      case 'hotel':
        return <HotelDaycare />;
      case 'health':
        return <Health />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return 'Painel';
      case 'pets':
        return 'Passaporte Pet';
      case 'hotel':
        return 'Hotel & Creche';
      case 'health':
        return 'Saúde';
      case 'settings':
        return 'Configurações';
      default:
        return 'Painel';
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {/* Header */}
        <header className="top-header">
          <div className="header-left">
            <h2>{getPageTitle()}</h2>
          </div>

          <div className="header-right">
            <div className="search-bar">
              <span className="material-icons">search</span>
              <input type="text" placeholder="Buscar..." />
            </div>

            <div className="language-selector">
              <img
                src="https://flagcdn.com/w40/br.png"
                alt="Bandeira do Brasil"
              />
              <span>Português (BR)</span>
              <span className="material-icons" style={{ fontSize: '16px' }}>expand_more</span>
            </div>

            <button className="notification-btn">
              <span className="material-icons">notifications</span>
              <span className="notification-badge"></span>
            </button>

            <div className="user-menu">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=6366F1&color=fff"
                alt="User avatar"
                className="user-avatar"
              />
              <div className="user-info-header">
                <p className="user-name">Admin</p>
                <p className="user-role">Manager</p>
              </div>
              <span className="material-icons" style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>expand_more</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        {renderContent()}

        {/* Mobile Bottom Navigation */}
        <div className="mobile-bottom-nav">
          <div className="mobile-nav-items">
            <button
              className={`mobile-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActivePage('dashboard')}
            >
              <span className="material-icons">dashboard</span>
              <span>Início</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'pets' ? 'active' : ''}`}
              onClick={() => setActivePage('pets')}
            >
              <span className="material-icons">pets</span>
              <span>Pets</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'hotel' ? 'active' : ''}`}
              onClick={() => setActivePage('hotel')}
            >
              <span className="material-icons">hotel</span>
              <span>Hotel</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'health' ? 'active' : ''}`}
              onClick={() => setActivePage('health')}
            >
              <span className="material-icons">favorite</span>
              <span>Saúde</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
