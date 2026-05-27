import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function Redis() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Redis</span>
          </div>
          <h1>Redis</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn how you can leverage Redis's in-memory speed and versatile data structures to solve complex distributed systems challenges in design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              14 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              In-Memory Stores
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Introduction
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step.</p>
          </Callout>

          <p>
            System designs can involve a dizzying array of different technologies, concepts, and patterns, but one technology stands above the rest in terms of its versatility: <strong>Redis</strong>. 
          </p>
          <p>
            This versatility is important in an interview setting because it allows you to go deep. Instead of learning about dozens of different technologies, you can learn a few useful ones and learn them deeply, which magnifies the chances that you're able to get to the level your interviewer is expecting.
          </p>
          <p>
            Beyond versatility, Redis is great for its simplicity. Redis has a ton of features which resemble data structures you're probably used to from coding (hashes, sets, sorted sets, streams, etc.) and which, given a few basics, are easy to reason about how they behave in a distributed system. While many databases involve a lot of magic (optimizers, query planners, etc.), with only minor exceptions Redis has remained quite simple and good at what it does best: executing simple operations fast.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Redis Basics
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="redis-basics">Redis Basics</h2>
          <p>
            Redis is a self-described <strong>"data structure store"</strong> written in C. It is <strong>in-memory</strong> and <strong>single-threaded</strong>, making it extremely fast (sub-millisecond operations) and trivial to reason about since there are no race conditions or lock contentions inside the execution engine.
          </p>
          
          <Callout type="warning" title="Durability & Persistence Limits">
            <p style={{ margin: 0 }}>
              One important reason you might not want to use Redis is because you need absolute durability. While there are reasonable strategies (like Redis' Append-Only File AOF or RDB snapshots) to minimize data loss, you don't get the same transaction durability guarantees you might get from a relational database. This is an intentional tradeoff made in favor of speed. Alternative implementations like AWS's <strong>MemoryDB</strong> compromise slightly on speed by using a distributed transactional log to guarantee disk durability.
            </p>
          </Callout>

          <p>
            Some of the most fundamental data structures supported by Redis include:
          </p>
          <ul>
            <li><strong>Strings:</strong> The most basic value type (can store binary data, text, or integers up to 512MB).</li>
            <li><strong>Hashes:</strong> Maps between string fields and string values, perfect for representing objects (e.g., a user profile).</li>
            <li><strong>Lists:</strong> Lists of strings sorted by insertion order, useful for basic queues.</li>
            <li><strong>Sets:</strong> Unordered collections of unique strings, supporting set operations like intersections and unions.</li>
            <li><strong>Sorted Sets (ZSET):</strong> Sets where every string member is associated with a score. Members are kept ordered by their score, making them ideal for priority queues and leaderboards.</li>
            <li><strong>Bloom Filters:</strong> Probabilistic data structures that check for set membership. They allow zero false negatives but can return false positives, saving massive amounts of memory.</li>
            <li><strong>Geospatial Indexes:</strong> Stores longitude/latitude coordinates to query nearby points.</li>
            <li><strong>Time Series:</strong> Optimized structures for logging high-volume event streams (metrics, IoT telemetry).</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Redis Logical Key-Value Model</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--bg-accent)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: '140px', fontWeight: 'bold', color: 'var(--primary)' }}>Key (String)</div>
                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>➔</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="inline-code" style={{ color: 'var(--text-main)', background: 'var(--bg-sidebar)' }}>Value Data Structure</span>
                  <span className="inline-code" style={{ color: 'var(--text-main)', background: 'var(--bg-sidebar)' }}>Example representation</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: '140px', fontFamily: 'monospace', fontSize: '0.85rem' }}>"user:101"</div>
                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>➔</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <strong>Hash:</strong> <code>{"{ name: \"John\", age: \"30\", role: \"admin\" }"}</code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: '140px', fontFamily: 'monospace', fontSize: '0.85rem' }}>"online_users"</div>
                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>➔</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <strong>Set (Unique):</strong> <code>{"[ \"user:101\", \"user:202\", \"user:303\" ]"}</code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ minWidth: '140px', fontFamily: 'monospace', fontSize: '0.85rem' }}>"leaderboard:golf"</div>
                <div style={{ flexShrink: 0, color: 'var(--text-muted)' }}>➔</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <strong>Sorted Set (Scores):</strong> <code>{"{ \"player_1\": -4, \"player_2\": -2, \"player_3\": 1 }"}</code>
                </div>
              </div>
            </div>
          </div>

          <h3 id="commands">Redis Commands</h3>
          <p>
            Redis uses a custom wire protocol (RESP) composed of simple human-readable commands. You can connect to Redis via the CLI or telnet and run commands directly:
          </p>
          <CodeBlock language="plaintext">{`SET foo 1       -- Stores string "1" at key foo
GET foo         -- Returns "1"
INCR foo        -- Increments the integer value of foo atomically, returns 2
XADD mystream * name Sara surname OConnor  -- Appends a structured message to a stream`}</CodeBlock>

          <p>
            The command library is highly intuitive and mapped to the underlying data structure:
          </p>
          <ul>
            <li><strong>Sets:</strong> <code>SADD</code> (Add member), <code>SCARD</code> (Get member count), <code>SMEMBERS</code> (List all members), <code>SISMEMBER</code> (Check if member exists).</li>
            <li><strong>Sorted Sets:</strong> <code>ZADD</code> (Add member with score), <code>ZREMRANGEBYRANK</code> (Remove members in rank range), <code>ZREVRANGE</code> (Get members ordered descending).</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Infrastructure Configurations
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="infrastructure-configurations">Infrastructure Configurations</h2>
          <p>
            In your interview, you can configure Redis deployment topologies depending on scaling and availability requirements. There are three primary configurations:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '24px 0' }}>
            <div className="method-card" style={{ flexDirection: 'column', padding: '20px', gap: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-code status-code--4xx" style={{ background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>SINGLE</span>
                Single Node
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Runs as a single instance. Fastest configuration because there is zero replication overhead. However, it lacks high availability—if the node goes down, the cache is completely offline and data is lost.
              </p>
            </div>

            <div className="method-card" style={{ flexDirection: 'column', padding: '20px', gap: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-code status-code--2xx" style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>REPLICA</span>
                HA Primary/Replica
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Consists of a Primary node that processes all writes, which are asynchronously copied to one or more Replica nodes. Replicas serve read-only queries, scaling read throughput and providing failover capacity.
              </p>
            </div>

            <div className="method-card" style={{ flexDirection: 'column', padding: '20px', gap: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-code status-code--3xx" style={{ background: '#dbeafe', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>CLUSTER</span>
                Redis Cluster
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Distributes data across multiple master nodes using sharding. Data is partitioned into <strong>16,384 Hash Slots</strong>. Nodes coordinate using a gossip protocol to manage cluster health and rebalancing.
              </p>
            </div>
          </div>

          <div className="diagram-container">
            <div className="diagram-title">Redis Cluster Architecture (Hash Slots & Client Mapping)</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                
                {/* Client with Slot Cache */}
                <div className="diagram-box" style={{ background: 'var(--bg-accent)', border: '1px solid var(--border-color)', color: 'var(--text-main)', maxWidth: '280px', padding: '16px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>App Server (Client)</div>
                  <div style={{ fontSize: '0.75rem', background: 'white', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', textAlign: 'left', fontFamily: 'monospace' }}>
                    <strong>Local Hash Slot Cache:</strong><br />
                    • Slots 0 - 5460 ➔ Node A<br />
                    • Slots 5461 - 10922 ➔ Node B<br />
                    • Slots 10923 - 16383 ➔ Node C
                  </div>
                </div>

                {/* Hashing Mechanism */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', border: '1px solid rgba(41,154,141,0.2)' }}>
                    CRC16(key) % 16384
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', margin: '4px 0' }}>➔</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Resolves Slot ID</div>
                </div>
              </div>

              {/* Shard Nodes */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '200px' }}>
                  <strong>Node A (Master)</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Slots 0 - 5460</div>
                </div>
                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '200px' }}>
                  <strong>Node B (Master)</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Slots 5461 - 10922</div>
                </div>
                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '200px' }}>
                  <strong>Node C (Master)</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Slots 10923 - 16383</div>
                </div>
              </div>
            </div>
          </div>

          <p>
            When a client wants to read or write a key, it hashes the key using <code>CRC16(key) % 16384</code> to get the Hash Slot, and looks up the node mapping in its local cache. If the cluster topology has changed (due to failover or slot migration), the server will respond with a <code>MOVED</code> or <code>ASK</code> redirection error, prompting the client to update its slot map (e.g., using <code>CLUSTER SHARDS</code>).
          </p>
          <p>
            <strong>Note:</strong> Redis expects all keys involved in a single multi-key transaction (or operation) to live on the <em>same node</em>. If keys map to different nodes, the command will error. To bypass this, you can use <strong>hashtags</strong> (e.g., <code>{"{user:101}:profile"}</code> and <code>{"{user:101}:settings"}</code>) to force Redis to hash only the text inside the curly brackets, guaranteeing they map to the same slot and physical node.
          </p>

          <h3 id="performance">Performance</h3>
          <p>
            Because it resides fully in memory, Redis is blistering fast. It can handle **100,000+ writes per second** per node, with read latency dropping into the sub-millisecond or even microsecond range. 
          </p>
          <p>
            This performance changes what patterns are feasible in system design. In SQL databases, issuing 100 sequential queries in a single request is a major performance bottleneck due to disk lookups and query planners. In Redis, the overhead is so low that multi-round-trip operations are feasible, though pipelining is still preferred to batch requests and minimize network round trips.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Capabilities
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="capabilities">Capabilities</h2>
          <p>
            Its unique combination of raw speed and structured data types makes Redis versatile for many system design features:
          </p>

          {/* Sub-cap: Cache */}
          <h3 id="redis-as-cache">1. Redis as a Cache</h3>
          <p>
            This is the most common deployment scenario. Cache keys map to JSON string blobs or Redis Hashes.
          </p>
          <p>
            By attaching a <strong>Time-to-Live (TTL)</strong> to keys, Redis guarantees that expired keys are evicted automatically (using passive and active cleanup loops). Combined with an eviction policy like **LRU** (Least Recently Used), Redis keeps memory usage bounded even when cache sizes grow.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Write-Through vs Cache-Aside Read flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Cache hit */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 'bold', width: '90px', fontSize: '0.85rem' }}>Cache Hit:</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-accent)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                  <span>Client Request</span>
                  <span style={{ color: 'var(--primary)' }}>➔</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Read Cache (Redis - 1ms)</span>
                  <span style={{ color: 'var(--primary)' }}>➔</span>
                  <span>Return Data</span>
                </div>
              </div>
              {/* Row 2: Cache miss */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 'bold', width: '90px', fontSize: '0.85rem' }}>Cache Miss:</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--bg-accent)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', flexWrap: 'wrap' }}>
                  <span>Client Request</span>
                  <span style={{ color: 'var(--accent)' }}>➔</span>
                  <span style={{ color: 'var(--accent)' }}>Cache Miss</span>
                  <span style={{ color: 'var(--accent)' }}>➔</span>
                  <span style={{ fontWeight: 600 }}>Read DB (PostgreSQL - 50ms)</span>
                  <span style={{ color: 'var(--primary)' }}>➔</span>
                  <span style={{ color: 'var(--primary)' }}>Write Cache (Redis)</span>
                  <span style={{ color: 'var(--primary)' }}>➔</span>
                  <span>Return Data</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-cap: Lock */}
          <h3 id="redis-distributed-lock">2. Redis as a Distributed Lock</h3>
          <p>
            When multiple application instances must access a shared resource without race conditions, Redis can act as a lightweight distributed lock manager.
          </p>
          <p>
            A simple implementation uses <code>SET key value NX PX timeout</code> (NX = Set only if key does not exist; PX = Expire key in milliseconds). 
          </p>
          <ul>
            <li><strong>Acquire:</strong> <code>SET lock:ticketmaster_100 my_uuid NX PX 5000</code>. If it returns OK, you own the lock. Otherwise, you must wait and retry.</li>
            <li><strong>Release:</strong> Run a Lua script to check if the value matches your UUID before deleting. This prevents a worker from accidentally deleting a lock owned by another client if its task took longer than the TTL.</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Distributed Locking with Lock Reclamation Protection</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--primary)' }}>Client A (Acquire Lock)</strong>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontFamily: 'monospace' }}>SET lock:res_1 "UUID_A" NX PX 5000</div>
                  <div style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '4px' }}>✔ Acquired (Lock key exists with UUID_A)</div>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>➔</div>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <strong style={{ color: 'var(--accent)' }}>Client B (Tries Acquire)</strong>
                  <div style={{ fontSize: '0.75rem', marginTop: '4px', fontFamily: 'monospace' }}>SET lock:res_1 "UUID_B" NX PX 5000</div>
                  <div style={{ color: 'var(--error)', fontSize: '0.75rem', fontWeight: 'bold', marginTop: '4px' }}>✖ Denied (Key already exists)</div>
                </div>
              </div>
              
              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #f59e0b', fontSize: '0.8rem' }}>
                <strong>Lua Safety Check on Release:</strong><br />
                <code>if redis.call("get",KEYS[1]) == ARGV[1] then return redis.call("del",KEYS[1]) else return 0 end</code>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Guarantees that Client A only deletes <code>lock:res_1</code> if the value matches "UUID_A". This protects against releasing a lock that has expired and been acquired by Client B.
                </div>
              </div>
            </div>
          </div>

          <p>
            For enterprise-grade locking across multiple master nodes, Redis documentation proposes the **Redlock** algorithm, though using it requires careful evaluation of clock drifts.
          </p>

          {/* Sub-cap: Leaderboards */}
          <h3 id="leaderboards">3. Redis for Leaderboards</h3>
          <p>
            Redis Sorted Sets (<code>ZSET</code>) maintain members sorted by double-precision floating-point scores. Insertion, deletion, and updates run in <code>O(log(N))</code> time (implemented internally using a skip list and hash table).
          </p>
          <CodeBlock language="plaintext">{`ZADD tiger_posts 500 "post:1"    -- Sets score of post:1 to 500
ZADD tiger_posts 120 "post:2"    -- Sets score of post:2 to 120
ZREVRANGE tiger_posts 0 9 WITHSCORES  -- Returns top 10 posts by score (highest first)
ZREMRANGEBYRANK tiger_posts 0 -11     -- Retains only the top 10, cleaning up memory`}</CodeBlock>

          {/* Sub-cap: Rate Limiting */}
          <h3 id="rate-limiting">4. Redis for Rate Limiting</h3>
          <p>
            Redis is highly suited for rate limiting. In a **Fixed Window** algorithm, a key represents the user's window (e.g., <code>rate:user_123:minute_45</code>). 
          </p>
          <p>
            Every request calls <code>INCR</code>. If the returned count exceeds the threshold (e.g., 100), the request is rejected with HTTP 429. The key has a TTL (e.g., 60s) to clear the window automatically.
          </p>
          <p>
            For a **Sliding Window** rate limiter, we can store request timestamps in a Sorted Set (ZSET) for each user. We remove timestamps older than the sliding window boundary (using <code>ZREMRANGEBYSCORE</code>) and check the set's size (using <code>ZCARD</code>) to decide if we should allow the request. All of this can be run atomically inside a **Lua script** to prevent concurrency errors.
          </p>

          {/* Sub-cap: Proximity Search */}
          <h3 id="proximity-search">5. Redis for Proximity Search</h3>
          <p>
            Redis supports Geospatial indexing using **Geohashes** stored inside sorted sets. Coordinates are encoded into a single integer representation where nearby points share similar string/binary prefixes.
          </p>
          <CodeBlock language="plaintext">{`GEOADD delivery_zones 12.97 77.59 "driver_A"   -- Add driver coordinates
GEOSEARCH delivery_zones FROMLONLAT 12.97 77.59 BYRADIUS 5 km ASC  -- Find drivers in 5km`}</CodeBlock>
          <p>
            The <code>GEOSEARCH</code> command retrieves candidates using geohashes (which match a square grid bounding box) and performs an exact distance radius validation step to filter out false positives.
          </p>

          {/* Sub-cap: Event Sourcing */}
          <h3 id="event-sourcing">6. Redis for Event Sourcing (Streams)</h3>
          <p>
            Redis Streams (introduced in Redis 5.0) act as append-only logs. Consumer groups allow multiple workers to consume distinct message flows from a stream, similar to Kafka consumer groups.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Redis Streams & Consumer Groups Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              
              {/* Stream Log */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>Stream Log:</div>
                <div style={{ border: '2px solid var(--border-color)', borderRadius: '8px', padding: '6px', background: 'var(--bg-sidebar)', display: 'flex', gap: '6px' }}>
                  <div style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>job:1 (ACK)</div>
                  <div style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace' }}>job:2 (Pending)</div>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>job:3</div>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 'bold' }}>job:4</div>
                </div>
              </div>

              {/* Delivery and Consumption */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', width: '100%' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--primary)' }}>Consumer Group A</div>
                  <div style={{ color: 'var(--text-muted)', margin: '8px 0', fontSize: '0.75rem' }}>Delivers unacknowledged items</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ background: 'white', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                      <strong>Worker A:</strong> Processing <code>job:2</code>
                    </div>
                    <div style={{ background: 'white', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem' }}>
                      <strong>Worker B:</strong> Idle (Waiting)
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fff5f5', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)' }}>Failure recovery</div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '6px 0 12px 0', lineHeight: '1.4' }}>
                    If Worker A crashes, <code>job:2</code> stays in the Pending Entries List (PEL).
                  </p>
                  <div style={{ background: 'white', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                    XCLAIM mystream group_a Worker_B 10000 2-0
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent)', marginTop: '4px', fontWeight: 'bold' }}>
                    ➔ Worker B claims job:2 after 10s timeout
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p>
            When a message is consumed, it is added to a **Pending Entries List (PEL)**. Once processed, the consumer sends an acknowledgment command (<code>XACK</code>). If a consumer dies, another worker can inspect the PEL and claim ownership of the message using <code>XCLAIM</code> to ensure **at-least-once processing**.
          </p>

          {/* Sub-cap: Pub/Sub */}
          <h3 id="pub-sub">7. Redis for Pub/Sub</h3>
          <p>
            Redis supports sharded Pub/Sub, facilitating real-time message broadcasting.
          </p>
          <CodeBlock language="plaintext">{`SSUBSCRIBE chat_room:100            -- Subscriber listens on sharded channel
SPUBLISH chat_room:100 "Hello!"     -- Publisher broadcasts message`}</CodeBlock>

          <div className="diagram-container">
            <div className="diagram-title">Redis Sharded Pub/Sub Architecture</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                
                {/* Publisher */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--client">Publisher</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', marginTop: '4px' }}>SPUBLISH room_A "msg"</div>
                </div>
                
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>

                {/* Sharded Node */}
                <div className="diagram-box diagram-box--connection" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', minWidth: '180px' }}>
                  <strong>Redis Slot Node</strong>
                  <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>Handles slot for "room_A"</div>
                </div>

                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>

                {/* Subscribers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)' }}>●</span> Client 1 (Active Connection)
                  </div>
                  <div style={{ background: '#f8fafc', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)' }}>●</span> Client 2 (Active Connection)
                  </div>
                </div>
              </div>

              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '12px', borderRadius: '8px', width: '100%', fontSize: '0.8rem', color: '#991b1b' }}>
                <strong>No persistence warning:</strong> Redis Pub/Sub has an "at-most-once" delivery policy. If a client disconnects briefly, it misses all broadcasted messages. If you require offline catching, use **Redis Streams** instead.
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Shortcomings & Remediations
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="shortcomings-remediations">Shortcomings &amp; Remediations</h2>
          <p>
            Redis clusters have simple partitioning rules. They do not automatically distribute load if traffic is heavily focused on a small subset of keys.
          </p>

          <h3 id="hot-key-issues">Hot Key Issues</h3>
          <p>
            A <strong>Hot Key</strong> occurs when a single key receives a massive portion of request traffic. Because that key maps to a single Hash Slot on a single Redis node, that node's CPU capacity can be quickly exhausted, while the other 99% of nodes in the cluster remain idle.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">The Hot Key Bottleneck</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <strong style={{ color: 'var(--accent)' }}>The Problem:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Millions of concurrent client requests are hitting the exact same cache key: <code>product:taylorswift_tickets</code>. Since this key is mapped to Node A, only Node A faces 100% CPU exhaustion while other nodes stand idle.
                </p>
              </div>
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: 'var(--success)' }}>The Remediations:</strong>
                <ul style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '8px 0 0 0', paddingLeft: '16px', lineHeight: '1.4' }}>
                  <li><strong>Client-Side Cache:</strong> Cache the hot value in-process inside application servers for 5–10 seconds.</li>
                  <li><strong>Key Salting/Replication:</strong> Write duplicate keys with random suffixes: <code>product:taylorswift_tickets_1</code> to <code>_N</code>, and have clients request a random suffix.</li>
                  <li><strong>Read Replicas:</strong> Deploy replica instances to scale read queries.</li>
                </ul>
              </div>
            </div>
          </div>

          <p>
            For a system design interview, recognizing hot key vulnerabilities and proactively detailing these remediations demonstrates solid real-world engineering experience.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Summary
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="conclusion">Summary</h2>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Versatile & Simple:</strong> Redis is single-threaded, fully in-memory, and provides powerful data structures like Hashes, Sets, Sorted Sets, and Streams.</li>
              <li><strong>Topology Choices:</strong> Deploy as a single instance for simplicity, a primary-replica cluster for high availability, or a Redis Cluster with 16,384 hash slots for large horizontal scale.</li>
              <li><strong>Multiple Use Cases:</strong> Use it as a database cache (LRU + TTL), a distributed lock manager (atomic commands + Lua scripts), a rate limiter, a geospatially indexed store, or an append-only message stream.</li>
              <li><strong>Watch for Hot Keys:</strong> Recognize that highly popular keys route to a single node. Protect against overload using client caches or key duplication.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#numbers-to-know" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Numbers to Know</div>
            </div>
          </a>
          <a href="#elasticsearch" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Elasticsearch</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
