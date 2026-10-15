# split-expense: MVP build plan

Status: **DRAFT, awaiting approval** · 2026-10-15 · Planner step (gstack /spec standing in for Superpowers)
Inputs: [feature-teardown.md](feature-teardown.md) (MVP approved), [ceo-review.md](ceo-review.md) (CEO D1–D15, Eng D1–D4), brainstorm answers below.

## Brainstorm decisions (this step)

| # | Decision | Answer |
|---|---|---|
| P1 | Who can edit or delete an expense or payment | Any current group member; every change goes to `expense_history` and `activity` |
| P2 | Removing members | **Creator only**, and only when that member's group balance is exactly 0. Anyone can leave at 0 |
| P3 | Creator leaves | The creator role passes automatically to the earliest `joined_at` member; activity shows "X is now the group admin" |
| P4 | Add-expense defaults | Payer = me; equal split among all current members (me + friend in a direct ledger); date today; category General |
| P5 | Simplify debts default | On for new groups; toggle in group settings; "Simplified" label on the balances card. Never applied across groups |
| P6 | Adding a friend | Friends tab lists everyone you share a group with, plus "Invite a friend" personal link → creates the direct ledger |
| P7 | Visual identity | `/design-consultation` task right before the first UI task |
| P8 | First deploy | Walking skeleton: repo + Vercel live by task 4, auto-deploy on every push |

Locked from the reviews: Next.js (latest stable, App Router, Server Actions), TS strict, Tailwind, shadcn/ui · Supabase dev and prod projects · Google-only auth in prod, email+password test users in dev only · money as `bigint` minor units plus ISO code · writes via Postgres RPCs with sum, membership, version and deleted checks · one currency per group · hand-written `sw.js` · Vitest + fast-check + Playwright (390x844) · Sentry · no `lib/db` wrapper layer.

## Researcher findings (2026-10-15)

context7 isn't configured in this session, so the docs were read from the official sources instead, matched to the versions below. There's no `package.json` yet, so versions are the latest stable from npm today. T01 pins them exactly in `package.json` and the lockfile.

| Package | Version | Notes |
|---|---|---|
| next / eslint-config-next | 16.4.1 | Node ≥ 20.9 (host has 24.16) |
| react / react-dom | 19.3.1 | |
| typescript | **6.0.3 (pinned)** | 7.0.2 is latest but needs Next's experimental `useTypeScriptCli`; you chose 6 (TODO: move to 7 when stable) |
| tailwindcss / @tailwindcss/postcss | 4.3.3 | |
| shadcn (CLI) | 4.21.5 | `npx shadcn@latest init`; Drawer is vaul 1.1.2; lucide-react 1.57.0 |
| @supabase/supabase-js | 2.117.3 | |
| @supabase/ssr | 0.12.7 | peer supabase-js ^2.114 ✓ |
| supabase (CLI, via npx) | 2.121.0 | remote `link`, `db push`, `gen types --project-id` need no Docker |
| zod | 4.6.7 | |
| vitest | 5.0.4 (+ vite 8.3.4) | Node ^22.12 or ^24 ✓ |
| fast-check | 4.10.2 | |
| @playwright/test | 1.64.1 | Next peer ^1.51.1 ✓ |
| @sentry/nextjs | 11.8.0 | peer next ^16 ✓ |
| eslint | 10.12.0 | flat config only |

