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
            <span className="breadcrumb-current">CAP Theorem</span>
          </div>
          <h1>CAP Theorem</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master the fundamental tradeoffs between consistency and availability in distributed systems.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Distributed Systems
            </span>
            <span className="difficulty-badge difficulty-badge--beginner">Beginner</span>
          </div>
        </div>

        <section className="content-section">
          <div className="video-walkthrough-banner">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <div>
            <div className="video-walkthrough-title">Watch Video Walkthrough</div>
            <div className="video-walkthrough-desc">Watch the author walk through the problem step-by-step</div>
          </div>
        </div>

          <p>
            CAP theorem is routinely a point of confusion for candidates, but it is foundational to how you approach your design in an interview.
          </p>
          <p>
            We'll explain what it is, how it works, and the practical tradeoffs you need to make when considering CAP theorem during the non-functional requirements phase of a system design interview.
          </p>
        </section>

        <section className="content-section">
          <h2 id="what-is-cap-theorem">What is CAP Theorem?</h2>
          <p>
            At its core, CAP theorem states that in a distributed system, you can only have two out of three of the following properties:
          </p>
          <ul>
            <li><strong>Consistency:</strong> All nodes see the same data at the same time. When a write is made to one node, all subsequent reads from any node will return that updated value.</li>
            <li><strong>Availability:</strong> Every request to a non-failing node receives a response, without the guarantee that it contains the most recent version of the data.</li>
            <li><strong>Partition Tolerance:</strong> The system continues to operate despite arbitrary message loss or failure of part of the system (i.e., network partitions between nodes).</li>
          </ul>
          <p>
            Note that consistency in the context of the CAP theorem is quite different from the consistency guaranteed by ACID databases. Confusing, I know.
          </p>
          <p>
            Here's the key insight that makes CAP theorem much simpler to reason about in interviews: In any distributed system, partition tolerance is a must. Network failures will happen, and your system needs to handle them.
          </p>
          <p>
            This means that in practice, CAP theorem really boils down to a single choice: Do you prioritize consistency or availability when a network partition occurs?
          </p>
          <p>
            Let's explore what this means through a practical example.
          </p>
        </section>

        <section className="content-section">
          <h2 id="understanding-cap-theorem-through-an-example">Understanding CAP Theorem Through an Example</h2>
          <p>
            Imagine you're running a website with two servers - one in the USA and one in Europe. When a user updates their public profile (let's say their display name), here's what happens:
          </p>
          <ol>
            <li>User A connects to their closest server (USA) and updates their name</li>
            <li>This update is replicated to the server in Europe</li>
            <li>When User B in Europe views User A's profile, they see the updated name</li>
          </ol>

          <div className="diagram-container">
            <div className="diagram-title">Basic Replication</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="diagram-box diagram-box--client">User A</div>
                <div className="diagram-arrow" style={{ padding: '0' }}>↓</div>
                <div className="diagram-box diagram-box--server">USA Server</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="diagram-arrow">→</div>
                <span style={{ fontSize: '0.85rem', color: '#666', background: '#fff', padding: '0 4px' }}>Replication</span>
                <div className="diagram-arrow">→</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="diagram-box diagram-box--client">User B</div>
                <div className="diagram-arrow" style={{ padding: '0' }}>↓</div>
                <div className="diagram-box diagram-box--server">Europe Server</div>
              </div>
            </div>
          </div>

          <p>
            Everything works smoothly until we encounter a network partition - the connection between our USA and Europe servers goes down. Now we have a critical decision to make:
          </p>
          <p>
            When User B tries to view User A's profile, should we:
          </p>
          <ul>
            <li><strong>Option A:</strong> Return an error because we can't guarantee the data is up-to-date (choosing consistency)</li>
            <li><strong>Option B:</strong> Show potentially stale data (choosing availability)</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Network Partition</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="diagram-box diagram-box--client">User A</div>
                <div className="diagram-arrow" style={{ padding: '0' }}>↓</div>
                <div className="diagram-box diagram-box--server">USA Server</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', color: '#c62828', fontWeight: 'bold' }}>
                <div className="diagram-arrow" style={{ color: '#c62828' }}>—</div>
                <span style={{ fontSize: '1.5rem', margin: '0 8px' }}>X</span>
                <div className="diagram-arrow" style={{ color: '#c62828' }}>—</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="diagram-box diagram-box--client">User B</div>
                <div className="diagram-arrow" style={{ padding: '0' }}>↓</div>
                <div className="diagram-box diagram-box--server">Europe Server</div>
              </div>
            </div>
          </div>

          <p>
            This is where CAP theorem becomes practical - we must choose between consistency and availability.
          </p>
          <p>
            In the case, the answer is rather clear: we would rather show a user in Europe the old name of User A, rather than show an error. Seeing a stale name is better than seeing no name at all.
          </p>
          <p>
            Let's look at some other real-world examples of this choice:
          </p>

          <h3 id="when-to-choose-consistency">When to Choose Consistency</h3>
          <p>
            Some systems absolutely require consistency, even at the cost of availability:
          </p>
          <ul>
            <li><strong>Ticket Booking Systems:</strong> Imagine if User A booked seat 6A on a flight, but due to a network partition, User B sees the seat as available and books it too. You'd have two people showing up for the same seat!</li>
            <li><strong>E-commerce Inventory:</strong> If Amazon has one toothbrush left and the system shows it as available to multiple users during a network partition, they could oversell their inventory.</li>
            <li><strong>Financial Systems:</strong> Stock trading platforms need to show accurate, up-to-date order books. Showing stale data could lead to trades at incorrect prices.</li>
          </ul>

          <h3 id="when-to-choose-availability">When to Choose Availability</h3>
          <p>
            The majority of systems can tolerate some inconsistency and should prioritize availability. In these cases, eventual consistency is fine. Meaning, the system will eventually become consistent, but it may take a few seconds or minutes.
          </p>
          <ul>
            <li><strong>Social Media:</strong> If User A updates their profile picture, it's perfectly fine if User B sees the old picture for a few minutes.</li>
            <li><strong>Content Platforms (like Netflix):</strong> If someone updates a movie description, showing the old description temporarily to some users isn't catastrophic.</li>
            <li><strong>Review Sites (like Yelp):</strong> If a restaurant updates their hours, showing slightly outdated information briefly is better than showing no information at all.</li>
          </ul>
          <p>
            The key question to ask yourself is: "Would it be catastrophic if users briefly saw inconsistent data?" If the answer is yes, choose consistency. If not, choose availability.
          </p>
        </section>

        <section className="content-section">
          <h2 id="cap-theorem-in-system-design-interviews">CAP Theorem in System Design Interviews</h2>
          <p>
            Understanding CAP theorem matters because it should be one of the first things you discuss in a system design interview as it will have a meaningful impact on how you design your system.
          </p>
          <p>
            In a system design interview, you typically begin by:
          </p>
          <ol>
            <li>Aligning on functional requirements (features)</li>
            <li>Defining non-functional requirements (system qualities)</li>
          </ol>
          <p>
            When discussing non-functional requirements, CAP theorem should be your starting point. You need to ask the all important question: "Does this system need to prioritize consistency or availability?"
          </p>

          <p>
            If you prioritize <strong>consistency</strong>, your design might include:
          </p>
          <ul>
            <li><strong>Distributed Transactions:</strong> Ensuring multiple data stores (like cache and database) remain in sync through two-phase commit protocols. This adds complexity but guarantees consistency across all nodes. This means users will likely experience higher latency as the system ensures data is consistent across all nodes.</li>
            <li><strong>Single-Node Solutions:</strong> Using a single database instance to avoid propagation issues entirely. While this limits scalability, it eliminates consistency challenges by having a single source of truth.</li>
            <li><strong>Technology Choices:</strong>
              <ul>
                <li>Traditional RDBMSs (PostgreSQL, MySQL)</li>
                <li>Google Spanner</li>
                <li>DynamoDB (in strong consistency mode)</li>
              </ul>
            </li>
          </ul>

          <p>
            On the other hand, if you prioritize <strong>availability</strong>, your design can include:
          </p>
          <ul>
            <li><strong>Multiple Replicas:</strong> Scaling to additional read replicas with asynchronous replication, allowing reads to be served from any replica even if it's slightly behind. This improves read performance and availability at the cost of potential staleness.</li>
            <li><strong>Change Data Capture (CDC):</strong> Using CDC to track changes in the primary database and propagate them asynchronously to replicas, caches, and other systems. This allows the primary system to remain available while updates flow through the system eventually.</li>
            <li><strong>Technology Choices:</strong>
              <ul>
                <li>Cassandra</li>
                <li>DynamoDB (in multiple availability zone configuration)</li>
                <li>Redis clusters</li>
              </ul>
            </li>
          </ul>
          <p>
            Most modern distributed databases offer configuration options for both consistency and availability. The key is understanding which to choose for your use case.
          </p>
        </section>

        <section className="content-section">
          <h2 id="advanced-cap-theorem-considerations">Advanced CAP Theorem Considerations</h2>
          <p>
            If you're a junior or mid-level candidate, the previous sections are sufficient for most interviews. The following section covers more advanced concepts that might be relevant for senior and staff-level discussions.
          </p>
          <p>
            As systems grow in complexity, the choice between consistency and availability isn't always binary. Modern distributed systems often require nuanced approaches that vary by feature and use case. Let's explore these advanced considerations.
          </p>
          <p>
            Real-world systems frequently need both availability and consistency - just for different features. Let's look at two examples:
          </p>
          
          <h3 id="example-1-ticketmaster">Example 1: Ticketmaster</h3>
          <p>
            Ticketmaster needs different consistency models for different features within the same system:
          </p>
          <ul>
            <li><strong>Booking a seat at an event:</strong> Requires strong consistency to prevent double-booking as we discussed in the previous section.</li>
            <li><strong>Viewing event details:</strong> Can prioritize availability (showing slightly outdated event descriptions is acceptable)</li>
          </ul>
          <p>
            In an interview, you might say: "For this ticketing system, I'll prioritize consistency for booking transactions but optimize for availability when users are browsing and viewing events."
          </p>

          <h3 id="example-2-tinder">Example 2: Tinder</h3>
          <p>
            Similarly, Tinder has mixed requirements:
          </p>
          <ul>
            <li><strong>Matching:</strong> Needs consistency. If both users swipe right at about the same time, they should both see the match immediately.</li>
            <li><strong>Viewing a users profile:</strong> Can prioritize availability. Seeing a slightly outdated profile picture is acceptable if a user just updated their image.</li>
          </ul>
          <p>
            In an interview, you might say: "For this dating app, I'll prioritize consistency for matching but optimize for availability when users are viewing profiles."
          </p>

          <h3 id="different-levels-of-consistency">Different Levels of Consistency</h3>
          <p>
            When discussing consistency in CAP theorem, people usually mean strong consistency - where all reads reflect the most recent write. However, understanding the spectrum of consistency models can help you make more nuanced design decisions:
          </p>
          <ul>
            <li><strong>Strong Consistency:</strong> All reads reflect the most recent write. This is the most expensive consistency model in terms of performance, but is necessary for systems that require absolute accuracy like bank account balances. This is what we have been discussing so far.</li>
            <li><strong>Causal Consistency:</strong> Related events appear in the same order to all users. This ensures logical ordering of dependent actions, such as ensuring comments on a post must appear after the post itself.</li>
            <li><strong>Read-your-own-writes Consistency:</strong> Users always see their own updates immediately, though other users might see older versions. This is commonly used in social media platforms where users expect to see their own profile updates right away.</li>
            <li><strong>Eventual Consistency:</strong> The system will become consistent over time but may temporarily have inconsistencies. This is the most relaxed form of consistency and is often used in systems like DNS where temporary inconsistencies are acceptable. This is the default behavior of most distributed databases and what we are implicitly choosing when we prioritize availability.</li>
          </ul>
        </section>

        <section className="content-section">
          <h2 id="conclusion">Conclusion</h2>
          <p>
            CAP theorem is important. It sets the stage for how you approach your design in an interview and should not be overlooked.
          </p>
          <p>
            But it doesn't need to be complicated. Just ask yourself: "Does every read need to read the most recent write?" If the answer is yes, you need to prioritize consistency. If the answer is no, you can prioritize availability.
          </p>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#consistent-hashing" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Consistent Hashing</div>
            </div>
          </a>
          <a href="#message-queues" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Message Queues</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
