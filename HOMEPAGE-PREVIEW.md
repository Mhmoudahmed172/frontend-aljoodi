# Aljoodi homepage review

Historical notes for the earlier homepage-only phase. The current site-wide update is documented in [BRAND-PREVIEW.md](BRAND-PREVIEW.md). The screenshots below predate that update.

Branch: `codex/aljoodi-homepage-preview`. Local only; nothing pushed or deployed.

Development: `npx next dev --webpack -p 4566 -H 127.0.0.1`

Serve the verified build: `npx next start -p 4566 -H 127.0.0.1`
Preview: http://127.0.0.1:4566
Build: `npm run build`

The five existing sections, their order, card layouts, carousel, decorative motifs and illustrations are retained. Homepage CSS variables are scoped in `homepage.module.css`; footer changes apply only on `/`. Shared dashboard styling and production configuration are unchanged.

The supplied portraits are used unchanged, with proportion-preserving 4:5 crops. No portrait has been assigned a name or subject because the files and project data do not verify those mappings. All four appear in the existing teacher carousel; two appear in the existing hero composition. A verified portrait-to-teacher mapping is needed before adding personal labels.

The new standalone logo was not supplied. The existing `public/images/logo.svg` is retained. The brand presentation JPEG is not used as a logo or page asset. A transparent SVG or PNG of the new logo is needed.

The local API at localhost:8000 is unavailable. Existing live course rendering is preserved; when unavailable, the existing subjects section uses a clearly labelled illustrative fixture based on subjects already mentioned in the project. It has no fabricated teachers, prices, ratings or course details. No backend data is written.

Unverified score projections, academic credentials, free-trial promises, gamification and always-available support claims have been removed from homepage copy. Copy describes the existing lessons, units, quizzes and progress functionality.

Licensed Graphik Arabic font files are absent from `public/fonts/`; the existing Cairo fallback is retained. Font fetching requires network access during build.

## Verification

- `npm run build`: passed, including TypeScript and static generation of 27 pages.
- Targeted ESLint for landing components, homepage, public header/footer and Logo: passed.
- `git diff --check`: passed.
- Local homepage and session-status endpoint: HTTP 200; guest session returned `authenticated: false`.
- Desktop 1440×1000, mobile 390×844 and 320×740, tablet 768×1024 reviewed. No horizontal page overflow at these widths. Four teacher images loaded, keeping their 4:5 proportions. The RTL carousel moved to a negative scroll offset when advancing.
- Mobile menu opened and closed with Arabic controls. Tablet now uses the existing menu instead of wrapping desktop navigation.
- API-backed teacher/course data could not be verified because the local backend is unavailable. This review uses the documented neutral photo cards and labelled subject fixture.
- Original checkout remains on `main` with no tracked changes. All edits are isolated here; no push, deployment, backend writes or production-configuration changes were made.

## Captures

- [Before — desktop](review/homepage/before-desktop.jpg)
- [After — desktop](review/homepage/after-desktop.jpg)
- [Before — mobile](review/homepage/before-mobile.jpg)
- [After — mobile](review/homepage/after-mobile.jpg)
- [Teachers — desktop](review/homepage/after-teachers-desktop.jpg)
- [Teachers — mobile](review/homepage/after-teachers-mobile.jpg)
- [Study steps](review/homepage/after-how-desktop.jpg)
- [Subject fixture](review/homepage/after-subjects-desktop.jpg)
- [Tablet](review/homepage/after-tablet.jpg)
