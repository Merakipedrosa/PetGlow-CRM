import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pets', label: 'Pet Passport', icon: '🐾' },
    { id: 'hotel', label: 'Hotel & Daycare', icon: '🏨' },
    { id: 'health', label: 'Health Tracker', icon: '🩺' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="sidebar glass-panel">
      <div className="logo-container">
        <h1 className="logo text-gradient">PetGlow</h1>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="user-profile">
        <div className="avatar">🐶</div>
        <div className="user-info">
          <p className="name">Admin User</p>
          <p className="role">Manager</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
