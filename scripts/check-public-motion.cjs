const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const ts = require('typescript')
const output = ts.transpileModule(fs.readFileSync('src/lib/motion.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
let reduced = false,
  calls = 0,
  config,
  keyframes
const sandbox = { exports: {}, window: { matchMedia: () => ({ matches: reduced }) } }
vm.runInNewContext(output, sandbox)
const el = {
  animate: (frames, options) => {
    calls++
    keyframes = frames
    config = options
    return { cancel() {} }
  },
}
sandbox.exports.enterElement(el, 500)
assert.equal(calls, 1)
assert.equal(config.duration, 540)
assert.equal(config.delay, 180)
assert(keyframes.every((f) => f.opacity > 0))
assert(keyframes.every((f) => Object.keys(f).every((k) => ['opacity', 'transform'].includes(k))))
reduced = true
assert.equal(sandbox.exports.enterElement(el), null)
assert.equal(calls, 1)
reduced = false
assert.equal(sandbox.exports.enterElement({}), null)
assert.equal(
  sandbox.exports.enterElement({
    animate() {
      throw Error('unsupported')
    },
  }),
  null,
)
const reveal = fs.readFileSync('src/components/ui/Reveal.tsx', 'utf8')
assert(!reveal.includes('opacity-0'))
assert(!reveal.includes('setVisible'))
const css = fs.readFileSync('src/components/brand/motion.css', 'utf8')
assert(css.includes('prefers-reduced-motion'))
assert(!/opacity\s*:\s*0\s*[;}]/.test(css))
const routes = JSON.parse(fs.readFileSync('.next/server/app-paths-manifest.json', 'utf8'))
assert(!Object.keys(routes).some((r) => r.startsWith('/preview/')))
const home = fs.readFileSync('.next/server/app/index.html', 'utf8')
assert(home.includes('aj-public'))
assert(home.includes('طموحك '))
assert(home.includes('للقمة.'))
assert(home.includes('aj-heroEnsemble'))
assert(home.includes('hero-teachers-composite.png'))
assert(!home.includes('aj-heroPortrait'))
assert(home.includes('aj-homeFaculty'))
console.log(
  'Public motion checks passed: visible fallbacks, reduced-motion, bounded durations/delays, safe failure, original photography, and canceled alternatives.',
)
