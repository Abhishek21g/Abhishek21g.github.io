# Project Context

## Project Name

Abhishek Enaguthi Personal Website

## One-Sentence Goal

Ship a personal portfolio website whose entire public interface feels like the `2a` interactive OS desktop.

## User / Customer

Abhishek Enaguthi: Oregon State CS student and systems/HPC engineer using the site as a public portfolio and as a playground for agent-driven iteration.

## What This Project Should Do

- Present Abhishek's work, background, projects, gallery, contact links, and blog surface through the OS-shell metaphor.
- Preserve the `2a` desktop direction as the primary website experience.
- Let future Claude/Codex/Rudhra agents coordinate through durable context files, workflow docs, skills, and promotion notes.
- Deploy as a static Next.js export to GitHub Pages at `enaguthi.com`.

## What This Project Should Not Do

- Do not show the Claude design-document wrapper, option labels like `2a`, or direction headings on the public site.
- Do not bring back the older standalone landing page, separate gallery page chrome, or standalone blog UI unless explicitly requested.
- Do not make DNS, production, or deployment changes without confirmation.
- Do not overwrite user changes or generated design assets without inspecting them first.

## Tech Stack

- Language: TypeScript / TSX, JavaScript, HTML/CSS
- Framework: Next.js 14 App Router, React 18, Tailwind CSS
- Package manager: npm
- Database: none
- Hosting: GitHub Pages via static export to `out/`, deployed from `gh-pages`
- Testing: no dedicated test runner yet; use lint, build, and browser/screenshot verification

## Important Commands

```sh
npm ci
npm run dev
npm run lint
npm run build
```

## Key Files And Directories

- `src/app/page.tsx`: homepage route, currently frames the OS desktop.
- `src/app/gallery/page.tsx`: gallery route, currently aligned to the OS desktop.
- `src/app/blog/*/page.tsx`: old blog routes, currently aligned to the OS desktop.
- `src/components/PortfolioDesktopFrame.tsx`: shared wrapper for rendering the OS surface through the Next app.
- `public/claude-design/index.html`: bundled interactive OS desktop asset.
- `public/claude-design/support.js`: support script for the bundled design asset.
- `public/claude-design/media/`: images/media used by the OS desktop.
- `next.config.js`: static export configuration.
- `.github/workflows/deploy.yml`: builds with Node 18 and deploys `out/` to `gh-pages`.
- `agent/`: Rudhra project operating-system docs, loop, evals, daemon, and promotion files.
- `.codex/skills/` and `.claude/skills/`: project-local skills for repeatable agent workflows.

## Design / Product Taste

- Quiet, sharp, OS-like, systems-fluent, and interactive.
- The website should feel like an actual desktop shell rather than a marketing landing page.
- UI changes should improve clarity, image quality, responsive behavior, and polish without diluting the `2a` desktop concept.

## Constraints

- Time: move quickly but verify with the repo's real build and browser checks.
- Budget: keep dependencies minimal; do not add services unless the benefit is clear.
- Security: do not expose private files, credentials, or personal data; confirm before production changes.
- Performance: static export should remain lightweight and reliable on GitHub Pages.
- Compatibility: support modern desktop and mobile browsers; avoid layout overflow and broken media.

## Definition Of Done

- Code is implemented.
- Relevant checks pass.
- Important docs/context are updated.
- Remaining risks are called out.
- For UI work, the page is inspected in a browser or screenshot when possible.
- For deployment work, GitHub Actions and Pages status are checked after explicit approval.

## Open Questions

- Should old blog content live inside OS windows, a terminal command, or a dedicated app inside the desktop?
- Should the OS desktop become native React over time instead of staying as the bundled HTML artifact?
- What agent loop should run first: gallery polish, responsive/mobile pass, copy/content pass, or component migration?
