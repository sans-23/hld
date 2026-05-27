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
            <span className="breadcrumb-current">Flink</span>
          </div>
          <h1>Flink</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master stateful stream processing with Apache Flink. Learn about bounded vs. unbounded streams, event-time watermarks, sliding/tumbling windows, TaskManager architecture, and Chandy-Lamport checkpointing for system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              14 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Stream Processing
            </span>
            <span className="difficulty-badge difficulty-badge--advanced">Advanced</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Basic Concepts
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step.</p>
          </Callout>

          <p>
            In system design, we often need to process infinite, continuous flows of data—such as clickstreams, sensor logs, or ride-share location coordinates. Traditional batch processing systems (like MapReduce or Spark Batch) partition this data into fixed-size daily or hourly blocks. This introduces significant processing delay. 
          </p>
          <p>
            <strong>Apache Flink</strong> is a purpose-built distributed stream processing engine designed for stateful computations over **unbounded data streams** with sub-second processing latencies.
          </p>

          <h2 id="basic-concepts">Basic Stream Processing Concepts</h2>
          <p>
            To understand Flink, let's explore its core abstractions:
          </p>

          <h3 id="sources-sinks">Sources and Sinks</h3>
          <ul>
            <li><strong>Source:</strong> The entry point of data into Flink (e.g., pulling event logs from Kafka partitions or reading files).</li>
            <li><strong>Operator:</strong> Computes transformations (like <code>filter</code>, <code>map</code>, or state aggregations) on events in real time.</li>
            <li><strong>Sink:</strong> The exit point where processed streams are written (e.g., appending aggregates to a PostgreSQL table or indexing documents in Elasticsearch).</li>
          </ul>

          <h3 id="streams">Bounded vs. Unbounded Streams</h3>
          <ul>
            <li><strong>Unbounded Streams:</strong> Infinite data flows. They have a start but no end. Flink processes events item-by-item instantly, maintaining internal state across events.</li>
            <li><strong>Bounded Streams:</strong> Finite data sets (like a static directory of logs). Flink processes these similarly to batch execution engines.</li>
          </ul>

          <h3 id="state">Stateful Stream Processing</h3>
          <p>
            While stateless processing is simple (e.g., mapping a JSON schema), **stateful processing** requires the engine to remember past events (e.g., calculating a user's average transactions over the last hour). Flink maintains local, high-performance in-memory state on cluster nodes, synchronizing snapshots to persistent storage in the background.
          </p>

          <h3 id="watermarks">Event Time vs. Processing Time &amp; Watermarks</h3>
          <p>
            When processing event streams, events can arrive out of order due to network delay. Flink distinguishes between:
          </p>
          <ul>
            <li><strong>Processing Time:</strong> The local system time of the machine executing the operator. Simple but vulnerable to delays.</li>
            <li><strong>Event Time:</strong> The timestamp embedded in the event itself when it occurred (e.g., when a user clicked a button on their phone).</li>
          </ul>
          <p>
            To handle late-arriving data in event-time processing, Flink uses **Watermarks**: control markers injected into the stream that assert: <em>"We are confident no future events will arrive with timestamps older than $t$."</em> Watermarks allow Flink to close time windows and output final aggregates safely.
          </p>

          <h3 id="windows">Windowing Strategies</h3>
          <p>
            Since streams are infinite, we aggregate them by dividing events into **Windows**:
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Flink Windowing Strategies</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Tumbling Window</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Fixed-size, non-overlapping intervals (e.g., 00:00-00:05, 00:05-00:10). Events belong to exactly one window.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>Sliding Window</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Fixed-size but overlapping intervals (e.g., 5-minute window sliding every 1 minute). Events can belong to multiple windows.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Session Window</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Gaps of inactivity. If no events arrive for 15 minutes, the window closes. Excellent for tracking active user sessions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Basic Use
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="basic-use">Basic Use</h2>
          <p>
            Flink programs (Jobs) are written using high-level APIs in Java, Scala, or Python.
          </p>

          <h3 id="defining-a-job">Defining a Streaming Job</h3>
          <p>
            An example Flink streaming job that aggregates clickstream event counts:
          </p>
          <CodeBlock language="java">{`// Set up execution environment
final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

// Create stream from Kafka source
DataStream<ClickEvent> clicks = env.fromSource(kafkaSource, WatermarkStrategy.noWatermarks(), "Kafka Source");

// Aggregate clicks by page within a 5-minute tumbling window
DataStream<PageCount> aggregates = clicks
    .keyBy(ClickEvent::getPage)
    .window(TumblingEventTimeWindows.of(Time.minutes(5)))
    .reduce((val1, val2) -> new PageCount(val1.page, val1.count + val2.count));

// Output results to database sink
aggregates.sinkTo(postgresSink);

// Execute the distributed job
env.execute("Page Click Counter");`}</CodeBlock>

          <h3 id="submitting-a-job">Submitting &amp; Executing Jobs</h3>
          <p>
            Once compiled into a JAR file, you submit the job to the active Flink cluster Manager. The manager compiles the code into a **Dataflow Graph**—a directed acyclic graph (DAG) representing operators and stream pipelines—and distributes execution tasks across cluster workers.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — How Flink Works
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-flink-works">How Flink Works</h2>
          
          <h3 id="cluster-architecture">Cluster Architecture</h3>
          <ul>
            <li><strong>JobManager:</strong> The coordinator. Resolves the dataflow DAG, allocates resource slots, and manages job checkpoints.</li>
            <li><strong>TaskManagers:</strong> The worker nodes. They execute assigned task slots and exchange stream partitions.</li>
          </ul>

          <h3 id="state-management">Distributed State &amp; Chandy-Lamport Checkpointing</h3>
          <p>
            How does Flink guarantee **Exactly-Once** state consistency without blocking data flow? Flink stores active operator state locally in high-performance backends (like RocksDB on SSDs) and periodically takes distributed snapshots using a variant of the **Chandy-Lamport Algorithm**:
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Distributed Chandy-Lamport Checkpoint Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server">Kafka Source</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Injects Barrier [B1]</div>
                </div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box" style={{ background: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0' }}>Map Operator</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Sees [B1] ➔ Snapshots state to S3</div>
                </div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--server">Window Reduce</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>Aligns barriers ➔ Snapshots</div>
                </div>
              </div>
              <div style={{ background: 'var(--bg-accent)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', width: '100%', maxWidth: '600px', textAlign: 'center' }}>
                <strong>State Snapshot Barriers:</strong> Source nodes periodically inject checkpoint barriers into the event flow. As barriers flow downstream through operators, they trigger local state snapshots to durable object stores (S3). This enables consistent rollbacks if a worker crashes, without pausing active stream processing.
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Flink in Interviews
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="in-your-interview">Flink in System Design Interviews</h2>
          
          <h3 id="using-flink">When to Propose Flink</h3>
          <ul>
            <li>Calculating streaming metric aggregations over sliding or tumbling time windows (e.g. Ad Click Aggregators, IoT anomaly detection).</li>
            <li>Enforcing complex event-time aggregations where data can arrive severely delayed or out of order.</li>
            <li>Real-time feature engineering pipelines feeding Machine Learning engines.</li>
            <li>Enforcing Exactly-Once semantics for streaming writes (when paired with transactional sinks).</li>
          </ul>

          <h3 id="lessons-from-flink">When Flink is Overkill</h3>
          <p>
            If your system design requires basic message routing or queueing, Kafka or RabbitMQ alone is sufficient. Introducing Flink adds substantial cluster maintenance overhead. Do not propose Flink unless your design specifically calls for complex windowing and stateful streaming metrics.
          </p>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#postgresql" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">PostgreSQL</div>
            </div>
          </a>
          <a href="#zookeeper" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">ZooKeeper</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
