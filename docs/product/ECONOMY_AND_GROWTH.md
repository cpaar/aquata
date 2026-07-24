# Economy and growth

Stand: 2026-07-24

## Product purpose

Aquata's economy creates the contrast between a vulnerable opening and endgame-scale power. It should reward strategic allocation, position, risk, and timing rather than repetitive collection clicks or management of individual economic units.

The station provides a small reliable foundation from which a damaged player can act and rebuild. Competitive economic growth comes primarily from collectors. This keeps wealth visible, seasonal, and vulnerable without allowing one defeat to remove every source of agency.

## Opening budget posture

The initial station includes its collector pool, fighter-capable Shipyard I, Piranha and Qualle designs, one active research slot, and the weak passive sensor baseline. These included capabilities do not consume the player's discretionary starting stock.

The starting stock should make each individual bootstrap action affordable, including Sensor Array I, Communications Center I, and a small first fleet, but should not fund every bootstrap facility, substantial collector expansion, and a large fleet simultaneously. The player can complete the core loop immediately while still choosing whether personal military capability, information, cooperation, or economic growth receives the remaining opening resources.

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

Confirming a fleet order reserves that complete amount at the owner's station so it cannot be spent before the launch boundary. If the order is cancelled before launch, the reservation is released. At launch, the fixed overhead is consumed and the complete travel amount is transferred onto the fleet as onboard fuel. Movement consumes fuel from the fleet. An early recall shortens the traveled route, so after paying for its actual outward and return movement the fleet may arrive with fuel remaining; that exact remainder transfers back to the owner's station only on arrival.

The same rule applies to an allied defense call: the fleet owner supplies both the launch overhead and onboard fuel. Enabling alliance fleet release therefore grants alliance members bounded authority to commit the owner's Plutonium for a valid defense call. A fleet without sufficient owner fuel is not available for that call.

Exact construction recipes, the base Plutonium-to-energy conversion ratio, Energy Core throughput and storage values, launch overhead, travel-fuel rate calculation, rounding, in-flight rerouting or refueling, and treatment of onboard fuel when no ordinary ship returns remain open.

The same raw-resource stocks fund collectors, station growth, research, ships, and reserves. These paths should not receive unrelated private currencies that remove their opportunity costs.

## Collector pool and allocation

Collectors are one aggregate seasonal pool, not individually simulated units. A player may own ten, one thousand, or far more collectors without creating a separate entity, route, or order for each one.

The player distributes the pool by percentage across Aluminium, Steel, and Plutonium. For each raw resource, the player selects one resource node. Production for that resource derives from:

- the total collector pool,
- the assigned percentage,
- the selected node's published economic attributes,
- the distance between node and station,
- applicable progression modifiers.

Collector work proceeds automatically after the allocation and node choices are made. Different node distances and qualities make equal resource income require unequal collector shares, while changing strategic needs may justify an intentionally uneven output mix. Exact node attributes, distance curve, and the delay or cost for changing allocation remain open.

Resource nodes are visible economic geography rather than exclusive permanent holdings. Several players may use the same surrounding geography; station placement must not become a fastest-click claim on a unique indispensable node.

Collectors are not intercepted, escorted, attacked, or stolen along an individually simulated route or at a resource node. Their exposure is resolved only through attacks on their owning station.

## Collector construction and scaling

There is no hard collector cap. Collector counts must remain able to scale through a six-month season and through accelerated Havoc without encountering an arbitrary terminal capacity.

Instead, the marginal price of additional collectors rises smoothly with the player's authoritative total collector pool. The price calculation includes collectors already committed to construction, and a batch must cost the same as the equivalent sequence of smaller orders. Allocation percentages and collector origin do not create separate price curves or let the player bypass the shared scaling rule.

The published curve should remain simple enough to show the price of the next collector and any requested batch directly. The historical model is a useful structural reference: its marginal price rose linearly with the shared collector count, making cumulative investment quadratic and turning high-count reinvestment from exponential toward approximately linear growth. Its exact coefficients are not inherited automatically.

Losing collectors lowers the current pool and therefore the price of rebuilding. Captured collectors remain especially valuable because they increase the new owner's productive pool without first constructing those units. Abuse protection must not remove this recovery property merely to close arranged-transfer exploits.

Havoc uses the same unbounded economic rule under its accelerated rhythm rather than replacing it with a special collector ceiling. Numeric types and simulations must support counts far beyond a normal season without overflow or loss of determinism.

## Construction posture

Different construction projects may initially proceed in parallel as they did historically. Research is separate: a player may have exactly one active research project while maintaining a non-progressing queue of planned projects. Construction and the one active research project may proceed at the same time. Shared resources, committed costs, construction and research time, and the choice to retain liquid reserves provide the primary constraints.

A universal build-capacity system is not a confirmed core mechanic. Narrow capacity limits may be introduced only if playable validation shows that unrestricted parallel construction removes meaningful decisions. Resources committed to a project must move authoritatively into construction so parallel orders cannot duplicate value or spend the same stock twice.

## Station facility catalog

The initial station catalog is intentionally compact. Aquata should feel like a command center whose capabilities unfold, not a city builder with many narrowly named structures.

| Station facility          | Levels            | Physical responsibility                                                                                                                              | Intended seasonal availability                                                      |
| ------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Station core**          | No upgrade levels | Collector control, one active research slot and its planning queue, basic fleet administration, weak passive sensing, and the included Energy Core I | Included at station placement                                                       |
| **Shipyard**              | I–IV              | Production hardware for fighters, corvettes, frigates, and battleships respectively; individual designs still require ship engineering               | I included; II in opening; III from late opening into expansion; IV during conflict |
| **Sensor array**          | I–II              | Hardware for manual scans, researched sector and deep-scan methods, movement observation, and countermeasures                                        | I as bootstrap; II from late opening into expansion                                 |
| **Communications center** | I–II              | Operational alliance link and contextual intelligence sharing, then operations, defense calls, and alliance fleet release                            | Both in opening under their established cost targets                                |
| **Command dock**          | One level         | Command-ship selection, construction, module loadout, supported reconfiguration, and repair after combat disablement                                 | Early opening major goal                                                            |
| **Energy core**           | I–III             | Plutonium conversion throughput and stored-energy capacity; it does not unlock sensor methods or change the normal conversion ratio                  | I included; II from late opening into expansion; III during conflict                |

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

Under optimal conditions, each combat resolution step may steal at most fifteen percent of the collector pool remaining at that step. Three optimal steps can therefore steal no more than `1 - 0.85³`, approximately 38.6 percent of the starting pool, rather than forty-five percent. Actual theft may be lower under the published combat conditions.

Stolen collectors become captured economic value rather than being destroyed. A resolved theft removes them from the defender's active pool immediately and places them in the attacker's return cargo. They do not produce for either side during the return journey and join the attacker's aggregate collector pool only when that return reaches home, including when no combat ships survived and an empty recovery return is required. The exact combat requirements, capture capacity, repeated-attack protection, interaction with standings locks, and interaction with recovery rules remain open.

## Seasonal role

Collectors, resources, energy, infrastructure, research, and ships are competitive seasonal state and reset between seasons. Current collector ownership remains the basis of the individual and alliance economy awards. Because collectors form one common pool, the economy standing compares the total authoritative collector count rather than separate resource-specific collector types.
