import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, setActivePage }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'pets', label: 'Pet Passport', icon: '🐾' },
    { id: 'hotel', label: 'Hotel & Daycare', icon: '🏨' },
    { id: 'health', label: 'Health Tracker', icon: '🩺' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const handleMenuClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div className="logo-container">
          <h1 className="logo">
            <span className="logo-icon">🐾</span>
            PetGlow
          </h1>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
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
    </>
  );
};

export default Sidebar;
