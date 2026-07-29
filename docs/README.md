# Aquata documentation

Stand: 2026-07-29

This directory contains the only active project documentation for the Aquata remake.

Aquata is currently in product rediscovery. The existing code proves technical mechanics, but the next development work must be driven by the current product vision rather than by the former phase roadmap.

## Reading order

1. product/VISION.md
2. GLOSSARY.md
3. product/CORE_LOOP.md
4. product/FIRST_PROPER_VERSION.md
5. product/WORLD_AND_DISCOVERY.md
6. product/ECONOMY_AND_GROWTH.md
7. product/SEASONS_AND_PROGRESSION.md
8. product/WARFARE_INTELLIGENCE_AND_RECOVERY.md
9. product/COMMUNITY_AND_SOCIAL_PLAY.md
10. product/IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md
11. product/PRODUCT_EXPERIENCE.md
12. product/OPEN_QUESTIONS.md
13. engineering/IMPLEMENTATION_ROADMAP.md
14. engineering/ARCHITECTURE.md
15. engineering/TESTING.md

## Authority

- Documents under product define the intended game and player experience.
- product/FIRST_PROPER_VERSION.md owns the scope boundary for the first end-to-end multiplayer version; detailed rules remain in their topical owning documents.
- engineering/IMPLEMENTATION_ROADMAP.md owns the outcome-based delivery order and the detailed plan for the next implementation outcome.
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

The first proper playable-version scope is defined in product/FIRST_PROPER_VERSION.md and is complete enough for an implementation roadmap. It proves the modern loop through placement, economy, reconnaissance, neutral and PvP combat, alliance response, command-ship identity, return, and recovery in a real time-bounded multiplayer test season.

The active roadmap in engineering/IMPLEMENTATION_ROADMAP.md is a sequence of playable vertical outcomes that validates this loop, not a revived legacy feature checklist. Only its next outcome is decomposed in detail. Only the curves, costs, radii, formulas, and content values needed by that outcome should be fixed at that point.

Product rediscovery continues for the deferred full-season game, including later ships and research, modules and specializations, late entry, global season stages, awards, the final battle, Havoc, persistent history, richer politics, and live operation. Those questions must not silently expand or block the first proper version.
