# World, placement, and discovery

Stand: 2026-07-29

## Product purpose

Aquata's world is not a backdrop or a list of stations. It is a seasonal strategic system whose generated geography shapes economic choices, player density, travel relationships, reconnaissance, conflict, and future content.

The first playable world must remain deliberately small in system count. It needs a strong generative foundation and a few complete interactions, not a broad catalog of empty point-of-interest types. Later seasons may add much more world content without replacing the foundation defined here.

## Generated world foundation

Each season uses one bounded rectangular two-dimensional coordinate space with integer coordinates and Euclidean distance. The world does not wrap and contains no sectors, regions, or hidden travel boundaries. Its resource nodes are generated from a reproducible season seed with controlled randomness. Distribution is intentionally uneven rather than a uniform grid: dense groups, gaps, favorable combinations, and awkward tradeoffs are all part of the geography.

The generator must produce enough economically viable placement areas for the intended population, but it must not make every area equally strong or interchangeable. Uneven geography should naturally create regions with many stations and quieter regions with fewer stations. These are emergent neighborhoods, not named sectors, settlements, teams, travel boundaries, or special rule zones.

The first implementation chooses the generated world's footprint from a versioned configuration based on the expected founding cohort plus reserved capacity. The season persists both its seed and generator version so its geography can be reproduced exactly. Each raw-resource distribution is clustered independently, and generation rejects worlds that fail published hard viability constraints; it does not create private three-node bundles or equal starting positions. Exact footprint, density, reserve, and viability thresholds remain simulation work. Seamless live expansion, an adaptive ecology director, and continuously reshaped geography are outside the first proper version.

## Resource nodes

Aluminium, Steel, and Plutonium each have their own resource nodes. For every raw resource, a station assigns part of its aggregate collector pool to one selected node. Production depends on collector allocation, the node, distance from station to node, and applicable progression modifiers as defined in ECONOMY_AND_GROWTH.md.

Resource nodes are the indispensable first world feature. In the initial model they are:

- irregularly generated from the season seed,
- visible during station placement and ordinary economic planning,
- shared by any number of stations rather than claimed or owned,
- stable and non-depleting for the season,
- differentiated first by resource type and position rather than by a large catalog of special traits.

Distance already creates meaningful differences between nodes. Variable quality, temporary yield, exhaustion, regeneration, hazards, ownership, processing chains, and seasonal node effects are possible later expansions, not requirements for the first complete version.

The generator must create enough combinations from which players can find workable access to all three resources. It may still produce clearly better, worse, specialized, crowded, and isolated positions. The placement experience explains these consequences instead of silently preventing every weak choice.

## Station placement

The player chooses one final station coordinate after inspecting the generated resource geography. That choice should answer a real strategic question: which resource access, local density, travel relationships, likely support, and future targets are worth the tradeoff?

Stations require a published minimum distance from one another. The distance prevents overlapping coordinates and extreme stacking but remains deliberately small enough for dense neighborhoods to form. It does not create a large private territory around every station.

Joining the season creates the seasonal player before it creates a station. Browsing the founding map reserves nothing. Selecting a concrete valid coordinate creates at most one short-lived coordinate reservation for that player while confirmation is prepared; replacing the selection releases the prior reservation. Nodes are never reserved, claimed, or made unavailable because another player used them.

Final confirmation commits the coordinate, one selected node for each raw resource, initial collector percentages, and the exact first production preview as one atomic founding command. A successful command creates the station and its included starting state exactly once. An expired or invalid reservation creates no partial station, economy, or resource commitment. The coordinate is final for the first proper test season; relocation is deferred from that version.

New players receive a guided placement view that compares several viable positions and makes access to all three resources understandable. Experienced players may open the full placement map immediately. Both use the same world, placement validity, minimum distance, economic rules, and competitive possibilities.

During founding, that map exposes the complete resource-node geography, coarse founded-station density, one merged invalid-position mask, and voluntary friend or alliance planning markers. It does not identify foreign stations, names, alliances, exact economies, fleets, neutral targets, or other tactical state. The invalid mask may reveal approximate occupied geometry as an unavoidable consequence of placement validity, but it is not an identified station directory; ordinary sensors and scans remain necessary to learn actual contacts.

Friends may coordinate intended coordinates with shared markers or links in the first complete version. A dedicated group-reservation or automatic alliance-placement system is an optional convenience after ordinary placement has proven that it needs one; it is not part of the initial world foundation.

Rare station relocation remains an expensive correction rather than normal map movement or optimization. It uses the same placement validity and resource relationships at the destination and cannot be used to escape an active threat.

## World sites and targets

