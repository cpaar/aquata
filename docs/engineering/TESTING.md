# Testing and verification

Stand: 2026-07-29

## Quality model

Playwright is the main acceptance layer for playable behavior. It is supported by:

- Vitest tests for deterministic domain rules,
- API integration tests against real PostgreSQL,
- strict TypeScript checks,
- ESLint,
- Prettier,
- production builds.

Tests should prove player-visible outcomes rather than merely mirror implementation details.

## Current commands

- corepack pnpm format:check
- corepack pnpm lint
- corepack pnpm typecheck
- corepack pnpm test
- corepack pnpm build
- corepack pnpm e2e

The workspace currently has no dedicated coverage script. Add or run appropriate coverage when implementation work materially changes tested logic, and do not present a green test command as coverage evidence.

## Continuous integration

GitHub Actions runs the complete command set above for every pull request and every push to `main`. The workflow provisions a disposable PostgreSQL 16 service, exposes it only as the dedicated test database, installs the Playwright Chromium version expected by the workspace, and uploads Playwright diagnostics after a failure.

Keep the local and CI command sets aligned. A green unit-test step is not sufficient when PostgreSQL integration tests were skipped or the Playwright acceptance flow did not run.

## Current automated coverage

The current repository contains:

- domain tests for resources, travel, ships, research, build queue, fleets, combat, scans, and tick behavior,
- API integration tests for authentication, station bootstrap, commands, scans, defense, combat, recall, and persisted results,
- two Playwright flows:
  - registration through the first combat report,
  - scan, defense, attack, combat report, and recall.

The existing flows validate the prototype. New product work must replace or reshape them around the command-view and operation loop instead of preserving obsolete UI structure.

For roadmap outcome 1, the primary replacement flow begins with two stationless players in one seeded founding cohort and ends after shared activation, exact production, one next-tick plan change, serial collector completion, and queued-unit cancellation. It must exercise concurrent minimum-distance confirmation, shared node use, reservation expiry, retries, and mobile behavior against real PostgreSQL. `IMPLEMENTATION_ROADMAP.md` owns the complete outcome-specific acceptance sequence.

## PostgreSQL safety

API integration and Playwright tests reset the public schema of their configured database.

Always use a dedicated test database. Never point TEST_DATABASE_URL or the E2E database URL at a development or production database containing data that must be preserved.

API integration tests run only when TEST_DATABASE_URL is set. Without it, the API test suite is skipped, so a successful root test command does not by itself prove API integration.

## Playwright prerequisites

The Playwright browser version expected by the installed package must exist locally. If the browser executable is missing, install the matching Playwright browser before interpreting E2E failures as application failures.

The E2E configuration starts its own API and web servers and uses the configured test database.

## Local defaults

- API: port 3300
- Web: port 5174
- PostgreSQL: port 55432

Recommended development setup:

1. Start the PostgreSQL service with Docker Compose.
2. Run the workspace development command.

The development setup waits for PostgreSQL, applies migrations, and seeds the active prototype round.

## Verification by change type

### Domain rules

