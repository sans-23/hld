import React from 'react';

export default function CodeBlock({ language, children }) {
  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="code-dot code-dot--red" />
          <span className="code-dot code-dot--yellow" />
          <span className="code-dot code-dot--green" />
        </div>
        <span className="code-block-lang">{language}</span>
        <button className="code-block-copy" onClick={() => navigator.clipboard.writeText(children)}>Copy</button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
