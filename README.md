# Ready4Interview — System Design Interview Prep

Ready4Interview is a curated, high-value tech interview preparation platform focused on High-Level System Design. The project is built with React, Vite, and MDX, and is hosted on Netlify. Every commit pushed to the `main` branch triggers an automated production deployment.

This document serves as the developer documentation and AI Collaborator guide for understanding the project's architecture, styling, content tone, and publishing flow.

---

## 🛠️ Project Setup & Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
Install the project dependencies:
```bash
npm install
```

### Running Locally
Start the local Vite development server:
```bash
npm run dev
```
By default, the application will run at [http://localhost:5173](http://localhost:5173).

### Building for Production
To build the static bundle:
```bash
npm run build
```

---

## 🏗️ Architecture & Navigation

The application uses a custom-designed documentation layout composed of a top navigation bar, a left navigation sidebar, a central content area, and a right table-of-contents sidebar.

### Key Directories
* `src/config/`: Contains app configurations.
  * [`navigation.js`](file:///Users/sans/ready4interview/src/config/navigation.js): The single source of truth for the left sidebar navigation items, sections, and progress tracker.
* `src/components/`: Contains core UI layout components.
  * [`MainContent.jsx`](file:///Users/sans/ready4interview/src/components/MainContent.jsx): Dynamic router-aware component that maps the URL `:articleId` to the correct article component.
  * [`RightSidebar.jsx`](file:///Users/sans/ready4interview/src/components/RightSidebar.jsx): Side navigation containing the `TOC_BY_ARTICLE` map, which defines the Table of Contents structure for each article to enable active-section highlighting (scroll-spy).
  * `ui/`: Common components such as [`Callout.jsx`](file:///Users/sans/ready4interview/src/components/ui/Callout.jsx) and [`CodeBlock.jsx`](file:///Users/sans/ready4interview/src/components/ui/CodeBlock.jsx).
* `src/content/articles/`: Stores the actual content.
  * Historically structured using two files: `<id>.mdx` as a React wrapper importing `<id>-content.jsx` which contains raw JSX/HTML tags.
  * **Optimized Approach (Recommended for New Content):** Write a single unified `<id>.mdx` file. Since Vite is configured with MDX support, you can write standard Markdown interspersed with JSX components (`CodeBlock`, `Callout`, custom HTML diagrams) directly in the `.mdx` file.

---

## ✍️ Content Tone & Writing Style Guidelines

The notes are designed to help candidates prepare for rigorous system design interviews. They should be comprehensive, authoritative, yet concise and highly structured for quick recall.

### 1. Structure over Yapping
- **No fluff:** Avoid long preambles. Start with the core problem, why it is a bottleneck, and immediately pivot to engineering choices, tradeoffs, and heuristics.
- **Visuals & Tables:** Use comparison matrices (tables) and structured flowcharts or CSS diagrams to convey architecture instead of long paragraphs.
- **Formatting:** Use **bolding** extensively for key terms, metrics, and technology names to make the text highly scannable.

### 2. Standard Elements
- **Difficulty Badges:** Mark each article with a badge (e.g., `difficulty-badge--beginner`, `difficulty-badge--intermediate`, `difficulty-badge--advanced`).
- **Metadata:** Include reading time and category markers at the top of each article.
- **Callouts:**
  - Use `<Callout type="info">` for general definitions or context.
  - Use `<Callout type="tip">` for actionable interview strategies or specific heuristics.
  - Use `<Callout type="warning">` for critical caveats, common candidate mistakes, or trade-off warnings.
- **CodeBlocks:** Provide concrete implementations (SQL queries, system configurations, API payloads) inside `<CodeBlock language="...">`.

---

## 🤖 AI Collaborator Blueprint: Adding a New Topic

When generating new system design notes, follow this step-by-step blueprint to ensure a seamless integration.

### Step 1: Update Navigation Config
Add the new topic under the appropriate section in [`src/config/navigation.js`](file:///Users/sans/ready4interview/src/config/navigation.js). Change its status from `'locked'` to `'default'`.

```javascript
{ id: 'my-topic', label: 'My Topic Label', href: '/my-topic', status: 'default' }
```

### Step 2: Register in MainContent
Import your new `.mdx` file and add the rendering logic in [`src/components/MainContent.jsx`](file:///Users/sans/ready4interview/src/components/MainContent.jsx):

```javascript
import MyTopic from '../content/articles/my-topic.mdx';
// ...
if (articleId === 'my-topic') return <MyTopic />;
```

### Step 3: Configure Table of Contents
Add a mapping for your article's headings in the `TOC_BY_ARTICLE` constant inside [`src/components/RightSidebar.jsx`](file:///Users/sans/ready4interview/src/components/RightSidebar.jsx):

```javascript
'my-topic': [
  { id: 'core-problem', label: 'The Core Problem' },
  { id: 'architectural-patterns', label: '— Architectural Patterns' },
  { id: 'trade-offs', label: '— Key Trade-Offs' },
  { id: 'interview-heuristics', label: 'Interview Heuristics' },
],
```

### Step 4: Write the Article File
Create `src/content/articles/my-topic.mdx` and write your structured, high-value guide. Here is the optimized template:

```mdx
import CodeBlock from '../../components/ui/CodeBlock';
import Callout from '../../components/ui/Callout';

{/* ─── Header ─── */}
<div className="article-header">
  <div className="breadcrumb">
    <a href="#core-concepts">Core Concepts</a>
    <span className="breadcrumb-separator">›</span>
    <span className="breadcrumb-current">My Topic Title</span>
  </div>
  <h1>My Topic Title</h1>
  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '16px', lineHeight: '1.6' }}>
    Brief, engaging 1-sentence summary of the topic.
  </p>
  <div className="meta-info">
    <span className="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      10 min read
    </span>
    <span className="meta-item">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
      System Design Patterns
    </span>
    <span className="difficulty-badge difficulty-badge--intermediate">Intermediate</span>
  </div>
</div>

{/* ─── Video Banner ─── */}
<div className="video-walkthrough-banner">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
  <div>
    <div className="video-walkthrough-title">Watch Video Walkthrough</div>
    <div className="video-walkthrough-desc">Watch the author walk through the problem step-by-step</div>
  </div>
</div>

## The Core Problem {#core-problem}

Describe the fundamental challenge in 2-3 punchy sentences. 

<Callout type="warning">
  Highlight a critical trap or anti-pattern candidates often fall into here.
</Callout>

...
```

*Note: Headings in MDX can be assigned explicit IDs using the syntax `{#id}` if configured, or written as standard HTML tags if required, like `<h2 id="core-problem">The Core Problem</h2>` to guarantee alignment with `RightSidebar.jsx`.*

---

## 🔒 Environment Variables & Deployment (Firebase + Netlify)

The application supports optional **Google Sign-In** and **Progress Persistence** powered by Firebase Authentication and Firestore. 

### Local Configuration
1. Copy the `.env.example` file to create a local `.env` configuration:
   ```bash
   cp .env.example .env
   ```
2. Fill in the credentials using the details from your **Firebase Console** (Project Settings):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyA...
   VITE_FIREBASE_AUTH_DOMAIN=ready4interview.firebaseapp.com
   ...
   ```

#### How to Retrieve Credentials from the Firebase Console:
1. Go to the [Firebase Console](https://console.firebase.google.com/) and select your project.
2. In the top-left sidebar next to **Project Overview**, click the **Gear Icon** (Settings) and select **Project Settings**.
3. Under the **General** tab, scroll down to the **Your apps** section (if you haven't added a web app yet, click the web icon `</>` to register one).
4. Under your web app, select the **Config** radio button. You will see a JavaScript config object:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
5. Map these keys directly to your environment configuration:
   - `apiKey` ➔ `VITE_FIREBASE_API_KEY`
   - `authDomain` ➔ `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` ➔ `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` ➔ `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` ➔ `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` ➔ `VITE_FIREBASE_APP_ID`

*Note: If no `.env` credentials are set, the application automatically runs in **Local-only fallback mode**, saving topic completion statuses to the browser's `LocalStorage` without throwing errors.*

### Netlify Production Configuration
Since we do not commit `.env` configuration files to GitHub, you must configure the environment variables directly in Netlify to enable the Firebase sync on your deployed site:

1. Log in to your **Netlify Dashboard**.
2. Go to: **Site Configuration** > **Environment variables** (under Build & Deploy).
3. Click **Add a variable** > **Add single variable**.
4. Input the keys and values exactly as shown in `.env.example`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. Save the variables and trigger a new deploy (or push a commit to GitHub). 

*During Vite's build phase (`npm run build`), it automatically bundles environment variables prefixed with `VITE_` into your static client-side bundle, allowing Google Sign-in to connect directly from the user's browser.*
