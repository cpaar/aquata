# Product experience

Stand: 2026-07-28

## Experience thesis

Aquata should feel like an underwater command center, not a responsive database administration tool.

The primary surfaces are situation, map, operations, and communication. Economy, research, fleets, and reports appear in context around decisions.

## Command view

The first view after login should prioritize:

- meaningful changes since the last visit,
- incoming threats and expiring decisions,
- active alliance operations,
- recent intelligence,
- completed builds, research, arrivals, and battles,
- the Macbox and relevant conversations,
- a clear next useful action.

Raw totals remain accessible, but they are not the primary hierarchy.

## Progressive disclosure

The interface should unfold with the player's seasonal capabilities. It initially emphasizes station placement, collectors, the local sensor picture, and the next useful production decision instead of presenting the complete research, ship, intelligence, command-ship, ranking, and alliance catalog at once.

Every newly relevant capability receives one contextual introduction and an immediate real use. The interface may introduce fleet templates after the first fleet returns, the research queue when a second project can be planned, energy allocation when sensors or countermeasures first consume energy, battle forecasting after the first report, and operation tools when the station gains an operational alliance link. These are presentation milestones rather than arbitrary power gates.

Locked capabilities should be discoverable from context with a concise reason and prerequisite, not dominate the command view as a wall of disabled controls. The player should normally understand the next one or two possibilities without needing to study the whole season tree.

An experienced player may disable explanations and use a denser view, but cannot skip seasonal prerequisites, costs, construction, research, or timing. Conversely, accepting guidance must never assign weaker rules, an inferior station position, lost achievement progress, or reduced competitive possibilities.

During the first session, the guided view introduces placement, collector allocation, the local passive lead, one of three foundational research choices, Sensor Array I, and the first small Piranha-and-Qualle fleet in sequence rather than as one dense dashboard. The expert view may expose every currently actionable option immediately. Both presentations read and mutate the same seasonal state, and guidance credits qualifying actions completed before their explanation.

Critical control and transparency are never withheld for tutorial pacing. Exact commitments, withdrawal, incoming threats, readable outcomes, recovery actions, safety controls, and available social communication appear whenever their underlying situation exists.

## Map

The map is a strategic workspace, not decoration. It should reveal:

- the player's station and operational reach,
- known players and relevant targets,
- geography and travel bands,
- allied and hostile relationships,
- known or suspected movements,
- shared intelligence,
- active operations and areas of attention.

The map must communicate uncertainty. A stale scan should not look like live truth.

Aquata uses one continuous two-dimensional world rather than hard-divided oceans and settlements. WORLD_AND_DISCOVERY.md defines its generated geography, station placement, world sites, and bounded initial content scope.

A player's final station coordinate is a deliberate strategic choice with consequences for the whole season. The placement surface must make the irregular distribution of Aluminium, Steel, and Plutonium nodes legible, compare expected resource access, show invalid positions created by the small published station-separation distance, and support plans made with friends without presenting one system-selected best coordinate.

The placement experience must preserve that agency without asking a first-time player to understand the entire strategic map before learning the game. New players should receive a guided, viable path toward their final position, while experienced players may skip the tutorial and use the full strategic placement view immediately. Both paths must ultimately use the same placement rules and offer the same competitive possibilities; onboarding guidance must not assign newcomers an inferior permanent position merely because they accepted help.

Anchoring a station makes its position consequential, but it does not trap a player in a bad early decision for the entire season. A station may be relocated under restrictive conditions as a rare and expensive correction. The player keeps the station's general progress, leaves the former resource relationships behind, and uses resource nodes around the new position. Relocation is not ordinary travel, a routine optimization tool, or a way to escape an active threat. Historically, a move cost roughly the station's resource production over forty-eight hours; this is a useful balance reference rather than a confirmed remake value.

Most routine activity should still be local because shorter commitments, nearby support, and fresher knowledge make neighboring targets attractive. Distance must matter without recreating the historical feeling that another ocean is effectively a separate world. Distant targets remain reachable for deliberate raids, alliance operations, or unusual opportunities; crossing an invisible boundary never adds a special penalty.

The map separates visible economic geography from the uncertain tactical picture. Resource nodes and the basic geography needed for strategic station placement are visible enough to compare locations. Foreign stations, world sites, fleets, movements, and game-world activity are not automatically exposed by that geographic layer.

A player initially detects tactical contacts only within the passive sensor field around their station and sees few coarse facts about them. Research primarily expands this field. Persistent energy allocation improves passive observation or strengthens countermeasures, while stored energy powers manual scans.

