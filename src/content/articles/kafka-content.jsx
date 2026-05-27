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
            <span className="breadcrumb-current">Kafka</span>
          </div>
          <h1>Kafka</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master Apache Kafka's distributed event streaming engine. Learn partitions, replication models, client mechanics, ordering guarantees, and error handling for high-scale system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Event Streaming
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Motivating Example
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
            Apache Kafka is an open-source distributed event streaming platform used widely as either a **message queue** or a **stream processing system**. Kafka excels at delivering high throughput, horizontal scalability, and durability. When configured correctly (with appropriate replication and acknowledgment settings), it provides strong guarantees against message loss.
          </p>
          <p>
            In this deep dive, we're going to take a top-down approach: starting with a high-level motivating example, moving into Kafka's fundamental architecture, and concluding with advanced scaling and error-handling mechanics for interviews.
          </p>

          <h3 id="a-motivating-example">A Motivating Example</h3>
          <p>
            Imagine it's the World Cup, and we run a website providing real-time stats (goals, yellow cards, substitutions). Each event puts a message on a queue (via a <strong>producer</strong>), and a backend server reads these messages (a <strong>consumer</strong>) to update the UI.
          </p>
          <p>
            Now, let's scale the tournament to 1,000 matches running simultaneously. The write volume is massive, and a single queue server is overwhelmed. If we naively spin up multiple queue servers and distribute events randomly, we lose ordering guarantees. A player could receive a booking for a foul before the match even started, or a goal could be scored before the kickoff event is processed.
          </p>
          <p>
            To solve this, we can partition our queue based on the **Game ID**. This ensures that all events for a specific match end up on the same physical queue, preserving their exact chronological order.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Ordering Guarantees: Random vs. Key-Based Partitioning</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              
              {/* Bad approach */}
              <div style={{ background: '#fff5f5', padding: '16px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                <strong style={{ color: 'var(--accent)' }}>Random Partitioning (No Ordering)</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Queue 1: [Game A: Kickoff] ➔ [Game B: Goal]
                  </div>
                  <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Queue 2: [Game A: Goal] ➔ [Game A: Booking]
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                  If Queue 2 processes faster than Queue 1, the consumer registers the Goal before the Kickoff has occurred, violating chronological order.
                </p>
              </div>

              {/* Good approach */}
              <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <strong style={{ color: 'var(--success)' }}>Keyed Partitioning (Order Preserved)</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Queue 1 (Key: Game_A): [Kickoff] ➔ [Goal] ➔ [Booking]
                  </div>
                  <div style={{ background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Queue 2 (Key: Game_B): [Kickoff] ➔ [Goal]
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                  Because all events for Game A map to Queue 1, they are appended and read in the exact order they occurred.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Basic Terminology & Architecture
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="basic-terminology-and-architecture">Basic Terminology and Architecture</h2>
          <p>
            Let's define the fundamental building blocks of a Kafka cluster:
          </p>
          <ul>
            <li><strong>Broker:</strong> A single Kafka server. A cluster consists of multiple brokers to share storage and network load.</li>
            <li><strong>Topic:</strong> A logical stream of messages (e.g., <code>match-events</code> or <code>user-clicks</code>).</li>
            <li><strong>Partition:</strong> A single physical append-only log file belonging to a topic. Topics are divided into multiple partitions distributed across brokers to enable horizontal scaling.</li>
            <li><strong>Offset:</strong> A sequential integer identifier assigned to each message inside a partition, representing its index.</li>
            <li><strong>Producer:</strong> Client applications that publish events to Kafka topics.</li>
            <li><strong>Consumer:</strong> Client applications that subscribe to and read from topics.</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Kafka Cluster Sharding (Topic & Partition Layout)</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                
                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '220px' }}>
                  <strong>Broker 1</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Topic A: Partition 0
                  </div>
                </div>

                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '220px' }}>
                  <strong>Broker 2</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Topic A: Partition 1
                  </div>
                </div>

                <div className="diagram-box diagram-box--server" style={{ flex: 1, minWidth: '160px', maxWidth: '220px' }}>
                  <strong>Broker 3</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', background: 'white', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                    Topic A: Partition 2
                  </div>
                </div>

              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
                A single Topic (Topic A) is scaled horizontally by splitting it into 3 physical partitions distributed across 3 distinct brokers.
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — How Kafka Works
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-kafka-works">How Kafka Works</h2>
          <p>
            Producers publish messages (records) consisting of a <strong>value</strong> (the payload), a **key** (used for partitioning), a **timestamp**, and optional **headers** (metadata).
          </p>

          <h3 id="partition-determination">Partition Routing Mechanics</h3>
          <p>
            When a producer publishes a message, routing involves a two-step process:
          </p>
          <ol>
            <li><strong>Partition Selection:</strong> The producer hashes the message key (using Murmur2) and takes the modulo of the partition count: <code>partition = Hash(key) % num_partitions</code>. This guarantees that messages with the identical key are routed to the exact same partition. If no key is provided, the client uses a sticky partitioning strategy to batch messages efficiently to one partition before rotating.</li>
            <li><strong>Broker Lookup:</strong> The producer consults its local cluster metadata (managed by the active Kafka Controller broker) to identify which broker hosts the leader replica for that partition, and writes directly to it over TCP.</li>
          </ol>

          <CodeBlock language="javascript">{`// Example using kafkajs client
const run = async () => {
  await producer.connect();
  await producer.send({
    topic: 'match-events',
    messages: [
      { key: 'game_A', value: 'Kickoff!' },
      { key: 'game_A', value: 'Goal scored by player 10' }
    ]
  });
}`}</CodeBlock>

          <h3 id="append-only-log">The Append-Only Commit Log</h3>
          <p>
            Kafka partitions are physically structured as append-only log segments. This immutability guarantees several performance benefits:
          </p>
          <ul>
            <li><strong>Zero Disk Seeks:</strong> Writing is a sequential append operation. This maximizes disk throughput, bypassing the high seek latency associated with random disk operations.</li>
            <li><strong>Efficient Caching:</strong> The OS page cache caches the end of the log segments. Reads and writes hit memory directly in most active scenarios.</li>
          </ul>

          <h3 id="replication-model">Leader-Follower Replication</h3>
          <p>
            To guarantee durability, partitions are duplicated across brokers using a replication factor (typically 3):
          </p>
          
          <div className="diagram-container">
            <div className="diagram-title">Leader-Follower Replication and ISR Model</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                
                {/* Producer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div className="diagram-box diagram-box--client">Producer</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>acks=all</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>➔</div>

                {/* Leader */}
                <div className="diagram-box diagram-box--server" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', minWidth: '150px' }}>
                  <strong>Leader Replica</strong><br />
                  <small>Broker 1</small>
                  <div style={{ fontSize: '0.7rem', marginTop: '6px', background: 'white', padding: '2px', borderRadius: '4px' }}>Write appended</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                  <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>➔ sync</div>
                  <div style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>➔ sync</div>
                </div>

                {/* Followers */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="diagram-box diagram-box--server" style={{ padding: '4px 12px', minWidth: '150px' }}>
                    Follower 1 (Broker 2)
                  </div>
                  <div className="diagram-box diagram-box--server" style={{ padding: '4px 12px', minWidth: '150px' }}>
                    Follower 2 (Broker 3)
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-accent)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', width: '100%', maxWidth: '640px' }}>
                <strong>In-Sync Replicas (ISR):</strong> Followers passively poll the leader to clone logs. The leader tracks which followers are keeping up. If <code>acks=all</code> is set, the producer's write is only acknowledged after all nodes in the ISR write it to disk. If the leader broker dies, the cluster Controller promotes an ISR follower to leader.
              </div>
            </div>
          </div>

          <h3 id="pull-consumers">Pull-Based Consumption</h3>
          <p>
            Consumers pull messages from Kafka brokers by polling at controlled intervals. This is a deliberate design choice that simplifies consumer clients:
          </p>
          <ul>
            <li><strong>Rate Control:</strong> Slow consumers are not overwhelmed. They request batches of messages only when they have processing capacity.</li>
            <li><strong>Optimal Batching:</strong> Brokers can aggregate messages and send large chunks over the wire, optimizing network bandwidth.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — When to Use Kafka
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="when-to-use-kafka-in-your-interview">When to use Kafka in your interview</h2>
          <p>
            You can utilize Kafka as a standard message queue or a real-time stream.
          </p>

          <h3 id="message-queue-use">Message Queue Mode</h3>
          <p>
            Used to distribute tasks asynchronously among worker pools:
          </p>
          <ul>
            <li><strong>Asynchronous Tasks:</strong> Offloading expensive post-upload processing (e.g., transcoding a YouTube video).</li>
            <li><strong>Decoupling Services:</strong> Allowing peak traffic to write to the queue while consumers process at a constant rate, protecting database writes.</li>
            <li><strong>Strict Ordering:</strong> Enforcing FIFO sequencing (e.g., Ticketmaster virtual queues waiting to buy tickets).</li>
          </ul>

          <h3 id="event-stream-use">Real-Time Event Streams</h3>
          <p>
            Used when data is treated as a continuous flow rather than individual tasks:
          </p>
          <ul>
            <li><strong>Real-time Analytics:</strong> Aggregating click rates or sensor data feeds (e.g., Ad Click Aggregator).</li>
            <li><strong>Multiple Consumers (Fan-out):</strong> Allowing different consumer groups to read the same stream independently (e.g., one group computes live metrics, another logs event histories).</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Scaling and Interview Knowledge
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="what-you-should-know-about-kafka-for-system-design-interviews">What you should know about Kafka for System Design Interviews</h2>
          <p>
            To impress in senior and staff-level interviews, you must know how to scale Kafka topics and recover from failures.
          </p>

          <h3 id="scalability">Scalability Constraints</h3>
          <Callout type="warning" title="Anti-Pattern: Large Payloads in Kafka">
            <p style={{ margin: 0 }}>
              Kafka is optimized for small messages (typically under 1MB). Storing large blobs (like raw video files) exhausts broker memory and clogs network links. Instead, store large files in an object store (S3) and write a Kafka message containing a metadata pointer to the S3 URL.
            </p>
          </Callout>
          
          <p>
            To scale write throughput, partition your topics. However, a partition maps to exactly one consumer within a consumer group. If you have 10 partitions, adding an 11th consumer results in that consumer sitting completely idle.
          </p>

          <h3 id="hot-partitions">Mitigating Hot Partitions</h3>
          <p>
            If your partition key choice concentrates write traffic (e.g., partitioning ad clicks by Ad ID, and a super bowl ad is running), you will hit a **Hot Partition**. You can resolve this using several strategies:
          </p>
          <ul>
            <li><strong>Compound Keys:</strong> Combine attributes to distribute hashes (e.g., <code>Ad_ID + Region</code>).</li>
            <li><strong>Random Salting:</strong> Append a random suffix (e.g., <code>Ad_ID_1</code> through <code>Ad_ID_N</code>) to distribute records across $N$ partitions. Downstream consumers must merge these partitions to aggregate totals.</li>
            <li><strong>Sticky Routing (No Key):</strong> Drop ordering guarantees and let the producer round-robin writes evenly.</li>
          </ul>

          <h3 id="handling-retries-and-errors">Handling Retries and Errors</h3>
          <p>
            Client errors on the producer or consumer side must be handled gracefully:
          </p>
          
          <h4 id="producer-retries">Producer Retries &amp; Idempotency</h4>
          <p>
            Network dropouts can make a producer retry writing a message, potentially causing duplicates if the broker had written the original message but failed to respond. To prevent this, set <code>idempotent=true</code>. The broker tracks producer IDs and sequence numbers to deduplicate retries automatically.
          </p>

          <h4 id="consumer-retries">Consumer Retries &amp; DLQs</h4>
          <p>
            Unlike SQS, Kafka has no built-in message retry visibility timers. If a consumer fails to process a message, it cannot pause the partition because offsets are sequential. Moving to the next offset before solving the error is a silent failure.
          </p>
          <p>
            To resolve this, write failed messages to a **Retry Topic** and commit the offset in the main partition. A separate consumer processes the Retry Topic. If processing fails repeatedly, route the message to a **Dead Letter Queue (DLQ)** for inspection.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Kafka Consumer Retry & DLQ Architecture</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                
                {/* Main Topic */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server" style={{ minWidth: '140px' }}>Main Topic</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Offset committed</div>
                </div>

                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>

                {/* Main Consumer */}
                <div className="diagram-box" style={{ background: '#fee2e2', color: '#991b1b', borderColor: '#fca5a5', minWidth: '140px' }}>
                  <strong>Main Consumer</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Fails processing</div>
                </div>

                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>

                {/* Retry Topic */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--connection" style={{ background: '#fffbeb', color: '#b45309', borderColor: '#fde68a', minWidth: '140px' }}>
                    Retry Topic
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Backoff consumer</div>
                </div>

                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>

                {/* DLQ */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server" style={{ background: '#f8fafc', color: 'var(--text-muted)', minWidth: '140px' }}>
                    DLQ (Dead Letter)
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Alerts & audit</div>
                </div>

              </div>
            </div>
          </div>

          <h3 id="performance-optimizations">Performance Optimizations</h3>
          <p>
            To scale throughput and minimize network bottlenecks:
          </p>
          <ul>
            <li><strong>Batching:</strong> Use batch writes (<code>sendBatch()</code>) to aggregate messages in producer buffers before dispatching them over TCP.</li>
            <li><strong>Compression:</strong> Enable client-side compression (Snappy, GZIP, or LZ4). Snappy provides a great balance of low CPU usage and high compression ratios.</li>
          </ul>

          <h3 id="retention-policies">Retention Policies</h3>
          <p>
            Kafka partitions are bounded by retention limits. You configure cleanup policies:
          </p>
          <ul>
            <li><strong>Delete Policy:</strong> Discards segments older than a specific time (<code>retention.ms</code>, default 7 days) or when size limits are reached (<code>retention.bytes</code>).</li>
            <li><strong>Compact Policy:</strong> Retains the latest value for each key. During cleanups, Kafka discards older records with duplicate keys, which is ideal for streaming database state updates.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Summary
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="summary">Summary</h2>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Distributed Log:</strong> Kafka partitions are append-only, immutable logs that minimize disk seeks and optimize horizontal scale.</li>
              <li><strong>Order Guarantee:</strong> Message keys determine partition routing. Messages with the same key are ordered sequentially inside their assigned partition.</li>
              <li><strong>Durability via ISR:</strong> Partitions are copied across brokers. Setting <code>acks=all</code> ensures that writes are fully synced across the In-Sync Replicas list before receiving confirmation.</li>
              <li><strong>Consumer Pull:</strong> Consumers pull batches of messages at their own rate. Consumer groups partition assignments prevent dual-consumption.</li>
              <li><strong>Error Recovery:</strong> Offset commits provide crash safety. Concurrency errors are mitigated using idempotent producers, and consumer processing failures are handled using Retry Topics and DLQs.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#elasticsearch" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Elasticsearch</div>
            </div>
          </a>
          <a href="#api-gateway" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">API Gateway</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
