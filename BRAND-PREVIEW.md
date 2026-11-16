# Aljoodi site-wide brand preview

These are historical notes. The current public redesign is documented in [PUBLIC-REDESIGN.md](PUBLIC-REDESIGN.md).

This supersedes the earlier homepage-only preview notes. The existing isolated checkout and `codex/aljoodi-homepage-preview` branch are retained. Nothing has been pushed or deployed.

## Run locally

Preview: http://127.0.0.1:4566

Development: `npx next dev --webpack -p 4566 -H 127.0.0.1`

Production build: `npm run build`

Serve the build: `npx next start -p 4566 -H 127.0.0.1`

Stop the process already using port 4566 before starting another one.

## Coverage

- `/`: existing five sections retained; substantial petrol hero, real portraits, course path, and catalog-specific totals.
- `/teachers`, `/teachers/[id]`: larger portrait cards and profile photography, API biographies, verified per-record counts, and real galleries. Unrated records no longer show a fabricated rating; missing photos no longer show a stock teacher.
- `/subjects`, `/subjects/[slug]`: shared brand, larger covers/instructor images, existing search/filters, accurate API prices, package selection and curriculum. Course-specific unit/lesson totals come from its loaded curriculum.
- `/about`: platform story and team photography, distinct vision and mission, supported student benefits.
- `/guide`, `/contact`: distinct Arabic copy, restrained relevant illustrations, instructions without an invented response-time promise, and clickable existing support channels.
- `/privacy-policy`, `/profile`: shared identity; legal policy content retained. Profile uses the real avatar or initials, and no longer invents a join date.
- `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-otp`: supplied logo, petrol/ivory form layouts, gold details and suitable team photography on login/register. Validation, CAPTCHA, OTP and authentication contracts are preserved.
- `/dashboard`, `/dashboard/explore`, `/dashboard/teachers`, `/dashboard/teachers/[id]`, `/dashboard/subjects`, `/dashboard/subjects/[slug]`, `/dashboard/library`, `/dashboard/exams`, `/dashboard/profile`, `/dashboard/settings`, `/dashboard/subscribe`: shared tokens, deep petrol sidebar, gold active state, branded cards/forms/tabs and light working surfaces. No marketing photography is forced into video, quiz, payment or operational screens.
- Not-found, notifications, dialogs, video and quiz surfaces inherit the shared controls/tokens. Their functionality and protection logic are retained.
- There is no separate admin route in this repository; no admin pages or permissions were invented.

## Brand and assets

- Shared palette in `src/app/globals.css`: petrol `#032D35`, deep petrol `#021F26`, gold `#D5B575`, ivory `#F7F3EA`, supporting teal `#008D98`. Light text colours and semantic status colours remain readable on their intended surfaces.
- Shared compositions in `src/components/brand/brand.css`; homepage composition rules remain local in `src/features/landing/homepage.module.css`.
- `public/images/aljoodi-logo.png` is an unchanged copy of the supplied transparent 1536×1024 PNG. The Logo component preserves its 3:2 ratio; dark placements use a CSS monochrome treatment. The new app icon uses the same supplied asset, replacing the old mark.
- The four supplied teacher photos are preserved. Hero/team compositions do not assign identities. Live teacher and course records use only their own API photos, names, subjects, biography and galleries.
- A verified mapping from the four supplied portraits to teacher IDs, names and subjects is still needed. The demo must not be treated as that mapping.
- The referenced teacher-profile/support screenshots were not present among the files available for this update; existing component structure and supplied assets were used.
- Licensed Graphik Arabic files are still absent. The existing Cairo fallback remains configured.

## Explicit local demo data

The ignored `.env.local` in this checkout enables `NEXT_PUBLIC_LOCAL_PREVIEW_FIXTURES=true`. It is not a production configuration change. Remove this flag and rebuild to return to live catalog data.

All fixture configuration and asset references are centralized in `src/lib/preview/catalog.ts`. Only public teacher, subject, course, curriculum and FAQ GET contracts are substituted. Unknown paths still use the service. Authenticated proxy calls, authentication, user data, notifications, payments, videos and quiz submissions are never mocked.

The local banner and relevant cards/profile/package labels say **بيانات تجريبية**. Demo content consists of:

- Four anonymous photo/profile records, labelled by photo number rather than invented personal names. Subjects and published courses are intentionally empty until identity mappings are verified.
- Lesson counts of 12, 16, 14 and 18 for demonstrating per-record presentation, explicitly not claims about the pictured people. No ratings, achievements, success rates or testimonials are invented.
- Three subject/course records and two units with two non-playable lesson rows each. No fabricated video or trial lesson is supplied.
- Illustrative semester prices of 120 / 140 / 240 shekels. Enrollment is disabled for demo IDs; real enrollment behavior is retained.
- FAQ copy for demonstrating the existing accordion. Existing support contact details are unchanged.

The homepage's 3-course/4-profile figures are totals of this demo catalog, not production totals or career achievements. Real catalog totals come from API pagination metadata when demo mode is off.

## Verification and limits

Build and static checks only. No browser was launched, no new screenshots were taken, and no visual QA or visual iteration was performed for this update, as requested. Screenshots under `review/homepage` belong to the earlier homepage-only phase and do not represent this version.

The existing full-project ESLint failure is `src/features/subjects/components/LessonPlayerModal.tsx:79` (`react-hooks/set-state-in-effect`). It also exists in HEAD; that file is unchanged. Other source files pass lint with this existing file excluded. Production build and TypeScript checks pass.

No backend writes, authentication/authorization changes, payment changes, video changes, push, deployment or production configuration changes were made.
