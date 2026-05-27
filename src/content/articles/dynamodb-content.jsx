import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function DynamoDBContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">DynamoDB</span>
          </div>
          <h1>DynamoDB</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about how you can use DynamoDB to solve a large number of problems in System Design.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              25 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              NoSQL &amp; Key-Value
            </span>
            <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — Introduction & Data Model
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
            DynamoDB is a fully-managed, highly scalable, key-value service provided by AWS. Cool, buzz-words. But what the hell does that mean and why does it matter?
          </p>
          <ul>
            <li><strong>Fully-Managed</strong> - This means that AWS takes care of all the operational aspects of the database. The fully-managed nature allows AWS to handle all operational tasks — hardware provisioning, configuration, patching, and scaling — freeing developers to concentrate on application development.</li>
            <li><strong>Highly Scalable</strong> - DynamoDB can handle massive amounts of data and traffic. It automatically scales up or down to adjust to your application's needs, without any downtime or performance degradation.</li>
            <li><strong>Key-value</strong> - DynamoDB is a NoSQL database, which means it doesn't use the traditional relational database model. Instead, it uses a key-value model that allows for flexible data storage and retrieval.</li>
          </ul>
          <p>
            The moral of the story is that DynamoDB is a super easy to use and can scale to support a wide variety of applications. For system design interviews in particular, it has just about everything you'd ever need from a database. It even supports transactions now! Which neutralizes one of the biggest criticisms of DynamoDB in the past.
          </p>
          <p>
            Importantly, DynamoDB is not open-source, so we can't as easily describe its internals like we did with breakdowns of open source technologies like Kafka and Redis. Instead, we'll focus more on how you interact with it. In order to look under the hood, we'll rely on the limited information AWS provides via documentation and the DynamoDB Paper.
          </p>
          <p>
            In this deep dive, we'll break down exactly what you need to know about DynamoDB in order to field any question about it in a system design interview. Along the way, you'll also acquire practical learning that you can later apply in your own projects. Let's break it down!
          </p>

          <Callout type="tip" title="Can I use DynamoDB in an interview?">
            <p style={{ margin: 0 }}>
              Candidates often ask me, "am I even allowed to use DynamoDB in an interview?" The answer is simple, ask your interviewer! Many will say yes, and just expect that you know how to use it. Others may say no, expecting open-source alternatives that avoid any vendor lock-in. As is always the case, just ask 😊
            </p>
          </Callout>

          <h2 id="data-model">The Data Model</h2>
          <p>
            In DynamoDB, data is organized into tables, where each table has multiple items that represent individual records. This is just like a relational database, but with some distinct differences tailored for scalability and flexibility.
          </p>
          <ul>
            <li><strong>Tables</strong> - Serve as the top-level data structure in DynamoDB, each defined by a mandatory primary key that uniquely identifies its items. Tables support secondary indexes, enabling queries on non-primary key attributes for more versatile data retrieval.</li>
            <li><strong>Items</strong> - Correspond to rows in a relational database and contain a collection of attributes. Each item must have a primary key and can contain up to 400KB of data, including all its attributes.</li>
            <li><strong>Attributes</strong> - Key-value pairs that constitute the data within an item. They can vary in type, including scalar types (strings, numbers, booleans) and set types (string sets, number sets). Attributes can also be nested, allowing for complex data structures within a single item.</li>
          </ul>
          <p>
            Setting up DynamoDB is straightforward: you can create tables directly in the AWS console, and start inserting data immediately. Unlike traditional RDBMS, DynamoDB is schema-less, meaning you don't need to define a schema before inserting data. This means items in the same table can have different sets of attributes, and new attributes can be added to items at any point without affecting existing items. This schema-less design provides high flexibility but requires careful data validation at the application level, as DynamoDB does not enforce attribute uniformity across items.
          </p>

          {/* Create Table Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">Create Table</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', maxWidth: '300px' }}>
                  <strong style={{ color: 'var(--primary)' }}>AWS Console</strong>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                    1. Navigate to DynamoDB<br />
                    2. Click "Create table"<br />
                    3. Define table name<br />
                    4. Specify primary key<br />
                    5. Configure settings
                  </div>
                </div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
                <div className="diagram-box diagram-box--server" style={{ minWidth: '200px' }}>
                  <strong>DynamoDB Table</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Schema-less, ready for data</div>
                </div>
              </div>
            </div>
          </div>

          <p>
            Consider a users table in DynamoDB, structured as follows:
          </p>

          <CodeBlock language="json">{`{
  "PersonID": 101,
  "LastName": "Smith",
  "FirstName": "Fred",
  "Phone": "555-4321"
},
{
  "PersonID": 102,
  "LastName": "Jones",
  "FirstName": "Mary",
  "Address": {
    "Street": "123 Main",
    "City": "Anytown",
    "State": "OH",
    "ZIPCode": 12345
  }
},
{
  "PersonID": 103,
  "LastName": "Stephens",
  "FirstName": "Howard",
  "Address": {
    "Street": "123 Main",
    "City": "London",
    "PostalCode": "ER3 5K8"
  },
  "FavoriteColor": "Blue"
}`}</CodeBlock>

          <p>
            Each item represents a user with various attributes. Notice how some users have attributes not shared by others, like FavoriteColor, showing DynamoDB's flexibility in attribute management.
          </p>
          <p>
            Although DynamoDB uses JSON for data transmission, it's merely a transport format. The actual storage format of DynamoDB is proprietary, allowing users to focus on data modeling without delving into the complexities of physical data storage.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Partition Key and Sort Key
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="partition-key-and-sort-key">Partition Key and Sort Key</h2>
          <p>
            DynamoDB tables are defined by a primary key, which can consist of one or two attributes:
          </p>
          <ul>
            <li><strong>Partition Key</strong> - A single attribute that, along with the sort key (if present), uniquely identifies each item in the table. DynamoDB uses the partition key's value to determine the physical location of the item within the database. This value is hashed to determine the partition where the item is stored.</li>
            <li><strong>Sort Key (Optional)</strong> - An additional attribute that, when combined with the partition key, forms a composite primary key. The sort key is used to order items with the same partition key value, enabling efficient range queries and sorting within a partition.</li>
          </ul>

          {/* Primary Key Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">Primary Key</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Simple Primary Key</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                  <strong>Partition Key only</strong><br />
                  Each item uniquely identified by a single attribute.<br />
                  Example: <code>user_id = 101</code>
                </div>
                <div style={{ marginTop: '12px', padding: '8px', background: 'var(--bg-accent)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  PK: user_id → hash(101) → Partition A
                </div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>Composite Primary Key</strong>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.5' }}>
                  <strong>Partition Key + Sort Key</strong><br />
                  Items share a partition key but are sorted by the sort key.<br />
                  Example: <code>chat_id + message_id</code>
                </div>
                <div style={{ marginTop: '12px', padding: '8px', background: 'var(--bg-accent)', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  PK: chat_id → Partition | SK: message_id → B-tree order
                </div>
              </div>
            </div>
          </div>

          <p>
            In an interview, you'll want to be sure to specify the partition key and, optionally, a sort key when introducing DynamoDB. This choice is important for optimizing query performance and data retrieval efficiency. Just like with any other database, you'll choose a partition key that optimizes for the most common query patterns in your application and keeping data evenly distributed across partitions. In the case you need to perform range queries or sorting, you'll want to also specify the Sort Key.
          </p>
          <p>
            For example, if you're building a simple group chat application, it would make sense to use the chat_id as the partition key and message_id as the sort key. This way, you can efficiently query all messages for a specific chat group and sort them chronologically before displaying them to users.
          </p>
          <p>
            Notice we're using a monotonically increasing message_id rather than a timestamp as the sort key. While timestamps might seem intuitive for sorting messages, they don't guarantee uniqueness - multiple messages could be created in the same millisecond. A monotonically increasing ID provides both chronological ordering and uniqueness. The ID can be generated using techniques like:
          </p>
          <ul>
            <li>Auto-incrementing counters per partition</li>
            <li>UUID v7 (preferred over UUID v1 -- timestamp-first layout makes it naturally sortable as a string, and it doesn't expose the machine's MAC address)</li>
            <li>Snowflake IDs</li>
            <li>ULID</li>
          </ul>

          <h3 id="under-the-hood-keys">But what is actually happening under the hood?</h3>
          <p>
            DynamoDB uses a combination of hash-based partitioning and B-trees to efficiently manage data distribution and retrieval:
          </p>
          <ul>
            <li><strong>Hash Partitioning for Partition Keys:</strong> The physical location of the data is determined by hashing the partition key. A request router consults a partition metadata service to map the hashed key to the correct storage node. This is conceptually similar to consistent hashing but DynamoDB uses a centralized partition map and placement service rather than a peer-to-peer hash ring (as described in the original 2007 Dynamo paper). The partition metadata service also handles automatic splitting and merging of partitions as data grows.</li>
            <li><strong>B-trees for Sort Keys:</strong> Within each partition, DynamoDB organizes items in a B-tree data structure indexed by the sort key. This enables efficient range queries and sorted retrieval of data within a partition.</li>
            <li><strong>Composite Key Operations:</strong> When querying with both keys, DynamoDB first uses the partition key's hash to find the right node, then uses the sort key to traverse the B-tree and find the specific items.</li>
          </ul>
          <p>
            This two-tier approach allows DynamoDB to achieve both horizontal scalability (through partitioning) and efficient querying within partitions (through B-tree indexing). It's this combination that enables DynamoDB to handle massive amounts of data while still providing fast, predictable performance for queries using both partition and sort keys.
          </p>

          {/* Hash Partitioning + B-Tree Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">Hash Partitioning + B-Tree Storage Architecture</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--client">Client Request</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div className="diagram-box" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>Request Router</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div className="diagram-box" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }}>Partition Metadata Service</div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>↓ Maps hash(partition_key) to storage node</div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '200px' }}>
                  <strong style={{ color: 'var(--primary)' }}>Partition 1</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    B-tree indexed by Sort Key<br />
                    ├── SK: msg_001 → data<br />
                    ├── SK: msg_002 → data<br />
                    └── SK: msg_003 → data
                  </div>
                </div>
                <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', minWidth: '200px' }}>
                  <strong style={{ color: 'var(--accent)' }}>Partition 2</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    B-tree indexed by Sort Key<br />
                    ├── SK: msg_101 → data<br />
                    ├── SK: msg_102 → data<br />
                    └── SK: msg_103 → data
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Secondary Indexes
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="secondary-indexes">Secondary Indexes</h2>
          <p>
            But what if you need to query your data by an attribute that isn't the partition key? This is where secondary indexes come in. DynamoDB supports two types of secondary indexes:
          </p>
          <ul>
            <li><strong>Global Secondary Index (GSI)</strong> - An index with a partition key and optional sort key that differs from the table's partition key. GSIs allow you to query items based on attributes other than the table's partition key. Since GSIs use a different partition key, the data is stored on entirely different physical partitions from the base table and is replicated separately.</li>
            <li><strong>Local Secondary Index (LSI)</strong> - An index with the same partition key as the table's primary key but a different sort key. LSIs enable range queries and sorting within a partition. Since LSIs use the same partition key as the base table, they are stored on the same physical partitions as the items they're indexing.</li>
          </ul>
          <p>
            Understanding the physical storage difference between GSIs and LSIs is important. GSIs maintain their own separate partitions and replicas, which allows for greater query flexibility but requires additional storage and processing overhead. LSIs, on the other hand, are stored locally with the base table items, making them more efficient for queries within a partition but limiting their flexibility.
          </p>
          <p>
            Practically, in both cases, these indexes are just configured in the AWS console or via the AWS SDK. DynamoDB handles the rest, ensuring that these indexes are maintained and updated as data changes.
          </p>
          <p>
            You'll want to introduce a GSI in situations where you need to query data efficiently by an attribute that isn't the partition key. For example, if you have a chat table with messages for your chat application, then your main table's partition key would likely be chat_id with a sort key on message_id. This way, you can easily get all messages for a given chat sorted by time. But what if you want to show users all the messages they've sent across all chats? Now you'd need a GSI with a partition key of user_id and a sort key of message_id.
          </p>

          {/* GSI Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">Global Secondary Index (GSI)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Base Table</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                  <strong>PK: chat_id</strong> | <strong>SK: message_id</strong><br />
                  - chat_A | msg_001 | user: alice<br />
                  - chat_A | msg_002 | user: bob<br />
                  - chat_B | msg_003 | user: alice
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                  Query: "Get all messages in chat_A" ✓
                </div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>GSI (user_id index)</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                  <strong>PK: user_id</strong> | <strong>SK: message_id</strong><br />
                  - alice | msg_001 | chat: chat_A<br />
                  - alice | msg_003 | chat: chat_B<br />
                  - bob &nbsp;&nbsp;| msg_002 | chat: chat_A
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                  Query: "Get all messages by alice" ✓
                </div>
              </div>
            </div>
          </div>

          <p>
            LSIs are useful when you need to perform range queries or sorting within a partition on a different attribute than the sort key. Going back to our chat application, we already can sort by message_id within a chat group, but what if we want to query messages with the most attachments within a chat group? We could create an LSI on the num_attachments attribute to facilitate those queries and quickly find messages with many attachments. One important caveat: LSIs can only be defined at table creation time and cannot be added or removed later, so you need to plan ahead.
          </p>

          {/* LSI Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">Local Secondary Index (LSI)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Base Table</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                  <strong>PK: chat_id</strong> | <strong>SK: message_id</strong><br />
                  - chat_A | msg_001 | attachments: 3<br />
                  - chat_A | msg_002 | attachments: 0<br />
                  - chat_A | msg_003 | attachments: 7
                </div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>LSI (num_attachments)</strong>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                  <strong>PK: chat_id</strong> | <strong>SK: num_attachments</strong><br />
                  - chat_A | 0 | msg_002<br />
                  - chat_A | 3 | msg_001<br />
                  - chat_A | 7 | msg_003
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                  Same partition key, different sort order
                </div>
              </div>
            </div>
          </div>

          {/* GSI vs LSI Comparison Table */}
          <div style={{ overflowX: 'auto', margin: '24px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', lineHeight: '1.5' }}>
              <thead>
                <tr style={{ background: 'var(--bg-accent)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--primary)' }}>Global Secondary Index (GSI)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: 'var(--accent)' }}>Local Secondary Index (LSI)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Definition</td>
                  <td style={{ padding: '10px 16px' }}>Index with a different partition key than the main table</td>
                  <td style={{ padding: '10px 16px' }}>Index with the same partition key as the main table but a different sort key</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#fafafa' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>When to Use</td>
                  <td style={{ padding: '10px 16px' }}>When you need to query on attributes that are not part of the primary key</td>
                  <td style={{ padding: '10px 16px' }}>When you need additional sort keys for querying within the same partition key</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Size Restrictions</td>
                  <td style={{ padding: '10px 16px' }}>No size restrictions on items in the index</td>
                  <td style={{ padding: '10px 16px' }}>Limited to 10 GB per partition key</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#fafafa' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Throughput</td>
                  <td style={{ padding: '10px 16px' }}>Separate read/write capacity units from the base table</td>
                  <td style={{ padding: '10px 16px' }}>Shares the read/write capacity units of the base table</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Consistency</td>
                  <td style={{ padding: '10px 16px' }}>Eventually consistent only</td>
                  <td style={{ padding: '10px 16px' }}>Supports both eventually consistent (default) and strongly consistent reads</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#fafafa' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Creation</td>
                  <td style={{ padding: '10px 16px' }}>Can be added or removed at any time</td>
                  <td style={{ padding: '10px 16px' }}>Must be defined at table creation time and cannot be removed</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Deletion</td>
                  <td style={{ padding: '10px 16px' }}>Deleting a GSI does not affect the base table items</td>
                  <td style={{ padding: '10px 16px' }}>Deleting an LSI is not possible without deleting the base table</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: '#fafafa' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Maximum Count</td>
                  <td style={{ padding: '10px 16px' }}>Up to 20 GSIs per table</td>
                  <td style={{ padding: '10px 16px' }}>Up to 5 LSIs per table</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Use Case Examples</td>
                  <td style={{ padding: '10px 16px' }}>Use GSI for global search across all partitions, such as searching by email in a user database</td>
                  <td style={{ padding: '10px 16px' }}>Use LSI for local search within partitions, such as finding recent orders within a customer partition</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 id="under-the-hood-indexes">But what is actually happening under the hood?</h3>
          <p>
            Secondary indexes in DynamoDB are automatically maintained by the system. GSIs are implemented as separate internal tables, while LSIs are co-located with the base table:
          </p>
          <p><strong>Global Secondary Indexes (GSIs):</strong></p>
          <ul>
            <li>Each GSI is essentially a separate table with its own partition scheme.</li>
            <li>When an item is added, updated, or deleted in the main table, DynamoDB asynchronously updates the GSI.</li>
            <li>GSIs use the same hash partitioning mechanism as the main table, but with different partition and sort keys.</li>
            <li>This allows for efficient querying on non-primary key attributes across all partitions.</li>
          </ul>
          <p><strong>Local Secondary Indexes (LSIs):</strong></p>
          <ul>
            <li>LSIs are co-located with the main table's partitions, sharing the same partition key.</li>
            <li>They maintain a separate B-tree structure within each partition, indexed on the LSI's sort key.</li>
            <li>Updates to LSIs are done synchronously with the main table updates. LSI reads support both eventually consistent (default) and strongly consistent reads, just like the base table.</li>
          </ul>
          <p><strong>Index Maintenance:</strong></p>
          <ul>
            <li>DynamoDB automatically propagates changes from the main table to all secondary indexes.</li>
            <li>For GSIs, this propagation is asynchronous (eventually consistent). For LSIs, updates happen synchronously with the base table write.</li>
            <li>The system manages the additional write capacity required for index updates.</li>
          </ul>
          <p><strong>Query Processing:</strong></p>
          <ul>
            <li>When a query uses a secondary index, DynamoDB routes the query to the appropriate index table (for GSIs) or index structure (for LSIs).</li>
            <li>It then uses the index's partition and sort key mechanics to efficiently retrieve the requested data.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Accessing Data
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="accessing-data">Accessing Data</h2>
          <p>
            We've already touched on this a bit, but let's dive deeper into how you can access data in DynamoDB. There are two primary ways to access data in DynamoDB: Scan and Query operations.
          </p>
          <ul>
            <li><strong>Scan Operation</strong> - Reads every item in a table or index and returns the results in a paginated response. Scans are useful when you need to read all items in a table or index, but they are inefficient for large datasets due to the need to read every item and should be avoided if possible.</li>
            <li><strong>Query Operation</strong> - Retrieves items based on the primary key or secondary index key attributes. Queries are more efficient than scans, as they only read items that match the specified key conditions. Queries can also be used to perform range queries on the sort key.</li>
          </ul>
          <p>
            Unlike traditional SQL databases, DynamoDB's primary interface is through the AWS SDK or the AWS console rather than a standalone query language. That said, DynamoDB does support PartiQL, a SQL-compatible query language that lets you use familiar SELECT, INSERT, UPDATE, and DELETE syntax. Under the hood, PartiQL operations translate to the same DynamoDB operations, so it's a convenience layer rather than a fundamentally different capability. Let's consider a simple example of querying from a user table.
          </p>
          <p>In SQL, you'd write:</p>
          <CodeBlock language="sql">{`SELECT * FROM users WHERE user_id = 101`}</CodeBlock>
          <p>But in DynamoDB, this would be translated to a query operation like this:</p>
          <CodeBlock language="javascript">{`const params = {
  TableName: 'users',
  KeyConditionExpression: 'user_id = :id',
  ExpressionAttributeValues: {
    ':id': 101
  }
};

dynamodb.query(params, (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});`}</CodeBlock>

          <p>To perform a scan operation, you'd use the scan method instead of query.</p>
          <p>SQL scan equivalent:</p>
          <CodeBlock language="sql">{`SELECT * FROM users`}</CodeBlock>
          <p>DynamoDB scan operation:</p>
          <CodeBlock language="javascript">{`const params = {
  TableName: 'users'
};

dynamodb.scan(params, (err, data) => {
  if (err) console.error(err);
  else console.log(data);
});`}</CodeBlock>

          <p>
            When working with Dynamo, you typically want to avoid expensive scan operations where ever possible. This is where careful data modeling comes into play. By choosing the right partition key and sort key, you can ensure that your queries are efficient and performant.
          </p>
          <p>
            When querying DynamoDB, you read the entire item (record) by default. While DynamoDB does support ProjectionExpression to return only specific attributes, this only reduces network bandwidth -- the full item is still read from storage and you're still charged the full RCU cost based on the item's total size. This is different from SQL column selection. For large items, you'll want to normalize your data appropriately to avoid reading more than necessary.
          </p>
          <p>
            For example, consider a scenario where you are designing Yelp and need to store business details and reviews. You might have a business table with attributes like business_id, name, address, city, state, zip, category, and subcategory. While you could store the list of reviews in the business table, it would mean that every time you want to read basic business information you'd have to read the entire business record, even if you only need the business name and address. Instead, you'd be wise to pull the reviews into a separate table and query that table based on the business ID.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — CAP Theorem
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="cap-theorem">CAP Theorem</h2>
          <p>
            You'll typically make some early decisions about consistency and availability during the non-functional requirements phase of your interview. As such, it's important that you choose a database that aligns with those requirements.
          </p>
          <p>
            Most candidates I work with choose DynamoDB when they need high availability and scalability. This isn't wrong, but just like the traditional SQL vs NoSQL debate, it's outdated.
          </p>
          <p>
            DynamoDB supports two consistency models for read operations: eventual consistency and strong consistency. Importantly, this is not a table-level configuration -- you choose the consistency model on each individual read request by setting ConsistentRead=true in your GetItem, Query, or Scan calls.
          </p>
          <ul>
            <li><strong>Eventual Consistency (Default)</strong> - Every read is eventually consistent unless you explicitly request otherwise. This provides the highest availability and lowest latency, but you might not see the most recent write immediately. DynamoDB generally behaves as an AP system with BASE properties.</li>
            <li><strong>Strong Consistency</strong> - When you set ConsistentRead=true, DynamoDB ensures the read reflects all successful writes that occurred before the read. This costs twice the read capacity (1 RCU per 4KB instead of 0.5) and may have slightly higher latency, but guarantees you see the latest data.</li>
          </ul>
          <p>
            This per-request flexibility means you can use DynamoDB in scenarios that require strong consistency (like a booking system) while still defaulting to eventual consistency for read-heavy, latency-sensitive paths. DynamoDB also supports ACID transactions via TransactWriteItems and TransactGetItems, which provide serializable isolation across up to 100 items spanning multiple tables.
          </p>

          <Callout type="info" title="Strong Consistent Reads & GSIs">
            <p style={{ margin: 0 }}>
              Strong consistent reads are only supported on the base table and Local Secondary Indexes (LSIs). Global Secondary Indexes (GSIs) only support eventually consistent reads, so keep this in mind when designing access patterns that require strong consistency.
            </p>
          </Callout>

          <h3 id="under-the-hood-consistency">But what is actually happening under the hood?</h3>
          <p>
            DynamoDB's consistency models are implemented through its distributed architecture and replication mechanisms:
          </p>
          <p><strong>Eventually Consistent Reads (Default):</strong></p>
          <ul>
            <li>Reads can be served by any of the three replicas in the partition's replication group</li>
            <li>Since the leader replicates writes to followers asynchronously (after quorum acknowledgment), a follower might not have the very latest write yet</li>
            <li>Consumes less read capacity (0.5 RCU per 4KB) and provides lower latency</li>
          </ul>
          <p><strong>Strongly Consistent Reads:</strong></p>
          <ul>
            <li>The read request is routed directly to the leader node for the partition</li>
            <li>Since all writes go through the leader first, it always has the most current data</li>
            <li>Consumes more read capacity (1 RCU per 4KB) and may have higher latency</li>
            <li>Not supported on Global Secondary Indexes (GSIs)</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Architecture and Scalability
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="architecture-and-scalability">Architecture and Scalability</h2>

          <h3 id="scalability">Scalability</h3>
          <p>
            DynamoDB scales through auto-sharding and load balancing. When a partition reaches capacity (in size or throughput), DynamoDB automatically splits it and redistributes data. Hash-based partitioning ensures even distribution across nodes, balancing traffic and load.
          </p>
          <p>
            AWS's global infrastructure enhances this scalability. Global Tables allow real-time replication across regions, enabling local read/write operations worldwide. This reduces latency and improves user experience. DynamoDB also integrates across multiple Availability Zones in each region, so that the redundancy ensures continuous service and data durability.
          </p>
          <p>
            Choosing the right regions and zones is important because it optimizes performance and compliance, considering user proximity and regulations. Data locality, in general, is key for reducing latency and improving throughput.
          </p>
          <p>
            When designing global applications in your interview, simply mentioning Global Tables for cross-region replication is often sufficient.
          </p>

          <h3 id="fault-tolerance-and-availability">Fault Tolerance and Availability</h3>
          <p>
            DynamoDB is designed to provide high availability and fault tolerance through its distributed architecture and data replication mechanisms. The service automatically replicates data across multiple Availability Zones within a region, so that data is durable and accessible even in the event of hardware failures or network disruptions.
          </p>
          <p>
            DynamoDB automatically replicates your data across three Availability Zones within a region -- this is not user-configurable. Each partition maintains three replicas (one leader and two followers) managed entirely by AWS. For cross-region replication, you can enable Global Tables to add replicas in additional AWS regions.
          </p>
          <p>
            Under the hood, each partition uses Multi-Paxos consensus with a leader-based replication group of three nodes. The leader handles all writes: it generates a write-ahead log (WAL) entry and sends it to its peers, and the write is acknowledged once a quorum (2 of 3) persists the log record. For strongly consistent reads, DynamoDB routes the request directly to the leader, which always has the most up-to-date data. For eventually consistent reads, any of the three replicas can serve the request, which provides lower latency but might return slightly stale data.
          </p>

          {/* Replication Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">DynamoDB Partition Replication (Multi-Paxos)</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--client">Client Write</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div className="diagram-box" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>Request Router</div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="diagram-box" style={{ background: '#dcfce7', color: '#166534', borderColor: '#bbf7d0', fontWeight: 'bold' }}>
                    Leader (AZ-1)
                    <div style={{ fontSize: '0.7rem', fontWeight: 'normal', marginTop: '2px' }}>Generates WAL entry</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="diagram-box diagram-box--server" style={{ fontSize: '0.75rem' }}>
                      Follower (AZ-2)
                    </div>
                    <div className="diagram-box diagram-box--server" style={{ fontSize: '0.75rem' }}>
                      Follower (AZ-3)
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--bg-accent)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', width: '100%', maxWidth: '580px', textAlign: 'center' }}>
                <strong>Quorum Write:</strong> Write acknowledged once 2 of 3 replicas persist the WAL record. Leader replicates to followers asynchronously after quorum.
              </div>
            </div>
          </div>

          <h3 id="security">Security</h3>
          <p>
            Data is encrypted at rest by default in DynamoDB, so your data is secure even when it's not being accessed. DynamoDB also enforces TLS for all API calls, so data in transit is always encrypted -- there's no separate configuration needed.
          </p>
          <p>
            DynamoDB integrates with AWS Identity and Access Management (IAM) to provide fine-grained access control over your data. You can create IAM policies that specify who can access your data and what actions they can perform. This allows you to restrict access to your data to only those who need it.
          </p>
          <p>
            Additionally, you can use Virtual Private Cloud (VPC) endpoints to securely access DynamoDB from within your VPC without exposing your data to the public internet. This provides an extra layer of security by ensuring that your data is only accessible from within your VPC.
          </p>
          <p>
            In an interview, when working with sensitive user data it may be worth mentioning that you know DynamoDB encrypts data at rest by default and enforces encryption in transit via TLS. Beyond this, everything else is probably overkill.
          </p>

          <h3 id="pricing-model">Pricing Model</h3>
          <p>
            Pricing might seem like something totally irrelevant to an interview, but bear with me, understanding the pricing model introduces clear constraints on your architecture.
          </p>
          <p>
            There are two pricing models for DynamoDB: on-demand and provisioned capacity. On-demand pricing charges per request, making it suitable for unpredictable workloads. Provisioned capacity, on the other hand, requires users to specify read and write capacity units, which are billed hourly. This model is more cost-effective for predictable workloads but may result in underutilized capacity during low-traffic periods.
          </p>
          <p>
            Pricing is based on, what Amazon calls, read and write capacity units. These units are a measure of the throughput you need for your DynamoDB table. You can think of them as a measure of how much data you can read or write per second.
          </p>
          <p>
            A single read capacity unit allows you to read up to 4KB of data per second. A single write capacity unit allows you to write up to 1KB of data per second.
          </p>

          {/* Pricing Table */}
          <div style={{ overflowX: 'auto', margin: '24px 0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', lineHeight: '1.5' }}>
              <thead>
                <tr style={{ background: 'var(--bg-accent)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Feature</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Cost</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Read Capacity Unit (RCU)</td>
                  <td style={{ padding: '10px 16px' }}>$1.12 per million reads (4KB each)</td>
                  <td style={{ padding: '10px 16px' }}>Provides one strongly consistent read per second for items up to 4KB, or two eventually consistent reads per second.</td>
                </tr>
                <tr>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>Write Capacity Unit (WCU)</td>
                  <td style={{ padding: '10px 16px' }}>$5.62 per million writes (1KB each)</td>
                  <td style={{ padding: '10px 16px' }}>Provides one write per second for items up to 1KB.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            While cost itself is not particularly interesting in an interview, it's useful to have a high level understanding of the numbers. Each DynamoDB partition supports up to 3,000 read capacity units and 1,000 write capacity units. This means a single partition can handle 12MB of reads per second (3,000 × 4KB) and 1MB of writes per second (1,000 × 1KB). DynamoDB handles sharding and auto-scaling automatically, but these numbers are useful for back-of-the-envelope calculations.
          </p>
          <p>
            For example, if you were planning on storing YouTube views in DynamoDB, each write (regardless of how small) consumes at least 1 WCU since DynamoDB rounds up to the nearest 1KB. With 1,000 WCU per partition, a single partition supports about 1,000 writes per second. If you expect 10,000,000 views per second, you'd need roughly 10,000 partitions. Using provisioned capacity pricing (~$0.00065 per WCU-hour in us-east-1), that's 10,000,000 WCU × $0.00065/hour × 24 hours ≈ $156,000 per day. On-demand pricing would be significantly higher. These numbers can help you gut check whether your application will be able to handle the expected load without incurring unrealistic costs.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Advanced Features
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="advanced-features">Advanced Features</h2>
          
          <h3 id="dax">DAX (DynamoDB Accelerator)</h3>
          <p>
            Fun fact, DynamoDB has a purpose-built, in-memory cache called DynamoDB Accelerator (DAX). So there may be no need to introduce additional services (Redis, Memcached) into your architecture.
          </p>
          <p>
            DAX is a caching service designed to enhance DynamoDB performance by delivering microsecond response times for read-heavy workloads. Using DAX requires swapping your DynamoDB client for the DAX client SDK (available for Java, .NET, Node.js, Python, Go) -- the API is compatible, so the changes are minimal, but it's not completely transparent.
          </p>
          <p>
            DAX operates as both a read-through and write-through cache: it caches read results and delivers them directly to applications, and writes data to both the cache and DynamoDB. An important nuance is that DAX only auto-invalidates cached items for writes that go through DAX itself. If you update DynamoDB directly (bypassing DAX), those cached entries can remain stale until they expire via TTL or eviction.
          </p>

          {/* DAX Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">DAX (DynamoDB Accelerator) Architecture</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--client">Application</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>Read/Write</div>
                  <div style={{ color: 'var(--primary)' }}>➔</div>
                </div>
                <div className="diagram-box" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fcd34d', minWidth: '200px' }}>
                  <strong>DAX Cluster</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>
                    Item Cache + Query Cache<br />
                    Microsecond latency
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>Cache Miss</div>
                  <div style={{ color: 'var(--accent)' }}>➔</div>
                </div>
                <div className="diagram-box diagram-box--server">
                  <strong>DynamoDB</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Single-digit ms latency</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '500px' }}>
                <div style={{ background: '#f0fdf4', padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.75rem', textAlign: 'center' }}>
                  <strong>Item Cache</strong><br />
                  GetItem / BatchGetItem results
                </div>
                <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.75rem', textAlign: 'center' }}>
                  <strong>Query Cache</strong><br />
                  Query / Scan results
                </div>
              </div>
            </div>
          </div>

          <p>
            DAX maintains two caches: an item cache (for GetItem/BatchGetItem results) and a query cache (for Query and Scan results). Both are always active -- there's no configuration to choose one over the other. One important caveat: DAX does not cache strongly consistent reads. When you request a strongly consistent read through DAX, it passes the request directly to DynamoDB and returns the result without caching it.
          </p>

          <h3 id="streams">Streams</h3>
          <p>
            Dynamo also has built-in support for Change Data Capture (CDC) through DynamoDB Streams. Streams capture changes to items in a table and make them available for processing in real-time. Any change event in a table, such as an insert, update, or delete operation, is recorded in the stream as a stream record to be consumed by downstream applications.
          </p>
          <p>
            This can be used for a variety of use cases, such as triggering Lambda functions in response to changes in the database, maintaining a replica of the database in another system, or building real-time analytics applications.
          </p>
          <ul>
            <li><strong>Consistency with Elasticsearch</strong> - DynamoDB Streams can be used to keep an Elasticsearch index in sync with a DynamoDB table. This is useful for building search functionality on top of DynamoDB data.</li>
            <li><strong>Real-time Analytics</strong> - You can enable Kinesis Data Streams on your DynamoDB table, then pipe the change data into Kinesis Data Firehose to load into S3, Redshift, or OpenSearch for real-time analytics. (Note: Firehose can't read DynamoDB Streams directly -- you need Kinesis Data Streams or a Lambda function as the intermediary.)</li>
            <li><strong>Change Notifications</strong> - You can use DynamoDB Streams to trigger Lambda functions in response to changes in the database. This can be useful for sending notifications, updating caches, or performing other actions in response to data changes.</li>
          </ul>

          {/* Streams Diagram */}
          <div className="diagram-container">
            <div className="diagram-title">DynamoDB Streams — Change Data Capture (CDC)</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--server" style={{ minWidth: '160px' }}>
                  <strong>DynamoDB Table</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Insert / Update / Delete</div>
                </div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div className="diagram-box" style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fcd34d', minWidth: '160px' }}>
                  <strong>DynamoDB Stream</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Ordered change log</div>
                </div>
                <div style={{ color: 'var(--primary)' }}>➔</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '0.75rem' }}>
                    AWS Lambda → Elasticsearch sync
                  </div>
                  <div style={{ background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bfdbfe', fontSize: '0.75rem' }}>
                    Kinesis → S3/Redshift analytics
                  </div>
                  <div style={{ background: '#fef3c7', padding: '8px 12px', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '0.75rem' }}>
                    Lambda → Notifications/Cache
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 8 — DynamoDB in an Interview
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="dynamodb-in-an-interview">DynamoDB in an Interview</h2>
          
          <h3 id="when-to-use-it">When to use It</h3>
          <p>
            In interviews, you can often justify using DynamoDB for almost any persistence layer needs. It's highly scalable, durable, supports transactions, and offers single-digit millisecond latencies (or microsecond latencies with DAX). Additional features like DAX for caching and DynamoDB Streams for cross-store consistency make it even more powerful. So if your interviewer allows, its probably a great option.
          </p>
          <p>
            However, it's important to know when not to use DynamoDB because of its specific downsides.
          </p>

          <h3 id="knowing-its-limitations">Knowing its limitations</h3>
          <p>
            There are a few reasons why you may opt for a different database (beyond just generally having more familiarity with another technology):
          </p>
          <ul>
            <li><strong>Cost Efficiency:</strong> DynamoDB's pricing model is based on read and write operations plus stored data, which can get expensive with high-volume workloads. If you need hundreds of thousands of writes per second, the cost might outweigh the benefits.</li>
            <li><strong>Complex Query Patterns:</strong> If your system requires complex queries, such as those needing joins or ad-hoc aggregations, DynamoDB might not cut it. DynamoDB does support transactions across multiple tables (up to 100 items per transaction), but it lacks the flexible querying capabilities of SQL databases.</li>
            <li><strong>Data Modeling Constraints:</strong> DynamoDB demands careful data modeling to perform well, optimized for key-value and document structures. If you find yourself frequently using Global Secondary Indexes (GSIs) and Local Secondary Indexes (LSIs), a relational database like PostgreSQL might be a better fit.</li>
            <li><strong>Vendor Lock-in:</strong> Choosing DynamoDB means locking into AWS. Many interviewers will want you to stay vendor-neutral, so you may need to consider open-source alternatives to avoid being tied down.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 9 — Summary
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="summary">Summary</h2>
          <p>
            There we have it. DynamoDB is versatile, powerful, and a joy to work with. In an interview, it's a solid choice for most use cases, but you'll want to be aware of its limitations and have a solid understanding of how it works, including how to choose the right data model, partition key, sort key, secondary indexes, and know when to enable advanced features like DAX and Streams. Remember that DynamoDB supports transactions (including across multiple tables), so the old "NoSQL means no transactions" criticism doesn't hold anymore.
          </p>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Fully Managed & Scalable:</strong> DynamoDB handles all operational overhead — provisioning, scaling, patching — and automatically scales to handle massive data and traffic.</li>
              <li><strong>Flexible Data Model:</strong> Schema-less design with tables, items, and attributes. Choose partition keys and sort keys carefully to optimize for your access patterns.</li>
              <li><strong>Secondary Indexes:</strong> Use GSIs for cross-partition queries and LSIs for alternative sort orders within the same partition. Understand their trade-offs in consistency, throughput, and storage.</li>
              <li><strong>Per-Request Consistency:</strong> Choose eventual or strong consistency on each read. Supports ACID transactions across up to 100 items and multiple tables.</li>
              <li><strong>Advanced Features:</strong> DAX provides microsecond caching, DynamoDB Streams enables CDC for real-time processing and cross-store consistency.</li>
              <li><strong>Know the Limitations:</strong> Cost at high volume, no complex SQL queries/joins, careful data modeling required, and vendor lock-in to AWS.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#cassandra" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Cassandra</div>
            </div>
          </a>
          <a href="#postgresql" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">PostgreSQL</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
