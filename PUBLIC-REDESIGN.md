# Aljoodi isolated public preview

## Latest removal, public shape system and motion

The entire homepage learning demonstration was removed without replacement: HowSection, LearningJourney, the three tabs, local quiz/review, supporting copy, and demo-only styles are deleted. Existing course lessons/quizzes and the curriculum example used on the guide page remain. Homepage order is hero → real teachers → courses → summit CTA; spacing between courses and the CTA was tightened.

Public/auth shape tokens are centralized in `src/components/brand/shape-system.css`: 12px controls, 22px clipped course cards, selective 64px/20px asymmetric image corners (36px/16px on mobile), pill filters, and coordinated arch-topped teacher frames. Two restrained section turns replace straight boundaries at the teacher section and summit introduction. Shadows and subtle borders provide depth; the original composite artwork receives no extra arch, mask or decoration. Dashboards keep their existing restrained control geometry.

Actual motion includes coordinated hero text/image entrance, once-only 540ms opacity/20px reveals, 5px course lifts, image scaling to 1.03, soft hover/focus shadows, directional arrow movement and animated navigation underlines. Public accordions use 0fr/1fr expansion with visible state/chevron feedback; collapsed panels remain mounted but aria-hidden/inert so their links cannot be focused. Private accordion workflows retain their state semantics and do not receive public transition styling. Reduced-motion preferences cancel/disable animations, while static content remains visible. No new dependency was added.

`node scripts/check-shape-motion.cjs` verifies server-rendered open/closed accessibility states, shape tokens, motion rules, removed homepage demo and retained guide. Build, TypeScript, compiled cascade/asset/data checks and source lint excluding the known unchanged LessonPlayerModal issue are run. No browser, screenshots or visual QA are used. Earlier notes below are historical where they differ from this section.


## Latest photographic series and learning demonstration

All four existing preview subjects now use distinct local ImageGen educational photography: mathematical constructions, prism optics, laboratory glassware/molecular structures, and cellular biology. Shared CourseCover renders subject titles as HTML, lazy-loads responsive Next images, retains genuine uploaded covers, falls back to the local subject asset on an image error, and shows an honest missing-image message if neither loads. No flat line-art, portrait or giant-logo substitution is used.

The supplied hero composite remains unchanged on matching ivory, with a larger share of the grid and a readable warm-gold emphasis. The four real teacher portraits now have one baseline, the same crop, uniform corners and one subtle lighting treatment. No verified identity/subject/profile mappings were found; no individual profile links were invented.

The homepage product demonstration now has three keyboard-operable tabs: شاهد الشرح / جرّب سؤالًا / راجع فهمك. The first is an explicitly static math lesson because the local catalog has no playable sample video; the second provides native radio answers, feedback and an explanation; the third responds to the checked answer. Answers and selection remain in component memory only. No API mutation or student-progress write is performed. Other non-demonstration LearningPreview uses retain the existing curriculum component.

The existing closing CTA is now a single wide summit scene with real HTML heading معك… حتى القمة, one supporting sentence and one action. The asset contains no text or logo. Its photographed golden trail is revealed once with the landscape; no second vector path, constant animation or repeated mountain section is added. Reduced motion shows the static scene and cancels active preview transitions.

Sources, exact generation prompts and saved image paths: `public/images/ASSET-SOURCES.md`. New static verification: `node scripts/check-photographic-series.cjs`. No browser, screenshots or visual QA were used. Earlier notes below describe prior versions where they differ.


## Current homepage refinement

