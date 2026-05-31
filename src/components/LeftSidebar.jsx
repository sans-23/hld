import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { SYSTEM_DESIGN_SECTIONS, JAVA_SECTIONS, getTrackByArticleId, countCompleted } from '../config/navigation';
import './Sidebar.css';

const ChevronIcon = ({ expanded }) => (
  <svg className={`sidebar-chevron ${expanded ? 'sidebar-chevron--expanded' : ''}`} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="nav-item-icon nav-item-icon--check" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.12" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LockIcon = () => (
  <svg className="nav-item-icon nav-item-icon--lock" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CircleIcon = () => (
  <svg className="nav-item-icon nav-item-icon--circle" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="3" fill="currentColor" fillOpacity="0.25" />
  </svg>
);

function NavItem({ label, href, status }) {
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  const icon = isCompleted ? <CheckCircleIcon /> : isLocked ? <LockIcon /> : <CircleIcon />;

  if (isLocked) {
    return (
      <li>
        <span className="nav-item nav-item--locked" aria-disabled="true">
          {icon}
          <span className="nav-item-label">{label}</span>
          <span className="nav-item-badge">PRO</span>
        </span>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={href}
        className={({ isActive }) => [
          'nav-item',
          isActive && 'nav-item--active',
          isCompleted && 'nav-item--completed'
        ].filter(Boolean).join(' ')}
      >
        {icon}
        <span className="nav-item-label">{label}</span>
      </NavLink>
    </li>
  );
}

function SidebarSection({ section }) {
  const [expanded, setExpanded] = useState(section.defaultExpanded);

  return (
    <div className="sidebar-section">
      <button
        className="sidebar-header"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <ChevronIcon expanded={expanded} />
        <span className="sidebar-header-title">{section.title}</span>
        <span className="sidebar-header-count">{section.items.length}</span>
      </button>

      <div className={`sidebar-collapse ${expanded ? 'sidebar-collapse--open' : ''}`}>
        <ul className="nav-list">
          {section.items.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LeftSidebar({ isOpen }) {
  const location = useLocation();
  const articleId = location.pathname.substring(1);
  const track = getTrackByArticleId(articleId) || 'system-design';

  const sections = track === 'java' ? JAVA_SECTIONS : SYSTEM_DESIGN_SECTIONS;
  const brandTitle = track === 'java' ? 'Java Deep Dive' : 'Learn System Design';

  const { completed, total } = countCompleted(sections);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className={`left-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand-title" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        {brandTitle}
      </div>
      {/* Progress indicator */}
      <div className="sidebar-progress">
        <div className="sidebar-progress-header">
          <span className="sidebar-progress-label">Your Progress</span>
          <span className="sidebar-progress-value">
            {completed}/{total} completed
          </span>
        </div>
        <div className="sidebar-progress-track">
          <div
            className="sidebar-progress-fill"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
      </div>

      {/* Navigation sections */}
      {sections.map((section) => (
        <SidebarSection key={section.id} section={section} />
      ))}
    </aside>
  );
}
