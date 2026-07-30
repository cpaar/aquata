# Aquata

Aquata is a seasonal, asynchronous social strategy game about growth, reconnaissance, deception, coordinated fleet operations, and community.

The project is currently moving from a technical prototype toward its first proper multiplayer version. The active implementation roadmap starts with consequential station founding, a shared generated world, and an automatic node-based economy.

## Start here

The documentation in [`docs`](docs/README.md) is the product and engineering source of truth:

1. Read [`docs/product/VISION.md`](docs/product/VISION.md) for the intended game.
2. Read [`docs/product/FIRST_PROPER_VERSION.md`](docs/product/FIRST_PROPER_VERSION.md) for the current version boundary.
3. Read [`docs/engineering/IMPLEMENTATION_ROADMAP.md`](docs/engineering/IMPLEMENTATION_ROADMAP.md) for delivery order and the next implementation outcome.
4. Read [`AGENTS.md`](AGENTS.md) before agent-assisted work.

The existing application is a prototype. When it conflicts with the current product documents, resolve the product question and update the implementation rather than silently retaining prototype behavior.

## Development

Prerequisites:

- Node.js 22
- Corepack with pnpm 10.12.1
- Docker with Docker Compose

Install dependencies and start the local PostgreSQL service:

```bash
corepack pnpm install
docker compose up -d postgres
```

Start the API and web application:

```bash
corepack pnpm dev
```

Run the complete verification suite:

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm e2e
```

API integration and Playwright tests reset their configured PostgreSQL database. Never point `TEST_DATABASE_URL` or the E2E database URL at data that must be preserved.

## Contributing

Use a GitHub issue to define the desired outcome and acceptance criteria before implementation. Keep deterministic rules in the framework-free domain package and use Playwright as the main acceptance layer for playable flows.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the working agreement.
