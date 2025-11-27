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

  if (!session) {
    return <Login />;
  }

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
