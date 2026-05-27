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
            <span className="breadcrumb-current">Elasticsearch</span>
          </div>
          <h1>Elasticsearch</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn how you can use Elasticsearch to solve full-text search, filtering, faceting, and geo-proximity queries at scale, and master its distributed architecture for your system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              16 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Distributed Search
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
            Many system design problems will involve some aspect of search and retrieval: I've got a lot of "things" and I want to be able to find the right one(s). While most database systems are pretty good at this (e.g., Postgres with a full-text index is sufficient for many problems!), at a certain scale or level of sophistication you'll want to bring out a purpose-built system.
          </p>
          <p>
            Usually this involves a lot of similar requirements like sorting, filtering, ranking, faceting, etc. Enter one of the most well-known search engines: <strong>Elasticsearch</strong>.
          </p>
          <p>
            From an interview perspective, this deep dive will tackle two different angles:
          </p>
          <ol>
            <li><strong>How to use Elasticsearch:</strong> Gives you a powerful tool for your design arsenal. You will rarely find a search and retrieval question which is too complex for Elasticsearch.</li>
            <li><strong>How Elasticsearch works under the hood:</strong> As an incredible piece of distributed systems engineering, Elasticsearch brings together a lot of different concepts which can be used even outside search and retrieval problems. Proving you understand these concepts is key for high-level infrastructure roles.</li>
          </ol>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Basic Concepts
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="basic-concepts">Basic Concepts</h2>
          <p>
            From a client perspective, the core concepts of Elasticsearch are documents, indices, mappings, and fields.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Elasticsearch Logical Hierarchy</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Index (Table)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  A collection of similar documents (e.g., <code>books</code>, <code>users</code>). Acts as the database table you search against.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>Mapping (Schema)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Defines field types (<code>keyword</code>, <code>text</code>, <code>date</code>, <code>nested</code>) and dictates how the search engine tokenizes and processes them.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Document (JSON Row)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  A single serialized object containing fields. The basic unit of data added to and retrieved from an index.
                </p>
              </div>
            </div>
          </div>

          <h3 id="documents">Documents</h3>
          <p>
            Documents are individual units of data. Think of them as JSON objects containing properties (fields) representing an entity. For example, a book document:
          </p>
          <CodeBlock language="json">{`{
  "id": "XYZ123",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 10.99,
  "createdAt": "2024-01-01T00:00:00.000Z"
}`}</CodeBlock>

          <h3 id="indices">Indices</h3>
          <p>
            An index is a logical namespace mapping to one or more physical shards. Each document is stored in an index and gets a unique ID. Think of an index like a database table.
          </p>
          
          <h3 id="mappings-fields">Mappings and Fields</h3>
          <p>
            A mapping is the index schema. It defines data types for fields (e.g., <code>integer</code>, <code>float</code>, <code>date</code>, <code>geo_point</code>) and sets rules for how they are indexed.
          </p>
          <CodeBlock language="json">{`{
  "properties": {
    "id": { "type": "keyword" },
    "title": { "type": "text" },
    "author": { "type": "text" },
    "price": { "type": "float" },
    "createdAt": { "type": "date" }
  }
}`}</CodeBlock>

          <p>
            The difference between **text** and **keyword** types is critical in mappings:
          </p>
          <ul>
            <li><strong>text:</strong> Analyzed, tokenized, and stored in an inverted index for partial searches (e.g., searching for "Gatsby" inside a title).</li>
            <li><strong>keyword:</strong> Kept intact as a single literal string for exact searches, sorting, and aggregation (e.g., matching a product ID or a category tag).</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Basic Use
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2>Basic Use</h2>
          <p>
            Elasticsearch exposes a RESTful API over HTTP, allowing operations via standard HTTP verbs.
          </p>

          <h3 id="create-index">Create an Index & Mapping</h3>
          <p>
            To avoid wasting memory on unused fields, you can define your mapping and index settings up front:
          </p>
          <CodeBlock language="json">{`// PUT /books
{
  "settings": {
    "number_of_shards": 2,
    "number_of_replicas": 1
  },
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "author": { "type": "keyword" },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "publish_date": { "type": "date" },
      "categories": { "type": "keyword" },
      "reviews": {
        "type": "nested",
        "properties": {
          "user": { "type": "keyword" },
          "rating": { "type": "integer" },
          "comment": { "type": "text" }
        }
      }
    }
  }
}`}</CodeBlock>

          <p>
            <strong>Note on Nested Fields:</strong> Storing reviews as a <code>nested</code> field treats each review as an independent internal document. This supports queries matching fields of a single review (e.g., user "reader1" rating &ge; 4) rather than flattening arrays. If reviews are frequently updated, keep them in a separate index to avoid rewriting the entire book document on every edit (normalized vs. denormalized tradeoff).
          </p>

          <h3 id="add-docs">Add & Update Documents</h3>
          <p>
            Adding a document is a POST request:
          </p>
          <CodeBlock language="json">{`// POST /books/_doc/kLEHMYkBq7V9x4qGJOnh
{
  "title": "To Kill a Mockingbird",
  "author": "Harper Lee",
  "price": 12.99,
  "publish_date": "1960-07-11",
  "categories": ["Classic"]
}`}</CodeBlock>

          <p>
            This returns metadata including a <code>_version</code> field:
          </p>
          <CodeBlock language="json">{`{
  "_index": "books",
  "_id": "kLEHMYkBq7V9x4qGJOnh",
  "_version": 1,
  "result": "created"
}`}</CodeBlock>

          <Callout type="warning" title="Optimistic Concurrency Control">
            <p style={{ margin: 0 }}>
              To prevent overwriting updates in concurrent systems, you can specify the target version: <code>PUT /books/_doc/kLEHMYkBq7V9x4qGJOnh?version=1</code>. If another request updated it first (version is now 2), Elasticsearch rejects the write with a 409 Conflict, letting the client fetch the latest state and retry safely.
            </p>
          </Callout>

          <h3 id="search-syntax">Search Queries</h3>
          <p>
            Elasticsearch query DSL is JSON-based. You construct structured clauses:
          </p>
          <CodeBlock language="json">{`// POST /books/_search
{
  "query": {
    "bool": {
      "must": [
        { "match": { "title": "Great" } }
      ],
      "filter": [
        { "range": { "price": { "lte": 15 } } }
      ]
    }
  }
}`}</CodeBlock>

          <p>
            <strong>Must vs. Filter:</strong> <code>must</code> queries calculate a relevance score (<code>_score</code>) using TF-IDF / BM25. <code>filter</code> queries run in binary mode (yes/no), skip scoring, and are cached internally by Elasticsearch, boosting performance.
          </p>

          <h3 id="geospatial-search">Geospatial Search</h3>
          <p>
            Elasticsearch natively supports location search using two types:
          </p>
          <ul>
            <li><code>geo_point</code>: Single latitude/longitude coordinates (restaurants, driver locations).</li>
            <li><code>geo_shape</code>: Polygons, boxes, or lines (delivery regions, service boundaries).</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">BKD Tree Geospatial Partitioning</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ width: '220px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'white' }}>
                  <strong>1. Spatial Grids (Geohashes)</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                    Divides map coordinates into hierarchically aligned alphanumeric boxes. Restricts initial search space to grid intersections.
                  </p>
                </div>
                <div style={{ width: '220px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'white' }}>
                  <strong>2. BKD Tree Indexes</strong>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                    Decomposes points into kd-tree leaves optimized for block storage. Avoids the limitation of dual single-dimension indexes.
                  </p>
                </div>
              </div>
              <div style={{ background: 'var(--bg-accent)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', width: '100%', maxWidth: '480px', textAlign: 'center' }}>
                <strong>Distance Query:</strong> <code>geo_distance</code> checks boundary candidates via BKD branches, then filters candidates to compute precise circular radius distance.
              </div>
            </div>
          </div>

          <CodeBlock language="json">{`// GET /restaurants/_search
{
  "query": {
    "bool": {
      "must": { "match": { "cuisine": "italian" } },
      "filter": {
        "geo_distance": {
          "distance": "2km",
          "location": { "lat": 40.7128, "lon": -74.0060 }
        }
      }
    }
  }
}`}</CodeBlock>

          <h3 id="sort-syntax">Sorting</h3>
          <p>
            You can sort results by any un-tokenized field (e.g., <code>keyword</code>, <code>float</code>, <code>date</code>). Tokenized <code>text</code> fields cannot be sorted directly unless they maintain a secondary <code>keyword</code> multi-field in the mapping:
          </p>
          <CodeBlock language="json">{`// GET /books/_search
{
  "query": { "match": { "description": "novel" } },
  "sort": [
    { "price": "asc" },
    { "publish_date": "desc" }
  ]
}`}</CodeBlock>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Pagination & Cursors
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="pagination-cursors">Pagination and Cursors</h2>
          <p>
            At scale, sending pages of search results to client UI clients requires selecting the appropriate pagination model.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '24px 0' }}>
            <div className="method-card" style={{ flexDirection: 'column', padding: '20px', gap: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-code status-code--4xx" style={{ background: '#fee2e2', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>FROM / SIZE</span>
                Offset Pagination
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Uses <code>"from": 100, "size": 10</code>. Simple and stateless, but has an <strong>O(N) cost</strong>. To return records 10,000–10,010, Elasticsearch must fetch, merge, and sort all 10,010 documents across shards, causing severe latency spike. Bounded at 10,000 by default.
              </p>
            </div>

            <div className="method-card" style={{ flexDirection: 'column', padding: '20px', gap: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-code status-code--2xx" style={{ background: '#dcfce7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>SEARCH AFTER</span>
                Search After (Keyset)
              </h4>
              <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Passes the sort values of the last document (e.g. <code>[1463538857, "doc_65"]</code>) to retrieve items immediately succeeding them. Extremely fast and stateless, though it only permits forward traversal.
              </p>
            </div>
          </div>

          <h3 id="cursors">Point-In-Time (PIT) Cursors</h3>
          <p>
            If documents are constantly added or updated while a user navigates pages, they might see duplicates or miss items. A **Point in Time (PIT)** cursor freezes the segment views to keep queries consistent.
          </p>
          <ol>
            <li><strong>Create PIT:</strong> <code>POST /my_index/_pit?keep_alive=1m</code> (returns a PIT ID).</li>
            <li><strong>Query with PIT:</strong> Send the PIT ID and use <code>search_after</code> values to paginate.</li>
            <li><strong>Close:</strong> <code>DELETE /_pit</code> to release the locked resources.</li>
          </ol>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — How it Works Under the Hood
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="under-the-hood">How it Works Under the Hood</h2>
          <p>
            Elasticsearch distributes shards across nodes and wraps **Apache Lucene** indexes to perform the core indexing, searching, and sorting operations.
          </p>

          <h3 id="node-types">Cluster Architecture & Node Types</h3>
          <p>
            An Elasticsearch cluster runs multiple nodes. Assigning dedicated roles to nodes helps optimize resources:
          </p>
          <ul>
            <li><strong>Master Node:</strong> Cluster state manager. Tracks node health, coordinates slot and shard rebalancing, and processes index creations.</li>
            <li><strong>Data Node:</strong> Stores indices and documents. Handles indexing I/O, search execution, and disk allocations. Can be divided into hot, warm, and cold pools.</li>
            <li><strong>Coordinating Node:</strong> Load balancer and query router. Receives requests, splits queries across relevant data node shards, and compiles/sorts final results.</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Distributed Search Request Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                
                {/* Step 1: User Request */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="diagram-box diagram-box--client">Client Query</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>GET /books/_search</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>➔</div>

                {/* Step 2: Coordinating Node */}
                <div className="diagram-box" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', minWidth: '180px' }}>
                  <strong>Coordinating Node</strong>
                  <div style={{ fontSize: '0.7rem', marginTop: '4px', textAlign: 'left' }}>
                    1. Evaluates mapping statistics<br />
                    2. Query Planner optimizes search path<br />
                    3. Broadcasts query to shards
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)' }}>➔</div>

                {/* Step 3: Shards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="diagram-box diagram-box--server" style={{ padding: '6px 12px' }}>
                    <strong>Data Node 1</strong> (Shard 1 Primary)
                  </div>
                  <div className="diagram-box diagram-box--server" style={{ padding: '6px 12px' }}>
                    <strong>Data Node 2</strong> (Shard 2 Replica)
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-accent)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.8rem', width: '100%', maxWidth: '640px' }}>
                <strong>Scatter-Gather Process:</strong> The Coordinating node broadcasts the search (Scatter Phase) to the relevant shards. Each shard executes search queries locally, compiles sorted matches, and returns their document IDs & scores. The coordinating node merges these lists, selects the top hits (Gather Phase), and fetches the raw JSON documents from the target shards to send back.
              </div>
            </div>
          </div>

          <h3 id="lucene-segments">Lucene Segments & Immutability</h3>
          <p>
            An Elasticsearch shard is a single **Apache Lucene index**. In Lucene, an index is composed of **segments**—immutable files written to disk.
          </p>
          <p>
            Because segments are immutable, Lucene avoids locking during read queries. Writes are buffered in memory and flushed periodically into new segments.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Lucene Segment CRUD Mechanics</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent)' }}>Write & Buffer</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  New documents are written to an in-memory buffer. Periodically, the buffer flushes to disk as an immutable segment (e.g. <code>Segment A</code>).
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--primary)' }}>Updates (Soft Delete)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  Updating document <code>ID_1</code> marks it as deleted in <code>Segment A</code>'s bitmask, and writes the new version to a new <code>Segment B</code>.
                </p>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--success)' }}>Segment Merge Cleanup</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '8px 0 0 0', lineHeight: '1.4' }}>
                  In the background, small segments are merged into large ones. Stale or soft-deleted records are omitted from the new segment, reclaiming disk space.
                </p>
              </div>
            </div>
          </div>

          <h3 id="inverted-index-doc-values">Inverted Index vs. Doc Values</h3>
          <p>
            To search and sort instantly, Lucene builds two complementary data structures inside every segment:
          </p>
          <ul>
            <li><strong>Inverted Index (Search-Oriented):</strong> Maps tokens/words to a list of matching document IDs. This allows searching for "mockingbird" to retrieve matching documents in <code>O(1)</code> time.</li>
            <li><strong>Doc Values (Sort-Oriented):</strong> Stores data in a column-oriented format (contiguous arrays of field values ordered by document ID). When sorting matching hits by price, Lucene reads directly from this contiguous price array, avoiding expensive document lookups.</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">Inverted Index vs. Columnar Doc Values</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flexWrap: 'wrap' }}>
              
              {/* Left Column: Inverted Index */}
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: 0, color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                  Inverted Index (Row Search)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: 'var(--bg-sidebar)', borderRadius: '4px' }}>
                    <span>"classic"</span> ➔ <span>[Doc 1, Doc 2]</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: 'var(--bg-sidebar)', borderRadius: '4px' }}>
                    <span>"gatsby"</span> ➔ <span>[Doc 1]</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: 'var(--bg-sidebar)', borderRadius: '4px' }}>
                    <span>"mockingbird"</span> ➔ <span>[Doc 2]</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
                  Finds matching documents using string tokens.
                </div>
              </div>

              {/* Right Column: Doc Values */}
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: 0, color: 'var(--accent)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>
                  Doc Values (Columnar Sort)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: 'var(--bg-sidebar)', borderRadius: '4px' }}>
                    <span>Doc 1</span> ➔ <span>price: 9.99</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px', background: 'var(--bg-sidebar)', borderRadius: '4px' }}>
                    <span>Doc 2</span> ➔ <span>price: 12.99</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '12px', lineHeight: '1.4' }}>
                  Fast column-based arrays for sorting and aggregations.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — System Design Interviews
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="interviews">Elasticsearch in System Design Interviews</h2>
          <p>
            Elasticsearch fits naturally in location search, e-commerce filters, log monitoring, and semantic vector search questions.
          </p>

          <h3 id="cdc">Change Data Capture (CDC) Architecture</h3>
          <p>
            Because Elasticsearch does not support ACID transactions, **never use it as your primary database**. In your designs, place a persistent database (PostgreSQL, DynamoDB) as the write-path source of truth, and synchronize writes to Elasticsearch using one of two methods:
          </p>
          <ol>
            <li><strong>Dual Writes:</strong> The application writes to the DB, and then writes to Elasticsearch. Fast to write but vulnerable to failures (if the DB write succeeds and the Elasticsearch write fails, the indexes drift out of sync).</li>
            <li><strong>CDC Pipeline (Recommended):</strong> Application writes to DB. The database transactional log is streamed (via DynamoDB Streams, PostgreSQL Debezium) to an event stream (Kafka), which triggers workers or log consumers to populate Elasticsearch asynchronously. This guarantees eventual consistency.</li>
          </ol>

          <div className="diagram-container">
            <div className="diagram-title">Consistent Search CDC Pipeline</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="diagram-box diagram-box--client">App Server</div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--server">Primary Database<br /><small>(PostgreSQL/ACID)</small></div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--connection" style={{ background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' }}>
                CDC Engine<br /><small>(Debezium / Kafka)</small></div>
              <div style={{ color: 'var(--primary)' }}>➔</div>
              <div className="diagram-box diagram-box--server">Elasticsearch<br /><small>(Read Search Engine)</small></div>
            </div>
          </div>

          <h3 id="guidelines">Design Guidelines</h3>
          <ul>
            <li><strong>Scale Reads:</strong> Increase the number of replica shards to distribute search traffic across more nodes.</li>
            <li><strong>Scale Writes:</strong> Increase the number of primary shards, optimize the index refresh interval (e.g., 1s &rarr; 30s) to batch segment creation, and use bulk indexing APIs.</li>
            <li><strong>Avoid High Cardinality Fields:</strong> Mapping high-variance values as keyword fields increases heap memory consumption. Denormalize selectively.</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — Conclusion
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="conclusion">Summary</h2>

          <div className="takeaway-card">
            <h3>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Key Takeaways
            </h3>
            <ul>
              <li><strong>Purpose-Built Search:</strong> Elasticsearch maps JSON documents to indexes with pre-defined schemas, providing high performance for full-text search, geo-proximity, and faceted filtering.</li>
              <li><strong>BM25 Relevance:</strong> By default, matches are scored using BM25 relevance formulas, but queries inside <code>filter</code> blocks bypass scoring and are cached for speed.</li>
              <li><strong>Immutable Segments:</strong> Lucene writes data to immutable segments on disk, avoiding read locks. Deleted items are marked in bitmasks and cleaned up during segment merges.</li>
              <li><strong>Indices vs. Doc Values:</strong> Inverted indexes map tokens to document lists (reads), while Doc Values map documents to columnar values (sorting/aggregations).</li>
              <li><strong>Eventual Consistency:</strong> Sync Elasticsearch from your primary transactional store (SQL) using a transactional log change stream (CDC) to prevent data drift.</li>
            </ul>
          </div>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#redis" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Redis</div>
            </div>
          </a>
          <a href="#kafka" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Kafka</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
