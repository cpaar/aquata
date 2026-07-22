# Repository Guidelines

## Project Direction

Aquata is currently in product rediscovery. Do not continue the old phase roadmap or add legacy features by default.

Start with docs/README.md. The documents under docs/product are the current product source of truth. The documents under docs/engineering describe the current technical baseline and verification requirements.

The product direction is a seasonal, asynchronous social strategy game about growth, reconnaissance, deception, coordinated fleet operations, and community. The existing implementation is a prototype and may be reshaped when it conflicts with that direction.

## Workflow

- Keep the project architecture TypeScript-first unless docs/engineering/ARCHITECTURE.md records a later decision.
- Put deterministic game rules in a framework-free domain package before wiring them into API or UI code.
- Use Playwright E2E tests as the main acceptance layer for playable flows.
- Update the relevant source-of-truth document whenever making a substantial architecture, gameplay, or scope decision.
- Rewrite current documents in place and delete superseded documents. Do not keep deprecated plans, parallel product visions, or historical decision logs in the active documentation tree.
- Remove resolved questions from docs/product/OPEN_QUESTIONS.md after incorporating the answer into the owning document.
- Do not commit secrets from the old PHP config or SQL dump.

## Legacy Reference

The historical PHP game under old/ is ignored by Git and is not an active product source. Consult it only when a task explicitly needs mechanic archaeology such as:

- tick order and periodic jobs
- ship stats and combat concepts
- resource, build, research, scan, fleet, and alliance mechanics
- historical UI copy and terminology

Legacy behavior must not define the new product, folder layout, database model, security model, or frontend architecture.
