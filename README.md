# Aljoodi — public website (frontend)

This repository is the **public Aljoodi website** only: the home page and, later, the subjects,
teachers, courses and student pages.

The admin panel and the instructor portal live in a **separate project**,
[`app-dashboard`](../app-dashboard) (Vite + React + TypeScript SPA). Nothing under `/admin` or
`/instructor` exists here any more — the header's "لوحة التحكم" link points at
`NEXT_PUBLIC_DASHBOARD_URL`.

Next.js 14 (App Router) + TypeScript + react-bootstrap (Eduport design system), Arabic only, always RTL.
Talks to the Laravel API (`app-backend`) through the contract in `plans/README.md` §4.1.

## Setup

```bash
cp .env.local.example .env.local   # then edit
npm install
npm run dev                        # http://localhost:4000
```

| Env | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | backend base URL (`http://localhost:8000`) |
| `NEXT_PUBLIC_DASHBOARD_URL` | the separate dashboard app (`http://localhost:5170`) |

Scripts: `dev`, `build` (`tsc && next build`), `start`, `lint`, `typecheck`, `format`.

## Structure

```
src/
  app/
    layout.tsx                  root layout: providers + SiteHeader/SiteFooter
    page.tsx                    public home page
    not-found.tsx               404
  components/site/              SiteHeader (brand, dashboard link), SiteFooter
  components/shared/            reusable UI kit: inputs, DataTable, dialogs… (see its README.md)
  components/form/              legacy template inputs (kept for compatibility)
  config/site.ts                DASHBOARD_URL
  lib/api/                      axios client (`api.get/post/postForm/delete`), react-query hooks, ApiError
  lib/i18n/                     i18next setup, useT(), DirectionManager (lang/dir)
  lib/utils/format.ts           money / date / file size helpers
  locales/ar/*.json            Arabic strings (`common`, `site`), merged in locales/index.ts
  types/api/common.ts           ApiEnvelope, Paginated, Attachment, UserMini, EnumOption, ListParams
  assets/scss/                  the theme (Bootstrap overrides + Eduport components)
```

Rendering: everything under `AppProvidersWrapper` is client-rendered (the layout provider is `ssr:false`,
as in the template), which also keeps i18n/RTL free of hydration mismatches.

## Notes

- There is **no authentication** in this app. `src/lib/api/token-store.ts` still exposes
  `setToken()`/`setUnauthorizedHandler()` so the future student area can plug a session in;
  until then every request is anonymous.
- Adding a public page: create it under `src/app/`, add its strings to
  `src/locales/ar/site.json`, and use the shared inputs/components from `@/components/shared`.
