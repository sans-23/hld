import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function OldContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">DynamoDB</span>
          </div>
          <h1>DynamoDB</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master Amazon DynamoDB for system design interviews. Learn about partition keys, sort keys, secondary indexes (GSI vs. LSI), request routing, partition splitting, DAX caching, and event-driven architecture using DynamoDB Streams.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              14 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              NoSQL & Key-Value
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — The Data Model
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <div className="video-walkthrough-banner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <div>
            <div className="video-walkthrough-title">Watch Video Walkthrough</div>
            <div className="video-walkthrough-desc">Watch the author walk through the problem step-by-step</div>
          </div>
        </div>

          <p>
            Amazon <strong>DynamoDB</strong> is a fully managed, serverless, multi-region NoSQL database designed to deliver single-digit millisecond latency at any scale. It handles massive read/write traffic by automatically partitioning data across SSD storage, eliminating database administration overhead (like patching servers or configuring sharding manually).
          </p>

          <h2 id="data-model">The Data Model</h2>
          <p>
            DynamoDB stores schema-flexible items in tables. Each item is a collection of attributes (like a JSON object). To organize this, DynamoDB relies on structured keys:
          </p>

          <h3 id="partition-key-and-sort-key">Partition Key and Sort Key</h3>
          <ul>
            <li><strong>Partition Key (PK):</strong> A single attribute used to hash items and distribute them across internal physical partitions. PKs enable $O(1)$ lookups.</li>
            <li><strong>Sort Key (SK):</strong> An optional attribute used to store items sequentially within a partition. It supports range queries (e.g., retrieving items where <code>SK &gt; '2026-01-01'</code>).</li>
            <li><strong>Primary Key:</strong> Can be either a simple primary key (PK only) or a composite primary key (PK + SK).</li>
          </ul>

          <h3 id="secondary-indexes">Secondary Indexes (GSI vs. LSI)</h3>
          <p>
            To query data using attributes other than the primary key, DynamoDB utilizes secondary index tables:
          </p>
          <ul>
            <li><strong>Global Secondary Index (GSI):</strong> Uses an entirely different partition key and sort key. GSIs are populated asynchronously via write-replication pipelines and can scale independently of the base table.</li>
            <li><strong>Local Secondary Index (LSI):</strong> Shares the same partition key as the base table but uses a different sort key. LSIs are stored in the same physical partitions as the base table and updated synchronously.</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Base Table vs. Global Secondary Index (GSI)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Base Table (Query by User)</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  <strong>PK: user_id</strong> | <strong>SK: order_id</strong><br />
                  - user_101 | order_A | status: SHIPPED<br />
                  - user_101 | order_B | status: PENDING
                </div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>GSI Index (Query by Status)</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  <strong>PK: status</strong> | <strong>SK: order_id</strong><br />
                  - SHIPPED | order_A | user_id: user_101<br />
                  - PENDING | order_B | user_id: user_101
                </div>
              </div>
            </div>
          </div>

          <h3 id="accessing-data">Accessing Data: Query vs. Scan</h3>
          <ul>
            <li><strong>Query:</strong> Retrieves items matching a specific partition key (and optionally filters on the sort key). Fast and cost-efficient ($O(1)$ routing).</li>
            <li><strong>Scan:</strong> Evaluates every single item across the entire table. Extremely slow, expensive, and a major anti-pattern in high-throughput production environments.</li>
          </ul>

          <h3 id="cap-theorem">CAP Theorem &amp; Read Consistency</h3>
          <p>
            By default, DynamoDB reads are **Eventually Consistent** (replicas may take up to a second to receive updates, yielding fast read response times). However, DynamoDB supports **Strongly Consistent Reads** at query time by routing queries to partition leaders, returning the absolute latest write.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Architecture & Scale
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="architecture-and-scalability">Architecture and Scalability</h2>
          <p>
            DynamoDB divides database tables into multiple physical storage nodes (partitions) managed automatically under the hood:
          </p>

          <h3 id="scalability">Request Routing &amp; Partition Splitting</h3>
          <p>
            Clients send requests to a stateless **Request Router**. The router hashes the partition key and consults its partition map to find the node containing that partition, routing requests directly.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">DynamoDB Partition Routing Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--client">Client</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div className="diagram-box" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>Request Router</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="diagram-box diagram-box--server">Partition 1 (Keys A-M)</div>
                  <div className="diagram-box diagram-box--server">Partition 2 (Keys N-Z)</div>
                </div>
              </div>
              <div style={{ background: 'var(--bg-accent)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', width: '100%', maxWidth: '580px', textAlign: 'center' }}>
                <strong>Partition Splits:</strong> A single partition supports up to 10GB of data, 3,000 Read Capacity Units (RCUs), or 1,000 Write Capacity Units (WCUs). If an index exceeds these limits, DynamoDB splits the partition in half and updates the Request Router map automatically.
              </div>
            </div>
          </div>

          <h3 id="fault-tolerance-and-availability">Fault Tolerance and Availability</h3>
          <p>
            To guarantee durability, DynamoDB replicates partitions across three distinct Storage Nodes in different Availability Zones (AZs). One storage node acts as the partition **Leader**, receiving writes and replicating them asynchronously to the other two nodes.
          </p>

          <h3 id="security">Security &amp; IAM Integration</h3>
          <p>
            Since it is built natively into AWS, DynamoDB relies on **AWS Identity and Access Management (IAM)** to handle authorization. Instead of hardcoded database passwords, servers run roles that grant fine-grained permissions to specific tables or even specific rows/attributes.
          </p>

          <h3 id="pricing-model">Pricing Model: Provisioned vs. On-Demand</h3>
          <ul>
            <li><strong>Provisioned Capacity:</strong> You specify the exact number of Read Capacity Units (RCUs) and Write Capacity Units (WCUs) needed. Cost-effective for predictable workloads.</li>
            <li><strong>On-Demand Capacity:</strong> DynamoDB scales dynamically based on request traffic, charging per read/write request. Best for unpredictable traffic spikes.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Advanced Features
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="advanced-features">Advanced Features</h2>
          
          <h3 id="dax">DAX (DynamoDB Accelerator)</h3>
          <p>
            **DAX** is a fully managed, highly available write-through in-memory cache clustering layer built directly in front of DynamoDB tables. It reduces read latencies from milliseconds to microseconds, freeing up RCUs on popular hot keys.
          </p>

          <h3 id="streams">DynamoDB Streams</h3>
          <p>
            **DynamoDB Streams** capture write logs (inserts, updates, deletes) in real time. It is a powerful event-driven mechanism: as items change, streams trigger AWS Lambda functions to replicate writes to Elasticsearch, invalidate CDN caches, or publish alerts.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — DynamoDB in Interviews
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="dynamodb-in-an-interview">DynamoDB in System Design Interviews</h2>
          
          <h3 id="when-to-use-it">When to Propose DynamoDB</h3>
          <ul>
            <li>Highly scalable write/read throughput workloads with predictable access patterns.</li>
            <li>Need high durability and multi-AZ replica consistency.</li>
            <li>Simple key-value or document query structures that match partition/sort key paths.</li>
            <li>Building event-driven pipelines (leveraging DynamoDB Streams for change data capture).</li>
          </ul>

          <h3 id="knowing-its-limitations">Limitations and Downsides</h3>
          <ul>
            <li><strong>Expensive at Scale:</strong> Massive write volume can become extremely costly compared to raw Cassandra hosting on commodity virtual machines.</li>
            <li><strong>No Complex SQL Queries:</strong> Does not support joins, multi-table aggregations, or complex sorting unless indexed explicitly.</li>
            <li><strong>Vendor Lock-in:</strong> Tied directly to the AWS ecosystem. In interviews, stay open to open-source alternatives (like Cassandra or ScyllaDB) if the interviewer demands vendor neutrality.</li>
          </ul>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#cassandra" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Cassandra</div>
            </div>
          </a>
          <a href="#postgresql" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">PostgreSQL</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
