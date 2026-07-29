# Implementation roadmap

Stand: 2026-07-29

## Purpose and authority

This is the active implementation roadmap for Aquata's first proper playable version. It turns the accepted product boundary in `product/FIRST_PROPER_VERSION.md` into a sequence of playable outcomes. It does not revive the former phase roadmap or make the existing prototype's feature order authoritative.

Product documents own player-visible behavior. `ARCHITECTURE.md` and `TESTING.md` own cross-cutting engineering and verification rules. This roadmap owns delivery order, the currently planned technical slice, and the exit condition for each outcome.

Only the next outcome is decomposed in detail. Later outcomes remain bounded by their accepted player result until the preceding systems provide enough evidence to plan them responsibly. Balance values are fixed only when needed by the next outcome and must be validated through deterministic simulations before being treated as implementation constants.

## Outcome sequence

| Order | Playable outcome                                                                                                                                   | Current planning state                              |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **1** | Found a station whose location determines its automatic economy, then change that economy and grow its collector pool across authoritative ticks   | Technical plan accepted; next implementation target |
| **2** | Discover, scan, attack, and return from a shared neutral target with a persistent Piranha-and-Qualle fleet                                         | Product-scoped; decompose after outcome 1           |
| **3** | Conduct eligible PvP with Hai and Hackboot, bounded theft, salvage, return cargo, repeated-target protection, and recovery                         | Product-scoped; decompose after outcome 2           |
| **4** | Share intelligence and coordinate one alliance defense through Macbox, defense calls, and a minimal operation                                      | Product-scoped; decompose after outcome 3           |
| **5** | Build one Fight, Support, or Economy command ship and earn its first levels through real combat                                                    | Product-scoped; decompose after outcome 4           |
| **6** | Run the complete responsive, moderated, time-bounded multiplayer test season with onboarding, notifications, standings, reset, and result snapshot | Product-scoped; decompose after outcome 5           |

## Outcome 1 — consequential station founding

### Player result

A player joins the founding cohort without receiving an automatic station, inspects the same seeded world as every other participant, reserves one valid coordinate, chooses one node and a whole-number collector percentage for each raw resource, sees an exact production preview, and confirms the station atomically.

All confirmed stations activate with the same starting state on the shared published season-start tick. After activation, the player sees automatic Aluminium, Steel, and Plutonium production, may submit one coherent next-tick production plan, and may grow the aggregate collector pool through the Station Core's serial collector stream. The responsive interface always distinguishes current output, pending output, owned collectors, production-eligible collectors, and committed construction.

### Included boundary

- One bounded rectangular integer-coordinate world using Euclidean distance, a persisted seed, and a versioned generator configuration.
- Independently clustered, visible, shared, stable, and non-depleting Aluminium, Steel, and Plutonium nodes.
- Hard generation viability checks, a published minimum station distance, coarse founded-station density, one merged invalid-position mask, and voluntary planning markers.
- A stationless seasonal player during founding, one short-lived coordinate reservation per player, and one atomic final founding command.
- Equal starting stocks and energy, a fixed initial collector pool, Station Core, Energy Core I, Shipyard I, Piranha and Qualle designs, one research slot, and weak passive sensing as dormant included state.
- One aggregate collector pool, one selected node per raw resource, whole-number percentages summing to one hundred, a small station baseline, fixed-point production, and an atomic next-tick plan transition.
- A versioned rising marginal collector price and one automatic serial collector stream whose batch cost and schedule equal queued single orders.
- Shared season activation and idempotent economy ticks with the accepted production and collector-completion order.
- A responsive founding and economy experience plus domain, PostgreSQL integration, and Playwright coverage.

### Explicitly outside this outcome

Ships are not built or launched, research does not progress, sensors reveal no tactical contacts, neutral targets are not generated, and no combat, alliance, command-ship, standings, or PvP system is made playable yet. Their included starting capabilities may be persisted, but their old prototype behavior is not part of the acceptance path.

Station relocation, variable node quality, node depletion or ownership, private resource bundles, dynamic world expansion, storage caps, voluntary transfers, individual collector entities or routes, and a universal build-capacity system remain outside the first proper version or later outcomes as defined by the product documents.

## Transition from the prototype

