import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function ZooKeeper() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">ZooKeeper</span>
          </div>
          <h1>ZooKeeper</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master distributed coordination with Apache ZooKeeper. Learn about the Zab consensus protocol, hierarchical znodes (persistent, ephemeral, sequential), client watchers, leader election, and distributed locks for your system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              13 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Consensus & Coordination
            </span>
            <span className="difficulty-badge difficulty-badge--advanced">Advanced</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — A Motivating Example
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step.</p>
          </Callout>

          <h2 id="motivating-example">A Motivating Example</h2>
          <p>
            Imagine a distributed database running across 5 server nodes. To coordinate writes, the nodes need to elect one server as the **Leader**. If each server independently votes for itself, or if a network partition splits the cluster into two groups that each elect their own leader (a **split-brain** scenario), database writes will conflict and corrupt user data.
          </p>
          <p>
            To prevent this, distributed systems require a highly reliable, strongly consistent coordination service that can run consensus, manage configuration states, and coordinate locks across servers. This is the purpose of <strong>Apache ZooKeeper</strong>.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — ZooKeeper Basics
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="zookeeper-basics">ZooKeeper Basics</h2>
          <p>
            ZooKeeper is a distributed, hierarchical coordination service that stores configuration and status data in-memory for speed, while maintaining durability using transaction logging on disk.
          </p>

          <h3 id="data-model">Hierarchical Data Model: ZNodes</h3>
          <p>
            ZooKeeper structures its data like a file system directory tree. Each node in the tree is called a **ZNode**, and can store data (up to 1MB) as well as contain child znodes:
          </p>

          <div className="diagram-container">
            <div className="diagram-title">ZooKeeper Hierarchical ZNode Structure</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <svg width="280" height="130" viewBox="0 0 140 65" style={{ overflow: 'visible' }}>
                {/* Root ZNode */}
                <circle cx="70" cy="8" r="4.5" fill="var(--primary)" />
                <text x="70" y="9.5" fontSize="4.5" fill="white" fontWeight="bold" textAnchor="middle">/</text>

                {/* Level 1 ZNodes */}
                <path d="M 70 8 L 35 24" stroke="var(--border-color)" strokeWidth="0.8" />
                <rect x="25" y="24" width="20" height="10" rx="2" fill="white" stroke="var(--primary)" strokeWidth="0.8" />
                <text x="35" y="30" fontSize="4.5" fontWeight="bold" textAnchor="middle">/config</text>

                <path d="M 70 8 L 105 24" stroke="var(--border-color)" strokeWidth="0.8" />
                <rect x="95" y="24" width="20" height="10" rx="2" fill="white" stroke="var(--primary)" strokeWidth="0.8" />
                <text x="105" y="30" fontSize="4.5" fontWeight="bold" textAnchor="middle">/services</text>

                {/* Level 2 ZNodes */}
                <path d="M 105 34 L 85 48" stroke="var(--border-color)" strokeWidth="0.8" />
                <rect x="73" y="48" width="24" height="10" rx="2" fill="var(--bg-accent)" stroke="var(--border-color)" strokeWidth="0.6" />
                <text x="85" y="54" fontSize="3.5" textAnchor="middle">/services/user-api</text>

                <path d="M 105 34 L 125 48" stroke="var(--border-color)" strokeWidth="0.8" />
                <rect x="113" y="48" width="24" height="10" rx="2" fill="var(--bg-accent)" stroke="var(--border-color)" strokeWidth="0.6" />
                <text x="125" y="54" fontSize="3.5" textAnchor="middle">/services/order-api</text>
              </svg>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '480px' }}>
                ZNodes are arranged in a tree. Paths can hold configurations (like database URLs) or act as dynamic service discovery paths.
              </div>
            </div>
          </div>

          <p>
            <strong>ZNode Types:</strong>
          </p>
          <ul>
            <li><strong>Persistent ZNodes:</strong> Remain in the ZooKeeper store until explicitly deleted by a client application. Best for storing configuration variables.</li>
            <li><strong>Ephemeral ZNodes:</strong> Automatically deleted by ZooKeeper when the client session that created them terminates or drops connection. Excellent for health monitoring.</li>
            <li><strong>Sequential ZNodes:</strong> ZooKeeper automatically appends a monotonically increasing 10-digit counter to the znode name upon creation (e.g., <code>/locks/lock-0000000001</code>). Used for distributed locking.</li>
          </ul>

          <h3 id="server-roles">Server Ensemble</h3>
          <p>
            ZooKeeper runs in a cluster called an **Ensemble** (typically 3, 5, or 7 servers).
          </p>
          <ul>
            <li><strong>Leader:</strong> Coordinates writes and proposes transactions.</li>
            <li><strong>Followers:</strong> Participate in voting consensus and execute read requests.</li>
            <li><strong>Observers:</strong> Read-only nodes that replicate state to scale read throughput without participating in quorum voting, saving network consensus overhead.</li>
          </ul>

          <h3 id="watches">Watches: Event Notifications</h3>
          <p>
            Instead of clients polling ZooKeeper continuously to look for state modifications (which degrades performance), clients can register a **Watch** on a ZNode. When the ZNode changes or gets deleted, ZooKeeper sends a one-shot notification event to the watching client over its TCP connection.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Key Capabilities
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="key-capabilities">Key Capabilities &amp; Use Cases</h2>
          
          <h3 id="config-management">1. Configuration Management</h3>
          <p>
            Store central application configurations (like feature flags or routing tables) in persistent ZNodes. All application instances listen using Watches. When an administrator updates a config, ZooKeeper pushes updates to all servers instantly.
          </p>

          <h3 id="service-discovery">2. Service Discovery</h3>
          <p>
            Microservices register themselves by creating ephemeral ZNodes containing their IP and port under <code>/services/service-name/</code>. If a service instance crashes, its ephemeral ZNode is automatically deleted, and clients watching the path update their routing list.
          </p>

          <h3 id="leader-election">3. Leader Election</h3>
          <p>
            A pool of servers competes to create an ephemeral ZNode `/leader`. The first server to succeed becomes the leader. All other servers set a Watch on `/leader`. If the leader crashes, the ephemeral node disappears, notifying the standby servers to run another election.
          </p>

          <h3 id="distributed-locks">4. Distributed Locking</h3>
          <p>
            Clients compete to create sequential ephemeral znodes under `/locks/lock-`. The client that gets the lowest sequence number holds the lock. Other clients watch the znode immediately preceding their sequence number to receive notifications when they are next in line.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — How ZooKeeper Works
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-zookeeper-works">How ZooKeeper Works</h2>
          
          <h3 id="zab-consensus">ZAB (ZooKeeper Atomic Broadcast) Consensus</h3>
          <p>
            ZooKeeper guarantees strong consistency using the **ZAB Protocol**:
          </p>
          <ol>
            <li>All write requests are forwarded to the active **Leader**.</li>
            <li>The leader proposes the write as a transaction proposal and broadcasts it to all Followers.</li>
            <li>Followers write the transaction to their local logs and reply with an ACK.</li>
            <li>Once the leader receives ACKs from a **Quorum** (majority) of nodes, it commits the write locally and broadcasts a commit message, notifying followers to apply the change.</li>
          </ol>

          <h3 id="consistency-guarantees">Strong Consistency Guarantees</h3>
          <p>
            ZAB ensures:
          </p>
          <ul>
            <li><strong>Sequential Consistency:</strong> Updates from a client are applied in the exact order they are sent.</li>
            <li><strong>Single System Image:</strong> Clients see the same view of ZooKeeper regardless of which server node they connect to.</li>
          </ul>

          <h3 id="read-write-ops">Read and Write Performance</h3>
          <p>
            Because ZooKeeper stores its entire data tree in memory, **Reads are extremely fast** ($O(1)$) and can be served by any Follower or Observer node without consensus overhead.
          </p>
          <p>
            However, **Writes are limited by consensus round-trips**. Adding more servers to the cluster increases read throughput but *degrades* write performance due to the increased network coordination required to reach quorum.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Modern ZooKeeper
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="modern-world">ZooKeeper in the Modern World</h2>
          
          <h3 id="current-usage">Current Usage</h3>
          <p>
            ZooKeeper forms the backbone of many complex distributed architectures:
          </p>
          <ul>
            <li>Apache Kafka (historically used ZooKeeper for broker coordination and leader partition tracking).</li>
            <li>Apache Hadoop (uses ZooKeeper for NameNode high availability and active leader tracking).</li>
          </ul>

          <h3 id="alternatives">Alternatives to Consider</h3>
          <ul>
            <li><strong>etcd:</strong> A modern, lightweight distributed key-value store using the **Raft** consensus protocol, commonly used as Kubernetes' configuration backing.</li>
            <li><strong>Consul:</strong> A HashiCorp coordination tool featuring native service discovery, health-checks, and key-value store capabilities using Raft.</li>
            <li><strong>KRaft (Kafka Raft):</strong> Kafka has migrated away from ZooKeeper to its own internal consensus engine (KRaft) to simplify deployment and remove the external coordinator dependency.</li>
          </ul>

          <h3 id="when-to-use">When to Propose ZooKeeper in Interviews</h3>
          <ul>
            <li>Propose ZooKeeper when designing systems that require active master-standby coordination, leader election, or distributed locks.</li>
            <li>Avoid it for storing large data objects (ZNodes are limited to 1MB) or as a general database.</li>
          </ul>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#flink" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Flink</div>
            </div>
          </a>
          <a href="#time-series" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Time Series Databases</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
