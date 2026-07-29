# Economy and growth

Stand: 2026-07-29

## Product purpose

Aquata's economy creates the contrast between a vulnerable opening and endgame-scale power. It should reward strategic allocation, position, risk, and timing rather than repetitive collection clicks or management of individual economic units.

The station provides a small reliable foundation from which a damaged player can act and rebuild. Competitive economic growth comes primarily from collectors. This keeps wealth visible, seasonal, and vulnerable without allowing one defeat to remove every source of agency.

## Opening budget posture

Every player receives the same starting stocks of Aluminium, Steel, and Plutonium plus a small initial energy charge, independent of the chosen coordinate. The initial station includes its fixed collector pool, Station Core, Energy Core I, fighter-capable Shipyard I, Piranha and Qualle designs, one active research slot, and the weak passive sensor baseline. These included capabilities do not consume the player's discretionary starting stock. No ship, completed research project, or additional facility is granted for free.

Before waiting for production, the starting stock must fund one small operational Piranha-and-Qualle fleet plus exactly one major opening priority: a meaningful first collector batch, Sensor Array I, Communications Center I, or the start of any available tier-two research project. It must not fund the fleet plus two of those priorities. These are balance constraints rather than separate grants or reserved currencies: a player may omit the fleet and commit more of the same ordinary stock to infrastructure or growth instead.

The position-independent station baseline ensures that a weak opening choice delays rather than permanently traps the player. Exact starting amounts, initial collector count, first-fleet composition, collector-batch size, recipes, and durations remain simulation inputs. The accepted budget inequalities must hold for every balanced value set.

Opening cost targets use relative bands until exact recipes are balanced: bootstrap from starting stock, low at several hours of ordinary production, medium at approximately half to one day of production or one useful small return, and major at approximately one to three days of production or several returns. These values describe intended opportunity cost rather than a promise that all players generate identical hourly income.

## Resources and energy

Aquata has three collected raw resources:

- **Aluminium** primarily supports volume and expansion, including collectors, light ships, and foundational construction.
- **Steel** primarily supports durability and quality, including heavy ships, defenses, and advanced infrastructure.
- **Plutonium** is the strategic operating resource. Fleets use it as fuel, and the station converts it into energy.

Energy is stored operational capacity rather than a fourth collected raw resource. It powers passive sensors, countermeasures, and manual scans under the reconnaissance model. Plutonium therefore creates a deliberate tension between fleet activity and intelligence.

The station's **Energy Core I** is included in the initial station and provides basic Plutonium conversion and a small energy store. Energy Core II and III are the only ordinary station upgrades for this system. Each upgrade increases both maximum conversion throughput and maximum storage capacity; storage is not a separate station facility or research branch.

Energy Core levels do not automatically improve the base energy received per unit of Plutonium. Keeping the normal conversion ratio stable prevents one linear facility chain from multiplying throughput, storage, and efficiency at once. A named Economy command-ship capability or bounded module may later modify efficiency, but that exception must remain visible and must not redefine the universal Energy Core progression.

Each level's storage should hold several hours of its ordinary generation and support a healthy absence window instead of requiring exact-time spending whenever the store approaches its cap. It should still be finite enough that saving energy for a powerful scan or maintaining a countermeasure reserve is a real operational decision. Exact throughput, storage, and absence-window targets remain balancing work.

Every launched fleet consumes one fixed Plutonium launch overhead in addition to its variable travel fuel. There is no initial hard limit on the number of docked or simultaneously active fleets; repeatedly splitting the same force into independent orders instead repeats this real launch cost. The exact values and variable fuel formula remain open.

A fleet without a selected target should not advertise a misleading minimum, maximum, or average total. Its docked fleet view shows the exact launch overhead and the current fleet's exact travel fuel rate per published distance unit. After the player selects an order, target, and route, the commitment view shows the exact total fuel requirement, split into launch overhead and onboard fuel for the complete planned travel including the intended return.

Confirming a fleet order reserves that complete amount at the owner's station so it cannot be spent before the launch tick. If the order is cancelled before launch, the reservation is released. At launch, the fixed overhead is consumed and the complete travel amount is transferred onto the fleet as onboard fuel. Movement consumes fuel from the fleet. The planned complete return uses the same travel-tick count as the outbound leg. An early recall shortens the traveled route, so after paying for its actual outward and return movement the fleet may arrive with fuel remaining; that exact remainder transfers back to the owner's station only on arrival.

