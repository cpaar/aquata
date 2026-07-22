# Identity, safety, and account lifecycle

Stand: 2026-07-22

## Product premise

Aquata needs both continuity and reinvention.

Players should keep the identity, relationships, reputation, and community history they build over years. At the same time, a new season should let them join a themed alliance, try a different public persona, or occasionally compete without the strategic burden of a famous name.

Those freedoms must not allow a person to create several active players, evade sanctions, bypass blocks, share an account, or erase a history of harmful behavior.

## Four separate boundaries

The product and data model must distinguish four concepts.

### Canonical account

The canonical account is the durable private operator identity. It owns:

- login credentials and account recovery,
- a stable internal identifier,
- platform roles and rights,
- household declarations,
- moderation cases, warnings, and sanctions,
- the link to every seasonal persona and seasonal player,
- security and abuse evidence retained under the applicable privacy policy.

It survives every season and is always visible to authorized moderators. A display-name change, themed persona, or incognito season never creates a new canonical person from the operator's perspective.

### Persistent public profile

The public profile is the player's usual long-term community identity. It may contain:

- a chosen display name,
- avatar and profile imagery,
- a short description,
- long-term statistics and achievements,
- titles, cosmetics, and hall-of-fame entries,
- persistent community contributions,
- friendship, block, and social history where appropriate.

Players should be able to customize this profile without asking a moderator for routine themed changes. Names and imagery remain subject to community rules, protected names, impersonation prevention, and a private moderator-visible change history.

### Seasonal persona

A seasonal persona is the name and presentation used publicly inside one season. It normally reflects the persistent public profile, but it may instead be themed or incognito.

A canonical account may have only one active seasonal persona and one active seasonal player in a season. A persona is presentation, not a second account, second station, or second set of permissions.

Seasonal names should be chosen before or near the start of a season and then remain stable enough for other players to understand diplomacy and battle history. Exact rename windows and exceptional moderator changes remain open.

### Seasonal player state

The seasonal player state contains all competitive power: station, resources, collectors, research, ships, fleets, position, current alliance membership, and season standing. It resets or is forfeited independently from the canonical account and public profile.

## Themed identities

Themed alliance identities are a positive community feature. An alliance may coordinate a naming theme, while each member controls their own allowed seasonal name, avatar, and presentation.

This should be self-service within clear rules rather than depend on moderators manually renaming every participant. The product should support the social ritual without granting alliance leaders ownership of another player's identity.

Names must remain readable in reports and moderation records. Reserved official names, deceptive impersonation, abusive content, and confusing near-duplicates require prevention or review.

## Incognito seasons

Aquata should provide a first-class incognito-season option instead of encouraging famous players to create unlinked accounts.

During an incognito season:

- other players do not see the normal public profile behind the seasonal persona,
- authorized operators and moderators always see the canonical account,
- the player still has exactly one seasonal player,
- existing sanctions, household restrictions, safety protections, and account limits continue to apply,
- reports and investigations retain the canonical link,
- the persona cannot impersonate another known player or official role.

The system must not let incognito play become a way to contact someone who has blocked the canonical account, escape a sanction, or silently create a second position in the political map.

Whether an incognito identity is revealed publicly after the season, can be revealed voluntarily, and how frequently the mode is available remain open. The answer should preserve the fun of anonymity without making persistent reputation meaningless.

## One person, one active seasonal player

Multi-account play that concentrates resources, experience, favorable battles, intelligence, or protection onto one account is prohibited.

Creating another login does not create permission to operate another seasonal player. The supported route for a different public identity is the seasonal-persona system.

The game should remove common reasons for account sharing by providing legitimate collaboration features such as readiness fleets, operation command, shared intelligence, and bounded emergency recall. No collaboration feature grants permission to log into another person's account.

## Account sharing

Account sharing is prohibited. Each player issues commands only through their own canonical account.

This includes apparently helpful actions such as quickly logging in for a friend to rearrange a fleet, start an order, or call that friend's fleet into defense. Supported delegated actions must happen through explicit in-game permissions and remain narrow and auditable.

Enforcement should normally be progressive: clear warning, escalating restrictions or penalties, and stronger sanctions for repetition or deliberate abuse. The exact sanction ladder and exceptional severe cases remain a moderation-policy decision.

