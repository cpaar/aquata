# Warfare, intelligence, and recovery

Stand: 2026-07-22

## Strategic premise

Aquata combat is not primarily about pressing an attack button or calculating a larger number. The interesting play is:

- finding a worthwhile target,
- judging incomplete information,
- considering geography and possible support,
- deciding how much power to expose,
- coordinating allies,
- hiding the true purpose of an operation,
- accepting and recovering from consequences.

## Target selection

A good target sits between two bad extremes:

- A target that is too strong may destroy the attacking fleet.
- A target that is too weak offers little meaningful loot, salvage, or experience.

Target value also depends on:

- distance and commitment time,
- known and estimated defenses,
- nearby allied fleets,
- freshness and quality of scans,
- recent activity,
- likely reaction from an alliance,
- whether pressure on this target supports a larger operation.

The interface should expose the factors and uncertainty. It must not reduce the choice to a guaranteed red, yellow, or green outcome.

## Intelligence

Information is a resource with:

- acquisition cost,
- age,
- confidence,
- scope,
- ownership,
- sharing permissions,
- possible countermeasures.

Reconnaissance begins with three layers rather than a global directory of targets.

### Passive sensor field

Every station maintains a passive sensor field around its position. Research primarily expands its radius. Within that radius, the player automatically receives coarse contacts for nearby stations, launches and arrivals at detected stations, fleets crossing the field, ruins, anomalies, and other possible opportunities.

Passive contact data creates leads rather than complete answers. The initial fleet-movement baseline is a known origin when that station is already identified, direction, and a broad size class. It does not reveal the exact destination, ship composition, or mission. Previously observed geography may remain on the map while tactical contacts and activity become stale when they are no longer observed.

Continuous energy assigned to sensors improves observation quality or refresh behavior inside the researched field. It does not freely redefine the field's radius; this keeps the boundary understandable while research remains the main source of passive reach.

### Sector scan

A manual sector scan spends stored energy to investigate a selected area at or beyond passive sensor reach. It may reveal previously unknown stations, movement contacts, ruins, resource opportunities, anomalies, and possible module-related missions. Sector scans make distant discovery possible without restoring the historical ability to select every player from a fully exposed map or ranking.

### Targeted deep scan

A detected contact can receive a manual deep scan. The player chooses an intelligence focus rather than invoking a separate unrelated subsystem for every report:

- economy and resources,
- fleets,
- command ship and production,
- current movement.

The result is a time-stamped report with a defined detail level, ranges, unknown fields, and confidence. A current-movement focus does not copy the target's private event history as the historical news scan did. Scans and discovered contacts may be shared through explicit alliance permissions.

Scan strength, distance, research, and the target's countermeasure allocation determine the information tier. An unchanged scan against unchanged defenses should not be repeatable until a random attempt succeeds. Strong defense degrades precision or conceals fields rather than making fabricated exact values the default. More elaborate decoys and deliberate misinformation may be added later only if their counterplay remains understandable.

### Reconnaissance energy

The station converts Plutonium into a stored energy resource. Production rate, efficiency, and storage can grow through progression. The player maintains a persistent allocation policy for generated energy between:

- passive sensors,
- countermeasures,
- storage for manual scans.

Countermeasures reduce the quality of hostile scans and movement signatures. They do not make a nearby permanent station unconditionally invisible. The allocation continues without repeated manual input and must expose its Plutonium cost and expected energy flow before confirmation.

This reconnaissance foundation is universal rather than gated behind a dedicated command-ship archetype. Research, fleets, station systems, and modules may improve or modify it, but every player can participate in discovery, scanning, counterintelligence, and intelligence sharing. A fourth reconnaissance command ship is outside the initial model and may be reconsidered later.

Players must be able to tell:

- when information was obtained,
- what it actually proves,
- what remains estimated or unknown,
- who may access it,
- whether newer events may have invalidated it.

Perfect information would remove bluffing. Completely opaque information would make losses feel arbitrary. Aquata should live between those extremes.

## Geography and support

Distance determines more than travel duration. It affects:

- who can reinforce in time,
- how long a fleet is committed,
- the credibility of a threat,
- opportunities for interception or counterattack,
- the safety of reserves,
- the political importance of local neighborhoods.

