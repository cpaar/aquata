# Economy and growth

Stand: 2026-07-24

## Product purpose

Aquata's economy creates the contrast between a vulnerable opening and endgame-scale power. It should reward strategic allocation, position, risk, and timing rather than repetitive collection clicks or management of individual economic units.

The station provides a small reliable foundation from which a damaged player can act and rebuild. Competitive economic growth comes primarily from collectors. This keeps wealth visible, seasonal, and vulnerable without allowing one defeat to remove every source of agency.

## Resources and energy

Aquata has three collected raw resources:

- **Aluminium** primarily supports volume and expansion, including collectors, light ships, and foundational construction.
- **Steel** primarily supports durability and quality, including heavy ships, defenses, and advanced infrastructure.
- **Plutonium** is the strategic operating resource. Fleets use it as fuel, and the station converts it into energy.

Energy is stored operational capacity rather than a fourth collected raw resource. It powers passive sensors, countermeasures, and manual scans under the reconnaissance model. Plutonium therefore creates a deliberate tension between fleet activity and intelligence. Exact construction recipes, conversion efficiency, storage growth, and fleet-fuel calculations remain open.

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

Different construction and research projects may initially proceed in parallel as they did historically. Shared resources, committed costs, construction time, and the choice to retain liquid reserves provide the primary constraints.

A universal build-capacity system is not a confirmed core mechanic. Narrow capacity limits may be introduced only if playable validation shows that unrestricted parallel construction removes meaningful decisions. Resources committed to a project must move authoritatively into construction so parallel orders cannot duplicate value or spend the same stock twice.

## Collector theft

Collector theft happens only during a resolved attack on the owning station. It reduces the defender's one total collector pool; the defender's allocation percentages and selected nodes remain unchanged.

Under optimal conditions, each combat resolution step may steal at most fifteen percent of the collector pool remaining at that step. Three optimal steps can therefore steal no more than `1 - 0.85³`, approximately 38.6 percent of the starting pool, rather than forty-five percent. Actual theft may be lower under the published combat conditions.

Stolen collectors become captured economic value rather than being destroyed. The exact combat requirements, capture capacity, ownership transition during the return journey, repeated-attack protection, and interaction with recovery rules remain open.

## Seasonal role

Collectors, resources, energy, infrastructure, research, and ships are competitive seasonal state and reset between seasons. Current collector ownership remains the basis of the individual and alliance economy awards. Because collectors form one common pool, the economy standing compares the total authoritative collector count rather than separate resource-specific collector types.