The repository keeps its TypeScript monorepo, authentication and session implementation, NestJS API, React client, PostgreSQL and Drizzle integration, deterministic domain package, Vitest setup, and Playwright harness.

Outcome 1 deliberately replaces rather than adapts these conflicting prototype assumptions:

- `GET /game/me` creating a station as a read side effect,
- automatic sequential station coordinates,
- collected `energy` in the raw-resource record instead of collected Plutonium plus derived energy,
- fixed JSON production sources instead of node-, allocation-, collector-, and distance-derived output,
- `harvester` as an economic ship instead of an aggregate collector pool,
- the prototype's one general FIFO build queue as the economic construction model,
- free starting ships and unlocks that contradict the accepted equal opening state.

No compatibility facade will preserve these concepts inside the new economy. Existing fleet, research, scan, and combat code may remain temporarily isolated and compilable, but it cannot shape the new data model or active user flow. Each later roadmap outcome will migrate or replace the relevant prototype subsystem on the new station and resource foundation. Obsolete code is removed when its replacement outcome takes ownership of that behavior; it is not exposed as a parallel game mode.

## Delivery plan for outcome 1

### 1. Framework-free domain foundation and simulations

Split the new rules into focused domain modules, with `packages/domain/src/index.ts` acting only as the public export boundary rather than receiving another monolithic implementation.

Implement and test:

- versioned season lifecycle and outcome-1 configuration,
- deterministic world generation from seed and population configuration,
- world viability metrics across many seeds,
- coordinates, Euclidean distance, node selection, and minimum-distance placement validation,
- founding-map projections that separate visible economic geography from hidden tactical state,
- whole-plan allocation validation and exact production quotation,
- fixed-point station baseline, collector production, and distance factor,
- marginal collector price and batch quotation from owned plus committed counts,
- collector-stream order, cancellation, refund, completion, and eligibility transitions,
- the versioned economy-tick transition.

The domain must use no NestJS, React, Drizzle, database, clock, or random global. Seeds, current tick, rules versions, and configuration enter as explicit inputs. Exact numeric constants are selected from the simulation gates below, not copied from the prototype or historical PHP game.

### 2. Authoritative persistence and lifecycle

Reshape the current schema around these concepts:

- **Season:** founding and active timestamps, lifecycle status, current tick, seed, generator version, bounds, population/reserve inputs, and economy-rule version.
- **Resource node:** season, stable identity, raw-resource type, and integer coordinate; no owner, capacity, depletion, reservation, or target state.
- **Seasonal player:** may exist without a station during founding and remains unique per account and season.
- **Placement reservation:** at most one live reservation per player, coordinate, expiry, and opaque confirmation identity. It competes with confirmed stations and other live reservations but never reserves nodes.
- **Station:** owner, season, final coordinate, founding/activation state, selected included capabilities, and idempotent activation marker.
- **Station economy:** typed raw-resource balances, derived energy balance, total and production-eligible collectors, current production plan, optional pending plan, activation tick, and last processed economy tick. Authoritative balances and plans must not remain opaque prototype production JSON.
- **Collector stream:** ordered batch commitments with original quote inputs and rules version, committed cost, started/completed/cancelled quantities, and the active unit's completion boundary. Permanent collectors remain aggregate counts rather than rows.
- **Tick run:** unique season-and-tick execution with phase status, retry-safe summary, and enough rule-version context to reproduce the transition.

Coordinate reservation and founding confirmation may serialize through the locked season row for the small first cohort; PostGIS is not required merely to enforce the Euclidean minimum distance. The transaction revalidates live reservations, confirmed stations, selected node types, allocation totals, quote version, and lifecycle before creating the station. A failure creates no partial station or economy.

Development and test data may be rebuilt for this foundational schema. Migrations must still work from an empty database and from the explicitly supported current prototype schema, but there is no promise to preserve prototype game state as valid seasonal state.

### 3. Narrow API surface

Expose commands and projections for:

- current season lifecycle and the player's `needs_founding`, `founding_confirmed`, or `active` state,
- founding-map bounds, resource nodes, coarse density, invalid mask, current reservation, and production-rule metadata,
- coordinate selection or replacement with authoritative expiry and validity,
- exact founding preview and atomic final confirmation,
- active-station economy snapshot with current and next-tick output,
- exact pending production-plan submission,
- collector batch quote and committed order,
- cancellation of the unstarted suffix of a collector order,
- authorized development/admin advancement of the season start and economy tick until a production scheduler is introduced.

