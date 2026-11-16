const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const postcss = require('postcss');
const selectors = require('postcss-selector-parser');
const { selectorSpecificity, compare } = require('@csstools/selector-specificity');

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const assets = files('.next/static');
const css = assets.filter(p => p.endsWith('.css')).map(p => fs.readFileSync(p, 'utf8')).join('\n');
const rules = [];
postcss.parse(css).walkRules(rule => {
  const declarations = Object.fromEntries((rule.nodes || []).filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
  try { selectors().astSync(rule.selector).each(selector => rules.push({ selector: selector.toString(), specificity: selectorSpecificity(selector), declarations })); } catch { /* @keyframe steps are not selectors */ }
});
const highest = list => list.reduce((best, next) => !best || compare(next.specificity, best.specificity) > 0 ? next : best, null);
const heading = highest(rules.filter(r => /heroTitle/.test(r.selector) && r.declarations['font-size']));
const headingReset = highest(rules.filter(r => /^h1(?:\W|$)/.test(r.selector) && r.declarations['font-size'] === 'inherit'));
assert(heading && headingReset, 'Expected both authored hero heading and Tailwind heading reset');
console.log('Heading:', heading.specificity, 'Reset:', headingReset.specificity);
assert(compare(heading.specificity, headingReset.specificity) > 0, 'Preflight overrides the authored hero heading');
const section = highest(rules.filter(r => /(?:aj-section|__section)(?:\W|$)/.test(r.selector) && (r.declarations['padding-block'] || r.declarations['padding-top'])));
const reset = highest(rules.filter(r => r.declarations.padding === '0' && r.declarations.margin === '0' && !/[a-zA-Z]/.test(r.selector.replace(/:not\([^)]*\)/g, ''))));
assert(section && reset, 'Expected section spacing and universal reset');
assert(compare(section.specificity, reset.specificity) > 0, 'Preflight overrides component spacing');
assert(assets.some(p => p.endsWith('.woff2')), 'Font files must be self-hosted in the build');
assert(/Cairo/i.test(css), 'Cairo font definition must be included');
const source = fs.readFileSync('src/components/brand/public.css', 'utf8');
assert(!/overflow-x\s*:\s*(hidden|clip)/.test(fs.readFileSync('src/app/globals.css', 'utf8') + source), 'Do not conceal horizontal layout errors');
assert(source.includes('minmax(0, 1fr)') && source.includes('min-width: 0'), 'Responsive grid items must be allowed to shrink');
console.log('Foundation checks passed: cascade, spacing, grid constraints and local font assets.');
