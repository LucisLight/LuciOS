<div align="center">

# LuciOS

### The portfolio is the interface.

**A browser-based technology portfolio disguised as an original mechanical-futurist operating system.**  
*Steampunk engineering meets cyberpunk holograms; real projects are the centerpiece.*

**Project phase:** Planning / specifications complete; v1.1 implementation not yet started.  
**Owner:** Luci Crow · **Documentation:** October 22, 2026 · **Target:** Professional portfolio MVP.

</div>

---

## What is LuciOS?

LuciOS is a React-based portfolio experience that gives visitors a memorable way to explore Luci's professional background, code, and completed work. It looks and behaves like an invented operating system, but it is **a website, not a real OS**. No account, password, operating-system command execution, or real filesystem access is needed.

The visual idea is a futuristic mechanical machine: black and grey metal, pastel-pink holograms, bronze pipes, chunky pixel icons, and restrained eerie ambient motion. Unlike an ordinary desktop or Windows clone, its applications **hang from an overhead rotating conveyor rail** like garments at a dry cleaner.

Visitors can explore the playful presentation or take a direct **Portfolio View** route. All teacher-required and employer-relevant content must be accessible without waiting for animations or learning the custom controls.

## The v1.1 experience — proposed, not yet built

1. **Boot and entry:** A brief LuciOS progress bar leads to a giant raised red **Enter LuciOS** button on black. This is theatrical entry, **not authentication**. Skip / keyboard entry must be available.
2. **Overhead app rail:** Pixel-art app tags hang from a mechanized conveyor across the top. Hovering or focusing left/right edge controls scrolls the available tags; clicking or keyboard-selecting a tag chooses an app. The rail should visibly swing lightly when it moves.
3. **Mechanical loader:** A stylized robotic hand retrieves the chosen tag. A blank black **display frame** descends over the desktop; bronze pipes frame the display, with a pipe continuing upward from the upper-right corner. The hand inserts the tag and the app's **holographic content appears inside the frame**. Gears and a short steam effect mark processing/transition events. Prefer one active display rather than a collection of draggable windows for the MVP.
4. **Professional apps:** About, Projects, Skills, Resume, Contact, and a safe stylized Terminal. Clear exit/back controls, with a persistent quick route to Resume, Contact, and Portfolio View.
5. **Real project evidence:** Three featured projects — **Battleship, CorvusDesk, Bad Apple Repair** — each get **three authentic app/site screenshots**, a selection of **favorite code screenshots or syntax-highlighted excerpts with explanation**, and a **clickable direct GitHub repository link at the bottom**. Each also documents the purpose, Luci's actual contributions, technology, decisions, and lessons/outcome. **No dummy or recreated demo apps in v1.1.**
6. **Mechanical terminal:** Supported text commands only. After Enter, a validated command is pulled into a pipe; **the pressure valve emits steam only during processing**, and the output emerges from the other side. Mistyped commands briefly shake and show a textual error; they do **not** trigger steam. Animation has an accessible reduced-motion fallback.

### Main sections

| Application | What a visitor finds |
| --- | --- |
| About | Luci's professional bio, CS studies, work background and career direction (100–250 words) |
| Projects | Three evidence-based project pages with real screenshots, code highlights and direct repo links |
| Skills | Languages, frameworks, databases, networking, cloud, repairs and development tools — accurate skill descriptions |
| Resume | Current resume PDF and a straightforward download action |
| Contact | Verified safe professional contact methods and profile links |
| Terminal | Locally simulated commands (`help`, `about`, `projects`, `skills`, `resume`, `contact`) |
| Portfolio View | Direct, readable conventional navigation to the same portfolio information |

## Featured projects — evidence checklist

Each project record must include **all** of the following before publishing:

- Title and concise problem/purpose.
- Luci's **specific** role, code ownership, technical decisions, technologies and results/lessons.
- **Three** approved real screenshots of the running application/website with explanatory captions and alt text.
- A few favorite **actual code highlights** with a short plain-language explanation. Prefer syntax-highlighted text alongside images for readability; redact secrets/customer data.
- A **project-specific GitHub repository URL below the media/code sections**. Verify the target is public/authorized before enabling it.

Project gallery content and links are **pending evidence review**; no public repository URLs are fabricated in these specs.

## Architecture (proposed)

| Layer | Choice |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Visuals | CSS custom properties, SVG, CSS/Web Animations and pixel-style assets |
| App navigation | Typed App Registry → overhead rail selection → Mechanical Loader → single Display Frame |
| State | React reducer/context (rail, loader, active app, terminal phases) |
| Content | Structured TypeScript/JSON or Markdown data + approved static images |
| Backend | **None for MVP**; static HTTPS hosting |
| Persistence | Optional browser-local, non-sensitive preferences |
| Testing | Component/state tests + manual keyboard, reduced-motion, browser and link checks |

