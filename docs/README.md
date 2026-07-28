# Aquata documentation

Stand: 2026-07-28

This directory contains the only active project documentation for the Aquata remake.

Aquata is currently in product rediscovery. The existing code proves technical mechanics, but the next development work must be driven by the current product vision rather than by the former phase roadmap.

## Reading order

1. product/VISION.md
2. GLOSSARY.md
3. product/CORE_LOOP.md
4. product/WORLD_AND_DISCOVERY.md
5. product/ECONOMY_AND_GROWTH.md
6. product/SEASONS_AND_PROGRESSION.md
7. product/WARFARE_INTELLIGENCE_AND_RECOVERY.md
8. product/COMMUNITY_AND_SOCIAL_PLAY.md
9. product/IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md
10. product/PRODUCT_EXPERIENCE.md
11. product/OPEN_QUESTIONS.md
12. engineering/ARCHITECTURE.md
13. engineering/TESTING.md

## Authority

- Documents under product define the intended game and player experience.
- Documents under engineering define the current technical baseline and implementation guardrails.
- Existing code is a prototype implementation, not an implicit product decision.
- The ignored old/ directory and Git history are historical references only.

When documents and implementation disagree, do not silently preserve the implementation. Resolve the product question first and then update both code and documentation.

## Maintenance rules

- Keep these documents current instead of appending a historical narrative.
- Use the canonical concepts and labels in GLOSSARY.md across documents, interface copy, code, reports, and tests.
- Incorporate a confirmed decision into the document that owns the topic.
- Remove the corresponding item from product/OPEN_QUESTIONS.md.
- Delete superseded documents and contradictory text. Do not retain deprecated or archived variants inside the active documentation tree.
- Do not create phase plans until a validated product slice needs an implementation plan.
- Avoid duplicating the same rule across documents. Link to the owning document instead.
- A substantial gameplay, product, architecture, or scope change is incomplete until its documentation is updated.

## Current product-planning posture

Before creating an implementation roadmap, close the product-level gaps that could still change what Aquata fundamentally is. The remaining planning should cover:

- time, safety, and the normal-life contract,
- the complete player and seasonal journey,
- the operation and intelligence decision flow,
- conflict, protection, farming, and recovery,
- representative command-ship builds and their content loop,
- alliances, politics, awards, and the season ending,
- launch scope, onboarding, community, monetization principles, and live operation.

The initial world contract is now defined in product/WORLD_AND_DISCOVERY.md: deliberately uneven generated resource geography creates the placement game and emergent player density; the first world scope stays bounded to resource nodes, station placement, neutral facilities, and a simple ruin path before later POI expansions.

Product rediscovery is complete enough for a roadmap when the first session, first week, ordinary week, major operation, severe defeat, late entry, and season finale can each be narrated end to end; no unresolved question is likely to replace a primary surface or core entity; and the remaining questions are mainly balancing, content volume, interface detail, or implementation.

The resulting roadmap should be a sequence of playable vertical outcomes that validate the modern core loop, not a revived legacy feature checklist. Each roadmap phase can then be planned in detail immediately before implementation. Exact curves, costs, radii, formulas, and full content catalogs do not need to be fixed before that roadmap exists.