The same rule applies to an allied defense call: the fleet owner supplies both the launch overhead and onboard fuel. Enabling alliance fleet release therefore grants alliance members bounded authority to commit the owner's Plutonium for a valid defense call. A fleet without sufficient owner fuel is not available for that call.

Exact construction recipes, the base Plutonium-to-energy conversion ratio, Energy Core throughput and storage values, launch overhead, travel-fuel rate calculation, rounding, in-flight rerouting or refueling, and treatment of onboard fuel when no ordinary ship returns remain open.

The same raw-resource stocks fund collectors, station growth, research, ships, and reserves. These paths should not receive unrelated private currencies that remove their opportunity costs.

The first proper playable version has no voluntary resource or collector transfer between players. Ownership initially changes only through authoritative combat, return cargo, construction, or ordinary production. This keeps feeder-account rules and alliance subsidy flows outside the version while preserving cooperation through intelligence, operations, and defensive fleets.

## Collector pool and allocation

Collectors are one aggregate seasonal pool, not individually simulated units. A player may own ten, one thousand, or far more collectors without creating a separate entity, route, or order for each one.

The player distributes the pool by percentage across Aluminium, Steel, and Plutonium. Each raw resource has its own irregularly distributed resource-node type, and the player selects one node for each resource. Production for that resource derives from:

- the total collector pool,
- the assigned percentage,
- the selected node's published economic attributes,
- the distance between node and station,
- applicable progression modifiers.

Collector work proceeds automatically after the allocation and node choices are made. For each raw resource, production is the small position-independent station baseline plus the fixed-point product of total collectors, that resource's whole-number percentage, its published base yield, and a public monotonically decreasing distance factor. Zero percent is valid and stops only collector-derived output; the station baseline remains. Fractional effective collectors are preserved in fixed-point arithmetic rather than rounded into individual units or silently lost.

Different node distances make equal resource income require unequal collector shares, while changing strategic needs may justify an intentionally uneven output mix. The first node model needs no variable quality beyond resource type and position; additional node attributes may be added only after the placement and allocation game works. The exact base yields and distance curve remain balancing work.

The three percentages and three node selections form one coherent production plan. After founding, submitting a valid replacement plan leaves the previous plan fully authoritative until the next economy tick, when the complete new plan takes effect atomically. The interface shows the exact current and next-tick output side by side; no within-tick partial allocation or node change exists. The founding command applies its initial plan immediately so the new station does not begin in an undefined transition state.

Within each economy tick, the server first activates any valid pending production plan, then credits station-baseline and collector production from the collectors already eligible for that tick, and finally completes any collector due at that boundary and advances the collector stream automatically. A newly completed collector therefore joins the owned pool immediately but becomes production-eligible only on the following economy tick. A founded station activates at the shared season start and first produces after one complete interval; there is no partial-interval accrual or backdated production.

Resource nodes are stable, non-depleting, visible economic geography rather than exclusive permanent holdings. They are generated unevenly from the season seed, so viable combinations naturally attract different station densities. Several players may use the same nodes; station placement must not become a fastest-click claim on a unique indispensable node. WORLD_AND_DISCOVERY.md owns generation, placement, and world-content scope.

Collectors are not intercepted, escorted, attacked, or stolen along an individually simulated route or at a resource node. Their exposure is resolved only through attacks on their owning station.

## Collector construction and scaling

There is no hard collector cap. Collector counts must remain able to scale through a six-month season and through accelerated Havoc without encountering an arbitrary terminal capacity.

Instead, the marginal price of additional collectors rises smoothly with the player's authoritative total collector pool. The price calculation includes collectors already committed to construction, and a batch must cost the same as the equivalent sequence of smaller orders. Allocation percentages and collector origin do not create separate price curves or let the player bypass the shared scaling rule.

The published curve should remain simple enough to show the price of the next collector and any requested batch directly. The historical model is a useful structural reference: its marginal price rose linearly with the shared collector count, making cumulative investment quadratic and turning high-count reinvestment from exponential toward approximately linear growth. Its exact coefficients are not inherited automatically.

The Station Core owns one collector-specific serial construction stream. A player may order a batch, but it is authoritatively expanded into a sequence of individual collector completions at one published interval. Each completed collector joins the aggregate pool immediately and first contributes production on the following economy tick. The cost of every unit is quoted and committed from the projected total of owned plus already committed collectors when the order is confirmed, so a batch has the same cost and completion schedule as the equivalent queued single orders and splitting an order provides no advantage.

