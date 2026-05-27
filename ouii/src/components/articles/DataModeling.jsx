import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function DataModeling() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Core Concepts</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Data Modeling</span>
          </div>
          <h1>Data Modeling</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about data modeling for system design interviews
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Databases & Storage
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step</p>
          </Callout>

          <p>
            Data modeling is the process of defining how your application’s data is structured, stored, and related. In practice, this means deciding what entities exist, how they’re identified, and how they connect to one another. For a system design interview, the bar is much lower than in a dedicated data modeling interview (commonplace in data engineering loops). You’re not expected to normalize everything or produce a complete schema diagram, you’re just expected to design something clear, functional, and aligned with your system’s requirements.
          </p>
          <p>
            In the Delivery framework, this comes up twice. First, during requirements gathering, you’ll identify your core entities. These usually map 1:1 with tables or collections and form the backbone of your schema. Later, in the High-Level Design step, you'll sketch a basic schema alongside your database component. Include the key fields, relationships, and a note on how you'd index or partition to support the main query patterns. That’s enough for most interviewers to see that your data model won’t crumble under expected usage.
          </p>
        </section>

        <section className="content-section">
          <h2 id="data-modeling-in-interview">Data Modeling in an Interview</h2>
          <p>
            Still, a reasonable schema is more than box-drawing. It sets up the rest of your design, such as scaling reads and writes, preserving consistency when it matters, and answering questions about growth or auditability without backtracking. A sloppy data model can lead to painful issues later. A solid, “good enough” one lets the conversation stay focused where it belongs.
          </p>
        </section>

        <section className="content-section">
          <h2 id="database-model-options">Database Model Options</h2>
          <p>
            Before you can design a schema, you need to pick what type of database you're working with. Different database models shape how you structure your data, so this choice affects everything that follows.
          </p>
          <p>
            In interviews, the temptation is to show off by choosing exotic database types. Resist this. Most of the time, the right answer is a relational database. It's the default unless your requirements clearly signal a specialized model. Unless you have significant experience and, with it, strong opinions about another database, my recommendation is to stick with PostgreSQL.
          </p>
          <p>
            That doesn’t mean other database models aren’t worth knowing. Showing you understand when they might be useful demonstrates that you’re thinking about trade-offs, not just parroting the default. Still, the star of the show is SQL, so we’ll start there before briefly touching on the alternatives.
          </p>

          <h3 id="relational-databases">Relational Databases (SQL)</h3>
          <p>
            Relational databases organize data into tables with fixed schemas, where rows represent entities and columns represent attributes. They enforce relationships through foreign keys and provide ACID guarantees for transactions.
          </p>
          <p>
            Most system design problems map naturally onto this model. A social media app has users, posts, comments, and likes, all entities with clear relationships. An e-commerce system has users, products, orders, and payments. These fit neatly into relational tables where constraints and foreign keys preserve integrity.
          </p>

          <div style={{ margin: '16px 0', overflowX: 'auto' }}>
            <strong>Users table:</strong>
            <table className="schema-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '8px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <th style={{ padding: '8px' }}>id (primary key)</th>
                  <th style={{ padding: '8px' }}>username</th>
                  <th style={{ padding: '8px' }}>email</th>
                  <th style={{ padding: '8px' }}>created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>john_doe</td>
                  <td style={{ padding: '8px' }}>john@example.com</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:00:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>jane_doe</td>
                  <td style={{ padding: '8px' }}>jane@example.com</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:05:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>3</td>
                  <td style={{ padding: '8px' }}>bob_smith</td>
                  <td style={{ padding: '8px' }}>bob@example.com</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:10:00</td>
                </tr>
              </tbody>
            </table>

            <strong>Posts table:</strong>
            <table className="schema-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '8px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <th style={{ padding: '8px' }}>id (primary key)</th>
                  <th style={{ padding: '8px' }}>user_id (foreign key)</th>
                  <th style={{ padding: '8px' }}>content</th>
                  <th style={{ padding: '8px' }}>created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>Hello, world!</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:00:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>My first post</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:05:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>3</td>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>Another post</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:10:00</td>
                </tr>
              </tbody>
            </table>

            <strong>Likes table:</strong>
            <table className="schema-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '8px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '8px' }}>
                  <th style={{ padding: '8px' }}>id (primary key)</th>
                  <th style={{ padding: '8px' }}>user_id (foreign key)</th>
                  <th style={{ padding: '8px' }}>post_id (foreign key)</th>
                  <th style={{ padding: '8px' }}>created_at</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:00:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>1</td>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:05:00</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px' }}>3</td>
                  <td style={{ padding: '8px' }}>2</td>
                  <td style={{ padding: '8px' }}>3</td>
                  <td style={{ padding: '8px' }}>2024-01-01 10:10:00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            SQL is great at handling complex queries. If you need to fetch "all posts by users that a given user follows, ordered by recency," joins make that straightforward. However, be careful with multi-table joins like this - they can become performance traps at scale. In interviews, mentioning complex reporting-style queries often raises yellow flags about performance, so you'll want to think through whether they're actually performant enough or if you need denormalized views, caching, or pre-computed results. And when strong consistency is a non-functional requirement, like ensuring payments don't double-charge or inventory doesn't oversell, SQL's ACID guarantees are the right tool for the job.
          </p>
          <p>
            The usual knock on relational databases is scalability, but this is often exaggerated. Modern SQL databases scale with techniques like read replicas, sharding, connection pooling, and caching. Some of the largest companies in the world (Facebook, Airbnb) rely on relational foundations. Scaling isn't just about the database you choose, but how you architect around it.
          </p>
          <p>
            Example technologies include PostgreSQL, MySQL, and SQLite.
          </p>

          <h3 id="document-databases">Document Databases</h3>
          <p>
            Document databases store data as JSON-like documents with flexible schemas, making them good for rapidly evolving applications where you don't know all your data fields upfront. Your data modeling becomes more about nesting and embedding related information within documents rather than normalizing across tables.
          </p>
          <p>
            Notice how the same data from our SQL example gets restructured. Instead of separate tables, we embed posts directly within each user document. This eliminates joins but means updating a post requires finding and modifying the entire user document.
          </p>
          
          <p>Users collection:</p>
          <CodeBlock language="json">{`{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "posts": [
    {
      "content": "Hello, world!",
      "created_at": "2024-01-01T10:00:00Z"
    },
    {
      "content": "My first post",
      "created_at": "2024-01-01T10:05:00Z"
    }
  ],
  "created_at": "2024-01-01T10:00:00Z"
}`}</CodeBlock>

          <p>
            System design interviews intentionally scope functional requirements to a clear, concise set. This means you're unlikely to have "evolving schemas" in the first place, which removes the main reason to choose document databases. Only consider them if your interviewer explicitly mentions rapidly changing data structures.
          </p>
          <p>
            When to consider over SQL: When your schema changes frequently, when you have deeply nested data that would require many joins in SQL, or when different records have vastly different structures. A user profile system where some users have extensive work histories while others have minimal data fits this pattern.
          </p>
          <p>
            Data modeling impact: You'll denormalize more aggressively, embedding related data within documents to avoid expensive lookups across collections. This trades storage space and update complexity for read performance.
          </p>
          <p>
            Example technologies include MongoDB, Firestore, and CouchDB.
          </p>

          <h3 id="key-value-stores">Key-Value Stores</h3>
          <p>
            Key-value stores provide simple lookups where you fetch values by exact key match. They're extremely fast but offer limited query capabilities beyond that basic operation.
          </p>
          <p>
            When to consider over SQL: For caching, session storage, feature flags, or any scenario where you only need to look up data by a single identifier. They're also good for high-write scenarios where you need maximum performance and don't need complex queries.
          </p>
          <p>
            "Over SQL" is misleading here. In practice, you'll often use both together. SQL as your source of truth with a key-value cache (like Redis) in front for hot data. This gives you fast access without sacrificing durability or complex queries.
          </p>
          <p>
            Data modeling impact: Your schema becomes very flat. You'll denormalize heavily and duplicate data across multiple keys to support different access patterns, since you can't join or query across relationships. This is great for reads but terrible for consistency when data changes.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Key-Value Cache</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">Client</div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box diagram-box--server">Redis Cache<br/><small>(Memory)</small></div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box diagram-box--server">SQL Database<br/><small>(Disk)</small></div>
            </div>
          </div>

          <p>
            Example technologies include Redis, DynamoDB, and Memcached.
          </p>

          <h3 id="wide-column-databases">Wide-Column Databases</h3>
          <p>
            Wide-column databases organize data into column families where rows can have different sets of columns. They're optimized for massive write-heavy workloads and time-series data.
          </p>
          <p>
            When a user creates a new post, you add a new row keyed by (user_id, timestamp). Rows with the same partition key (user_id) are stored together, making writes fast (just append to the partition) and reads efficient (scan a contiguous range of a user's posts).
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Wide-Column Database</div>
            <div className="diagram-flow" style={{ flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px', background: 'var(--bg-accent)', borderRadius: '8px' }}>
              <div style={{ width: '100%', textAlign: 'left', background: 'var(--bg-surface)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Partition Key: user_id = 123</strong>
                <hr style={{ border: 'none', borderBottom: '1px dashed var(--border-color)', margin: '12px 0' }} />
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1', minWidth: '150px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>timestamp: T1</div>
                    <div style={{ fontWeight: '600' }}>post_id: 1</div>
                  </div>
                  <div style={{ flex: '1', minWidth: '150px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>timestamp: T2</div>
                    <div style={{ fontWeight: '600' }}>post_id: 2</div>
                  </div>
                  <div style={{ flex: '1', minWidth: '150px', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>timestamp: T3</div>
                    <div style={{ fontWeight: '600' }}>post_id: 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p>
            When to consider over SQL: When you have enormous write volumes, time-series data, or analytics workloads where you primarily append data and run aggregations. Think telemetry, event logging, or IoT sensor data.
          </p>
          <p>
            Data modeling impact: You'll design around query patterns even more than with SQL, often duplicating data across different column families to support various access patterns. Time becomes a first-class citizen in your modeling.
          </p>
          <p>
            Example technologies include Cassandra and HBase.
          </p>

          <h3 id="graph-databases">Graph Databases</h3>
          <p>
            Graph databases store data as nodes and edges, optimizing for traversing relationships between entities.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Graph Database</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px', position: 'relative', height: '200px' }}>
              <div style={{ position: 'absolute', top: '50px', left: '150px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>User A</div>
              <div style={{ position: 'absolute', top: '50px', right: '150px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>User B</div>
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '60px', borderRadius: '50%', background: '#ff9800', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Post</div>
              
              {/* Fake SVG lines for edges */}
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                <line x1="210" y1="80" x2="390" y2="80" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="5,5" />
                <line x1="180" y1="110" x2="280" y2="150" stroke="var(--border-color)" strokeWidth="2" />
                <line x1="420" y1="110" x2="320" y2="150" stroke="var(--border-color)" strokeWidth="2" />
                
                <text x="300" y="70" fill="var(--text-muted)" fontSize="12" textAnchor="middle">FOLLOWS</text>
                <text x="220" y="140" fill="var(--text-muted)" fontSize="12" textAnchor="middle">CREATED</text>
                <text x="380" y="140" fill="var(--text-muted)" fontSize="12" textAnchor="middle">LIKED</text>
              </svg>
            </div>
          </div>

          <p>
            When to consider over SQL: Honestly? Almost never in interviews. The classic examples are social networks and recommendation engines, but even Facebook models their social graph with MySQL. If it's good enough for the world's largest social network, it's probably good enough for your interview.
          </p>
          <p>
            Example technologies include Neo4j and Amazon Neptune.
          </p>
          <p>
            Graph databases are a common mistake in interviews. They sound sophisticated but add unnecessary complexity. Even "graph-heavy" companies like LinkedIn and Twitter use SQL for their core relationship data. Other databases can handle the primary query patterns without the operational complexity that comes with specialized graph systems.
          </p>
        </section>

        <section className="content-section">
          <h2 id="schema-design-fundamentals">Schema Design Fundamentals</h2>
          <p>
            Once you've picked your database type, you need to design a schema that supports your system's requirements.
          </p>

          <h3 id="start-with-requirements">Start with Requirements</h3>
          <p>
            Everything flows from three key factors that require careful consideration and were likely already determined during the requirements gathering and api design phases.
          </p>
          <p>
            <strong>Data volume</strong> determines where your data can physically live. A social media app with millions of users might need data spread across multiple data stores, which drives schema design choices. If user data and post data need to live on separate systems for performance or organizational reasons, they necessarily need distinct schemas with careful consideration of how they reference each other.
          </p>
          <p>
            <strong>Access patterns</strong> are the most important factor and drive most of your design decisions. How will your data be queried? A news feed that loads "recent posts by followed users" suggests you'll want denormalized data or carefully designed indexes. An analytics dashboard that aggregates data across time periods might need different table structures entirely. This comes naturally from your APIs. Just ask what queries will I need to support each endpoint?
          </p>
          <p>
            <strong>Consistency requirements</strong> determine how tightly coupled your data can be. Financial transactions need strong consistency (no partial charges), which often means keeping related data in the same database with ACID guarantees. But a user's activity feed can handle eventual consistency (it's okay if a like shows up a few seconds later), which allows you to distribute that data across separate systems with different schemas optimized for different access patterns.
          </p>
          <p>
            In interviews, explicitly tie your schema choices back to these factors. For example, "Since we need to load feeds quickly and likes can be eventually consistent, I'll denormalize like counts into the posts table." That shows you're reasoning instead of memorizing patterns.
          </p>
          <p>
            All of the schema design techniques that follow (entities, keys, normalization, indexes, sharding) are just tools to address these three factors.
          </p>

          <h3 id="entities-keys-relationships">Entities, Keys & Relationships</h3>
          <p>
            Once you’ve identified your core entities, the next step is to map them into tables (or collections) with clear identifiers and relationships.
          </p>
          <p>
            For a social media app, you might have users, posts, comments, and likes. Each entity needs a primary key to identify individual records. Use system-generated IDs like user_id or post_id rather than business data like email addresses. System-generated keys stay stable even when business rules change.
          </p>
          
          <CodeBlock language="text">{`users: id (PK), username, email
posts: id (PK), user_id (FK → users.id), content, created_at
comments: id (PK), post_id (FK → posts.id), user_id (FK → users.id), content
likes: user_id (FK → users.id), post_id (FK → posts.id)`}</CodeBlock>

          <p>
            This shows the core relationships: each post belongs to one user (posts.user_id), each comment belongs to one post and one user, and likes connect users to posts. The (PK) marks primary keys, (FK) marks foreign keys with arrows showing what they reference.
          </p>
          <p>
            In interviews, just pick an obvious primary key and explain why. "post_id will be our primary key so we can uniquely identify each post and reference it from comments and likes."
          </p>
          <p>
            With entities defined, connect them with relationships:
          </p>
          <ul>
            <li><strong>One-to-many (1:N):</strong> a user has many posts, a post has many comments.</li>
            <li><strong>Many-to-many (N:M):</strong> users like many posts, posts are liked by many users.</li>
            <li><strong>One-to-one (1:1):</strong> rare in practice, often a sign that two tables should just be merged.</li>
          </ul>
          <p>
            These relationships are enforced through foreign keys in SQL (e.g., posts.user_id → users.id) or by application logic in NoSQL. Foreign keys help ensure referential integrity - meaning they prevent orphaned records like a post referencing a user that doesn't exist, or comments pointing to deleted posts. However, they come at a cost because the database has to validate each insert/update. At very large scale, some companies drop them for write performance and enforce integrity at the application level. In an interview, mentioning them shows you understand the trade-off.
          </p>
          <p>
            Finally, layer in constraints like NOT NULL, UNIQUE, or CHECK. These enforce correctness at the database level (emails must be unique, prices must be positive). They protect data quality, though they also add write overhead.
          </p>
          <p>
            Keep your schema grounded in the problem domain: users, tweets, follows if you're modeling Twitter, not abstract "entities" and "relationships." Then show how keys, foreign keys, and constraints keep that model correct and scalable.
          </p>

          <h3 id="indexing-for-access-patterns">Indexing for Access Patterns</h3>
          <p>
            Indexes are data structures that help the database find records quickly without scanning every row. Think of them like the index in a book - instead of reading every page to find "normalization," you look it up in the index and jump directly to page 149. While data modeling in an interview, you'll typically want to callout which columns are indexed and why.
          </p>
          <p>
            Your indexes should directly support your most important queries. For a social media app:
          </p>
          <ul>
            <li>Index on <code>posts.user_id</code> to quickly find all posts by a user</li>
            <li>Index on <code>posts.created_at</code> to load recent posts chronologically</li>
            <li>Composite index on <code>(user_id, created_at)</code> to efficiently load a user's recent posts</li>
          </ul>
          <p>
            For a deeper understanding of how indexes work under the hood, different index types (B-trees, hash indexes, etc.), and advanced indexing strategies, see our Database Indexing deep dive.
          </p>
          <p>
            In interviews, connect your indexes directly to your API endpoints. "The GET /users/{"{id}"}/posts endpoint needs an index on posts.user_id" shows you're thinking about real query performance.
          </p>

          <h3 id="normalization-vs-denormalization">Normalization vs Denormalization</h3>
          <p>
            Normalization means storing each piece of information in exactly one place. User data lives only in the users table, not duplicated across other tables. This prevents data anomalies where updates happen in one place but not another, leaving your system with inconsistent state.
          </p>
          
          <p>Normalized:</p>
          <CodeBlock language="text">{`id    username    email
1     john_doe    john@example.com
2     jane_doe    jane@example.com

id    user_id (FK)    content             created_at
1     1               Hello, world!       2024-01-01 10:00:00
2     1               My first post       2024-01-01 10:05:00`}</CodeBlock>

          <p>Denormalized:</p>
          <CodeBlock language="text">{`id    user_id    username    email               content             created_at
1     1          john_doe    john@example.com    Hello, world!       2024-01-01 10:00:00
2     1          john_doe    john@example.com    My first post       2024-01-01 10:05:00`}</CodeBlock>

          <p>
            In the denormalized version, if a user changes their username, you'd have to update every single post they've ever made. Miss one update and you have inconsistent data.
          </p>
          <p>
            In system design interviews, start with a clean normalized model and denormalize only when needed. Avoid repeating data in your schema design. Repeating data is wasteful and creates consistency problems that are much harder to solve than the performance problems you're trying to avoid.
          </p>
          <p>
            There are a few key exceptions where denormalization might make sense:
          </p>
          <ul>
            <li>Analytics and reporting systems where you're aggregating data that changes infrequently</li>
            <li>Event logs and audit trails where you're capturing a snapshot of data at a point in time</li>
            <li>Heavily read-optimized systems like search engines where consistency is less critical than speed</li>
          </ul>
          <p>
            That said, even if you need denormalized quick access for performance, you can just put a cache in front that has a denormalized representation of the data. Your source of truth stays clean and normalized, but your cache can have pre-computed joins, aggregations, or whatever structure makes reads fast.
          </p>

          <h3 id="scaling-and-sharding">Scaling and Sharding</h3>
          <p>
            When your data gets too large for a single database, you need to shard it across multiple machines. The key is choosing a partition strategy that keeps related data together.
          </p>
          <p>
            Shard by the primary access pattern. If you mostly query "posts by user," shard by user_id. This keeps a user's posts on the same database, avoiding expensive cross-shard queries.
          </p>
          <p>
            Be careful with time-range sharding. While it sounds appealing for "recent posts" queries, all current writes hit the same shard (the latest time range), creating a hot shard. This is usually an anti-pattern for write-heavy systems. Time-range partitioning works better for archival or analytics workloads where recent data is read-heavy but writes are spread out.
          </p>
          <p>
            Avoid cross-shard queries whenever possible. If your timeline feature needs to show posts from multiple users a user follows, and you've sharded by user_id, you'll have to query multiple shards and merge results. This is expensive and complex.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Sharding</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', gap: '24px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'var(--bg-accent)', padding: '16px', borderRadius: '8px', border: '2px solid var(--primary)', width: '180px', textAlign: 'center' }}>
                  <strong>Shard 1</strong><br/>
                  <small style={{ color: 'var(--text-muted)' }}>user_id: 1 to 500M</small>
                </div>
                <div className="diagram-arrow">↑</div>
                <div className="diagram-box diagram-box--client">User 100 (reads/writes)</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ background: 'var(--bg-accent)', padding: '16px', borderRadius: '8px', border: '2px solid #e10098', width: '180px', textAlign: 'center' }}>
                  <strong>Shard 2</strong><br/>
                  <small style={{ color: 'var(--text-muted)' }}>user_id: 500M to 1B</small>
                </div>
                <div className="diagram-arrow">↑</div>
                <div className="diagram-box diagram-box--client" style={{ borderLeftColor: '#e10098' }}>User 800M (reads/writes)</div>
              </div>
            </div>
          </div>

          <p>
            Your choice of shard key is often permanent and affects every query. Think carefully about your primary access patterns before choosing how to shard your data.
          </p>
        </section>

        <section className="content-section">
          <h2 id="conclusion">Conclusion</h2>
          <p>
            Data modeling is a core part of system design interviews, but it's not the focus. Your goal is to show that you can design a reasonable schema that supports your system's requirements, then move on.
          </p>
          <p>
            Start by outlining your core entities early in the interview. Then, when introducing a database component during the high-level design:
          </p>
          <ul>
            <li>Determine the type of database you'll use</li>
            <li>List the columns needed to fulfill the functional requirements for each entity</li>
            <li>Specify primary and foreign keys for each relationship</li>
            <li>Determine which columns need indexes (if any)</li>
            <li>Determine whether you need to denormalize for performance</li>
            <li>Consider whether sharding is necessary. If yes, choose a shard key that matches your main access pattern.</li>
          </ul>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#api-design" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">API Design</div>
            </div>
          </a>
          <a href="#caching" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Caching</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}

