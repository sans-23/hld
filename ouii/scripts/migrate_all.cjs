const fs = require('fs');
const path = require('path');

// Read MainContent.jsx to get the mappings
const mainContentPath = 'src/components/MainContent.jsx';
let mainContent = fs.readFileSync(mainContentPath, 'utf8');

// Regex to find all imports like: import DbIndexing from './articles/DbIndexing';
// And the if statements like: if (articleId === 'db-indexing') { return <DbIndexing />; }

const importRegex = /import (\w+) from '.\/articles\/(\w+)';/g;
const ifRegex = /if \(articleId === '([\w-]+)'\) \{\s+return <(\w+) \/>;\s+\}/g;

const componentToId = {};
let match;
while ((match = ifRegex.exec(mainContent)) !== null) {
  const articleId = match[1];
  const componentName = match[2];
  componentToId[componentName] = articleId;
}

// Ensure networking is skipped because it's already done
delete componentToId['NetworkingEssentials'];

for (const [componentName, articleId] of Object.entries(componentToId)) {
  const jsxPath = `src/components/articles/${componentName}.jsx`;
  const mdxPath = `src/content/articles/${articleId}.mdx`;

  if (!fs.existsSync(jsxPath)) {
    console.log(`Skipping ${jsxPath} (not found)`);
    continue;
  }

  let content = fs.readFileSync(jsxPath, 'utf8');

  // Remove the import statements at the top
  content = content.replace(/^import.*?;\n/gm, '');

  // Remove the function wrapper
  const wrapperRegex = new RegExp(`export default function ${componentName}\\(\\) \\{\\s*return \\(\\s*<main className="content-scrollable">\\s*<article>`, 's');
  content = content.replace(wrapperRegex, '');
  content = content.replace(/<\/article>\s*<\/main>\s*\);\s*\}/s, '');

  // Write the result
  const header = `import CodeBlock from '../../components/ui/CodeBlock';\nimport Callout from '../../components/ui/Callout';\n\n`;
  fs.writeFileSync(mdxPath, header + content);
  
  // Also delete the original jsx file
  fs.unlinkSync(jsxPath);

  // Update MainContent import
  const importToReplace = new RegExp(`import ${componentName} from './articles/${componentName}';`, 'g');
  mainContent = mainContent.replace(importToReplace, `import ${componentName} from '../content/articles/${articleId}.mdx';`);

  console.log(`Migrated ${componentName} -> ${articleId}.mdx`);
}

// Write the updated MainContent.jsx
fs.writeFileSync(mainContentPath, mainContent);
console.log('All remaining articles migrated successfully!');
