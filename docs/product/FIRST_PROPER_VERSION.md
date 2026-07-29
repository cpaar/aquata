# First proper playable version

Stand: 2026-07-29

## Purpose

The first proper playable version is a real multiplayer vertical slice from station placement through growth, reconnaissance, neutral raiding, PvP, alliance response, command-ship development, loss, return, and recovery.

It runs as a time-bounded test season in one authoritative shared world. It is not a miniature imitation of a complete six-month season and does not need an artificial endgame made from systems that have not yet earned their place.

This document owns the version boundary. The topical product documents own the detailed rules. A system classified as a **simple foundation** is included in deliberately shallow form; a **deferred** system is neither required in the player-facing version nor a reason to delay it.

## Complete player journey

1. Inspect the uneven Aluminium, Steel, and Plutonium geography and commit one final station position.
2. Allocate the initial collector pool, select one node per resource, and spend the equal starting stock on a small Piranha-and-Qualle fleet plus one opening priority—or deliberately delay the fleet to invest more deeply in reconnaissance, cooperation, research, or growth.
3. Use the weak passive sensor baseline, build Sensor Array I, scan a lead, and choose between a safer and a riskier neutral opportunity.
4. Build and launch one persistent Piranha-and-Qualle fleet with exact travel time, launch overhead, onboard fuel, and return commitment.
5. Resolve deterministic combat, read the report, receive the returning fleet and cargo, and refill or rebuild the persistent fleet.
6. Research and build Hai and Hackboot, then learn escorted collector capture against a stronger neutral or eligible player target.
7. Scan a player, judge coarse and time-stamped intelligence, pass the visible attack-boundary check, and commit an attack during the final command window.
8. Let the warned target preserve fleets, gather intelligence, or call a released allied defense fleet before combat.
9. Resolve overlapping fleet attacks through each attacker's own maximum of three attack ticks, including withdrawal, reinforcement, resource theft, collector capture, and salvage.
10. Return secured cargo, convert Müll automatically into ordinary resources, repair or rebuild, and apply the transparent recovery flag after a severe net recovery gap.
11. Share the scan or battle report, discuss the result in context, and make the next economic, military, or alliance decision.
12. Bring the Command Dock online later in the test season, choose Fight, Support, or Economy, and earn the first command-ship levels through meaningful combat.

## Scope cut

