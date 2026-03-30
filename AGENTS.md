# AGENTS.md

## Repository Status

- Repository root: `/Users/hanna/Documents/code/interval-timer`
- Primary stack: Next.js App Router, React, TypeScript, Tailwind CSS, Zustand, Framer Motion, `next-pwa`.
- Current app entry points: `app/page.tsx` and `app/workout/page.tsx`.
- Core timer logic lives in `lib/timerEngine.ts` and `store/useWorkoutStore.ts`.
- Local persistence uses Zustand `persist` middleware with `localStorage`.
- No dedicated test framework is configured yet.
- No Cursor rules were found in `.cursor/rules/`.
- No `.cursorrules` file was found.
- No Copilot instructions were found in `.github/copilot-instructions.md`.

This file reflects the repository after the initial app scaffold.
Update it whenever scripts, linting, testing, or architectural conventions change.

## Commands

### Build

- Install dependencies with `npm install`.
- Development server: `npm run dev`
- Production build: `npm run build`
  This exports a static site to `out/` via Next.js `output: "export"`.
- Start production server: `npm run start`
- Type-check only: `npm run typecheck`

### Lint

- Lint the project with `npm run lint`.
- ESLint uses the Next.js core-web-vitals ruleset via `eslint.config.mjs`.
- The lint script runs the ESLint CLI directly as `eslint .`.
- No standalone formatter is configured; rely on consistent manual formatting unless one is added later.

### Test

- No automated test runner is configured yet.
- Do not claim tests were run unless a test framework is added and a real command exists.

### Single Test Execution

- Single-test execution is not available because no test runner is configured.
- If Vitest, Jest, Playwright, or another runner is added later, record the exact file-level and test-name commands here.

### Install / Bootstrap

- Bootstrap with `npm install`.
- The generated PWA assets are produced by Next.js metadata routes and `next-pwa` during build.
- GitHub Pages deployment is configured via `.github/workflows/deploy-pages.yml`.
- Production deploys are configured for the project-site path `/interval-timer`.

## Agent Workflow

- Inspect the current repository contents before making assumptions.
- Prefer updating this file from actual config files and scripts, not guessed conventions.
- Keep changes minimal and aligned with the repository's current maturity.
- If you add tooling, update the command section in the same change.
- If you add tests, include the exact command for running one file and, if supported, one named test.
- If you add linting or formatting, record whether the tool auto-fixes files.
- Preserve the mobile-first product direction and native-app feel when editing UI.

## Source Of Truth

- `package.json` scripts are the source of truth for Node-based commands.
- Tool-specific config files are the source of truth for code style and test behavior.
- `tailwind.config.ts` is the source of truth for theme tokens and design primitives.
- `app/manifest.ts`, `app/icon.tsx`, `app/apple-icon.tsx`, and `next.config.mjs` are the source of truth for PWA behavior.
- `next.config.mjs`, `app/layout.tsx`, and `app/manifest.ts` are also the source of truth for GitHub Pages base-path behavior.
- Repository-local instructions override generic agent preferences.
- If Cursor or Copilot instruction files are added later, summarize their requirements here.

## Cursor / Copilot Rules Status

- `.cursor/rules/`: not present when this file was written.
- `.cursorrules`: not present when this file was written.
- `.github/copilot-instructions.md`: not present when this file was written.
- There are therefore no repository-specific Cursor or Copilot rules to mirror yet.

## Code Style Guidelines

Because the repository currently has no implementation files, the conventions below are default guidance for future additions.
Treat them as provisional until real code establishes stronger local patterns.

### General Style

- Prefer the smallest correct change.
- Keep files focused and avoid introducing extra abstractions early.
- Match the app's premium mobile-first visual style and interaction patterns.
- Use ASCII by default unless a file already uses Unicode with intent.
- Add comments only when they explain non-obvious reasoning.
- Avoid decorative comments and redundant inline narration.
- Prefer explicit, readable UI code over highly abstract component indirection.

### Formatting

