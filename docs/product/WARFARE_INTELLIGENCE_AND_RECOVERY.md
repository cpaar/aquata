# Warfare, intelligence, and recovery

Stand: 2026-07-24

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
- recent observable game-world activity,
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

Reconnaissance observes **game-world state and game-world activity**, never the person behind an account. A scan may reveal eligible state such as resources or fleets and externally detectable events such as a fleet launch, arrival, return, reinforcement, or passage through observed space. It never exposes login or logout times, online presence, session rhythm, chat behavior, device data, or any other account-level or real-person activity. An activity label such as quiet, occasional, or high must be derived only from detected game-world events and must never be presented as a claim that a player is currently online or active.

A scan never exposes or reconstructs the combat report of an engagement in which the scanning player did not participate. Battle reports are authoritative participant records. An eligible participant may deliberately share a report through its normal permission-bearing social object, but reconnaissance cannot create that access. A later scan may reveal the target's then-observable state or bounded movement traces from which losses can be inferred; it does not reveal the engagement's participants, combat steps, shots, casualties, rewards, or report contents merely because combat occurred there.

Reconnaissance begins with three layers rather than a global directory of targets.

The station begins with a deliberately weak passive sensor baseline that can surface a few coarse local leads. A **sensor array** provides the physical capability for player-directed reconnaissance; sensor research expands the methods and reach available through that hardware. Facility capability and research may both be required, but their levels do not mirror one another one-for-one.

Sensor Array I is a bootstrap facility that should complete within one operation-round interval. Its activation makes energy controls relevant and leaves the station with enough initial stored energy for one meaningful basic targeted scan. This initial charge belongs to the one seasonal station state, cannot be reclaimed by replaying guidance, and uses the same scan rule as later stored energy. Further scans depend on normal Plutonium conversion and energy management.

### Passive sensor field

Every station maintains a passive sensor field around its position. Research primarily expands its radius. Within that radius, the player automatically receives coarse contacts for nearby stations, launches and arrivals at detected stations, fleets crossing the field, ruins, anomalies, and other possible opportunities.

Passive contact data creates leads rather than complete answers. The initial fleet-movement baseline is a known origin when that station is already identified, direction, and a broad size class. It does not reveal the exact destination, ship composition, or fleet order. Previously observed geography may remain on the map while tactical contacts and activity become stale when they are no longer observed.

Continuous energy assigned to sensors improves observation quality or refresh behavior inside the researched field. It does not freely redefine the field's radius; this keeps the boundary understandable while research remains the main source of passive reach.

### Sector scan

A manual sector scan spends stored energy to investigate a selected area at or beyond passive sensor reach. It may reveal previously unknown stations, movement contacts, ruins, resource opportunities, anomalies, and possible module-related missions. Sector scans make distant discovery possible without restoring the historical ability to select every player from a fully exposed map or ranking.

### Targeted deep scan

A detected contact can receive a manual deep scan. The player chooses an intelligence focus rather than invoking a separate unrelated subsystem for every report:

- economy and resources,
- fleets,
- command ship and production,
- movement analysis.

The result is a time-stamped report with a defined detail level, ranges, unknown fields, and confidence. Scans and discovered contacts may be shared through explicit alliance permissions when the participating seasonal stations have the required operational alliance link.

A sufficiently strong fleet-focused scan may reveal the target's current division of ships into fleets and, at higher detail, their compositions. It does not expose stable internal fleet identifiers, private fleet names, fleet orders, or a direct mapping from a scanned fleet to a movement contact or destination. Players may infer likely matches from ship counts, timing, speed, and subsequent observations, but the game does not confirm that correlation for them.

Scan strength, distance, research, and the target's countermeasure allocation determine the information tier. An unchanged scan against unchanged defenses should not be repeatable until a random attempt succeeds. Strong defense degrades precision or conceals fields rather than making fabricated exact values the default. More elaborate decoys and deliberate misinformation may be added later only if their counterplay remains understandable.

### Movement analysis

Movement Analysis is the fourth Sensor Technology project and a focused deep-scan method. It combines the target's currently observable movement contacts with a bounded retrospective of externally detectable game-world movement. It answers “what appears to have happened here recently?” without copying a private news feed or exposing player activity.

Depending on information tier, a result may contain:

- current movement contacts,
- recent detected launches, arrivals, returns, or reinforcements within a published lookback window,
- approximate operation rounds or time bands, direction, and broad fleet-size bands,
- an activity band derived solely from those detected game-world events,
- at the strongest supported tier, the exact hourly operation round of an observed launch or arrival.

