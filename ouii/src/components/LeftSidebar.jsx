import React, { useState } from 'react';
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

const SECTIONS = [
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    defaultExpanded: true,
    items: [
      { id: 'networking', label: 'Networking Essentials', href: '#networking', status: 'default' },
      { id: 'api-design', label: 'API Design', href: '#api-design', status: 'default' },
      { id: 'data-modeling', label: 'Data Modeling', href: '#data-modeling', status: 'default' },
      { id: 'caching', label: 'Caching', href: '#caching', status: 'default' },
      { id: 'sharding', label: 'Sharding', href: '#sharding', status: 'default' },
      { id: 'consistent-hashing', label: 'Consistent Hashing', href: '#consistent-hashing', status: 'default' },
      { id: 'cap-theorem', label: 'CAP Theorem', href: '#cap-theorem', status: 'default' },
      { id: 'db-indexing', label: 'Database Indexing', href: '#db-indexing', status: 'default' },
      { id: 'numbers-to-know', label: 'Numbers to Know', href: '#numbers-to-know', status: 'default' },
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    defaultExpanded: false,
    items: [
      { id: 'real-time', label: 'Real-time Updates', href: '#real-time', status: 'locked' },
      { id: 'contention', label: 'Dealing with Contention', href: '#contention', status: 'locked' },
      { id: 'multi-step', label: 'Multi-step Processes', href: '#multi-step', status: 'locked' },
      { id: 'scaling-reads', label: 'Scaling Reads', href: '#scaling-reads', status: 'locked' },
      { id: 'scaling-writes', label: 'Scaling Writes', href: '#scaling-writes', status: 'locked' },
      { id: 'large-blobs', label: 'Handling Large Blobs', href: '#large-blobs', status: 'locked' },
      { id: 'long-running', label: 'Managing Long Running Tasks', href: '#long-running', status: 'locked' },
    ],
  },
  {
    id: 'key-technologies',
    title: 'Key Technologies',
    defaultExpanded: false,
    items: [
      { id: 'redis', label: 'Redis', href: '#redis', status: 'default' },
      { id: 'elasticsearch', label: 'Elasticsearch', href: '#elasticsearch', status: 'default' },
      { id: 'kafka', label: 'Kafka', href: '#kafka', status: 'default' },
      { id: 'api-gateway', label: 'API Gateway', href: '#api-gateway', status: 'default' },
      { id: 'cassandra', label: 'Cassandra', href: '#cassandra', status: 'default' },
      { id: 'dynamodb', label: 'DynamoDB', href: '#dynamodb', status: 'default' },
      { id: 'postgresql', label: 'PostgreSQL', href: '#postgresql', status: 'default' },
      { id: 'flink', label: 'Flink', href: '#flink', status: 'default' },
      { id: 'zookeeper', label: 'ZooKeeper', href: '#zookeeper', status: 'default' },
    ],
  },
  {
    id: 'advanced-topics',
    title: 'Advanced Topics',
    defaultExpanded: false,
    items: [
      { id: 'time-series', label: 'Time Series Databases', href: '#time-series', status: 'default' },
      { id: 'data-structures', label: 'Data Structures for Big Data', href: '#data-structures', status: 'locked' },
      { id: 'vector-databases', label: 'Vector Databases', href: '#vector-databases', status: 'locked' },
    ],
  },
  {
    id: 'question-breakdowns',
    title: 'Question Breakdowns',
    defaultExpanded: false,
    items: [
      { id: 'bitly', label: 'Bitly', href: '#bitly', status: 'locked' },
      { id: 'dropbox', label: 'Dropbox', href: '#dropbox', status: 'locked' },
      { id: 'local-delivery', label: 'Local Delivery Service', href: '#local-delivery', status: 'locked' },
      { id: 'ticketmaster', label: 'Ticketmaster', href: '#ticketmaster', status: 'locked' },
      { id: 'news-feed', label: 'FB News Feed', href: '#news-feed', status: 'locked' },
      { id: 'tinder', label: 'Tinder', href: '#tinder', status: 'locked' },
      { id: 'leetcode', label: 'LeetCode', href: '#leetcode', status: 'locked' },
      { id: 'whatsapp', label: 'WhatsApp', href: '#whatsapp', status: 'locked' },
      { id: 'rate-limiter', label: 'Rate Limiter', href: '#rate-limiter', status: 'locked' },
      { id: 'live-comments', label: 'FB Live Comments', href: '#live-comments', status: 'locked' },
      { id: 'post-search', label: 'FB Post Search', href: '#post-search', status: 'locked' },
      { id: 'youtube-top-k', label: 'YouTube Top K', href: '#youtube-top-k', status: 'locked' },
      { id: 'uber', label: 'Uber', href: '#uber', status: 'locked' },
      { id: 'youtube', label: 'YouTube', href: '#youtube', status: 'locked' },
      { id: 'web-crawler', label: 'Web Crawler', href: '#web-crawler', status: 'locked' },
      { id: 'ad-click', label: 'Ad Click Aggregator', href: '#ad-click', status: 'locked' },
      { id: 'news-aggregator', label: 'News Aggregator', href: '#news-aggregator', status: 'locked' },
      { id: 'yelp', label: 'Yelp', href: '#yelp', status: 'locked' },
      { id: 'strava', label: 'Strava', href: '#strava', status: 'locked' },
      { id: 'online-auction', label: 'Online Auction', href: '#online-auction', status: 'locked' },
      { id: 'price-tracking', label: 'Price Tracking Service', href: '#price-tracking', status: 'locked' },
      { id: 'instagram', label: 'Instagram', href: '#instagram', status: 'locked' },
      { id: 'robinhood', label: 'Robinhood', href: '#robinhood', status: 'locked' },
      { id: 'google-docs', label: 'Google Docs', href: '#google-docs', status: 'locked' },
      { id: 'distributed-cache', label: 'Distributed Cache', href: '#distributed-cache', status: 'locked' },
      { id: 'job-scheduler', label: 'Job Scheduler', href: '#job-scheduler', status: 'locked' },
      { id: 'payment-system', label: 'Payment System', href: '#payment-system', status: 'locked' },
      { id: 'metrics-monitoring', label: 'Metrics Monitoring', href: '#metrics-monitoring', status: 'locked' },
      { id: 'chatgpt', label: 'ChatGPT', href: '#chatgpt', status: 'locked' },
    ],
  },
];

