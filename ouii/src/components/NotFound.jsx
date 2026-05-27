import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="content-scrollable" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px 24px' }}>
      <h1 style={{ fontSize: '4rem', color: 'var(--primary)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Article Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', lineHeight: '1.6' }}>
        We couldn't find the article you're looking for. It might have been moved, or you may have typed the URL incorrectly.
      </p>
      <Link to="/networking" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '10px 24px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: '500' }}>
        Back to Networking Essentials
      </Link>
    </main>
  );
}