It does not expose login state, exact destination, ship composition, private fleet name, stable fleet identifier, hidden fleet order, private event history, or a foreign battle report. Missing detail remains explicitly unknown. A low event count may mean that little observable movement occurred, that events fell outside the lookback window, or that distance and countermeasures concealed them; it is not proof that the player was absent.

### Observation network

The Observation Network is the sixth Sensor Technology project and the future-facing counterpart to Movement Analysis. The player commits a time-limited observation to a known station, known contact, or bounded area and pays a visible continuous energy cost. Coverage begins when the observation is activated and is never retroactive.

While coverage is valid, it may record externally observable launches, arrivals, returns, reinforcements, and fleet passages through the watched area. Detail still depends on sensor strength, distance, energy commitment, and countermeasures. It does not automatically reveal exact destinations, compositions, private orders, production, research, resources, communication, account activity, or foreign battle reports. Players may correlate several observations and infer a plan, but the system does not confirm hidden links for them.

Energy exhaustion, countermeasures, or other coverage loss creates a visible observation gap rather than a false statement that nothing happened. Observation results may be shared only through the same operational alliance link and explicit intelligence permissions as other scans. The network preserves the valuable historical practice of watching for launches and reinforcements while making the watched interval, cost, evidence, and uncertainty explicit.

### Reconnaissance energy

The station converts Plutonium into stored energy through its Energy Core. Energy Core I belongs to the initial station; levels II and III increase maximum conversion throughput and storage capacity together. The ordinary Plutonium-to-energy ratio does not improve automatically with these levels, and storage is neither a separate facility nor a sensor-research project. The player maintains a persistent allocation policy for generated energy between:

- passive sensors,
- countermeasures,
- storage for manual scans.

Countermeasures reduce the quality of hostile scans and movement signatures. They do not make a nearby permanent station unconditionally invisible. The allocation continues without repeated manual input and must expose its Plutonium cost and expected energy flow before confirmation.

Storage at each Energy Core level must support several hours of ordinary generation and a healthy absence window. A larger store enables planned scan bursts and defensive reserves, while higher throughput supports sustained sensor and countermeasure allocation. Exact curves must preserve that distinction without creating pressure to spend energy at an exact minute merely to avoid a full store.

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

## Persistent fleets

A fleet is a persistent, owner-configured group of concrete ships rather than a temporary composition created only for one order. The owner may compose, split, combine, refill, or rebuild fleets while their ships are available at the home station. A fleet order always commits one complete fleet and may not select an arbitrary subset of its ships. A launched fleet keeps its identity through travel, combat, withdrawal, and return; surviving ships remain grouped when it arrives home. A fleet template is only an optional saved target composition for convenient creation or replenishment and never contains or controls actual ships.

Persistent configuration lets a player prepare several forces for different jobs and launch quickly during a command window. It also makes every fleet visible through alliance fleet release a real pre-bundled defense contribution rather than permission to assemble an arbitrary force from another player's reserve. Only the owner may change that composition.

Fleet partitioning is itself a tactical choice. A fleet travels at the pace of its slowest surviving ship. A player may therefore group ships by travel speed so slow ships depart first and faster ships remain available for a later reinforcement, or divide ships by count and composition to create ambiguous incoming signatures. Every launched fleet travels independently; it is not automatically merged with the owner's other fleets on the same route or at the same target. Several fleets may participate in the same engagement while retaining separate orders, contacts, withdrawal decisions, return cargo, and return journeys.

This deception uses real commitment rather than fabricated contacts. An incoming fleet's ship count and travel timing may fit several materially different compositions, such as one heavy ship escorted by many light ships or the reverse. Scanning the owner may reveal possible fleet compositions, but does not reveal which scanned fleet received which order. The opponent can reason from evidence without receiving a system-confirmed answer.

The initial model imposes no fixed limit on how many fleets a player may maintain or have active simultaneously. Every independently launched fleet pays the fixed Plutonium launch overhead as well as its route-dependent travel fuel, so additional partitioning remains possible but is not free. A hard limit should be introduced later only if playable validation shows that economic cost, truthful signatures, and interface grouping do not bound abusive fleet spam sufficiently.

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

At departure, the target receives an incoming-attack notification with the attacker, the exact number of ships in that fleet, and the earliest combat hour. Together with known geography, this exposes the fleet's travel timing but not its ship composition, private name, internal identity, or relationship to other contacts. Entering the order near the end of the command window does not create a movement or warning advantage: all confirmed orders in that window depart together. Offensive travel requires one additional operation round relative to defensive reinforcement under equivalent conditions. This preserves the historical commitment disadvantage of attacking and gives the notified defender a complete round in which to organize help.

## Regular ship catalog

