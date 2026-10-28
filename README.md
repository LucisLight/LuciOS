# LuciOS

LuciOS is Luci Crow's professional technology portfolio, presented as an original mechanical-futurist operating system. The interface combines dark industrial hardware, pastel-pink holographic elements, pixel details, and a shadow-hand motif while keeping the professional content direct and accessible.

**Live portfolio:** [lucislight.github.io/LuciOS](https://lucislight.github.io/LuciOS/)

## Portfolio highlights

- Professional introduction, career interests, technical skills, certifications, and contact information
- Detailed case studies for CorvusDesk, Battleship Game, and LuciOS
- Downloadable technology resume
- Seven-second mechanical startup sequence with randomized loading pauses
- Prototype LuciOS desktop with movable folders, reusable draggable windows, a pixel-shadow hand, mechanical intake processing, side-funnel window ejection, and a functional professional-evidence Vault
- Persistent back-to-top control and keyboard-visible focus states
- Selectable color-vision modes for protanopia, deuteranopia, tritanopia, and achromatopsia
- Reduced-motion support and responsive layouts

## Featured projects

### CorvusDesk

A full-stack service-request tracking system built with React, Spring Boot, Java, and MongoDB. It supports clearance-based ticket visibility, owner management, search, filtering, sorting, comments, history, closure, and reopening.

[View CorvusDesk](https://github.com/LucisLight/CorvusDesk)

### Battleship Game

A collaborative Java command-line game featuring fleet placement, coordinate validation, randomized computer behavior, alternating turns, hit detection, and win logic.

[View Battleship Game](https://github.com/LucisLight/Battleship-Game)

### LuciOS

The portfolio itself is the third featured project. It translates an extensive software and interaction design specification into a practical React experience that can grow into the larger animated operating-system concept.

## Technology

- React 19
- TypeScript
- Vite
- CSS
- GitHub Actions
- GitHub Pages

## Documentation

The complete original v1.1 planning package is preserved in [`documentation/original-package`](documentation/original-package). Start with the [document index](documentation/original-package/docs/DOCUMENT_INDEX.md) or download the [untouched source archive](documentation/LuciOS_Documentation_v1_1_Codex_Ready.zip).

The package includes:

- [Project proposal](documentation/original-package/docs/LuciOS_Project_Proposal_v1_1.md)
- [Core requirements and architecture](documentation/original-package/docs/LuciOS_Core_SRS_and_Architecture_v1_1.md)
- [UI/UX design](documentation/original-package/docs/LuciOS_UIUX_Design_v1_1.md)
- [Technical implementation plan](documentation/original-package/docs/LuciOS_Technical_Implementation_Plan_v1_1.md)
- PDF editions and original SVG wireframes
- Changelog and development handoff notes

These documents describe the broader LuciOS vision. The current portfolio is a focused submission edition, so some planned animated and simulated OS features remain future work.

## Local development

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

## Quality checks

```bash
pnpm lint
pnpm build
```

To inspect the production build locally:

```bash
pnpm preview
```

## Deployment

The site is static and requires no backend, database, or secrets. Pushes to `main` are built and deployed to GitHub Pages by the workflow in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

## Author

Designed and built by [Luci Crow](https://github.com/LucisLight).
