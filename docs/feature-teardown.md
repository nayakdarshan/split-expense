# split-expense — Feature Teardown (Step 0)

Status: **MVP cut APPROVED** · 2026-10-15 (OCR engine and default currency still to confirm before v1)

## Method and guardrails

- **Sources:** only public ones. splitwise.com/pro, the Splitwise help-center article index (feedback.splitwise.com/knowledgebase), the App Store listing and its visible reviews, third-party reviews (TechRadar, a UX case study on uxdesign.cc, Trustpilot), and competitor comparison pages (Kittysplit, Finny). The competitors have an incentive to overstate Splitwise's limits, so their claims are marked *(3p)*.
- **Not done (on purpose):** no decompiling of the APK or IPA, even though a jadx tool is available. No scraping of logged-in pages and no use of private APIs. The public developer API was not used either.
- **Brand:** the product is **split-expense**. Its name, palette, iconography, illustrations and copy are all original. We take no Splitwise names, colours, icons or marketing copy. Generic domain terms like "settle up", "group" and "balance" are fine to use.
- **Free / Pro column:** this describes Splitwise as of late 2026 based on public listings. In our app, **everything is free**. The column exists only to show where Splitwise draws its paywall.

Priority key: **MVP** = first deployable release · **v1** = next release after MVP · **later** = backlog / maybe.

## 1. Accounts and people

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 1.1 | Google sign-in | OAuth sign-in. The only auth method we offer. | Free (they also offer email/password and Apple) | **MVP** |
| 1.2 | Profile | Name, avatar, default currency, timezone, email shown to friends. | Free | **MVP** (avatar upload v1; Google photo in MVP) |
| 1.3 | Friends | A two-person ledger outside any group, with a balance that rolls up across shared groups. | Free | **MVP** |
| 1.4 | Invite by email | Add someone who isn't a user yet. They exist as a pending placeholder and claim the account when they sign in with that email. | Free | **MVP** |
| 1.5 | Invite by link | Share a group join link (token, revocable). | Free | **MVP** |
| 1.6 | Non-user placeholders | Track a person who never signs up, e.g. a child or grandparent (a common review request). | Partially (email required) | v1 |
| 1.7 | Passcode / app lock | Local PIN lock on mobile. | Free | later |
| 1.8 | Account deletion and data download (JSON) | GDPR-style export and delete. | JSON backup is Pro | v1 |
| 1.9 | Languages (i18n) | They support 7+ languages. | Free | later (build i18n-ready strings from MVP) |

## 2. Groups

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 2.1 | Create group with type | Type is home, trip, couple or other. Type changes the default icon and suggested categories. | Free | **MVP** |
| 2.2 | Members: add / remove / leave | Removal is blocked while the member has a non-zero balance. | Free | **MVP** |
| 2.3 | Group cover photo / avatar | Custom image. | Free | v1 (MVP uses generated emoji or colour) |
| 2.4 | Group balances | Per-member net balance plus "who owes whom". | Free | **MVP** |
| 2.5 | Simplify debts toggle | Per-group setting. Reduces the plan to the fewest transfers (see 6.2). | **Pro** for the toggle *(3p)*; the store listing lists it as core | **MVP** |
| 2.6 | Default split settings | Each group stores a default split (percentages or shares per member) that new expenses inherit. | **Pro** | v1 |
| 2.7 | Group default currency | Expenses default to the group's currency. | Free | **MVP** |
| 2.8 | Delete / restore group | Soft delete with an undo / restore list. | Free | v1 (soft-delete schema in MVP) |
| 2.9 | Group totals | Total spend and your share. | Free | **MVP** (as a simple total) |
| 2.10 | Group notes / "whiteboard" | Free-text shared notes, such as a Wi-Fi password or trip plan. | Free | later |
| 2.11 | Permissions / admin | Splitwise has none; anyone can edit. We match that. | — | later |

