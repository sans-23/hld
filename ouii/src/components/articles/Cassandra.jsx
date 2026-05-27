import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function Cassandra() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Cassandra</span>
          </div>
          <h1>Cassandra</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn when and how to leverage Apache Cassandra in system design interviews. Master its masterless peer-to-peer architecture, consistent hashing, LSM Tree storage, tunable quorum consistency, and query-driven data modeling.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              16 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              NoSQL & Wide-Column
            </span>
            <span className="difficulty-badge difficulty-badge--advanced">Advanced</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Cassandra Basics
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step.</p>
          </Callout>

          <p>
            Originally created by Facebook to power its inbox search feature, <strong>Apache Cassandra</strong> is a highly scalable, distributed NoSQL database. Many tech giants (like Netflix, Discord, and Apple) rely on Cassandra to handle massive data write volumes and store petabytes of user data across globally distributed commodity hardware.
          </p>

          <h2 id="cassandra-basics">Cassandra Basics</h2>
          <p>
            To understand Cassandra, let's look at its logical data model and primary key structure:
          </p>

          <h3 id="data-model">Logical Data Model</h3>
          <ul>
            <li><strong>Keyspace:</strong> The outer namespace, equivalent to a database in relational systems. A keyspace defines replication factors and strategies.</li>
            <li><strong>Table:</strong> Lives inside a keyspace and organizes records into rows. Tables are schema-defined, specifying column names and types.</li>
            <li><strong>Row:</strong> Represents a single entity record, uniquely identified by a primary key.</li>
            <li><strong>Column:</strong> The smallest storage unit. Since Cassandra is a wide-column store, rows inside the same table do not need to contain the exact same set of columns (avoiding space-wasting NULL values). Every column written has associated timestamp metadata for conflict resolution (Last Write Wins).</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Cassandra Wide-Column Logical Model</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>Flexible Rows (Sparse columns)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Row 1: <code>{"{ user_id: 1, age: 24, name: 'Alice' }"}</code><br />
                  Row 2: <code>{"{ user_id: 2, name: 'Bob', bio: 'Designer' }"}</code>
                  <br /><br />
                  No database storage is wasted on columns that are absent for a specific row.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong>Cell Metadata (Last Write Wins)</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Every cell contains:
                  <br />
                  - <strong>Name:</strong> <code>email</code><br />
                  - <strong>Value:</strong> <code>alice@example.com</code><br />
                  - <strong>Timestamp:</strong> <code>1704067200000</code> (microsecond resolution, used to resolve replica conflicts)
                </p>
              </div>
            </div>
          </div>

          <h3 id="primary-key">Primary Keys: Partition vs. Clustering Keys</h3>
          <p>
            Understanding how Cassandra primary keys work is crucial for system design modeling. A Primary Key consists of two parts:
          </p>
          <ol>
            <li><strong>Partition Key:</strong> Determines which physical node in the cluster stores that row. Cassandra hashes the partition key columns to find the target node.</li>
            <li><strong>Clustering Key:</strong> Determines the physical sorted order of rows within a single partition. Useful for range queries (e.g., retrieving recent chats chronologically).</li>
          </ol>

          <CodeBlock language="sql">{`-- 1. Simple Primary Key (user_id is the partition key, no clustering key)
CREATE TABLE users (
  user_id uuid,
  name text,
  PRIMARY KEY (user_id)
);

-- 2. Compound Primary Key (channel_id partition key, message_id clustering key)
CREATE TABLE channel_messages (
  channel_id uuid,
  message_id timeuuid,
  body text,
  PRIMARY KEY ((channel_id), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);`}</CodeBlock>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Key Concepts
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="key-concepts">Key Concepts</h2>
          <p>
            How does Cassandra achieve scale, tolerate failures, and store files under the hood?
          </p>

          <h3 id="partitioning">Consistent Hashing Ring & Virtual Nodes</h3>
          <p>
            Cassandra maps data to nodes using a <strong>Consistent Hashing Ring</strong>. Instead of basic modulo hashing (<code>hash(key) % node_count</code>, which causes mass migrations when nodes join/leave), consistent hashing hashes keys to a continuous $2^{127}-1$ integer range visualized as a ring.
          </p>
          <p>
            To prevent uneven data distributions, Cassandra maps physical nodes to multiple **Virtual Nodes (vnodes)** scattered across the ring. This balances partition weights and spreads CPU load evenly.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Consistent Hashing Ring with Vnodes</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <svg width="220" height="220" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3,3" />
                
                {/* Physical Node 1 (Green) vnodes */}
                <circle cx="50" cy="10" r="4" fill="var(--success)" stroke="white" strokeWidth="1" />
                <text x="50" y="4" fontSize="5" textAnchor="middle" fontWeight="bold">vNode A1</text>

                <circle cx="85" cy="70" r="4" fill="var(--success)" stroke="white" strokeWidth="1" />
                <text x="94" y="72" fontSize="5" textAnchor="middle" fontWeight="bold">vNode A2</text>

                {/* Physical Node 2 (Blue) vnodes */}
                <circle cx="90" cy="35" r="4" fill="var(--primary)" stroke="white" strokeWidth="1" />
                <text x="99" y="37" fontSize="5" textAnchor="middle" fontWeight="bold">vNode B1</text>

                <circle cx="15" cy="65" r="4" fill="var(--primary)" stroke="white" strokeWidth="1" />
                <text x="6" y="67" fontSize="5" textAnchor="middle" fontWeight="bold">vNode B2</text>

                {/* Physical Node 3 (Red) vnodes */}
                <circle cx="50" cy="90" r="4" fill="var(--accent)" stroke="white" strokeWidth="1" />
                <text x="50" y="98" fontSize="5" textAnchor="middle" fontWeight="bold">vNode C1</text>

                <circle cx="15" cy="35" r="4" fill="var(--accent)" stroke="white" strokeWidth="1" />
                <text x="6" y="37" fontSize="5" textAnchor="middle" fontWeight="bold">vNode C2</text>

                {/* Hashed Key */}
                <circle cx="70" cy="20" r="2.5" fill="black" />
                <path d="M 70 20 Q 82 23 88 32" fill="none" stroke="black" strokeWidth="0.8" markerEnd="url(#arrow)" strokeDasharray="1,1" />
                <text x="70" y="16" fontSize="4.5" textAnchor="middle" fontStyle="italic">Hash(Key) ➔ clockwise to vNode B1</text>
              </svg>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '480px' }}>
                Each physical machine owns multiple color-coded virtual nodes (vnodes) on the ring. Incoming writes hash to a position and find the next vnode clockwise.
              </div>
            </div>
          </div>

          <h3 id="replication">Replication Strategy</h3>
          <p>
            Replication factors dictate how many copies of each partition exist. Cassandra chooses replica nodes by finding the primary coordinator token and walking clockwise to select $RF - 1$ unique physical nodes.
          </p>
          <ul>
            <li><strong>NetworkTopologyStrategy (Recommended):</strong> Rack and data-center aware. Distributes replicas across multiple availability zones and racks to ensure data survives server center outages.</li>
            <li><strong>SimpleStrategy:</strong> Places replicas sequentially clockwise on the ring. Best for local development and testing.</li>
          </ul>

          <h3 id="consistency">Tunable Consistency &amp; Quorum</h3>
          <p>
            Cassandra is masterless—any node can coordinate a read or write. It trades transactional guarantees (ACID) for speed and availability. To balance this, Cassandra offers **Tunable Consistency** at query time:
          </p>
          <p>
            For a replication factor of $N$, you can specify the write consistency level ($W$) and read consistency level ($R$). By setting:
            <br />
            $$\mathbf{R + W > N}$$
            <br />
            You guarantee a <strong>Strongly Consistent Read</strong> (meaning the read set overlaps with the write set on at least one replica node containing the latest update).
          </p>
          <ul>
            <li><strong>QUORUM:</strong> Requires a majority ($\lfloor N/2 \rfloor + 1$) of replica nodes to respond before confirming success.</li>
            <li><strong>ONE:</strong> Confirms success as soon as a single replica node responds. Highly available with lowest latency, but risks reading stale data.</li>
          </ul>

          <h3 id="query-routing">Coordinator Query Routing</h3>
          <p>
            A client can connect to any random broker in the Cassandra cluster. That node acts as the **Coordinator**, computing the key hash to find replica locations, issuing parallel requests, and merging results based on the requested consistency level.
          </p>

          <h3 id="storage-model">LSM Tree Storage Engine</h3>
          <p>
            Relational databases use B-Trees, which involve random disk writes. Cassandra optimizes write throughput by employing **Log-Structured Merge Trees (LSM Trees)**. This turns writes into sequential append-only disk operations:
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Cassandra LSM Tree Write & Read Path</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>1. Sequential Write Path</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                  - incoming data appends to the sequential disk <strong>Commit Log</strong> (for durability).<br />
                  - The write is added to the in-memory, sorted <strong>Memtable</strong>.<br />
                  - Writes are fast because they bypass random disk I/O.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>2. SSTable Flush &amp; Compaction</strong>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                  - When Memtable fills, it flushes to disk as a sorted, immutable <strong>SSTable</strong>.<br />
                  - Background <strong>Compaction</strong> merges small SSTables and discards overwritten cells/deleted tombstones.
                </p>
              </div>
            </div>
          </div>

          <p>
            <strong>Tombstones &amp; Deletes:</strong> Because SSTables are immutable on disk, a deletion does not rewrite old files. Instead, Cassandra writes a <code>tombstone</code> marker. Stale records and tombstones are cleared during background compaction processes.
          </p>
          <p>
            <strong>Reads:</strong> Reads merge data from Memtables and SSTables. Cassandra uses a **Bloom Filter** (a fast, probabilistic in-memory filter) to verify if an SSTable contains the key before attempting disk reads.
          </p>

          <h3 id="gossip">Cluster State Gossip Protocol</h3>
          <p>
            Cassandra runs without a single master or manager. Instead, nodes share cluster state metadata, schemas, and coordinate health updates using an asynchronous **Gossip Protocol**. Nodes periodically pick random peers to share clocks, versions, and cluster configurations, propagating updates eventually.
          </p>

          <h3 id="fault-tolerance">Fault Detection &amp; Hinted Handoffs</h3>
          <p>
            If a coordinator tries to write to a replica that is temporarily offline, Cassandra doesn't fail the query. Instead, it stores a **Hint** (a temporary record of the write) on the coordinator. When gossip detects the replica is back online, the coordinator hands off the hints to bring the replica up to speed.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Data Modeling
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-to-use-cassandra">How to use Cassandra</h2>
          <h3 id="data-modeling">Query-Driven Data Modeling</h3>
          <p>
            In SQL, you design schemas around entity relationships and normalize tables to avoid duplicates, relying on dynamic `JOIN` operations. In Cassandra, **JOINs do not exist**.
          </p>
          <p>
            Cassandra data modeling is **Query-Driven**. You model your tables to serve specific queries. If a query needs data from two entities, you denormalize and duplicate the data across multiple tables.
          </p>

          <h4 id="discord-messages-example">Real-World Case: Discord Messages</h4>
          <p>
            Discord migrated message storage to Cassandra because of its massive volume. Since users query messages by channel sorted chronologically, Discord designed a table mapped to that access pattern:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE messages (
  channel_id bigint,
  bucket_id int, -- Partition Key (combines channel_id + bucket_id)
  message_id bigint, -- Clustering Key (sorted timeuuid)
  author_id bigint,
  content text,
  PRIMARY KEY ((channel_id, bucket_id), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);`}</CodeBlock>
          <p>
            <strong>Bucket ID Strategy:</strong> To prevent a single channel from growing partitions indefinitely (large partitions clog disk merging and heap space), Discord introduced a bucket ID representing time slices (e.g. 10-day intervals). The partition key became composite <code>(channel_id, bucket_id)</code>, capping maximum partition sizes.
          </p>

          <h4 id="ticketmaster-example">Real-World Case: Ticketmaster Venue View</h4>
          <p>
            When users browse event seat availability, they query by event and section. Using a compound partition key prevents scattering queries across the cluster:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE event_seats (
  event_id bigint,
  section_id bigint,
  seat_id bigint,
  status text,
  price decimal,
  PRIMARY KEY ((event_id, section_id), seat_id)
);`}</CodeBlock>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Advanced Features
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="advanced-features">Advanced Features</h2>
          <ul>
            <li><strong>Storage-Attached Indexes (SAI):</strong> Allow querying columns without partition keys, providing secondary indices with optimized column disk lookup.</li>
            <li><strong>Materialized Views:</strong> Cassandra automatically maintains secondary tables with alternate primary keys, handling application-level data duplication.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Cassandra in an Interview
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="cassandra-in-an-interview">Cassandra in System Design Interviews</h2>
          
          <h3 id="when-to-use">When to Propose Cassandra</h3>
          <ul>
            <li>High write volume (LSM Tree writes are append-only and extremely fast).</li>
            <li>Heavy volume scaling (horizontal partitioning scales linearly with ring brokers).</li>
            <li>Predictable access patterns (you can structure tables around specific queries).</li>
            <li>Eventual consistency tolerance (like chat logs, timeline streams, sensor metrics).</li>
          </ul>

          <h3 id="knowing-its-limitations">When to Avoid Cassandra</h3>
          <ul>
            <li>Need strict ACID transactions or multi-row transactional rollbacks.</li>
            <li>Complex relational data schemas requiring frequent `JOIN` queries.</li>
            <li>Unpredictable, ad-hoc aggregation queries (Cassandra has no native, fast GROUP BY / dynamic indexes).</li>
          </ul>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#api-gateway" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">API Gateway</div>
            </div>
          </a>
          <a href="#dynamodb" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">DynamoDB</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
