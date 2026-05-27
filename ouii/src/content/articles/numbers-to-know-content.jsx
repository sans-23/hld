import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function OldContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Core Concepts</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Numbers to Know</span>
          </div>
          <h1>Numbers to Know</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about the numbers you need to know for system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              10 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              System Design Basics
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Introduction
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
            Our industry moves fast. The hardware we build systems on evolves constantly, which means even recent textbooks can become outdated quickly. A book published just a few years ago might be teaching patterns that still make sense, but quoting numbers that are off by orders of magnitude.
          </p>
          <p>
            One of the biggest giveaways that a candidate has book knowledge but no hands-on experience during a system design interview is when they rely on outdated hardware constraints. They do scale calculations using numbers from 2015 (or even 2020!) that dramatically underestimate what modern systems can handle. You'll hear concerns about database sizes, memory limits, and storage costs that made sense then, but would lead to significantly over-engineered systems today.
          </p>
          <p>
            This isn't the candidate's fault – they're doing the right thing by studying. But understanding modern hardware capabilities is crucial for making good system design decisions. When to shard a database, whether to cache aggressively, how to handle large objects – these choices all depend on having an accurate sense of what today's hardware can handle.
          </p>
          <p>Let's look at the numbers that actually matter in 2026.</p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Modern Hardware Limits
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="hardware-limits">Modern Hardware Limits</h2>
          <p>
            Modern servers pack serious computing power. An AWS <code>m6i.32xlarge</code> comes with 512 GiB of memory and 128 vCPUs for general workloads. Memory-optimized instances go further: the <code>x1e.32xlarge</code> provides 4 TB of RAM, while the <code>u-24tb1.metal</code> reaches 24 TB of RAM. This shift matters because many applications that once required distributed systems can now run on a single machine.
          </p>
          <p>
            Storage capacity has seen similar growth. Modern instances like AWS's <code>i3en.24xlarge</code> provide 60 TB of local SSD (solid-state drive) storage. If you need more, the <code>d3en.12xlarge</code> offers 336 TB of HDD (hard disk drive) storage for data-heavy workloads. Object storage like S3 is effectively unlimited, handling petabyte-scale deployments as a standard practice. The days of storage being a primary constraint are largely behind us.
          </p>
          <p>
            Network capabilities haven't stagnated either. Within a datacenter, 25 Gbps is common for standard instances, with high-performance instances supporting 50-100 Gbps or more. Bandwidth across availability zones (AZs) within a region is limited only by instance network capacity. Latency remains predictable: sub-1ms within a single AZ, 1-2ms across AZs in the same region, and 50-150ms cross-region. This consistent performance allows for reliable distributed system design.
          </p>
          <p>
            These aren't just incremental improvements – they represent a step change in what's possible. When textbooks talk about splitting databases at 100GB or avoiding large objects in memory, they're working from outdated constraints. The hardware running our systems today would have been unimaginable a decade ago, and these capabilities fundamentally change how we approach system design.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Applying in Interviews
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="applying-in-interviews">Applying These Numbers in System Design Interviews</h2>
          <p>
            Knowing the numbers isn't enough; you need to understand how they change the architectural decisions you make. Let's look at how they impact specific components.
          </p>

          <h3 id="caching">Caching</h3>
          <p>
            With modern servers supporting up to 4 TB of RAM, <strong>you almost never need to shard or partition a caching cluster for size reasons alone</strong>. A single Redis instance can easily store tens of gigabytes of hot data. 
          </p>
          <p>
            Instead, we partition cache clusters (like Redis Cluster) to scale network throughput (bandwidth) and CPU cycles (redis is mostly single-threaded), or for high availability. In an interview, if you have a dataset under 100GB, do not propose a complex sharding scheme for your cache—a primary-replica cluster is more than sufficient.
          </p>

          <h3 id="databases">Databases</h3>
          <p>
            Relational databases (PostgreSQL, MySQL) are incredibly resilient. On modern NVMe SSDs, a single database node can easily support 1 to 2 TB of data with indexing, and handle 10,000+ simple reads/writes per second. 
          </p>
          <p>
            Many candidates jump straight to sharding the database the moment writes reach 1,000 QPS. Vertically scaling the instance (e.g. upgrading CPU and memory) and using read replicas or connection pooling (PgBouncer) will keep a relational database happy up to much higher thresholds. Proposing database sharding when a single node is operating at only 10% capacity makes you look inexperienced.
          </p>

          <h3 id="app-servers">Application Servers</h3>
          <p>
            Modern application runtimes (Node.js, Go, Rust) are highly efficient. A single application node can handle 10,000 to 50,000 concurrent WebSocket connections or handle 5,000+ request/response cycles per second depending on how heavy the CPU/network work is. 
          </p>
          <p>
            When estimating app tier sizing, you rarely need hundreds of instances for normal business scales. A modest fleet of 5 to 10 instances is usually more than enough to handle regional traffic while providing failover redundancy.
          </p>

          <h3 id="message-queues">Message Queues</h3>
          <p>
            Message brokers like Kafka are bounded primarily by network bandwidth and disk I/O, not CPU. Because modern nodes support 25 Gbps to 100 Gbps network cards, a single Kafka broker can ingest hundreds of thousands of messages per second. Don't worry about message brokers being a bottleneck for typical applications; they can absorb massive write peaks seamlessly.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Cheat Sheet
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="cheat-sheet">Cheat Sheet: Latency & Hardware Sizing</h2>
          <p>
            Here are the rough numbers you should keep in mind during your scale estimations:
          </p>
          
          <div style={{ margin: '16px 0', overflowX: 'auto' }}>
            <table className="schema-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '8px' }}>Resource / Operation</th>
                  <th style={{ padding: '8px' }}>Latency / Capacity</th>
                  <th style={{ padding: '8px' }}>Key takeaway for interviews</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>L1 / L2 Cache Access</strong></td>
                  <td style={{ padding: '8px' }}>~1-2 ns</td>
                  <td style={{ padding: '8px' }}>CPU-level operation. Extremely fast.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>RAM Access</strong></td>
                  <td style={{ padding: '8px' }}>~100 ns</td>
                  <td style={{ padding: '8px' }}>Reads/writes in memory are sub-microsecond.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>SSD Sequential Read</strong></td>
                  <td style={{ padding: '8px' }}>~10-25 µs</td>
                  <td style={{ padding: '8px' }}>NVMe SSDs read at 5-10 GB/sec. Disk reads are fast.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>Network round-trip (Intra-AZ)</strong></td>
                  <td style={{ padding: '8px' }}>~0.5 - 1 ms</td>
                  <td style={{ padding: '8px' }}>Within the same availability zone.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>Network round-trip (Cross-AZ)</strong></td>
                  <td style={{ padding: '8px' }}>~1 - 2 ms</td>
                  <td style={{ padding: '8px' }}>Between different datacenters in the same region.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>Network round-trip (US to EU)</strong></td>
                  <td style={{ padding: '8px' }}>~70 - 90 ms</td>
                  <td style={{ padding: '8px' }}>Cross-atlantic round-trip latency. Bounded by speed of light.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}><strong>Network round-trip (Global)</strong></td>
                  <td style={{ padding: '8px' }}>~150 - 250 ms</td>
                  <td style={{ padding: '8px' }}>US to Asia or Europe to Australia.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Common Mistakes
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="common-mistakes">Common Mistakes In Interviews</h2>
          <p>
            Avoiding these three common mistakes will show the interviewer that you have practical, hands-on engineering experience.
          </p>

          <h3 id="premature-sharding">1. Premature Sharding</h3>
          <p>
            As mentioned, suggesting that you need to shard a database at 200GB is a red flag. A single modern database instance can easily scale to 2-4TB. Relational engines handle indexing on large tables comfortably. 
          </p>
          <p>
            Always propose scaling vertically (upgrading the instance size), introducing indexing, using read replicas, and utilizing memory caching (like Redis) <strong>before</strong> jumping to sharding.
          </p>

          <h3 id="overestimating-latency">2. Overestimating Latency</h3>
          <p>
            Candidates often assume database lookups or network calls take hundreds of milliseconds. 
          </p>
          <ul>
            <li>A cache read is ~1ms.</li>
            <li>A simple primary key index database lookup is ~5-15ms.</li>
            <li>Regional network hops are ~1-2ms.</li>
          </ul>
          <p>
            Only cross-continental network calls exceed 50ms. Work with these realistic expectations when discussing SLA boundaries.
          </p>

          <h3 id="overengineering-throughput">3. Over-engineering Given a High Write Throughput</h3>
          <p>
            If your target system handles 500 writes/second, you do not need Kafka queues, separate worker microservices, and distributed locking layers. 
          </p>
          <p>
            A simple PostgreSQL database can easily absorb thousands of writes per second on standard hardware. Keep the system as simple as possible until write volume demands asynchronous processing.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Costs
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="costs">What About Costs?</h2>
          <p>
            While modern hardware is capable of running massive workloads on a single node, you should discuss cost trade-offs during your design.
          </p>
          <p>
            For example, renting a 4TB RAM memory-optimized U-metal instance on AWS is far more expensive than deploying a cluster of 8 smaller 512GB nodes. In production, we also split workloads across multiple instances for <strong>fault isolation (limiting blast radius)</strong>. If a single 4TB instance crashes, your entire app is down. 
          </p>
          <p>
            In an interview, say: <em>"We could technically run this database on a single large vertical instance, but for reliability, blast radius isolation, and cost-efficiency, we'll split it across read replicas and plan for sharding once writes warrant it."</em>
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Conclusion
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="wrapping-up">Conclusion</h2>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Modern servers are beasts:</strong> Single machines can support TBs of RAM, tens of TBs of NVMe SSDs, and 25-100 Gbps network cards.</li>
              <li><strong>Scale vertically first:</strong> Upgrade server size, use caching, and configure read replicas before proposing database sharding.</li>
              <li><strong>Don't over-engineer simple loads:</strong> Standard databases can absorb thousands of operations per second directly. Keep designs simple.</li>
              <li><strong>Understand latency boundaries:</strong> Sub-ms within an AZ, ~1-2ms cross-AZ, ~70-90ms cross-atlantic, and ~150-250ms cross-globe.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#db-indexing" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Database Indexing</div>
            </div>
          </a>
          <a href="#redis" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Redis</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
