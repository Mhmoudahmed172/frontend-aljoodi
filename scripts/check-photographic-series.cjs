const fs = require('node:fs')
const vm = require('node:vm')
const assert = require('node:assert/strict')
const crypto = require('node:crypto')
const ts = require('typescript')
const sharp = require('sharp')
function load(file) {
  const box = { exports: {}, process: { env: { NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES: 'true' } } }
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
      .outputText,
    box,
  )
  return box.exports
}
;(async () => {
  const catalog = load('src/lib/preview/catalog.ts')
  const artwork = load('src/lib/subjectArtwork.ts')
  const hashes = new Set()
  for (const subject of catalog.previewSubjects) {
    const cover = artwork.getSubjectArtwork(subject.name)
    assert(cover, 'Missing artwork mapping for ' + subject.name)
    const file = 'public' + cover.src
    assert(fs.existsSync(file), 'Missing asset ' + file)
    const meta = await sharp(file).metadata()
    assert(meta.width >= 1200 && meta.height >= 800)
    assert(meta.width > meta.height)
    hashes.add(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'))
  }
  assert.equal(hashes.size, catalog.previewSubjects.length, 'Each subject must have distinct photography')
  const summit = 'public/images/landscapes/summit-petrol-landscape.png'
  assert(fs.existsSync(summit))
  const scene = await sharp(summit).metadata()
  assert(scene.width > scene.height)
  const coverSource = fs.readFileSync('src/components/brand/CourseCover.tsx', 'utf8')
  assert(coverSource.includes('loading="lazy"'))
  assert(coverSource.includes('onError'))
  assert(!coverSource.includes('<svg'))
  assert(coverSource.includes('<strong>{subject}</strong>'))
  const html = fs.readFileSync('.next/server/app/index.html', 'utf8')
  assert(!html.includes('aj-learningJourney'))
  assert(!html.includes('aj-journeyTabs'))
  assert(!html.includes('role="tabpanel"'))
  assert.equal((html.match(/id="summit-title"/g) || []).length, 1)
  assert(html.includes('summit-petrol-landscape.png'))
  assert(!html.includes('<video'))
  console.log(
    'Photographic series and demo checks passed: all ' +
      catalog.previewSubjects.length +
      ' subjects mapped to distinct local high-resolution assets, landscape metadata, lazy images/fallbacks, HTML titles, removed homepage lesson demo and one summit section.',
  )
})().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
