# Warfare, intelligence, and recovery

Stand: 2026-07-28

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
- precision and provenance,
- scope,
- ownership,
- sharing permissions,
- possible countermeasures.

Reconnaissance observes **game-world state and game-world activity**, never the person behind an account. A scan may reveal eligible state such as resources or fleets and externally detectable events such as a fleet launch, arrival, return, reinforcement, or passage through observed space. It never exposes login or logout times, online presence, session rhythm, chat behavior, device data, or any other account-level or real-person activity.

A scan never exposes or reconstructs the combat report of an engagement in which the scanning player did not participate. Battle reports are authoritative participant records. An eligible participant may deliberately share a report through its normal permission-bearing social object, but reconnaissance cannot create that access. A later scan may reveal the target's then-observable state, while valid Observation Network coverage may have recorded eligible movement events. Neither reveals the engagement's participants, combat ticks, shots, casualties, rewards, or report contents merely because combat occurred there.

Reconnaissance has three player-facing interactions rather than a catalog of unrelated report types:

- **search an area** to discover stations, movement contacts, and opportunities beyond the local picture,
- **scan a player** to build one progressively richer intelligence record about that player,
- **observe a player** later to keep supported future movement information under continuous coverage.

Fleet, economy, command-ship, production, and movement information are sections earned inside the one player scan as Sensor Technology advances. They are not separate Fleet, Factory, Command Ship, or News Scan buttons. Passive sensing remains the automatic local source beneath those deliberate interactions.

The historical game split reconnaissance across Base, Fleet, News, Factory, and Command Ship scans. The remake preserves their strategically useful questions—target resources and collectors, fleet strength and composition, movements from and to the target with useful travel timing, production, and command-ship danger—but collapses them into the interactions above. The historical News Scan's copy of a target's private recent news does not return.

The station begins with a deliberately weak passive sensor baseline that can surface a few coarse local leads. A **sensor array** provides the physical capability for player-directed reconnaissance; sensor research expands the methods and reach available through that hardware. Facility capability and research may both be required, but their levels do not mirror one another one-for-one.

Sensor Array I is a bootstrap facility that should complete within one tick interval. Its activation makes energy controls relevant and leaves the station with enough initial stored energy for one meaningful scan of a known target. This initial charge belongs to the one seasonal station state, cannot be reclaimed by replaying guidance, and uses the same scan rule as later stored energy. Further searches and scans depend on normal Plutonium conversion and energy management.

### Passive sensor field

Every station maintains a passive sensor field around its position. Research primarily expands its radius. Within that radius, the player automatically receives coarse contacts for nearby stations, launches and arrivals at detected stations, fleets crossing the field, ruins, anomalies, and other possible opportunities.

Passive contact data creates leads rather than complete answers. The initial fleet-movement baseline is a known origin when that station is already identified, direction, and a broad size class. It does not reveal the exact destination, ship composition, or fleet order. Previously observed geography may remain on the map while tactical contacts and activity become stale when they are no longer observed.

Continuous energy assigned to sensors improves observation quality or refresh behavior inside the researched field. It does not freely redefine the field's radius; this keeps the boundary understandable while research remains the main source of passive reach.

### Area search

An area search spends stored energy to investigate a selected part of the map at or beyond passive sensor reach. It may reveal previously unknown stations, movement contacts, ruins, resource opportunities, anomalies, and possible module-related missions. It makes distant discovery possible without restoring the historical ability to select every player from a fully exposed map or ranking. Finding a player creates a contact that can receive the ordinary player scan; it does not automatically reveal that player's tactical or economic state.

### Player scan

A known player can receive one manual player scan. The scan automatically returns every section supported by the scanner's current Sensor Technology rather than asking the player to choose among several report types. Its result remains a time-stamped source record with explicit exact values, estimates, unknown fields, provenance, and sharing permissions.

The report grows in a staged order:

