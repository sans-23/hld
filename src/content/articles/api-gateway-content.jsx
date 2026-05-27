import React from 'react';
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

export default function ApiGatewayContent() {
  return (
    <>

        {/* ─── Header ─── */}
        <div className="article-header">
          <div className="breadcrumb">
            <a href="#core">Key Technologies</a>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">API Gateway</span>
          </div>
          <h1>API Gateway</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Learn when and how to effectively incorporate API Gateways into your system design interviews.
          </p>
          <div className="meta-info">
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              12 min read
            </span>
            <span className="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
              Routing & Middleware
            </span>
            <span className="difficulty-badge difficulty-badge--beginner">Beginner</span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            SECTION 1 — What is an API Gateway?
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <div className="video-walkthrough-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <div>
              <div className="video-walkthrough-title">Watch Video Walkthrough</div>
              <div className="video-walkthrough-desc">Watch the author walk through the problem step-by-step</div>
            </div>
          </div>

          <h2 id="what-is-an-api-gateway">What is an API Gateway?</h2>
          <p>
            There's a good chance you've interacted with an API Gateway today, even if you didn't realize it. They're a core component in modern architectures, especially with the rise of microservices.
          </p>
          <p>
            Think of it as the front desk at a luxury hotel. Just as hotel guests don't need to know where the housekeeping office or maintenance room is located, clients shouldn't need to know about the internal structure of your microservices.
          </p>
          <p>
            An API Gateway serves as a single entry point for all client requests, managing and routing them to appropriate backend services. Just as a hotel front desk handles check-ins, room assignments, and guest requests, an API Gateway manages centralized middleware like authentication, routing, and request handling.
          </p>
          <p>
            The evolution of API Gateways parallels the rise of microservices architecture. As monolithic applications were broken down into smaller, specialized services, the need for a centralized point of control became evident. Without an API Gateway, clients would need to know about and communicate with multiple services directly – imagine hotel guests having to track down individual staff members for each request.
          </p>
          <p>
            API gateways are thin, relatively simple components that serve a clear purpose. In this deep dive, we'll focus on what you need to know for system design interviews without overcomplicating things.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Core Responsibilities
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="core-responsibilities">Core Responsibilities</h2>
          <p>
            The gateway's primary function is request routing – determining which backend service should handle each incoming request. But this isn't all they do.
          </p>
          <p>
            Funny enough, I'll often have candidates introduce a gateway in a system design interview and emphasize that it will do all this middleware stuff but never mention the core reason they need it -- request routing.
          </p>
          <p>
            Nowadays, API gateways are also used to handle cross-cutting concerns or middleware like authentication, rate limiting, caching, SSL termination, and more.
          </p>

          <h3 id="tracing-a-request">Tracing a Request</h3>
          <p>
            Let's walk through a request from start to finish. Incoming requests come into the API Gateway from clients, usually via HTTP but they can be gRPC or any other protocol. From there, the gateway will apply any middleware you've configured and then route the request to the appropriate backend service.
          </p>
          <ol>
            <li>Request validation</li>
            <li>API Gateway applies middleware (auth, rate limiting, etc.)</li>
            <li>API Gateway routes the request to the appropriate backend service</li>
            <li>Backend service processes the request and returns a response</li>
            <li>API Gateway transforms the response and returns it to the client</li>
            <li>Optionally cache the response for future requests</li>
          </ol>
          <p>
            Let's take a closer look at each step.
          </p>

          {/* Diagram: Request Lifecycle */}
          <div className="diagram-container">
            <div className="diagram-title">API Gateway Request Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
                
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ background: 'var(--bg-accent)', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>1. ENTRY</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Client Request</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>HTTP GET /users/123/profile</span>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', color: '#d97706', marginBottom: '8px' }}>2. VALIDATE & MIDDLEWARE</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Centralized Checks</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JWT verification, rate limits, CORS</span>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ background: '#dbeafe', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '8px' }}>3. ROUTING & PROTOCOL</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Downstream Dispatch</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Find route, translate to gRPC / RPC</span>
                </div>

                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <div style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', display: 'inline-block', fontSize: '0.7rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '8px' }}>4. CACHING & RETURN</div>
                  <strong style={{ display: 'block', fontSize: '0.85rem' }}>Response Mapping</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cache matching responses, return JSON</span>
                </div>

              </div>
            </div>
          </div>

          <h4 id="request-validation">1) Request Validation</h4>
          <p>
            Before doing anything else, the API Gateway checks if incoming requests are properly formatted and contain all the required information. This validation includes checking that the request URL is valid, required headers are present, and the request body (if any) matches the expected format.
          </p>
          <p>
            This early validation is important because it helps catch obvious issues before they reach your backend services. For example, if a mobile app sends a malformed JSON payload or forgets to include a required API key, there's no point in routing that request further into your system. The gateway can quickly reject it and send back a helpful error message, saving your backend services from wasting time and resources on requests that were never going to succeed.
          </p>

          <h4 id="middleware">2) Middleware</h4>
          <p>
            API Gateways can be configured to handle various middleware tasks. For example, you might want to:
          </p>
          <ul>
            <li>Authenticate requests using JWT tokens</li>
            <li>Limit request rates to prevent abuse</li>
            <li>Terminate SSL connections</li>
            <li>Log and monitor traffic</li>
            <li>Compress responses</li>
            <li>Handle CORS headers</li>
            <li>Whitelist/blacklist IPs</li>
            <li>Validate request sizes</li>
            <li>Handle response timeouts</li>
            <li>Version APIs</li>
            <li>Throttle traffic</li>
            <li>Integrate with service discovery</li>
          </ul>
          <p>
            Of these, the most popular and relevant to system design interviews are authentication, rate limiting, and ip whitelisting/blacklisting. If you do opt to mention middleware, just make sure it's with a purpose and that you don't spend too much time here.
          </p>
          <p>
            My suggestion when introducing a API Gateway to your design is to simply mention, "I'll add a API Gateway to handle routing and basic middleware" and move on.
          </p>

          <h4 id="routing">3) Routing</h4>
          <p>
            The gateway maintains a routing table that maps incoming requests to backend services. This mapping is typically based on a combination of:
          </p>
          <ul>
            <li>URL paths (e.g., <code>/users/*</code> routes to the user service)</li>
            <li>HTTP methods (e.g., GET, POST, etc.)</li>
            <li>Query parameters</li>
            <li>Request headers</li>
          </ul>
          <p>
            For example, a simple routing configuration might look like:
          </p>
          <CodeBlock language="yaml">{`routes:
  - path: /users/*
    service: user-service
    port: 8080
  - path: /orders/*
    service: order-service
    port: 8081
  - path: /payments/*
    service: payment-service
    port: 8082`}</CodeBlock>
          <p>
            The gateway will quickly look up which backend service to send the request to based on the path, method, query parameters, and headers and send the request onward accordingly.
          </p>

          <h4 id="backend-communication">4) Backend Communication</h4>
          <p>
            While most services communicate via HTTP, in some cases your backend services might use a different protocol like gRPC for internal communication. When this happens, the API Gateway can handle translating between protocols, though this is relatively uncommon in practice.
          </p>
          <p>
            The gateway would, thus, transform the request into the appropriate protocol before sending it to the backend service. This is nice because it allows your services to use whatever protocol or format is most efficient without clients needing to know about it.
          </p>

          <h4 id="response-transformation">5) Response Transformation</h4>
          <p>
            The gateway will transform the response from the backend service into the format requested by the client. This transformation layer allows your internal services to use whatever protocol or format is most efficient, while presenting a clean, consistent API to clients.
          </p>
          <p>
            For example:
          </p>
          <CodeBlock language="javascript">{`// Client sends a HTTP GET request
GET /users/123/profile

// API Gateway transforms this into an internal gRPC call
userService.getProfile({ userId: "123" })

// Gateway transforms the gRPC response into JSON and returns it to the client over HTTP
{
  "userId": "123",
  "name": "John Doe",
  "email": "john@example.com"
}`}</CodeBlock>

          <h4 id="caching">6) Caching</h4>
          <p>
            Before sending the response back to the client, the gateway can optionally cache the response. This is useful for frequently accessed data that doesn't change often and, importantly, is not user specific. If your expectation is that a given API request will return the same result for a given input, caching it makes sense.
          </p>
          <p>
            The API Gateway can implement various caching strategies too. For example:
          </p>
          <ul>
            <li><strong>Full Response Caching</strong>: Cache entire responses for frequently accessed endpoints</li>
            <li><strong>Partial Caching</strong>: Cache specific parts of responses that change infrequently</li>
            <li><strong>Cache Invalidation</strong>: Use TTL or event-based invalidation</li>
          </ul>
          <p>
            In each case, you can either cache the response in memory or in a distributed cache like Redis.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Scaling
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="scaling-an-api-gateway">Scaling an API Gateway</h2>
          <p>
            When discussing API Gateway scaling in interviews, there are two main dimensions to consider: handling increased load and managing global distribution.
          </p>

          <h3 id="horizontal-scaling">Horizontal Scaling</h3>
          <p>
            The most straightforward approach to handling increased load is horizontal scaling. API Gateways are typically stateless, making them ideal candidates for horizontal scaling. You can add more gateway instances behind a load balancer to distribute incoming requests.
          </p>
          <p>
            While API Gateways are primarily known for routing and middleware functionality, they often include load balancing capabilities. However, it's important to understand the distinction:
          </p>
          <ul>
            <li><strong>Client-to-Gateway Load Balancing</strong>: This is typically handled by a dedicated load balancer in front of your API Gateway instances (like AWS ELB or NGINX).</li>
            <li><strong>Gateway-to-Service Load Balancing</strong>: The API Gateway itself can perform load balancing across multiple instances of backend services.</li>
          </ul>
          <p>
            This can typically be abstracted away during an interview. Drawing a single box to handle "API Gateway and Load Balancer" is usually sufficient. You don't want to get bogged down in the details of your entry points as they're more likely to be a distraction from the core functionality of your system.
          </p>

          <h3 id="global-distribution">Global Distribution</h3>
          <p>
            Another option that works well particularly for large applications with users spread across the globe is to deploy API Gateways closer to your users, similar to how you would deploy a CDN. This typically involves:
          </p>
          <ul>
            <li><strong>Regional Deployments</strong>: Deploy gateway instances in multiple geographic regions</li>
            <li><strong>DNS-based Routing</strong>: Use GeoDNS to route users to the nearest gateway</li>
            <li><strong>Configuration Synchronization</strong>: Ensure routing rules and policies are consistent across regions</li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Popular Gateways
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="popular-api-gateways">Popular API Gateways</h2>
          <p>
            Let's take a look at some of the most popular API Gateways.
          </p>

          <h3 id="managed-services">Managed Services</h3>
          <p>
            Cloud providers offer fully managed API Gateway solutions that integrate well with their ecosystems. This is by far the easiest option but also the most expensive.
          </p>
          <ul>
            <li><strong>AWS API Gateway</strong>
              <ul>
                <li>Seamless integration with AWS services</li>
                <li>Supports REST and WebSocket APIs</li>
                <li>Built-in features like:
                  <ul>
                    <li>Request throttling</li>
                    <li>API keys and usage plans</li>
                    <li>AWS Lambda integration</li>
                    <li>CloudWatch monitoring</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><strong>Azure API Management</strong>
              <ul>
                <li>Strong OAuth and OpenID Connect support</li>
                <li>Policy-based configuration</li>
                <li>Developer portal for API documentation</li>
              </ul>
            </li>
            <li><strong>Google Cloud Endpoints</strong>
              <ul>
                <li>Deep integration with GCP services</li>
                <li>Strong gRPC support</li>
                <li>Automatic OpenAPI documentation</li>
              </ul>
            </li>
          </ul>

          <h3 id="open-source-solutions">Open Source Solutions</h3>
          <p>
            For teams wanting more control or running on-premises:
          </p>
          <ul>
            <li><strong>Kong</strong>
              <ul>
                <li>Built on NGINX</li>
                <li>Extensive plugin ecosystem</li>
                <li>Supports both traditional and service mesh deployments</li>
              </ul>
            </li>
            <li><strong>Tyk</strong>
              <ul>
                <li>Native support for GraphQL</li>
                <li>Built-in API analytics</li>
                <li>Multi-data center capabilities</li>
              </ul>
            </li>
            <li><strong>Express Gateway</strong>
              <ul>
                <li>JavaScript/Node.js based</li>
                <li>Lightweight and developer-friendly</li>
                <li>Good for Node.js microservices</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 5 — When to Propose
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="when-to-propose-an-api-gateway">When to Propose an API Gateway</h2>
          <p>
            Ok cool, but when should you use an API Gateway in your interview?
          </p>
          <p>
            The TLDR is: use it when you have a microservices architecture and don't use it when you have a simple client-server architecture.
          </p>
          <p>
            With a microservices architecture, an API Gateway becomes almost essential. Without one, clients would need to know about and communicate with multiple services directly, leading to tighter coupling and more complex client code. The gateway provides a clean separation between your internal service architecture and your external API surface.
          </p>
          <p>
            However, it's equally important to recognize when an API Gateway might be overkill. For simple monolithic applications or systems with a single client type, introducing an API Gateway adds unnecessary complexity.
          </p>
          <p>
            I've mentioned this throughout, but I want it to be super clear. While it's important to understand every component you introduce into your design, the API Gateway is not the most interesting. There is a far greater chance that you are making a mistake by spending too much time on it than not enough.
          </p>
          <p>
            Get it down, say it will handle routing and middleware, and move on.
          </p>
        </section>

        {/* ─── Article Navigation ─── */}
        <nav className="article-nav">
          <a href="#kafka" className="article-nav-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            <div>
              <div className="article-nav-label">Previous</div>
              <div className="article-nav-title">Kafka</div>
            </div>
          </a>
          <a href="#cassandra" className="article-nav-btn article-nav-btn--next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <div>
              <div className="article-nav-label">Next</div>
              <div className="article-nav-title">Cassandra</div>
            </div>
          </a>
        </nav>
      
    </>
  );
}
