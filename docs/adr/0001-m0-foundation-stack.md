# ADR 0001: M0 Foundation Stack and Structure

- Status: Accepted
- Date: 2026-08-25

## Context

The project documents recommend React, TypeScript, and Vite but leave package management, testing, formatting, and the exact persistence structure open. The architecture requires a local-first browser application with a clear boundary between presentation, application, domain, repository interfaces, infrastructure, and IndexedDB.

## Decision

M0 uses React with TypeScript and Vite, managed with pnpm. Vitest handles unit and integration tests, Playwright handles end-to-end tests, and ESLint with Prettier provides code quality checks.

Persistence uses a thin native IndexedDB adapter. Academic repositories, schema migrations, and the complete data model remain deferred until the relevant milestone.

The canonical source structure is:

```text
src/domain
src/application
src/infrastructure/persistence
src/presentation
```

Repository ports belong to the application abstraction layer for now. Infrastructure supplies their technical implementations. This resolves the planning documents' `repositories` versus `persistence` naming difference without adding another speculative layer.

## Consequences

The repository can run and test locally without a backend or external service. The initial package versions are implementation choices recorded by the package manifest and lockfile, not prior architectural approvals. State management, routing, UI libraries, deployment, and cloud services remain open decisions.

## Rejected Alternatives

- Dexie was deferred because M0 needs only a narrow persistence boundary.
- A backend or cloud database was rejected because local-first operation is an explicit project constraint.
- Full academic entities and migrations were deferred because the authoritative M0 data model is not yet defined.