The stream advances automatically without exact-time attendance. A player may cancel queued collectors that have not started and receives their originally committed cost back in full; the collector currently in progress completes normally. This narrow queue is independent of facility construction, ship production, and research and does not imply a universal station build-capacity system.

Losing collectors lowers the current pool and therefore the price of rebuilding. Captured collectors remain especially valuable because they increase the new owner's productive pool without first constructing those units. Abuse protection must not remove this recovery property merely to close arranged-transfer exploits.

Havoc uses the same unbounded economic rule under its accelerated rhythm rather than replacing it with a special collector ceiling. Numeric types and simulations must support counts far beyond a normal season without overflow or loss of determinism.

## Construction posture

Different supported construction systems may initially proceed in parallel as they did historically. Collector construction alone uses its own serial stream. Research is separate: a player may have exactly one active research project while maintaining a non-progressing queue of planned projects. Construction and the one active research project may proceed at the same time. Shared resources, committed costs, construction and research time, and the choice to retain liquid reserves provide the primary constraints.

A universal build-capacity system is not a core mechanic in the first proper version. Resources committed to any project must move authoritatively into construction so parallel orders cannot duplicate value or spend the same stock twice.

## Station facility catalog

The initial station catalog is intentionally compact. Aquata should feel like a command center whose capabilities unfold, not a city builder with many narrowly named structures.

| Station facility          | Levels            | Physical responsibility                                                                                                                              | Intended seasonal availability                                                      |
| ------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Station core**          | No upgrade levels | Collector control, one active research slot and its planning queue, basic fleet administration, weak passive sensing, and the included Energy Core I | Included at station placement                                                       |
| **Shipyard**              | I–IV              | Production hardware for fighters, corvettes, frigates, and battleships respectively; individual designs still require ship engineering               | I included; II in opening; III from late opening into expansion; IV during conflict |
| **Sensor array**          | I–II              | Hardware for area search, the growing player scan, future player observation, and countermeasures                                                    | I as bootstrap; II from late opening into expansion                                 |
| **Communications center** | I–II              | Operational alliance link and contextual intelligence sharing, then operations, defense calls, and alliance fleet release                            | Both in opening under their established cost targets                                |
| **Command dock**          | One level         | Command-ship selection, construction, module loadout, supported reconfiguration, and repair after combat disablement                                 | Early opening major goal                                                            |
| **Energy core**           | I–III             | Plutonium conversion throughput and stored-energy capacity; it does not unlock sensor methods or change the normal conversion ratio                  | I included; II from late opening into expansion; III during conflict                |

### First proper playable-version facility scope

The first proper version includes Station Core, Shipyard I, and Energy Core I at founding. Shipyard II, Sensor Array I, Communications Center I and II, and the one-level Command Dock are buildable. Shipyard III and IV, Sensor Array II, Energy Core II and III, and every additional facility family are deferred.

This subset supports the complete accepted journey: four regular ship types, basic and area reconnaissance, operational alliance defense, and the first command-ship levels. The larger table remains the intended full-season facility catalog rather than an implementation requirement for the first test season.

The endgame does not add another mandatory facility family or level merely to mark its date. Its growth comes from late ship designs, command-ship development, modules, fleet scale, intelligence, operations, and politics.

Facility dependencies remain modular:

- There are no building slots and no central headquarters level that gates every other family.
- A facility normally requires only its previous level, resources, and construction time.
- Research and hardware combine only where their responsibilities genuinely differ, principally ship engineering with the Shipyard and sensor technology with the Sensor Array.
- The Communications Center, Command Dock, and Energy Core do not require matching research projects merely to duplicate their construction gate.
- An upgrade leaves the previous facility level operational until completion and does not cancel existing production, scans, communication, or other valid commitments.
- Normal attacks do not destroy station facilities in the initial model. Combat pressure acts through fleets, collectors, resources, intelligence, and recovery rather than removing foundational interface capabilities.

The initial catalog deliberately excludes separate research-lab levels, resource warehouses, collector factories, fleet-slot or fuel docks, an additional operations center, and a mandatory salvage facility. Those structures would respectively create universal research-speed chores, absence-punishing storage caps, doubly compounding collector growth, conflicts with the unlimited-fleet and soft-range rules, duplication of Communications Center II, or a gate in front of basic recovery. Static station turrets or shield facilities are also outside the initial model: defense should first be validated through fleets, allied response, intelligence, and countermeasures before introducing passive fortification and turtling pressure.

