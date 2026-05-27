import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function PostgreSQL() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">PostgreSQL</span>
          </div>
          <h1>PostgreSQL</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master PostgreSQL and Relational Databases for system design interviews. Learn about ACID compliance, B-Tree index lookups, Master-Replica replication, isolation levels, write-ahead logs, and database sharding trade-offs.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              RDBMS & SQL
            </span>
            <span className="difficulty-badge difficulty-badge--beginner">Beginner</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Motivating Example
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step.</p>
          </Callout>

          <h2 id="motivating-example">A Motivating Example</h2>
          <p>
            Imagine building a banking transaction service where User A transfers \$100 to User B. This operation requires two database modifications: deducting \$100 from A's account, and adding \$100 to B's account.
          </p>
          <p>
            If the network drops or the database crashes halfway through—after deducting \$100 from User A but before adding it to User B—that money vanishes. To prevent this, we need a database that guarantees **Atomicity**: either both operations succeed together, or the entire transaction rolls back as if nothing happened. This is where relational databases like <strong>PostgreSQL</strong> excel.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Core Capabilities & Limitations
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="capabilities-limitations">Core Capabilities &amp; Limitations</h2>
          <p>
            PostgreSQL is a robust, open-source object-relational database management system (RDBMS) that provides strong transactional guarantees out of the box.
          </p>

          <h3 id="read-performance">Read Performance &amp; B-Tree Indexing</h3>
          <p>
            By default, querying a row without an index forces the database engine to run a **Full Table Scan** ($O(N)$), reading every page on disk. To optimize read speeds, PostgreSQL builds **B-Tree Indexes** ($O(\log N)$).
          </p>

          <div className="diagram-container">
            <div className="diagram-title">B-Tree Index Node Search Hierarchy</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <svg width="320" height="140" viewBox="0 0 160 70" style={{ overflow: 'visible' }}>
                {/* Root Node */}
                <rect x="70" y="5" width="20" height="10" rx="3" fill="var(--primary)" stroke="white" strokeWidth="0.8" />
                <text x="80" y="12" fontSize="5" fill="white" fontWeight="bold" textAnchor="middle">Root: 50</text>

                {/* Left Branch */}
                <path d="M 70 12 L 40 25" stroke="var(--border-color)" strokeWidth="0.8" markerEnd="url(#arrow)" />
                <rect x="30" y="25" width="20" height="10" rx="3" fill="var(--bg-accent)" stroke="var(--primary)" strokeWidth="0.8" />
                <text x="40" y="32" fontSize="5" fontWeight="bold" textAnchor="middle">Keys &lt; 50</text>

                {/* Right Branch */}
                <path d="M 90 12 L 120 25" stroke="var(--border-color)" strokeWidth="0.8" markerEnd="url(#arrow)" />
                <rect x="110" y="25" width="20" height="10" rx="3" fill="var(--bg-accent)" stroke="var(--primary)" strokeWidth="0.8" />
                <text x="120" y="32" fontSize="5" fontWeight="bold" textAnchor="middle">Keys &ge; 50</text>

                {/* Leaf Nodes */}
                <path d="M 30 32 L 15 45" stroke="var(--border-color)" strokeWidth="0.8" markerEnd="url(#arrow)" />
                <rect x="5" y="45" width="20" height="10" rx="2" fill="white" stroke="var(--border-color)" strokeWidth="0.8" />
                <text x="15" y="51" fontSize="4" textAnchor="middle">Leaf: Row ptrs</text>

                <path d="M 50 32 L 65 45" stroke="var(--border-color)" strokeWidth="0.8" markerEnd="url(#arrow)" />
                <rect x="55" y="45" width="20" height="10" rx="2" fill="white" stroke="var(--border-color)" strokeWidth="0.8" />
                <text x="65" y="51" fontSize="4" textAnchor="middle">Leaf: Row ptrs</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '480px' }}>
                B-Trees divide sorted keys into balanced pages. Querying starts at the root, traverses pointers matching comparison thresholds, and finds leaf pages holding raw disk addresses.
              </div>
            </div>
          </div>

          <p>
            <strong>Index Types:</strong>
          </p>
          <ul>
            <li><strong>B-Tree:</strong> The default, multi-purpose index suitable for equality searches (<code>=</code>) and range searches (<code>&lt;</code>, <code>&gt;=</code>).</li>
            <li><strong>Hash:</strong> Optimized solely for exact equality checks. Cannot be used for sorting or ranges.</li>
            <li><strong>GIN (Generalized Inverted Index):</strong> Used for compound values (arrays, JSON documents, full-text searches), mapping internal elements to matching rows.</li>
          </ul>

          <h3 id="write-performance">Write Performance &amp; Commit Logs</h3>
          <p>
            Writing directly to database tables requires updating data pages randomly across disk storage. To prevent this from slowing down writes, PostgreSQL uses **Write-Ahead Logging (WAL)**:
          </p>
          <ol>
            <li>When a write request arrives, the transaction details are appended sequentially to a transaction log on disk (the **WAL file**). Sequential writes are extremely fast.</li>
            <li>Once the WAL write completes, the database confirms success to the client. The updated row is buffered in memory.</li>
            <li>In the background, a writer thread updates the actual tables on disk. If the server crashes, the database reads the WAL file sequentially on restart to recover the latest states.</li>
          </ol>

          <h3 id="replication">Master-Replica Scaling (Active-Passive)</h3>
          <p>
            To scale read query capacity, configure **Master-Replica Replication**:
          </p>
          <ul>
            <li><strong>Primary (Master) Node:</strong> Processes all writes and transaction commits.</li>
            <li><strong>Secondary (Replica) Nodes:</strong> Read-only brokers. They tail the Primary's WAL logs to synchronize state.</li>
          </ul>
          <p>
            <strong>Replication Modes:</strong>
          </p>
          <ul>
            <li><strong>Synchronous Replication:</strong> The master node waits for replicas to confirm they wrote the WAL log before acknowledging success to the client. Safest (no data loss), but increases write latencies.</li>
            <li><strong>Asynchronous Replication (Standard):</strong> The master node confirms success immediately after writing its local WAL. It replicates downstream asynchronously. Fast writes, but risks losing a split-second of updates if the master dies.</li>
          </ul>

          <h3 id="data-consistency">Data Consistency &amp; Isolation Levels</h3>
          <p>
            PostgreSQL is fully **ACID-compliant**. To manage concurrent reads and writes, it offers isolation levels (Serializable, Repeatable Read, Read Committed). It achieves concurrency safety using **MVCC (Multi-Version Concurrency Control)**: instead of lock-blocking reads during updates, PostgreSQL retains multiple version records of rows simultaneously, letting concurrent queries read older snapshots safely.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — When to Use & scaling
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="when-to-use">When to Use PostgreSQL</h2>
          <ul>
            <li>Workloads requiring strict transactional guarantees and ACID compliance (financial ledger systems, checkouts).</li>
            <li>Highly relational schemas that require complex dynamic queries and `JOIN` filters.</li>
            <li>Structured data that fits a clean, normalized relational table hierarchy.</li>
          </ul>

          <h3 id="when-to-consider-alternatives">When to Consider Alternatives</h3>
          <ul>
            <li><strong>Extremely High Write Volume:</strong> A single master primary database acts as a write bottleneck. If writes exceed the resource capacity of one large server, distributed stores like Cassandra are a better choice.</li>
            <li><strong>Unstructured/Polymorphic Data:</strong> If schemas are highly variable or require rapid document mutations, document stores (like MongoDB) are more flexible.</li>
            <li><strong>Ad-Hoc Scale:</strong> Relational sharding is complex and requires application-level routing. Managed NoSQL (like DynamoDB) scales automatically.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Appendix: Basic SQL Concepts
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="appendix">Appendix: Basic SQL Concepts</h2>
          <p>
            Let's review the fundamental principles and commands used to interact with relational databases:
          </p>

          <h3 id="relational-principles">Relational Database Principles</h3>
          <p>
            Data is organized into tables (relations). Table relationships are enforced via **Primary Keys** (identifying a row uniquely) and **Foreign Keys** (linking rows in one table to rows in another).
          </p>

          <h3 id="acid-properties">ACID Properties</h3>
          <ul>
            <li><strong>Atomicity:</strong> All modifications in a transaction succeed, or all fail together.</li>
            <li><strong>Consistency:</strong> Transactions transition the database from one valid state to another, enforcing constraints (like foreign keys).</li>
            <li><strong>Isolation:</strong> Concurrent transactions run independently without leaking intermediate states.</li>
            <li><strong>Durability:</strong> Once committed, transaction results survive crashes (persisted on disk via WAL).</li>
          </ul>

          <h3 id="sql-language">Basic SQL Dialect Reference</h3>
          <CodeBlock language="sql">{`-- 1. Create a relational table
CREATE TABLE orders (
  id serial PRIMARY KEY,
  user_id integer NOT NULL,
  total decimal(10,2) DEFAULT 0.00,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- 2. Querying with JOIN and aggregation
SELECT u.name, SUM(o.total) as total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01'
GROUP BY u.name
HAVING SUM(o.total) > 100.00;`}</CodeBlock>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#dynamodb" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">DynamoDB</div>
            </div>
          </a>
          <a href="#flink" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Flink</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
