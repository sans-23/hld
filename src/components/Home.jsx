import React from 'react';
import { useNavigate } from 'react-router-dom';
import { countCompleted, SYSTEM_DESIGN_SECTIONS, JAVA_SECTIONS } from '../config/navigation';
import './Home.css';

// SVG Icons for different tracks (24px sized for compactness)
const HldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="6" height="6" rx="1" />
    <rect x="16" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <line x1="8" y1="5" x2="16" y2="5" />
    <line x1="8" y1="19" x2="16" y2="19" />
    <line x1="5" y1="8" x2="5" y2="16" />
    <line x1="19" y1="8" x2="19" y2="16" />
  </svg>
);

const JavaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3" />
    <path d="M10 1v3" />
    <path d="M14 1v3" />
  </svg>
);

const LldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const DsaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <line x1="12" y1="8" x2="6.5" y2="16" />
    <line x1="12" y1="8" x2="17.5" y2="16" />
  </svg>
);

const DbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
  </svg>
);

const BehavioralIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();

  const hldStats = countCompleted(SYSTEM_DESIGN_SECTIONS);
  const javaStats = countCompleted(JAVA_SECTIONS);

  return (
    <div className="home-dashboard">
      {/* Minimalist Page Header */}
      <header className="home-header">
        <div className="home-brand">ready4interview</div>
        <h1>Technical Interview Playbooks</h1>
        <p className="home-subtitle">
          Curated, production-grade learning resources designed for software engineers.
        </p>
      </header>

      {/* Main Track Selection Grid */}
      <div className="home-tracks-section">
        <div className="tracks-grid">
          
          {/* System Design (HLD) Card */}
          <div className="track-card track-card--active">
            <div className="track-card-header">
              <div className="track-icon hld-theme">
                <HldIcon />
              </div>
              <span className="track-badge badge-active">Active</span>
            </div>
            <h3 className="track-title">System Design (HLD)</h3>
            <p className="track-desc">
              Master distributed systems, networking layers, caching policies, database sharding, lock contention, and transaction sagas.
            </p>
            <div className="track-stats">
              <span>{hldStats.total} modules</span>
              <span className="stats-progress">{hldStats.completed}/{hldStats.total} done</span>
            </div>
            <button className="btn btn-primary track-btn" onClick={() => navigate('/networking')}>
              Explore HLD Track
            </button>
          </div>

          {/* Java Deep Dive Card */}
          <div className="track-card track-card--active">
            <div className="track-card-header">
              <div className="track-icon java-theme">
                <JavaIcon />
              </div>
              <span className="track-badge badge-active">Active</span>
            </div>
            <h3 className="track-title">Java Deep Dive</h3>
            <p className="track-desc">
              Master collections, concurrent locks, runtime memory data areas, garbage collection tuning, and Virtual Threads.
            </p>
            <div className="track-stats">
              <span>{javaStats.total} modules</span>
              <span className="stats-progress">{javaStats.completed}/{javaStats.total} done</span>
            </div>
            <button className="btn btn-primary track-btn" onClick={() => navigate('/java-map')}>
              Explore Java Track
            </button>
          </div>

          {/* Low-Level Design Card */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <LldIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Low-Level Design (LLD)</h3>
            <p className="track-desc">
              Design clean object-oriented systems with SOLID design patterns, class structures, entity modeling, and clean architectures.
            </p>
            <div className="track-stats">
              <span className="stats-coming-soon">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

          {/* DSA Card */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <DsaIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Algorithms (DSA)</h3>
            <p className="track-desc">
              Review critical coding interview patterns: dynamic programming, graph traversals, heap queues, and complex structures.
            </p>
            <div className="track-stats">
              <span className="stats-coming-soon">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

          {/* Database Internals Card */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <DbIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Database Internals</h3>
            <p className="track-desc">
              Master storage engine models (LSM Trees, B-Trees), transaction isolation levels, replication topologies, and consensus engines.
            </p>
            <div className="track-stats">
              <span className="stats-coming-soon">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

          {/* Behavioral Round Card */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <BehavioralIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Behavioral Round</h3>
            <p className="track-desc">
              Learn the STAR method to structure leadership stories, resolve team conflicts, and demonstrate end-to-end project ownership.
            </p>
            <div className="track-stats">
              <span className="stats-coming-soon">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