Every mutating command validates ownership and season lifecycle, accepts an idempotency key or equivalent stable command identity, recalculates authoritative quotes under their persisted rule version, commits resources and state transactionally, and returns the resulting projection. Read endpoints never create a player, station, reservation, resource, or tick as a side effect.

Concrete URL names may follow the repository's NestJS conventions during implementation; the command boundaries and invariants above are the stable part of the plan.

### 4. Responsive player surface

Replace the prototype's automatic dashboard entry with a phase-aware shell:

1. **Founding map:** full resource geography, coarse station density, invalid mask, candidate comparison, voluntary planning markers, and no tactical directory.
2. **Coordinate confirmation:** reservation countdown, selected resource nodes, adjustable percentages, exact production preview, and one final irreversible confirmation.
3. **Waiting for season start:** confirmed location and plan, common activation time, and no false impression that production is already running.
4. **Active station:** balances, current production, pending next-tick production, collector counts, next marginal price, serial-stream state, order and cancellation controls, and the next economy tick.

Guided and expert presentation use the same authoritative commands and quotes. Mobile is an acceptance target, not a later styling pass. Loading, expiration, invalidated reservation, stale quote, insufficient resources, command retry, empty queue, pending plan, and tick-processing states require explicit UI behavior.

### 5. Acceptance and cleanup

The primary Playwright scenario uses at least two real accounts against one PostgreSQL-backed seeded season and proves:

1. Both accounts see identical resource geography and no automatically created station.
2. A selected coordinate receives one expiring reservation; replacing or expiring it creates no partial state.
3. Concurrent players cannot confirm coordinates inside the minimum distance, while both may select the same resource nodes.
4. The exact founding preview equals the first authoritative production result under the same configuration.
5. Confirming earlier in the founding window grants no progress before the shared start, and both stations activate once at the same tick.
6. A complete new economy plan leaves the old output current until the next tick and then changes all node and allocation fields atomically.
7. One collector batch and the equivalent queued singles have identical cost and completion schedule.
8. Completed collectors first produce on the following tick; cancelling queued units refunds their original costs once and cannot cancel the active unit.
9. Refreshes, repeated commands, concurrent ticks, and retries neither duplicate nor lose resources, stations, collectors, reservations, or production.
10. The entire flow remains usable at the primary mobile viewport and a useful desktop viewport.

Replace prototype Playwright assertions that depend on automatic station creation, free ships, `energy` as a raw resource, harvesters, or the old dashboard. Remove or isolate obsolete seeds and endpoints so there is one active outcome-1 user path.

## Simulation gates before implementation constants

The first domain work includes a deterministic simulation harness. It must explore enough seeds and opening strategies to choose:

- world width and height for the founding cohort plus reserve,
- independent node counts, clustering parameters, and hard viability thresholds,
- minimum station distance and candidate-density guidance,
- the public distance-factor curve,
- station baseline, base node yields, initial collector pool, and fixed-point scale,
- equal starting stocks and energy,
- small Piranha-and-Qualle fleet budget proxy and each opening-priority cost envelope,
- marginal collector-price curve, Aluminium/Steel mix, meaningful first-batch size, and unit interval.

Candidate values pass only if the accepted opening inequalities hold, viable geography remains meaningfully uneven, weak positions remain recoverable through baseline output, collector growth has no split-order advantage or early runaway, and normal plus accelerated counts remain deterministic without overflow. Exact later ship, scan, research, fuel, combat, and season-balance values are not prerequisites for outcome 1.

## Outcome-1 exit condition

Outcome 1 is complete only when:

- its domain rules and simulations are versioned and deterministic,
- its schema and commands are transactional and retry-safe,
- no active read path auto-creates a station or exposes the obsolete economy,
- the PostgreSQL integration suite proves lifecycle, concurrency, idempotency, and conservation,
- the responsive two-player Playwright flow passes from stationless founding through several economy and collector ticks,
- typecheck, lint, formatting, domain/API tests, production builds, and Playwright all pass,
- the product, architecture, testing, and roadmap documents match the implemented behavior,
- outcome 2 can begin from this persisted station and resource foundation without reintroducing a parallel economy.