**API differences that change the plan** (plan updated in place):
1. **Next 16: `middleware.ts` → `proxy.ts`** with `export function proxy()`, Node runtime only. T03 now creates `proxy.ts`. Supabase's own guide warns that a misnamed file means sessions never refresh. (Next 16 upgrade guide; Supabase SSR guide)
2. **Next 16: request APIs are async only**: `await cookies()`, `await params`, `await searchParams`. Use the `PageProps<'/groups/[id]'>` helpers (`next typegen`).
3. **Next 16: `next lint` is removed.** The lint script is `eslint .` with flat config.
4. **Next 16: Turbopack is the default for dev and build.** The hand-written `sw.js` (E2) has no bundler coupling, which confirms E2. Next 16 also has `updateTag()` and `refresh()` for read-your-writes after Server Actions; T18–T20 use `refresh()` after mutations (CEO D6's "refetch after mutations").
5. **Supabase SSR: auth checks use `getClaims()`**, not `getSession()` (never for authorization). `getUser()` only when a fresh user record is needed. Cookie adapter: `getAll`/`setAll`, and `setAll`'s cache headers must be applied in `proxy.ts`.
6. **Supabase keys: publishable/secret keys replace anon/service_role** (legacy keys are planned for deprecation by the end of 2026). Env names: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (server and tests only, never `NEXT_PUBLIC_`). Unverified: whether `auth.admin.createUser` accepts `sb_secret_` keys. T09 tests it first; the fallback is the legacy service_role key for dev tests only.
7. **Zod 4:** `z.email()`/`z.uuid()` top-level, the `error` param replaces `message`, `z.treeifyError()` replaces `.flatten()`, and coerce on a missing key now errors (use `.default()`). The amount field stays a string in the form and `parseAmount` does the conversion, with no `z.coerce` on money.
8. **Sentry 11:** `instrumentation.ts` (`register()` + `onRequestError = Sentry.captureRequestError`), `instrumentation-client.ts` (exports `onRouterTransitionStart`), `sentry.server.config.ts`, `app/global-error.tsx`, `withSentryConfig` in `next.config.ts`. Env: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` (CI/Vercel only). T24 is updated.
9. **Tailwind 4 is CSS-first.** Design tokens from T14 live in `app/globals.css` `@theme`, with no `tailwind.config.js`.

Sources: [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16), [Next useTypeScriptCli](https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli), [Supabase SSR Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs), [Supabase API keys](https://supabase.com/docs/guides/api/api-keys), [Supabase type generation](https://supabase.com/docs/guides/api/rest/generating-types), [Zod 4 changelog](https://zod.dev/v4/changelog), [shadcn Next install](https://ui.shadcn.com/docs/installation/next), [Sentry Next.js manual setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/).

## Steps that need YOU (I stop and ask; secrets never go in chat or git)

| When | What you do | What I give you |
|---|---|---|
| T02 | `gh auth login` (if `gh auth status` fails) | the exact command |
| T03 | Create Supabase projects `split-expense-dev` and `split-expense` (prod); put URL, anon key and service-role key for **dev** in `.env.local`; run `npx supabase login` | `.env.example` with names only |
| T03 | Create the Google OAuth client in Google Cloud; enable the Google provider in both Supabase projects | exact Authorized redirect URIs (both Supabase callback URLs) and Supabase "Redirect URLs" list |
| T04 | `npx vercel login`; paste prod env values into Vercel (or tell me to set them via CLI from your shell) | the variable list per environment |
| T09 | Enable the Email provider in the **dev** project only | the setting path |
| T24 | Create a Sentry project and put the DSN in `.env.local` and Vercel | variable names |

## Task list

Each task follows test-first: write the failing test, watch it fail, write minimal code, go green, refactor. It ends with one conventional commit plus a push after your approval. "Verify" is the command whose result I report.

### Phase A: Skeleton (walking skeleton live on Vercel)

- **T01 Scaffold** (human ~3h / CC ~10min)
  - `create-next-app@16.4.1` (TS, App Router, Tailwind 4, ESLint flat config, `src/` off), pin the exact versions from the Researcher table (TypeScript 6.0.3), lint script `eslint .`, `tsconfig` strict + `noUncheckedIndexedAccess`, shadcn init, Vitest, Playwright (project `mobile` 390x844), `.env.example`, `.gitignore` (incl. `.env*.local`), `README.md` stub.
  - Tests: `tests/unit/smoke.test.ts` (1); `tests/e2e/home.spec.ts`: `/` returns 200 at 390x844 (1).
  - Verify: `npm run lint && npx vitest run && npx playwright test && npm run build`.
- **T02 GitHub repo** (human ~15min / CC ~2min) · depends on T01 · **you: gh auth**
  - `git init`, `gh repo create split-expense --private --source . --push`.
  - Verify: `gh repo view split-expense --json visibility` → `PRIVATE`.
- **T03 Supabase clients + Google sign-in** (human ~4h / CC ~15min) · depends on T01 · **you: projects, keys, OAuth client**
  - `lib/supabase/{server,client,proxy}.ts` (`@supabase/ssr`, `getAll`/`setAll`, `getClaims()` for auth checks), `proxy.ts` session refresh (Next 16 rename of middleware), `app/(auth)/login/page.tsx`, `app/auth/callback/route.ts`, `lib/safe-next.ts`.
  - Tests: unit `safeNext()`: rejects `//evil.com`, `https://evil.com`, `/\evil`, accepts `/groups/abc` (+5); e2e: `/login` shows the Google button; `/groups` while signed out redirects to `/login?next=/groups` (+2).
  - Verify: tests above; you sign in with Google on localhost once.
- **T04 Vercel deploy** (human ~2h / CC ~10min) · depends on T02, T03 · **you: vercel login, env values**
  - `npx vercel link` (project `split-expense`), Git integration for auto-deploys, env: Preview → dev Supabase, Production → prod Supabase; add the prod URL and preview wildcard to the Supabase redirect lists.
  - Verify: `curl -sI <prod>/login` → 200; you sign in with Google on the prod URL from your phone.

### Phase B: Money core (pure, no I/O)

- **T05 Currency + amounts** (human ~3h / CC ~5min)
  - `lib/money/currency.ts`: `minorDigits(code)` via `Intl.NumberFormat(...).resolvedOptions().maximumFractionDigits`; `parseAmount("1,234.50","INR") → 123450n`; `formatAmount(123450n,"INR","en-IN") → "₹1,234.50"`.
  - Tests: INR/JPY/KWD exponents; rejects `""`, `"abc"`, `"1.234"` (INR), `"-5"`, `"0"`, more than 12 digits; Indian grouping (+12).
- **T06 allocate()** (human ~3h / CC ~5min) · depends on T05
  - `lib/money/allocate.ts`: `allocate(total: bigint, weights: bigint[], order: string[]) → bigint[]`; largest-remainder method, ties broken by `order` (user_id).
  - Tests: 10000/3 → 3334,3333,3333; 1 paisa among 3; 50 people; zero weight; fast-check: Σ == total, each within 1 of exact (+8, 2 properties).
- **T07 Split modes + payers** (human ~1d / CC ~15min) · depends on T06
  - `lib/money/splits.ts`: discriminated union `equal|exact|percent|shares|adjust`, `computeShares(total, split) → Map<userId,bigint>`, `validatePayers(total, payers)`; percent in basis points (100% = 10000).
  - Tests: per-mode tables, including percent ≠ 100%, exact sum mismatch, adjust larger than total, multiple payers summing to total, IOU preset; fast-check Σshares == total for every mode (+20, 5 properties).
- **T08 Balances + simplify** (human ~1d / CC ~15min) · depends on T07
  - `lib/money/ledger.ts` (reference: nets from expenses and payments), `lib/money/simplify.ts` (greedy max-creditor/max-debtor, deterministic ties).
  - Tests: A→B→C collapses; all zero → []; non-zero-sum input throws; fast-check: nets preserved, transfers ≤ n−1, no self-transfer (+8, 3 properties).

### Phase C: Database (dev project; integration tests sign in real users)

- **T09 Core schema + RLS + test auth** (human ~1d / CC ~20min) · depends on T03 · **you: enable Email provider on dev**
  - Migration `0001_core.sql`: `profiles` (+ `on auth.users insert` trigger, default_currency INR), `groups` (kind, currency, simplify_debts default true, created_by), `group_members`, `is_group_member()` (security definer, `search_path=''`, stable), RLS on all tables. `tests/setup/users.ts` (admin create + `signInWithPassword`).
  - Tests (integration): member reads own group; non-member gets 0 rows on select and 42501 on insert, for every table (+8).
- **T10 Groups, invites, friends** (human ~1d / CC ~20min) · depends on T09
  - RPCs: `create_group` (adds creator), `create_invite`/`revoke_invite` (128-bit token, sha256 stored), `join_group(token)` (definer), `create_friend_invite`/`accept_friend_invite` → `direct_pairs` unique `(user_lo,user_hi)`, `ensure_direct_group(friend_id)`.
  - Tests: join ok / revoked / already a member; two concurrent `ensure_direct_group` calls → one group; friend link creates a direct ledger (+8).
- **T11 Expenses** (human ~1.5d / CC ~25min) · depends on T09, T07
  - Migration `0003_expenses.sql`: `expenses` (client uuid, amount > 0 and < 1e12, version), `expense_payers`, `expense_shares`, child RLS through the parent group, `expense_history` + `activity` security-definer triggers. RPCs `create_expense`, `update_expense(p_version)`, `delete_expense` (soft). Any member may edit or delete (P1).
  - Tests: ok; `sum_mismatch` (payers and shares); `not_member` participant; duplicate id → success with no second row; `stale_version`; edit of deleted → `deleted`; history row written with actor (+10).
- **T12 Payments, balances, membership rules** (human ~1d / CC ~20min) · depends on T11
  - `payments` + `record_payment`/`delete_payment`; views `group_balances`, `friend_balances`; RPCs `remove_member` (creator only, balance 0; P2), `leave_group` (balance 0; creator handover P3).
  - Tests: self-payment rejected; non-creator remove → `forbidden`; remove with balance → `has_balance`; creator leaves → earliest member becomes creator; fuzz: 200 random expenses and payments → `group_balances` == `lib/money/ledger` (+9).
- **T13 Types + error map** (human ~2h / CC ~5min) · depends on T12
  - `npx supabase gen types typescript --project-id <dev> > types/database.ts`; `lib/errors.ts` mapping Postgres codes and messages → `ActionError` union with user copy.
  - Tests: unit, one case per code (+9).

### Phase D: Design

- **T14 Visual identity** (human ~1d / CC ~20min) · depends on — · **approval stop**
  - Run `/design-consultation`: `DESIGN.md`, Tailwind/CSS tokens (light and dark), app icon (512/192/maskable), empty-state style. Original brand; no Splitwise colours, marks or copy.
  - Verify: tokens compile; contrast check AA for text tokens (script) (+1).

### Phase E: Screens (each with Playwright e2e at 390x844 against dev)

- **T15 App shell + Account** (human ~1d / CC ~20min) · depends on T03, T14
  - `app/(app)/layout.tsx` (bottom tabs Groups/Friends/Activity/Account, FAB, safe-area insets, 44px targets), theme toggle (system/light/dark), Account (name, avatar, default currency, sign out).
  - Tests e2e: tabs navigate; FAB visible on every tab; dark mode persists across reload; sign out → /login (+4).
- **T16 Groups list + create + settings** (human ~1d / CC ~25min) · depends on T10, T15
  - Empty state, create sheet (name, type, currency INR default), settings: members, invite link (copy/share/revoke), simplify toggle, remove (creator only) / leave.
  - Tests e2e: create → appears; copy invite; non-creator sees no Remove; leave blocked with balance (+5).
- **T17 Join pages** (human ~3h / CC ~10min) · depends on T16
  - `/join/[token]` (group) and `/friend/[token]`, signed-out round-trip through `next=`.
  - Tests e2e: second user joins; revoked link page; already-member redirect (+3).
- **T18 Add/edit expense sheet** (human ~2d / CC ~40min) · depends on T11, T13, T16
  - vaul Drawer; amount with `inputmode="decimal"`; description; payer(s); 5 split modes with live remainder; P4 defaults; category; date; notes; shared zod schema; client UUID; pending-state button; stale-version reload prompt.
  - Tests e2e: add equal (1 tap path); each mode; percent 99 blocked; double tap → 1 expense; edit clash in 2 tabs → prompt (+8).
- **T19 Group detail + expense detail** (human ~1d / CC ~25min) · depends on T12, T18
  - "You are owed / you owe" headline, simplified who-owes-whom (P5 label), paged expense list (30, keyset), expense detail with history and delete.
  - Tests e2e: balances update after add; delete removes it from balances; history shows the editor (+4).
- **T20 Settle up** (human ~4h / CC ~15min) · depends on T19
  - Settle sheet pre-filled from suggestion, method cash/UPI/other, partial allowed, "All settled up" state.
  - Tests e2e: full settle → settled state; partial leaves the remainder (+2).
- **T21 Friends** (human ~4h / CC ~15min) · depends on T10, T19
  - Friends list with net per currency across groups; direct ledger page (reuses group detail); "Invite a friend".
  - Tests e2e: shared-group friend listed; direct expense moves the friend total; friend link flow (+3).
- **T22 Activity** (human ~4h / CC ~15min) · depends on T11, T12
  - Feed (keyset 30), unread badge (cap 99+) cleared by setting `activity_seen_at` on view.
  - Tests e2e: other user's expense shows the badge; opening clears it (+2).

### Phase F: Platform, ops, delivery

- **T23 PWA** (human ~4h / CC ~15min) · depends on T15
  - `public/manifest.webmanifest`, icons from T14, hand-written `public/sw.js` (versioned cache, precache shell, network-first GET with cache fallback; never caches POST, `/auth/*`, or Supabase calls), register component, offline banner that disables Save.
  - Tests e2e: installable manifest fields; offline reload of a visited group shows cached content plus banner; Save disabled offline (+3).
- **T24 Sentry + logs** (human ~2h / CC ~10min) · **you: DSN**
  - `@sentry/nextjs` 11: `instrumentation.ts` (+ `onRequestError`), `instrumentation-client.ts`, `sentry.server.config.ts`, `app/global-error.tsx`, `withSentryConfig`; release = Vercel git SHA; `lib/log.ts` structured JSON line per Server Action.
  - Tests: unit for the log line shape (+1); manual: test error visible in Sentry (dev).
- **T25 Prod smoke + README** (human ~3h / CC ~15min) · depends on all
  - Playwright `smoke` project against the prod URL (200s, manifest, SW) and a check that the prod Supabase auth settings disable Email (Management API, read-only); README (setup, env vars, architecture diagram, running tests), deferred list from TODOS.md.
  - Verify: `npx playwright test --project=smoke` green against prod.

After T25, the team workflow continues: Reviewer (`/code-review`), Cleaner (`/simplify`), QA (`/qa`).

## Dependency graph

```
T01 ─┬─ T02 ─────────┐
     └─ T03 ─────────┴─ T04 (live skeleton)
             └─ T09 ─┬─ T10 ─┬──────────────── T16 ─ T17
T05 ─ T06 ─ T07 ─────┴─ T11 ─┴─ T12 ─ T13 ─┐    │
                     T07 ─ T08 (ledger ref used by T12 fuzz)
T14 (design) ─ T15 ─┬────────────────────── T16 ─ T18 ─ T19 ─ T20
                    └─ T23 (PWA)                     └─ T21 ─ T22
T24 anytime after T04 · T25 last
```

Order rationale: the skeleton first (P8) so auth and env problems surface on day one. Money logic before the DB, because T12's fuzz test compares SQL balances to `lib/money/ledger`. The DB before the screens, because screens call RPCs. Design (T14) lands before the first screen (P7). Phase B can run while you do the T03/T04 account setup.

## Test totals (planned)

| Layer | Count |
|---|---|
| Unit (incl. 10 fast-check properties) | ~68 |
| Integration (RPC + RLS on dev) | ~35 |
| E2E (390x844) | ~38 + smoke |

## Effort

Human team: ~17 days. CC + gstack: ~6.5 hours of build time, plus your approval stops and setup steps (Supabase, Google, Vercel, Sentry: about 1 hour of your time in total).

## Rollback

Every task is one commit, so revert that commit. Vercel instant rollback for prod. DB migrations are additive only; a bad one gets a forward-fix migration, pushed to dev first (`db push --dry-run`, then `db push`), then prod.

## Out of scope (MVP)

See [TODOS.md](../TODOS.md): offline outbox, realtime, mixed currencies and conversion, email invites, restore UI, Splitwise CSV import; and the teardown's v1/later lists (receipts/OCR, recurring, comments, charts, search, export, reminders, push).
