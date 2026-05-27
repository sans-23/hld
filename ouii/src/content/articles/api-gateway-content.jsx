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
            <span className="breadcrumb-current">API Gateway</span>
          </div>
          <h1>API Gateway</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
            Master the role of API Gateways in microservices architectures. Learn about request routing, centralized middleware, protocol translation, caching, and scalability strategies for your system design interviews.
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
            An <strong>API Gateway</strong> serves as a single entry point for all client requests into a system. Instead of client applications directly communicating with dozens of internal microservices, they send all requests to the gateway, which manages routing, validation, and common middleware concerns.
          </p>
          <p>
            Think of it as a hotel's front desk. Guests don't need to know the housekeeping office number or walk to the maintenance department for help. They talk to the front desk, which handles check-ins, validation, and coordinates with internal staff behind the scenes.
          </p>
          <p>
            By decoupling client applications from internal services, the API Gateway enables internal services to evolve, scale, and partition independently without impacting client integration.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — Core Responsibilities
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="core-responsibilities">Core Responsibilities</h2>
          <p>
            While request routing is the primary function, modern API gateways also act as centralized hubs for cross-cutting middleware. In interviews, remember that the core reason to propose a gateway is <strong>request routing</strong>; middleware is a beneficial addition.
          </p>

          <h3 id="tracing-a-request">Tracing a Request Flow</h3>
          <p>
            Let's trace how an incoming request travels from a client through the gateway to the backend:
          </p>

          <div className="diagram-container">
            <div className="diagram-title">API Gateway Request Lifecycle & Flow</div>
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
              <div style={{ background: 'var(--bg-sidebar)', padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.78rem', width: '100%', textAlign: 'center', color: 'var(--text-main)' }}>
                <strong>Decoupled Architecture:</strong> Clients only communicate with the public gateway. The gateway hides the private ports and locations of internal microservices, mapping requests dynamically.
              </div>
            </div>
          </div>

          <h3 id="request-validation">1. Request Validation</h3>
          <p>
            The gateway immediately inspects the incoming request for structural correctness, required headers, query parameters, and valid payloads. Catching and rejecting malformed requests early prevents invalid operations from wasting internal bandwidth and database compute resources.
          </p>

          <h3 id="middleware">2. Centralized Middleware</h3>
          <p>
            Instead of implementing repetitive logic in every microservice, the gateway provides a single location to handle cross-cutting middleware tasks:
          </p>
          <ul>
            <li><strong>Authentication &amp; Authorization:</strong> Decodes and verifies incoming tokens (like JWT) before routing requests.</li>
            <li><strong>Rate Limiting &amp; Throttling:</strong> Controls request rates using algorithms (like Token Bucket) to prevent service exhaustion.</li>
            <li><strong>IP Whitelisting &amp; Blacklisting:</strong> Rejects untrusted clients or requests from specific IP ranges.</li>
            <li><strong>SSL Termination:</strong> Handles HTTPS decryption, allowing internal services to communicate over plain HTTP, simplifying certificate management.</li>
          </ul>

          <h3 id="routing">3. Request Routing</h3>
          <p>
            The gateway evaluates the request context (URL path, method, headers) against its routing table to dispatch it to the correct backend service instance.
          </p>
          <CodeBlock language="yaml">{`# Example API Gateway Route Configuration
routes:
  - path: /users/*
    service: user-service
    port: 8080
  - path: /orders/*
    service: order-service
    port: 8081
  - path: /payments/*
    service: payment-service
    port: 8082`}</CodeBlock>

          <h3 id="backend-communication">4. Backend Communication &amp; Protocol Translation</h3>
          <p>
            Client applications typically communicate over public HTTP/JSON APIs. Internal microservices, however, might use more performant protocols like **gRPC** or raw TCP. The API Gateway acts as a translation proxy: receiving public HTTP requests and transforming them into internal gRPC calls before sending them downstream.
          </p>

          <h3 id="response-transformation">5. Response Transformation</h3>
          <p>
            Similarly, when internal services return their responses, the gateway can transform public payload structures, filter out internal database IDs, and compile JSON formats to send back to client applications.
          </p>
          <CodeBlock language="json">{`// Client sends a HTTP GET request
GET /users/123/profile

// API Gateway translates this to an internal RPC call
userService.getProfile({ userId: "123" })

// Gateway transforms the response back into client-friendly JSON
{
  "userId": "123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}`}</CodeBlock>

          <h3 id="caching">6. Caching Responses</h3>
          <p>
            To optimize performance, the gateway can cache responses to frequently requested, non-user-specific endpoints (like static product details or regional store lists). Caching responses at the gateway layer drastically reduces workload spikes on databases and microservices.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3 — Scaling
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="scaling-an-api-gateway">Scaling an API Gateway</h2>
          <p>
            When scaling API Gateways to handle heavy request volume in system design, focus on two dimensions: horizontal scaling and geographic distribution.
          </p>

          <h3 id="horizontal-scaling">Horizontal Scaling</h3>
          <p>
            Because API gateways are stateless, they can be scaled horizontally with ease. Simply add multiple gateway instances and place a Layer 4/Layer 7 Load Balancer (like AWS ELB or NGINX) in front of them to distribute incoming traffic.
          </p>
          <p>
            In your interview diagrams, drawing a single consolidated box representing "API Gateway &amp; Load Balancer" is often sufficient. Don't get distracted by configuring entry-point details unless requested by the interviewer.
          </p>

          <h3 id="global-distribution">Global Distribution (Geo-Routing)</h3>
          <p>
            For global applications, distribute API Gateway instances across multiple geographic regions closer to your users. Use **GeoDNS** (like Route53) to route client requests to the nearest gateway instance, reducing latency and round-trip times.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 4 — Popular Gateways
            ═══════════════════════════════════════════════ */}
        <section className="content-section">
          <h2 id="popular-api-gateways">Popular API Gateways</h2>
          <p>
            When implementing API Gateways, you can choose between managed cloud services and self-hosted open-source software:
          </p>
          <ul>
            <li><strong>Managed Cloud Services (Easiest to scale, vendor-specific):</strong>
              <ul>
                <li><strong>AWS API Gateway:</strong> Highly integrated with AWS Lambda, CloudWatch, and supports REST/WebSocket routing.</li>
                <li><strong>Azure API Management:</strong> Strong policy-based configuration and OAuth support.</li>
                <li><strong>Google Cloud Endpoints:</strong> Excellent integration with Google Cloud Run/Compute and native gRPC routing.</li>
              </ul>
            </li>
            <li><strong>Open Source Solutions (More control, open standard):</strong>
              <ul>
                <li><strong>Kong:</strong> Highly performant gateway built on NGINX with a large plug-in ecosystem.</li>
                <li><strong>Tyk:</strong> Lightweight gateway featuring native GraphQL support and built-in API analytics.</li>
                <li><strong>Express Gateway:</strong> JavaScript-based gateway that is lightweight and highly customizable for Node.js environments.</li>
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
            The decision to include an API Gateway is straightforward:
          </p>
          <ul>
            <li><strong>Propose it</strong> when designing microservices architectures with multiple independent backend services. It decouples the client from internal configurations.</li>
            <li><strong>Avoid it</strong> for simple client-server or monolithic applications, where it adds redundant hops, latency, and unnecessary architectural complexity.</li>
          </ul>
          <Callout type="warning" title="Interview Warning: Keep it Brief">
            <p style={{ margin: 0 }}>
              An API Gateway is a utility component. Do not spend too much time designing it or discussing its internals. Simply mention, "I'll introduce an API Gateway to handle request routing and common middleware like auth and rate limiting," and immediately move to your system's core database and service scaling challenges.
            </p>
          </Callout>
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
