# VANESEV (`vanesev.com`) — MULTI-AGENT TECHNICAL HANDOVER

## 1. MANDATORY OPERATIONAL RULES
1. **ZERO LOCAL COMPILATION:** Never run `npm install`, `npm run build`, `vite build`, or `tsc` on the local Windows PC (3.83 GB RAM). `node_modules` is intentionally absent locally. All builds and typechecks run in GitHub Actions (`.github/workflows/ci-cloud-verify.yml` on `staging`, 7 GB RAM VM) and Vercel (`iad1`, 8 GB RAM VM).
2. **BRANCH WORKFLOW:** Edit on `staging` -> `git push vanesev staging` -> verify GitHub Actions passes -> promote to `main` (`git push vanesev +staging:main`) -> deploy to Vercel (`npx vercel --prod --yes`).
3. **PROJECT ISOLATION:** Never touch `dkitchen corporate` or `vaksar-project`. Desktop documentation lives in `C:\Users\karc0\OneDrive\Desktop\vanesev app\`.
4. **CENTRAL SYNC (`/central`):** Before starting work, query `public.central_mailbox`, `public.central_incidents`, and `public.central_tasks` in Neon DB (`GET /api/central`) to read instructions left by `karc0`. When finishing a session, insert a record in `public.central_sessions` and `public.central_docs`.

## 2. CRITICAL ARCHITECTURAL INVARIANTS (DO NOT BREAK)
- **PostgreSQL 18 Row-Level Security (RLS) in Neon (`api/_db.ts`):**
  - Neon's default owner role (`vanesev_owner`) has `rolbypassrls = true` and `cloud_admin` blocks `ALTER ROLE vanesev_owner NOBYPASSRLS`.
  - Therefore, RLS is enforced via the non-bypass role `vanesev_rls_enforced` (`rolbypassrls = false`) + `ENABLE/FORCE ROW LEVEL SECURITY` on `services`, `staff_members`, `studio_zones`, `bookings`, `blocked_slots`, and `loyalty_cards`.
  - Always use `executeWithTenantRls(tenantId, (tx) => tx\`...\`, role)` from `./_db.js`, which batches `SET LOCAL ROLE vanesev_rls_enforced` + `set_config('app.current_tenant', ...)` + the query inside a single HTTP `sql.transaction([...])`.
- **ESM Imports in `api/*.ts`:**
  - `package.json` uses `"type": "module"`. Any relative import inside `api/` MUST include the `.js` extension (`import { getDb, executeWithTenantRls } from './_db.js';`), otherwise Vercel's Node runtime fails with `FUNCTION_INVOCATION_FAILED`.
- **Public Hydration vs. Super-Admin in `api/central.ts`:**
  - `GET /api/central?mode=tenant_context&tenant=<slug>` MUST remain public so `BookingModal.tsx` can hydrate specialists (`staff_members`) and cabin zones (`studio_zones`) for clients.
- **Code-Splitting (`src/App.tsx`):**
  - `CentralDashboard`, `AdminDashboard`, and `VanesevLanding` are lazy-loaded via `React.lazy()` + `<Suspense>` so public salon clients on mobile data never download admin/governance bundles.