The initial regular-ship catalog retains the twelve historical ship types and their established tactical identities. This is a product commitment to the roster, role relationships, firing behavior, and target-order baseline, not to every historical cost or numeric balance value. The command ship remains a separate player-developed unit rather than a thirteenth fixed regular ship type.

Hull class, technology tier, combat role, and firing phase are separate concepts. Fighter, corvette, frigate, and battleship are the four hull classes. EMP, first strike, and main fire describe firing phases or weapon behavior; they are not additional ship classes.

| Tier | Ship type  | Hull class | Firing behavior | Tactical identity                                                                  | Historical target-order baseline                                                                                |
| ---- | ---------- | ---------- | --------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1    | Piranha    | Fighter    | First strike    | Cheap early direct-fire ship against frigates and other small or medium targets    | Taifun, Hurricane, Blizzard, Hai, Hackboot, Piranha, Qualle, Tsunami, Enterprise, Kitty Hawk, Bermuda, Atlantis |
| 1    | Qualle     | Fighter    | EMP             | Cheap disruption concentrated on small targets                                     | Piranha, Hai, Hackboot, Taifun, Hurricane, Tsunami, Enterprise, Kitty Hawk, Atlantis                            |
| 2    | Hai        | Corvette   | Main fire       | Escort and anti-Hackboot specialist with useful frigate performance                | Hai, Hackboot, Taifun, Blizzard, Hurricane, Tsunami, Enterprise, Kitty Hawk, Bermuda, Atlantis, Piranha, Qualle |
| 2    | Hackboot   | Corvette   | No direct fire  | Economic raider that enables collector capture and depends on an escort            | Not applicable                                                                                                  |
| 3    | Taifun     | Frigate    | Main fire       | General-purpose multi-cannon ship that clears fighters and corvettes first         | Piranha, Qualle, Hai, Hackboot, Taifun, Blizzard, Hurricane, Tsunami, Enterprise, Kitty Hawk, Bermuda, Atlantis |
| 3    | Blizzard   | Frigate    | EMP             | Mid-scale disruption focused on frigates before smaller or heavy targets           | Taifun, Hurricane, Tsunami, Hai, Hackboot, Enterprise, Kitty Hawk, Piranha, Atlantis                            |
| 4    | Tsunami    | Frigate    | Main fire       | Few exceptionally strong cannons for destroying the largest ships                  | Atlantis, Kitty Hawk, Enterprise, Bermuda, Tsunami, Hurricane, Taifun, Blizzard, Hai, Hackboot, Piranha, Qualle |
| 4    | Hurricane  | Frigate    | First strike    | Longer-range counterpart to the Taifun with early pressure on escorts and frigates | Hai, Hackboot, Taifun, Hurricane, Blizzard, Tsunami, Piranha, Qualle, Enterprise, Kitty Hawk, Bermuda, Atlantis |
| 5    | Enterprise | Battleship | Main fire       | Heavy generalist with concentrated effectiveness against frigates                  | Hurricane, Taifun, Blizzard, Tsunami, Hai, Hackboot, Enterprise, Kitty Hawk, Bermuda, Atlantis, Piranha, Qualle |
| 5    | Bermuda    | Battleship | EMP             | Heavy disruption able to threaten the largest direct-fire ships                    | Atlantis, Kitty Hawk, Enterprise, Tsunami, Hurricane, Taifun, Hai, Hackboot, Piranha                            |
| 6    | Atlantis   | Battleship | Main fire       | Extremely durable mass-cannon platform for clearing swarms                         | Piranha, Qualle, Hai, Hackboot, Taifun, Blizzard, Hurricane, Tsunami, Enterprise, Kitty Hawk, Bermuda, Atlantis |
| 6    | Kitty Hawk | Battleship | First strike    | Heavy concentrated first-strike platform derived from the Enterprise role          | Enterprise, Tsunami, Hurricane, Taifun, Blizzard, Bermuda, Kitty Hawk, Hai, Hackboot, Atlantis, Piranha, Qualle |

The tier pairings deliberately present a conventional or first-strike combat option beside a specialized EMP, escort, or economic option. Aluminium and Steel cost mixes should preserve meaningful production tradeoffs, but all exact recipes, build times, travel rates, fuel rates, hull points, cannon counts, firepower, hit chances, and damage factors remain versioned balancing values.

The ordinary ship view should explain role, preferred targets, weaknesses, and firing phase without requiring the player to memorize a full matchup matrix. An expert view exposes every published target-specific hit chance, damage factor, and target order. Reports use those same versioned values and name every modifier that changed their effective result.

## Combat resolution

