# Core loop

Stand: 2026-07-24

## Primary loop

The modern Aquata loop is:

1. Read the situation.
2. Grow or allocate capability.
3. Acquire and share intelligence.
4. Choose a target and define an operation.
5. Coordinate support, defense, reserves, or deception.
6. Commit forces.
7. Follow the operation without constant attendance.
8. Receive a clear, memorable outcome.
9. Salvage, rebuild, learn, and adapt.

Every major system should strengthen at least one of these steps.

## Read the situation

Opening the game should immediately answer:

- What changed since the last visit?
- Is there a threat or opportunity?
- Which alliance operation needs a decision?
- What completed or returned?
- Which information is new, uncertain, or becoming stale?

The answer should be a command view made from a map, an event feed, active operations, and contextual communication. It should not require visiting several inventory pages.

## Grow or allocate capability

Growth creates the season's power curve, but repetitive collection is not the main play. The interesting decisions are:

- which capability to unlock next,
- whether to invest in economy, intelligence, mobility, defense, or military power,
- how much capacity to keep liquid for an unexpected opportunity,
- whether to specialize or remain flexible,
- how to distribute limited resources, production time, and command attention.

Routine production should be understandable and largely automatic after a decision has been made.

The relationship between the station, the shared collector pool, raw resources, energy, and parallel investment paths is defined in ECONOMY_AND_GROWTH.md.

## Acquire and share intelligence

Players use scans, observation, previous combat reports, map context, alliance knowledge, and opponent behavior to form a picture that is never perfectly certain.

Passive station sensors surface nearby contacts and movement opportunities without requiring constant manual map sweeps. A manual sector scan searches beyond that local picture, while a targeted deep scan turns a detected lead into focused intelligence about economy, fleets, command-ship and production state, or Movement Analysis. The later Observation Network spends energy to watch a known station, contact, or bounded area for future game-world events. Reconnaissance never exposes player or account activity, and never produces a foreign battle report. These actions draw on energy produced from Plutonium and stored through the player's persistent balance between sensors, countermeasures, and scan reserve.

Useful intelligence includes:

- resources and economic attractiveness,
- visible or estimated fleet strength,
- fleet composition,
- command-ship capabilities,
- nearby possible defenders,
- incoming and outgoing movements,
- confidence and age of each fact.

Sharing intelligence must be a first-class interaction, not manual copying into chat.

## Choose an operation

The central combat decision is choosing a target with the right balance of risk and reward:

- too strong risks a costly defeat,
- too weak produces little loot, salvage, or experience,
- distant targets create commitment and support risks,
- nearby allies may turn an apparent opportunity into a trap,
- several simultaneous targets may overload the opponent's defensive choices.

The interface should help the player reason about these factors without revealing perfect information or making the decision automatically.

## Commit forces

Players should be able to keep persistent fleets configured for recurring roles such as:

- main attack,
- fast decoy,
- interception,
- heavy defense,
- support,
- reserve,
- salvage or economic raid.

An optional fleet template records a desired composition for creating, refilling, or rebuilding one of these real fleets. Detailed composition remains available for expert play, but ordinary fleet use must not require editing every ship count before every launch.

Each fleet order commits one complete preconfigured fleet rather than an arbitrary selection from it. Committing a fleet should feel consequential. Recalling or changing an order may be possible, but with clear timing and costs.

## Fleet-operation cadence

Fleet operations use shared hourly rounds so launches, arrivals, and combat steps happen at round clock times that are easy to communicate. The hour before a planned launch is its command window. A fleet owner may prepare a draft earlier, but must personally review and confirm an offensive launch during that final window. Confirmed fleets launch together at the next round boundary; unconfirmed fleets remain home. The initial model does not automatically execute offensive launches scheduled several rounds in advance.

The target is notified when the attack actually launches and receives the attacker, exact ship count, and earliest possible combat hour, but exact composition and correlation with other fleet contacts still depend on intelligence and inference. An attack cannot resolve at its departure boundary. Under equivalent movement conditions, offensive travel takes one operation round longer than defensive reinforcement, preserving a complete response round without rewarding a command entered in the final minute of an hour.

