import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function ConsistentHashing() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Core Concepts</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Consistent Hashing</span>
          </div>
          <h1>Consistent Hashing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            What problem does consistent hashing solve, how does it work, and how can you use it in an interview.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              20 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Distributed Systems
            </span>
            <span className="difficulty-badge difficulty-badge--advanced">Advanced</span>
          </div>
        </div>

        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step</p>
          </Callout>

          <p>
            While preparing for system design interviews I'm sure you've come across consistent hashing. It's a foundational algorithm in distributed systems that is used to distribute data across a cluster of servers.
          </p>
          <p>
            There are quite literally thousands of resources online that explain it, yet somehow I find the majority are overly academic.
          </p>
          <p>
            In this deep dive, we'll give a hyper focused overview of consistent hashing, including the problem it solves, how it works, and how you can use it in your interviews.
          </p>
        </section>

        <section className="content-section">
          <h2 id="consistent-hashing-via-an-example">Consistent Hashing via an Example</h2>
          <p>
            Let's build up our intuition via a motivating example.
          </p>
          <p>
            Imagine you're designing a ticketing system like TicketMaster. Initially, your system is simple:
          </p>
          <ul>
            <li>One database storing all event data</li>
            <li>Clients making requests to fetch event information</li>
            <li>Everything works smoothly at first</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Client Server Database</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', gap: '2rem' }}>
              <div className="diagram-box diagram-box--client">Clients</div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box diagram-box--server">App Server</div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            But success brings challenges. As your platform grows popular and hosts more events, a single database can no longer handle the load. You need to distribute your data across multiple databases – a process called sharding.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Sharding</div>
            <div className="diagram-flow" style={{ flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div className="diagram-box diagram-box--server">App Server</div>
              
              <div style={{ display: 'flex', gap: '8px', position: 'relative', width: '200px', justifyContent: 'center' }}>
                <svg style={{ position: 'absolute', top: '-24px', left: 0, width: '100%', height: '24px' }}>
                  <line x1="50%" y1="0" x2="20%" y2="24" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrowhead-primary)" />
                  <line x1="50%" y1="0" x2="50%" y2="24" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrowhead-primary)" />
                  <line x1="50%" y1="0" x2="80%" y2="24" stroke="var(--primary)" strokeWidth="2" markerEnd="url(#arrowhead-primary)" />
                </svg>
                <div className="diagram-box diagram-box--server" style={{ width: '60px' }}>DB 0</div>
                <div className="diagram-box diagram-box--server" style={{ width: '60px' }}>DB 1</div>
                <div className="diagram-box diagram-box--server" style={{ width: '60px' }}>DB 2</div>
              </div>
            </div>
          </div>

          <p>
            The question we need to answer is: How do we know which events to store on which database instance?
          </p>

          <h3 id="first-attempt-simple-modulo-hashing">First Attempt: Simple Modulo Hashing</h3>
          <p>
            The most straightforward approach to distribute data across multiple databases is modulo hashing.
          </p>
          <ul>
            <li>First, we take the event ID and run it through a hash function, which converts it into a number</li>
            <li>Then, we take that number and perform the modulo operation (%) with the number of databases</li>
            <li>The result tells us which database should store that event</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Modulo Hashing</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', gap: '1rem' }}>
              <div className="diagram-box diagram-box--client">Event #1234</div>
              <div className="diagram-arrow">→ hash() →</div>
              <div className="diagram-box diagram-box--server" style={{ background: '#f5f5f5', color: '#333', borderColor: '#ccc' }}>5431234</div>
              <div className="diagram-arrow">→ % 3 =</div>
              <div className="diagram-box diagram-box--server" style={{ fontWeight: 'bold' }}>DB 1</div>
            </div>
          </div>

          <p>
            In code, it looks like this:
          </p>
          <CodeBlock language="python">{`database_id = hash(event_id) % number_of_databases`}</CodeBlock>

          <p>
            For a concrete example with 3 databases:
          </p>
          <ul>
            <li>Event #1234 → hash(1234) % 3 = 1 → Database 1</li>
            <li>Event #5678 → hash(5678) % 3 = 0 → Database 0</li>
            <li>Event #9012 → hash(9012) % 3 = 2 → Database 2</li>
          </ul>

          <p>
            Great! This works well, until you run into a few problems.
          </p>
          <p>
            The first problem comes when you want to add a fourth database instance. To do so, you naively think that all you need to do is run the modulo operation with 4 instead of 3.
          </p>
          <CodeBlock language="python">{`database_id = hash(event_id) % 4`}</CodeBlock>
          <p>
            You change the code, and push to production but then your database activity goes through the roof! Not just for the fourth database instance either, but for all of them.
          </p>
          <p>
            What happened was the change in the hash function did not only impact data that should be stored on the new instance, but it changed which database instance almost every event was stored on.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Issue adding a Node</div>
            <div className="diagram-flow" style={{ flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'center', color: '#c62828', fontWeight: 'bold' }}>Massive Data Redistribution!</div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 0</div>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 1</div>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 2</div>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 3</div>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>hash(1234) % 3 = 1  →  hash(1234) % 4 = 0</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>hash(5678) % 3 = 0  →  hash(5678) % 4 = 2</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>hash(9012) % 3 = 2  →  hash(9012) % 4 = 0</div>
            </div>
          </div>

          <p>
            For example, event #1234 used to map to database 1, but now, <code>hash(1234) % 4 = 0</code> so that data instead needs to be moved to database 0.
          </p>
          <p>
            This means the data needs to be moved from database 1 to database 0. This isn't an isolated case - most of your data needs to be redistributed across all database instances, causing massive unnecessary data movement. This causes huge spikes in database load and means users are either unable to access data or they experience slow response times.
          </p>
          <p>
            Let's look at another problem with simple modulo hashing.
          </p>
          <p>
            Imagine a database went down. This could be due to anything from a hardware failure to a software bug. In any case, we need to remove it from the pool of databases and redistribute the data across the remaining instances until we can pull a new one online.
          </p>
          <p>
            Our hash function now changes from <code>database_id = hash(event_id) % 3</code> to <code>database_id = hash(event_id) % 2</code> and we run into the exact same redistribution problem we had before.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Issue removing a Node</div>
            <div className="diagram-flow" style={{ flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 0</div>
                <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>DB 1</div>
                <div className="diagram-box diagram-box--server" style={{ background: '#eeeeee', borderColor: '#999', color: '#999', textDecoration: 'line-through' }}>DB 2 (Down)</div>
              </div>
              <div style={{ textAlign: 'center', color: '#c62828', fontWeight: 'bold' }}>All keys % 2 remapped!</div>
            </div>
          </div>

          <p>
            Clearly simple modulo hashing isn't cutting it. Enter, Consistent Hashing.
          </p>
        </section>

        <section className="content-section">
          <h2 id="consistent-hashing">Consistent Hashing</h2>
          <p>
            Consistent hashing is a technique that solves the problem of data redistribution when adding or removing a instance in a distributed system. The key insight is to arrange both our data and our databases in a circular space, often called a "hash ring."
          </p>
          <p>
            Here's how it works:
          </p>
          <ul>
            <li>We first create a hash ring with a fixed number of points. To keep it simple, let's say 100.</li>
            <li>We then place our database nodes on the hash ring. In the case where we have 4 databases, we could put them at points 0, 25, 50, and 75.</li>
            <li>In order to know which database an event should be stored on, we first hash the event ID like we did before, but instead of using modulo, we just find the hash value on the ring and then move clockwise until we find a database instance.</li>
          </ul>
          <p>
            In reality, a hash ring usually has a hash space of 0 to 2^32 - 1 not 0-100, but the concept is the same.
          </p>
          <p>
            How did this solve our problem? Let's look at what happens when we add or remove a database:
          </p>

          <h3 id="adding-a-database">Adding a Database (Database 5)</h3>
          <p>
            Let's say we add a fifth database at position 90 on our ring. Now:
          </p>
          <ul>
            <li>Only events that hash to positions between 75 and 90 need to move</li>
            <li>These events were previously going to DB1 (at position 0)</li>
            <li>All other events stay exactly where they are!</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Hash Ring with DB5 added</div>
            <div style={{ position: 'relative', width: '240px', height: '240px', borderRadius: '50%', border: '4px solid #ddd', margin: '2rem auto' }}>
              {/* Nodes */}
              <div style={{ position: 'absolute', top: '-16px', left: '100px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB1 (0)</div>
              <div style={{ position: 'absolute', top: '100px', right: '-16px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB2 (25)</div>
              <div style={{ position: 'absolute', bottom: '-16px', left: '100px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB3 (50)</div>
              <div style={{ position: 'absolute', top: '100px', left: '-16px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB4 (75)</div>
              
              {/* New DB5 */}
              <div style={{ position: 'absolute', top: '-6px', left: '12px', background: '#e8f5e9', border: '2px dashed #4caf50', color: '#2e7d32', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB5 (90)</div>

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>
                Items (75-90)<br/>move to DB5
              </div>
            </div>
          </div>

          <p>
            Whereas before almost all data needed to be redistributed, with consistent hashing, we're only moving about 60% of the events that were on DB1 (the 75-90 range, which is 15 out of DB1's 25-unit span), or roughly 15% of all our events.
          </p>

          <h3 id="removing-a-database">Removing a Database</h3>
          <p>
            Similarly, if Database 2 (at position 25) fails:
          </p>
          <ul>
            <li>Only events that were mapped to Database 2 need to move</li>
            <li>These events will now map to Database 3 (at position 50)</li>
            <li>Everything else stays put</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Hash Ring with DB2 removed</div>
            <div style={{ position: 'relative', width: '240px', height: '240px', borderRadius: '50%', border: '4px solid #ddd', margin: '2rem auto' }}>
              <div style={{ position: 'absolute', top: '-16px', left: '100px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB1 (0)</div>
              
              {/* Removed DB2 */}
              <div style={{ position: 'absolute', top: '100px', right: '-16px', background: '#ffebee', border: '2px solid #ef5350', color: '#c62828', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'line-through' }}>DB2 (25)</div>
              
              <div style={{ position: 'absolute', bottom: '-16px', left: '100px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB3 (50)</div>
              <div style={{ position: 'absolute', top: '100px', left: '-16px', background: 'var(--bg-card)', border: '2px solid var(--primary)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>DB4 (75)</div>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '0.8rem', color: '#c62828' }}>
                Items (0-25)<br/>move to DB3
              </div>
            </div>
          </div>

          <h3 id="virtual-nodes">Virtual Nodes</h3>
          <p>
            We've made good progress, but there is still just one problem. In our example above where we removed database 2, we had to move all events that were stored on database 2 to database 3. Now database 3 has 2x the load of database 1 and database 4. We'd much prefer if we could spread the load more evenly so database 3 wasn't overloaded.
          </p>
          <p>
            The solution is to use what are called "virtual nodes". Instead of putting each database at just one point on the ring, we put it at multiple points by hashing different variations of the database name.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Hash Ring with Virtual Nodes</div>
            <div style={{ position: 'relative', width: '280px', height: '280px', borderRadius: '50%', border: '4px solid #ddd', margin: '2rem auto' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '120px', background: '#e3f2fd', border: '1px solid #1976d2', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB1-vn1</div>
              <div style={{ position: 'absolute', top: '20px', right: '40px', background: '#f3e5f5', border: '1px solid #7b1fa2', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB2-vn1</div>
              <div style={{ position: 'absolute', top: '120px', right: '-12px', background: '#e8f5e9', border: '1px solid #388e3c', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB3-vn1</div>
              <div style={{ position: 'absolute', bottom: '40px', right: '40px', background: '#fff3e0', border: '1px solid #f57c00', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB4-vn1</div>
              
              <div style={{ position: 'absolute', bottom: '-12px', left: '120px', background: '#f3e5f5', border: '1px solid #7b1fa2', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB2-vn2</div>
              <div style={{ position: 'absolute', bottom: '40px', left: '40px', background: '#e3f2fd', border: '1px solid #1976d2', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB1-vn2</div>
              
              <div style={{ position: 'absolute', top: '120px', left: '-12px', background: '#fff3e0', border: '1px solid #f57c00', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB4-vn2</div>
              <div style={{ position: 'absolute', top: '40px', left: '40px', background: '#e8f5e9', border: '1px solid #388e3c', padding: '2px 4px', borderRadius: '4px', fontSize: '0.75rem' }}>DB3-vn2</div>
              
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                Nodes interleaved<br/>around the ring
              </div>
            </div>
          </div>

          <p>
            For example, instead of just hashing "DB1" to get position 0, we hash "DB1-vn1", "DB1-vn2", "DB1-vn3", etc., which might give us positions 20, 35, 65 and so on. We do this for each database, which results in the virtual nodes being naturally intermixed around the ring.
          </p>
          <p>
            Now when Database 2 fails:
          </p>
          <ul>
            <li>The events that were mapped to "DB2-vn1" will be redistributed to Database 1</li>
            <li>The events that were mapped to "DB2-vn2" will go to Database 3</li>
            <li>The events that were mapped to "DB2-vn3" will go to Database 4</li>
            <li>And so on...</li>
          </ul>
          <p>
            This means the load from the failed database gets distributed much more evenly across all remaining databases instead of overwhelming just one neighbor. The more virtual nodes you use per database, the more evenly distributed the load becomes.
          </p>
          <p>
            Virtual nodes also help when adding a new database. Without virtual nodes, a new node only takes load from its single clockwise neighbor. With virtual nodes, the new node's virtual positions are spread around the ring, so it absorbs a small chunk of data from multiple existing nodes. This gives you a much more balanced cluster from the start, rather than only relieving one overloaded neighbor.
          </p>
        </section>

        <section className="content-section">
          <h2 id="addressing-hot-spots">Addressing Hot Spots</h2>
          <p>
            Even with virtual nodes distributing data evenly, hot spots can still occur. A hot spot is when one node gets a disproportionate amount of traffic because certain keys are far more popular than others. Think of a ticketing system where a Taylor Swift concert generates 100x the reads of any other event.
          </p>
          <p>
            Consistent hashing doesn't solve this on its own since it distributes keys evenly, not traffic. Here are a few strategies that real systems use:
          </p>
          <ul>
            <li><strong>Read replicas:</strong> Replicate popular keys across multiple nodes and load-balance reads among them. This is the most common approach.</li>
            <li><strong>Key-space salting:</strong> Append a random suffix to hot keys (e.g., <code>taylor-swift-{'{'}0..9{'}'}</code>) so they hash to different nodes. Reads then scatter across those nodes and get aggregated.</li>
            <li><strong>Adaptive rebalancing:</strong> Monitor traffic in real-time and move specific key ranges off overloaded nodes. This is operationally complex but some systems (like DynamoDB) do it automatically.</li>
          </ul>
          <Callout type="tip" title="Interview Context">
            <p>In an interview, the key distinction to make is: <strong>virtual nodes</strong> prevent structural imbalance (uneven key distribution), while <strong>replication and key salting</strong> prevent workload imbalance (uneven traffic).</p>
          </Callout>
        </section>

        <section className="content-section">
          <h2 id="data-movement-in-practice">Data Movement in Practice</h2>
          <p>
            Consistent hashing tells you where data should live, but it doesn't magically teleport terabytes of data when a node goes down. In practice, most distributed databases use replication alongside consistent hashing to handle failures without moving data at all.
          </p>
          <p>
            For example, DynamoDB replicates each partition across three availability zones. When a primary node fails, a replica is promoted via a consensus algorithm like Raft, and no data needs to move. Cassandra works similarly, replicating data to N consecutive nodes on the ring so reads can be served from surviving replicas.
          </p>
          <p>
            Data movement really only happens during planned membership changes like adding capacity or permanently replacing a node to restore the replication factor. Even then, consistent hashing ensures only a bounded fraction of keys need to be re-replicated, not the entire dataset.
          </p>
        </section>

        <section className="content-section">
          <h2 id="consistent-hashing-in-the-real-world">Consistent Hashing in the Real World</h2>
          <p>
            While our example focused on scaling a database, note that consistent hashing applies to any scenarios where you need to distribute data across a cluster of servers. This cluster could be databases, sure, but they could also be caches, message brokers, or even just a set of application servers.
          </p>
          <p>
            We see consistent hashing (or variations of it) used in many heavily relied on, scaled, systems. For example:
          </p>
          <ul>
            <li><strong>Apache Cassandra:</strong> Uses consistent hashing to distribute data across the ring</li>
            <li><strong>Amazon's DynamoDB:</strong> Uses consistent hashing under the hood for partition placement</li>
            <li><strong>Content Delivery Networks (CDNs):</strong> Use consistent hashing to determine which edge server should cache specific content</li>
          </ul>
          <p>
            Not every distributed system uses consistent hashing. Redis Cluster, for example, uses a fixed hash slot approach instead. It divides the key space into 16,384 slots using <code>CRC16(key) mod 16384</code> and assigns ranges of slots to nodes. This is simpler to reason about, though it requires more coordination when rebalancing. The choice between consistent hashing and fixed hash slots is a real design trade-off you might discuss in an interview.
          </p>
        </section>

        <section className="content-section">
          <h2 id="when-to-use-consistent-hashing-in-an-interview">When to use Consistent Hashing in an Interview</h2>
          <p>
            Most modern distributed systems handle sharding and data distribution for you. When designing a system using DynamoDB, Cassandra, etc you typically just need to mention that these systems use consistent hashing (or a form of it) under the hood to handle scaling.
          </p>
          <p>
            However, consistent hashing becomes a crucial topic in <strong>infrastructure-focused interviews</strong> where you're asked to design distributed systems from scratch. Here are the common scenarios:
          </p>
          <ul>
            <li>Design a distributed database</li>
            <li>Design a distributed cache</li>
            <li>Design a distributed message broker</li>
          </ul>
          <p>
            In these deep infrastructure interviews, you should be prepared to explain several key concepts:
          </p>
          <ul>
            <li>Why consistent hashing beats simple modulo-based sharding for data distribution</li>
            <li>How virtual nodes improve load balancing across the cluster</li>
            <li>Strategies for handling node failures and additions</li>
            <li>How hot spots arise and techniques to mitigate them (replication, key salting)</li>
            <li>The relationship between consistent hashing and replication for fault tolerance</li>
          </ul>
          <p>
            The key is recognizing when to go deep versus when to simply acknowledge that existing solutions handle this complexity for you. Most system design interviews fall into the latter category!
          </p>
        </section>

        <section className="content-section">
          <h2 id="conclusion">Conclusion</h2>
          <p>
            Consistent hashing is one of those algorithms that revolutionized distributed systems by solving a seemingly simple problem: how to distribute data across servers while minimizing redistribution when the number of servers changes.
          </p>
          <p>
            While the implementation details can get complex, the core concept is beautifully simple - arrange everything in a circle and walk clockwise. This elegant solution is now built into many of the distributed systems we use daily, from DynamoDB to Cassandra.
          </p>
          <p>
            One thing to keep in mind: the term "consistent hashing" gets used loosely in practice. As Martin Kleppmann points out in Designing Data-Intensive Applications, some systems that claim to use consistent hashing actually use variations like hash-based partitioning with fixed slot ranges. The core principle of minimizing data movement during rebalancing is what matters, even if the exact implementation differs from the textbook ring approach.
          </p>
          <p>
            In your next system design interview, remember: you usually don't need to implement consistent hashing yourself. Just know when it's being used under the hood, and save the deep dive for those infrastructure-heavy questions where it really matters.
          </p>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#sharding" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Sharding</div>
            </div>
          </a>
          <a href="#cap-theorem" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">CAP Theorem</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