- No formatter config is present; keep formatting consistent with the existing TypeScript and JSX files.
- Prefer one statement per line.
- Avoid deeply nested control flow when early returns are clearer.
- Keep line length reasonable for readability.
- Preserve a trailing newline at end of file.
- Keep Tailwind class lists grouped by layout, spacing, color, and effects when practical.

### Imports

- Keep imports grouped consistently within a file.
- Prefer the `@/` alias for app-local imports because `tsconfig.json` defines it.
- Remove unused imports.
- Avoid wildcard imports unless the language or framework strongly favors them.
- Import types separately when the language/tooling benefits from it.
- Keep side-effect imports obvious and rare.
- Put framework imports first, then external packages, then local modules.

### Types

- Prefer explicit types at public boundaries.
- Prefer precise types over `any` or overly broad unions.
- Use inference for obvious local values when it improves readability.
- Model nullable or optional values intentionally.
- Do not silence type errors without a code comment explaining why.
- The repository already uses strict TypeScript settings; keep new code compatible with `strict: true`.

### Naming

- Use descriptive names over abbreviations.
- Name functions after behavior, not implementation details.
- Name variables after the value they hold.
- Use singular names for single items and plural names for collections.
- Keep boolean names readable as predicates like `isOpen`, `hasError`, or `canRetry`.
- Use PascalCase for React components, camelCase for functions/variables, and ALL_CAPS only for display labels.

### Functions And Modules

- Keep functions small enough to read in one pass.
- Prefer passing structured objects only when it improves clarity.
- Avoid hidden global state.
- Keep module APIs narrow.
- Extract helpers when logic is reused or a function becomes hard to scan.
- Do not create layers of indirection without a concrete need.
- Keep timer math centralized in `lib/timerEngine.ts` or the workout store rather than scattering it across components.
- Keep presentational components mostly stateless and push durable state into the Zustand store.

### Error Handling

- Fail loudly on programmer errors.
- Handle expected runtime failures close to the boundary where they occur.
- Include actionable context in error messages.
- Do not swallow exceptions silently.
- Return structured error information when the calling code can recover.
- Log errors once at the appropriate boundary, not at every layer.
- In browser-only APIs such as vibration, audio, and service worker features, guard access with feature detection.

### Testing Expectations

- Add tests alongside behavior once a test framework exists.
- Cover the changed behavior, not unrelated code.
- Prefer deterministic tests.
- Avoid real network calls, time dependencies, and shared mutable state unless explicitly required.
- When fixing a bug, add a regression test if the project has tests.
- Update this file with exact test commands whenever a runner is added.
- Timer behavior is high risk; when tests are introduced, prioritize elapsed-time calculations, pause/resume, skip, and background recovery.

### Dependency Management

- Add the fewest new dependencies necessary.
- Prefer standard library or existing project dependencies first.
- Document why a new dependency is needed in the PR or commit context.
- Avoid overlapping tools that solve the same problem.
- Keep the client bundle lean; avoid large UI frameworks that conflict with the current custom Tailwind approach.

### File Organization

- Keep related code close together.
- Prefer clear, predictable file names.
- Avoid prematurely splitting code into many tiny files.
- Co-locate tests with source files if that becomes the project convention.
- Revisit organization once the codebase has real structure.
- App routes belong in `app/`, reusable UI in `components/`, hooks in `hooks/`, timer utilities in `lib/`, and persisted state in `store/`.

## Git And Change Safety

- Do not revert user changes you did not make.
- Expect the worktree may be dirty.
- Avoid destructive Git commands unless explicitly requested.
- Do not amend commits unless explicitly requested.
- If unrelated changes exist, work around them rather than removing them.

## When Updating This File

- Replace provisional guidance with repository-specific facts as soon as they exist.
- Prefer exact commands over prose descriptions.
- Include single-test examples for the actual runner in use.
- Mirror any future Cursor or Copilot instructions here.
- Keep this file concise, factual, and grounded in the current repo.