- Add deterministic examples and boundary tests.
- Run domain tests, typecheck, lint, and format checks.
- Add simulations when balance behavior cannot be judged from a few fixtures.
- Verify the versioned regular-ship catalog contains exactly the twelve published ship types with distinct hull class, technology tier, combat role, firing phase, matchup values, and complete target order. Reject missing targets, duplicate priorities, hidden post-processing, and effective probabilities above one hundred percent.
- Test every combat tick in the published EMP, first-strike, and simultaneous-main-fire order. EMP must last only for the current combat tick, regular EMP ships must not target regular EMP ships, first-strike losses must suppress later main fire, and main-fire results must remain invariant under ship, fleet, participant, and iteration ordering.
- Prove direct fire uses cannon count, per-cannon firepower, hit chance, damage factor, hull points, and visible modifiers; one cannon cannot destroy more than one regular ship per shot. Fixed-point fixtures must retain sub-casualty effect across attacker groups and combat ticks without rounding cliffs, floating-point drift, or retry duplication.
- Cover every ship type's full target order with absent, partially exhausted, and fully exhausted priority targets, including the transition of remaining fire to later targets. Validate the player expert view and combat report against the same versioned matchup data used by resolution.
- Prove one seasonal player can progress exactly one research project at a time while maintaining an ordered non-progressing queue. Cover completion, automatic queue advancement, insufficient resources, cancellation, retries, and concurrent commands without duplicate cost, progress, or unlocks.
- Test research catch-up against several season ages and player baselines. It must accelerate only eligible foundational projects, taper monotonically to the normal rate, create no stored or transferable balance, and give no advantage on a project at or ahead of the published season-age baseline.
- Verify drive technology preserves ship-specific pace and slowest-ship fleet behavior while changing only the published route-dependent time and fuel components. A completed project must affect newly confirmed quotes but never alter a locked or in-flight order, onboard fuel, fixed return tick count, or fixed launch overhead. It must never reduce defensive travel below four ticks or offensive travel below five.

### API or persistence

- Use a dedicated PostgreSQL test database.
- Test authorization, validation, transactionality, idempotency, and persisted outcomes.
- Apply migrations from an empty database and from the supported previous schema.

### Economy and growth

