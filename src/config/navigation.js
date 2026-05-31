export const SYSTEM_DESIGN_SECTIONS = [
  {
    id: 'core-concepts',
    title: 'Core Concepts',
    defaultExpanded: true,
    items: [
      { id: 'networking', label: 'Networking Essentials', href: '/networking', status: 'default' },
      { id: 'api-design', label: 'API Design', href: '/api-design', status: 'default' },
      { id: 'data-modeling', label: 'Data Modeling', href: '/data-modeling', status: 'default' },
      { id: 'caching', label: 'Caching', href: '/caching', status: 'default' },
      { id: 'sharding', label: 'Sharding', href: '/sharding', status: 'default' },
      { id: 'consistent-hashing', label: 'Consistent Hashing', href: '/consistent-hashing', status: 'default' },
      { id: 'cap-theorem', label: 'CAP Theorem', href: '/cap-theorem', status: 'default' },
      { id: 'db-indexing', label: 'Database Indexing', href: '/db-indexing', status: 'default' },
      { id: 'numbers-to-know', label: 'Numbers to Know', href: '/numbers-to-know', status: 'default' },
    ],
  },
  {
    id: 'patterns',
    title: 'Patterns',
    defaultExpanded: false,
    items: [
      { id: 'real-time', label: 'Real-time Updates', href: '/real-time', status: 'default' },
      { id: 'contention', label: 'Dealing with Contention', href: '/contention', status: 'default' },
      { id: 'multi-step', label: 'Multi-step Processes', href: '/multi-step', status: 'default' },
      { id: 'scaling-reads', label: 'Scaling Reads', href: '/scaling-reads', status: 'default' },
      { id: 'scaling-writes', label: 'Scaling Writes', href: '/scaling-writes', status: 'default' },
      { id: 'large-blobs', label: 'Handling Large Blobs', href: '/large-blobs', status: 'default' },
      { id: 'long-running', label: 'Managing Long Running Tasks', href: '/long-running', status: 'default' },
    ],
  },
  {
    id: 'key-technologies',
    title: 'Key Technologies',
    defaultExpanded: false,
    items: [
      { id: 'redis', label: 'Redis', href: '/redis', status: 'default' },
      { id: 'elasticsearch', label: 'Elasticsearch', href: '/elasticsearch', status: 'default' },
      { id: 'kafka', label: 'Kafka', href: '/kafka', status: 'default' },
      { id: 'api-gateway', label: 'API Gateway', href: '/api-gateway', status: 'default' },
      { id: 'cassandra', label: 'Cassandra', href: '/cassandra', status: 'default' },
      { id: 'dynamodb', label: 'DynamoDB', href: '/dynamodb', status: 'default' },
      { id: 'postgresql', label: 'PostgreSQL', href: '/postgresql', status: 'default' },
      { id: 'flink', label: 'Flink', href: '/flink', status: 'default' },
      { id: 'zookeeper', label: 'ZooKeeper', href: '/zookeeper', status: 'default' },
    ],
  },
  {
    id: 'advanced-topics',
    title: 'Advanced Topics',
    defaultExpanded: false,
    items: [
      { id: 'time-series', label: 'Time Series Databases', href: '/time-series', status: 'default' },
      { id: 'data-structures', label: 'Data Structures for Big Data', href: '/data-structures', status: 'locked' },
      { id: 'vector-databases', label: 'Vector Databases', href: '/vector-databases', status: 'locked' },
    ],
  },
  {
    id: 'question-breakdowns',
    title: 'Question Breakdowns',
    defaultExpanded: false,
    items: [
      { id: 'bitly', label: 'Bitly', href: '/bitly', status: 'locked' },
      { id: 'dropbox', label: 'Dropbox', href: '/dropbox', status: 'locked' },
      { id: 'local-delivery', label: 'Local Delivery Service', href: '/local-delivery', status: 'locked' },
      { id: 'ticketmaster', label: 'Ticketmaster', href: '/ticketmaster', status: 'locked' },
      { id: 'news-feed', label: 'FB News Feed', href: '/news-feed', status: 'locked' },
      { id: 'tinder', label: 'Tinder', href: '/tinder', status: 'locked' },
      { id: 'leetcode', label: 'LeetCode', href: '/leetcode', status: 'locked' },
      { id: 'whatsapp', label: 'WhatsApp', href: '/whatsapp', status: 'locked' },
      { id: 'rate-limiter', label: 'Rate Limiter', href: '/rate-limiter', status: 'locked' },
      { id: 'live-comments', label: 'FB Live Comments', href: '/live-comments', status: 'locked' },
      { id: 'post-search', label: 'FB Post Search', href: '/post-search', status: 'locked' },
      { id: 'youtube-top-k', label: 'YouTube Top K', href: '/youtube-top-k', status: 'locked' },
      { id: 'uber', label: 'Uber', href: '/uber', status: 'locked' },
      { id: 'youtube', label: 'YouTube', href: '/youtube', status: 'locked' },
      { id: 'web-crawler', label: 'Web Crawler', href: '/web-crawler', status: 'locked' },
      { id: 'ad-click', label: 'Ad Click Aggregator', href: '/ad-click', status: 'locked' },
      { id: 'news-aggregator', label: 'News Aggregator', href: '/news-aggregator', status: 'locked' },
      { id: 'yelp', label: 'Yelp', href: '/yelp', status: 'locked' },
      { id: 'strava', label: 'Strava', href: '/strava', status: 'locked' },
      { id: 'online-auction', label: 'Online Auction', href: '/online-auction', status: 'locked' },
      { id: 'price-tracking', label: 'Price Tracking Service', href: '/price-tracking', status: 'locked' },
      { id: 'instagram', label: 'Instagram', href: '/instagram', status: 'locked' },
      { id: 'robinhood', label: 'Robinhood', href: '/robinhood', status: 'locked' },
      { id: 'google-docs', label: 'Google Docs', href: '/google-docs', status: 'locked' },
      { id: 'distributed-cache', label: 'Distributed Cache', href: '/distributed-cache', status: 'locked' },
      { id: 'job-scheduler', label: 'Job Scheduler', href: '/job-scheduler', status: 'locked' },
      { id: 'payment-system', label: 'Payment System', href: '/payment-system', status: 'locked' },
      { id: 'metrics-monitoring', label: 'Metrics Monitoring', href: '/metrics-monitoring', status: 'locked' },
      { id: 'chatgpt', label: 'ChatGPT', href: '/chatgpt', status: 'locked' },
    ],
  },
];