Before committing, a player should be able to inspect plausible support relationships without receiving certainty that only a fresh scan or actual movement could provide.

These relationships arise on a continuous two-dimensional map. Resource geography creates organic local clusters, but those clusters are not fixed settlements, oceans, teams, or attack boundaries. Local targets should dominate everyday play through convenience and support relationships, while distant targets remain viable for deliberate operations without a special cross-region penalty.

## Operations and deception

An operation can coordinate several actions around a shared intention:

- main attacks,
- secondary attacks,
- decoy fleets,
- defensive support,
- held reserves,
- scans and observation,
- recalls or timing changes.

Historically, several simultaneous fleets and scan defense made it difficult for the opponent to know who would receive the main force. This information warfare is a core mechanic to preserve.

The operation system should help allies coordinate timing and roles without automatically executing the strategy for them. The players should still make and commit the decisions.

### Hourly operation rounds

Fleet launches, arrivals, and combat resolution use shared hourly boundaries. During the preceding hour, a fleet owner may confirm an offensive order for the next boundary. Operations may hold plans, roles, intelligence, and prepared fleet drafts further in advance, but the initial model does not turn those drafts into automatic future attacks. The owner must make the final launch decision during the immediately preceding command window.

At departure, the target receives an incoming-attack notification and the earliest combat hour. Entering the order near the end of the command window does not create a movement or warning advantage: all confirmed orders in that window depart together. Offensive travel requires one additional operation round relative to defensive reinforcement under equivalent conditions. This preserves the historical commitment disadvantage of attacking and gives the notified defender a complete round in which to organize help. Exact fleet composition and other concealed facts remain subject to reconnaissance.

## Combat resolution

Combat must be deterministic enough to test and explain, while retaining uncertainty before the battle through imperfect intelligence and human decisions.

An engagement resolves in up to three hourly combat steps and may end earlier when its mission state no longer supports another step. Each step produces an immediate authoritative result. Surviving fleets remain committed by default, while valid withdrawals and fleets arriving before the next boundary affect the following step. Continuing after the opposition has weakened may yield further raid effects, including another collector-theft opportunity, but exposes the attacker to later defensive reinforcement.

Reports should distinguish:

- participants and roles,
- fleet composition,
- relevant command-ship or skill effects,
- attacks and losses,
- loot and salvage,
- experience and progression,
- which pre-battle assumptions proved false.

The exact damage formula, withdrawal rules, early-ending conditions, and role of randomness are not yet product decisions.

## Combat points

Combat points measure the quality and impact of PvP combat, not a raw number of kills.

The historical implementation used principles worth preserving:

- destroyed ship value created positive credit,
- the player's own destroyed ship value reduced that credit within the battle,
- relative committed fleet value changed how much the destruction was worth,
- average firepower, shields, hit chance, and evasion bonuses also influenced the ratio,
- a smaller force received more credit for damaging a stronger force,
- an overwhelmingly stronger force received less credit for the same destroyed value,
- points in a multi-player battle were divided according to each participant's committed fleet value,
- a bad battle could yield zero new combat points but did not subtract from the accumulated season total.

Historically, enemy losses used a fourteen-percent base factor, own losses a four-percent offset, and the final force-ratio multiplier was bounded between 0.1 and 1.5. These values are reference material, not current balance decisions.

The remake should retain the ratio-sensitive principle and make the result explainable in every battle report. Players should be able to see destroyed value, own-loss offset, relative-strength modifier, personal contribution, bonuses, and final combat points without reverse-engineering a hidden formula.

The new calculation must be simulated against deliberately uneven battles, alliance operations, defensive reinforcement, low-value farming, arranged sacrifice, and different fleet compositions before it becomes an award metric.

## Loss and salvage

Historically, combat always produced Müll as recoverable material:

- a larger portion came from the player's own destroyed ships,
- a smaller portion came from enemy ships destroyed,
- depending on command-ship and other effects, roughly 30 to 50 percent of own losses may have been recoverable.

These numbers are historical context, not current balance decisions.

The underlying principle is current:

- defeat must consume real power,
- destroying enemy ships should provide some value even when the final result is unfavorable,
- part of a lost fleet should return as rebuilding capacity,
- salvage should soften a defeat without making it irrelevant.