- Verify the facility catalog contains only the non-upgradable Station Core, Shipyard I–IV, Sensor Array I–II, Communications Center I–II, the single-level Command Dock, and Energy Core I–III unless a later documented product decision changes it. No hidden headquarters level, building slot, research-lab upgrade, warehouse cap, collector factory, fleet or fuel dock, operations-center duplicate, salvage gate, or destructible static defense may appear implicitly.
- Prove Energy Core I is included exactly once with the initial station. Levels II and III must each increase maximum conversion throughput and storage capacity together without changing the normal Plutonium-to-energy ratio, creating separate storage research, or duplicating capacity under retries and concurrent completion.
- Verify every founding receives identical raw-resource stocks and initial energy independent of position, exactly one fixed initial collector pool, Station Core, Energy Core I, Shipyard I, Piranha and Qualle designs, one research slot, and the weak passive sensor baseline—but no completed ship, research project, or additional facility. Under each candidate balance set, the ordinary stock must afford a small operational Piranha-and-Qualle fleet plus any one opening priority while remaining insufficient for that fleet plus the two cheapest priorities.
- Verify the founding lifecycle advances no production, builds, research, fleets, or standings before the published season start regardless of confirmation time. Every confirmed station must activate its starting state exactly once at the shared start tick and receive its first production only after one complete economy interval; unconfirmed or expired placement state must never receive partial or backdated progress.
- Verify every facility remains usable at its previous completed level while an upgrade is in progress, and completion adds the new capability once without cancelling or rewriting existing production, scans, communication, fleet state, energy allocation, or command-ship state.
- Verify collector percentages conserve the one aggregate pool, use one selected node per raw resource, and derive production deterministically in fixed-point from allocation, base yield, distance, and published modifiers without individual route entities. Zero percent must preserve the station baseline. A submitted replacement plan must leave the complete old plan authoritative until the next economy tick and then switch every percentage and node atomically.
- At an economy tick, prove the server activates the complete pending production plan before calculating output, calculates that output only from collectors already eligible for the tick, then completes due collectors and advances their stream. A collector completed at tick `T` must first contribute at `T + 1`; phase retries and concurrent plan changes must neither skip nor duplicate production.
- Prove identical world seed, generator version, and population configuration reproduce the same resource nodes and enabled world sites. Simulation across many seeds must preserve all hard viability constraints while still producing materially uneven node density and station opportunity rather than a disguised uniform grid.
- Verify each initial resource node has exactly one raw-resource type, remains shared and non-depleting, and cannot acquire owner, reservation, target-health, or replenishment state through ordinary collection.
- Test station placement immediately below, at, and above the published minimum distance, including concurrent confirmations. Browsing must reserve nothing; a player may hold only one short-lived coordinate reservation; a committed station coordinate may block an invalid nearby coordinate but must not reserve or exclude shared resource nodes. Confirmation must atomically create exactly one station with its selected nodes, initial allocation, included state, and previewed production, while expiry or failure creates no partial state.
- Verify the world generator emits only enabled world-site types with complete lifecycle rules. No inactive placeholder type may appear as a player-facing map contact, target, or reward source.
- Prove collector construction has no hard ownership cap, remains monotonic at normal and Havoc-scale counts, and gives identical total cost and unit completion schedule for one batch and the equivalent queued sequence of single orders. The dedicated stream must complete one unit per published interval without blocking facilities, ships, or research. A completion contributes first on the following economy tick; cancelling queued units refunds each original committed cost exactly once, while the active unit remains committed. Concurrent orders, cancellations, tick processing, and retries must be idempotent.
- Test that losing collectors reduces the total pool and future marginal construction price without changing the defender's allocation percentages or node choices.
- Verify collectors cannot be intercepted or stolen away from station combat. Snapshot ratio inputs after departures, withdrawals, and arrivals but before combat; include every present attacking fleet and only the deployment value of outside defenders in addition to the target player's authoritative current points. Under optimal station-combat fixtures, each combat tick steals at most fifteen percent of the remaining pool, each operational surviving Hackboot captures at most one collector, and exposure on exactly three combat ticks steals approximately 38.6 percent of the starting total. Splitting Hackboats from escorts, adding another attacker, destroying a counted fleet during combat, withdrawal, reinforcement, staggered schedules, retries, and participant ordering must not omit committed value or duplicate captured collectors.
- Verify the pre-launch commitment view never exposes a collector-theft efficiency forecast. For each resolved combat tick, require the battle report to reproduce the authoritative target player points, outside defensive deployment, attacking deployment, percentage and cap, remaining collectors, operational Hackboots, actual capture, and participant distribution from persisted rule inputs.
- Verify each raw resource protects its versioned reserve and transfers at most twenty-five percent of the currently remaining surplus per combat tick across all attackers. With a fixed reserve and no intervening stock changes, exactly three successful ticks must transfer approximately 57.8 percent of the initial surplus; production, spending, retries, concurrency, multiple attackers, and staggered schedules must conserve value and never multiply the allowance.
- Prove Aluminium, Steel, Plutonium, derived energy, fuel reservations, construction commitments, and captured collectors remain conserved across parallel commands and ownership transitions.
- Verify a docked fleet exposes its exact fixed launch overhead and travel fuel rate without inventing a minimum, maximum, or average total. Once order, route, and intended return are selected, the exact launch-overhead-versus-onboard-fuel quote shown at confirmation must equal the authoritative reservation and transfer under the same rule version.
- Prove confirmation reserves the complete amount at the owner station, cancellation before launch releases it, launch consumes the overhead and transfers travel fuel onto the fleet, movement consumes only onboard fuel, and home arrival credits exactly the unconsumed remainder once. An early recall must return only fuel physically left after its shorter outward and return route, including under retries and concurrent balance changes.
- Prove each independently launched fleet incurs the overhead exactly once, splitting repeats it, retries never duplicate it, and normal or Havoc-scale fleet counts encounter no undocumented slot cap.
- Verify supported facility, ship, collector, and research jobs may progress independently, subject only to the collector-specific serial stream and single active research project, without double-spending resources or implying an undocumented universal capacity limit.

### Web and interaction