A **world site** is a generated map location with a concrete interaction. Resource nodes are economic geography rather than targets. Player stations and world sites form the target ecology discovered through sensors and reconnaissance.

The initial architecture should allow additional world-site types, but a type is generated into the player-facing world only when it has a complete purpose, discovery rule, interaction, outcome, and lifecycle. Empty markers and speculative generic systems would increase scope without making the game richer.

### First playable world slice

The earliest world slice needs only:

1. the three resource-node types and meaningful station placement,
2. player stations with the minimum separation rule,
3. one neutral-facility interaction that can support the first scan, fleet order, combat, return, and recovery loop.

The controlled first target may be reserved for onboarding, but it uses the normal scan, travel, fuel, combat, theft, cargo, and return rules. No separate tutorial world is required.

### First proper playable version

The first proper multiplayer version keeps this foundation and exposes exactly two neutral-facility strength bands:

- an accessible Piranha-and-Qualle target for the first complete operation,
- a stronger Hai-and-Hackboot target for escorted economic raiding and recovery play.

Both are shared rather than private, contain finite resources or collectors, and use a simple world target budget that replaces consumed opportunities. Players discover nearby facilities through passive sensing and more distant ones through area search. Player stations provide the PvP side of the same target ecology.

Ruins, modules, abandoned stations, anomalies, hazards, variable node quality, station relocation, and dynamic world expansion are not generated or exposed in this version. FIRST_PROPER_VERSION.md owns the complete cross-system version boundary.

### First complete seasonal version

The first version intended to sustain a real season adds a deliberately small shared site catalog:

- **Neutral facilities** provide several published strength bands and finite resources or collectors. They are normal combat targets for opening raids, modest farming, and recovery after defeat. Several configurations may reuse the same rules instead of requiring bespoke behavior for every visual variant.
- **Ruins** provide one simple non-PvP discovery and expedition loop. Their initial rewards may include bounded salvage and, once the initial module system exists, a module opportunity. They do not require branching stories, puzzles, crew management, or a large exploration subsystem.
- **Abandoned stations** reuse the neutral-facility or ruin model when the confirmed inactivity lifecycle is implemented. They preserve a target and recovery ladder without leaving an absent player under permanent attack.

Neutral facilities and ruins are shared world objects rather than private per-player reward instances. Discovering one does not normally reserve it. Exact target locks, concurrent arrival treatment, depletion, replenishment, and protection against repeated farming remain rules to validate with the fleet and combat model.

A simple population- and season-stage-aware target budget is sufficient initially: the world should maintain enough appropriate neutral opportunities without guaranteeing one private target per player. It does not need to predict individual needs, dynamically scale one target to its attacker, or continuously optimize local engagement.

## Discovery relationship

Resource geography is visible enough to support founding and economic decisions. Tactical targets are discovered through the reconnaissance model:

- the station's passive sensor field surfaces a manageable number of local contacts and opportunities,
- an area search investigates a selected region beyond that ordinary local picture,
- a player scan provides richer information about a known player rather than revealing every subject found in an area.

Discovery returns leads and evidence, not a live global target directory. Repeating the same search over unchanged world state must not become a slot-machine reroll or a requirement to sweep every map cell. Previously discovered geography may remain visible while target state and tactical information become stale.

## Seasonal role

- During the **Opening**, resource access, station placement, nearby neutral facilities, and the first local player contacts dominate.
- During **Expansion**, broader sensor and drive capability reveal more of the same connected world; ruins and more difficult neutral facilities broaden target choice without displacing player interaction.
- During **Conflict**, player stations and coordinated operations become the primary strategic targets. Neutral facilities and ruins remain useful for modest farming and recovery.
- During the **Endgame**, the initial world systems continue to support travel, intelligence, and conflict. Special global objectives or map-changing events may create distant focal points in a later content expansion, but they are not required to validate the core game.

Local targets should remain the ordinary choice because they require less fuel and commitment time, are supported by fresher intelligence, and sit within plausible reinforcement relationships. Distant operations remain meaningful for scarce opportunities, alliance strategy, politics, or surprise; distance does not need a universal reward multiplier or a special cross-region rule.

## Expansion space

The world foundation deliberately leaves room for later additions such as:

- anomalies and authored investigation chains,
- moving convoys or neutral fleets,
- temporary or unstable resource opportunities,
- richer ruin and module-mission variants,
- environmental hazards, currents, and regional modifiers,
- contested alliance or coalition objectives,
- stage-specific and endgame world events,
- live frontier expansion and more adaptive target renewal,
- territorial influence that does not turn resource nodes into permanent exclusive holdings.

None of these belongs in the first playable world slice merely because the map can eventually support it. An expansion should add a new strategic decision and complete play loop, not only another icon or reward table.