- The opening baseline provides the target's identity and station plus coarse resource, collector, and total-force information suitable for an initial target decision.
- Sensor Technology II adds rudimentary command-ship intelligence: whether the target command ship exists, whether it is present, away, or disabled, its Fight, Support, or Economy archetype, and its exact level or a level band according to scan quality.
- Sensor Technology III adds the target's economy and fleet sections. Sufficient quality may reveal current raw-resource and collector values, the target's division of ships into persistent fleets, and increasingly precise ship-type counts. It also adds command-ship specialization, assigned fleet, basic combat mode where applicable, and a coarse capability profile.
- Movement Analysis, the fourth Sensor Technology project, adds currently observable movements from and to the target. Depending on quality, an entry may reveal the other participant, known origin and destination, elapsed and remaining travel time or time bands, expected arrival round, total fleet size, and a broad hull signature.
- Systems Intelligence, the fifth project, adds current production and the target command ship's exact combat-relevant statistics, modules, effects, and target priorities when the scan earns that precision.

The scan is authoritative only about what it actually observed at its acquisition time. A strong scan of player A may resolve A's own fleet partitions and command ship precisely. If it detects that player B is present at or approaching A, it provides only the earned external signature of B's force. Exact composition and command-ship detail for B require a scan of B, an authorized shared scan of B, or deliberate permission-bearing data from B as an ally. The same subject boundary applies to every foreign participant around A.

A player scan never exposes stable internal fleet identifiers, private fleet names, hidden orders, or an automatic mapping between a scanned fleet partition and a movement contact. Players may infer likely matches from ship counts, timing, speed, and several observations. A combined view may label such a match as probable, but never silently promote it to confirmed evidence.

Scan strength, distance, research, and the target's countermeasure allocation determine the precision earned for each available section. Unchanged inputs produce the same result tier rather than allowing retries until randomness yields a better report. Strong defense degrades exact values to published ranges or conceals fields; it does not fabricate exact numbers by default. More elaborate decoys and deliberate misinformation may be added later only if their evidence and counterplay remain understandable.

### Intelligence observations and views

A scan report remains the durable source object, while its individual facts become intelligence observations that can be reused in context. Every observation retains:

- the player, fleet, movement, station, or other subject it describes,
- its value, estimate, or explicitly unknown state,
- acquisition time and precision,
- original scanner and source type,
- sharing permissions,
- whether it was directly observed or derived from several sources.

The **player intelligence profile** assembles available observations about one player. The **operation intelligence view** assembles the observations relevant to one objective and planned tick, including personal scans, authorized alliance scans, movement observations, and exact allied fleet or command-ship data deliberately shared for that operation. Both views distinguish confirmed, observed, probable, and unknown information.

A credible battle estimate needs the best available information about every fleet expected to be present at the relevant combat tick and every participating command ship. The operation view therefore exposes missing participant scans and uncertain reinforcements instead of treating one precise target scan as a complete forecast. For a raid decision, the same view can emphasize resource, collector, production, and likely return-value observations without creating a separate scanning workflow.

Aggregation never upgrades evidence merely because several cards appear together. A newer coarse observation does not erase an older precise snapshot, and an older exact value remains exact only for its acquisition time. The interface shows precision, age, and provenance separately rather than collapsing them into an opaque percentage. Contradictory or stale sources remain inspectable behind the best current presentation.

### Observation network

The Observation Network is the sixth Sensor Technology project. It adds **observe player** to a known player's intelligence profile rather than another scan-report type. The player commits a time-limited observation and pays a visible continuous energy cost. Coverage begins when the observation is activated and is never retroactive.

While coverage is valid, it may record supported future launches, arrivals, returns, reinforcements, and other externally observable movement changes from or to that player. Detail still depends on sensor strength, distance, energy commitment, and countermeasures, and the same subject boundary continues to apply. Observing A does not grant the exact composition or command-ship build of B merely because B approaches A.