- Add or update Playwright coverage for the player flow.
- Verify primary mobile behavior and a useful desktop layout.
- Check loading, empty, error, disabled, and recovery states.
- Avoid asserting the obsolete page structure when the product flow is being redesigned.
- Verify the map distinguishes unknown space, coarse contacts, and scanned intelligence without leaking authoritative hidden state.
- Verify the founding map exposes the generated resource geography, compares access to all three resource types, explains invalid station separation, and uses the same authoritative placement and production rules in guided and expert views.
- Prove passive sensors, area searches, player scans, Movement Analysis, and the Observation Network reveal only eligible game-world state and game-world activity. No result, precision field, provenance record, or derived hint may expose or infer login or logout time, online presence, session rhythm, chat behavior, device data, or other account-level activity.
- Test passive sensor boundaries before and after research, including detected-station launches and arrivals, fleet paths that enter or miss the field, and contacts becoming stale.
- Prove a passive movement contact reveals only its earned origin, direction, and size band and never leaks exact destination, fleet order, or composition.
- Prove persistent fleets retain their internal identity and surviving membership across launch, combat, withdrawal, and return, while only the owner may split, combine, refill, or rebuild them at the home station.
- Prove one fleet order commits every current member of exactly one fleet, its travel quote follows the slowest committed ship, its full normal return uses the locked outbound tick count after any combat losses, and separately launched fleets never merge their orders, withdrawal state, return cargo, or return transitions accidentally.
- Verify the target's incoming-attack projection reveals attacker, exact ship count, and earliest combat tick without exposing composition, private fleet name, internal fleet identifier, or a direct correlation to a scanned fleet. A player scan may show the subject's observed fleet partitions and compositions without adding that correlation.
- Verify area searches and player scans spend stored energy atomically, persist time-stamped intelligence at the correct tier, and respect distance, research, countermeasures, ownership, and sharing permissions.
- Verify the player scan gains sections and precision through Sensor Technology without creating separate fleet, economy, production, command-ship, movement, or news scan actions. Sensor Technology II must reveal rudimentary command-ship status, Fight, Support, or Economy archetype, and exact level or a quality-dependent band; level III adds specialization, assigned fleet, relevant basic combat mode, and a coarse capability profile; level V may add exact combat statistics, modules, effects, and target priorities at the earned scan quality.
- Verify Movement Analysis adds only published current movements from or to the scanned player. It must respect information tier, distance, and countermeasures and may reveal endpoints, travel timing, total size, and broad signature only at the earned precision; it must never leak foreign exact composition, private order, internal fleet identity, private event history, or a retrospective news feed.
- Verify an Observation Network begins coverage of a known player only at activation, charges its visible continuous energy cost, records only supported future game-world events, and ends or records explicit gaps under expiration, energy exhaustion, and countermeasures. It must never backfill earlier events or silently represent an uncovered interval as “nothing happened.”
- Prove scanning player A may reveal that player B is approaching or leaving A, with only the earned movement-level details about B. Exact fleet composition and command-ship data for B must require a player scan whose subject is B, an authorized shared scan of B, or B's deliberately shared allied data. The system must not automatically map an incoming movement to one of B's scanned fleet partitions.
- Verify the player intelligence profile and operation intelligence view preserve every source observation's subject, acquisition time, precision, source type, original observer, permissions, and direct or derived status. Aggregation must distinguish confirmed, observed, probable, and unknown claims and must never refresh stale data, increase precision, widen authorization, or present a probable relationship as confirmed.
- Prove a scan never returns or reconstructs a combat report, participant list, combat ticks, shots, casualties, rewards, or authoritative battle result for an engagement in which the scanner did not participate. A later observable state may support player inference but must not bypass report authorization.
- Prove identical scan inputs produce the same result tier and cannot be improved through repeated retries without a relevant state or committed-energy change.
- Verify Plutonium conversion and persistent sensor, countermeasure, and reserve allocation conserve resources through ticks, retries, concurrent updates, and depleted storage.
- Verify the placement view exposes the intended resource geography without revealing foreign tactical state.
- Verify target leads are usable on mobile without requiring exhaustive manual grid sweeping.
- Cover the guided capability-discovery path from placement and collectors through first scan, persistent fleet, report, recovery, economic raid, command-ship choice, and operational alliance link. An expert presentation may skip explanations but must use identical authoritative prerequisites, costs, timing, placement rules, and resulting state.
- Prove presentation milestones never suppress critical controls or erase earlier progress. Withdrawal, exact commitment data, incoming threats, reports, recovery, and allowed communication must appear whenever applicable, while achievements and standings track from season start even before their detailed surfaces are introduced.
- Verify the included opening state grants exactly one collector pool, fighter-capable Shipyard I, Piranha and Qualle designs, one active research slot, and the weak passive sensor baseline. Replaying, skipping, or racing guidance must never duplicate starting stock, the initial sensor charge, facilities, research, ships, or rewards.
- Prove Sensor Array I and a supported small initial fighter batch can complete within the configured one-tick target, the first fleet can be confirmed during the first session, and a nearby controlled opportunity can resolve and return later the same day under the normal construction, travel, fuel, and combat rules.
- Exercise at least the guided raiding, command-ship rush, reconnaissance and coordination, mobility, and economic opening directions. Each should be reachable without tutorial checklist gates and should expose its intended resource and single-research-slot opportunity costs.

