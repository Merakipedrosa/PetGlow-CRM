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
        return 'Dashboard';
      case 'pets':
        return 'Pet Passport';
      case 'hotel':
        return 'Hotel & Daycare';
      case 'health':
        return 'Health Tracker';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      <main className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <h1 className="page-title">{getPageTitle()}</h1>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search here..." />
            </div>
          </div>

          <div className="top-bar-right">
            <button className="notification-btn">
              🔔
              <span className="notification-badge">3</span>
            </button>

            <div className="user-menu">
              <div className="avatar-sm">🐶</div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {renderContent()}

        {/* Mobile Bottom Navigation */}
        <div className="mobile-bottom-nav">
          <div className="mobile-nav-items">
            <button
              className={`mobile-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActivePage('dashboard')}
            >
              <span className="icon">📊</span>
              <span>Home</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'pets' ? 'active' : ''}`}
              onClick={() => setActivePage('pets')}
            >
              <span className="icon">🐾</span>
              <span>Pets</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'hotel' ? 'active' : ''}`}
              onClick={() => setActivePage('hotel')}
            >
              <span className="icon">🏨</span>
              <span>Hotel</span>
            </button>
            <button
              className={`mobile-nav-item ${activePage === 'health' ? 'active' : ''}`}
              onClick={() => setActivePage('health')}
            >
              <span className="icon">🩺</span>
              <span>Health</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
