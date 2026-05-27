import React from 'react';
import '../MainContent.css';
import CodeBlock from '../ui/CodeBlock';
import Callout from '../ui/Callout';

export default function Caching() {
  return (
    <main className="content-scrollable">
      <article>
        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Core Concepts</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Caching</span>
          </div>
          <h1>Caching</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn about caching and when to use it in system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              15 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Core Concepts
            </span>
            <span className="difficulty-badge difficulty-badge--beginner">Beginner</span>
          </div>
        </div>

        <section className="content-section">
          <Callout type="info" title="Watch Video Walkthrough">
            <p style={{ margin: 0 }}>Watch the author walk through the problem step-by-step</p>
          </Callout>

          <p>
            In system design interviews, caching comes up almost every time you need to handle high read traffic. Your database becomes the bottleneck, latency starts creeping up, and the interviewer is waiting for you to say the word: cache.
          </p>
          <p>
            Reading a user profile from Postgres may take 50 milliseconds, but reading from an in-memory cache like Redis takes just 1 millisecond. That's a 50x improvement in latency. Databases store data on disk, and every query pays the cost of disk access. Memory sits much closer to the CPU and avoids that entirely.
          </p>
          <p>
            Caches are essential for scalable systems. They reduce load on the database and cut latency dramatically. But they also create new challenges around invalidation and failure handling.
          </p>
          <p>
            This breakdown covers the basics of caching, when and where to use it, common pitfalls, and how to talk about caching clearly in interviews.
          </p>
        </section>

        <section className="content-section">
          <h2 id="where-to-cache">Where to Cache</h2>
          <p>
            When most engineers hear caching, they immediately think of Redis or Memcached sitting between the application and the database. It is the most common type of cache and the one interviewers care about the most.
          </p>
          <p>
            But caching shows up in multiple layers of a system. Browsers cache. CDNs cache. Applications cache. Even databases have built-in caching layers.
          </p>
          <p>
            Let's look at the main places you can cache data, why each one exists, and when it makes sense to use it.
          </p>

          <h3 id="external-caching">External Caching</h3>
          <p>
            An external cache is a standalone cache service that your application talks to over the network. This is what most people think of when they hear caching. You store frequently accessed data in something like Redis or Memcached so you do not have to hit the database every time.
          </p>
          
          <div className="diagram-container">
            <div className="diagram-title">External Caching</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">App Server</div>
              <div className="diagram-arrow diagram-arrow--bidirectional">↔</div>
              <div className="diagram-box diagram-box--connection" style={{ background: '#e3f2fd', color: '#1565c0', borderColor: '#90caf9' }}>
                Redis Cache
              </div>
              <div className="diagram-arrow diagram-arrow--bidirectional">↔</div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            External caches scale well because every application server can share the same cache. They also support eviction policies like LRU and expiration via TTL so your memory footprint stays controlled.
          </p>
          <p>
            In system design interviews, external caching with Redis is the default answer when discussing caching strategies. Interviewers expect you to mention it for any high-traffic system. Start here, then layer on other caching types such as CDN or client-side caching only if the problem calls for them.
          </p>

          <h3 id="cdn-caching">CDN (Content Delivery Network)</h3>
          <p>
            A CDN is a geographically distributed network of servers that caches content close to users. Instead of every request traveling to your origin server, a CDN stores copies of your content at edge servers around the world.
          </p>
          <p>
            Modern CDNs like Cloudflare, Fastly, and Akamai can cache much more than static files. They can also cache public API responses, HTML pages, and even run edge logic to personalize content or enforce security rules before requests reach your servers. But the most common and most impactful use of a CDN is still media delivery.
          </p>
          <p>
            How it works:
          </p>
          <ol>
            <li>A user requests an image from your app.</li>
            <li>The request goes to the nearest CDN edge server.</li>
            <li>If the image is cached there, it is returned immediately.</li>
            <li>If not, the CDN fetches it from your origin server, stores it, and returns it.</li>
            <li>Future users in that region get the image instantly from the CDN.</li>
          </ol>

          <div className="diagram-container">
            <div className="diagram-title">CDN Caching</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">User (Browser)</div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'var(--primary)' }}>CDN Edge Node</div>
              <div className="diagram-arrow">→</div>
              <div className="diagram-box diagram-box--server">Origin Server</div>
            </div>
          </div>

          <p>
            Without a CDN, every image request travels to your origin. If your server is in Virginia and the user is in India, that adds 250–300 ms of latency per request. With a CDN, the same image is served from a nearby edge server in 20–40 ms. That is a massive performance difference.
          </p>
          <p>
            Even though modern CDNs can cache API responses and dynamic content, in system design interviews the safest time to introduce a CDN is when your system serves static media at scale. Start with that reason first, then expand only if the problem calls for more.
          </p>

          <h3 id="client-side-caching">Client-Side Caching</h3>
          <p>
            Client-side caching stores data close to the requester to avoid unnecessary network calls. This usually means the user's device, like a browser (HTTP cache, localStorage) or mobile app using local memory or on-device storage.
          </p>
          <p>
            But it can also mean caching within a client library. For example, Redis clients cache cluster metadata like which nodes are in the cluster and which slots are assigned to them. That way, the client can route requests directly to the right node without querying the cluster on every operation.
          </p>
          <p>
            For user-facing caching, you have limited control from the backend. Data can go stale and invalidation is harder. The Strava app keeps your run data on the device while you are offline and syncs it later. A browser reusing a previously downloaded image from disk is also caching.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Client-Side Caching</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box" style={{ background: '#f5f5f5', border: '2px solid #ccc', padding: '16px', borderRadius: '8px', textAlign: 'center' }}>
                <strong style={{ display: 'block', marginBottom: '8px' }}>User Device</strong>
                <div style={{ background: 'white', border: '1px solid #ddd', padding: '8px', borderRadius: '4px', fontSize: '0.9rem' }}>Local Cache / Storage</div>
              </div>
              <div className="diagram-arrow diagram-arrow--bidirectional">↔</div>
              <div className="diagram-box diagram-box--server">App Server</div>
            </div>
          </div>

          <h3 id="in-process-caching">In-Process Caching</h3>
          <p>
            Most candidates, and engineers, overlook the fact that servers run on machines with a lot of memory. As hardware improves, this becomes increasingly true. You can use that memory to cache data directly inside the application process instead of always calling out to Redis or the database.
          </p>
          <p>
            The idea is simple: if your service keeps requesting the same small pieces of data again and again, store them in a local cache inside the process. Reads from local memory are even faster than reads from Redis because they avoid any network call.
          </p>
          <p>
            This light-weight form of caching makes sense for small pieces of data that are requested frequently like:
          </p>
          <ul>
            <li>Configuration values</li>
            <li>Feature flags</li>
            <li>Small reference datasets</li>
            <li>Hot keys</li>
            <li>Rate limiting counters</li>
            <li>Precomputed values</li>
          </ul>

          <div className="diagram-container">
            <div className="diagram-title">In-Process Caching</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box" style={{ background: '#e0f7fa', border: '2px solid #00acc1', padding: '16px', borderRadius: '8px', textAlign: 'center', width: '200px' }}>
                <strong style={{ display: 'block', marginBottom: '8px', color: '#006064' }}>App Server Process</strong>
                <div style={{ background: 'white', border: '1px solid #00acc1', padding: '8px', borderRadius: '4px', fontSize: '0.9rem', color: '#00838f' }}>In-Memory Cache Map</div>
              </div>
              <div className="diagram-arrow diagram-arrow--bidirectional">↔</div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            In-process caching is blazing fast, but it comes with obvious limitations. Each instance of your application has its own cache, so cached data is not shared across servers. If one instance updates or invalidates a cached value, the others will not know.
          </p>
          <p>
            Use in-process caching for small, frequently accessed values that rarely change. It is great for speed but not a replacement for Redis. In system design interviews, mention this only as an optimization layer after you have already introduced an external cache.
          </p>
        </section>

        <section className="content-section">
          <h2 id="cache-architectures">Cache Architectures</h2>
          <p>
            Not all caching works the same way. How you read from and write to the cache changes performance, consistency, and complexity. These are the four core cache patterns you should know for system design interviews.
          </p>

          <h3 id="cache-aside">Cache-Aside (Lazy Loading)</h3>
          <p>
            This is the most common caching pattern and the one you should default to in interviews.
          </p>
          <p>
            How it works:
          </p>
          <ol>
            <li>Application checks the cache.</li>
            <li>If the data is there, return it.</li>
            <li>If not, fetch from the database, store it in the cache, and return it.</li>
          </ol>

          <div className="diagram-container">
            <div className="diagram-title">Cache-Aside</div>
            <div className="diagram-flow" style={{ justifyContent: 'center', position: 'relative', height: '160px' }}>
              <div style={{ position: 'absolute', top: '10px', left: '50px' }} className="diagram-box diagram-box--client">App</div>
              <div style={{ position: 'absolute', top: '10px', right: '50px' }} className="diagram-box diagram-box--connection">Cache</div>
              <div style={{ position: 'absolute', bottom: '10px', right: '50px' }} className="diagram-box diagram-box--server">Database</div>
              
              <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                {/* App to Cache */}
                <path d="M 170 35 L 330 35" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="250" y="25" fill="var(--text-muted)" fontSize="12" textAnchor="middle">1. Read (Miss)</text>
                
                {/* App to Database */}
                <path d="M 110 60 L 330 110" stroke="var(--border-color)" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <text x="180" y="100" fill="var(--text-muted)" fontSize="12" textAnchor="middle">2. Read</text>
                
                {/* App writes to Cache */}
                <path d="M 170 45 L 330 45" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arrowhead-primary)" />
                <text x="250" y="60" fill="var(--primary)" fontSize="12" textAnchor="middle">3. Write</text>
              </svg>
            </div>
          </div>

          <p>
            Cache-aside only caches data when needed, which keeps the cache lean. The downside is that a cache miss causes extra latency.
          </p>
          <p>
            If you only remember one caching pattern for interviews, make it cache-aside.
          </p>

          <h3 id="write-through-caching">Write-Through Caching</h3>
          <p>
            With write-through caching, the application writes only to the cache. The cache then synchronously writes to the database before returning to the application. The write operation does not complete until both the cache and database are updated.
          </p>
          <p>
            In practice, this requires a cache implementation that supports write-through, like a caching library with a data store plugin. When you write to the cache, the library handles calling your database write logic before acknowledging the write. Redis itself does not natively support write-through, so you need application code or a framework to implement this pattern.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Write-Through</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">App</div>
              <div className="diagram-arrow">→ <br/><small>Write</small></div>
              <div className="diagram-box diagram-box--connection">Cache</div>
              <div className="diagram-arrow">→ <br/><small>Sync Write</small></div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            The tradeoff is slower writes because the application must wait for both the cache update and the database write to complete. Write-through can also pollute the cache with data that may never be read again.
          </p>
          <p>
            Write-through still suffers from the dual-write problem. If the cache update succeeds but the database write fails, or vice versa, the systems can end up inconsistent. You need retry logic, error handling, or eventually accept that perfect consistency is difficult without distributed transactions.
          </p>
          <p>
            In system design interviews, write-through is less common than cache-aside because it requires specialized caching infrastructure and still has consistency edge cases.
          </p>
          <p>
            Use this when reads must always return fresh data and your system can tolerate slightly slower writes.
          </p>

          <h3 id="write-behind-caching">Write-Behind (Write-Back) Caching</h3>
          <p>
            With write-behind caching, the application writes only to the cache. The cache batches and writes the data to the database asynchronously in the background.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Write-Behind</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">App</div>
              <div className="diagram-arrow">→ <br/><small>Write (Fast)</small></div>
              <div className="diagram-box diagram-box--connection">Cache</div>
              <div className="diagram-arrow">⤏ <br/><small>Async Batch Write</small></div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            This makes writes very fast, but introduces risk. If the cache crashes before flushing, you can lose data. This is best for workloads where occasional data loss is acceptable.
          </p>
          <p>
            Use this when you need high write throughput and eventual consistency is acceptable. Common in analytics and metrics pipelines.
          </p>

          <h3 id="read-through-caching">Read-Through Caching</h3>
          <p>
            With read-through caching, the cache acts as a smart proxy. Your application never talks to the database directly. On a cache miss, the cache itself fetches from the database, stores the data, and returns it.
          </p>
          <p>
            This is the read equivalent of write-through. In both patterns, the cache acts as an intermediary that handles database operations. Read-through manages reads, write-through manages writes. Systems often combine both patterns.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Read-Through</div>
            <div className="diagram-flow" style={{ justifyContent: 'center' }}>
              <div className="diagram-box diagram-box--client">App</div>
              <div className="diagram-arrow">↔ <br/><small>Read</small></div>
              <div className="diagram-box diagram-box--connection">Cache</div>
              <div className="diagram-arrow">↔ <br/><small>Fetch on Miss</small></div>
              <div className="diagram-box diagram-box--server">Database</div>
            </div>
          </div>

          <p>
            This centralizes caching logic but adds complexity and usually requires a specialized caching library or service. It is less common in practice than cache-aside.
          </p>
          <p>
            CDNs are a form of read-through cache. When a CDN gets a cache miss, it fetches from your origin server, caches the result, and returns it. But for application-level caching with Redis, cache-aside is far more common.
          </p>
          <p>
            Generally speaking, there are very few reasons to propose this pattern in system design interviews unless you're discussing CDNs or similar infrastructure.
          </p>
        </section>

        <section className="content-section">
          <h2 id="cache-eviction-policies">Cache Eviction Policies</h2>
          <p>
            Caches have limited memory, so they need a strategy for deciding which entries to remove when full. These strategies are called eviction policies.
          </p>

          <h3 id="lru">LRU (Least Recently Used)</h3>
          <p>
            LRU evicts the item that has not been accessed for the longest time. It tracks access order using a linked list or ring buffer so the least recently used item can be removed in constant time.
          </p>
          <p>
            It is the default in many systems because it adapts well to most workloads where recently used data is likely to be used again.
          </p>

          <h3 id="lfu">LFU (Least Frequently Used)</h3>
          <p>
            LFU evicts the item that has been accessed the least. It maintains a counter for each key and removes the one with the lowest frequency. Some implementations use approximate LFU to avoid the cost of precise frequency tracking.
          </p>
          <p>
            This works well when certain keys are consistently popular over time, like trending videos or top playlists.
          </p>

          <h3 id="fifo">FIFO (First In First Out)</h3>
          <p>
            FIFO evicts the oldest item in the cache based only on insertion time. It can be implemented with a simple queue, but it ignores usage patterns.
          </p>
          <p>
            Because it may evict items that are still hot, it is rarely used in real systems beyond simple caching layers.
          </p>

          <h3 id="ttl">TTL (Time To Live)</h3>
          <p>
            TTL is not an eviction policy by itself. Instead, it sets an expiration time for each key and removes entries that are too old. It is often combined with LRU or LFU to balance freshness and memory usage.
          </p>
          <p>
            TTL is a must have when data must eventually refresh, like API responses or session tokens.
          </p>
        </section>

        <section className="content-section">
          <h2 id="common-caching-problems">Common Caching Problems</h2>
          <p>
            Caching makes systems faster, but it also introduces new failure modes. These problems show up in real systems at scale, and interviewers often use them to test whether you understand the trade-offs of caching, not just the benefits. If you bring up caching in an interview, you should also show that you can handle these edge cases.
          </p>

          <h3 id="cache-stampede">Cache Stampede (Thundering Herd)</h3>
          <p>
            A cache stampede happens when a popular cache entry expires and many requests try to rebuild it at the same time. There is a brief window, even if only a second, where every request misses the cache and goes straight to the database. Instead of one query, you suddenly have hundreds or thousands, which can overload the database.
          </p>

          <div className="diagram-container">
            <div className="diagram-title">Cache Stampede</div>
            <div className="diagram-flow" style={{ flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div className="diagram-box diagram-box--client" style={{ padding: '8px' }}>Req 1</div>
                <div className="diagram-box diagram-box--client" style={{ padding: '8px' }}>Req 2</div>
                <div className="diagram-box diagram-box--client" style={{ padding: '8px' }}>Req 3</div>
                <div className="diagram-box diagram-box--client" style={{ padding: '8px' }}>...Req N</div>
              </div>
              <div className="diagram-arrow">↓↓↓ Cache Miss (Expired) ↓↓↓</div>
              <div className="diagram-box diagram-box--connection" style={{ marginBottom: '16px', background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>Cache (Empty)</div>
              <div className="diagram-arrow">↓↓↓ All hit DB at once ↓↓↓</div>
              <div className="diagram-box diagram-box--server" style={{ background: '#ffebee', borderColor: '#ef5350', color: '#c62828' }}>Database (Overloaded)</div>
            </div>
          </div>

          <p>
            For example, imagine your system caches the homepage feed with a TTL of 60 seconds. When the cache expires at exactly 12:01:00, every request at that moment misses the cache and queries the database. If traffic is high, this spike can overwhelm the database and cause cascading failures.
          </p>
          <p>
            How to handle it:
          </p>
          <ul>
            <li><strong>Request coalescing (single flight):</strong> Allow only one request to rebuild the cache while others wait for the result. This is the most effective solution.</li>
            <li><strong>Cache warming:</strong> Refresh popular keys proactively before they expire. This only helps when using TTL-based expiration. If you invalidate cache on writes instead, warming does not prevent stampedes.</li>
          </ul>

          <h3 id="cache-consistency">Cache Consistency</h3>
          <p>
            Cache consistency problems are some of the most commonly discussed in system design interviews. They happen when the cache and database return different values for the same data. This is common because most systems read from the cache but write to the database first. That creates a window where the cache still holds stale data.
          </p>
          <p>
            For example, if a user updates their profile picture, the new value is written to the database but the old value might still be in the cache. Other users may see the outdated profile picture until the cache eventually refreshes.
          </p>
          <p>
            There is no perfect solution. You choose a strategy based on how fresh the data must be.
          </p>
          <p>
            How to handle it:
          </p>
          <ul>
            <li><strong>Cache invalidation on writes:</strong> Delete the cache entry after updating the database so it gets repopulated with fresh data.</li>
            <li><strong>Short TTLs for stale tolerance:</strong> Let slightly stale data live temporarily if eventual consistency is acceptable.</li>
            <li><strong>Accept eventual consistency:</strong> For feeds, metrics, and analytics, a short delay is usually fine.</li>
          </ul>

          <h3 id="hot-keys">Hot Keys</h3>
          <p>
            A hot key is a cache entry that receives a huge amount of traffic compared to everything else. Even if the cache hit rate is high, a single hot key can overload one cache node or one Redis shard and become a bottleneck.
          </p>
          <p>
            For example, if you are building Twitter and everyone is viewing Taylor Swift’s profile, the cache key for her user data (user:taylorswift) may receive millions of requests per second. That one key can overload a single Redis node even though everything is working “correctly.”
          </p>
          <p>
            How to handle it:
          </p>
          <ul>
            <li><strong>Replicate hot keys:</strong> Store the same value on multiple cache nodes and load balance reads across them.</li>
            <li><strong>Add a local fallback cache:</strong> Keep extremely hot values in-process to avoid pounding Redis.</li>
            <li><strong>Apply rate limiting:</strong> Slow down abusive traffic patterns on specific keys.</li>
          </ul>
          
          <Callout type="tip" title="Pattern: Scaling Reads">
            <p style={{ margin: 0 }}>
              Hot key scenarios in distributed caches is not limited to just caches. It is a common problem in distributed systems when millions of users simultaneously request the same viral content, traditional caching assumptions break down.
            </p>
          </Callout>
        </section>

        <section className="content-section">
          <h2 id="caching-in-system-design-interviews">Caching in System Design Interviews</h2>
          <p>
            Caching comes up in nearly every system design interview, so it's important to know when to bring it up and how to walk through it systematically.
          </p>

          <h3 id="when-to-bring-up-caching">When to Bring Up Caching</h3>
          <p>
            Don't jump straight to caching. You need to establish why it's necessary first.
          </p>
          <p>
            Bring up caching when you identify one of these problems:
          </p>
          <ul>
            <li><strong>Read-heavy workload:</strong> "We're serving 10M daily active users, each making 20 requests per day. That's 200M reads hitting the database. Even with indexes, we're looking at 20-50ms per query. A cache drops that to under 2ms and takes most of the load off the database."</li>
            <li><strong>Expensive queries:</strong> "Computing a user's personalized feed requires joining posts, followers, and likes across multiple tables. That query takes 200ms. We can cache the computed feed for 60 seconds and serve it in 1ms from Redis."</li>
            <li><strong>High database CPU:</strong> "Our database CPU is hitting 80% during peak hours just serving reads. The same queries run over and over. Caching the hot queries will cut database load by 70-80%."</li>
            <li><strong>Latency requirements:</strong> "We need sub-10ms response times for the API. Database queries are taking 30-50ms. We have to cache."</li>
          </ul>
          <p>
            The pattern is simple. Identify the performance problem, quantify it with rough numbers, and explain how caching solves it. You can use our Numbers to Know to get a sense of reasonable database and cache latencies.
          </p>

          <h3 id="how-to-introduce-caching">How to Introduce Caching</h3>
          <p>
            Once you've established the need for caching, walk through your caching strategy systematically:
          </p>
          <ol>
            <li>
              <strong>Identify the bottleneck</strong><br/>
              Start by pointing to the specific problem caching will solve. Is it database load? Query latency? Expensive computations? Be specific about what's slow and why.<br/>
              <em>"User profile queries are hitting the database 500 times per second during peak hours. Each query takes 30ms. That's our bottleneck."</em>
            </li>
            <li>
              <strong>Decide what to cache</strong><br/>
              Not everything should be cached. Focus on data that is read frequently, doesn't change often, and is expensive to fetch or compute.<br/>
              <em>"We'll cache user profiles since they're read on every page load but only updated when users edit their settings. We'll also cache the trending posts feed since it's computed from expensive aggregations but only needs to refresh every minute."</em><br/>
              Think about cache keys. How will you look up cached data? For user profiles, the key might be user:123:profile. For trending posts, it could be trending:posts:global.
            </li>
            <li>
              <strong>Choose your cache architecture</strong><br/>
              Pick a caching pattern that matches your consistency requirements. Write-through makes sense when you need strong consistency. Write-behind works for high-volume writes where you can tolerate some risk.<br/>
              <em>"I'll use cache-aside. On a read, we check Redis first. If it's there, return it. If not, query the database, store the result in Redis, and return it."</em><br/>
              If you're dealing with static content like images or videos, mention CDN caching. If you have extremely hot keys that get hammered, mention in-process caching as an optimization layer.
            </li>
            <li>
              <strong>Set an eviction policy</strong><br/>
              Explain how you'll manage cache size. LRU is the safe default answer. TTL is essential for preventing stale data.<br/>
              <em>"We'll use LRU eviction with Redis and set a TTL of 10 minutes on user profiles. That keeps the cache from growing unbounded while ensuring profiles don't get too stale. If a user updates their profile, we'll invalidate the cache entry immediately."</em>
            </li>
            <li>
              <strong>Address the downsides</strong><br/>
              Caching introduces complexity. Show you've thought about the trade-offs.<br/>
              <strong>Cache invalidation:</strong> How do you keep cached data fresh? Do you invalidate on writes, rely on TTL, or accept eventual consistency?<br/>
              <em>"When a user updates their profile, we'll delete the cache entry so the next read fetches fresh data from the database."</em><br/>
              <strong>Cache failures:</strong> What happens if Redis goes down? Will your database get crushed by the sudden traffic spike?<br/>
              <em>"If Redis is unavailable, requests will fall back to the database. We'll add circuit breakers so we don't overwhelm the database with a stampede. We might also consider keeping a small in-process cache as a last-resort layer."</em><br/>
              <strong>Thundering herd:</strong> What happens when a popular cache entry expires and 1000 requests try to refetch it simultaneously?<br/>
              <em>"For extremely popular keys, we can use probabilistic early expiration or request coalescing so only one request fetches from the database while others wait for that result."</em>
            </li>
          </ol>
          <p>
            Don't list every possible problem. Pick one or two that are relevant to the system you're designing and explain how you'd handle them. For staff-level candidates, focus on the important but non-obvious scenarios rather than burning time on things the interviewer can already assume.
          </p>
        </section>

        <section className="content-section">
          <h2 id="conclusion">Conclusion</h2>
          <p>
            Caching is what you do when reading from the database is too slow or too expensive. It keeps frequently accessed data in fast memory so you can skip the database entirely for most reads.
          </p>
          <p>
            The core trade-off is simple. Caches make reads faster and reduce load on whatever is behind them, but they introduce complexity around staleness and invalidation. Cached data can fall out of sync with the database. Cache failures can crush your database if you're not prepared. Hot keys can create bottlenecks even in distributed caches.
          </p>
          <p>
            In interviews, bring up caching after you've identified a database bottleneck. Walk through what you'll cache, which caching pattern you'll use, how you'll handle eviction, and what happens when things go wrong. CDN caching works for static media, and in-process caching can make sense for extremely hot keys.
          </p>
          <p>
            Most importantly, don't cache everything. Show you understand when caching is worth the complexity and when a well-indexed database is enough.
          </p>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#data-modeling" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Data Modeling</div>
            </div>
          </a>
          <a href="#sharding" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Sharding</div>
            </div>
          </a>
        </nav>
      </article>
    </main>
  );
}
