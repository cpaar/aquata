# Testing and verification

Stand: 2026-07-22

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

## Current automated coverage

The current repository contains:

- domain tests for resources, travel, ships, research, build queue, fleets, combat, scans, and tick behavior,
- API integration tests for authentication, station bootstrap, commands, scans, defense, combat, recall, and persisted results,
- two Playwright flows:
  - registration through the first combat report,
  - scan, defense, attack, combat report, and recall.

The existing flows validate the prototype. New product work must replace or reshape them around the command-view and operation loop instead of preserving obsolete UI structure.

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

### API or persistence

- Use a dedicated PostgreSQL test database.
- Test authorization, validation, transactionality, idempotency, and persisted outcomes.
- Apply migrations from an empty database and from the supported previous schema.

### Web and interaction

- Add or update Playwright coverage for the player flow.
- Verify primary mobile behavior and a useful desktop layout.
- Check loading, empty, error, disabled, and recovery states.
- Avoid asserting the obsolete page structure when the product flow is being redesigned.
- Verify the map distinguishes unknown space, coarse contacts, and scanned intelligence without leaking authoritative hidden state.
- Test passive sensor boundaries before and after research, including detected-station launches and arrivals, fleet paths that enter or miss the field, and contacts becoming stale.
- Prove a passive movement contact reveals only its earned origin, direction, and size band and never leaks exact destination, mission, or composition.
- Verify sector and deep scans spend stored energy atomically, persist time-stamped intelligence at the correct tier, and respect distance, research, countermeasures, ownership, and sharing permissions.
- Prove identical scan inputs produce the same result tier and cannot be improved through repeated retries without a relevant state or committed-energy change.
- Verify Plutonium conversion and persistent sensor, countermeasure, and reserve allocation conserve resources through ticks, retries, concurrent updates, and depleted storage.
- Verify the placement view exposes the intended resource geography without revealing foreign tactical state.
- Verify target leads are usable on mobile without requiring exhaustive manual grid sweeping.

### Social and permissions

- Test visibility and sharing boundaries.
- Verify blocked, removed, or unauthorized participants cannot read private operation data.
- Include moderation and abuse cases when those systems are implemented.

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
- Test vacation activation safeguards against active missions, incoming operations, repeated toggling, and concurrent commands.

### Timing and seasonal behavior

- Trigger time deterministically.
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
- Verify resources converted into construction, research, ships, or infrastructure move between point components without duplication or unexplained loss.
- Test ownership changes, destruction, salvage, fleets in motion, deactivation, and ruin conversion against the authoritative point total.
- Prove public score delay, estimation, or concealment never alters the authoritative award snapshot.
- Verify the economy snapshot reacts to collector construction, theft, and loss before the lock, assigns every eligible collector exactly once, and ignores all changes after the lock.
- Verify achievement ranking compares completed achievements first, total levels second, and first-attainment time third.
- Prove seasonal achievement progress resets while persistent profile recognition survives and contributes no next-season ranking or power.
- Verify each command-ship archetype receives its defined core progression without spending choices on mandatory capabilities, while specialization choices and module loadouts remain distinct.
- Verify every level grants its versioned automatic core reward and archetype-bound development entitlement exactly once, and that no archetype can spend development points on another archetype's axes.
- Test the experience curve is monotonic, increasingly expensive across its published ranges, and has no unintended reachable hard stop or overflow during a full simulated season.
- Verify credible victories and defeats can both grant combat experience from published stakes and opposition rules, while absent command ships, passive time, production ticks, recurring training actions, trivial orders, duplicate outcomes, and arranged repeats grant none.
- Verify qualifying Fight, Support, and Economy operations use comparable authoritative progression rules without allocating Support experience solely by escort fleet value or forcing Economy progression through combat.
- Prove achievements and command-ship ranking recognition cannot increase later command-ship experience rates or mint development points.
- Verify Fight command ships retain the published target-class effectiveness and target-priority behavior in both normal and EMP modes, with no specialization respec or duplicated progression created by switching modes.
- Test Assault and Disruption excellence without making the alternate cannon mode useless; cover both few-strong and many-weak cannon distributions, overkill behavior, target ordering, and every permitted reconfiguration stage.
- Prove AoE modules respect their target and total-effect bounds in small and endgame-scale battles and do not multiply output without limit as the opposing fleet grows.
- Verify offensive and defensive Support effects apply only while the command ship participates in the relevant operation, combine independently across different effect categories, and use the published deterministic diminishing-returns curve within the same category.
- Prove every additional overlapping Support command ship still contributes positive value while identical-effect mass stacking remains bounded and cannot bypass modifier caps through ordering, join timing, or operation composition.
- Verify Production and Recovery modify only their published Economy capabilities, while logistics modules adapt either build without silently creating a third progression branch.
- Prove passive production ticks never grant Economy command-ship experience; qualifying routes, expeditions, salvage, and risky deliveries grant it at most once under the published participation rules.
- Test arranged battles, repeated recovery, duplicate reports, and deliberately wasteful losses cannot produce net-positive resources or farm Economy progression.
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