function countCompleted(sections) {
  let completed = 0;
  let total = 0;
  for (const section of sections) {
    for (const item of section.items) {
      if (item.status !== 'locked') total++;
      if (item.status === 'completed') completed++;
    }
  }
  return { completed, total };
}

function NavItem({ label, href, status, isActive, onClick }) {
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const classNames = [
    'nav-item',
    isActive && 'nav-item--active',
    isCompleted && 'nav-item--completed',
    isLocked && 'nav-item--locked',
  ].filter(Boolean).join(' ');

  const icon = isCompleted ? <CheckCircleIcon /> : isLocked ? <LockIcon /> : <CircleIcon />;

  return (
    <li>
      <a
        href={href}
        className={classNames}
        tabIndex={isLocked ? -1 : 0}
        aria-disabled={isLocked}
        onClick={(e) => {
          e.preventDefault();
          if (!isLocked && onClick) onClick();
        }}
      >
        {icon}
        <span className="nav-item-label">{label}</span>
        {isLocked && <span className="nav-item-badge">PRO</span>}
      </a>
    </li>
  );
}

function SidebarSection({ section, activeArticleId, onNavigate }) {
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
            <NavItem 
              key={item.href} 
              {...item} 
              isActive={item.id === activeArticleId}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function LeftSidebar({ activeArticleId, onNavigate, isOpen }) {
  const { completed, total } = countCompleted(SECTIONS);
  const percent = Math.round((completed / total) * 100);

  return (
    <aside className={`left-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand-title" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Learn System Design
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
      {SECTIONS.map((section) => (
        <SidebarSection 
          key={section.id} 
          section={section} 
          activeArticleId={activeArticleId}
          onNavigate={onNavigate}
        />
      ))}
    </aside>
  );
}