**Navigation rule:** A direct nonanimated Portfolio View is always available. The theatrical loader decorates navigation; it must never block content if animations fail.

## Proposed repository structure

```text
lucios/
├── public/
│   ├── assets/icons/               # pixel-art application tags
│   ├── assets/projects/            # real, approved screenshots/code illustrations
│   └── resume/                    # public version of Luci's resume
├── src/
│   ├── app/                       # shell, entry, application registry
│   ├── components/                # AppRail, MechanicalLoader, DisplayFrame, shared UI
│   ├── state/                     # app-selection + loader + terminal reducers
│   ├── apps/                      # About, Projects, Skills, Resume, Contact, Terminal
│   ├── content/                   # profile, skills, projects, verified repo links
│   ├── styles/                    # black/pink/grey/white tokens + bronze/steam detail
│   └── main.tsx
├── tests/
├── docs/                          # specifications + design assets
├── README.md
└── package.json                   # appears when Vite is scaffolded
```

## Local setup (once scaffolded)

**These commands are planned; the repository may not contain a runnable app yet.** After the React/Vite baseline is created:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Record the actual Node version and test scripts when scaffolding lands. No database, secrets, credentials, or custom server is required for v1.1.

## Short-deadline build plan

- [x] Original proposal and first specifications documented.
- [x] **v1.1 design revision:** overhead conveyor rail / mechanical loader / one framed holographic app surface.
- [x] **v1.1 project revision:** real screenshots, code highlights and project-specific GitHub links; remove dummy previews.
- [ ] **M0:** Create React + TypeScript + Vite scaffold and establish design tokens.
- [ ] **M1:** Build straightforward Portfolio View and accurate About/Projects/Skills/Resume/Contact content.
- [ ] **M2:** Build boot, red Enter button, desktop backdrop, overhead hanging rail and nonanimated app navigation.
- [ ] **M3:** Build single Display Frame with back/close actions; then add mechanical loading motion in stages.
- [ ] **M4:** Add three real project galleries: three screenshots each, selected code highlights, verified repo link at bottom.
- [ ] **M5:** Build safe Terminal; processing-only steam and invalid-command feedback.
- [ ] **M6:** Test, proofread, check permissions/links, publish HTTPS site, submit course reflection.

**Deadline rule:** Prioritize truthful portfolio content, direct navigation and successful deployment over polishing the hand animation, gear physics, or decorative steam. An app tag must still open the right content with animations disabled.

## Accessibility, security and privacy

The experience targets keyboard controls, visible focus states, alt text, semantic headings, accessible labels, sufficient contrast, WCAG 2.2 AA principles, reduced-motion support, and a plain navigation fallback. Desktop is the visual priority; **mobile's elaborate OS interface is deferred**, but essential portfolio content still needs a readable narrow-screen mode to meet the original assignment.

The Terminal only resolves preapproved commands locally. Do not put secrets, customer tickets, production device data, private employer assets, or credentials into the public repository. External links should be verified before deployment.

## Documentation and instruction precedence

| File | Authority |
| --- | --- |
| [`docs/AGENT_HANDOFF.md`](docs/AGENT_HANDOFF.md) | **Read first:** current v1.1 build instructions and conflicts to avoid |
| [`docs/LuciOS_Core_SRS_and_Architecture_v1_1.md`](docs/LuciOS_Core_SRS_and_Architecture_v1_1.md) | Normative feature requirements and acceptance criteria |
| [`docs/LuciOS_UIUX_Design_v1_1.md`](docs/LuciOS_UIUX_Design_v1_1.md) | Current approved interaction and visual designs |
| [`docs/LuciOS_Technical_Implementation_Plan_v1_1.md`](docs/LuciOS_Technical_Implementation_Plan_v1_1.md) | Implementation milestones and test gates |
| [`docs/LuciOS_Project_Proposal_v1_1.md`](docs/LuciOS_Project_Proposal_v1_1.md) | High-level vision, including **deferred** mystery features |
| [`docs/CHANGELOG_v1_1.md`](docs/CHANGELOG_v1_1.md) | Explanation of replaced decisions |

**Do not implement old radial-dial navigation, multi-window drag behavior, or fake demo apps from superseded drafts.** The v1.1 docs are the current source of truth.

## Future vision — expressly not part of MVP

Hidden puzzles, the garden, page-fold/curl transition, evilLuciOS, and the final tiny popup saying **“Don't know why but THE END”** remain ideas for a later release. They must not be coded before the required portfolio is complete.

---

**Status statement:** This README is a planned build guide, **not a claim of implemented features or verified live links**. Update checked items, screenshots and actual commands as work is completed.
