const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const source = fs.readFileSync('src/components/ui/Accordion.tsx', 'utf8')
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText
const box = {
  exports: {},
  require(name) {
    if (name === '@/lib/utils') return { cn: (...classes) => classes.filter(Boolean).join(' ') }
    if (name === './Icons') return { ChevronDownIcon: () => React.createElement('svg', { 'aria-hidden': 'true' }) }
    return require(name)
  },
}
vm.runInNewContext(output, box)
for (const open of [false, true]) {
  const html = renderToStaticMarkup(
    React.createElement(box.exports.AccordionItem, { title: 'عنوان', defaultOpen: open }, React.createElement('a', { href: '/subjects' }, 'محتوى')),
  )
  assert(html.includes(`aria-expanded="${open}"`))
  assert(html.includes(`aria-hidden="${!open}"`))
  assert.equal(html.includes('inert=""'), !open)
  assert(html.includes('محتوى'), 'Panel remains mounted for smooth open/close')
  const controls = html.match(/aria-controls="([^"]+)"/)[1]
  assert(html.includes(`id="${controls}"`))
}
const shapes = fs.readFileSync('src/components/brand/shape-system.css', 'utf8')
for (const token of ['--aj-radius-control: 12px', '--aj-radius-card: 22px', '--aj-radius-feature: 64px 20px 64px 20px'])
  assert(shapes.includes(token))
assert(shapes.includes('grid-template-rows: 0fr'))
assert(shapes.includes('grid-template-rows: 1fr'))
assert(shapes.includes('translateY(-5px)'))
assert(shapes.includes('scale(1.03)'))
assert(shapes.includes('prefers-reduced-motion'))
const motion = fs.readFileSync('src/lib/motion.ts', 'utf8')
assert(motion.includes('translateY(20px)'))
assert(!motion.includes('opacity: 0,'))
const home = fs.readFileSync('.next/server/app/index.html', 'utf8')
assert(!home.includes('aj-learningJourney'))
assert(!home.includes('aj-homeExperience'))
assert(home.includes('data-action-arrow'))
assert(!home.includes('role="tabpanel"'))
assert(fs.readFileSync('.next/server/app/guide.html', 'utf8').includes('aj-platform'), 'Keep the existing guide curriculum example')
console.log(
  'Shape/motion checks passed: semantic accordion open/closed/inert states, shared radii, real hover/arrow/reveal rules, removed home demo and retained guide.',
)
