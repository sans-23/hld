import React from 'react';
import './TopNav.css';

const OuiiIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="var(--primary)" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 12l4 4 12-12" />
    <path d="M9 18l3 3 8-8" style={{ opacity: 0.6 }} />
  </svg>
);

export default function TopNav({ onMenuClick }) {
  return (
    <header className="top-nav">
      <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className="logo-container">
        <OuiiIcon />
        <span className="logo-text">ouii</span>
      </div>
      <div className="nav-actions">
        <button className="btn btn-outline">Log in</button>
        <button className="btn btn-accent">Sign up</button>
      </div>
    </header>
  );
}
