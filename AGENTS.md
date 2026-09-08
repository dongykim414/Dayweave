# AGENTS.md

This file defines the standing rules for AI coding agents in Dayweave.

## Product

- Dayweave is a personal mobile diary.
- The core flow is mood + one line + optional photo in 10–30 seconds.
- Long-form writing is optional and expands from the quick flow.
- The long-term product may add themes, mood packs, avatar parts, cloud sync,
  calendar/SNS/device connections, selective sharing, and AI assistance.
- Do not implement a future capability unless the current task explicitly includes it.
- `docs/PRODUCT.md` is the canonical product-scope document.

## Current Scope: M3 Timeline

M0 Foundation, M1 Diary Core, and the M2 Photo implementation are complete. M3 adds a
local-calendar monthly grid, visible-month repository queries, photo or Mood markers,
date selection, and a read-only Diary preview.

M3 excludes camera capture, multiple photos, diary detail/edit/delete, tags, schedules,
avatar customization, theme or Mood Pack selection, store/ownership/payments, Supabase,
authentication, cloud sync, social/sharing, push notifications, and AI analysis.

## Stack and Commands

- React Native + Expo SDK 57
- Expo Router
- TypeScript strict mode
- pnpm 11; do not introduce another lockfile

```bash
pnpm install
pnpm dev
pnpm android
pnpm ios
pnpm web
pnpm deps:check
pnpm lint
pnpm typecheck
pnpm build:web
```

Use Expo-compatible package versions. Keep dependency upgrades separate from feature
changes when possible.

## Architecture

- `app/` contains Expo Router route files and navigation composition only.
- Feature screens, models, and business rules belong in `src/features/<feature>`.
- Reusable feature-agnostic UI belongs in `src/shared/components`.
- `shared` must not import a feature module.
- Keep feature-to-feature dependencies explicit and minimal.
- UI must not access SQLite, Supabase, payments, or another infrastructure SDK directly.
- When persistence is introduced, define repository interfaces at the feature/domain
  boundary and implement them in infrastructure code.
- Do not create empty placeholder files merely to preserve a planned directory tree.

Import order:

1. External modules
2. Internal modules through `@/*`
3. Type-only imports using `import type`

## UI and Theme

- Use React Native primitives and functional components.
- Use `AppText`, `AppButton`, `AppCard`, `AppScreen`, and `AppIconButton` before
  duplicating their responsibilities.
- Do not hardcode product colors in routes, feature screens, or shared components.
- Product colors are semantic tokens defined by a theme.
- M0 registers only Sky. Future `warm-paper`, `night`, and `mint` themes must plug into
  the registry without changing feature-screen colors.
- Keep touch targets accessible; icon-only controls require an accessibility label.
- Do not add a UI library without an explicit task-level decision.

## Mood

- Store only semantic Mood IDs: `happy`, `calm`, `neutral`, `sad`, `stressed`.
- Never use emoji, image names, file paths, or pack-specific IDs as the diary mood value.
- A future Mood Pack resolves a semantic Mood ID to its visual representation.
- Timeline markers and previews must reuse the active Mood Pack resolver rather than
  mapping Mood IDs inside Calendar components.

## Timeline

- Generate calendar grids with device-local calendar dates; do not round-trip dates
  through UTC.
- Monthly repository ranges are start-inclusive and end-exclusive.
- Load the visible month once; Calendar cells must not issue repository queries or file
  existence checks.
- Prefer a photo marker, then a Mood visual, then a plain record dot.

## Avatar

- Represent Avatar configuration with part IDs for `body`, `hair`, `top`, `bottom`,
  and optional `accessory`.
- Do not replace the domain structure with one flattened character image.
- Asset registries, rendering, ownership, and customization are later milestones.

## Commerce Readiness

- Keep Catalog, Ownership, and Selection as separate concepts when they are introduced.
- Purchasing an item must not automatically select it.
- Store and payment code is not part of M0 or the diary core.

## TypeScript and Error Handling

- Keep strict mode enabled.
- Do not use `any`, `@ts-ignore`, blanket assertions, or ESLint-disable comments to bypass
  design or type problems.
- Use guard clauses for invalid states and `try/catch` around recoverable async boundaries.
- Do not log diary text, photos, or other private content.

## Quality Gate

After every meaningful code or configuration change, run the applicable commands:

```bash
pnpm version:check
pnpm deps:check
pnpm lint
pnpm test
pnpm typecheck
pnpm build:web
```

Tests become mandatory when testable domain behavior is introduced. Do not add a fake
passing test script before the test runner exists. For UI work, record a screenshot,
video, Expo preview, or an explicit reason why device validation was unavailable.

Before completion, also check:

- `package.json` and `app.json` contain the same valid Semantic Version.
- Four tabs are routable.
- ThemeProvider wraps the router.
- Feature UI contains no direct HEX colors.
- No out-of-scope dependency or feature was added.
- Product or architecture changes are reflected in `docs/`.

## Git and Release Workflow

- One PR should contain one independently reviewable logical change.
- Use short-lived branches prefixed with `codex/` for agent work.
- Normal PRs target `main` and use squash merge.
- A dependent change may temporarily use its unmerged prerequisite branch as a stacked
  PR base. Rebase or retarget it to `main` immediately after the prerequisite merges.
- Never push directly to `main` or `release/*`.
- Every Wednesday at 18:00 KST, `.github/workflows/release-cut.yml` creates
  `release/YYYY-MM-DD-Www` from `main`.
- Release branches accept stabilization fixes only; forward-port or cherry-pick fixes so
  `main` and the active release do not diverge.
- Use Semantic Versioning and keep `package.json` and `app.json` versions identical.
- Do not bump a version for every PR. Choose patch, minor, or major from compatibility and
  the completed release scope documented in `docs/VERSIONING.md`.
- A version release updates `CHANGELOG.md` and `docs/releases/vX.Y.Z.md`. Create its
  `vX.Y.Z` tag only from a CI-passing `main` commit.

See `docs/process/development-and-release.md` for the active process.

## Harness Observation

- Read `docs/harness/observation-protocol.md` before an observed run.
- State scope, exclusions, assumptions, plan, and changed files before implementation.
- Distinguish observed evidence from inference.
- Record commands and results in `docs/harness/runs` using the run-log template.
- Every non-trivial feature, architecture, tooling, or milestone PR must add or update a
  note under `docs/learning`. Explain what changed, why it was needed, alternatives,
  trade-offs, verification steps, and concepts a developer should learn.
- Keep learning notes focused on reusable understanding. Trivial text corrections and
  mechanical maintenance do not require a new long-form guide.
- Promote a lesson into this file, CI, or tests only after it is broadly reusable or a
  repeated failure proves the need.