Energy exhaustion, countermeasures, expiration, or other coverage loss creates a visible observation gap rather than a false statement that nothing happened. Observation results feed the same player and operation views and may be shared only through the operational alliance link and explicit intelligence permissions. The network preserves the valuable historical practice of watching for launches and reinforcements while making the watched interval, cost, evidence, and uncertainty explicit.

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

Fleet partitioning is itself a tactical choice. A fleet's outbound travel quote follows the slowest ship committed at confirmation, and the same tick count is locked for its complete normal return leg. A player may therefore group ships by travel speed so slow ships depart first and faster ships remain available for a later reinforcement, or divide ships by count and composition to create ambiguous incoming signatures. Every launched fleet travels independently; it is not automatically merged with the owner's other fleets on the same route or at the same target. Several fleets may participate in the same engagement while retaining separate orders, contacts, withdrawal decisions, return cargo, and return journeys.

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

### Hourly ticks

Fleet launches, movement, arrivals, and combat resolution use shared hourly ticks. During the preceding command window, a fleet owner may confirm an offensive order for the next tick. Operations may hold plans, roles, intelligence, and prepared fleet drafts further in advance, but the initial model does not turn those drafts into automatic future attacks. The owner must make the final launch decision during the immediately preceding command window.

At departure, the target receives an incoming-attack notification with the attacker, the exact number of ships in that fleet, and the earliest combat tick. Together with known geography, this exposes the fleet's travel timing but not its ship composition, private name, internal identity, or relationship to other contacts. Entering the order near the end of the command window does not create a movement or warning advantage: all confirmed orders in that window depart together.

No attack can reach its first combat tick fewer than five ticks after launch, regardless of proximity or later drive technology. Equivalent defensive reinforcement takes one tick less and cannot fall below four ticks. A defender therefore has the complete first command window after the warning to launch reinforcement that can arrive for the same first combat tick. Greater distance and slower fleet composition may increase both values while preserving the attacker's one-tick commitment disadvantage.

For a fleet that reaches its target, the normal target-to-home return uses the same locked travel-tick count as its outbound home-to-target leg. Later research completion, combat losses, or a changed surviving composition do not shorten that committed return. An empty recovery return uses the same duration. A fleet recalled before reaching the target instead retraces the distance already traveled.

At every tick, valid docked-fleet departures confirmed during the preceding command window resolve before combat at that station. A warned player may therefore send fleets away at the last available tick and preserve them, but those fleets do not defend the station and the arriving attacker may still take resources or collectors. Defensive reinforcement arriving for that tick participates in its combat.

### Scheduled engagement windows and public attacks

Attacking arrivals against one station are grouped into target-side engagement windows spanning at most three consecutive combat ticks. The earliest unresolved attacking arrival establishes the first combat tick of a window; every attacking fleet scheduled to arrive at that station during that tick or either of the following two ticks belongs to the same engagement. An attacker arriving during the second or third tick joins the current state and can participate only in the combat ticks that remain. The fleet retains its own order, owner, withdrawal decision, cargo, and return journey. An arrival after the third combat tick belongs to a later engagement window.

Public-attack classification is evaluated only when an offensive fleet actually launches. That evaluation includes the newly launched fleet and every attacking fleet already traveling to the same station whose scheduled arrival belongs to the same engagement window. If the launch makes the grouped attack meet an applicable public-attack criterion, every fleet in that window becomes public together. Fleets are not periodically reclassified merely because target points, defensive participation, recovery state, or another world value changes while they travel. A later launch into their window creates a new evaluation and may therefore make the entire grouped attack public at that moment.

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

Every combat tick resolves the same three firing phases in order: **EMP, first strike, then simultaneous main fire**. EMP disables eligible weapons for the remainder of that combat tick without damaging hull points. A regular EMP ship does not target another regular EMP ship. First-strike losses reduce the force able to participate in main fire. Main-fire losses are calculated without granting an advantage from internal iteration or participant order.