export const JAVA_SECTIONS = [
  {
    id: 'java-collections',
    title: 'Java Collections',
    defaultExpanded: true,
    items: [
      { id: 'java-map', label: 'Map (HashMap, TreeMap)', href: '/java-map', status: 'default' },
      { id: 'java-queue', label: 'Queue & Deque', href: '/java-queue', status: 'locked' },
      { id: 'java-stack', label: 'Stack & Vector', href: '/java-stack', status: 'locked' },
      { id: 'java-list', label: 'List (ArrayList, LinkedList)', href: '/java-list', status: 'locked' },
      { id: 'java-set', label: 'Set (HashSet, TreeSet)', href: '/java-set', status: 'locked' },
    ],
  },
  {
    id: 'java-concurrency',
    title: 'Java Concurrency',
    defaultExpanded: false,
    items: [
      { id: 'java-threads', label: 'Threads & Sync', href: '/java-threads', status: 'locked' },
      { id: 'java-locks', label: 'Locks & CAS', href: '/java-locks', status: 'locked' },
      { id: 'java-concurrent-collections', label: 'Concurrent Collections', href: '/java-concurrent-collections', status: 'locked' },
      { id: 'java-virtual-threads', label: 'Virtual Threads', href: '/java-virtual-threads', status: 'locked' },
    ],
  },
  {
    id: 'java-jvm-internals',
    title: 'JVM Internals',
    defaultExpanded: false,
    items: [
      { id: 'java-jvm', label: 'JVM Architecture', href: '/java-jvm', status: 'locked' },
      { id: 'java-gc', label: 'Garbage Collection', href: '/java-gc', status: 'locked' },
    ],
  },
];

export const SECTIONS = [...SYSTEM_DESIGN_SECTIONS, ...JAVA_SECTIONS];

export function countCompleted(sections) {
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

export function getTrackByArticleId(articleId) {
  if (!articleId) return null;
  const isJava = JAVA_SECTIONS.some(section => section.items.some(item => item.id === articleId));
  if (isJava) return 'java';
  const isSysDesign = SYSTEM_DESIGN_SECTIONS.some(section => section.items.some(item => item.id === articleId));
  if (isSysDesign) return 'system-design';
  return null;
}

export const VALID_ARTICLE_IDS = SECTIONS.flatMap(section => 
  section.items.filter(item => item.status !== 'locked').map(item => item.id)
);
