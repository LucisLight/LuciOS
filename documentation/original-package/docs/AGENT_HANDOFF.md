# LuciOS v1.1 — Codex / implementation handoff

**Read this before modifying any source file.** This document intentionally overrides conflicting decisions in older drafts.

## Non-negotiable current decisions

1. **Navigation:** Top-mounted, rotating **dry-cleaner-style overhead conveyor rail** with hanging pixel-art app tags. Scroll with hover/focus left and right edge arrows and provide click, arrow-key and button alternatives. **Do not implement the old radial launcher**.
2. **Opening apps:** Select tag → lightweight swing → mechanical hand retrieves it (staged enhancement) → dark display screen/frame lowers over desktop → bronze pipe borders and top-right exit pipe → tag inserted → holographic app content displays. Gears/steam accompany relevant processing stages; **show content immediately if animation is off or unavailable**.
3. **Display model:** Start with **one active framed application viewport** and explicit Back/Close controls. Do **not** build a draggable/resizable multi-window manager unless scope is later changed.
4. **Project evidence:** Battleship, CorvusDesk, Bad Apple Repair. Each has **three real screenshots**, a few favorite **real code snippets/images with explanation**, and a **verified, project-specific GitHub repository link placed after those sections**. No dummy re-creations, mock ticket interfaces, or sandbox app previews in v1.1.
5. **Terminal:** Local command allowlist only. Type is quiet. Valid Enter triggers pipe transfer → processing; **valve releases steam only while processing** → output emerges. Invalid command = word shake + readable error, **no steam**. Reduced-motion mode has zero required animation.
6. **Look:** Steampunk **throughout** the OS meeting cyberpunk: black/grey/white, pastel pink holograms, bronze machinery, pixel icons, eerie animated wallpaper, red 3D Enter button after a short boot bar.
7. **Professional priority:** About/Projects/Skills/Resume/Contact and traditional **Portfolio View** are fully accessible without animated rituals. Instructor rubric over spectacle. No fake credentials or unverified accomplishments.
8. **Deployment/stack:** React, TypeScript, Vite, CSS/SVG, static HTTPS; no custom backend required. Desktop-first visual design; readable fallback for small screens.
9. **Excluded:** Hidden puzzles, garden, evilLuciOS and page peel. Those are later phases *only*.

## Build gate / initial work order

Start with **M0 only**: scaffold React+TypeScript+Vite, create app registry and shared content type placeholders, add design tokens, set up basic build/test scripts, and validate local and production builds. Do not build all animations at once.

Then M1 complete required portfolio content and Portfolio View; M2 app rail / shell; M3 single display frame and staged animation; M4 galleries; M5 terminal; M6 QA + deploy. See the full implementation plan.

## Proposed implementation components

`BootSequence`, `EnterScreen`, `DesktopShell`, `OverheadAppRail`, `RailTag`, `MechanicalLoader`, `MechanicalHand`, `DisplayFrame`, `AppRegistry`, `PortfolioView`, `ProjectsGallery`, `ProjectCaseStudy`, `CodeHighlight`, `TerminalApp`, `PipeValveSequence`.

## Initial Codex prompt

> Read `docs/AGENT_HANDOFF.md`, the v1.1 SRS, UI/UX spec and technical implementation plan. Implement **only M0**. This is a *single framed app display* fed by a *top hanging conveyor rail* — **not** a radial dial or draggable multi-window interface. Project pages use genuine screenshots, code highlights and direct GitHub links — **not** dummy demos. Set up the React/TypeScript/Vite repository skeleton, design tokens, typed content and app registry placeholders, tests if appropriate, and record exact commands/build results. Do not invent personal project details, links, or assets. Do not implement later milestones. Report any conflicting requirement before deciding.

## Feedback / completion format expected from Codex

- Milestone and requirement IDs addressed.
- Files created/changed.
- Commands run and real results; errors if any.
- Tests executed and pass/fail outcomes.
- What remains incomplete or blocked by missing evidence/assets.

**If a prior document conflicts, v1.1 wins.** Do not silently reintroduce deprecated features.
