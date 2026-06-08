# Repository Guidelines

## Project Direction

This repository is being reset around the Aquata remake. The historical PHP game has been moved to `old/` and is ignored by Git. Treat it as reference material only; do not port its structure directly into the remake.

Use `docs/REMAKE_PLAN.md` as the active implementation roadmap. The user-provided `Aquata - Game Design Document.md` is the product design source and should inform feature decisions.

## Workflow

- Keep the new project architecture TypeScript-first unless `docs/DECISIONS.md` records a later change.
- Put deterministic game rules in a framework-free domain package before wiring them into API or UI code.
- Use Playwright E2E tests as the main acceptance layer for playable flows.
- Add or update docs when making substantial architecture, gameplay, or scope decisions.
- Do not commit secrets from the old PHP config or SQL dump.

## Legacy Reference

The old game in `old/` contains useful references for:

- tick order and periodic jobs
- ship stats and combat concepts
- resource, build, research, scan, fleet, and alliance mechanics
- historical UI copy and terminology

It should not define the new folder layout, database model, security model, or frontend architecture.