Each direct-fire ship type combines its cannon count, firepower per cannon, published target-specific hit chance and damage factor, the target's hull points, visible modifiers, and fixed target order. One cannon cannot destroy more than one regular ship in one shot even when its damage exceeds the target's remaining hull points. The target order moves available fire to the next eligible ship type when an earlier target is absent or exhausted.

Partial deterministic effect must not disappear merely because one attacker group falls below an integer casualty threshold. Resolution retains sufficient fixed-point remainder within the engagement to make combined and repeated damage continuous and auditable. The exact fixed-point scale, allocation procedure, remainder behavior when a target type is exhausted, and report presentation remain implementation and balancing decisions.

Published ship data contains the final effective values. The remake does not reproduce the historical hidden heavy-ship hit-point and incoming-damage correction layer or encode a probability above one hundred percent so that later modifiers bring it back under the cap. A desired exception such as the Hai's unusually reliable tracking of the Hai and Hackboot ship types must instead appear as a named, visible rule with testable limits.

An engagement resolves in up to three combat ticks and may end earlier when its state no longer supports another one. Each combat tick produces an immediate authoritative result. Surviving fleets remain committed by default. After the first or second combat tick, each fleet owner may order a withdrawal during the following command window. At the next tick that fleet withdraws before the next combat tick, keeps its already secured return cargo, and begins its journey home. Without such an order it remains in the engagement. The same rule applies to attacking fleets and allied defensive fleets; withdrawing defenders leave the station itself exposed. Fleets arriving at that tick affect the next combat tick only if the engagement still continues.

Defeating every current defender does not end the engagement automatically: while the attacker retains a fleet capable of continuing, they may remain for the unused combat ticks and gain another station-access opportunity at each one. This can yield further collector theft and other enabled raid effects, but delays the return and exposes the attacker to later defensive reinforcement. An engagement ends early only when no combat-capable attacking fleet remains and no already-launched attacker is scheduled to arrive during one of its remaining combat ticks, or when every present and scheduled attacker has withdrawn or been recalled. It always ends after the third combat tick.

Collector-theft efficiency is resolved separately for each combat tick from the force state after that tick's departures, withdrawals, and arrivals but before combat. Its effective target value combines the target player's authoritative player points with the deployment value of every present defending fleet owned by another player. Its attacking value includes every present attacking fleet, even one without Hackboats; splitting escorts from raiders cannot remove real committed force from the ratio. Combat then determines whether a combat-capable attack remains and how many Hackboats are still operational. ECONOMY_AND_GROWTH.md owns the formula, capture cap, resource-surplus rule, and return ownership.

This efficiency is not shown or predicted before commitment. It is player knowledge learned through operation results under uncertain reinforcement and participation. Each combat-tick report must instead show every authoritative input and intermediate result: target player points used for that tick, outside defensive deployment, attacking deployment, ratio and cap, remaining collectors, operational Hackboats, protected resource reserve, remaining resource surplus, captured amounts, and participant distribution. A report may reveal exact post-commitment information that was not available in the pre-battle intelligence picture; it must not rewrite what the player knew before launch.

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

Salvage is governed by a strict conservation rule. Across all participants, the canonical resource value of Müll awarded by a combat tick and by the complete engagement must remain lower than the canonical replacement value permanently destroyed in that combat. Own-loss recovery, rewards for damage to enemies, command-ship effects, modules, and every other bonus are claims against this one bounded loss pool; they are not independent sources that may add up beyond it. Bonuses may improve a participant's share or move total recovery toward the published ceiling, but may never raise that ceiling or create resources.

Stolen resources and collectors are transfers from the defender rather than generated value. A disabled command ship that returns for repair is not a permanently destroyed replacement-value loss and therefore cannot produce full ship-value salvage in addition to returning home. Its economic loss comes from repair and unavailable time. Consequently, every resolved attack must leave at least one side economically worse off through permanent losses, transferred property, consumed fuel, or repair cost.

## Return cargo and disabled fleets

