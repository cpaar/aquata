# Aquata documentation

Stand: 2026-07-24

This directory contains the only active project documentation for the Aquata remake.

Aquata is currently in product rediscovery. The existing code proves technical mechanics, but the next development work must be driven by the current product vision rather than by the former phase roadmap.

## Reading order

1. product/VISION.md
2. GLOSSARY.md
3. product/CORE_LOOP.md
4. product/ECONOMY_AND_GROWTH.md
5. product/SEASONS_AND_PROGRESSION.md
6. product/WARFARE_INTELLIGENCE_AND_RECOVERY.md
7. product/COMMUNITY_AND_SOCIAL_PLAY.md
8. product/IDENTITY_SAFETY_AND_ACCOUNT_LIFECYCLE.md
9. product/PRODUCT_EXPERIENCE.md
10. product/OPEN_QUESTIONS.md
11. engineering/ARCHITECTURE.md
12. engineering/TESTING.md

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

## Current development posture

Do not expand the former legacy feature checklist by default. The next product milestone is a small playable prototype of the modern core loop:

- read the current situation,
- acquire or share intelligence,
- choose a target and an operation,
- coordinate or deceive,
- commit a fleet,
- receive a meaningful outcome,
- recover and adapt.

The prototype should validate this loop before broad systems such as rankings, a full alliance administration, or a complete command-ship progression tree are implemented.
