# Community and social play

Stand: 2026-07-24

## Social premise

Aquata's community is part of its strategy.

Friendships, trust, reputation, pacts, rivalries, and alliance politics change which military actions are possible. A social system that only sits beside the game would lose this connection.

## The Macbox

Historically, the Macbox was the central communication point. Players discussed the game and everyday life there, and real friendships formed.

The modern equivalent should remain central rather than becoming a buried chat page. It should be present from the command view and connect directly to game context.

Likely communication scopes are:

- global or world conversation,
- alliance conversation,
- direct conversations,
- temporary operation rooms,
- leadership or role-based rooms where justified.

Messages should be able to contain game objects such as:

- map positions,
- targets,
- scans,
- battle reports,
- fleets,
- operations,
- timing proposals.

These objects should remain interactive and respect their sharing permissions.

A battle report originates only from an engagement's authorized participant record. A player who did not participate cannot acquire that report by scanning the target before or after the battle. An eligible participant may explicitly share the report as a permission-bearing game object; that deliberate share, rather than reconnaissance or alliance membership by itself, grants access to its contents.

## Operations as social spaces

Every coordinated operation should have:

- a clear objective,
- invited participants,
- a target or map context,
- planned timing,
- assigned or volunteered roles,
- shared intelligence,
- a focused conversation,
- an outcome and report history.

The tool should reduce organizational friction without replacing human planning. It should make coordination possible on mobile without requiring spreadsheets or copying data into an external chat.

An operation may be planned several hourly rounds in advance, but planning does not authorize an offensive launch. For a planned launch at the next round boundary, each participating owner must confirm their own fleet during the immediately preceding hour. The operation should show who has confirmed and who is still missing without letting a commander launch on their behalf.

## Delegated fleets without settlements

The historical settlement system provided two valuable cooperation mechanics:

- Only a fleet's owner could compose it and release it for shared use.
- One General per settlement could recall released fleets from active fleet orders, but could not retask or reconfigure them.
- Any player in the settlement could call an available released fleet to defend their own station.

The remake should preserve these bounded permissions without introducing a settlement-management layer solely to host them.

The target model separates three concepts:

### Fleet ownership

Only the owner may:

- compose the fleet,
- choose its ships,
- enable or disable alliance fleet release for all of their fleets.

Ownership never transfers.

### Alliance fleet release

Alliance fleet release is one persistent all-or-none choice by the owner for the current alliance, not a setting repeated for every fleet. When enabled, every fleet that owner currently has available at home may be called by a current alliance member only to defend that member's own station. Newly created, split, combined, refilled, or rebuilt fleets follow the same owner-level setting immediately without requiring another release.

A defense call always commits one complete available fleet. It cannot select only its fast ships, keep selected ships home, or otherwise recompose the owner's contribution. Alliance members may choose among all currently available fleets covered by the setting, but may not use them for an attack, alter their composition, redirect them to a third party, or override an already locked owner command.

The fleet owner pays the defense call's launch overhead and supplies its complete onboard fuel. This spending authority is part of the owner's all-or-none alliance fleet release. A fleet whose owner cannot cover the exact fuel commitment is not callable, and every successful or rejected call remains visible and auditable to that owner.

The release is bound to the current alliance. Disabling it or ending alliance membership prevents new defense calls and it does not silently carry into a later alliance. The treatment of a defense call that was already locked or launched remains governed by explicit conflict and membership-transition rules.

### Operation command

A coordinated operation may appoint one commander. An owner participating in that operation may grant the commander narrow recall authority for the fleet orders they contribute to it. The commander may not compose, launch, redirect, split, or otherwise take ownership of the fleet.

This preserves the useful General role as narrow emergency authority. It does not require a permanent settlement hierarchy.

Because remake alliances will remain intentionally small, the current alliance covers the persistent defense trust scope. Cross-alliance access requires an explicit shared operation rather than a permanent blanket release, and the initial model does not add selected-player exceptions to the owner's all-or-none alliance setting.

## Alliances

Alliances create:

- trusted information sharing,
- coordinated offense and defense,
- strategic specialization,
- shared identity,
- political commitments,
- a source of belonging across a season.

Historically, a settlement normally contained four players, while alliances ranged from one to roughly twenty depending on round population.

The remake should use a fixed alliance cap independent of total player population. The exact number remains open and should be chosen by the largest group that can still be managed as a real social unit. The cap should protect:

- close relationships,
- meaningful individual responsibility,
- readable communication,
- bounded fleet and intelligence permissions,
- opportunities for several distinct political actors.

