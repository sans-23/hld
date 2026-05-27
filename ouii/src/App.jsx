import React, { useState } from 'react';
import TopNav from './components/TopNav';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MainContent from './components/MainContent';
import './index.css';

function App() {
  const [activeArticleId, setActiveArticleId] = useState('networking');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle hash changes for navigation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validArticles = [
        'networking', 'api-design', 'data-modeling', 'caching', 
        'sharding', 'consistent-hashing', 'cap-theorem', 
        'db-indexing', 'numbers-to-know', 'redis', 'elasticsearch',
        'kafka', 'api-gateway', 'cassandra', 'dynamodb', 'postgresql',
        'flink', 'zookeeper', 'time-series'
      ];
      if (hash && validArticles.includes(hash)) {
        setActiveArticleId(hash);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Sync active ID on initial mount if hash exists
    if (window.location.hash) {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (id) => {
    window.location.hash = id;
    setActiveArticleId(id);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <TopNav onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="main-layout">
        <div className={`mobile-backdrop ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />
        <LeftSidebar activeArticleId={activeArticleId} onNavigate={handleNavigate} isOpen={isMobileMenuOpen} />
        <MainContent activeArticleId={activeArticleId} />
        <RightSidebar activeArticleId={activeArticleId} />
      </div>
    </div>
  );
}

export default App;
