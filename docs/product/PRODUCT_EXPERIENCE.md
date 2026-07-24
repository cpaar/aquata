# Product experience

Stand: 2026-07-22

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

Aquata uses one continuous two-dimensional world rather than hard-divided oceans and settlements. Players occupy coordinates in the same connected space. Unevenly distributed resource nodes and other valuable geography create organic clusters of stations, so a neighborhood emerges through player placement and economic interest instead of being assigned as a formal social unit.

A player's final station coordinate is a deliberate strategic choice with consequences for the whole season. Resource access, travel relationships, likely neighbors, support range, and plans made with friends or a future alliance may all influence the decision. Coordinated placement is legitimate social strategy rather than an exceptional exploit.

The placement experience must preserve that agency without asking a first-time player to understand the entire strategic map before learning the game. New players should receive a guided, viable path toward their final position, while experienced players may skip the tutorial and use the full strategic placement view immediately. Both paths must ultimately use the same placement rules and offer the same competitive possibilities; onboarding guidance must not assign newcomers an inferior permanent position merely because they accepted help.

Anchoring a station makes its position consequential, but it does not trap a player in a bad early decision for the entire season. A station may be relocated under restrictive conditions as a rare and expensive correction. The player keeps the station's general progress, leaves the former resource relationships behind, and uses resource nodes around the new position. Relocation is not ordinary travel, a routine optimization tool, or a way to escape an active threat. Historically, a move cost roughly the station's resource production over forty-eight hours; this is a useful balance reference rather than a confirmed remake value.

Most routine activity should still be local because shorter commitments, nearby support, and fresher knowledge make neighboring targets attractive. Distance must matter without recreating the historical feeling that another ocean is effectively a separate world. Distant targets remain reachable for deliberate raids, alliance operations, or unusual opportunities; crossing an invisible boundary never adds a special penalty.

The map separates visible economic geography from the uncertain tactical picture. Resource nodes and the basic geography needed for strategic station placement are visible enough to compare locations. Foreign stations, fleets, movements, and activity are not automatically exposed by that geographic layer.

A player initially detects tactical contacts only within the passive sensor field around their station and sees few coarse facts about them. Research primarily expands this field. Persistent energy allocation improves passive observation or strengthens countermeasures, while stored energy powers manual scans.

The map supports a clear intelligence ladder: passive contacts create local leads, a sector scan searches a selected area for distant contacts or opportunities, and a targeted deep scan produces more precise, time-stamped intelligence about a detected contact. A passive fleet contact begins with no more than a known origin where available, direction, and broad size class. Exact destination and composition require stronger information. Alliance discoveries and shared scans can extend the known operational picture beyond a player's personal reach.

Exploration must create target-finding decisions without becoming manual grid sweeping. The command view and map should surface a manageable set of leads such as nearby contacts, activity signals, resource-rich areas, neutral opportunities, and intelligence shared by allies. Rankings may provide strategic context and prestige, but must not replace reconnaissance with an exact, live target directory.

## Fleet interaction

Ordinary fleet actions should be fast and legible on touch devices.

Prefer:

- fleet templates,
- operational roles,
- sensible default quantities,
- proportional controls,
- clear reserve impact,
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

Fleet operations use hourly round boundaries that are easy to communicate. The interface should distinguish a non-binding plan or prepared fleet from a launch confirmed for the next boundary. Offensive confirmation remains a deliberate owner action during the immediately preceding hour; the player should not have to return at the final minute of that hour.

Desired tools may include:

- operation drafts and prepared fleet compositions,
- explicit hourly command and response windows,
- a voluntary lower-income safety posture,
- fleet templates,
- night-watch and delegated alliance roles,
- summaries of what will happen while away.

The final model must preserve anticipation and counterplay. Normal play must work with healthy sleep, while additional attention and organized coverage may provide a bounded advantage for top competition.

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
