# Engineering baseline

Stand: 2026-07-24

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
- Represent passive contacts, sector-scan discoveries, and targeted deep-scan reports as distinct intelligence records with source, observation time, confidence, expiry or staleness behavior, owner, and sharing permissions.
- Derive passive contacts from versioned sensor radius, observation quality, station events, and fleet paths. A contact projection must expose only the information tier earned by the observer, not the authoritative destination, fleet order, or composition behind it.
- Persist each fleet as an owner-controlled group of concrete ships with stable internal identity across docked, traveling, engaged, withdrawn, and returning states. Allow composition changes only through explicit owner commands while the affected ships are available at the home station. Keep fleet templates as separate desired-composition data with no ships, ownership transfer, movement state, or delegated authority.
- Make every fleet order reference one complete fleet and never a per-order subset of its members. Derive travel pace from the slowest surviving ship in that fleet. Keep separately launched fleets as separate authoritative movements, orders, withdrawal states, cargo states, and returns even when they share an owner, route, target, or engagement.
- Do not expose a fleet's internal identifier or private name through intelligence projections. A fleet-focused deep scan may project observed fleet partitions and compositions without creating a direct foreign-key-like correlation to a movement contact, fleet order, or destination. The target's incoming-attack projection may reveal attacker, exact ship count, and earliest combat hour without leaking that hidden correlation.
- Resolve scan quality deterministically from committed energy, distance, research, and authoritative countermeasures so identical retries cannot fish for a successful random result.
- Represent research as versioned fields and projects with exactly one progressing project per seasonal player and an ordered non-progressing queue. Starting, completing, cancelling, or advancing the queue must remain transactional and idempotent, and retries must never progress two projects concurrently or grant one unlock twice.
- Calculate the personal research catch-up multiplier from authoritative season age, the project's published catch-up eligibility, and the player's current research baseline. Do not persist spendable research-point currency, let unused acceleration accumulate, transfer it between players, or apply it to projects at or ahead of the current season-age baseline.
- Model Aluminium, Steel, and Plutonium as collected raw resources and energy as derived operational state. Plutonium conversion, fleet-fuel reservation, onboard transfer, movement consumption, and return arrival, energy storage, and the persistent allocation between sensors, countermeasures, and manual-scan reserve must conserve value through explicit idempotent transitions.
- Calculate fleet fuel through one versioned domain rule that exposes the exact fixed launch overhead, the composed fleet's exact travel fuel rate, and the exact order-and-route total when those inputs are known. The total must include onboard fuel for the complete planned travel and intended return. Execution must use the same quote inputs and rule version shown at confirmation. Do not encode a fleet-slot or simultaneous-fleet cap in the initial model; each separately launched fleet instead incurs its own overhead.
- Reserve the complete quoted fuel amount at the owner's station when the fleet order is confirmed. At launch, consume the fixed overhead and atomically transfer the travel amount into authoritative onboard fuel attached to the fleet. Consume that fuel from actual movement and credit only the remainder still aboard through the idempotent home-arrival transition. A pre-launch cancellation releases its reservation; an early recall does not create a calculated refund and instead brings physically unconsumed fuel home. Apply the same owner-funded flow to alliance defense calls.
- Lock the completed drive-technology level and its versioned travel rules into a fleet order when its quote is authoritatively confirmed. Later research completion must not change an in-flight ETA, onboard fuel, route cost, or return calculation. Drive technology may reduce route-dependent travel time and fuel but never the fixed launch overhead or the relative slowest-ship rule.
- Represent resource nodes and other cluster-forming geography explicitly so placement, discovery, depletion, and renewal rules can be versioned and simulated.
- Represent collectors as one authoritative aggregate pool with percentage allocations and one selected node for each raw resource. Do not create individual collector or route entities, and do not resolve interception or theft away from the owning station.
- Version the unbounded collector-price function. It must use the authoritative projected total including committed construction, produce the same total for batch and sequential orders, serialize concurrent purchases safely, and remain deterministic without overflow at Havoc-scale counts.
- Resolve collector theft only as an idempotent station-combat outcome. Apply the fifteen-percent maximum to the remaining pool at each resolution step, preserve the defender's allocation policy, remove captured units from active production immediately, and place them in return cargo until an idempotent return arrival adds them to the attacker's aggregate pool. Retries must not duplicate or destroy value.
- Treat combat salvage as redistribution from one authoritative bounded loss pool. In canonical resource-value units, the sum of all Müll awards must remain strictly below the replacement value of ships permanently destroyed in the corresponding step and engagement. Apply own-loss recovery, enemy-damage credit, modules, command-ship effects, and all other modifiers before a final aggregate clamp or normalization; no modifier may lift the published global ceiling. Do not count a disabled command ship that returns for repair as a fully destroyed ship for this pool.
- Represent station relocation as an explicit, auditable lifecycle operation rather than a direct coordinate edit. It must validate the published alliance-fleet-release rules and resolve all affected fleets, orders, collectors, intelligence, and world references deterministically.
- Model command-ship level, automatic core progression, one archetype-bound development-point pool, chosen specialization and milestones, seasonal unlocks, and equipped modules as distinct versioned concepts. Development-point and module validation must preserve the three archetypes' role boundaries rather than recreate universal or unrestricted off-role skill trees.
- Version the command-ship experience curve and every level reward. The curve must remain monotonic and increasingly expensive, while replaying or migrating progression must never duplicate automatic growth, development points, or milestone choices.
- Record qualifying command-ship experience as an idempotent operation outcome with participants, role, source, stakes, resolved material effects, authoritative deployment-value snapshot and ratio, personal deployment and role contribution, repeated-participant context, qualification result, and rule version. Do not award command-ship experience or development points from elapsed time, passive production, or a recurring training action.
- Calculate the combat challenge factor from versioned, published ship replacement values and a transparent command-ship deployment value fixed at the battle lock. Do not substitute a hidden simulated win probability or effective-power score. Persist enough intermediate values to generate the same expectation categories before commitment and the exact explainable award after resolution.
- Derive each participant's award from the shared combat significance and challenge plus a bounded personal contribution. Participant count alone must not dilute existing awards, token participation must not receive a full reward, and added allied force must still affect the shared deployment ratio.
- Keep command-ship recognition and achievement records separate from progression inputs; recognition must not silently multiply later experience or grant additional development points.
- Model a Fight command ship's Assault or Disruption specialization separately from its current normal or EMP cannon mode and its strong-versus-numerous cannon distribution. Switching tactical mode must translate the same authoritative progression state rather than create parallel progression or permit duplicated power.
- Bound every area-effect rule by explicit authoritative targets and total effect so combat cost and output cannot grow accidentally without limit as fleet sizes rise.
- Resolve overlapping Support effects by versioned effect category and a deterministic diminishing-returns rule. Do not model a finite supported-fleet network, discard every contribution except the strongest, or let identical bonuses stack without bounds.
- Represent Support experience contribution separately from speculative counterfactual combat effects. Base its bounded role credit on the relevant allied deployment actually under active Support effects and apply the published overlap adjustment deterministically.
- Restrict the initial command-ship experience processor to qualifying combat outcomes for all three archetypes. Passive production, routes, expeditions, salvage, deliveries, and other Economy operations must not enter that processor. A later non-combat Economy progression source requires a separately versioned product rule and operation model rather than an implicit exception to combat experience.
- Store seasonal module unlocks separately from the equipped loadout. Unlock commands, randomized grants, and one-per-active-day credits must be idempotent and auditable. Enforce duplicate protection and revealed milestone choices authoritatively. Unlocked modules survive seasonal destruction and loadout changes but are removed with competitive state at season reset.
- Version rule definitions that affect persisted rounds or reports.
- Model player actions as explicit commands with validation and authorization.
- Make tick or event processing idempotent.
- Use transactions for commands that spend resources or move ownership.
- Represent parallel construction as independent committed-value jobs unless a later product decision introduces a specific capacity boundary; never infer a universal queue from the current prototype.
- Persist reports as explainable records, not only rendered text.
- Keep shared intelligence and social permissions explicit.
- Keep fleet ownership separate from delegated authority.
- Only the owner may compose fleets and enable or disable alliance fleet release. Store that release as one permission bound to the owner and current alliance, not as repeated per-fleet state; new or recomposed fleets inherit its current value automatically.
- A defense call must commit one complete currently available fleet and may never select a subset. Serialize calls against owner orders and fleet edits so exactly one valid command wins; changing a fleet composition does not revoke the owner-level alliance permission.
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

