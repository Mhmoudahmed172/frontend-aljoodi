# Al Joudi public website preview

This branch refines the existing Arabic RTL website using the supplied book/star logo, original teacher imagery, locally generated subject photography, petrol/teal/gold/ivory identity and scoped public-page motion. Existing routes and backend/auth/payment/video contracts are retained. No deployment configuration is changed.

## Run locally

```powershell
npm ci
npm run build
npx next start -p 4566 -H 127.0.0.1
```

Open http://127.0.0.1:4566. Use the repository's existing backend environment setup for live data and authentication.

## Optional local demo data

The default behavior uses real services. To enable the isolated public demo, set the following **before building** (the flag is compiled into the client bundle):

```powershell
$env:NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES = 'true'
npm run build
npx next start -p 4566 -H 127.0.0.1
```

No environment file, credentials, backend records or real student data are committed with this preview.

`src/lib/preview/catalog.ts` centralizes four sample subjects/courses (mathematics, physics, chemistry, biology), two explicitly fictional teacher profiles with illustrative portraits, sample prices, lesson outlines, exercises and FAQs. Public catalog/FAQ GET responses are substituted only when the flag is enabled. Catalog lesson counts are derived from those sample lessons; there are no invented student achievements, ratings or testimonials. A visible Arabic demo notice identifies illustrative content.

Supplied original teacher faces are kept separate from fictional identities. No verified name/subject/profile mapping exists for the four supplied portraits, so their homepage section uses neutral labels and directory actions.

In demo mode, contact submission returns local feedback without sending a message. Demo package selection confirms locally without creating a subscription/payment request. Course-detail sample questions stay in component memory and do not record student progress. There are no playable demo videos; real auth, permissions, payment, video and private user endpoints are not mocked. The homepage learning-demo section has been removed; the guide retains its existing curriculum preview.

Unset the flag and rebuild to return to live catalog/contact behavior. Genuine course subscriptions retain their existing authenticated flow.

## Assets and provenance

- Supplied originals: `public/images/aljoodi-logo.png`, `hero-teachers-composite.png`, `home-teacher-1.jpg` through `home-teacher-4.jpg`.
- Generated subject covers: `public/images/course-covers/`.
- Generated one-time summit landscape: `public/images/landscapes/`.
- Illustrative study/teaching/support scenes and fictional-profile portraits: `public/images/demo/`.
- Exact generation prompts and identity limitations: [asset sources](public/images/ASSET-SOURCES.md) and [illustrative scene provenance](public/images/demo/ASSETS.md).

The generated assets are illustrative and are not evidence of actual staff, facilities, students or achievements. The new source PNGs are local; course/landscape images use responsive lazy-loaded Next Image delivery. The hero uses its supplied full-resolution source and preserves all faces/proportions.

## Foundation and interaction

Namespaced public CSS is bundled with Tailwind before the existing legacy-browser cascade-layer transform. This prevents the transformed heading/universal resets from overriding authored typography and spacing. Responsive grids have zero minimum tracks/shrinkable children; horizontal overflow is not hidden globally. Cairo is loaded through Next's font loader.

Shared public/auth shape tokens provide 12px controls, 22px course cards, selective asymmetric feature corners and coordinated teacher arches. Private screens keep task-focused workflows. Progressive entrance animations leave essential content visible without JavaScript, respect reduced motion, and cancel when that preference changes. Accordion panels retain accessible expanded/hidden state and are inert while collapsed.

## Validation

```powershell
npm run build
node scripts/check-design-foundation.cjs
node scripts/check-preview-catalog.cjs
node scripts/check-public-motion.cjs
node scripts/check-homepage-direction.cjs
node scripts/check-photographic-series.cjs
node scripts/check-shape-motion.cjs
npx eslint src --ignore-pattern '**/LessonPlayerModal.tsx'
```

The build includes TypeScript and generates the existing application routes. Full ESLint has a pre-existing `react-hooks/set-state-in-effect` error at `src/features/subjects/components/LessonPlayerModal.tsx:79`; that file is unchanged by this branch.

No browser launch, screenshots, browser automation or visual QA was performed for the latest implementation, at the user's request. Appearance and backend end-to-end behavior still require reviewer validation. No push/deployment is part of the local preview workflow; publication of this branch is a separate authorized review step.
