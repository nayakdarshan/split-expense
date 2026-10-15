# TODOS

These were deferred from the MVP by /plan-ceo-review on 2026-10-15 (SCOPE REDUCTION). See docs/ceo-review.md.

## Tooling

### Move to TypeScript 7 (P3)
- **What:** Upgrade from the pinned `typescript@6.0.3` to TS 7 once Next.js supports it without `experimental.useTypeScriptCli`.
- **Why:** Type checks are about 10x faster.
- **Context:** Pinned in the Researcher step (2026-10-15), because Next 16.4's default build checker needs the TS JS compiler API that TS 7 doesn't provide yet.

## v1

### Offline add with outbox sync (P1)
- **What:** Save expenses and payments offline in an IndexedDB outbox and replay them through the same RPCs when the connection is back.
- **Why:** Trips with bad signal. Splitwise supports offline entry.
- **Context:** IDs are already generated on the client, so a replay is idempotent (a duplicate PK counts as success). Use `@serwist/next` plus `idb`.
- **Effort:** human L / CC M · **Depends on:** MVP RPCs.

### Realtime live balances (P2)
- **What:** Supabase Realtime subscriptions on expenses and payments per group.
- **Why:** Lets two people watching the same group see each other's changes live.
- **Context:** The MVP refetches on focus and after mutations. Realtime needs RLS-aware channel authorisation.
- **Effort:** human M / CC S.

### Mixed currencies in a group plus conversion (P1)
- **What:** Each expense gets its own currency, balances are kept per currency, and you can optionally convert at Frankfurter daily rates (cached, with the rate and date stored).
- **Why:** Trips abroad. Conversion is a Splitwise Pro feature.
- **Context:** The `currency` column already exists on every money row. Extend the balance views to group by currency.
- **Effort:** human L / CC M.

### Email invites with placeholder users (P2)
- **What:** Add someone by email before they sign up; they claim the placeholder when they log in with Google.
- **Effort:** human M / CC S · **Depends on:** an email provider.

### Restore deleted expenses (P3)
- **What:** A Restore action on deleted expenses (the data is already soft-deleted, with history).
- **Effort:** human S / CC S.

### Import a Splitwise group CSV export (P1)
- **What:** Import the CSV that a Splitwise user exports for their own group, either as opening balances or as full history.
- **Why:** This is the main blocker to switching. Without it, the group's balances and history stay behind in Splitwise.
- **Context:** The export has one net column per person, so multiple payers can't be fully reconstructed. Offer an "opening balances" mode as the reliable default.
- **Effort:** human M / CC S.