Combat remains multi-step. An engagement may resolve at up to three successive hourly boundaries. Between steps, players can interpret the new report, reinforce, or withdraw according to the engagement rules. Remaining for another step can produce further station effects and collector theft, but also gives the defender's allies another opportunity to arrive.

## Resolve and learn

Reports should explain:

- what was known before commitment,
- what turned out to be wrong,
- who participated and in which role,
- why the result occurred,
- losses, salvage, loot, and progression,
- the next relevant opportunity or danger.

A report is both feedback and a social object that can be shared, discussed, and remembered.

## Session shape

Aquata should support:

- quick check-ins of roughly two to five minutes,
- optional longer planning and social sessions,
- asynchronous commitments that continue while the player is away,
- targeted notifications for genuinely important decisions,
- no default requirement to be online at an exact global tick boundary; a required offensive confirmation uses the full preceding command window.

An established target rhythm for an ordinary day is:

1. Check the situation briefly in the morning and react if necessary.
2. If the situation is calm, find a modest farming target and launch a daytime raid.
3. Check once around the middle of the day or shortly before arrival.
4. Use a fresh scan to judge incoming defense and decide whether to continue or recall.
5. Let the surviving fleet return.
6. In the evening, plan or join a larger alliance operation.
7. Launch so that the fleet can normally return by the next morning.

Large operations may create optional night-watch roles. Players with night shifts, different time zones, or different sleep rhythms can monitor new scans and changing defense. This should create a social advantage without requiring every participant to remain awake.

The game may still resolve rules in deterministic windows or ticks. The player experience must not be dominated by watching that clock, but additional well-timed attention may provide a bounded competitive edge.

## Onboarding slice

Before or alongside the first playable slice, a new player should learn why resource geography and distance matter and receive guidance toward a viable station position. An experienced player may skip this explanation and go directly to the complete placement view. The tutorial may simplify presentation, but it must not remove the player's eventual strategic choice or use weaker placement rules.

The first playable slice should teach the core loop with minimal scope:

1. Start with a small station, an initial collector pool, and one meaningful production choice.
2. Detect a neutral or controlled target through the station's coarse passive sensor baseline.
3. Bring a basic sensor array online, scan the contact, and learn that information has age and limits.
4. Choose between a safe raid and a riskier reward.
5. Compose a persistent fleet from the initial Piranha and Qualle roles through a simple guided interaction.
6. Commit the fleet with visible travel time and fuel, then receive a readable result.
7. Recover material and return cargo, inspect the surviving persistent fleet, and introduce templates as a convenience for future preparation.
8. Share or discuss the result in a contextual social surface without requiring the player to leave the command flow.

Sensor Array I and the first small batch of Piranha and Qualle should complete within one operation-round interval. The player can therefore confirm the first fleet during the first session, launch at the next hourly boundary, and receive both the result and returning fleet later the same day from a nearby controlled or neutral opportunity. The tutorial uses the normal authoritative construction, travel, fuel, and combat rules rather than a faster private ruleset.

The guided opening continues the same learning arc rather than ending after one battle. Ship engineering and suitable shipyard capability introduce Hai and Hackboot through a collector-capture operation. The command dock then introduces the early seasonal command-ship choice. A communications center connects the station operationally to its alliance, after which an incoming threat, scan, operation, defense call, and alliance fleet release teach coordinated defense. A solo player may receive a controlled training opportunity for this cooperation lesson, but it should not replace joining real players as the normal social path.

The onboarding should explain defeat and recovery through an organic result or controlled example rather than require every player to lose a valuable live fleet on script. Battle forecasting uses the player's actual known information and shows uncertainty instead of becoming an exact all-knowing calculator.

No tutorial checklist is an authoritative prerequisite. If a player builds, researches, scans, communicates, or fights before its explanation appears, the guidance recognizes that state and continues without repeating the action or paying an extra reward. Skipping all explanations changes presentation only.

This slice should be validated before implementing the full legacy catalog or broad meta systems.
