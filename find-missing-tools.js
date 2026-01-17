// Script to find missing tool mappings
const fs = require('fs');
const path = require('path');

// Read tools.ts to extract all tool hrefs
const toolsContent = fs.readFileSync(path.join(__dirname, 'src/data/tools.ts'), 'utf-8');
const wrapperContent = fs.readFileSync(path.join(__dirname, 'src/components/ToolClientWrapper.tsx'), 'utf-8');

// Extract all hrefs from tools.ts
const hrefMatches = toolsContent.matchAll(/href:\s*'\/tools\/([^']+)'/g);
const allToolSlugs = [...new Set([...hrefMatches].map(match => match[1]))];

// Extract all mapped slugs from ToolClientWrapper.tsx
const mappedMatches = wrapperContent.matchAll(/'([^']+)':\s*(?:dynamicTool|[\(\w])/g);
const mappedSlugs = new Set([...mappedMatches].map(match => match[1]));

// Find missing tools
const missingTools = allToolSlugs.filter(slug => !mappedSlugs.has(slug));

console.log('Total tools in tools.ts:', allToolSlugs.length);
console.log('Total mapped tools:', mappedSlugs.size);
console.log('\nMissing tools (' + missingTools.length + '):');
missingTools.forEach(tool => console.log('  -', tool));
