# Engineering baseline

Stand: 2026-07-22

## Purpose

This document describes the current technical baseline and implementation guardrails. It does not turn prototype behavior into a product requirement.

Product intent is owned by docs/product. When a prototype rule conflicts with that direction, resolve the product decision and then change this document and the implementation together.

## Current stack

- TypeScript monorepo with pnpm workspaces.
- NestJS API and job orchestration.
- React and Vite web application.
- TanStack Router and TanStack Query.
- PostgreSQL.
- Drizzle ORM and SQL migrations.
- Vitest for domain and API testing.
- Playwright for browser acceptance flows.
- Docker Compose for local PostgreSQL, API, and web services.

## Workspace boundaries

### packages/domain

Framework-free deterministic game rules.

Current prototype coverage includes:

- resources and production,
- 2D coordinates and travel bands,
- ship definitions and fleet loadouts,
- research and unlocks,
- FIFO build queue,
- fleet travel, stationing, return, and recall,
- deterministic combat,
- scans,
- tick orchestration.

Domain code must not depend on NestJS, React, Drizzle, HTTP, or a database.

### packages/db

Drizzle schema, migrations, database client, and seed data.

Current tables cover:

- rounds,
- users and sessions,
- players,
- stations and station ships,
- research state,
- build orders,
- fleets,
- combat reports,
- scan reports,
- tick runs.

The current user and player schema does not yet implement the complete identity model described below.

### apps/api

NestJS application responsible for:

- authentication and sessions,
- validation and authorization,
- game commands,
- persistence and transactions,
- snapshot queries,
- development tick orchestration.

Current endpoints cover registration, login, logout, the current game snapshot, build, research, fleet launch, fleet recall, scans, health, and a non-production development tick.

### apps/web

React client for the current prototype.

It currently proves authentication and the build, research, fleet, scan, report, and development-tick flows. Its page structure and forms are not the target product experience.

### apps/e2e

Playwright acceptance tests and isolated browser-flow setup.

## Current prototype rules

These rules describe implemented behavior and may change during product validation:

- Resources are aluminium, steel, and energy.
- The current map uses Euclidean distance on a 2D grid.
- Current travel bands resolve to four through seven ticks depending on distance.
- The catalog contains twelve legacy-inspired combat ships plus a harvester.
- Combat is deterministic and contains simplified hooks for normal, EMP, first-strike, and hack traits.
- Attack fleets may remain stationed for one to three ticks.
- Defense fleets may remain stationed for one to six ticks.
- A fleet recalled while traveling returns in the already elapsed travel time, with a minimum of one tick.
- A stationed fleet recalled uses the full return travel time.
- The current station scan is exact and costs a fixed amount of energy.
- The development seed creates an active round and a dummy target.

Do not treat the current 30-minute round setting, exact scans, travel bands, ship balance, combat formula, or recall approximation as final product decisions.

## Architectural guardrails