The product timing baseline for fleet operations is a shared hourly round. Fleet owners submit or update commands during the current hour for execution at the next boundary. The authoritative processor must use a versioned phase order for command locking, launch, movement, arrival, combat-step resolution, reports, and notifications so every event at a boundary has an unambiguous outcome.

An offensive plan or prepared fleet is not an executable future order. The owner must confirm an attack during the immediately preceding command window; the first implementation must not auto-launch offense scheduled several rounds ahead. At the launch boundary, notify the target and persist the earliest combat hour. An attack cannot resolve on that same boundary, and equivalent offensive travel requires one more operation round than defensive reinforcement.

Persist each of the engagement's maximum three combat steps as a separate idempotent resolution with its participant snapshot, preceding commands, losses, station effects, cargo transfers, and continuation state. After step one or two, accept owner-authorized withdrawal commands until the next boundary. Apply those withdrawals before resolving the next step, preserve their secured cargo, and start their return; fleets without a withdrawal command remain committed. Apply the same transition to attackers and non-local defending fleets. Fleets arriving at that boundary affect only the next unresolved step when the engagement still continues. Removing all current defenders must not complete the engagement while the attacker retains a continuation-capable fleet and elects to use a remaining step. End the engagement immediately after a step that leaves no combat-capable attacking fleet, before a later step when all remaining attackers withdraw, and unconditionally after step three. Time-driven systems outside fleet activity do not need to share this hourly cadence unless their owning product rule requires it.

Represent Müll, captured collectors, stolen resources, surviving ships, remaining onboard fuel, and a disabled command ship as authoritative return state rather than crediting or recreating them at home during combat. Every fleet ending its combat commitment must produce a deterministic return even when no ordinary ship survives. Credit cargo and remaining fuel only on the idempotent arrival transition, then make a returned disabled command ship unavailable until a separate repair job completes.

All timing and job processing must remain:

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
