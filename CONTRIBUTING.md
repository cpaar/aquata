# Contributing to Aquata

Aquata is in product rediscovery. Contributions must follow the current product documents instead of extending the historical prototype by default.

## Before starting

1. Read [`docs/README.md`](docs/README.md) and the documents it assigns authority to.
2. Read [`AGENTS.md`](AGENTS.md) for repository-specific implementation rules.
3. Link the work to a GitHub issue with a clear player or engineering outcome, acceptance criteria, and explicit non-goals.
4. Resolve material product questions before implementation. Record accepted answers in the owning product document and remove resolved entries from `docs/product/OPEN_QUESTIONS.md`.

## Implementation rules

- Keep deterministic game rules in `packages/domain` without framework, database, clock, or global-random dependencies.
- Keep the architecture TypeScript-first unless `docs/engineering/ARCHITECTURE.md` records a later decision.
- Treat the application and ignored `old/` tree as prototype or historical reference, not as implicit requirements.
- Update the relevant source-of-truth document with substantial product, gameplay, architecture, or scope changes.
- Never commit credentials, private keys, local environment files, legacy PHP configuration, or database dumps.

## Verification

Run checks proportional to the change. A complete verification is:

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm e2e
```

API integration and Playwright tests reset their configured PostgreSQL database. Use only a dedicated test database.

Playable changes require updated Playwright acceptance coverage at the primary mobile viewport and a useful desktop viewport. Domain changes require deterministic examples and boundary tests. Persistence changes require real PostgreSQL coverage for transactionality, idempotency, authorization, and conservation.

## Pull requests

- Keep one coherent outcome per pull request.
- Link the issue with `Closes #<number>` when the PR completes it.
- Explain product and documentation impact, not only implementation details.
- Include the exact checks that passed and call out skipped checks explicitly.
- Add screenshots for material UI changes.
- Do not merge while required CI checks are failing.