- Keep authoritative game rules on the server.
- Put deterministic calculations in packages/domain before using them in API or UI code.
- Model the seasonal world as a connected two-dimensional coordinate space; do not encode oceans, settlements, or regional labels as hidden travel or attack boundaries.
- Keep authoritative world state separate from each player or alliance's detected contacts and time-stamped intelligence. A map query must not reveal entities merely because they exist in the database.
- Represent resource nodes and other cluster-forming geography explicitly so placement, discovery, depletion, and renewal rules can be versioned and simulated.
- Represent station relocation as an explicit, auditable lifecycle operation rather than a direct coordinate edit. It must validate the published readiness rules and resolve all affected fleets, orders, collectors, intelligence, and world references deterministically.
- Version rule definitions that affect persisted rounds or reports.
- Model player actions as explicit commands with validation and authorization.
- Make tick or event processing idempotent.
- Use transactions for commands that spend resources or move ownership.
- Persist reports as explainable records, not only rendered text.
- Keep shared intelligence and social permissions explicit.
- Keep fleet ownership separate from delegated authority.
- Only the owner may compose and release a fleet.
- Represent delegated defense calls and operation recalls as narrow, auditable commands; they must not silently grant general account or fleet control.
- Model alliance membership, roles, and operational permissions with explicit validity periods and audit history.
- Revoke alliance-derived access immediately when membership ends while resolving in-flight commands through explicit rules.
- Keep account inactivity, seasonal player state, alliance membership, and any neutralized remnant station as separate concepts.
- Model canonical account, persistent public profile, seasonal persona, and seasonal player state as separate boundaries.
- Enforce at most one active seasonal player per canonical account at the database and command layers.
- Never use a public display name or seasonal persona as an authorization, ownership, moderation, or audit identity.
- Apply sanctions, blocks, household rules, and account limits through the canonical identity even when the public persona is incognito.
- Store name and persona changes as private auditable history without exposing the canonical link to unauthorized players.
- Treat suspicious-behavior signals as explainable moderator evidence, not automatic sanction commands.
- Permission and audit access to security evidence must be narrower than ordinary game administration.
- Design seasonal reset and persistent account data as separate boundaries; reset jobs must identify their target data explicitly.
- Represent inactivity, deactivation, ruin conversion, return, and vacation as explicit lifecycle states and idempotent transitions.
- Enforce vacation freezes in server-side command authorization and progression jobs, while allowing separately authorized account and social actions.
- Represent late-entry acceleration as bounded personal progression state, not as a freely transferable grant.
- Version and audit catch-up rules so their effect can be simulated against the season-age baseline and investigated for feeder-account abuse.
- Version award-category and metric rules and create immutable measurable standings snapshots before the final battle.
- Persist the components behind point, combat-point, economy, achievement, and command-ship-development totals so standings and individual awards remain explainable and auditable.
- Calculate points from authoritative current seasonal ownership and capability state, with a conserved transition between mutually exclusive components so value is never counted twice.
- Keep authoritative award points separate from any delayed, banded, estimated, scanned, or deliberately obscured public presentation.
- Derive the economy award from collector ownership at the standings lock, not from cumulative production; snapshot each collector or aggregate under exactly one eligible player and alliance.
- Store seasonal achievement levels, completion counts, and first-attainment timestamps separately from persistent profile achievements; rank them in that order at the standings lock.
- Derive command-ship standings from versioned, authoritative seasonal progression facts rather than an opaque or client-calculated score.
- Do not aggregate personal achievements into an alliance award; any future alliance achievements require a separate shared-objective model.
- Treat regular season, final battle, Havoc, reset, and intermission as explicit lifecycle states with authorized transitions.
- Isolate Havoc progression from official standings and all next-season competitive state, whether it uses cloned or newly generated world data.
- Avoid encoding historical PHP table or page structure in the remake.
- Do not add a new dependency when a small local implementation is sufficient and maintainable.

## Timing and jobs

The current implementation uses a manually triggered development tick. There is no production scheduler or complete round lifecycle.

The future timing model is an open product decision. Whether it remains globally tick-based, moves to operation windows, or becomes event-driven, the implementation must remain:

- deterministic where promised,
- idempotent,
- observable,
- safe to retry,
- testable without waiting for wall-clock time.

## Authentication baseline

The prototype uses:

- username, email, and password registration,
- Argon2id password hashing,
- opaque server-side sessions,
- HTTP-only session cookies,
- no email verification in the prototype.

Production requirements such as verification, password recovery, abuse controls, and account deletion are not yet complete.

## Target identity boundaries

The future persistence model needs stable relationships equivalent to:

- one canonical account with credentials, roles, and moderation scope,
- one persistent public profile with long-term presentation and community history,
- at most one seasonal persona per account and season,
- at most one seasonal player state per account and season,
- explicit household declarations and seasonal household mode,
- auditable moderation cases, evidence references, warnings, and sanctions,
- lifecycle records for inactivity warnings, deactivation, vacation, and neutral ruin conversion.

The public-profile link of a normal persona may be visible to players. The canonical-account link of every persona is always available to authorized moderation services and never optional.

Inactivity and vacation scheduling must use deterministic timestamps and idempotency keys. Ruin conversion must transfer or recreate game-world state without transferring ownership of the canonical account or allowing a later return to claim both states.

## Legacy reference

The ignored old/ directory may be consulted for mechanic archaeology. It must not define the product, architecture, security, or data model. Never copy secrets, credentials, production data, or hard-coded historical identities.