## Collector theft

Collector theft happens only during a resolved attack on the owning station. It reduces the defender's one total collector pool; the defender's allocation percentages and selected nodes remain unchanged.

Under optimal conditions, each combat tick may steal at most fifteen percent of the collector pool remaining at that tick. Exposure on exactly three optimal combat ticks can therefore steal no more than `1 - 0.85³`, approximately 38.6 percent of the starting pool, rather than forty-five percent. One attacking fleet cannot create more than those three ticks by itself. Overlapping or staggered fleets can keep combat active on additional ticks, so cumulative pressure from pre-launched waves is a mandatory repeated-target simulation case rather than silently inheriting the three-tick bound.

The percentage for one combat tick uses the forces physically committed to that tick. After departures, withdrawals, and arrivals have resolved but before combat, the game snapshots:

- the target player's current authoritative player-points value,
- the published deployment value of every defending fleet present whose owner is not the target player,
- the published deployment value of every attacking fleet present, including fleets without Hackboats and physically present command ships.

The target player's own fleets are not added as a separate defending term because their owned value is already represented in that player's player-points value regardless of location. A supporting player's unrelated ships, resources, collectors, or progression elsewhere in the world do not count; only their fleet actually present does. The **effective target value** is the target player's authoritative points plus the present deployment value of those outside defenders. The **attacking deployment value** is the value of all present attacking fleets. Before later modifiers and rounding, the tick's collector-theft percentage is `10% × effective target value / attacking deployment value`, capped at fifteen percent.

Combat then resolves from the same pre-combat snapshot. Every attacking fleet counted in the ratio remains counted for that combat tick even if some or all of its ships are destroyed during resolution; its losses affect only a later combat tick. After combat, each surviving and operational Hackboot can capture at most one collector. Actual capture is therefore the lower of the percentage limit and the attackers' combined eligible Hackboot count. If no combat-capable attacking force remains, there is no station access and no collector capture. Captured collectors are divided among participating attackers according to their eligible Hackboot contribution; exact remainder distribution must be deterministic.

The commitment view does not reveal or forecast collector-theft efficiency. Unknown reinforcement, additional attackers, withdrawals, and combat results make a precise promise misleading, and learning how to compose an efficient raid is intended player knowledge. The battle report instead exposes the authoritative target player points used at that tick, outside defensive deployment, total attacking deployment, resulting percentage, remaining collector pool, eligible Hackboot capacity, actual capture, and participant distribution for each combat tick.

Stolen collectors become captured economic value rather than being destroyed. A resolved theft removes them from the defender's active pool immediately and places them in the attacker's return cargo. They do not produce for either side during the return journey and join the attacker's aggregate collector pool only when that return reaches home, including when no ordinary combat ships survived and an empty recovery return is required. Repeated-attack protection, interaction with standings locks, and interaction with recovery rules remain open.

## Resource theft

Successful station access may also transfer stored Aluminium, Steel, and Plutonium. Each resource keeps a protected reserve so one engagement cannot remove the station's complete ability to act. The initial balance target for that reserve is approximately twenty-four ticks of the station's ordinary production of that resource; the exact production basis, treatment of temporary modifiers, and rounding remain balance work.

At each combat tick with successful station access, the attackers may secure twenty-five percent of that resource's **currently remaining surplus** above its protected reserve. The result is recalculated independently for each raw resource and each combat tick. With an unchanged reserve and no production, spending, or other stock movement between ticks, exposure on exactly three combat ticks can therefore transfer at most `1 - 0.75³`, approximately 57.8 percent of the surplus present before the first theft. The shrinking base is intentional: continuing pressure yields additional resources but progressively less while exposing the attackers to further reinforcement. Staggered fleets may create additional combat ticks and therefore belong in the same repeated-target simulations as collector theft.

Stolen resources enter return cargo under the same ownership and arrival rules as captured collectors. The required station-access condition, deterministic distribution among several attackers, and any later command-ship or module modifiers remain open; no modifier may turn the protected reserve itself into ordinary loot or apply a separate twenty-five-percent allowance per attacker.

## Seasonal role

Collectors, resources, energy, infrastructure, research, and ships are competitive seasonal state and reset between seasons. Current collector ownership remains the basis of the individual and alliance economy awards. Because collectors form one common pool, the economy standing compares the total authoritative collector count rather than separate resource-specific collector types.
