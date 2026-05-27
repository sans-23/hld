import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function CassandraContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Cassandra</span>
          </div>
          <h1>Cassandra</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about how you can use Cassandra to solve a large number of problems in System Design.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              22 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              NoSQL & Wide-Column
            </span>
            <span className="difficulty-badge difficulty-badge--advanced">Advanced</span>
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
            Databases are a fundamental and core aspect of system design, and one of the most versatile / popular databases to have in your toolbox is Cassandra. Cassandra was originally built by Facebook to support its rapidly scaling inbox search feature. Since then, Cassandra has been adopted by countless companies to rapidly scale data storage, throughput, and readback. From Discord (explored later in this post), to Netflix, to Apple, to Bloomberg, Cassandra is a NoSQL database that is here to stay, used by a wide array of firms for a large set of use-cases.
          </p>
          <p>
            Apache Cassandra is an open-source, distributed NoSQL database. It implements a partitioned wide-column storage model with eventually consistent semantics. It is a distributed database that runs in a cluster and can horizontally scale via commodity hardware. It combines elements of Dynamo (see our write-up on DynamoDB) and Bigtable to handle massive data footprints, query volume, and flexible storage requirements.
          </p>
          <p>
            In this deep dive, we'll break down the features of Cassandra that make it attractive as a database, especially for system design. We'll discuss the most important internals of Cassandra to demystify how it provides said features. Finally, we'll discuss when and how to use Cassandra. Let's go!
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Cassandra Basics
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="cassandra-basics">Cassandra Basics</h2>
          <p>
            Let's start by understanding a bit about the basics.
          </p>

          <h3 id="data-model">Data Model</h3>
          <p>
            Cassandra has a set of basic data definitions that define how you store and interact with data.
          </p>
          <ul>
            <li><strong>Keyspace</strong> - The top-level organizational unit in Cassandra, equivalent to a "database" in relational systems like Postgres or MySQL. A keyspace defines replication strategies (discussed later) for managing data redundancy and availability. It also owns any user-defined-types (UDTs) you might create.</li>
            <li><strong>Table</strong> - Lives within a keyspace and organizes data into rows. Each table has a schema that defines its columns and primary key structure.</li>
            <li><strong>Row</strong> - A single record in a table, identified by a primary key. Each row stores values across multiple columns.</li>
            <li><strong>Column</strong> - The actual data storage unit. A column has a name, a type, and a value for that specific row. Not all columns need to be specified per row in a Cassandra table. Cassandra is a wide-column database so the specified columns can vary per row in a table, making Cassandra more flexible than something like a relational database, which requires an entry for every column per row (even if that entry is NULL). Additionally, every column has timestamp metadata associated with it, denoting when it was written. When a column has a write conflict between replicas, it is resolved via "last write wins".</li>
          </ul>

          <p>
            At the most basic level, you can liken Cassandra's data structures to a large JSON.
          </p>
          <CodeBlock language="json">{`{
  "keyspace1": {
    "table1": {
      "row1": {
        "col1": 1,
        "col2": "2"
      },
      "row2": {
        "col1": 10,
        "col3": 3.0
      },
      "row3": {
        "col4": {
          "company": "Hello Interview",
          "city": "Seattle",
          "state": "WA"
        }
      }
    }
  }
}`}</CodeBlock>
          <p>
            Cassandra columns support a plethora of types, including user-defined types and JSON values. This makes Cassandra very flexible as a data store for both flat and nested data.
          </p>

          <h3 id="primary-key">Primary Key</h3>
          <p>
            One of the most important constructs in Cassandra is the "primary key" of a table. Every row is represented uniquely by a primary key. A primary key consists of one or more partition keys and may include clustering keys. Let's break down what these terms mean.
          </p>
          <ul>
            <li><strong>Partition Key</strong> - One or more columns that are used to determine what partition the row is in. We'll discuss partitioning of data later in this deep-dive.</li>
            <li><strong>Clustering Key</strong> - Zero or more columns that are used to determine the sorted order of rows in a table. Data ordering is important depending on one's data modeling needs, so Cassandra gives users control over this via the clustering keys.</li>
          </ul>
          <p>
            When you create a table in Cassandra via the Cassandra Query Language (CQL) dialect, you specify the primary key as part of defining the schema. Below are a few examples of different primary keys with comments inlined:
          </p>
          <CodeBlock language="sql">{`-- Primary key with partition key a, no clustering keys
CREATE TABLE t (a text, b text, c text, PRIMARY KEY (a));

-- Primary key with partition key a, clustering key b ascending
CREATE TABLE t (a text, b text, c text PRIMARY KEY ((a), b))
WITH CLUSTERING ORDER BY (b ASC);

-- Primary key with composite partition key a + b, clustering key c
CREATE TABLE t (a text, b text, c text, d text, PRIMARY KEY ((a, b), c));

-- Primary key with partition key a, clustering keys b + c
CREATE TABLE t (a text, b text, c text, d text, PRIMARY KEY ((a), b, c));

-- Primary key with partition key a, clustering keys b + c (alternative syntax)
CREATE TABLE t (a text, b text, c text, d text, PRIMARY KEY (a, b, c));`}</CodeBlock>
          <p>
            The primary key concept and its subcomponents might remind you of DynamoDB's primary key definition. This concept is basically shared 1:1 between the 2 databases.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Key Concepts
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="key-concepts">Key Concepts</h2>
          <p>
            When introducing Cassandra in a system design interview, you're going to want to know more than just how to use it. You'll want to be able to explain how it works in case your interviewer asks pointed questions, or you might want to deep dive into data storage specifics, scalability, query efficiency, etc., all of which deeply affect your design. In this section, we dive into the essential details of Cassandra to give you this context.
          </p>

          <h3 id="partitioning">Partitioning</h3>
          <p>
            One of the most fundamental aspects of Cassandra is its partitioning scheme for data. Cassandra's partitioning techniques are extremely robust and worth understanding generally for system design in case you want to employ them in other areas of your designs (caching, load balancing, etc.).
          </p>
          <p>
            Cassandra achieves horizontal scalability by partitioning data across many nodes in its cluster. In order to partition data successfully, Cassandra makes use of consistent hashing. Consistent hashing is a fundamental technique used in distributed systems to partition data / load across machines in a way that prioritizes evenness of distribution while minimizing re-mapping of data if a node enters or leaves the system.
          </p>
          <p>
            In a traditional hashing scheme, a number of nodes is chosen and a node is determined to store a value based on the following calculation: <code>hash(value) % num_nodes</code>. This certainly allocates values to nodes, but there's 2 problems:
          </p>
          <ol>
            <li>If the number of buckets changes (node added or removed), then a lot of values will be assigned new nodes. In a distributed system like a database, this would mean that data would have to move between nodes in excess.</li>
            <li>If you're unlucky with your hashing scheme, there might be a lot of values that get hashed to the same node, resulting in uneven load between nodes.</li>
          </ol>
          <p>
            To improve on this design, consistent hashing prefers a different approach.
          </p>
          <p>
            Rather than hashing a value and running a modulo to select a node, consistent hashing hashes a value to a range of integers that are visualized on a ring. This ring has nodes mapping to specific values. When a value is hashed, it is hashed to an integer. The ring is then walked clockwise to find the first value corresponding to a node. The value is then stored on that node.
          </p>
          <p>
            This design prevents excess re-mapping of values if a node enters or leaves the system because it will affect one adjacent node. If a node enters, it re-maps some values from the node ahead of it when moving clockwise on the ring. If a node exits, values from the node exiting re-map to the node ahead of it when moving clockwise on the ring.
          </p>
          <p>
            However, this design doesn't address the issue of uneven load between nodes. To address this, Cassandra opts to map multiple nodes on the ring to physical nodes in the distributed system. The nodes on the ring are called vnodes (a.k.a. virtual nodes) are owned by physical nodes. This distributes load over the cluster more evenly. It also allows for the system to take advantage of the resources of different physical nodes; some physical nodes might be bigger machines with more resources, so they can be responsible for more vnodes. Below is how the cluster might look, with values, called "tokens" (t1, t2, etc.), represented on the ring, vnodes mapped to those tokens, and different physical nodes represented by the colors of the vnodes.
          </p>

          {/* Diagram: Consistent Hashing */}
          <div className="diagram-container">
            <div className="diagram-title">Consistent Hashing Ring & Virtual Nodes</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <svg width="240" height="240" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="4,4" />
                
                {/* Physical Node 1 (Green) vnodes */}
                <circle cx="50" cy="10" r="4.5" fill="var(--success)" stroke="white" strokeWidth="1.5" />
                <text x="50" y="4" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 1</text>
                
                <circle cx="85" cy="70" r="4.5" fill="var(--success)" stroke="white" strokeWidth="1.5" />
                <text x="94" y="72" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 1</text>

                {/* Physical Node 2 (Blue) vnodes */}
                <circle cx="90" cy="35" r="4.5" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                <text x="99" y="37" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 2</text>

                <circle cx="15" cy="65" r="4.5" fill="var(--primary)" stroke="white" strokeWidth="1.5" />
                <text x="6" y="67" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 2</text>

                {/* Physical Node 3 (Red) vnodes */}
                <circle cx="50" cy="90" r="4.5" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
                <text x="50" y="99" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 3</text>

                <circle cx="15" cy="35" r="4.5" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
                <text x="6" y="37" fontSize="4.5" textAnchor="middle" fontWeight="bold">Node 3</text>

                {/* Hashed Key Routing */}
                <circle cx="65" cy="13" r="2.5" fill="black" />
                <path d="M 65 13 Q 80 18 86 31" fill="none" stroke="black" strokeWidth="1" markerEnd="url(#arrow)" strokeDasharray="2,2" />
                <text x="75" y="10" fontSize="4" textAnchor="middle" fontStyle="italic">Hash(Key) routes clockwise</text>
              </svg>
            </div>
          </div>

          <h3 id="replication">Replication</h3>
          <p>
            In Cassandra, partitions of data are replicated to nodes on the ring, enabling it to skew extremely available for system designs that rely on that feature. Keyspaces have replication configurations specified and this affects the way Cassandra replicates data.
          </p>
          <p>
            At a high level, Cassandra chooses what nodes to replicate data to by scanning clockwise from the vnode that corresponds to hashed value in a consistent hashing scheme. For example, if Cassandra is trying to replicate data to 3 nodes, it will hash a value to a node and scan clockwise to find 2 additional vnodes to serve as replicas. Cassandra skips any vnodes that are on the same physical node as vnodes already in the replica set so that several replicas aren't down when a single physical node goes down.
          </p>
          <p>
            Cassandra has two different "replication strategies" it can employ: NetworkTopologyStrategy and SimpleStrategy.
          </p>
          <ul>
            <li><strong>NetworkTopologyStrategy</strong> is the strategy recommended for production and is data center / rack aware so that data replicas are stored across potentially many data centers in case of an outage. It also allows for replicas to be stored on distinct racks in case a rack in a data center goes down. The main goal with this configuration is to establish enough physical separate of replicas to avoid many replicas being affected by a real world outage / incident.</li>
            <li><strong>SimpleStrategy</strong> is a simpler strategy, merely determining replicas via scanning clockwise (this is the one we discussed above). It is useful for simple deployments and testing.</li>
          </ul>
          <p>
            Below is Cassandra CQL for specifying different replication strategy configurations for a keyspace:
          </p>
          <CodeBlock language="sql">{`-- 3 replicas
ALTER KEYSPACE hello_interview WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 3 };

-- 3 replicas in data center 1, 2 replicas in data center 2
ALTER KEYSPACE hello_interview WITH REPLICATION = {'class' : 'NetworkTopologyStrategy', 'dc1' : 3, 'dc2' : 2};`}</CodeBlock>

          <h3 id="consistency">Consistency</h3>
          <p>
            Like any distributed system, Cassandra is subject to the CAP Theorem. Cassandra gives users flexibility over consistency settings for reads / writes, which allows Cassandra users to "tune" their consistency vs. availability trade-off. Given that every system design involves some degree of CAP theorem analysis / trade-off, it's important to understand the levers you have to pull with Cassandra.
          </p>
          <p>
            Cassandra does not offer transaction support or any notion of ACID gurantees. It only supports atomic and isolated writes at the row level in a partition, but that's about it. You can read more about this here.
          </p>
          <p>
            Cassandra allows you to choose from a list of "consistency levels" for reads and writes, which are required node response numbers for a write or a read to succeed. These enforce different consistency vs. availability behavior depending on the combination used. These range from ONE, where a single replica needs to respond, to ALL, where all replicas must respond. You can read more about the different consistency levels here.
          </p>
          <p>
            One notable consistency level to understand is QUORUM. QUORUM requires a majority (n/2 + 1) of replicas to respond. Applying QUORUM to both reads and writes guarantees that writes are visible to reads because at least one overlapping node is guaranteed to participate in both a write and a read. To illustrate this, let's assume a set of 3 nodes. 3/2 + 1 = 2, so 2 of 3 nodes need to be written to and read from in order for writes and reads to succeed. This means that a write will always be seen by a read because at least 1 of those 2 nodes will have also seen the write.
          </p>

          {/* Diagram: QUORUM */}
          <div className="diagram-container">
            <div className="diagram-title">Quorum Read/Write Intersection</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <strong style={{ color: 'var(--primary)' }}>Write Set (W=2)</strong>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  <div className="diagram-box diagram-box--server" style={{ background: '#e0f2fe', borderColor: '#bae6fd' }}>Node 1</div>
                  <div className="diagram-box diagram-box--server" style={{ background: '#e0f2fe', borderColor: '#bae6fd' }}>Node 2</div>
                </div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <strong style={{ color: 'var(--accent)' }}>Read Set (R=2)</strong>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '12px' }}>
                  <div className="diagram-box diagram-box--server" style={{ background: '#fee2e2', borderColor: '#fecaca' }}>Node 2</div>
                  <div className="diagram-box diagram-box--server" style={{ background: '#fee2e2', borderColor: '#fecaca' }}>Node 3</div>
                </div>
              </div>
            </div>
            <div style={{ background: 'var(--bg-accent)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', marginTop: '16px', textAlign: 'center' }}>
              <strong>Intersection:</strong> <code>Node 2</code> participated in both the write and the read, ensuring the read sees the latest write data.
            </div>
          </div>

          <p>
            Typically, Cassandra aims for "eventual consistency" for all consistency levels, where all replicas have the latest data assuming enough time passes.
          </p>

          <h3 id="query-routing">Query Routing</h3>
          <p>
            Any Cassandra node can service a query from the client application because all nodes in Cassandra can assume the role of a query "coordinator". Nodes in Cassandra each know about other alive nodes in the cluster. They share cluster information via a protocol called "gossip" (discussed later). Nodes in Cassandra also are able to determine where data lives in the cluster via performing consistent hashing calculations and by knowing the replication strategy / consistency level configured for the data. When a client issues a query, it selects a node who becomes the coordinator, and the coordinator issues queries to nodes that store the data (a series of replicas).
          </p>

          <h3 id="storage-model">Storage Model</h3>
          <p>
            Cassandra's storage model is important to understand because it is core to one of its strengths for system design: write throughput. Cassandra leverages a data structure called a Log Structured Merge Tree (LSM tree) index to achieve this speed. The LSM tree is used in place of a B-tree, which is the index of choice for most databases (relational DBs, DynamoDB).
          </p>
          <p>
            Before diving into the details, it's important to clarify how Cassandra handles writes vs. other databases. Cassandra opts for an approach that favors write speed over read speed. Every create / update / delete is a new entry (with some exceptions). Cassandra uses the ordering of these updates to determine the "state" of a row. For example, if a row is created and then it is updated later, Cassandra will understand the state of the row by looking at the creation and then the update vs. looking at just a single row. The same goes for deletes, which can be thought of as "removal updates". Cassandra writes a "tombstone" entry for row deletions. The LSM tree enables Cassandra to efficiently understand the state of a row, while writing data to the database as almost entirely "append on" writes.
          </p>
          <p>
            The 3 constructs core to the LSM tree index are:
          </p>
          <ul>
            <li><strong>Commit Log</strong> - This basically is a write-ahead-log to ensure durability of writes for Cassandra nodes.</li>
            <li><strong>Memtable</strong> - An in-memory, sorted data structure that stores write data. It is sorted by primary key of each row.</li>
            <li><strong>SSTable</strong> - A.k.a. "Sorted String Table." Immutable file on disk containing data that was flushed from a previous Memtable.</li>
          </ul>
          <p>
            With all these constructs working together, writes look like this:
          </p>
          <ol>
            <li>A write is issued for a node.</li>
            <li>That write is written to the commit log so it doesn't get lost if the node goes down while the write is being processed or if the data is only in the Memtable when the node goes down.</li>
            <li>The write is written to the Memtable.</li>
            <li>Eventually, the Memtable is flushed to disk as an immutable SSTable after some threshold size is hit or some period of time elapses.</li>
            <li>When a Memtable is flushed, any commit log messages are removed that correspond to that Memtable, to save space. These are superfluous now that the Memtable is on disk as an SSTable that is immutable.</li>
          </ol>
          <p>
            The below diagram illustrates the above steps:
          </p>

          {/* Diagram: Storage Model */}
          <div className="diagram-container">
            <div className="diagram-title">Cassandra Storage & LSM Tree Write Path</div>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
              <div className="diagram-box diagram-box--client">Incoming Write</div>
              <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="diagram-box diagram-box--server" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
                  <strong>Commit Log</strong> (Disk)<br/>
                  <small>Write-Ahead-Log for durability</small>
                </div>
                <div className="diagram-box diagram-box--server" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                  <strong>Memtable</strong> (Memory)<br/>
                  <small>Sorted data structure</small>
                </div>
              </div>
              <div style={{ color: 'var(--primary)', fontSize: '0.9rem', fontStyle: 'italic', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                Flushes to disk
                <span>➔</span>
              </div>
              <div className="diagram-box diagram-box--server" style={{ background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e3a8a' }}>
                <strong>SSTable</strong> (Disk)<br/>
                <small>Immutable sorted string table</small>
              </div>
            </div>
          </div>

          <p>
            To summarize, a Memtable houses recent writes, consolidating writes for a keys into a single row, and is occasionally flushed to disk as an immutable SSTable. A commit log serves as a write-ahead-log to ensure data isn't lost if it is only in the Memtable and the node goes down.
          </p>
          <p>
            When reading data for a particular key, Cassandra reads the Memtable first, which will have the latest data. If the Memtable does not have the data for the key, Cassandra leverages a bloom filter to determine which SSTables on disk might have the data. It then reads the SSTables in order from newest to oldest to find the latest data for the row. The data in SSTables is sorted by primary key, making it easy to find a particular key.
          </p>
          <p>
            Building on the above foundation, there's 2 additional concepts to internalize:
          </p>
          <ul>
            <li><strong>Compaction</strong> - To prevent bloat of SSTables with many row updates / deletions, Cassandra will run compaction to consolidate data into a smaller set of SSTables, which reflect the consolidated state of data. Compaction also removes rows that were deleted, removing the tombstones that were previously present for that row. This process is particularly efficient because all of these tables are sorted.</li>
            <li><strong>SSTable Indexing</strong> - Cassandra stores files that point to byte offsets in SSTable files to enable faster retrieval of data on-disk. For example, Cassandra might map a key of 12 to a byte offset of 984, meaning the data for key 12 is found at that offset in the SSTable. This is somewhat similar to how a B-tree might point to data on disk.</li>
          </ul>

          <h3 id="gossip">Gossip</h3>
          <p>
            Cassandra nodes communicate information throughout the cluster via "gossip", which is a peer-to-peer scheme for distributing information between nodes. Universal knowledge of the cluster makes every node aware and able to participate in all operations of the database, eliminating any single points of failure and allowing Cassandra to be a very reliable database for availability-skewing system designs. How does this work?
          </p>
          <p>
            Nodes track various information about the cluster, such as what nodes are alive / accessible, what the schema is, etc. They manage generation and version numbers for each node they know about. The generation is a timestamp when the node was bootstrapped. The version is a logical clock value that increments every ~second. Across the cluster, these values form a vector clock. This vector clock allows nodes to ignore old cluster state information when it's received via gossip.
          </p>
          <p>
            Cassandra nodes routinely pick other nodes to gossip with, with a probabilistic bias towards "seed" nodes. Seed nodes are designated by Cassandra to bootstrap the cluster and serve as guaranteed "hotspots" for gossip so all nodes are communicating across the cluster. By creating these "choke points," Cassandra eliminates the possibility that sub-clusters of nodes emerge because information happens to not reach the entire cluster. Cassandra ensures that seed nodes are always discoverable via off-the-shelf service discovery mechanisms.
          </p>

          <h3 id="fault-tolerance">Fault Tolerance</h3>
          <p>
            In a distributed system like Cassandra, nodes fail, and Cassandra must efficiently detect and handle failures to ensure the database can write and read data efficiently. How is it able to achieve these requirements at scale?
          </p>
          <p>
            Cassandra leverages a Phi Accrual Failure Detector technique to detect failure during gossip; each node independently makes a decision on whether a node is available or not. When a node gossips with a node that doesn't respond, Cassandra's failure detection logic "convicts" that node and stops routing writes to it. The convicted node can re-enter the cluster when it starts heartbeating again. Cassandra will never consider a node truly "down" unless the Cassandra system administrator decommissions the node or rebuilds it. This is done to prevent intermittent communication failures / node restarts from causing the cluster to re-balance data.
          </p>
          <p>
            In the presence of write attempts to nodes that are considered "offline", Cassandra leverages a technique called "hinted handoffs." When a node is considered offline by a coordinator node attempting to write to it, the coordinator temporarily stores the write data in order for the write to proceed. This temporary data is called a "hint." When the offline node is detected as online, the node (or nodes) with a hint sends that data to the previously-offline node. Below is how this looks in practice.
          </p>

          {/* Diagram: Hinted Handoff */}
          <div className="diagram-container">
            <div className="diagram-title">Hinted Handoff Recovery</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="diagram-box diagram-box--client">Client</div>
                <div style={{ color: 'var(--primary)', fontSize: '1.5rem' }}>➔</div>
                <div className="diagram-box" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>
                  <strong>Coordinator Node</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px', background: 'white', padding: '4px', borderRadius: '4px' }}>Stores "Hint" locally</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>➔</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic' }}>Write fails (Node down)</div>
                  <div style={{ color: 'var(--success)', fontSize: '1.5rem' }}>➔</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic' }}>Hint pushed when Node recovers</div>
                </div>
                <div className="diagram-box diagram-box--server">
                  <strong>Replica Node</strong>
                </div>
              </div>
            </div>
          </div>

          <p>
            Hinted handoffs are mostly used as a short term way to prevent a node that is offline from losing writes. Any node that is offline for a long time will either be rebuilt or undergo read repairs, as hints usually have a short lifespan.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — How to use Cassandra
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="how-to-use-cassandra">How to use Cassandra</h2>
          
          <h3 id="data-modeling">Data Modeling</h3>
          <p>
            When leveraging Cassandra in a system design, modeling your data to take advantage of its architecture and strengths is very important.
          </p>
          <p>
            If you come from a relational database world, Cassandra data modeling might feel a bit odd at first. Relational data modeling focuses on "normalized" data, where you have a one copy of each entity instance and you manage relationships between these entities via foreign keys and JOIN-tables. In short, modeling data for a relational database is entity-relationship-driven. However, Cassandra doesn't have a concept of foreign keys / referential integrity, JOINs, etc. Cassandra also doesn't favor normalization of data. Instead, data modeling for Cassandra is query-driven.
          </p>
          <p>
            Cassandra's query efficiency is heavily tied to the way that data is stored. Cassandra also lacks the query flexibility of relational databases. It doesn't support JOINs and services single table queries. Therefore, when considering how to model the data of a Cassandra database, the "access patterns" of the application must be considered first and foremost. It also is important to understand what data is needed in each table, so that data can be "denormalized" (duplicated) across tables as necessary. The main areas to consider are:
          </p>
          <ul>
            <li><strong>Partition Key</strong> - What data determines the partition that the data is on.</li>
            <li><strong>Partition Size</strong> - How big a partition is in the most extreme case, whether partitions have the capacity to grow indefinitely, etc.</li>
            <li><strong>Clustering Key</strong> - How the data should be sorted (if at all).</li>
            <li><strong>Data Denormalization</strong> - Whether certain data needs to be denormalized across tables to support the app's queries.</li>
          </ul>
          <p>
            To drive home this point, it's helpful to go through some examples.
          </p>

          <h3 id="example-discord-messages">Example: Discord Messages</h3>
          <p>
            One of the best way to learn to use a tool like Cassandra is through a real-world example like Discord. Discord has shared a good summary of their use of Cassandra to store message data via blog posts, and it's a good model for how one might approach message storage for chat apps generally.
          </p>
          <p>
            Discord channels can be quite busy with messages. Users typically query recent data given the fact that a channel is basically a big group chat. Users might query recent data and scroll a little bit, so having the data sorted in reverse chronological order makes sense.
          </p>
          <p>
            To service the above needs, Discord originally opted to create a messages table with the following schema:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE messages (
  channel_id bigint,
  message_id bigint,
  author_id bigint,
  content text,
  PRIMARY KEY (channel_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);`}</CodeBlock>
          <p>
            You might wonder why <code>message_id</code> is used instead of a timestamp column like <code>created_at</code>? Discord opted to eliminate the possibility of Cassandra primary key conflicts by assigning messages Snowflake IDs. A Snowflake ID is basically a chronologically sortable UUID. This is preferable to <code>created_at</code> because a Snowflake ID collision is impossible (it's a UUID), wheras a timestamp, even with millisecond granularity, has a likelihood of collision.
          </p>
          <p>
            The above schema enables Cassandra to service messages for a channel via a single partition. The partition key, <code>channel_id</code>, ensures that a single partition is responsible for servicing the query, preventing the need to do a "scatter-gather" query across several nodes to get message data for a channel, which could be slow / resource intensive.
          </p>
          <p>
            The above schema didn't fully meet Discord's needs, however. Some Discord channels can sometimes have an extremely high volume of messages. With the above schema, Discord noticed that Cassandra was struggling to handle large partitions corresponding to busy Discord channels. Large partitions in Cassandra typically hit performance problems, and this was exactly what Discord observed. Additionally, Discord channels can perpetually grow in size with message activity, and would eventually hit performance problems if they lived long enough. A modification to the schema was necessary.
          </p>
          <p>
            To solve the large partition problem, Discord introduced the concept of a bucket and add it to the partition key part of the Cassandra primary key. A bucket represented 10 days of data, defined by a fixed window aligned to Discord's self-defined DISCORD_EPOCH of January 1, 2015. The messages of even the most busy Discord channels over 10 days would certainly fit in a partition in Cassandra. This also solved the issue of partitions growing monotonically; over time, a new partition would be introduced because a new bucket would be created. Finally, Discord could query a single partition to service writes most of the time, because the most recent messages of a channel would usually be in one bucket. The only time they weren't is when 1) a new bucket was created based on time passing, or 2) for inactive Discords, which were the significant minority of queries to the messages Cassandra table.
          </p>
          <p>
            The revised schema looks like this:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE messages (
  channel_id bigint,
  bucket int,
  message_id bigint,
  author_id bigint,
  content text,
  PRIMARY KEY ((channel_id, bucket), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);`}</CodeBlock>
          <p>
            Notably, Discord used its channel access patterns to dictate its schema design, a great example of query-driven data modeling. Their choice of their primary key, including both partition key and clustering key components, is strongly linked to how data is accessed for their app. Finally, they had to think about partition size when designing the schema. All these factors go into building a good Cassandra schema for system design generally.
          </p>

          <h3 id="example-ticketmaster">Example: Ticketmaster</h3>
          <p>
            Let's consider another example use-case for Cassandra: Ticketmaster's ticket browsing UI. This is the UI that shows an event venue's available seats, and allows a user to select seats and then enter a seat checkout and payment flow.
          </p>
          <p>
            The Ticketmaster ticket browsing UI is a UI that doesn't need strict consistency. Event ticket availability changes, even as a user is viewing the UI. If a seat is selected and a purchase flow is attempted, the system can check a consistent database to determine if the seat is actually available. Additionally, always showing the browsing UI is important, as a majority of users will browse, but a minority of users will actually enter a checkout flow.
          </p>
          <p>
            This example aims to be simple and focused on data modeling, so we gloss over the complexities that ridiculously popular events impose on the system (dubbed, "The Taylor Swift Problem").
          </p>
          <p>
            When considering how to model our data to support a ticket browsing UI, we might consider every seat in of an event a "ticket." If we think about the access patterns of our system, we uncover that users will query data for a single event at a time, and want to see totals of available seats and also the seats themselves. Users don't care about seeing the seats in any order, since they will have an event venue map that dictates how they see seat availability. Our first iteration of the schema might look like this:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE tickets (
  event_id bigint,
  seat_id bigint,
  price bigint,
  -- seat_id is added as a clustering key to ensure primary key uniqueness; order
  -- doesn't matter for the app access patterns
  PRIMARY KEY (event_id, seat_id)
);`}</CodeBlock>
          <p>
            With the above schema, the app can query a single partition to service queries about the event, given that the primary key has a partition key of <code>event_id</code>. The app can query the partition for price information about the event, for ticket availability totals, etc.
          </p>
          <p>
            This schema has problems, however. For events this 10,000+ tickets, the database needs to perform work to summarize information based on the user's query (price total, ticket total). Additionally, this work might be performed a lot for events that are very popular and have users frequently entering the ticket browsing UI. How might we resolve these problems?
          </p>
          <p>
            One of the hints for how we might improve our schema lies within the Ticketmaster ticket browsing UI user experience (UX). Consider the UX when a user starts browsing tickets. They see a venue map with sections. Each section might have a popover with high-level information about the ticket availability / price information for that section.
          </p>
          <p>
            If a user clicks into a section of interest, Ticketmaster's UI then shows the individual seats and ticket information.
          </p>
          <p>
            This UX unveils that we can add the concept of <code>section_id</code> to our tickets table, and have the <code>section_id</code> as part of the partition key. This means the tickets table now services the query to view individual seat tickets for a given section. The new schema looks like this:
          </p>
          <CodeBlock language="sql">{`CREATE TABLE tickets (
  event_id bigint,
  section_id bigint,
  seat_id bigint,
  price bigint,
  PRIMARY KEY ((event_id, section_id), seat_id)
);`}</CodeBlock>
          <p>
            The above schema is an improvement on our original schema. The schema distributes an event over several nodes in the Cassandra cluster, because each section of an event is in a different partition. It also means each partition is responsible for serving less data, because the number of tickets in a partition is lower. Finally, this schema better maps to the data needs / access patterns of the Ticketmaster ticket browsing UI.
          </p>
          <p>
            You might ask: how do we now show ticket data for the entire event? To service the UI that shows all sections and high-level information about ticket availability / price, we can consider a separate table <code>event_sections</code>.
          </p>
          <CodeBlock language="sql">{`CREATE TABLE event_sections (
  event_id bigint,
  section_id bigint,
  num_tickets bigint,
  price_floor bigint,
  -- section_id is added as a clustering key to ensure primary key uniqueness; order
  -- doesn't matter for the app access patterns
  PRIMARY KEY (event_id, section_id)
);`}</CodeBlock>
          <p>
            The above table represents the idea of "denormalizing" data in Cassandra. Rather than having our database do an aggregation on a table or query multiple tables / partitions to service an app, it's preferable to denormalize information like ticket numbers and a price floor in a section to make the access pattern for the app efficient. Additionally, the section stats being queried don't need to be extremely precise - there's tolerance eventual consistency. In fact, Ticketmaster doesn't even show exact ticket numbers in their UI, they merely show a total such as 100+.
          </p>
          <p>
            The above table is partitioned by <code>event_id</code>. Cassandra will be responsible for querying many sections in one query, but events have a low number of sections (usually &lt; 100) and this query will be served off a single partition. This means that Cassandra can efficiently query data to show the top-level venue view.
          </p>
          <p>
            Generally, the above represents how an application's access patterns and UX have a heavy influence on how data is modeled in Cassandra.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Advanced Features
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="advanced-features">Advanced Features</h2>
          <p>
            Beyond the fundamental use-cases of Cassandra, it's worthwhile to be aware of some of the advanced features at your disposal. Below is a shortlist of some of the major ones.
          </p>
          <ul>
            <li><strong>Storage Attached Indexes (SAI)</strong> - SAIs are a newer feature in Cassandra that offer global secondary indexes on columns. They offer flexible querying of data with performance that is worse than traditional querying based off partition key, but is still good. These enable Cassandra users to avoid excess denormalizing of data if there's query patterns that are less frequent. Lower frequency queries typically don't warrant the overhead of a separate, denormalized table for data. You can read more about them here.</li>
            <li><strong>Materialized Views</strong> - Materialized views are a way for a user to configure Cassandra to materialize tables based off a source table. They are have some overlap with SQL views, except they actually "materialize" a table, hence their name. This is convenient because as a user, you can get Cassandra to denormalize data automatically for you. This cuts complexity at your application level, as you don't need to author your application to write to multiple tables if data that is denormalized changes. You can read more about materialized views here.</li>
            <li><strong>Search Indexing</strong> - Cassandra can be wired up to a distributed search engine such as ElasticSearch or Apache Solr via different plugins. One example is the Stratio Lucene Index. You can read more about it here.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — Cassandra in an Interview
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="cassandra-in-an-interview">Cassandra in an Interview</h2>
          
          <h3 id="when-to-use-it">When to use it</h3>
          <p>
            Cassandra can be an awesome choice for systems that play to its strengths. Cassandra is a great choice in systems that prioritize availability over consistency and have high scalability needs. Cassandra can perform fast writes and reads at scale, but Cassandra is an especially good choice for systems with high write throughput, given its write-optimized storage layer based on LSM tree indexing. Additionally, Cassandra's wide-column design makes it a great choice as a database for flexible schemas or schemas that involve many columns that might be sparse. Finally, Cassandra succeeds when you have several clear access patterns for an application or use-case that the schema can revolve around.
          </p>

          <h3 id="knowing-its-limitations">Knowing its limitations</h3>
          <p>
            Cassandra isn't a great database choice for every system. Cassandra isn't good for designs that prioritize strict consistency, given it's heavy bias towards availability. Cassandra also isn't a good choice for systems that require advanced query patterns, such as multi-table JOINs, adhoc aggregations, etc.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Summary
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="summary">Summary</h2>
          <p>
            Hopefully now you can see why Cassandra is a very versatile piece of technology for distributed systems. It has a great set of features, but isn't necessarily the database of choice for every system. When leveraging it, it's important to adopt a query-driven data modeling approach to maximize the value Cassandra delivers in terms of write/speeds and scalability. When digging into the details of a system design, having knowledge of Cassandra's internals plays a key role in your ability to use the database properly.
          </p>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Distributed architecture:</strong> Cassandra scales horizontally using a consistent hashing ring with virtual nodes (vnodes), offering high availability without a single point of failure.</li>
              <li><strong>Flexible data model:</strong> As a wide-column store, Cassandra rows can have sparse columns. Its primary key uniquely identifies rows and is comprised of partition keys (for distribution) and clustering keys (for sorting).</li>
              <li><strong>Tunable consistency:</strong> By adjusting read and write quorum levels, you can tune Cassandra’s CAP theorem trade-offs. Using QUORUM on reads and writes ensures strong consistency if needed.</li>
              <li><strong>Fast writes via LSM Trees:</strong> Incoming writes are appended sequentially to a commit log for durability, kept in a Memtable, and eventually flushed to disk as immutable SSTables, avoiding random disk I/O.</li>
              <li><strong>Query-driven modeling:</strong> Unlike relational databases, Cassandra favors data denormalization. Schemas are designed heavily around expected read access patterns.</li>
            </ul>
          </div>
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
      
    </>
  );
}