Müll, captured collectors, and any stolen resources remain attached to the fleet as return cargo. They are not credited to the home station when a combat tick resolves. After withdrawal or the final combat tick, the surviving fleet carries that cargo home, and the assets become available only when the return arrives.

All returned Müll follows one rule regardless of whether it arose from the participant's own destroyed ships or from enemy losses. On arrival it is recycled automatically into ordinary Aluminium and Steel and enters the player's normal resource balances. It can immediately fund any ordinary valid use, including ships, collectors, research, station construction, fuel-related spending, or transfers. There is no separate permanent Müll balance, manual collection action, processing queue, interest, decay, origin split, or mandatory recycling facility in the initial model.

For the five ticks following that arrival, the returned Aluminium and Steel amounts also form a temporary theft-protection allowance. This allowance is added to the station's ordinary protected reserve only when resource theft is resolved; the resources otherwise remain ordinary, count toward authoritative player points, and stay fully spendable. Spending or sending a resource consumes its temporarily protected portion first, and transferred resources do not carry protection to another station. Cancellation or refund preserves the original protection expiry rather than creating a new five-tick period. Separate returning batches retain their own expiry internally, while the interface presents the owner with the aggregate protected amount and its next relevant expiry.

When the five-tick allowance expires, no resources are removed or converted: any amount still present simply becomes part of the ordinary lootable stock. The allowance protects returned Müll from every engagement during its lifetime, including an attack launched before the return. Its duration matches the minimum offensive travel time, so an opponent reacting only after observing the return cannot reach the station before one complete warning window has passed.

Remaining onboard fuel travels home with the fleet but remains separate from return cargo. Actual movement consumes it, so an early withdrawal may leave more aboard than the originally planned full journey would have. Only the amount physically remaining when the fleet reaches home returns to the owner's station fuel stock.

If every ordinary ship in a participating fleet is destroyed, that fleet still creates an empty recovery return carrying its already secured cargo. A command ship disabled in combat returns with that recovery state rather than being permanently lost or recreated at home. Only after arrival may it enter repair, and it remains unavailable until that repair completes. The exact repair cost and duration, and whether an empty recovery return can ever be intercepted, remain open.

Müll remains the player-facing Aquata term for this recovered combat material. The interface must explain its return, automatic recycling, immediately usable resource value, and temporary theft protection without presenting it as another managed currency.

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

### Recovery flag

The recovery flag responds to severe PvP loss rather than to whether the player entered the engagement as attacker or defender. A player who suffers the same material recovery burden receives the same consideration in either role; winning, losing, attacking, or defending is not itself the trigger.

Qualification and duration use the player's **net recovery gap** after a combat tick. The calculation begins with the published replacement and repair burden created by destroyed ships, captured collectors, and a disabled command ship, then credits recovery value that is genuinely available or already secured: applicable ordinary reserves above the station's operational floor, all secured returning Müll, and reconstruction already paid for. Reliable production determines how long the uncovered remainder is expected to take. Large usable reserves can therefore shorten the flag or prevent it entirely because the loss has not removed the player's practical ability to rebuild.

Every credited input and the resulting estimated recovery time must be visible to the player. The exact qualifying threshold, duration curve, minimum and maximum duration, and effect of later losses remain balance decisions. Players must not be able to lengthen protection by temporarily hiding resources or changing an allocation immediately before evaluation. Secured Müll counts as recovery value while still returning and retains that treatment after its automatic conversion, regardless of its temporary theft-protection allowance.

Historically, weakened players could rebuild by farming smaller or inactive players. Inactive stations were especially valuable for new players learning their first successful attacks and for defeated players rebuilding with a small fleet.

The remake should preserve this ladder of understandable, lower-risk targets. Accounts should not disappear from the world immediately after becoming inactive.

