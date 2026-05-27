import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function DbIndexing() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Core Concepts</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Database Indexing</span>
          </div>
          <h1>Database Indexing</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about how database indexing works and how to optimize your queries
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              18 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Storage & Databases
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
            Database performance can make or break modern applications. Think about what it takes to search for a user's profile by email in a table with millions of records. Without any optimizations, the database would have to check each row sequentially, scanning through every single record until it finds a match. For a table with millions of rows, this becomes painfully slow - like searching through every book in a library one by one to find a specific novel.
          </p>
          <p>
            This is where indexes come in handy. By maintaining separate data structures optimized for searching, indexes allow databases to quickly locate the exact records we need without examining every row. From finding products in an e-commerce catalog to loading user profiles in a social network, indexes are what make fast lookups possible.
          </p>
          <p>
            Knowing when to add an index, to what columns, and what type of index is a critical part of system design. Choosing the right indexes is often a key focus in interviews. For mid-level engineers, understanding basic indexing strategies is expected. For staff-level engineers, mastery of different index types and their trade-offs is essential.
          </p>
          <p>
            This deep dive covers how database indexes work under the hood and the different types you'll encounter. We'll start with the core concepts of how indexes are stored and accessed, then examine specific index types like B-trees, hash indexes, geospatial indexes, and more. For each type, we'll cover their strengths, limitations, and when to use them in your system design interviews.
          </p>
          <p>
            First, let's understand exactly how databases store and use indexes to make our queries efficient.
          </p>
          
          <Callout type="tip" title="Interview Context">
            <p>
              Indexing and data organization tends to be a stronger focus in infrastructure style interviews. For full-stack and product-focused roles, you'll likely only need a basic understanding of when and why to use indexes. The depth we cover here goes beyond what's typically asked in full-stack interviews, but understanding the fundamentals will help you make better decisions when designing and optimizing your applications.
            </p>
          </Callout>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — How Database Indexes Work
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="under-the-hood">How Database Indexes Work</h2>
          <p>
            When we store data in a database, it's ultimately written to disk as a collection of files. The main table data is typically stored as a <strong>heap file</strong> - essentially a collection of rows in no particular order. Think of this like a notebook where you write entries as they come, one after another.
          </p>

          <h3 id="physical-storage">Physical Storage and Access Patterns</h3>
          
          <Callout type="warning" title="Beyond the Interview">
            <p>
              Unless interviewing for a database internals role, the details here are not going to be asked in an interview. That said, they are an important foundation to understand the problem of why we need indexes.
            </p>
          </Callout>

          <p>
            Modern databases face an interesting challenge: they need to store and quickly access vast amounts of data. While the data lives on disk (typically SSDs nowadays), we can only process it when it's in memory. This means every query requires loading data from disk into RAM.
          </p>
          <p>
            When querying without an index, we need to scan through every page of data one by one, loading each into memory to check if it contains what we're looking for. With millions of pages, this means millions of (relatively) slow disk reads just to find a single record. It's like having to flip through every page of a massive book to find one specific word.
          </p>
          <p>
            Modern databases have optimizations like prefetching and caching to make random access faster, but the point here still stands. It's too slow to scan through every page of data sequentially.
          </p>
          <p>
            But with indexes, we transform our access patterns. Instead of reading through every page of data sequentially, indexes provide a structured path to follow directly to the data we need. They help us minimize the number of pages we need to read from storage by telling us exactly which pages contain our target data. It's the difference between checking every page in a book versus using the table of contents to jump straight to the relevant pages.
          </p>
          <p>
            While SSDs are the norm today, it's important to note that random access is still significantly slower than sequential access, even on SSDs. This is a common misconception - while the performance gap is smaller than with HDDs, it's still very real. And for systems still using HDDs, especially for large datasets, this performance difference becomes even more pronounced, making proper indexing absolutely critical.
          </p>

          <h3 id="cost">Cost</h3>
          <p>
            But indexes aren't free - they come with their own set of trade-offs. Every index we create requires additional disk space, sometimes nearly as much as the original data.
          </p>
          <p>
            Write performance takes a hit too. When we insert a new row or update an existing one, the database must update not just the main table, but every index on it. With multiple indexes, a single write operation can trigger several disk writes.
          </p>
          <p>
            So when might indexes actually hurt more than help? The classic case is a table with frequent writes but infrequent reads. Think of a logging table where we're constantly inserting new records but rarely querying old ones. Here, the overhead of maintaining indexes might not justify their benefit. Similarly, for small tables with just a few hundred rows, the cost of maintaining an index and traversing its structure might exceed the cost of a simple sequential scan.
          </p>
          <p>
            In reality, the impact of indexes on memory is often overblown. Modern databases have smart buffer pool management that reduces the performance hit of having multiple indexes. However, it's still a good idea to closely monitor index usage and avoid creating unnecessary indexes that don't provide significant benefits.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Types of Indexes
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="types-of-indexes">Types of indexes</h2>
          <p>
            There are lots of indexes, many of which fall into the tail and are rarely used but for specialized use cases. Rather than enumerating every type of index you may see in the wild, we're going to focus in on the most common ones that show up in system design interviews.
          </p>

          <h3 id="b-trees">B-Tree Indexes</h3>
          <p>
            B-tree indexes are the most common type of database index, providing an efficient way to organize data for fast searches and updates. They achieve this by maintaining a balanced tree structure that minimizes the number of disk reads needed to find any piece of data.
          </p>

          <h4>The Structure of B-trees</h4>
          <p>
            A B-tree is a self-balancing tree that maintains sorted data and allows for efficient insertions, deletions, and searches. Unlike binary trees where each node has at most two children, B-tree nodes can have multiple children - typically hundreds in practice. Each node contains an ordered array of keys and pointers, structured to minimize disk reads.
          </p>
          
          <div className="diagram-container">
            <div className="diagram-title">B-Tree Structure</div>
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
              [ B-Tree Diagram: Root Node → Internal Nodes → Leaf Nodes ]
            </div>
          </div>

          <p>Every node in a B-tree follows strict rules:</p>
          <ul>
            <li>All leaf nodes must be at the same depth</li>
            <li>Each node can contain between m/2 and m keys (where m is the order of the tree)</li>
            <li>A node with k keys must have exactly k+1 children</li>
            <li>Keys within a node are kept in sorted order</li>
          </ul>
          <p>
            This structure is particularly clever because it maps perfectly to how databases store data on disk. Each node is sized to fit in a single disk page (typically 8KB), maximizing our I/O efficiency. When PostgreSQL needs to find a record with <code>id=350</code>, it might only need to read 2-3 pages from disk: the root node, maybe an internal node, and finally a leaf node.
          </p>

          <h4>Real-World Examples</h4>
          <p>
            B-trees are everywhere in modern databases. PostgreSQL uses them for almost everything - primary keys, unique constraints, and most regular indexes are all B-trees.
          </p>
          <p>When you create a table like this in PostgreSQL:</p>
          
          <CodeBlock language="sql">{`CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);`}</CodeBlock>

          <p>
            PostgreSQL automatically creates two B-tree indexes: one for the primary key and one for the unique email constraint. These B-trees maintain sorted order, which is crucial for both uniqueness checks and range queries.
          </p>
          <p>
            DynamoDB organizes items within a partition in sort-key order, enabling efficient range queries within that partition. Its storage internals aren’t publicly documented in detail, but it’s widely understood to use an LSM-style storage architecture rather than a B-tree for its underlying engine.
          </p>
          <p>
            Even MongoDB, with its document model, uses B-trees (specifically B+ trees, a variant where all data is stored in leaf nodes) for its indexes. When you create an index in MongoDB like this:
          </p>

          <CodeBlock language="javascript">{`db.users.createIndex({ "email": 1 });`}</CodeBlock>

          <p>You're creating a B-tree that maps email values to document locations.</p>

          <h4>Why B-trees are the default choice</h4>
          <p>
            The reason B-trees (and specifically B+ trees) are the industry standard boils down to their incredible versatility. Because the data within the nodes is kept tightly sorted, B-trees aren't just fast at finding a specific record (an exact match query) — they are extraordinarily efficient at <strong>range queries</strong>. 
          </p>
          <p>
            If you need to fetch all users created between January 1st and January 31st, a B-tree allows the database to quickly traverse to the January 1st record, and then sequentially read across the leaf nodes until it hits January 31st. Hash indexes completely fail at this. This balance between <code>O(log N)</code> lookups and hyper-efficient sequential range scanning makes the B-tree the perfect general-purpose tool.
          </p>

          {/* ─── LSM Trees ─── */}
          <h3 id="lsm-trees">LSM Trees (Log-Structured Merge Trees)</h3>
          <p>
            As applications scaled to handle massive volumes of user data—think millions of clicks, sensor readings, or messages per second—traditional B-trees hit a wall. Updating a B-tree in-place on a disk requires <strong>random I/O</strong>. When dealing with extreme write loads, waiting for disk heads to seek back and forth becomes a severe bottleneck.
          </p>
          <p>
            Enter the <strong>LSM Tree</strong>. Optimized heavily for write throughput, LSM trees sidestep random I/O entirely. Instead of updating structures in-place, writes are appended sequentially to an in-memory buffer (usually a balanced tree itself, called a MemTable). Because sequential writes to memory—and eventually to an append-only log on disk—are incredibly fast, write performance skyrockets.
          </p>
          <p>
            As these in-memory tables fill up, they are flushed to disk as immutable sorted files (SSTables). In the background, the database periodically merges and compacts these files to clean up deleted or overwritten data. 
          </p>
          
          <h4>The Read Penalty</h4>
          <p>
            The trade-off here is read speed. To find a record in an LSM tree, the database might have to check the memory buffer, and then potentially search through multiple immutable files on disk. To mitigate this, LSM systems heavily utilize <strong>Bloom Filters</strong>—a probabilistic data structure that can tell the database with 100% certainty if a key does <em>not</em> exist in a file, saving unnecessary disk reads.
          </p>
          <p>
            If you are designing a system with extreme write-heavy workloads—like time-series data, chat apps, or high-volume analytics—you should reach for databases powered by LSM trees, such as <strong>Cassandra</strong>, <strong>ScyllaDB</strong>, <strong>RocksDB</strong>, or <strong>LevelDB</strong>.
          </p>

          {/* ─── Hash Indexes ─── */}
          <h3 id="hash-indexes">Hash Indexes</h3>
          <p>
            While B-trees are the generalists, Hash Indexes are the specialists. A hash index uses a hash table data structure. The database takes the indexed column's value, runs it through a hash function, and stores the pointer to the row in the corresponding bucket.
          </p>
          <p>
            The greatest strength of a hash index is its speed for <strong>exact-match lookups</strong>. Since the lookup operates in <code>O(1)</code> time, finding a user by a highly specific, unique identifier (like a Session ID or a UUID) is practically instantaneous, bypassing the logarithmic traversal overhead of a tree.
          </p>
          
          <Callout type="warning" title="The Fatal Flaw: No Range Queries">
            <p>
              The cost of this speed is that hashing completely destroys the natural ordering of data. If you use a hash index on an <code>age</code> column, you can quickly find users exactly 30 years old, but you cannot use the index to find users older than 30. For anything other than equality checks (<code>=</code> or <code>IN</code>), a hash index is entirely useless.
            </p>
          </Callout>
          
          <p>
            In practice, explicit hash indexes are relatively rare in relational systems like PostgreSQL (though supported). However, they form the backbone of in-memory caching systems and NoSQL key-value stores like <strong>Redis</strong> and <strong>Memcached</strong>, where lightning-fast exact match retrieval is the entire point of the system.
          </p>

          {/* ─── Geospatial Indexes ─── */}
          <h3 id="geospatial-indexes">Geospatial Indexes</h3>
          <p>
            Some of the most common system design questions revolve around location: <em>"Design Yelp"</em>, <em>"Design Uber"</em>, or <em>"Design a Nearby Friends feature"</em>. These problems introduce a unique indexing challenge. 
          </p>
          <p>
            If you store latitude and longitude in standard columns, finding restaurants within a 5-mile radius requires calculating the distance between the user and <em>every single restaurant</em> in the database. A B-tree cannot help you query two dimensions simultaneously. 
          </p>
          
          <p>To solve this, databases use Geospatial Indexes, which typically rely on two approaches:</p>
          <ul>
            <li><strong>Spatial Trees (R-Trees / Quadtrees):</strong> These data structures divide a 2D map into bounding boxes or quadrants. When querying for a radius, the database can instantly discard entire quadrants that don't intersect with the search area, massively reducing the search space. <strong>PostGIS</strong> (an extension for PostgreSQL) heavily leverages these.</li>
            <li><strong>Geohashing / S2 Geometry:</strong> These techniques convert 2D coordinates into a 1D string or number. Locations close to each other share the same prefix (e.g., <code>9q8yy</code>). This allows the database to use a standard B-tree index to perform a fast prefix-match query to find nearby points. <strong>Redis</strong> and <strong>MongoDB</strong> utilize these strategies for their geospatial queries.</li>
          </ul>

          {/* ─── Inverted Indexes ─── */}
          <h3 id="inverted-indexes">Inverted Indexes</h3>
          <p>
            Standard B-Trees are great for matching strings from the beginning (using <code>LIKE 'term%'</code>), but they are absolutely useless if you need to find a keyword buried in the middle of a massive block of text (like a blog post, a product description, or a tweet).
          </p>
          <p>
            For Full-Text Search, you need an <strong>Inverted Index</strong>. The concept is identical to the index at the back of a physical book: it maps words (terms) to the documents (rows) that contain them.
          </p>
          
          <CodeBlock language="plaintext">{`// Documents:
Doc 1: "The quick brown fox"
Doc 2: "The fast brown dog"

// Inverted Index:
"quick" -> [Doc 1]
"brown" -> [Doc 1, Doc 2]
"fox"   -> [Doc 1]
"fast"  -> [Doc 2]
"dog"   -> [Doc 2]`}</CodeBlock>

          <p>
            When a user searches for "brown dog", the database intersects the arrays for "brown" (<code>[1, 2]</code>) and "dog" (<code>[2]</code>) to instantly determine that Document 2 is the exact match. 
          </p>
          <p>
            While relational databases like PostgreSQL have built-in inverted index capabilities (via GIN indexes), large-scale search systems generally offload this to dedicated search engines built atop Apache Lucene, such as <strong>Elasticsearch</strong> or <strong>Solr</strong>.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Index Optimization Patterns
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="optimization-patterns">Index Optimization Patterns</h2>
          <p>
            Knowing the types of data structures is great, but applying them correctly is where you prove your mettle in an interview. Let's look at a few critical patterns for optimizing indexes.
          </p>

          <h3 id="composite-indexes">Composite Indexes</h3>
          <p>
            A composite (or compound) index is an index spanning <strong>multiple columns</strong>. The order in which you specify the columns is absolutely critical because of how the underlying B-Tree sorts the data.
          </p>
          
          <CodeBlock language="sql">{`-- Creating a composite index on (last_name, first_name)
CREATE INDEX idx_name ON users (last_name, first_name);`}</CodeBlock>

          <p>
            Think of a composite index like a physical telephone book: it is sorted first by last name, and then by first name. 
          </p>
          <ul>
            <li>You can easily find all people with the last name "Smith".</li>
            <li>You can easily find "Smith, John".</li>
            <li>You <strong>cannot</strong> easily find all people with the first name "John" without scanning the whole book, because the book is primarily sorted by last name.</li>
          </ul>
          <p>
            This behavior is governed by the <strong>Leftmost Prefix Rule</strong>. A composite index can only be utilized if the query filters on the leftmost columns of the index. If an interviewer asks you to optimize a query filtering on <code>country</code> and <code>status</code>, a composite index <code>(country, status)</code> is a great answer, but remember that a query solely on <code>status</code> will completely ignore this index.
          </p>

          <h3 id="covering-indexes">Covering Indexes</h3>
          <p>
            A covering index is a special scenario where <strong>all the columns</strong> requested by a query are present in the index itself. 
          </p>
          <p>
            Normally, when a database uses a secondary index, it performs two reads: one read to traverse the index and find the pointer, and a second read to fetch the actual row data from the main table (the heap). 
          </p>

          <CodeBlock language="sql">{`-- Index on (department, salary)
CREATE INDEX idx_dept_salary ON employees (department, salary);

-- Query:
SELECT salary FROM employees WHERE department = 'Engineering';`}</CodeBlock>

          <p>
            In the query above, the database uses the index to find the 'Engineering' department. Since the query only <code>SELECT</code>s the <code>salary</code> column, and the <code>salary</code> column is already stored inside the index structure, the database doesn't even need to look up the actual row in the table!
          </p>
          
          <Callout type="tip" title="Interview Tip">
            <p>
              If an interviewer asks how to squeeze extra performance out of a read-heavy query that is still too slow despite having an index, suggesting a <strong>Covering Index</strong> by adding the selected columns to the index (often using an <code>INCLUDE</code> clause in Postgres or SQL Server) is a fantastic, senior-level answer.
            </p>
          </Callout>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — Wrapping Up
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="wrapping-up">Wrapping Up</h2>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Indexes minimize I/O:</strong> They prevent full table scans by converting millions of slow random reads into a few targeted logarithmic lookups.</li>
              <li><strong>Write amplification:</strong> Indexes consume disk space and slow down writes. Don't index heavily updated logging tables blindly.</li>
              <li><strong>B-Trees are the default:</strong> Offering <code>O(log N)</code> lookups and phenomenal sequential range queries. They are the backbone of most relational DBs.</li>
              <li><strong>LSM Trees for write-heavy loads:</strong> When random I/O bottlenecks your writes, LSM trees append sequentially to memory/logs for massive throughput.</li>
              <li><strong>Hash indexes for speed:</strong> <code>O(1)</code> exact matches, but useless for range queries. Heavily utilized in caching layers (Redis, Memcached).</li>
              <li><strong>Optimize with composites:</strong> Composite indexes follow the Leftmost Prefix Rule. Covering indexes avoid table lookups entirely.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#cap-theorem" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">CAP Theorem</div>
            </div>
          </a>
          <a href="#numbers-to-know" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Numbers to Know</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
