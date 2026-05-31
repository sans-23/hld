import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './Sidebar.css';

const TOC_BY_ARTICLE = {
  'networking': [
    { id: 'networking-101', label: 'Networking 101' },
    { id: 'networking-layers', label: 'Networking Layers' },
    { id: 'simple-web-request', label: '— A Simple Web Request' },
    { id: 'network-layer-protocols', label: 'Network Layer Protocols' },
    { id: 'transport-layer', label: 'Transport Layer Protocols' },
    { id: 'udp', label: '— UDP' },
    { id: 'tcp', label: '— TCP' },
    { id: 'application-layer', label: 'Application Layer Protocols' },
    { id: 'http', label: '— HTTP/HTTPS' },
    { id: 'rest', label: '— REST' },
    { id: 'graphql', label: '— GraphQL' },
    { id: 'grpc', label: '— gRPC' },
    { id: 'sse', label: '— SSE' },
    { id: 'websockets', label: '— WebSockets' },
    { id: 'webrtc', label: '— WebRTC' },
    { id: 'load-balancing', label: 'Load Balancing' },
    { id: 'client-side-lb', label: '— Client-Side' },
    { id: 'dedicated-lb', label: '— Dedicated Load Balancers' },
    { id: 'layer4-lb', label: '— Layer 4' },
    { id: 'layer7-lb', label: '— Layer 7' },
    { id: 'regionalization', label: 'Regionalization & Latency' },
    { id: 'cdns', label: '— CDNs' },
    { id: 'regional-partitioning', label: '— Regional Partitioning' },
    { id: 'failure-handling', label: 'Handling Failures' },
    { id: 'timeouts-retries', label: '— Timeouts & Retries' },
    { id: 'idempotency', label: '— Idempotency' },
    { id: 'circuit-breakers', label: '— Circuit Breakers' },
    { id: 'wrapping-up', label: 'Wrapping Up' },
  ],
  'db-indexing': [
    { id: 'under-the-hood', label: 'How Database Indexes Work' },
    { id: 'physical-storage', label: '— Physical Storage & Access' },
    { id: 'cost', label: '— Cost' },
    { id: 'types-of-indexes', label: 'Types of Indexes' },
    { id: 'b-trees', label: '— B-Tree Indexes' },
    { id: 'lsm-trees', label: '— LSM Trees' },
    { id: 'hash-indexes', label: '— Hash Indexes' },
    { id: 'geospatial-indexes', label: '— Geospatial Indexes' },
    { id: 'inverted-indexes', label: '— Inverted Indexes' },
    { id: 'optimization-patterns', label: 'Index Optimization Patterns' },
    { id: 'composite-indexes', label: '— Composite Indexes' },
    { id: 'covering-indexes', label: '— Covering Indexes' },
    { id: 'wrapping-up', label: 'Wrapping Up' },
  ],
  'caching': [
    { id: 'where-to-cache', label: 'Where to Cache' },
    { id: 'external-caching', label: '— External Caching' },
    { id: 'cdn-caching', label: '— CDN Caching' },
    { id: 'client-side-caching', label: '— Client-Side Caching' },
    { id: 'in-process-caching', label: '— In-Process Caching' },
    { id: 'cache-architectures', label: 'Cache Architectures' },
    { id: 'cache-aside', label: '— Cache-Aside (Lazy Loading)' },
    { id: 'write-through-caching', label: '— Write-Through Caching' },
    { id: 'write-behind-caching', label: '— Write-Behind Caching' },
    { id: 'read-through-caching', label: '— Read-Through Caching' },
    { id: 'cache-eviction-policies', label: 'Cache Eviction Policies' },
    { id: 'lru', label: '— LRU' },
    { id: 'lfu', label: '— LFU' },
    { id: 'fifo', label: '— FIFO' },
    { id: 'ttl', label: '— TTL' },
    { id: 'common-caching-problems', label: 'Common Caching Problems' },
    { id: 'cache-stampede', label: '— Cache Stampede' },
    { id: 'cache-consistency', label: '— Cache Consistency' },
    { id: 'hot-keys', label: '— Hot Keys' },
    { id: 'caching-in-system-design-interviews', label: 'Caching in Interviews' },
    { id: 'when-to-bring-up-caching', label: '— When to Bring Up' },
    { id: 'how-to-introduce-caching', label: '— How to Introduce' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'real-time': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'polling-patterns', label: 'Polling Patterns' },
    { id: 'short-polling', label: '— Short Polling' },
    { id: 'long-polling', label: '— Long Polling' },
    { id: 'push-protocols', label: 'Server-Push Protocols' },
    { id: 'sse', label: '— Server-Sent Events' },
    { id: 'websockets', label: '— WebSockets' },
    { id: 'webrtc', label: '— WebRTC (P2P)' },
    { id: 'scaling-real-time', label: 'Scaling Real-time Systems' },
    { id: 'stateful-connections', label: '— Stateful Connections' },
    { id: 'pub-sub-broadcasting', label: '— Pub/Sub Broadcasting' },
    { id: 'failure-handling', label: 'Failure Handling & Resiliency' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Technology Decision Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'contention': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'concurrency-control', label: 'Concurrency Control' },
    { id: 'pessimistic-locking', label: '— Pessimistic Locking' },
    { id: 'optimistic-locking', label: '— Optimistic Locking (OCC)' },
    { id: 'atomic-updates', label: '— Database Atomic Updates' },
    { id: 'queue-serialization', label: '— Queue-Based Serialization' },
    { id: 'partitioned-counters', label: 'Partitioned Counters' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Concurrency Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'multi-step': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'two-phase-commit', label: 'Two-Phase Commit (2PC)' },
    { id: 'saga-pattern', label: 'The Saga Pattern' },
    { id: 'choreography-saga', label: '— Choreography Sagas' },
    { id: 'orchestration-saga', label: '— Orchestration Sagas' },
    { id: 'transactional-outbox', label: 'Transactional Outbox' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Transaction Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'scaling-reads': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'read-replicas', label: 'Read Replicas & Lag' },
    { id: 'read-your-own-writes', label: '— Read-Your-Own-Writes' },
    { id: 'caching-strategies', label: 'Multi-Level Caching' },
    { id: 'precomputation-materialization', label: 'Pre-computation' },
    { id: 'cqrs', label: 'CQRS Pattern' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Read Scaling Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'scaling-writes': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'lsm-trees', label: 'LSM Trees (NoSQL)' },
    { id: 'batching-writes', label: 'Batching & Buffering' },
    { id: 'load-leveling', label: 'Queue Load Leveling' },
    { id: 'sharding-scaling', label: 'Horizontal Sharding' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Write Scaling Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'large-blobs': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'storage-architectures', label: 'Storage Architectures' },
    { id: 'presigned-urls', label: 'Pre-signed URLs' },
    { id: 'multipart-uploads', label: 'Multipart Uploads' },
    { id: 'cdn-caching', label: 'CDN & Edge Optimization' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Blob Storage Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'long-running': [
    { id: 'core-problem', label: 'The Core Problem' },
    { id: 'architecture-topology', label: 'Queue Architecture' },
    { id: 'status-tracking', label: 'Status Tracking' },
    { id: 'reliability-patterns', label: 'Reliability Patterns' },
    { id: 'code-snippets', label: 'Task Queue Code' },
    { id: 'problem-breakdowns', label: 'Problem Breakdowns' },
    { id: 'comparison-matrix', label: 'Task Processing Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'java-map': [
    { id: 'map-hierarchy', label: 'Map Hierarchy' },
    { id: 'hashmap-internals', label: 'HashMap Internals' },
    { id: 'treemap-internals', label: 'TreeMap Red-Black Tree' },
    { id: 'linkedhashmap-internals', label: 'LinkedHashMap LRU' },
    { id: 'code-operations', label: 'Systematic Operations Code' },
    { id: 'comparison-matrix', label: 'Map Implementations Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'java-queue': [
    { id: 'queue-hierarchy', label: 'Queue & Deque Hierarchy' },
    { id: 'priority-queue', label: 'PriorityQueue Internals' },
    { id: 'array-deque', label: 'ArrayDeque Internals' },
    { id: 'caching-concurrency', label: 'Stack vs Deque & BlockingQueue' },
    { id: 'code-operations', label: 'Systematic Operations Code' },
    { id: 'comparison-matrix', label: 'Queue Selection Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'java-stack': [
    { id: 'stack-overview', label: 'Stack & Vector Overview' },
    { id: 'vector-synchronized', label: 'Vector & Sync Overhead' },
    { id: 'stack-design-violations', label: 'Stack Design Violations' },
    { id: 'modern-alternatives', label: 'Modern Alternatives' },
    { id: 'code-operations', label: 'Systematic Operations Code' },
    { id: 'comparison-matrix', label: 'Stack/Vector Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'java-list': [
    { id: 'list-overview', label: 'List Interface Overview' },
    { id: 'array-list-internals', label: 'ArrayList Internals' },
    { id: 'linked-list-internals', label: 'LinkedList Internals' },
    { id: 'cache-locality', label: 'CPU Cache Locality' },
    { id: 'code-operations', label: 'Systematic Operations Code' },
    { id: 'comparison-matrix', label: 'List Selection Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'java-set': [
    { id: 'set-overview', label: 'Set Interface Overview' },
    { id: 'hash-set-internals', label: 'HashSet & backing Map' },
    { id: 'linked-hash-set-internals', label: 'LinkedHashSet Ordering' },
    { id: 'tree-set-internals', label: 'TreeSet Sorted & Bounds' },
    { id: 'code-operations', label: 'Systematic Operations Code' },
    { id: 'comparison-matrix', label: 'Set Selection Matrix' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'sharding': [
    { id: 'what-is-partitioning', label: 'What is Partitioning?' },
    { id: 'what-is-sharding', label: 'What is Sharding?' },
    { id: 'how-to-shard-your-data', label: 'How to Shard' },
    { id: 'choosing-your-shard-key', label: '— Choosing a Shard Key' },
    { id: 'sharding-strategies', label: 'Sharding Strategies' },
    { id: 'range-based-sharding', label: '— Range-Based' },
    { id: 'hash-based-sharding', label: '— Hash-Based (Default)' },
    { id: 'directory-based-sharding', label: '— Directory-Based' },
    { id: 'challenges-of-sharding', label: 'Challenges of Sharding' },
    { id: 'hot-spots-and-load-imbalance', label: '— Hot Spots & Imbalance' },
    { id: 'cross-shard-operations', label: '— Cross-Shard Operations' },
    { id: 'maintaining-consistency', label: '— Maintaining Consistency' },
    { id: 'sharding-in-modern-databases', label: 'Modern Databases' },
    { id: 'sharding-in-system-design-interviews', label: 'Sharding in Interviews' },
    { id: 'when-to-mention-sharding', label: '— When to Mention' },
    { id: 'what-to-say', label: '— What to Say' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'consistent-hashing': [
    { id: 'consistent-hashing-via-an-example', label: 'Consistent Hashing via an Example' },
    { id: 'first-attempt-simple-modulo-hashing', label: '— First Attempt: Modulo Hashing' },
    { id: 'consistent-hashing', label: 'Consistent Hashing' },
    { id: 'adding-a-database', label: '— Adding a Database' },
    { id: 'removing-a-database', label: '— Removing a Database' },
    { id: 'virtual-nodes', label: '— Virtual Nodes' },
    { id: 'addressing-hot-spots', label: 'Addressing Hot Spots' },
    { id: 'data-movement-in-practice', label: 'Data Movement in Practice' },
    { id: 'consistent-hashing-in-the-real-world', label: 'Consistent Hashing in the Real World' },
    { id: 'when-to-use-consistent-hashing-in-an-interview', label: 'Consistent Hashing in Interviews' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'cap-theorem': [
    { id: 'what-is-cap-theorem', label: 'What is CAP Theorem?' },
    { id: 'understanding-cap-theorem-through-an-example', label: 'Understanding CAP Through an Example' },
    { id: 'when-to-choose-consistency', label: '— When to Choose Consistency' },
    { id: 'when-to-choose-availability', label: '— When to Choose Availability' },
    { id: 'cap-theorem-in-system-design-interviews', label: 'CAP in System Design Interviews' },
    { id: 'advanced-cap-theorem-considerations', label: 'Advanced CAP Considerations' },
    { id: 'example-1-ticketmaster', label: '— Example 1: Ticketmaster' },
    { id: 'example-2-tinder', label: '— Example 2: Tinder' },
    { id: 'different-levels-of-consistency', label: '— Different Levels of Consistency' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'data-modeling': [
    { id: 'data-modeling-in-interview', label: 'Data Modeling in an Interview' },
    { id: 'database-model-options', label: 'Database Model Options' },
    { id: 'relational-databases', label: '— Relational Databases (SQL)' },
    { id: 'document-databases', label: '— Document Databases' },
    { id: 'key-value-stores', label: '— Key-Value Stores' },
    { id: 'wide-column-databases', label: '— Wide-Column Databases' },
    { id: 'graph-databases', label: '— Graph Databases' },
    { id: 'schema-design-fundamentals', label: 'Schema Design Fundamentals' },
    { id: 'start-with-requirements', label: '— Start with Requirements' },
    { id: 'entities-keys-relationships', label: '— Entities, Keys & Relationships' },
    { id: 'indexing-for-access-patterns', label: '— Indexing for Access Patterns' },
    { id: 'normalization-vs-denormalization', label: '— Normalization vs Denormalization' },
    { id: 'scaling-and-sharding', label: '— Scaling and Sharding' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'api-design': [
    { id: 'api-types', label: 'API Types' },
    { id: 'rest', label: 'REST' },
    { id: 'resource-modeling', label: '— Resource Modeling' },
    { id: 'http-methods', label: '— HTTP Methods' },
    { id: 'passing-data', label: '— Passing Data to APIs' },
    { id: 'returning-data', label: '— Returning Data' },
    { id: 'graphql', label: 'GraphQL' },
    { id: 'how-graphql-works', label: '— How GraphQL Works' },
    { id: 'when-to-use-graphql', label: '— When to Use in Interviews' },
    { id: 'graphql-schema', label: '— GraphQL Schema Design' },
    { id: 'rpc', label: 'RPC' },
    { id: 'how-rpc-works', label: '— How RPC Works' },
    { id: 'protobuf', label: '— Protocol Buffers' },
    { id: 'when-to-use-rpc', label: '— When to Use in Interviews' },
    { id: 'common-patterns', label: 'Common API Patterns' },
    { id: 'pagination', label: '— Pagination' },
    { id: 'offset-pagination', label: '—— Offset-based' },
    { id: 'cursor-pagination', label: '—— Cursor-based' },
    { id: 'versioning', label: '— Versioning Strategies' },
    { id: 'security', label: 'Security Considerations' },
    { id: 'auth', label: '— Authentication & Authorization' },
    { id: 'keys-vs-jwt', label: '—— API Keys vs JWT' },
    { id: 'rbac', label: '—— Role-Based Access Control' },
    { id: 'rate-limiting', label: '— Rate Limiting & Throttling' },
    { id: 'conclusion', label: 'Conclusion' },
  ],
  'numbers-to-know': [
    { id: 'hardware-limits', label: 'Modern Hardware Limits' },
    { id: 'applying-in-interviews', label: 'Applying in Interviews' },
    { id: 'caching', label: '— Caching' },
    { id: 'databases', label: '— Databases' },
    { id: 'app-servers', label: '— Application Servers' },
    { id: 'message-queues', label: '— Message Queues' },
    { id: 'cheat-sheet', label: 'Latency Cheat Sheet' },
    { id: 'common-mistakes', label: 'Common Mistakes in Interviews' },
    { id: 'premature-sharding', label: '— Premature Sharding' },
    { id: 'overestimating-latency', label: '— Overestimating Latency' },
    { id: 'overengineering-throughput', label: '— Over-engineering' },
    { id: 'costs', label: 'What About Costs?' },
    { id: 'wrapping-up', label: 'Conclusion' },
  ],
  'redis': [
    { id: 'redis-basics', label: 'Redis Basics' },
    { id: 'commands', label: '— Redis Commands' },
    { id: 'infrastructure-configurations', label: 'Infrastructure Configurations' },
    { id: 'performance', label: '— Performance' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'redis-as-cache', label: '— Redis as a Cache' },
    { id: 'redis-distributed-lock', label: '— Redis as a Distributed Lock' },
    { id: 'leaderboards', label: '— Redis for Leaderboards' },
    { id: 'rate-limiting', label: '— Redis for Rate Limiting' },
    { id: 'proximity-search', label: '— Redis for Proximity Search' },
    { id: 'event-sourcing', label: '— Redis for Event Sourcing' },
    { id: 'pub-sub', label: '— Redis for Pub/Sub' },
    { id: 'shortcomings-remediations', label: 'Shortcomings & Remediations' },
    { id: 'hot-key-issues', label: '— Hot Key Issues' },
    { id: 'conclusion', label: 'Summary' },
  ],
  'elasticsearch': [
    { id: 'basic-concepts', label: 'Basic Concepts' },
    { id: 'documents', label: '— Documents' },
    { id: 'indices', label: '— Indices' },
    { id: 'mappings-fields', label: '— Mappings & Fields' },
    { id: 'create-index', label: 'Create Index & Mappings' },
    { id: 'add-docs', label: 'Add & Update Documents' },
    { id: 'search-syntax', label: 'Search Queries' },
    { id: 'geospatial-search', label: 'Geospatial Search' },
    { id: 'sort-syntax', label: 'Sorting' },
    { id: 'pagination-cursors', label: 'Pagination & PIT Cursors' },
    { id: 'under-the-hood', label: 'Distributed Architecture' },
    { id: 'node-types', label: '— Node Types & Request Flow' },
    { id: 'lucene-segments', label: '— Lucene Segments & CRUD' },
    { id: 'inverted-index-doc-values', label: '— Inverted Index vs Doc Values' },
    { id: 'interviews', label: 'Interviews & CDC Pipeline' },
    { id: 'conclusion', label: 'Summary' }
  ],
  'kafka': [
    { id: 'a-motivating-example', label: 'A Motivating Example' },
    { id: 'basic-terminology-and-architecture', label: 'Basic Terminology' },
    { id: 'how-kafka-works', label: 'How Kafka Works' },
    { id: 'when-to-use-kafka', label: 'When to Use' },
    { id: 'kafka-for-system-design', label: 'Interview Guide' },
    { id: 'scalability', label: '— Scalability' },
    { id: 'handling-hot-partitions', label: '— Mitigating Hot Partitions' },
    { id: 'fault-tolerance', label: '— Fault Tolerance' },
    { id: 'handling-retries-and-errors', label: '— Handling Errors' },
    { id: 'producer-retries', label: '—— Producer Retries' },
    { id: 'consumer-retries', label: '—— Consumer Retries' },
    { id: 'performance-optimizations', label: '— Performance Optimizations' },
    { id: 'retention-policies', label: '— Retention Policies' },
    { id: 'summary', label: 'Summary' }
  ],
  'api-gateway': [
    { id: 'what-is-an-api-gateway', label: 'What is an API Gateway?' },
    { id: 'core-responsibilities', label: 'Core Responsibilities' },
    { id: 'tracing-a-request', label: '— Tracing a Request' },
    { id: 'request-validation', label: '—— 1) Request Validation' },
    { id: 'middleware', label: '—— 2) Middleware' },
    { id: 'routing', label: '—— 3) Routing' },
    { id: 'backend-communication', label: '—— 4) Backend Communication' },
    { id: 'response-transformation', label: '—— 5) Response Transformation' },
    { id: 'caching', label: '—— 6) Caching' },
    { id: 'scaling-an-api-gateway', label: 'Scaling an API Gateway' },
    { id: 'horizontal-scaling', label: '— Horizontal Scaling' },
    { id: 'global-distribution', label: '— Global Distribution' },
    { id: 'popular-api-gateways', label: 'Popular API Gateways' },
    { id: 'managed-services', label: '— Managed Services' },
    { id: 'open-source-solutions', label: '— Open Source Solutions' },
    { id: 'when-to-propose-an-api-gateway', label: 'When to Propose an API Gateway' }
  ],
  'cassandra': [
    { id: 'cassandra-basics', label: 'Cassandra Basics' },
    { id: 'data-model', label: '— Data Model' },
    { id: 'primary-key', label: '— Primary Key' },
    { id: 'key-concepts', label: 'Key Concepts' },
    { id: 'partitioning', label: '— Partitioning' },
    { id: 'replication', label: '— Replication' },
    { id: 'consistency', label: '— Consistency' },
    { id: 'query-routing', label: '— Query Routing' },
    { id: 'storage-model', label: '— Storage Model' },
    { id: 'gossip', label: '— Gossip' },
    { id: 'fault-tolerance', label: '— Fault Tolerance' },
    { id: 'how-to-use-cassandra', label: 'How to use Cassandra' },
    { id: 'data-modeling', label: '— Data Modeling' },
    { id: 'example-discord-messages', label: '—— Example: Discord Messages' },
    { id: 'example-ticketmaster', label: '—— Example: Ticketmaster' },
    { id: 'advanced-features', label: 'Advanced Features' },
    { id: 'cassandra-in-an-interview', label: 'Cassandra in an Interview' },
    { id: 'when-to-use-it', label: '— When to use it' },
    { id: 'knowing-its-limitations', label: '— Knowing its limitations' },
    { id: 'summary', label: 'Summary' }
  ],
  'dynamodb': [
    { id: 'data-model', label: 'The Data Model' },
    { id: 'partition-key-and-sort-key', label: 'Partition Key & Sort Key' },
    { id: 'under-the-hood-keys', label: '— Under the Hood' },
    { id: 'secondary-indexes', label: 'Secondary Indexes' },
    { id: 'under-the-hood-indexes', label: '— Under the Hood' },
    { id: 'accessing-data', label: 'Accessing Data' },
    { id: 'cap-theorem', label: 'CAP Theorem' },
    { id: 'under-the-hood-consistency', label: '— Under the Hood' },
    { id: 'architecture-and-scalability', label: 'Architecture & Scalability' },
    { id: 'scalability', label: '— Scalability' },
    { id: 'fault-tolerance-and-availability', label: '— Fault Tolerance' },
    { id: 'security', label: '— Security' },
    { id: 'pricing-model', label: '— Pricing Model' },
    { id: 'advanced-features', label: 'Advanced Features' },
    { id: 'dax', label: '— DAX' },
    { id: 'streams', label: '— Streams' },
    { id: 'dynamodb-in-an-interview', label: 'DynamoDB in an Interview' },
    { id: 'when-to-use-it', label: '— When to Use' },
    { id: 'knowing-its-limitations', label: '— Limitations' },
    { id: 'summary', label: 'Summary' }
  ],
  'postgresql': [
    { id: 'motivating-example', label: 'A Motivating Example' },
    { id: 'capabilities-limitations', label: 'Core Capabilities' },
    { id: 'read-performance', label: '— Read Performance' },
    { id: 'write-performance', label: '— Write Performance' },
    { id: 'replication', label: '— Replication Models' },
    { id: 'data-consistency', label: '— Isolation & Consistency' },
    { id: 'when-to-use', label: 'When to Use PostgreSQL' },
    { id: 'when-to-consider-alternatives', label: '— When to Avoid' },
    { id: 'summary', label: 'Summary' },
    { id: 'appendix', label: 'Appendix: Basic SQL' }
  ],
  'flink': [
    { id: 'basic-concepts', label: 'Basic Concepts' },
    { id: 'sources-sinks', label: '— Sources & Sinks' },
    { id: 'streams', label: '— Streams' },
    { id: 'operators', label: '— Operators' },
    { id: 'state', label: '— Stateful Processing' },
    { id: 'watermarks', label: '— Event Time & Watermarks' },
    { id: 'windows', label: '— Windowing Strategies' },
    { id: 'basic-use', label: 'Basic Use' },
    { id: 'defining-a-job', label: '— Defining a Job' },
    { id: 'submitting-a-job', label: '— Submitting a Job' },
    { id: 'sample-jobs', label: '— Sample Jobs' },
    { id: 'how-flink-works', label: 'How Flink Works' },
    { id: 'cluster-architecture', label: '— Cluster Architecture' },
    { id: 'state-management', label: '— State Management' },
    { id: 'in-your-interview', label: 'Flink in Interviews' },
    { id: 'using-flink', label: '— When to Propose' },
    { id: 'lessons-from-flink', label: '— Lessons from Flink' },
    { id: 'conclusion', label: 'Summary' }
  ],
  'zookeeper': [
    { id: 'motivating-example', label: 'A Motivating Example' },
    { id: 'zookeeper-basics', label: 'ZooKeeper Basics' },
    { id: 'data-model', label: '— ZNode Tree Model' },
    { id: 'server-roles', label: '— Server Roles' },
    { id: 'watches', label: '— Watcher Mechanisms' },
    { id: 'key-capabilities', label: 'Key Capabilities' },
    { id: 'config-management', label: '— Config Management' },
    { id: 'service-discovery', label: '— Service Discovery' },
    { id: 'leader-election', label: '— Leader Election' },
    { id: 'distributed-locks', label: '— Distributed Locks' },
    { id: 'how-zookeeper-works', label: 'How ZooKeeper Works' },
    { id: 'zab-consensus', label: '— Zab Consensus Protocol' },
    { id: 'consistency-guarantees', label: '— Consistency Guarantees' },
    { id: 'read-write-ops', label: '— Read/Write Operations' },
    { id: 'sessions-connection', label: '— Sessions & Connections' },
    { id: 'storage-architecture', label: '— Storage Architecture' },
    { id: 'handling-failures', label: '— Handling Failures' },
    { id: 'modern-world', label: 'Modern ZooKeeper' },
    { id: 'current-usage', label: '— Current Usage' },
    { id: 'alternatives', label: '— Alternatives' },
    { id: 'limitations', label: '— Limitations' },
    { id: 'when-to-use', label: 'When to Propose' },
    { id: 'summary', label: 'Summary' }
  ],
  'time-series': [
    { id: 'a-motivating-example', label: 'A Motivating Example' },
    { id: 'the-building-blocks', label: 'The Building Blocks' },
    { id: 'append-only-storage', label: '— Append-Only Storage' },
    { id: 'lsm-trees', label: '— LSM Trees' },
    { id: 'delta-encoding', label: '— Delta Encoding & Compression' },
    { id: 'time-partitioning', label: '— Time-Based Partitioning' },
    { id: 'bloom-filters', label: '— Bloom Filters' },
    { id: 'downsampling', label: '— Downsampling & Rollups' },
    { id: 'metadata', label: '— Block-Level Metadata' },
    { id: 'putting-it-together', label: 'Putting It Together' },
    { id: 'data-model', label: '— The Data Model' },
    { id: 'storage-engine', label: '— The Storage Engine' },
    { id: 'query-execution', label: '— Query Execution' },
    { id: 'worked-example', label: 'Worked Example: Multi-Tag Query' },
    { id: 'step-1-ingestion', label: '— Step 1: Data Ingestion' },
    { id: 'step-2-organized', label: '— Step 2: How Data Is Organized' },
    { id: 'step-3-query', label: '— Step 3: Executing a Query' },
    { id: 'what-made-this-fast', label: '— What Made This Fast?' },
    { id: 'where-things-break', label: 'Where Things Break' },
    { id: 'summary', label: 'Summary' }
  ]
};

export default function RightSidebar() {
  const { articleId } = useParams();
  const tocItems = TOC_BY_ARTICLE[articleId] || TOC_BY_ARTICLE['networking'];
  
  const [activeId, setActiveId] = useState(tocItems[0]?.id);
  const [copied, setCopied] = useState(false);
  const observerRef = useRef(null);

  // Reset active ID when article changes
  useEffect(() => {
    setActiveId(tocItems[0]?.id);
  }, [articleId, tocItems]);

  useEffect(() => {
    const handleIntersect = (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [tocItems]);

  const handleClick = useCallback((e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const handleTwitterShare = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this awesome system design guide!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener');
  }, []);

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-sticky">
        <h4 className="section-title">On this page</h4>
        <ul className="toc-list">
          {tocItems.map(({ id, label }) => (
            <li key={id} className={`toc-item${activeId === id ? ' active' : ''}`}>
              <a
                href={`#${id}`}
                className={activeId === id ? 'active' : ''}
                onClick={(e) => handleClick(e, id)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

      </div>
    </aside>
  );
}