### Social and permissions

- Test visibility and sharing boundaries.
- Prove battle-report access originates only from participation or an explicit permission-bearing share by an eligible participant. Alliance membership, operational linkage, proximity, passive detection, and every scan method must be insufficient on their own.
- Verify blocked, removed, or unauthorized participants cannot read private operation data.
- Verify alliance fleet release applies all-or-none to every currently available fleet belonging to that owner, including newly created or recomposed fleets, without per-fleet grants. A defense call must commit one complete fleet, cannot select a subset, and reserves and loads fuel from the fleet owner's station rather than the caller's station.
- Race concurrent defense calls, owner orders, and fleet edits so at most one command acquires the fleet and every authorized call uses the latest committed composition. Disabling release or ending alliance membership must prevent new calls without carrying permission into a later alliance.
- Include moderation and abuse cases when those systems are implemented.
- Verify social alliance membership and non-tactical planning are possible without an operational station link, while alliance map context, shared scans and reports, operation data, defense calls, and fleet release remain unavailable until the applicable communications-center level and permissions are active.
- Prove an operationally linked player without a sensor array may read an authorized shared scan but cannot create one. The shared observation must retain its original scanner, acquisition time, precision, subject, and permission scope without being refreshed or upgraded; ending membership or losing the operational alliance link immediately blocks new tactical access without erasing allowed social history.

### Identity and account safety

- Prove a season reset removes competitive state while retaining credentials, profile, roles, community history, and allowed long-term statistics.
- Enforce one seasonal persona and player per canonical account, including concurrent creation attempts.
- Verify themed and incognito personas never create additional stations or privileges.
- Verify only authorized moderators can resolve a persona to its canonical account and inspect identity history.
- Prove sanctions, blocks, household restrictions, and account limits still apply through incognito personas.
- Test suspicious-behavior signals as explainable case inputs; they must not issue an irreversible sanction without an authorized moderator command.
- Cover cooperative and independent household rules without treating shared network context alone as guilt.
- Verify all delegated collaboration commands work without logging into another account and remain bounded and auditable.
- Test inactivity warnings at fourteen days, deactivation at twenty-eight days, and safe idempotent retries at each boundary.
- Prove deactivation preserves the canonical account, forfeits seasonal progress, removes operational permissions, and detaches any neutral ruin from the returning player.
- Verify a same-season return creates only a fresh zero-state player under the configured placement protections.
- During vacation, prove all economic and military progression is frozen and gameplay commands fail while explicitly allowed profile and social actions still work.
- Test vacation activation safeguards against active fleet orders, incoming operations, repeated toggling, and concurrent commands.

### Timing and seasonal behavior

