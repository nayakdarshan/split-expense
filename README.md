# split-expense

Mobile-first installable web app for splitting shared expenses. Every feature is free.

Status: under construction. See [docs/plan.md](docs/plan.md) for the build plan and [TODOS.md](TODOS.md) for deferred work.

## Development

Requires Node 22.12+ (24 recommended).

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

## Checks

```bash
npm run lint
npm run typecheck
npm test            # Vitest unit + integration
npm run test:e2e    # Playwright, 390x844 phone viewport, against a production build
```

Setup, environment variables and architecture are documented at the end of the build (T25).