## 3. Expenses

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 3.1 | Add expense | Description, amount (numeric keypad), currency, date, group or friends, payer, split. | Free (free tier capped at ~3–5/day plus ads) | **MVP** (no cap) |
| 3.2 | Split equally | Equal share among the selected people. The remainder in minor units is assigned deterministically. | Free | **MVP** |
| 3.3 | Split by exact amounts | Each person's amount is typed in, and the amounts must sum to the total. | Free | **MVP** |
| 3.4 | Split by percentages | Must sum to 100%. Rounding is deterministic. | Free | **MVP** |
| 3.5 | Split by shares | Weights such as 2:1:1. | Free | **MVP** |
| 3.6 | Split by adjustment | Equal split plus a ±amount per person. | Free | **MVP** |
| 3.7 | Multiple payers | Several people paid parts of the total. | Free | **MVP** |
| 3.8 | IOU / "you owe them full amount" | A shortcut where one person owes 100%. | Free | **MVP** (a split preset) |
| 3.9 | Non-group expense among friends | Split with arbitrary friends and no group. | Free | **MVP** |
| 3.10 | Notes | Long-form note on an expense. | Free | **MVP** |
| 3.11 | Categories | Fixed taxonomy (food, home, transport, utilities, entertainment, life, general …) with an auto-suggestion from keywords. | Free | **MVP** (fixed list; auto-suggest v1) |
| 3.12 | Date | Backdating allowed. | Free | **MVP** |
| 3.13 | Edit / delete with history | Every change is versioned. Deleted expenses can be restored. | Free | **MVP** (audit table plus restore) |
| 3.14 | Comments | Comment thread per expense. | Free | v1 |
| 3.15 | Recurring expenses | Weekly, fortnightly, monthly or yearly. A scheduler materialises each occurrence. | Free | v1 |
| 3.16 | Unlimited expenses | No daily cap and no interstitial delay. | **Pro** | **MVP** |
| 3.17 | Receipt photo upload | Attach an image to an expense, stored in a private bucket and served through signed URLs. | **Pro** (high-res and 10 GB) | v1 |
| 3.18 | Receipt OCR scan to prefill | Extract merchant, date, total and currency. | **Pro** | v1 (engine decision below) |
| 3.19 | Itemized splitting | Line items assigned to people. Tax and tip are prorated. Can be done from an existing photo, not only a live scan (a review complaint). | **Pro** | v1 |
| 3.20 | Transaction import from card or bank | Pull card transactions to split. US only. | **Pro** | later (out of scope: needs a bank aggregator) |

## 4. Settling up

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 4.1 | Record a payment | Cash, UPI, bank or other method, with amount, date and an optional note. Recorded as a payment-type entry. | Free | **MVP** |
| 4.2 | Settle up suggestions | Pre-fills the amount from the current (optionally simplified) balance. | Free | **MVP** |
| 4.3 | UPI deep link | Opens `upi://pay?pa=…&am=…` for the payee's stored VPA. We don't process the money; the user confirms it was paid. | Paytm integration (IN) | v1 |
| 4.4 | Venmo / PayPal / Splitwise Pay / Card | In-app money movement. | Free / separate products | **later / out of scope** (we only record payments) |

## 5. Activity, notifications, reminders

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 5.1 | Activity feed | Chronological changes affecting you (adds, edits, deletes, payments, comments). | Free | **MVP** |
| 5.2 | Live balances | A realtime update when someone else adds an expense. | Free (push) | **MVP** (Supabase Realtime) |
| 5.3 | In-app notifications | Unread badge on Activity. | Free | **MVP** |
| 5.4 | Email notifications | Per-event emails, with preferences. | Free | v1 |
| 5.5 | Web push notifications | PWA push (needs VAPID keys). | Free (native push) | v1 |
| 5.6 | Reminders | A manual "remind" sends an email or push to the debtor. An optional monthly digest goes out automatically. | Free | v1 |
| 5.7 | Account change history | Same as the activity feed but with "show deleted" filters. | Free | v1 |

## 6. Money engine

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 6.1 | Integer minor units | `bigint` amount plus ISO 4217 code. Currency exponent handled (JPY 0, INR/USD 2, KWD 3). | — | **MVP** |
| 6.2 | Simplify debts (min transfers) | A pure function from net balances to a transfer list, tested with property tests (conservation and ≤ n−1 transfers). Greedy max-creditor/max-debtor matching; exact minimisation is NP-hard and not required. | **Pro** toggle *(3p)* | **MVP** |
| 6.3 | Multi-currency expenses | An expense in any currency. Balances are kept per currency (no implicit conversion). | Free | **MVP** |
| 6.4 | Automatic conversion | Converts all balances to a chosen currency at daily rates (Frankfurter, cached per day). Shown as "≈" and stored with the rate and date it used. | **Pro** | v1 |
| 6.5 | Unsupported currencies | Splitwise allows custom currencies. We use the full ISO list; conversion is unavailable where Frankfurter lacks a rate. | Free | v1 |