## Multiple players in one household

Sharing a home, network, or device is not by itself wrongdoing. Household players should declare their relationship and choose one of two supported modes for a season.

### Cooperative household

The players may join the same alliance and use normal in-game interactions. Each person still controls only their own account. Quasi-simultaneous switching between accounts on the same device and acting for the other person is not permitted.

### Independent household

The players participate as strategically independent players rather than cooperating or transferring value between their positions. The exact restrictions needed to make that separation understandable and enforceable remain open.

A household declaration does not create an exception to the account-sharing or one-player rules. Conversely, a shared network or occasional shared device must remain context for a moderator, not automatic proof of abuse.

## Moderation and suspicious-behavior tools

The system should help moderators find and understand suspicious patterns, but it must not automatically decide that a player cheated.

Useful explainable signals may include:

- repeated one-way concentration of resources or other value,
- deliberately favorable or sacrificial combat patterns,
- repeated experience or recovery benefits between the same accounts,
- unusually synchronized commands or sessions,
- overlapping device or network context,
- account switching that resembles one person controlling both sides,
- repeated use of defense, intelligence, or alliance changes to funnel advantage.

No single signal, especially a shared address or device, is sufficient evidence. Moderators need a chronological, human-readable case view that combines game events, relationships, relevant technical context, prior warnings, and player explanations.

Moderator searches, evidence access, decisions, warnings, and sanctions must themselves be permissioned and auditable. Collection and retention should be limited to what is proportionate for account security, fair play, and community safety.

The final decision belongs to a moderator, with a documented reason and a path for review or appeal. Detection models may prioritize cases; they do not issue guilt or irreversible punishment on their own.

## Inactivity lifecycle

Inactivity affects the seasonal player, not the persistent canonical account.

### Fourteen days

After fourteen consecutive days of seasonal inactivity:

- the player receives an email warning,
- alliance members receive an in-product inactivity notice,
- the seasonal player remains present and has not yet lost progress.

The exact action that counts as seasonal activity must be defined so that merely opening a social notification does not accidentally maintain a strategically useful dormant position forever.

### Twenty-eight days

After another fourteen days, twenty-eight days total:

- the seasonal player is deactivated,
- their seasonal progress is forfeited,
- operational permissions and access derived from that seasonal position end,
- the canonical account, public profile, rights, community history, and cross-season records remain.

The person may still log into the platform. If they return to active play during the same season, they begin again from zero under the season's return and placement protections.

### Abandoned station or ruin

The deactivated station should become a neutral abandoned station or ruin rather than remain an active player under another label.

The ruin:

- is detached from the returning player's control,
- can provide legible lower-risk targets for beginners and recovering players,
- cannot be used as a hidden reserve for its former alliance,
- does not let the returning player reclaim old value while also receiving a fresh start.

Its name, public connection to the former player, production, decay, collectors, loot, protection, and lifetime remain balance and privacy questions.

## Vacation mode

Vacation mode supports planned absence and is different from inactivity.

When active:

- the seasonal player is completely frozen,
- the station cannot be attacked,
- resources and production do not accumulate,
- building, research, movement, combat, and other gameplay progress stop,
- gameplay commands are blocked.

The player may still log in, manage the persistent account and profile, and participate in allowed social communication. This is preferable to blocking the entire login: the social person persists even while their competitive position is frozen.

Vacation mode must not be an instant escape from an incoming operation or a free tactical observation post. Activation therefore needs explicit safeguards such as an advance delay, no active fleets, a minimum duration, and restrictions around existing attacks. Exact rules and which live strategic information remains visible are open.

All gameplay freezes must be enforced on the server. A read-only interface is useful feedback, but it is not the security boundary.

## Product consequences

This model allows:

- a permanent community identity across many seasons,
- self-service themed alliances,
- genuine incognito play without losing operator accountability,
- one enforceable seasonal position per person,
- fair treatment of real households,
- evidence-assisted human moderation,
- a useful inactive-world ecology,
- planned breaks without either punishment or economic accumulation.

It also means identity, safety, inactivity, and vacation mode must be designed as foundational platform systems rather than added after the competitive game is live.
