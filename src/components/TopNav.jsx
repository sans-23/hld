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

import { useAuth } from '../context/AuthContext';

export default function TopNav({ onMenuClick }) {
  const { user, signInWithGoogle, logout } = useAuth();

  return (
    <header className="top-nav">
      <div className="logo-container">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <OuiiIcon />
        <span className="logo-text">ouii</span>
      </div>
      <div className="nav-actions">
        {user ? (
          <div className="user-profile-nav">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || 'User'} className="user-avatar" />
            ) : (
              <div className="user-avatar-placeholder">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="user-name-text">{user.displayName || 'Guest'}</span>
            <button className="btn btn-outline btn-sm" onClick={logout}>Sign Out</button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={signInWithGoogle}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