Combat resolution is deterministic. Its uncertainty exists before commitment through incomplete intelligence, concealed composition, future reinforcement and withdrawal decisions, and unknown opposing modifiers rather than random hit or damage rolls.

Every combat step resolves the same three firing phases in order: **EMP, first strike, then simultaneous main fire**. EMP disables eligible weapons for the remainder of that combat step without damaging hull points. A regular EMP ship does not target another regular EMP ship. First-strike losses reduce the force able to participate in main fire. Main-fire losses are calculated without granting an advantage from internal iteration or participant order.

Each direct-fire ship type combines its cannon count, firepower per cannon, published target-specific hit chance and damage factor, the target's hull points, visible modifiers, and fixed target order. One cannon cannot destroy more than one regular ship in one shot even when its damage exceeds the target's remaining hull points. The target order moves available fire to the next eligible ship type when an earlier target is absent or exhausted.

Partial deterministic effect must not disappear merely because one attacker group falls below an integer casualty threshold. Resolution retains sufficient fixed-point remainder within the engagement to make combined and repeated damage continuous and auditable. The exact fixed-point scale, allocation procedure, remainder behavior when a target type is exhausted, and report presentation remain implementation and balancing decisions.

Published ship data contains the final effective values. The remake does not reproduce the historical hidden heavy-ship hit-point and incoming-damage correction layer or encode a probability above one hundred percent so that later modifiers bring it back under the cap. A desired exception such as the Hai's unusually reliable tracking of the Hai and Hackboot ship types must instead appear as a named, visible rule with testable limits.

An engagement resolves in up to three hourly combat steps and may end earlier when its state no longer supports another step. Each step produces an immediate authoritative result. Surviving fleets remain committed by default. After the first or second step, each fleet owner may order a withdrawal during the following command window. At the next hourly boundary that fleet withdraws before the next combat step, keeps its already secured return cargo, and begins its journey home. Without such an order it remains in the engagement. The same rule applies to attacking fleets and allied defensive fleets; withdrawing defenders leave the station itself exposed. Fleets arriving at that boundary affect the next step only if the engagement still continues.

Defeating every current defender does not end the engagement automatically: while the attacker retains a fleet capable of continuing, they may remain for the unused steps and gain another station-access opportunity at each one. This can yield further collector theft and other enabled raid effects, but delays the return and exposes the attacker to later defensive reinforcement. If a combat step leaves no combat-capable attacking fleet, the engagement ends immediately after that result and its recovery returns begin. It also ends before a later step when every remaining attacker withdraws, and always ends after the third step.

Reports should distinguish:

- participants and roles,
- fleet composition,
- relevant command-ship or skill effects,
- attacks and losses,
- loot and salvage,
- experience and progression,
- which pre-battle assumptions proved false.

Exact numeric ship values, modifier curves, EMP resistance, and the final fixed-point damage-allocation formula remain balancing decisions within these rules.

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

## Return cargo and disabled fleets

Müll, captured collectors, and any stolen resources remain attached to the fleet as return cargo. They are not credited to the home station when a combat step resolves. After withdrawal or the final combat step, the surviving fleet carries that cargo home, and the assets become available only when the return arrives.

Remaining onboard fuel travels home with the fleet but remains separate from return cargo. Actual movement consumes it, so an early withdrawal may leave more aboard than the originally planned full journey would have. Only the amount physically remaining when the fleet reaches home returns to the owner's station fuel stock.

If every ordinary ship in a participating fleet is destroyed, that fleet still creates an empty recovery return carrying its already secured cargo. A command ship disabled in combat returns with that recovery state rather than being permanently lost or recreated at home. Only after arrival may it enter repair, and it remains unavailable until that repair completes. The exact repair cost and duration, and whether an empty recovery return can ever be intercepted, remain open.

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

Historically, only a fleet's owner could compose and release it. One settlement General could recall released fleets from active fleet orders, but had no further control. Settlement members could call an available released fleet only to defend their own station.

The remake should preserve this narrow delegation without requiring settlements. An operation may appoint one commander who can recall participating fleets whose owners granted that operation authority. Separately, an owner may enable alliance fleet release for all of their available fleets, allowing current alliance members to call one complete fleet at a time only for defense of the caller's own station. No delegate may change composition, launch an attack, or redirect a fleet beyond the granted defensive purpose.

All delegated actions must be visible to the owner and recorded. The final trust scope and conflict rules are still open.

## Unresolved balance goals

Exact salvage rates, attack-band formulas, safety-posture duration and penalty, raid rewards, experience distribution, and repeated-target limits remain open. They should be decided through simulations and playable tests rather than copied directly from historical values.