Salvage is governed by a strict conservation rule. Across all participants, the canonical resource value of Müll awarded by a combat step and by the complete engagement must remain lower than the canonical replacement value permanently destroyed in that combat. Own-loss recovery, rewards for damage to enemies, command-ship effects, modules, and every other bonus are claims against this one bounded loss pool; they are not independent sources that may add up beyond it. Bonuses may improve a participant's share or move total recovery toward the published ceiling, but may never raise that ceiling or create resources.

Stolen resources and collectors are transfers from the defender rather than generated value. A disabled command ship that returns for repair is not a permanently destroyed replacement-value loss and therefore cannot produce full ship-value salvage in addition to returning home. Its economic loss comes from repair and unavailable time. Consequently, every resolved attack must leave at least one side economically worse off through permanent losses, transferred property, consumed fuel, or repair cost.

Müll may remain as an Aquata term if it fits the final tone and is clearly explained.

## Recovery after defeat

A catastrophic defeat should be a serious setback, but normally not the end of the season.

Recovery can come from:

- salvage from the battle,
- collectors and production that remained at home,
- stored resources and reserves,
- support or transfers within a social group,
- smaller appropriate raids,
- neutral or systemic recovery opportunities,
- temporary protection after extreme losses.

Historically, weakened players could rebuild by farming smaller or inactive players. Inactive stations were especially valuable for new players learning their first successful attacks and for defeated players rebuilding with a small fleet.

The remake should preserve this ladder of understandable, lower-risk targets. Accounts should not disappear from the world immediately after becoming inactive.

After fourteen days of seasonal inactivity, the player and their alliance receive a warning. After twenty-eight total days, the player's seasonal state is deactivated and their progress is forfeited while the persistent account survives. The former station should then become a neutral abandoned station or ruin, detached from the player's control, so it can continue to support first attacks and recovery without treating an absent person as a permanent victim.

A returning player starts a fresh seasonal state from zero and does not reclaim the ruin in addition to receiving a new station. Exact ruin production, decay, loot, collector behavior, lifetime, target protection, and return placement remain open. The account lifecycle is defined in IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md.

## Attack boundaries

Attack boundaries are a core fairness mechanism. They protect small players from overwhelming powers and give recovering players a viable field of opponents.

The historical principle should remain, but the experience must become legible.

Before launching, the player should see:

- whether the target is eligible,
- which rule establishes eligibility,
- whether only part of the fleet may be used,
- how the permitted commitment or reward changes,
- when a temporary restriction expires,
- how recent losses, protection, or activity affect the boundary.

The system must avoid hidden formulas and unexplained rejection messages.

Attack boundaries should prevent predation by vastly stronger players without removing target judgment, bluffing, or the possibility of taking a calculated risk.

## Sleep, safety, and income

Players should be able to choose between maximum economic output and a safer rest period.

A voluntary safety posture should:

- be selected before danger is already known,
- reduce resource income or otherwise impose a meaningful economic cost,
- make attacks less attractive rather than impossible,
- preserve strategic reasons to attack despite reduced immediate loot,
- last for a bounded rest period,
- be understandable to both the protected player and potential attackers,
- avoid becoming a permanent default state with no real tradeoff.

The exact deterrent may combine reduced lootable resources, redirected production, defensive preparation, or lower attacker rewards. The final mechanism is open.

Choosing maximum income means accepting more exposure. This is a deliberate competitive tradeoff: relaxed players can sleep with a modest penalty, while top competitors may remain exposed and organize active coverage to preserve maximum growth.

Alliance night watches are part of the intended social strategy.

Historically, only a fleet's owner could compose and release it. One settlement General could recall released fleets from active missions, but had no further control. Settlement members could call an available released fleet only to defend their own station.

The remake should preserve this narrow delegation without requiring settlements. An operation may appoint one commander who can recall explicitly released participating fleets. Separately released readiness fleets may be called by authorized players for self-defense. No delegate may change composition, launch an attack, or redirect a fleet beyond the granted defensive purpose.

All delegated actions must be visible to the owner and recorded. The final trust scope and conflict rules are still open.

## Unresolved balance goals

Exact salvage rates, attack-band formulas, safety-posture duration and penalty, raid rewards, experience distribution, and repeated-target limits remain open. They should be decided through simulations and playable tests rather than copied directly from historical values.
