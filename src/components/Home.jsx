import React from 'react';
import { useNavigate } from 'react-router-dom';
import { countCompleted, SYSTEM_DESIGN_SECTIONS, JAVA_SECTIONS } from '../config/navigation';
import './Home.css';

// SVG Icons for different tracks
const HldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <path d="M6 1v3" />
    <path d="M10 1v3" />
    <path d="M14 1v3" />
  </svg>
);

const LldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const DsaIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <line x1="12" y1="8" x2="6.5" y2="16" />
    <line x1="12" y1="8" x2="17.5" y2="16" />
  </svg>
);

const BehavioralIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Home() {
  const navigate = useNavigate();

  const hldStats = countCompleted(SYSTEM_DESIGN_SECTIONS);
  const javaStats = countCompleted(JAVA_SECTIONS);

  return (
    <div className="home-dashboard">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-tagline">Interview Prep Reimagined</div>
        <h1>ready4interview</h1>
        <p className="hero-desc">
          Accelerate your prep with curated, production-grade technical interview resources. Designed for developers with visually rich vector diagrams, interactive code toggles, and direct conceptual depth.
        </p>
      </div>

      {/* Main Track Selection */}
      <div className="home-tracks-section">
        <h2 className="section-title">Select an Interview Track</h2>
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
              Master distributed systems design. Covers networking layers, caching policies, database sharding, locking contention, and multi-step microservice transactions.
            </p>
            <div className="track-stats">
              <span className="stats-label">{hldStats.total} modules unlocked</span>
              <span className="stats-progress">{hldStats.completed}/{hldStats.total} completed</span>
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
              Deep dive into Java language internals. Covers collections framework, concurrent lockings, memory structures, garbage collection algorithms, and virtual threads.
            </p>
            <div className="track-stats">
              <span className="stats-label">{javaStats.total} modules unlocked</span>
              <span className="stats-progress">{javaStats.completed}/{javaStats.total} completed</span>
            </div>
            <button className="btn btn-primary track-btn" onClick={() => navigate('/java-map')}>
              Explore Java Track
            </button>
          </div>
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <LldIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Low-Level Design (LLD)</h3>
            <p className="track-desc">
              Master object-oriented design principles (SOLID), design patterns, entity modeling, schema mappings, and coding clean architectural frameworks.
            </p>
            <div className="track-stats">
              <span className="stats-label">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

          {/* DSA Card (Locked) */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <DsaIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Algorithms & Coding (DSA)</h3>
            <p className="track-desc">
              Review high-frequency LeetCode algorithmic patterns: dynamic programming, graph traversals, tree balancing, and complex data structures.
            </p>
            <div className="track-stats">
              <span className="stats-label">Coming Soon</span>
            </div>
            <button className="btn btn-outline track-btn" disabled>
              Locked
            </button>
          </div>

          {/* Behavioral Card (Locked) */}
          <div className="track-card track-card--locked">
            <div className="track-card-header">
              <div className="track-icon locked-theme">
                <BehavioralIcon />
              </div>
              <span className="track-badge badge-locked">Locked</span>
            </div>
            <h3 className="track-title">Behavioral Round</h3>
            <p className="track-desc">
              Master the STAR method. Structure key stories around ownership, handling conflict, delivering projects, and aligning with core leadership values.
            </p>
            <div className="track-stats">
              <span className="stats-label">Coming Soon</span>
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