The cap must not be so scarce that alliances routinely exclude temporarily inactive friends simply to reserve every seat for highly active players. A dormant-membership state that preserves social history without consuming permanent active capacity is a candidate solution; the exact roster model remains open.

Larger power blocs should emerge through treaties and coalitions between alliances instead of increasing the alliance cap.

## Social membership and operational alliance link

Community belonging must be possible before a new seasonal station has built every strategic system. Global conversation, direct conversation, alliance invitations, non-tactical alliance planning, and coordinated season placement therefore do not require a station facility. A player may join or reserve their place in an alliance socially before their seasonal station has an operational alliance link.

The **communications center** is the station's physical link to seasonal alliance play:

- Level I is a low-cost opening option targeted for days zero to one. It activates the station's operational alliance link, alliance map context, and the sending and receiving of shared scans and battle reports under their permissions.
- Level II is a medium-cost middle-opening option targeted for approximately days two to five. It activates full operation rooms, defense calls, and alliance fleet release.

These windows are balance targets rather than membership timers. A coordinated group may prioritize the facilities earlier by accepting the corresponding resource cost, while a solo player may postpone them without losing basic social access.

A sensor array is required to produce personal scans; a communications center is required to distribute or receive them through the operational alliance network. A player without personal scanning capability may therefore still use intelligence deliberately shared by operationally linked allies. The sharing rule creates useful cooperation without turning one specialist into an all-seeing source of automatic live truth.

Social membership remains visible while the operational alliance link is absent, disabled, or temporarily restricted. The interface must state clearly which member is socially present, which station is operationally linked, and which information or permissions are currently available. This distinction must never silently grant access to tactical data.

## Founding and administration

Any eligible player may create an alliance and is responsible for managing it.

Alliance administration must support:

- inviting and accepting players,
- handling join requests if enabled,
- removing members,
- assigning and revoking roles,
- defining bounded permissions,
- transferring leadership,
- managing shared operations, intelligence, and diplomacy.

Roles should be understandable and auditable. The system may provide useful defaults, but the alliance leadership decides who receives which available rights.

## Alliance changes

Players may leave, be removed, and join another alliance during a season. Timed restrictions are required to prevent rapid alliance hopping from abusing:

- shared intelligence,
- alliance fleet release and defense calls,
- operation permissions,
- attack boundaries,
- diplomacy or season scoring.

Sensitive access ends immediately when membership ends. A player may join socially before their station's operational permissions unlock through the communications center. Exact cooldowns and the treatment of fleets already in motion remain open.

## Inactivity and membership

Seasonal inactivity must not erase the persistent person or their community history.

After fourteen days of seasonal inactivity, the player and their alliance receive a warning. After twenty-eight total days, the seasonal player is deactivated and no longer supplies operational alliance permissions or a hidden reserve. Their canonical account, public profile, and community history remain.

The alliance UI should distinguish a temporarily inactive friend from an operationally available member. Whether a deactivated player retains a non-operational place in the social roster or leaves the active membership entirely remains a roster-design question.

The complete inactivity, return, ruin, and vacation rules are defined in IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md.

## Treaties and cross-season politics

Some historical pacts lasted across many rounds. In other rounds, friends formed new alliances or created treaties between alliances.

The game should preserve this social continuity without forcing the same organization every season. Persistent identity can record:

- former memberships,
- notable shared operations,
- treaties and rivalries,
- alliance lineage,
- season results,
- player-authored descriptions or memorials.

The intermission may also be used to discuss and coordinate intended starting areas for the next season. This is legitimate social planning, but it does not force the same organization to reform. The next season should still allow political remixing.

## Discussion, feedback, and knowledge

Historical forums served several distinct functions:

- strategic discussion and planning,
- community conversation,
- suggestions and improvement ideas,
- bug reports,
- persistent knowledge.

The remake should implement the functions that create value rather than reproducing a generic full forum by default.

Possible focused surfaces include:

- persistent alliance announcements or discussion threads,
- operation history,
- an in-game help and rules area,
- structured feedback and bug reporting,
- a public changelog,
- curated community proposals.

## External platforms

External communities such as Discord may complement Aquata, but the core social and strategic context should remain in the product. Requiring a separate platform would weaken onboarding, contextual sharing, moderation, and Aquata's ownership of its community space.

## Safety and moderation

A central social space requires:

- blocking and reporting,
- moderation roles and auditability,
- notification controls,
- rate and abuse limits,
- clear privacy for direct and operation communication,
- tools appropriate for a long-running community.

Canonical identity, account-sharing rules, household play, incognito identities, multi-account investigation, and the human moderation model are defined in IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md. They are launch infrastructure, not a later community add-on.
