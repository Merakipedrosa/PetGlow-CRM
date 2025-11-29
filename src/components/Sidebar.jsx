import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ activePage, setActivePage }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: 'dashboard' },
    { id: 'pets', label: 'Passaporte Pet', icon: 'pets' },
    { id: 'hotel', label: 'Hotel & Creche', icon: 'hotel' },
    { id: 'health', label: 'Saúde', icon: 'favorite' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  const handleMenuClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <span className="material-icons">{isMobileOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        <div>
          <div className="logo-container">
            <div className="logo">
              <div className="logo-icon">
                <span className="material-icons">pets</span>
              </div>
              <h1 className="logo-text">PetGlow</h1>
            </div>
          </div>

          <nav className="nav-menu">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="material-icons">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="user-profile">
          <button className="sign-out-btn">
            <span className="material-icons">logout</span>
            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