After fourteen days of seasonal inactivity, the player and their alliance receive a warning. After twenty-eight total days, the player's seasonal state is deactivated and their progress is forfeited while the persistent account survives. The former station should then become a neutral abandoned station or ruin, detached from the player's control, so it can continue to support first attacks and recovery without treating an absent person as a permanent victim.

A returning player starts a fresh seasonal state from zero and does not reclaim the ruin in addition to receiving a new station. Exact ruin production, decay, loot, collector behavior, lifetime, target protection, and return placement remain open. The account lifecycle is defined in IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md.

## Attack boundaries

Attack boundaries are a core fairness mechanism. They protect small players from overwhelming powers and give recovering players a viable field of opponents.

They use the same authoritative current player-points total that underlies the seasonal points standing; Aquata does not maintain a separately optimizable conflict score. The deployment value used to limit a concrete fleet commitment is distinct and includes only the ships and command ship assigned to that commitment. Publicly delayed, banded, scanned, estimated, or falsified points never replace the authoritative total in rule evaluation.

The historical principle should remain, but the experience must become legible.

Before launching, the player should see:

- whether the target is eligible,
- which rule establishes eligibility,
- whether only part of the fleet may be used,
- how the permitted commitment or reward changes,
- when a temporary restriction expires,
- how recent losses, protection, or activity affect the boundary.

The system must avoid hidden formulas and unexplained rejection messages.

Collector-theft efficiency is deliberately not one of these pre-launch values. Attack eligibility and maximum permitted commitment are authoritative rules the player must be able to obey; economic raid efficiency depends on the forces that actually meet at each combat tick and is taught by the resulting battle report rather than supplied as an outcome forecast.

Attack boundaries should prevent predation by vastly stronger players without removing target judgment, bluffing, or the possibility of taking a calculated risk.

## Sleep, alliance coverage, and absence

Aquata has no global night and no routine nightly safety posture in the initial model. A world with players on different schedules should remain active around the clock, and players who work nights, sleep early, or stay awake later should provide real value to their alliance rather than find that every useful target has disappeared into protection.

Healthy sleep instead relies on several layers:

- every attack has at least five ticks of approach before its first combat tick,
- equivalent defensive reinforcement can arrive in at least four ticks after using the first response window,
- alliance members with complementary schedules may scan, organize help, call released defense fleets, or use granted operation recall authority,
- a player who reacts late may send docked fleets away before combat while leaving the station economically exposed,
- attack boundaries, per-engagement theft limits, repeated-target rules, and recovery prevent one unattended period from normally ending a season.

The design does not promise that sleep prevents loss. An attack launched after a player's alliance coverage ends may leave only enough morning response time to preserve fleets while accepting stolen resources or collectors. The promise is that constant personal watch is unnecessary and that one such loss remains recoverable.

Turning station power down to reduce scan quality is reserved as a possible later counterintelligence posture. It would need to disable meaningful capabilities of the same station and remain useful at any time rather than becoming a nightly protection button. A bunker that makes fleets and collectors unavailable while leaving only baseline production is also deferred: it may empty the world of targets or become mandatory fleet preservation and should be reconsidered only if the initial timing and recovery rules prove insufficient.

Alliance night watches are part of the intended social strategy.

Historically, only a fleet's owner could compose and release it. One settlement General could recall released fleets from active fleet orders, but had no further control. Settlement members could call an available released fleet only to defend their own station.

The remake should preserve this narrow delegation without requiring settlements. An operation may appoint one commander who can recall participating fleets whose owners granted that operation authority. Separately, an owner may enable alliance fleet release for all of their available fleets, allowing current alliance members to call one complete fleet at a time only for defense of the caller's own station. No delegate may change composition, launch an attack, or redirect a fleet beyond the granted defensive purpose.

All delegated actions must be visible to the owner and recorded. The final trust scope and conflict rules are still open.

## Unresolved balance goals

Exact salvage rates, attack-band formulas, raid rewards, experience distribution, and repeated-target limits remain open. They should be decided through simulations and playable tests rather than copied directly from historical values.