The current homepage uses the existing teacher composite at its original 1448×1086 proportions on matching warm ivory (#F7EEE3). The source PNG is delivered unoptimized to preserve its original quality. Added masks/feathering were removed; no blur, glow or shadow is applied to the artwork. Petrol text, one dark-gold headline emphasis, solid petrol primary action and outlined secondary action replace the dark hero. Hero counters and repeated captions were removed.

The teacher section now contains only the four supplied original portraits in one petrol photographic composition, with consistent crops, staggered alignment and neutral group labeling. There are no fictional profiles or invented identity mappings in this section. The homepage course section has a compact heading/filter row and a direct four-column responsive grid; an opt-in editorial card variant omits teacher images and redundant cover labels while retaining instructor text, package scope, price and the next action. Existing course cards on other routes retain their defaults.

The ivory learning section gives most width to the actual interactive curriculum, opens only the first unit initially, and uses three short supporting benefits. The closing CTA is concise. Existing non-home usages retain their defaults. Homepage composition rules are isolated in `src/components/brand/homepage.css`; the header keeps the same 1240px content grid.

Validation includes build/TypeScript, scoped lint, compiled cascade checks, motion fallbacks, demo data integrity and `node scripts/check-homepage-direction.cjs`. No browser or visual QA was performed. Earlier implementation notes below describe prior stages where they differ from this section.


Branch: `codex/aljoodi-homepage-preview`. No push, deployment, production configuration changes, new dependencies or backend writes.

## Run

From this checkout:

```powershell
npm run build
npx next start -p 4566 -H 127.0.0.1
```

Open http://127.0.0.1:4566 yourself. Development: `npx next dev -p 4566 -H 127.0.0.1`.
The ignored local `.env.local` enables `NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES=true`; changing that flag requires a rebuild. Authentication remains real and needs its configured backend.

## Foundation repaired first

The legacy-browser PostCSS cascade-layer flattener processed Tailwind and the public CSS Module in separate bundles. Its generated heading/universal reset selectors outranked the authored heading sizes and spacing. A compiled-CSS regression check reproduced the failure: hero selector specificity `{a:0,b:1,c:0}` versus reset `{a:2,b:0,c:1}`.

Public styles now use an `aj-` namespace and are imported into the same `globals.css` bundle as Tailwind **before** the existing compatibility transforms. The authored hero heading now has specificity `{a:5,b:1,c:0}`, higher than the reset. Existing compatibility plugins are retained. `publicStyles.ts` provides a typed class-name contract. No `!important` patchwork or horizontal-overflow hiding is used.

Fluid 1240px containers, mobile gutters, zero-minimum grid tracks and shrinkable flex children address sizing constraints. Cairo is loaded with Next's font loader and emitted as local WOFF2 assets. Public typography and composition rules are namespaced; shared tokens provide compatible dashboard identity without replacing private workflows.

## Pages and interactions

- Home: a large composition of three supplied original teacher portraits, white navigation, deep blue-petrol feature surface with teal depth and selective gold, two actions, compact demo-catalog counts, a fourth original teacher photo in the teacher introduction, demo profile links, study imagery, distinct subject covers, actual curriculum interface and closing CTA.
- Teachers and profiles: fictional demo identities with separately generated illustrative portraits, subject filters/search, readable methods/bios, actual related demo courses. Original supplied teacher faces are never assigned invented names or subjects.
- Subjects and details: four subjects with distinct math, physics, chemistry and biology artwork, search, local demo subject filter, curriculum and example prices. Lesson rows open a local explanation/question/feedback interaction. Package selection opens a local summary and confirmation; no subscription or payment request is created.
- About: platform story, illustrative teaching scene, original unmapped teacher portraits and varied text/image compositions.
- Guide: clear steps, expandable instructions and the real curriculum component as a local interface example.
- Contact: illustrative support scene, existing channels, FAQs and local form confirmation. In preview mode submission never reaches the contact service.
- Authentication: branded photographic presentation; existing auth forms, validation and backend behavior retained. Private screens retain their workflows.

One discreet notice reads “نسخة تجريبية — محتوى توضيحي”. Individual fictional profiles and illustrative scenes are identified where their context could otherwise imply real people/facilities. Counts describe this catalog; no student achievements, ratings or testimonials were invented. Lesson durations and package prices are sample data, not published offers. The interactive lesson is a basic subject example, not a complete video course.

## Local data and assets

`src/lib/preview/catalog.ts` centralizes demo teachers, course associations, lesson lists, exercises, prices and FAQs. Only the existing public catalog/FAQ GET whitelist is substituted. Auth, private user, video, quiz and payment endpoints retain their existing contracts. See `public/images/demo/ASSETS.md` for generated-image provenance and prompts.

Missing verified assets: original teacher-to-identity/subject mapping, actual staff biographies, real video lessons, verified studio/support/group photos. The supplied four original portraits remain local and unaltered. Contextual generated images are illustrative and never presented as evidence of real Aljoodi staff, facilities or results. No standalone group photo was supplied.

## Verification

- `npm run build`: TypeScript and production build; 27 prerendered pages.
- `node scripts/check-design-foundation.cjs`: checks compiled cascade specificity, section spacing, responsive constraints and emitted Cairo font assets.
- `node scripts/check-preview-catalog.cjs`: checks relational data, actual derived counts, identity/asset separation, search/filters and API endpoint boundaries.
- `npx eslint src --ignore-pattern '**/LessonPlayerModal.tsx'`: passes. Full lint still has a pre-existing `react-hooks/set-state-in-effect` error in unchanged `LessonPlayerModal.tsx:79`.
- No browser launch, screenshot capture, browser automation or visual QA was performed for this version, as requested. Older files in `review/` do not represent this version. Appearance and end-to-end backend workflows remain for client review.

## Current in-place refinement — 2026-11-16

The alternative concepts and `/preview/a` and `/preview/b` routes are canceled and removed. The existing public site is the only active direction. The supplied book-and-star brand presentation guides the deep blue-petrol, teal, gold and warm-white identity; no emerald palette is retained. The presentation itself is never used as the logo.

The original teacher faces are prominent in the homepage hero and teacher introduction. No identity or subject is assigned to these supplied photos. Existing generated study, teaching and support scenes remain labeled illustrations, separate from fictional demo teacher profiles. There was no supplied standalone group photograph; the hero uses an HTML/CSS composition of original portrait files.

PublicMotion progressively enhances public pages with 540ms transform/opacity reveals and short independent text/photo stagger. Elements have no hidden initial state. Missing animation/observer support leaves all content visible; changing reduced-motion preferences cancels active entrance animations. Card/image/action feedback uses 220–280ms transitions. Accordion and filter feedback is scoped to public pages; private workflows are unchanged. Static catalog counts are retained without animated achievement claims. No new animation dependency was added.

Additional check: `node scripts/check-public-motion.cjs` verifies reduced-motion and unsupported-animation fallbacks, bounded timing, nonzero reveal opacity, original photography in the built homepage, and removed alternative routes. No browser or visual QA was used.