| System                      | Required complete path                                                                                                                                                                                                                                                            | Simple foundation included                                                                                                                                                     | Explicitly deferred                                                                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **World**                   | One seeded connected 2D world; uneven shared resource nodes; consequential final station placement; player stations; two neutral-facility strength bands                                                                                                                          | Published minimum station distance and a simple world target budget that replaces consumed neutral facilities                                                                  | Ruins, modules, abandoned stations, anomalies, hazards, variable node quality, relocation, and dynamic world expansion                                           |
| **Economy**                 | Aluminium, Steel, Plutonium, small station baseline, one aggregate collector pool, percentage allocation, one selected node per resource, automatic production, rising collector marginal cost, fuel, and energy                                                                  | Uncapped collectors, one serial collector stream, otherwise independent construction systems, no storage caps, one progressing research project, and Energy Core I             | Voluntary resource or collector transfers, production chains, extra currencies, higher Energy Core levels, universal build capacity, and storage facilities      |
| **Facilities and research** | Included Station Core, Shipyard I, and Energy Core I; buildable Shipyard II, Sensor Array I, Communications Center I-II, and Command Dock; Ship Engineering II, Sensor Technology II, and Drive Technology II                                                                     | One research queue behind the active project; research order rather than exclusive branches creates the opening choice                                                         | Every higher facility level, higher research project, additional field, and additional facility family                                                           |
| **Reconnaissance**          | Weak passive local contacts, one growing player scan, coarse resources/collectors/total force, explicit age and precision, and permission-bearing sharing                                                                                                                         | Area search, modest passive-reach growth, basic command-ship presence/archetype/level-band intelligence, and understandable countermeasures                                    | Exact fleet composition, production intelligence, Movement Analysis, Observation Network, continuous observation, and deliberate misinformation                  |
| **Regular fleets**          | Persistent complete fleets using Piranha, Qualle, Hai, and Hackboot; owner composition; complete-fleet orders; travel, recall, and return                                                                                                                                         | Simple templates for refill and rebuilding; no initial fleet-count cap                                                                                                         | Taifun, Blizzard, every later regular ship, interception, in-flight redirecting, refueling, and arbitrary partial-fleet launches                                 |
| **Combat and return**       | Hourly ticks; minimum five-tick attack and four-tick equivalent defense; deterministic EMP, first strike, and main fire; each attacking fleet has up to three own attack ticks; withdrawal, reinforcement, theft, Müll, return cargo, empty recovery return, and readable reports | Fleets whose personal attack schedules overlap fight together on that tick; public-attack evaluation combines only fleets that share such a tick                               | Random combat rolls, route interception, destructible station facilities, and additional combat layers                                                           |
| **Command ship**            | One physical Fight, Support, or Economy command ship; one fleet assignment; defining archetype mechanics; combat participation; disable, return, and repair; first levels                                                                                                         | Initial target of levels 1-5 with automatic core growth and transparent combat experience                                                                                      | Development-point builds, specializations, modules, module acquisition, deep level curves, and non-combat experience sources                                     |
| **PvP fairness**            | Initial PvP protection, one authoritative player-points value, visible eligibility and maximum deployment, repeated-target protection, bounded theft, and the role-neutral recovery flag                                                                                          | Newly launched attacks against a flagged player become public and take one additional tick; launching an attack removes the owner's flag                                       | Routine night safety, bunker state, automatic absence protection, hidden conflict scores, and exact balance curves before simulation                             |
| **Alliance play**           | Alliance membership, operational link, scan/report sharing, defense calls, owner-level all-or-none fleet release, owner-funded fuel, and auditable actions                                                                                                                        | Global, alliance, direct, and operation Macbox scopes; one minimal operation with target, tick, participants, roles, shared intelligence, conversation, and confirmation state | Configurable role systems, treaties, coalitions, cross-alliance release, forums, and extensive political administration                                          |
| **Experience**              | Responsive web app with Situation, Map, Operations, and Macbox as primary surfaces; contextual economy, research, fleets, and reports                                                                                                                                             | Skippable state-aware onboarding and browser notifications only for incoming attacks, critical operation decisions, combat results, and fleet returns                          | Native apps, separate tutorial worlds or rules, large expert dashboards, and routine production notifications                                                    |
| **Season wrapper**          | Seeded shared test season, published start and end, limited founding window, equal seasonal start, authoritative points, reset, and administrative result snapshot                                                                                                                | Simple current player and alliance standings                                                                                                                                   | Open late entry, catch-up, global season stages, awards, achievements, Final Battle, Havoc, Hall of Fame, and persistent season history                          |
| **Identity and safety**     | Persistent account, one seasonal player and station, public player name, basic profile, alliance visibility, block, mute, report, moderation, and critical audit trails                                                                                                           | Manual multi-account review for the closed cohort                                                                                                                              | Incognito seasons, persistent friend graph, household modes, vacation mode, automatic inactivity lifecycle, abandoned stations, cosmetics, and complex sanctions |

## Dependency order

The roadmap should deliver playable outcomes in this dependency order:

1. generated world, placement, station, and automatic economy,
2. reconnaissance and the complete neutral scan-fleet-combat-return loop,
3. PvP, bounded theft, salvage, return cargo, and recovery,
4. alliance intelligence, defense calls, and minimal operations,
5. the three command-ship archetypes and their first levels,
6. integrated onboarding, notifications, moderation, and a complete multiplayer test season.

The command ship is late in the dependency order because Fight needs stable combat, Support needs real allied participation, and Economy needs stable production, salvage, and recovery. It remains part of the acceptance boundary for the version.

## Balance work after scope

Only values needed by the included path should be fixed before implementation. At minimum, simulations must cover:

- world size, node distribution, placement viability, and the resource-distance curve,
- starting stock, collector output and marginal cost, construction and research timing, energy, and fuel,
- the four regular ships and the initial command-ship levels,
- attack eligibility, maximum deployment, protected reserves, theft, salvage, recovery qualification, and recovery duration,
- staggered fleets whose individual three-tick attack schedules overlap or form successive pressure against one target,
- repeated-target protection that cannot be bypassed by splitting fleets or pre-launching several waves,
- neutral-facility supply, depletion, replacement, and same-tick contention.

Full-season curves, later ships, modules, endgame systems, and deferred content must not become prerequisites for validating this version.