## 7. Insights and data (Pro-equivalent)

| # | Feature | What it does | Splitwise | Priority |
|---|---|---|---|---|
| 7.1 | Full-history search | Text search over description, notes and comments. | **Pro** | v1 (basic description search in MVP) |
| 7.2 | Filters | Group, person, category, date range, currency, "involving me". | **Pro** (part of search) | v1 |
| 7.3 | Charts by category / month | Your share of spending by category per month, plus a trend line, with drill-down from a category to its expenses (a review complaint). | **Pro** | v1 |
| 7.4 | CSV export | Per group or friend. Unlike Splitwise, the rows separate paid and owed columns per person, which fixes a known complaint about multi-payer exports. | Free (store listing) | v1 |
| 7.5 | JSON backup | Full account export. | **Pro** | v1 (same as 1.8) |
| 7.6 | No ads | We have no ads. | **Pro** | **MVP** |
| 7.7 | Early-access program | Feature flags for beta users. | **Pro** | later |

## 8. Platform and UX

| # | Feature | What it does | Priority |
|---|---|---|---|
| 8.1 | Installable PWA | Manifest, icons, service worker, standalone display. | **MVP** |
| 8.2 | Offline entry with sync | Add or edit an expense offline. It goes into an IndexedDB outbox and replays on reconnect with client-generated UUIDs for idempotency. Conflict rule: last write wins per expense, and the history records both versions. | **MVP** (add expense and payment offline; offline edit/delete v1) |
| 8.3 | Offline read cache | Groups, balances and recent activity are viewable offline. | **MVP** |
| 8.4 | Mobile-first shell | 390 px layout, bottom tabs (Groups, Friends, Activity, Account), an "Add expense" FAB, 44 px targets, numeric keypad (`inputmode="decimal"`). | **MVP** |
| 8.5 | Dark mode | Follows the system setting, with a manual override. | **MVP** |
| 8.6 | Desktop layout | A centred phone-width column, with wider tables for history and export. | **MVP** (centred column); wide tables v1 |
| 8.7 | Accessibility | Labels, focus order, contrast AA, reduced-motion support. | **MVP** |

## OCR engine options (your choice needed for v1)

| Option | Quality | Cost | Privacy / ops |
|---|---|---|---|
| **A. Claude API vision** (`claude-haiku-5-5` for scans, escalate to Sonnet on low confidence) | Very good on crumpled or angled receipts and on itemisation. Returns structured JSON (merchant, date, currency, line items, tax, tip). | Roughly 1–3k input tokens per image → about $0.002–0.01 per receipt on Haiku. Needs an `ANTHROPIC_API_KEY` server-side, rate-limited per user. | The image leaves Supabase for Anthropic's API. Runs in a route handler. |
| **B. Tesseract.js** (in browser) | Fine for clean printed totals. Weak on itemisation, skew and thermal fade. Needs our own parsing heuristics. | $0. Downloads about 10–15 MB of WASM and language data, which slows the first scan on mobile. | The image never leaves the device. No key needed. |
| **C. Hybrid** | Tesseract runs first for the total and date; the user taps "Scan items" to use Claude for itemisation. | $0 for the basic scan, pay only for itemisation | Image is sent to Anthropic only on opt-in |

**Recommendation: C (hybrid)**, with the Claude call behind a server-side per-user daily limit. If you want to keep it simple, choose A.

## Proposed MVP cut (for approval)

**Included:** Google sign-in · profile · friends (invite by email and link) · groups (typed, members, default currency) · add, edit and delete expenses with history and restore · all five split modes plus multiple payers plus IOU · notes · categories · dates · per-friend and per-group balances (per currency) · simplify debts · record payment / settle up · activity feed plus live balances plus in-app unread badge · PWA with offline add and sync · dark mode · no caps and no ads.

**v1 (next):** recurring expenses · comments · receipts (upload, OCR, itemisation) · currency conversion · search, filters and charts · CSV/JSON export · default group splits · email and web-push notifications and reminders · UPI deep link · cover photos · non-user placeholders · group restore UI.

**Later / out of scope:** bank or card transaction import · in-app money movement (Venmo, PayPal, wallet) · group whiteboard · admin permissions · i18n translations · app passcode · early-access program.

## Open questions for you

1. Do you approve the MVP / v1 split above, or should something move up (receipts or recurring, for example)?
2. Which OCR engine: A, B or **C (recommended)**?
3. What should the default currency be for new users: INR, or detected from the browser locale?
