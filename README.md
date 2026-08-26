# Academic OS

Academic OS is a personal, local-first academic monitoring dashboard. M0 establishes the application foundation; academic records, calculations, analytics, and advisory features belong to later milestones.

## Technology

- React and TypeScript
- Vite
- pnpm
- Native IndexedDB behind an infrastructure boundary
- Vitest and Playwright
- ESLint and Prettier

## Setup

Install Node.js 20 or newer, then install pnpm:

```bash
corepack enable
pnpm install
```

Copy `.env.example` to `.env` only when local configuration is needed. M0 requires no environment variables.

## Commands

```bash
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm test:e2e
```

Playwright may require browser installation after dependencies are installed:

```bash
pnpm exec playwright install chromium
```

## Structure

```text
src/
  domain/                 Framework-independent academic rules and types
  application/            Use cases and ports
  infrastructure/         Technical implementations
    persistence/          IndexedDB schema and repository implementations
  presentation/           React shell and future UI modules
tests/
  unit/
  integration/
  e2e/
docs/
  adr/                     Architecture decision records
public/                    Static assets
scripts/                   Development scripts
```

The dependency direction is Presentation -> Application -> Domain -> Repository Interfaces -> Infrastructure/Persistence -> IndexedDB. UI code does not access IndexedDB directly, and the domain remains independent of React and browser APIs.

M1 IndexedDB schema version 2 contains stores for student profiles, academic programs, academic years, semesters, subjects, enrollments, and grades. Repository writes validate records and explicit references before saving.

## M0 Scope

The current milestone provides a working application shell, test configuration, quality tooling, and a minimal persistence boundary. It intentionally does not implement academic entities, GPA or credit calculations, analytics, goals, AI, backup/restore, authentication, a backend, or cloud synchronization.