- Trigger time deterministically.
- Prove every offensive route is at least five ticks and every equivalent defensive reinforcement route is exactly one tick shorter but at least four ticks, including after every drive upgrade and at zero or near-zero map distance.
- Verify a defender who receives the launch warning and confirms reinforcement during the first following command window can arrive for the attack's first combat tick.
- Verify docked fleets with valid departures at a station's first combat tick leave before combat and are excluded from its defender snapshot, while reinforcement arriving at that tick is included. The now-undefended station must remain eligible for published resource and collector effects.
- Prove each attacking fleet receives no more than three personal attack ticks beginning with its arrival. A fleet arriving during another fleet's second or third tick must still receive its own complete sequence, while both fleets participate in one shared deterministic resolution on every overlapping tick.
- Verify withdrawal after an attacker's first or second personal tick applies before the next combat resolution, preserves secured cargo, and does not alter another fleet's counter. Destroyed, withdrawn, or combat-incapable fleets must end early without granting unused ticks to any participant.
- At launch, test public-attack classification independently for every planned overlapping combat tick. A later launch may mark already-traveling overlapping fleets public, while non-overlapping fleets and ordinary travel-state changes remain unaffected.
- Prove every fleet that reaches its target uses the outbound tick count for its complete normal return even when combat destroys its former slowest ship or every ordinary ship. An early recall retraces only the elapsed outbound route.
- Verify station relocation cannot evade active threats or strand, duplicate, or silently erase fleets, orders, collectors, resources, intelligence, or ownership references.
- Test retries and duplicate execution.
- Test transitions around season stage and reset boundaries.
- Prove that persistent identity data and resettable seasonal power are separated.
- Simulate late entry at several points in a six-month season and measure progress toward meaningful mid-field participation within the two-to-four-week target.
- Prove personal catch-up acceleration tapers at its boundary and cannot be transferred, duplicated, reclaimed through a ruin, or combined with a previous seasonal state.
- Verify attack protection and placement use effective player power without exposing a late entrant as an immediate farm target or hidden alliance reserve.
- Prove every metric award snapshot is deterministic, immutable, uses the published rule version, and is taken before the final battle.
- Verify combat-point fixtures cover relative fleet strength, own-loss offsets, uneven battles, multiple contributors, reinforcements, modifier bounds, and zero-point outcomes.
- Test player aggregation for all five categories and alliance aggregation only for points, combat points, and economy, including membership changes at the standings lock.
- Verify the one authoritative current player-points projection is used identically by the point standing, attack boundaries, and collector-theft target term while deployment value contains only physically committed fleets. Resources converted into collector or ship construction, research, ships, infrastructure, energy, fuel, or return cargo must move between point components without duplication, unexplained loss, or a completion multiplier; public delay, estimation, scanning, concealment, and deception must not change any rules-facing value.
- Test ownership changes, destruction, salvage, fleets in motion, deactivation, and ruin conversion against the authoritative point total.
- Prove public score delay, estimation, or concealment never alters the authoritative award snapshot.
- Verify the economy snapshot reacts to collector construction, theft, and loss before the lock, assigns every eligible collector exactly once, and ignores all changes after the lock.
- Verify achievement ranking compares completed achievements first, total levels second, and first-attainment time third.
- Prove seasonal achievement progress resets while persistent profile recognition survives and contributes no next-season ranking or power.
- Verify each command-ship archetype receives its defined core progression without spending choices on mandatory capabilities, while specialization choices and module loadouts remain distinct.
- Verify every level grants its versioned automatic core reward and archetype-bound development entitlement exactly once, and that no archetype can spend development points on another archetype's axes.
- Test the experience curve is monotonic, increasingly expensive across its published ranges, and has no unintended reachable hard stop or overflow during a full simulated season.
- Verify combat-experience fixtures expose combat significance, the locked deployment-value ratio, challenge multiplier, personal deployment and role contribution, qualification or repeat adjustment, and final award without relying on a hidden effective-power score.
- Test the published challenge curve for even deployments, bounded underdog bonuses, sharply reduced overwhelming-force rewards, monotonic transitions, and both multiplier caps. The pre-commit expectation category and final report must use the same locked deployment values and rule version.
- Verify credible victories and defeats can both grant combat experience from published stakes and opposition rules, and that a credible defeat with comparable stakes and material interaction retains more than half the experience of the comparable victory. Absent command ships, passive time, production ticks, recurring training actions, trivial orders, duplicate outcomes, unilateral sacrifice, and arranged repeats grant none.
- Verify qualifying combat uses the same authoritative experience model for Fight, Support, and Economy command ships without allocating Support experience solely by escort fleet value. A meaningful additional participant must not dilute allies merely by joining, a token participant must not receive a full operation reward, and the participant's added force must still affect the challenge ratio.
- Prove achievements and command-ship ranking recognition cannot increase later command-ship experience rates or mint development points.
- Verify Fight command ships retain the published target-class effectiveness and target-priority behavior in both normal and EMP modes, with no specialization respec or duplicated progression created by switching modes.
- Test Assault and Disruption excellence without making the alternate cannon mode useless; cover both few-strong and many-weak cannon distributions, overkill behavior, target ordering, and every permitted reconfiguration stage.
- Prove AoE modules respect their target and total-effect bounds in small and endgame-scale battles and do not multiply output without limit as the opposing fleet grows.
- Verify offensive and defensive Support effects apply only while the command ship participates in the relevant operation, combine independently across different effect categories, and use the published deterministic diminishing-returns curve within the same category.
- Prove every additional overlapping Support command ship still contributes positive value while identical-effect mass stacking remains bounded and cannot bypass modifier caps through ordering, join timing, or operation composition.
- Verify Support experience role credit uses the published share of relevant allied deployment under active Support effects, remains visible in the report, and applies overlap adjustments without attempting to infer counterfactual kills, hits, or survival.
- Verify Production and Recovery modify only their published Economy capabilities, while logistics modules adapt either build without silently creating a third progression branch.
- Prove passive production ticks, routes, expeditions, salvage, deliveries, and other non-combat Economy activity never grant command-ship experience in the initial model.
- Test arranged battles, duplicate reports, and deliberately wasteful losses cannot farm Economy command-ship progression; separate economic recovery rules must also prevent net-positive self-destruction even though recovery grants no initial command-ship experience.
- Prove modules cannot reproduce another archetype's defining role and that supported combinations of similar command ships contribute according to the published overlap rules.
- Prove a seasonal module unlock is granted at most once per qualifying event, cannot duplicate an existing unlock, remains available after loadout changes or command-ship destruction, and disappears from competitive state at season reset.
- Verify retries, concurrent claims, repeated logins, or repeated fleet commands cannot duplicate an unlock or activity credit beyond the published acquisition rule.
- Verify an activity milestone offers an authoritative revealed choice rather than a blind draw and that missing a calendar day never resets accumulated progress.
- Verify the published command-ship comparison uses only authoritative seasonal progression facts and remains stable after the standings lock.
- Prove personal achievement levels never enter an alliance award total.
- Prove command-ship development never enters an alliance award total.
- Verify final-battle losses and Havoc activity cannot change official placements or rewards derived from the frozen snapshot.
- Test every allowed and forbidden transition between regular season, final battle, Havoc, reset, intermission, and the next opening.
- Prove Havoc state is deleted or detached at reset and cannot grant resources, unlocks, permissions, or timing advantages in the next season.
- Verify the one-day intermission blocks gameplay commands while retaining explicitly allowed account, profile, and social access.

## Completion standard

Before handing off implementation work:

- relevant tests pass,
- lint and typecheck pass,
- the production build passes,
- the playable flow is verified proportionally to risk,
- coverage is reported when available and relevant,
- product and engineering documentation reflect the resulting behavior.