The map supports a clear intelligence ladder: passive contacts create local leads, an area search investigates a selected region for distant players or opportunities, and the one player scan produces progressively richer time-stamped intelligence about a known player as Sensor Technology advances. A passive fleet contact begins with no more than a known origin where available, direction, and broad size class. Stronger movement intelligence may identify who is moving from or to the scanned player, endpoints, travel timing, total size, and a broad signature, but exact foreign composition still requires intelligence about that force's owner. Alliance discoveries and shared scans can extend the known operational picture beyond a player's personal reach.

Selecting a known player opens a player intelligence profile rather than a chronological pile of scan reports. It presents the best available economic, fleet, command-ship, production, and movement observations while keeping their exact acquisition time, precision, source, and permissions inspectable. Exact old information must not look current, and several matching estimates must not look authoritative merely because they agree.

An operation intelligence view assembles the sources relevant to one objective and planned tick. It should answer which forces are confirmed, which movements are directly observed, which fleet or command-ship matches are only probable, and where information remains unknown. Personal scans, authorized shared scans, future observation, and exact allied data appear together without losing their provenance. The operation view helps players reason about a battle; it does not silently decide the outcome or invent certainty.

Exploration must create target-finding decisions without becoming manual grid sweeping. The command view and map should surface a manageable set of leads such as nearby contacts, game-world activity signals, resource-rich areas, neutral opportunities, and intelligence shared by allies. Such signals describe observed in-world events, never login recency or online presence. Rankings may provide strategic context and prestige, but must not replace reconnaissance with an exact, live target directory.

## Fleet interaction

Ordinary fleet actions should be fast and legible on touch devices.

Prefer:

- persistent preconfigured fleets,
- templates for convenient creation, refill, and rebuilding,
- operational roles,
- sensible default quantities,
- proportional controls,
- clear reserve impact,
- exact launch overhead and travel fuel rate before a target is selected,
- exact total fuel split into launch overhead and onboard fuel once the fleet order, target, and planned return are known,
- comparison with available intelligence,
- a final commitment summary.

Keep detailed per-ship composition for expert control, but do not make a long list of numeric inputs the default interaction.

## Mobile and desktop

Mobile is the primary everyday surface:

- quick situation checks,
- communication,
- accepting or modifying an operation role,
- scanning,
- launching a prepared fleet,
- reacting to a meaningful threat.

Desktop supports the same game with more room for:

- map analysis,
- complex operation planning,
- comparison of reports and scans,
- detailed fleet composition,
- long social discussions.

The two clients must share the same account and strategic state. Desktop may be denser, but mobile must not be a reduced companion.

## Platform direction

Start with a high-quality responsive web application that can become an installable PWA. Native packaging is a later distribution decision, not a prerequisite for validating the game.

The product should be designed so notifications can eventually report events such as:

- a relevant incoming operation,
- a requested alliance decision,
- the opening of the final confirmation window for a planned offensive launch,
- completion of a meaningful order,
- arrival or resolution of a committed fleet.

Notifications must be configurable and sparse. They should protect the player's attention rather than manufacture urgency.

## Activity and timing

Timing remains strategically important, but the interface should support planning instead of clock watching.

Fleet operations use hourly ticks that are easy to communicate. The interface should distinguish a non-binding plan or prepared fleet from a launch confirmed for the next tick. Offensive confirmation remains a deliberate owner action during the immediately preceding command window; the player should not have to return at the final minute of that hour.

Desired tools may include:

- operation drafts and proposed fleet orders,
- explicit hourly command and response windows,
- fleet templates,
- night-watch and delegated alliance roles,
- summaries of what will happen while away.

The final model must preserve anticipation and counterplay. Normal play must work with healthy sleep through five-tick minimum attack approaches, complementary alliance coverage, bounded losses, and recovery rather than a universal nightly safety posture. Additional attention and organized coverage may provide a bounded advantage for top competition.

## Visual identity

The visual language should reinforce:

- depth, pressure, sonar, darkness, and limited visibility,
- movement through an underwater world,
- the scale difference between a fragile opening and a massive endgame,
- the command ship as personal identity,
- reports as memorable events rather than text dumps.

Aquata should be recognizable without recreating the historical interface.

## Current implementation

The existing React views are a functional prototype for API and rule flows. Their dashboard, page navigation, long build catalog, per-ship fleet form, and manual development tick are not the intended product information architecture.

Future UI work should validate the command-view and operation loop before polishing the current page structure.
