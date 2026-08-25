# Document 03 — Implementation & Development Plan

# Part 1 — Development Strategy

## 1.1 Purpose

This part defines the overall strategy for implementing Academic OS based on the requirements and architecture established in Documents 01 and 02.

The development strategy establishes:

- How implementation should be organized.
- What should be built first.
- How development should progress from foundation to MVP.
- How implementation should remain aligned with the locked architecture.
- How development risk should be managed.
- How AI-assisted development tools should be used.
- How implementation progress should be evaluated.

This document does not replace the PRD or System Architecture document.

Instead:

```text
PRD
 ↓
What Academic OS must provide

Architecture
 ↓
How Academic OS should be structured

Implementation Plan
 ↓
How Academic OS should be built
```

---

## 1.2 Development Principles

Academic OS development follows the following principles.

### DEV-001 — Architecture Before Feature Expansion

Implementation should establish the architectural foundation before adding large numbers of features.

The preferred progression is:

```text
Project Foundation
      ↓
Architecture Foundation
      ↓
Core Domain
      ↓
Persistence
      ↓
Features
      ↓
Analytics
      ↓
Dashboard
      ↓
Optional AI
```

---

### DEV-002 — Build the Smallest Complete Vertical Slice

Development should prefer complete, working feature slices over implementing large numbers of disconnected components.

For example:

```text
Subject Model
    ↓
Repository
    ↓
Service
    ↓
UI
    ↓
Persistence
    ↓
Test
```

A complete vertical slice provides earlier validation than building the entire frontend before implementing the backend logic.

---

### DEV-003 — Domain Logic First

Core academic rules should be implemented independently from the UI.

Examples:

- GPA calculation
- Credit calculation
- Progress calculation
- Requirement evaluation

The UI should consume these results rather than reproduce the calculations.

---

### DEV-004 — Incremental Development

Development should proceed in small, verifiable increments.

Each increment should ideally produce:

```text
Implementation
    ↓
Test
    ↓
Validation
    ↓
Commit
```

This reduces debugging scope and makes progress easier to track.

---

### DEV-005 — Risk-First Development

High-risk components should be implemented and validated earlier.

Priority should generally follow:

```text
Academic Logic
      ↓
Persistence
      ↓
Backup / Restore
      ↓
Analytics
      ↓
Core Features
      ↓
UI Refinement
      ↓
AI
```

This prevents visually polished features from hiding fundamental reliability problems.

---

## 1.3 MVP-First Strategy

R1 is the Academic OS MVP.

Development should therefore prioritize the minimum complete system that provides meaningful academic monitoring.

The MVP should establish:

```text
Academic Data
      ↓
Academic Management
      ↓
Academic Analytics
      ↓
Dashboard
      ↓
Persistence
      ↓
Backup / Restore
```

Additional features should be added only when they do not compromise the MVP foundation.

---

## 1.4 R0 Development Strategy

R0 should establish the technical foundation required for R1.

Typical R0 activities include:

- Repository creation
- Project initialization
- Toolchain configuration
- Dependency setup
- Code quality configuration
- Basic application structure
- Persistence foundation
- Testing foundation
- Development workflow
- Initial UI shell

R0 should not become an opportunity to implement future features.

---

## 1.5 R1 Development Strategy

R1 should produce the first genuinely usable Academic OS.

The implementation should focus on:

1. Academic profile
2. Program information
3. Subjects/courses
4. Semesters
5. Academic records
6. Grades
7. GPA
8. Credit progress
9. Program progress
10. Dashboard
11. Goals where included in the approved MVP
12. Backup and restore
13. Required validation and testing

AI should remain optional and should not block completion of the core MVP.

---

## 1.6 Development Sequence

The preferred development sequence is:

```text
Phase 0 — Project Setup
        ↓
Phase 1 — Architecture Foundation
        ↓
Phase 2 — Domain & Data
        ↓
Phase 3 — Persistence
        ↓
Phase 4 — Core Academic Features
        ↓
Phase 5 — Analytics
        ↓
Phase 6 — Dashboard
        ↓
Phase 7 — Backup / Restore
        ↓
Phase 8 — Testing & Hardening
        ↓
Phase 9 — Optional AI
        ↓
Phase 10 — MVP Release
```

The exact order may be adjusted when implementation evidence indicates that another sequence is safer.

---

## 1.7 Phase 0 — Project Setup

The first implementation phase establishes the development environment.

Expected activities:

```text
Repository
    ↓
Project Initialization
    ↓
Dependencies
    ↓
Tooling
    ↓
Linting / Formatting
    ↓
Testing Framework
    ↓
Build
```

The result should be a project that can be installed, run, tested, and built before major feature development begins.

---

## 1.8 Phase 1 — Architecture Foundation

The architecture should then be represented in the project structure.

This includes:

- Application boundaries
- Domain boundaries
- Feature modules
- Repository interfaces
- Persistence abstraction
- State management foundation
- Shared utilities
- Error handling
- Configuration

The implementation should follow Document 02 rather than inventing a competing structure.

---

## 1.9 Phase 2 — Domain & Data

The next stage establishes the academic domain.

The implementation should define the core entities and rules required by the MVP.

Conceptually:

```text
Academic Profile
      ↓
Program
      ↓
Semester
      ↓
Subject
      ↓
Academic Record
      ↓
Grade
```

The exact data model follows the approved architecture and should be finalized in Document 04.

---

## 1.10 Phase 3 — Persistence

Persistence should be implemented after the core domain structure is sufficiently clear.

The implementation should establish:

```text
Domain
  ↓
Repository
  ↓
Persistence Adapter
  ↓
IndexedDB
```

Persistence should not leak low-level database details throughout the application.

---

## 1.11 Phase 4 — Core Academic Features

Core academic-management features should be implemented before advanced analytics.

Examples include:

- Creating subjects
- Editing subjects
- Managing semesters
- Entering grades
- Updating academic records
- Managing program requirements
- Viewing academic records

Each feature should be implemented as a complete vertical slice where practical.

---

## 1.12 Phase 5 — Analytics

Once sufficient academic data can be managed and persisted, analytics should be implemented.

Priority calculations include:

```text
GPA
Credit Progress
Program Progress
Goal Progress
Academic Trends
```

Analytics should consume domain data rather than directly depending on UI components.

---

## 1.13 Phase 6 — Dashboard

The dashboard should be built on top of validated analytics.

Conceptually:

```text
Academic Data
      ↓
Analytics
      ↓
Dashboard View Models
      ↓
UI Components
```

The dashboard should not become the location where core calculations are implemented.

---

## 1.14 Phase 7 — Backup / Restore

Backup and restore should be implemented before considering the MVP complete.

The workflow should support:

```text
Export / Backup
      ↓
User-Controlled Storage
      ↓
Import / Restore
      ↓
Validation
      ↓
Recovered Academic State
```

Backup and restore must be tested using representative datasets.

---

## 1.15 Phase 8 — Testing & Hardening

After the main MVP functionality exists, testing should expand across the complete system.

Activities include:

- Unit testing
- Integration testing
- Feature testing
- E2E testing
- Backup/restore testing
- Migration testing
- Error handling
- Accessibility checks
- Security checks
- Performance checks

Testing should also continue throughout development rather than being postponed entirely until the end.

---

## 1.16 Phase 9 — Optional AI

AI should be implemented only after the deterministic core is functional.

Preferred sequence:

```text
Core Academic OS
       ↓
Analytics
       ↓
Stable MVP
       ↓
AI Interface
       ↓
Provider Adapter
       ↓
AI Features
```

AI should consume appropriate application data through defined boundaries.

AI should not directly manipulate authoritative academic records without explicit application-level validation.

---

## 1.17 Phase 10 — MVP Release

Before R1 release:

```text
Requirements
    ↓
Implementation
    ↓
Tests
    ↓
Build
    ↓
Deployment
    ↓
Smoke Test
    ↓
R1 MVP
```

The release should satisfy the Definition of Done established later in this document.

---

## 1.18 Feature Development Lifecycle

Each significant feature should generally follow:

```text
Requirement
    ↓
Design Review
    ↓
Domain/Data Changes
    ↓
Implementation
    ↓
Persistence
    ↓
UI
    ↓
Tests
    ↓
Validation
    ↓
Commit
```

The exact sequence may vary depending on the feature.

---

## 1.19 Feature Completion

A feature should not be considered complete merely because the UI exists.

A feature is considered substantially complete when:

- Required domain behavior exists.
- Required persistence exists.
- UI interaction works.
- Validation exists.
- Relevant tests pass.
- Errors are handled.
- Documentation is updated where necessary.

---

## 1.20 Vertical Slice Strategy

Where practical, implementation should create vertical slices.

Example:

```text
"Add Subject"

UI Form
   ↓
Feature Controller / Hook
   ↓
Domain Validation
   ↓
Subject Service
   ↓
Subject Repository
   ↓
IndexedDB
   ↓
Test
```

This provides an end-to-end working feature early.

---

## 1.21 Horizontal Infrastructure Strategy

Some infrastructure must necessarily be developed before feature slices.

Examples:

- Project configuration
- Persistence initialization
- Routing
- State management foundation
- Testing framework
- Shared UI components

These should remain minimal and should support actual features rather than becoming large standalone projects.

---

## 1.22 Definition of Done

A development task should generally satisfy:

```text
[ ] Requirement understood
[ ] Architecture respected
[ ] Implementation complete
[ ] Validation implemented
[ ] Relevant tests added
[ ] Tests passing
[ ] Error cases considered
[ ] UI verified where applicable
[ ] Documentation updated where necessary
[ ] Code reviewed
[ ] Commit created
```

Not every small task requires every checkbox, but feature-level work should satisfy the applicable items.

---

## 1.23 Development Validation

Development should use short feedback loops.

Preferred cycle:

```text
Plan
 ↓
Implement
 ↓
Run Checks
 ↓
Test
 ↓
Review
 ↓
Commit
```

Large batches of untested changes should be avoided.

---

## 1.24 Git Strategy

Git should be used throughout development.

The recommended lightweight workflow is:

```text
main
 ↓
Feature Branch
 ↓
Implementation
 ↓
Testing
 ↓
Review
 ↓
Merge
```

For a personal project, the workflow may remain lightweight.

---

## 1.25 Commit Strategy

Commits should represent coherent changes.

Examples:

```text
feat: add semester management
feat: implement GPA calculation
fix: correct credit progress calculation
test: add GPA edge cases
refactor: isolate analytics service
docs: update implementation plan
```

Commit conventions may be adapted during development.

---

## 1.26 AI-Assisted Development Strategy

AI-assisted development tools may be used to improve development speed.

However:

> AI-generated code is not automatically considered correct.

The developer remains responsible for:

- Understanding generated code
- Reviewing architecture
- Validating behavior
- Running tests
- Checking security
- Checking privacy
- Confirming dependencies

---

## 1.27 Copilot Usage

GitHub Copilot may be used for:

- Code completion
- Boilerplate generation
- Refactoring suggestions
- Test generation
- Documentation assistance
- Debugging assistance
- Code explanation

Copilot should operate within the architecture defined by Document 02.

It should not independently redefine architectural boundaries.

---

## 1.28 AI Code Review Rule

Generated code should follow:

```text
AI Suggestion
      ↓
Developer Review
      ↓
Tests
      ↓
Architecture Check
      ↓
Acceptance
```

The generated code should not be merged solely because it compiles.

---

## 1.29 Google AI Studio Usage

Google AI Studio may be used as a UI-development aid where appropriate.

Potential uses include:

- UI exploration
- Layout generation
- Component prototypes
- Visual design iteration
- UI implementation assistance

Generated UI should subsequently be integrated into the actual Academic OS architecture.

AI-generated UI should not bypass:

- Application state boundaries
- Domain logic
- Persistence architecture
- Accessibility requirements
- Security requirements

---

## 1.30 AI Tool Boundary

Development AI tools and runtime AI features are separate concepts.

```text
Development AI
    ↓
Helps build Academic OS

Runtime AI
    ↓
Optional feature inside Academic OS
```

Using Copilot or Google AI Studio during development does not imply that those services become runtime dependencies.

---

## 1.31 Dependency Discipline

New dependencies should be introduced only when justified.

Before adding a dependency, consider:

- Is it required?
- Does the architecture already provide this capability?
- Is it maintained?
- Does it increase bundle size?
- Does it introduce security risk?
- Does it create vendor lock-in?
- Can the functionality reasonably be implemented without it?

---

## 1.32 Development Environment Consistency

The project should document:

- Runtime version
- Package manager
- Required tools
- Development commands
- Build commands
- Test commands
- Environment variables

This information should eventually be included in the project documentation.

---

## 1.33 Local Development Commands

The project should provide predictable commands conceptually equivalent to:

```text
install
development server
test
lint
type check
build
```

The exact command names depend on the selected technology stack.

---

## 1.34 Environment Separation

Development should distinguish between:

```text
Development
Testing
Production
```

Production data should not be casually used during development testing.

---

## 1.35 Progress Tracking

Implementation progress should be tracked against the approved MVP scope.

Recommended status model:

```text
Not Started
    ↓
Planned
    ↓
In Progress
    ↓
Testing
    ↓
Review
    ↓
Done
```

A feature should not be marked Done merely because its implementation exists.

---

## 1.36 Milestone Strategy

Development milestones should represent meaningful project states.

Example:

```text
M0 — Project Initialized
M1 — Architecture Foundation Working
M2 — Academic Data Working
M3 — Core Academic Management Working
M4 — Analytics Working
M5 — Dashboard Working
M6 — Backup / Restore Working
M7 — MVP Hardened
M8 — R1 Released
```

The exact milestone dates should be defined separately.

---

## 1.37 Risk Management During Development

Development risks should be monitored continuously.

Important risks include:

- Architecture drift
- Scope creep
- Data corruption
- Incorrect calculations
- Excessive AI-generated code
- Dependency growth
- UI implementation diverging from architecture
- Insufficient testing
- Time overrun

When a risk becomes significant, development priority should be adjusted accordingly.

---

## 1.38 Architecture Drift Prevention

If implementation begins to diverge from Document 02:

```text
Identify Divergence
       ↓
Determine Reason
       ↓
Evaluate Impact
       ↓
Update Architecture OR Implementation
       ↓
Document Decision
```

The implementation should not silently diverge from the architecture.

---

## 1.39 Scope Control

A feature should be questioned before implementation if:

- It is not in the PRD.
- It is not required for R1.
- It significantly increases complexity.
- It introduces infrastructure not justified by requirements.
- It delays core MVP functionality.

Potential future features should be placed into the appropriate future-release backlog instead.

---

## 1.40 Development Documentation

The project should maintain appropriate development documentation.

At minimum:

- README
- Setup instructions
- Development commands
- Architecture reference
- Environment configuration
- Testing instructions
- Release instructions

Additional documentation should be added when complexity justifies it.

---

## 1.41 Implementation Traceability

Implementation should remain traceable to:

```text
PRD Requirement
      ↓
Architecture Part
      ↓
Implementation Task
      ↓
Test
      ↓
Release
```

This allows the developer to determine why a particular implementation exists.

---

## 1.42 Change Management

Major implementation changes should be reviewed before being merged.

A major change may include:

- Changing persistence technology
- Changing architecture boundaries
- Adding backend infrastructure
- Changing the AI architecture
- Changing data schema significantly
- Introducing synchronization
- Changing the MVP scope

Such changes should trigger review of the affected locked documents.

---

## 1.43 Development Completion

Document 03 implementation planning is considered successful when:

```text
Architecture
      ↓
Implementation Tasks
      ↓
Development Workflow
      ↓
Testing
      ↓
Release
```

can be followed without requiring major architectural decisions that were already resolved in Documents 01 and 02.

---

## 1.44 Part 1 Rules

The following rules apply:

1. Development follows the locked PRD and architecture.
2. R1 is the MVP.
3. High-risk functionality is implemented early.
4. Core academic logic is developed independently from UI.
5. Vertical slices are preferred where practical.
6. Testing is performed throughout development.
7. AI-generated code must be reviewed by the developer.
8. Development AI tools are not automatically runtime dependencies.
9. New dependencies require justification.
10. Architecture drift requires explicit review.
11. Scope changes require requirement review.
12. Backup and restore remain core implementation priorities.
13. AI remains optional until the deterministic core is stable.
14. Development complexity should remain proportional to project scope.
15. Feature completion requires validation, not merely implementation.

---

## 1.45 Acceptance Criteria

Part 1 is considered complete when:

- Development principles are defined.
- R0 strategy is defined.
- R1/MVP strategy is defined.
- Development sequence is defined.
- Feature lifecycle is defined.
- Vertical-slice strategy is defined.
- Definition of Done is defined.
- Git workflow is defined.
- AI-assisted development strategy is defined.
- Copilot usage boundaries are defined.
- Google AI Studio usage boundaries are defined.
- Dependency discipline is defined.
- Environment consistency is defined.
- Progress tracking is defined.
- Milestone strategy is defined.
- Risk management is defined.
- Architecture drift prevention is defined.
- Scope control is defined.
- Implementation traceability is defined.
- Change management is defined. 

# Document 03 — Implementation & Development Plan

# Part 2 — Technology & Tooling

## 2.1 Purpose

This part defines the technologies, development tools, and supporting tooling intended for Academic OS implementation.

The purpose is to:

- Establish a consistent development environment.
- Translate the approved architecture into practical technologies.
- Reduce unnecessary technology changes during implementation.
- Identify development tools that support productivity.
- Define boundaries for AI-assisted development.
- Keep the technology stack appropriate for a personal academic dashboard.

Technology selection should remain consistent with the principles established in Documents 01 and 02.

---

## 2.2 Technology Selection Principles

Technology choices should follow these principles:

1. Prefer mature and well-supported technologies.
2. Prefer technologies appropriate for a personal web application.
3. Minimize unnecessary dependencies.
4. Prefer local-first capabilities where practical.
5. Avoid infrastructure that is not required by R1.
6. Prefer technologies with strong developer tooling.
7. Prefer technologies that are easy to maintain independently.
8. Avoid unnecessary vendor lock-in.
9. Consider privacy and data exposure.
10. Prioritize reliability over novelty.

---

## 2.3 Recommended Technology Stack

The initial Academic OS stack should follow this general structure:

```text
Frontend
    ↓
React
    ↓
TypeScript
    ↓
Vite
    ↓
Browser Runtime
    ↓
IndexedDB
```

Supporting development tools:

```text
Git
GitHub
VS Code / Compatible IDE
GitHub Copilot
Google AI Studio
Testing Framework
Linting / Formatting
```

The exact package versions should be recorded during project initialization rather than permanently embedded in this planning document.

---

## 2.4 Frontend Framework

### React

React should be used as the primary frontend framework.

Reasons:

- Component-based development.
- Strong ecosystem.
- Suitable for dashboard applications.
- Good support for reusable UI components.
- Strong TypeScript integration.
- Compatible with the modular architecture defined in Document 02.

React should primarily handle presentation and interaction.

Core academic logic should remain outside UI components.

---

## 2.5 Programming Language

### TypeScript

TypeScript should be used as the primary programming language.

TypeScript should cover:

- UI components
- Application services
- Domain logic
- Analytics
- Repository interfaces
- Persistence adapters
- Validation
- Testing utilities

Type safety should be used to reduce errors in academic data structures and calculations.

---

## 2.6 Build Tool

### Vite

Vite should be used as the initial build and development tool.

Expected responsibilities include:

- Development server
- Module bundling
- Production build
- Environment configuration
- Development-time integration

The build configuration should remain as simple as practical.

---

## 2.7 Runtime Environment

The MVP should primarily execute in the browser.

Conceptually:

```text
Operating System
      ↓
Web Browser
      ↓
Academic OS
      ↓
Local Persistence
```

A backend runtime is not required for the initial MVP unless a later requirement introduces a justified need.

---

## 2.8 Persistence Technology

### IndexedDB

IndexedDB should serve as the primary structured local persistence mechanism.

The persistence architecture should follow:

```text
Domain / Application
        ↓
Repository
        ↓
Persistence Adapter
        ↓
IndexedDB
```

UI components should not directly manipulate IndexedDB.

---

## 2.9 Local Storage

Local Storage may be used for small non-critical application preferences where appropriate.

Examples may include:

- UI preferences
- Selected view
- Lightweight configuration
- Non-critical session preferences

Local Storage should not replace IndexedDB for academic records.

---

## 2.10 State Management

State management should follow the architecture established in Document 02.

The selected state-management technology should be lightweight and should distinguish between:

```text
UI State
Application State
Persistent Domain Data
Derived Analytics
```

The project should avoid introducing a large state-management framework if the actual application complexity does not require it.

---

## 2.11 Routing

A client-side routing solution may be used for major application views.

Routing should support logical navigation such as:

```text
Dashboard
Academic Records
Subjects
Semesters
Goals
Settings
Backup / Restore
```

Routes should represent application features rather than duplicate domain logic.

---

## 2.12 UI Component Strategy

The UI should use reusable components.

The project should distinguish between:

```text
Shared UI Components
        ↓
Feature Components
        ↓
Page / View Components
```

Shared components should be introduced when reuse or consistency justifies them.

The project should avoid creating abstractions solely for theoretical reuse.

---

## 2.13 Styling Strategy

The styling solution should support:

- Responsive design
- Consistent spacing
- Typography
- Accessible contrast
- Reusable design tokens
- Light/dark appearance where required
- Dashboard-oriented layouts

The exact styling library may be finalized during implementation after evaluating the UI requirements.

---

## 2.14 UI Prototyping Tool

### Google AI Studio

Google AI Studio may be used during UI exploration and prototyping.

Potential workflow:

```text
UI Requirement
      ↓
Prototype / Visual Exploration
      ↓
Review
      ↓
Adapt to Academic OS Architecture
      ↓
Production Component
```

Generated UI should be treated as a starting point rather than automatically accepted production code.

---

## 2.15 AI-Assisted Programming

### GitHub Copilot

GitHub Copilot may be used throughout implementation.

Appropriate uses include:

- Boilerplate
- Repetitive code
- Unit test generation
- Refactoring suggestions
- Code explanation
- Documentation
- Debugging assistance

Copilot output must be reviewed before acceptance.

---

## 2.16 AI Development Safety

AI-generated code should be treated as untrusted until reviewed.

The workflow is:

```text
Prompt
  ↓
AI Output
  ↓
Developer Review
  ↓
Type Check / Lint
  ↓
Tests
  ↓
Architecture Review
  ↓
Accept
```

AI-generated code should not be merged solely because it compiles.

---

## 2.17 AI Runtime Independence

Development tools should not automatically become runtime dependencies.

For example:

```text
GitHub Copilot
      ↓
Development Tool

Google AI Studio
      ↓
Development / Prototyping Tool
```

These tools are separate from:

```text
Academic OS Runtime AI
```

Runtime AI should continue to follow the AI Architecture defined in Document 02.

---

## 2.18 Testing Technology

The project should use a JavaScript/TypeScript-compatible testing stack supporting multiple levels of testing.

The testing environment should support:

```text
Unit Tests
Integration Tests
Component Tests
End-to-End Tests
```

The exact testing libraries should be finalized before implementation begins.

The selected tools should prioritize:

- TypeScript support
- Fast execution
- Browser compatibility
- Good developer experience
- Maintainability

---

## 2.19 Code Quality Tools

The project should use automated code-quality tooling.

At minimum:

```text
Linting
Formatting
Type Checking
Build Validation
```

These checks should be executable locally and, where practical, through CI.

---

## 2.20 Package Management

The project should use one primary package manager consistently.

The package manager should provide:

- Dependency installation
- Lockfile management
- Scripts
- Reproducible development environments

The selected package manager should not be changed casually after project initialization.

---

## 2.21 Version Control

### Git

Git is required for source-code version control.

Git should track:

- Application source
- Tests
- Configuration
- Documentation
- Architecture-related implementation changes

Generated or local-only files should be excluded appropriately.

---

## 2.22 Remote Repository

### GitHub

GitHub may serve as the primary remote repository.

Potential uses include:

- Source-code hosting
- Version history
- Issue tracking
- Pull requests
- CI workflows
- Release management

The repository should remain private unless there is an intentional decision to make the project public.

---

## 2.23 Continuous Integration

CI should initially remain lightweight.

A basic pipeline may perform:

```text
Install Dependencies
       ↓
Type Check
       ↓
Lint
       ↓
Tests
       ↓
Build
```

Additional checks may be introduced when justified.

---

## 2.24 Deployment Technology

The MVP should use a simple static/web deployment model where possible.

The architecture should avoid introducing a dedicated backend server merely for deployment.

The deployment provider can be selected based on:

- Reliability
- Cost
- Static hosting support
- Build integration
- Ease of rollback
- Privacy
- Developer experience

The exact provider should be finalized during deployment planning.

---

## 2.25 Environment Configuration

Environment-specific configuration should be separated from source code.

Sensitive values must not be committed to Git.

Example:

```text
Development Environment
Production Environment
```

Environment variables should be used when runtime configuration requires them.

---

## 2.26 Secrets Management

Secrets must not be hard-coded into source code.

Examples include:

- API keys
- Authentication credentials
- Provider secrets
- Deployment tokens

If runtime AI providers require credentials, those credentials must be handled through appropriate environment configuration.

---

## 2.27 Dependency Management

Dependencies should be evaluated before installation.

Consider:

```text
Need
 ↓
Maintenance
 ↓
Security
 ↓
Bundle Size
 ↓
License
 ↓
Vendor Lock-in
```

Dependencies that provide little value should be avoided.

---

## 2.28 Technology Lock-In

The architecture should avoid unnecessary lock-in.

Examples:

```text
Persistence
    ↓
Repository abstraction
    ↓
IndexedDB implementation
```

and:

```text
AI
    ↓
Provider interface
    ↓
Provider adapter
```

This allows technology changes without rewriting the entire application.

---

## 2.29 Browser Compatibility

The MVP should target modern browsers that provide the APIs required by Academic OS.

The project should document supported browsers after implementation testing.

Browser-specific behavior should be tested where it affects:

- IndexedDB
- File APIs
- Storage
- Downloads
- Import / export
- UI rendering

---

## 2.30 Developer Environment

The recommended development environment should include:

```text
Operating System
Windows / macOS / Linux

Editor / IDE
VS Code or compatible IDE

Runtime
Node.js

Language
TypeScript

Framework
React

Build Tool
Vite

Version Control
Git

Remote Repository
GitHub
```

Exact versions should be captured during project initialization.

---

## 2.31 Development Commands

The project should expose consistent scripts for common operations.

Conceptually:

```text
dev
build
preview
test
lint
typecheck
format
```

The exact command names may be adapted to the selected tooling.

---

## 2.32 Tooling Documentation

The project README should document:

- Required runtime
- Package manager
- Installation
- Development command
- Test command
- Build command
- Lint command
- Type-check command
- Environment configuration
- Deployment instructions

This allows the project to be reproduced without relying on memory.

---

## 2.33 Technology Change Policy

Technology changes should be evaluated when:

- A dependency becomes unsupported.
- A significant security issue appears.
- The selected technology blocks an important requirement.
- A substantially better option provides meaningful benefits.
- Maintenance becomes impractical.

Technology should not be changed solely because another tool is newer or more popular.

---

## 2.34 Technology Selection Summary

The initial technology direction is:

| Area | Initial Direction |
|---|---|
| Framework | React |
| Language | TypeScript |
| Build Tool | Vite |
| Runtime | Browser |
| Primary Persistence | IndexedDB |
| Lightweight Preferences | Local Storage |
| Version Control | Git |
| Remote Repository | GitHub |
| IDE | VS Code / Compatible IDE |
| Programming Assistance | GitHub Copilot |
| UI Prototyping | Google AI Studio |
| Testing | TypeScript-compatible testing stack |
| Quality | Lint + Format + Type Check |
| Deployment | Static/web deployment |
| Backend | Not required for R1 |
| Runtime AI | Optional |

---

## 2.35 Part 2 Rules

The following rules apply:

1. React is the initial frontend framework.
2. TypeScript is the primary implementation language.
3. Vite is the initial build tool.
4. The MVP is browser-first.
5. IndexedDB is the primary structured persistence mechanism.
6. Local Storage is limited to lightweight non-critical preferences.
7. UI components should not directly manipulate persistence.
8. Git is required for version control.
9. GitHub may serve as the remote repository.
10. GitHub Copilot may assist development but does not replace developer review.
11. Google AI Studio may assist UI prototyping and development.
12. Development AI tools are separate from runtime AI.
13. Runtime AI remains optional.
14. Dependencies require justification.
15. Secrets must never be hard-coded.
16. Tooling should remain lightweight.
17. Technology changes require justification.
18. Exact package versions should be recorded during implementation.
19. R1 should not require a backend unless a requirement justifies it.
20. Technology choices should remain consistent with the locked architecture.

---

## 2.36 Acceptance Criteria

Part 2 is considered complete when:

- The initial frontend technology is defined.
- The implementation language is defined.
- The build tool is defined.
- Browser-first execution is defined.
- Persistence technology is defined.
- Local Storage usage boundaries are defined.
- State-management principles are defined.
- UI tooling is defined.
- AI-assisted development tools are defined.
- Testing tooling requirements are defined.
- Code-quality requirements are defined.
- Version-control tooling is defined.
- Remote repository strategy is defined.
- CI expectations are defined.
- Deployment direction is defined.
- Environment configuration is defined.
- Secrets management is defined.
- Dependency management principles are defined.
- Browser compatibility requirements are defined.
- Technology change policy is defined.


# Part 3 — Project Repository Structure

## 3.1 Purpose

This part defines the recommended repository and source-code structure for Academic OS.

The repository structure should:

- Reflect the architecture defined in Document 02.
- Separate domain logic from presentation.
- Separate persistence from business logic.
- Organize functionality into feature modules.
- Provide clear locations for tests.
- Support incremental development.
- Remain understandable for a single developer.
- Avoid unnecessary architectural complexity.

The repository structure should support the following principle:

```text
Architecture
    ↓
Repository Structure
    ↓
Implementation
```

The folder structure should reinforce architectural boundaries rather than merely organize files by convenience.

---

## 3.2 Repository Root

The repository should contain a structure conceptually similar to:

```text
academic-os/
├── src/
├── public/
├── tests/
├── docs/
├── scripts/
├── .github/
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.*
└── configuration files
```

The exact files depend on the selected tooling.

---

## 3.3 Source Directory

The `src/` directory contains the application source code.

The recommended high-level structure is:

```text
src/
├── app/
├── domain/
├── features/
├── analytics/
├── persistence/
├── state/
├── components/
├── hooks/
├── lib/
├── styles/
├── types/
└── main.*
```

Not every directory must contain many files.

Directories should exist when they represent meaningful architectural boundaries.

---

## 3.4 Application Layer

The `app/` directory contains application-level configuration and composition.

Conceptually:

```text
src/app/
├── routes/
├── providers/
├── config/
├── layouts/
└── app.*
```

Responsibilities may include:

- Application initialization
- Routing
- Global providers
- Application composition
- Environment configuration
- Global layouts

The application layer should compose the system rather than contain core academic rules.

---

## 3.5 Domain Layer

The `domain/` directory contains core academic concepts and rules.

Conceptually:

```text
src/domain/
├── academic/
├── program/
├── semester/
├── subject/
├── grade/
├── goal/
└── shared/
```

Responsibilities include:

- Domain entities
- Value objects
- Domain validation
- Academic rules
- Domain-level types
- Domain-specific constants

The domain layer should remain independent from UI components.

---

## 3.6 Domain Independence

The domain should not directly depend on:

- React components
- Browser UI APIs
- IndexedDB implementation details
- AI providers
- Specific visualization libraries

This supports deterministic and reusable academic logic.

---

## 3.7 Feature Modules

The `features/` directory organizes user-facing capabilities.

Conceptually:

```text
src/features/
├── dashboard/
├── academic-records/
├── subjects/
├── semesters/
├── program/
├── goals/
├── backup/
├── settings/
└── ...
```

A feature module may contain:

```text
feature/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
└── index.*
```

Only the directories actually required by the feature should be created.

---

## 3.8 Feature Module Principle

A feature module should contain functionality that belongs together from the user's perspective.

For example:

```text
subjects/
    ↓
Subject UI
Subject interactions
Subject-specific validation
Subject-specific feature logic
```

Feature modules should use domain and application services rather than directly bypassing architectural boundaries.

---

## 3.9 Dashboard Module

The dashboard should be treated as a feature rather than the location of all application logic.

Conceptually:

```text
dashboard/
├── components/
├── hooks/
├── view-models/
└── ...
```

The dashboard consumes analytics results.

It should not independently calculate GPA or academic progress.

---

## 3.10 Analytics Layer

The `analytics/` directory contains centralized academic calculations and derived metrics.

Conceptually:

```text
src/analytics/
├── gpa/
├── credits/
├── progress/
├── requirements/
├── goals/
├── trends/
└── shared/
```

Responsibilities include:

- GPA calculations
- Credit calculations
- Program progress
- Requirement progress
- Goal-related metrics
- Academic trends

Analytics should operate on authoritative academic data.

---

## 3.11 Analytics Independence

Analytics should not depend directly on:

- Dashboard components
- Page layouts
- Chart libraries
- AI providers

Visualization should consume analytics results rather than becoming part of the calculation layer.

---

## 3.12 Persistence Layer

The `persistence/` directory contains persistence abstractions and implementations.

Conceptually:

```text
src/persistence/
├── repositories/
├── indexeddb/
├── migrations/
├── serializers/
├── backup/
└── validation/
```

Responsibilities include:

- Repository implementations
- IndexedDB access
- Database initialization
- Schema migrations
- Serialization
- Backup/export
- Restore/import
- Persistence validation

---

## 3.13 Repository Boundary

The preferred dependency direction is:

```text
Domain
  ↑
Application / Services
  ↑
Repository Interface
  ↑
Persistence Implementation
```

The exact dependency direction may be represented differently by the chosen implementation pattern, but the key principle remains:

> Domain and application logic should not be tightly coupled to IndexedDB implementation details.

---

## 3.14 State Management

The `state/` directory contains application state infrastructure.

Conceptually:

```text
src/state/
├── stores/
├── selectors/
├── actions/
└── ...
```

State should distinguish between:

```text
UI State
Application State
Persistent Data
Derived Analytics
```

Persistent academic data should remain authoritative in the persistence/domain flow rather than becoming duplicated arbitrarily across UI state.

---

## 3.15 Shared UI Components

The `components/` directory contains reusable UI components.

Conceptually:

```text
src/components/
├── ui/
├── forms/
├── feedback/
├── navigation/
└── layout/
```

Examples:

- Button
- Dialog
- Input
- Select
- Table
- Card
- Modal
- Toast
- Navigation components

Shared components should remain presentation-oriented.

---

## 3.16 Shared Hooks

The `hooks/` directory may contain reusable application or UI hooks that do not belong to one specific feature.

Feature-specific hooks should remain inside their feature module.

Example:

```text
src/hooks/
├── use-media-query.*
├── use-debounce.*
└── ...
```

while:

```text
src/features/subjects/hooks/
```

contains subject-specific hooks.

---

## 3.17 Shared Libraries

The `lib/` directory contains small reusable utilities or infrastructure helpers.

Examples may include:

- Date utilities
- Formatting utilities
- Browser helpers
- File handling
- Error helpers

Business rules should not be placed here merely because they are "utility functions."

---

## 3.18 Types

The `types/` directory may contain shared technical types that do not naturally belong to a specific domain or feature.

Domain-specific types should preferably remain in the domain layer.

This prevents the `types/` directory from becoming a dumping ground for all application models.

---

## 3.19 AI Module

AI functionality should have a clear boundary.

Conceptually:

```text
src/ai/
├── providers/
├── adapters/
├── prompts/
├── services/
├── schemas/
└── ...
```

Responsibilities may include:

- AI provider interfaces
- Provider adapters
- Prompt construction
- Response validation
- AI-specific services
- AI configuration

AI code should not be spread throughout unrelated features.

---

## 3.20 AI Boundary

The preferred structure is:

```text
Feature
   ↓
AI Service
   ↓
Provider Interface
   ↓
Provider Adapter
   ↓
External AI Provider
```

This preserves provider independence.

---

## 3.21 AI and Academic Authority

The AI module must not become the authoritative source of academic calculations.

For example:

```text
GPA
 ↓
Analytics Service
 ↓
Authoritative Result

AI
 ↓
Optional Explanation
```

not:

```text
GPA
 ↓
AI
 ↓
Result
```

---

## 3.22 Styling

The `styles/` directory contains global styling and design-system-related resources.

Conceptually:

```text
src/styles/
├── globals.*
├── tokens.*
└── ...
```

Feature-specific styling may remain near feature components when appropriate.

The exact styling organization depends on the selected styling solution.

---

## 3.23 Static Assets

The `public/` directory should contain static assets that need to be served directly.

Examples may include:

- Icons
- Static images
- Manifest files
- Public metadata

Assets imported directly by components may instead reside under `src/assets/` if the build system supports that pattern.

---

## 3.24 Tests

Testing should reflect the architecture.

A possible structure is:

```text
tests/
├── unit/
├── integration/
├── e2e/
├── fixtures/
└── helpers/
```

Alternatively, feature-level tests may live alongside source files.

The project may use a hybrid strategy if it provides better maintainability.

---

## 3.25 Test Placement Principle

Tests should be located where developers can easily identify what they validate.

For example:

```text
src/analytics/gpa/
├── gpa.*
└── gpa.test.*
```

for tightly coupled unit tests.

Larger integration and E2E tests may remain in:

```text
tests/
```

The project should avoid duplicating the same test strategy in multiple locations without a reason.

---

## 3.26 Test Fixtures

Test fixtures should provide predictable datasets.

Examples:

```text
tests/fixtures/
├── academic-records.*
├── semesters.*
├── grades.*
└── backup-data.*
```

Fixtures should include:

- Normal cases
- Edge cases
- Invalid cases
- Empty datasets
- Representative academic scenarios

---

## 3.27 Documentation Directory

The `docs/` directory may contain project documentation that belongs with the repository.

Conceptually:

```text
docs/
├── architecture/
├── development/
├── testing/
├── deployment/
└── decisions/
```

The locked planning documents may remain maintained separately depending on the project's documentation workflow.

---

## 3.28 Architecture Decision Records

ADRs should have a dedicated location.

Recommended:

```text
docs/decisions/
├── ADR-001-*.md
├── ADR-002-*.md
└── ...
```

Each ADR should document an important architectural decision.

---

## 3.29 Scripts

The `scripts/` directory may contain development or maintenance scripts.

Examples:

- Data generation
- Development utilities
- Migration helpers
- Test-data preparation
- Release helpers

Scripts should remain purposeful and documented.

---

## 3.30 GitHub Configuration

The `.github/` directory may contain:

```text
.github/
├── workflows/
├── ISSUE_TEMPLATE/
└── ...
```

CI workflows may perform:

```text
Install
 ↓
Lint
 ↓
Type Check
 ↓
Test
 ↓
Build
```

The CI configuration should remain lightweight during R1.

---

## 3.31 Configuration Files

Repository-level configuration files should remain at the project root when required by tooling.

Examples may include:

```text
package.json
tsconfig.json
vite.config.*
eslint.config.*
prettier.config.*
.gitignore
```

Exact files depend on the selected tools.

---

## 3.32 Dependency Direction

The repository should maintain clear dependency boundaries.

A simplified model is:

```text
UI
 ↓
Features
 ↓
Application / Domain
 ↓
Repositories
 ↓
Persistence
```

Supporting systems such as analytics and AI should interact through defined interfaces.

The exact graph may vary by implementation, but circular dependencies should be avoided.

---

## 3.33 Avoiding Circular Dependencies

The following should be avoided:

```text
Feature A
   ↓
Feature B
   ↓
Feature A
```

or:

```text
Domain
   ↓
UI
   ↓
Domain
```

Shared behavior should be moved to an appropriate lower-level abstraction when necessary.

---

## 3.34 Public Module Interfaces

Feature and infrastructure modules should expose clear public interfaces.

For example:

```text
features/subjects/index.*
```

may expose the supported subject functionality without requiring other modules to know its internal file structure.

This reduces coupling between modules.

---

## 3.35 Import Boundaries

Code should preferably import from public module boundaries rather than deeply reaching into another module's internal files.

Prefer:

```text
features/subjects
```

over:

```text
features/subjects/components/internal/subject-form
```

when a public module interface is available.

---

## 3.36 Naming Conventions

Naming should be consistent throughout the repository.

Recommended principles:

- Use descriptive names.
- Prefer domain terminology from the PRD.
- Avoid unexplained abbreviations.
- Use consistent singular/plural conventions.
- Keep file names predictable.
- Keep feature names aligned with user-facing concepts.

---

## 3.37 Domain Terminology

The codebase should use terminology consistent with Academic OS documentation.

For example:

```text
Semester
Subject
Grade
Credit
Program
Requirement
Goal
Academic Record
```

Alternative terminology should not be introduced casually.

---

## 3.38 Configuration vs Business Logic

Configuration should remain separate from business logic.

For example:

```text
Configuration
 ↓
Environment / App Settings
```

while:

```text
GPA Calculation
 ↓
Domain / Analytics
```

Business rules should not depend on environment-specific configuration unless explicitly required.

---

## 3.39 Error Handling

Error handling should have a predictable location and strategy.

Errors should be categorized where useful:

```text
Domain Errors
Persistence Errors
Validation Errors
External Service Errors
UI Errors
```

The exact implementation may vary.

Errors should not be silently swallowed.

---

## 3.40 Validation

Validation should occur at appropriate boundaries.

For example:

```text
User Input
   ↓
Input Validation
   ↓
Domain Validation
   ↓
Persistence
```

Imported backup data should receive additional validation before being accepted.

---

## 3.41 Backup Module Structure

Backup functionality should remain separated from ordinary persistence operations.

Conceptually:

```text
persistence/
├── backup/
│   ├── export
│   ├── import
│   ├── validation
│   └── versioning
```

Backup data should have a defined format and version strategy.

---

## 3.42 Migration Structure

Persistence migrations should be isolated.

Conceptually:

```text
persistence/migrations/
├── migration-001.*
├── migration-002.*
└── ...
```

Migration logic should be deterministic and testable.

---

## 3.43 Analytics Output

Analytics modules should return structured results rather than UI-specific markup.

For example:

```text
Analytics
    ↓
Structured Result
    ↓
Dashboard
    ↓
Chart / Card / Table
```

This allows the same analytics to be used by different views.

---

## 3.44 Feature Independence

Feature modules should be as independently understandable as practical.

A developer working on:

```text
features/subjects/
```

should not need to understand the entire application to modify basic subject-management behavior.

This improves maintainability.

---

## 3.45 Repository Structure and MVP

The repository should not contain empty structures for every possible future feature.

Prefer:

```text
Build what R1 needs
        ↓
Add structure when required
```

rather than:

```text
Create 50 folders
        ↓
Implement 10% of them
```

The repository should grow with the application.

---

## 3.46 Repository Structure and Future Features

Future functionality may receive a module when implementation begins.

For example:

```text
features/
├── predictive-analytics/
```

should not necessarily exist during R1 if predictive analytics is not implemented.

Architecture can define extension points without requiring empty directories.

---

## 3.47 Repository Structure and AI Development

AI coding tools should be provided with relevant repository context when generating code.

Prompts should reference:

- Relevant architecture
- Feature location
- Existing interfaces
- Coding conventions
- Testing requirements

AI should not be asked to redesign the entire repository casually.

---

## 3.48 Repository Structure Review

Before adding a new file, the developer should ask:

```text
What responsibility does this file have?
        ↓
Which architectural layer owns it?
        ↓
Is it feature-specific?
        ↓
Is it shared?
        ↓
Does an existing module already provide this capability?
```

This helps prevent structural duplication.

---

## 3.49 Recommended Initial Structure

A practical initial repository may therefore look like:

```text
academic-os/
│
├── src/
│   ├── app/
│   ├── domain/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── academic-records/
│   │   ├── subjects/
│   │   ├── semesters/
│   │   ├── program/
│   │   ├── goals/
│   │   ├── backup/
│   │   └── settings/
│   ├── analytics/
│   ├── persistence/
│   ├── state/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   ├── types/
│   └── main.*
│
├── tests/
│   ├── integration/
│   ├── e2e/
│   ├── fixtures/
│   └── helpers/
│
├── docs/
│   ├── decisions/
│   ├── development/
│   ├── testing/
│   └── deployment/
│
├── scripts/
│
├── public/
│
├── .github/
│   └── workflows/
│
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.*
└── .gitignore
```

This structure is a starting baseline rather than an immutable requirement.

---

## 3.50 Repository Structure Rules

The following rules apply:

1. Repository structure should reflect the approved architecture.
2. Domain logic must remain independent from UI implementation.
3. Persistence implementation must remain behind defined boundaries.
4. Feature modules should organize user-facing functionality.
5. Analytics should remain independent from presentation.
6. AI functionality should remain behind a clear boundary.
7. Shared components should remain presentation-oriented.
8. Shared utilities should not become a dumping ground for business logic.
9. Tests should be organized according to their scope.
10. ADRs should have a dedicated location.
11. Circular dependencies should be avoided.
12. Modules should expose clear public interfaces where useful.
13. Deep imports into another module's internals should be minimized.
14. Domain terminology should remain consistent with the PRD.
15. Future features should not create unnecessary empty structures.
16. Repository structure may evolve as implementation evidence requires.
17. Structural changes should respect the locked architecture.
18. AI-generated code must follow the repository boundaries.
19. Configuration should remain separate from business logic.
20. The repository should remain understandable to a single developer.

---

## 3.51 Acceptance Criteria

Part 3 is considered complete when:

- Repository root structure is defined.
- Source structure is defined.
- Application layer location is defined.
- Domain layer location is defined.
- Feature module strategy is defined.
- Analytics location is defined.
- Persistence location is defined.
- State-management location is defined.
- Shared UI component strategy is defined.
- AI module boundary is defined.
- Testing structure is defined.
- Documentation structure is defined.
- ADR location is defined.
- Scripts location is defined.
- CI configuration location is defined.
- Dependency direction is defined.
- Module boundaries are defined.
- Naming principles are defined.
- Validation/error boundaries are defined.
- Repository growth principles are defined.

# Part 4 — Implementation Order

## 4.1 Purpose

This part defines the recommended implementation sequence for Academic OS.

The implementation order is designed to:

- Reduce technical risk.
- Validate the architecture early.
- Establish the foundation before feature development.
- Prevent UI-first development from hiding domain problems.
- Ensure persistence and backup are validated before MVP completion.
- Provide usable progress throughout development.
- Keep R1 focused as the MVP.
- Allow AI-assisted development without allowing AI-generated code to determine the architecture.

The implementation sequence should follow dependency relationships rather than simply implementing features in the order they appear in the UI.

---

## 4.2 Implementation Principle

Academic OS should be built from the foundation upward.

The preferred sequence is:

```text
Project Setup
      ↓
Architecture Foundation
      ↓
Domain & Data
      ↓
Persistence
      ↓
Core Academic Features
      ↓
Analytics
      ↓
Dashboard
      ↓
Backup / Restore
      ↓
Testing & Hardening
      ↓
Optional AI
      ↓
R1 MVP Release
```

This sequence may be adjusted when implementation evidence demonstrates that another order is safer or more efficient.

---

## 4.3 Phase Overview

The implementation should be organized into the following phases:

| Phase | Name | Primary Objective |
|---|---|---|
| P0 | Project Initialization | Establish a runnable development environment |
| P1 | Architecture Foundation | Establish application structure and boundaries |
| P2 | Domain & Data Foundation | Implement core academic concepts |
| P3 | Persistence Foundation | Make academic data reliably persistent |
| P4 | Core Academic Management | Implement essential academic-management features |
| P5 | Academic Analytics | Implement deterministic academic calculations |
| P6 | Dashboard | Present validated academic information |
| P7 | Backup & Restore | Protect and recover user data |
| P8 | Testing & Hardening | Validate the complete MVP |
| P9 | Optional AI | Add non-authoritative AI capabilities |
| P10 | R1 MVP Release | Release the validated MVP |

---

## 4.4 Phase P0 — Project Initialization

### Objective

Create the initial project and confirm that the development toolchain works.

### Activities

```text
Create Repository
      ↓
Initialize React + TypeScript + Vite
      ↓
Configure Package Manager
      ↓
Configure Git
      ↓
Configure Linting
      ↓
Configure Formatting
      ↓
Configure Type Checking
      ↓
Configure Testing
      ↓
Create Initial README
      ↓
Run Development Server
      ↓
Run Build
```

### Exit Criteria

P0 is complete when:

- The repository exists.
- The application starts successfully.
- The development server works.
- The production build succeeds.
- Type checking works.
- Linting works.
- Formatting works.
- The testing framework executes successfully.
- Git is configured.

---

## 4.5 Phase P1 — Architecture Foundation

### Objective

Translate the approved architecture into the initial source structure.

### Activities

Establish:

```text
app/
domain/
features/
analytics/
persistence/
state/
components/
hooks/
lib/
styles/
types/
```

Only required initial modules should be created.

### Additional Activities

- Application initialization
- Routing foundation
- Global providers
- Error-handling foundation
- Configuration foundation
- Shared UI foundation
- State-management foundation
- Persistence interfaces

### Exit Criteria

P1 is complete when:

- The application structure reflects Document 02.
- Architectural boundaries are established.
- The application can navigate between initial views.
- Core providers are initialized.
- The project remains buildable and testable.

---

## 4.6 Phase P2 — Domain & Data Foundation

### Objective

Implement the core academic domain.

### Primary Concepts

```text
Academic Profile
Program
Semester
Subject
Academic Record
Grade
Credit
Requirement
Goal
```

The exact entities and relationships should follow the approved data architecture and be finalized in Document 04.

### Activities

- Define domain types.
- Define domain entities.
- Define value objects where required.
- Define domain validation.
- Define academic rules.
- Define initial schemas.
- Create representative test data.

### Important Rule

Domain implementation should occur before large-scale UI implementation.

### Exit Criteria

P2 is complete when:

- Core academic concepts are represented.
- Domain validation works.
- Core domain rules have tests.
- Domain code does not depend on React or UI components.

---

## 4.7 Phase P3 — Persistence Foundation

### Objective

Implement reliable local persistence.

### Sequence

```text
Repository Interface
      ↓
IndexedDB Adapter
      ↓
Database Initialization
      ↓
Schema
      ↓
CRUD Operations
      ↓
Validation
      ↓
Persistence Tests
```

### Activities

- Initialize IndexedDB.
- Implement repositories.
- Define persistence schema.
- Implement CRUD operations.
- Implement serialization where required.
- Implement initial migration strategy.
- Handle persistence errors.

### Exit Criteria

P3 is complete when:

- Academic data can be persisted.
- Academic data can be retrieved.
- Data survives application restart.
- Persistence errors are handled.
- Repository boundaries work as designed.
- Persistence tests pass.

---

## 4.8 Phase P4 — Core Academic Management

### Objective

Implement the features required to create and maintain academic information.

### Recommended Feature Sequence

```text
Program
   ↓
Semesters
   ↓
Subjects
   ↓
Academic Records
   ↓
Grades
   ↓
Goals / Requirements
```

The exact order may change where dependencies require it.

### Feature Development Pattern

Each feature should generally follow:

```text
Domain
  ↓
Repository
  ↓
Service / Application Logic
  ↓
State
  ↓
UI
  ↓
Tests
```

### Exit Criteria

P4 is complete when users can perform the required R1 academic-management operations and the changes persist correctly.

---

## 4.9 Phase P5 — Academic Analytics

### Objective

Implement deterministic calculations based on authoritative academic data.

### Recommended Sequence

```text
GPA
 ↓
Credits
 ↓
Program Progress
 ↓
Requirement Progress
 ↓
Goal Progress
 ↓
Trends
```

### Important Principle

Analytics should consume stored academic data.

The dashboard should not become the calculation engine.

### Validation

Analytics should be tested against:

- Normal academic records
- Empty datasets
- Partial records
- Different grading outcomes
- Edge cases
- Invalid data

### Exit Criteria

P5 is complete when the required R1 academic metrics produce validated results.

---

## 4.10 Phase P6 — Dashboard

### Objective

Build the primary monitoring interface using validated analytics.

### Sequence

```text
Analytics Results
      ↓
Dashboard View Models
      ↓
Dashboard Components
      ↓
Charts / Cards / Tables
      ↓
Responsive Layout
```

### Dashboard Principle

The dashboard should primarily answer:

> "How am I doing academically?"

It should surface information that already exists in the domain and analytics layers.

### Exit Criteria

P6 is complete when the dashboard displays the required R1 academic information accurately and responsively.

---

## 4.11 Phase P7 — Backup & Restore

### Objective

Ensure that the user's academic data can be backed up and recovered.

### Sequence

```text
Export
  ↓
Backup Format
  ↓
Validation
  ↓
Import
  ↓
Restore
  ↓
Verification
```

### Activities

- Define backup format.
- Add backup version information.
- Export data.
- Validate imported data.
- Restore data.
- Handle invalid backup files.
- Handle incompatible versions.
- Test recovery scenarios.

### Exit Criteria

P7 is complete when representative Academic OS datasets can be exported and restored successfully.

---

## 4.12 Phase P8 — Testing & Hardening

### Objective

Validate the complete R1 system before release.

### Testing Layers

```text
Unit
 ↓
Integration
 ↓
Component
 ↓
End-to-End
 ↓
Manual Validation
```

### Areas to Validate

- Academic calculations
- Persistence
- Data validation
- Feature workflows
- Dashboard accuracy
- Backup / restore
- Error handling
- Accessibility
- Responsive behavior
- Browser compatibility
- Performance
- Security/privacy boundaries

### Exit Criteria

P8 is complete when all release-blocking issues have been resolved or explicitly accepted.

---

## 4.13 Phase P9 — Optional AI

### Objective

Add AI capabilities only after the deterministic MVP foundation is stable.

### Sequence

```text
Stable Core
      ↓
AI Use Case
      ↓
AI Interface
      ↓
Provider Adapter
      ↓
Input Validation
      ↓
Output Validation
      ↓
UI Integration
      ↓
AI Testing
```

### AI Principle

AI should provide assistance rather than become the authority for academic state.

Examples of appropriate roles may include:

- Explanations
- Suggestions
- Summaries
- Planning assistance

Authoritative academic calculations should remain deterministic.

### Exit Criteria

P9 is complete when an approved AI feature works without compromising the deterministic core.

---

## 4.14 Phase P10 — R1 MVP Release

### Objective

Release the first complete and validated Academic OS MVP.

### Release Sequence

```text
Feature Complete
      ↓
Test Complete
      ↓
Bug Fixes
      ↓
Build
      ↓
Deployment
      ↓
Smoke Test
      ↓
R1 Release
```

### Release Criteria

R1 should satisfy:

- Approved MVP requirements.
- Architecture requirements.
- Persistence requirements.
- Backup / restore requirements.
- Testing requirements.
- Basic accessibility requirements.
- Basic privacy/security requirements.
- Release documentation.

---

## 4.15 Dependency-Based Development

Implementation should respect feature dependencies.

For example:

```text
Subject
  ↓
Academic Record
  ↓
Grade
  ↓
GPA
  ↓
Dashboard
```

A dependent feature should not become the primary development target before its required foundation exists.

---

## 4.16 Parallel Development

Some activities may be developed in parallel when dependencies permit.

For example:

```text
Domain Development
        │
        ├──── Persistence
        │
        └──── UI Prototype
```

However, parallel development should not create competing implementations of the same business logic.

---

## 4.17 UI Prototype Parallelism

UI exploration may begin before the complete domain implementation is finished.

For example:

```text
Architecture
      ↓
UI Prototype
      ↓
Visual Review
      ↓
Domain Integration
```

This allows Google AI Studio or other UI tools to help explore layouts without making the prototype authoritative.

---

## 4.18 Test-First Risk Reduction

High-risk calculations should receive tests early.

Examples:

- GPA calculation
- Credit calculation
- Program progress
- Backup validation
- Restore behavior

This allows the implementation to evolve while maintaining confidence in correctness.

---

## 4.19 Data-First Development

Academic OS should establish the data model before building complex dashboard visualizations.

Preferred:

```text
Data
 ↓
Domain
 ↓
Analytics
 ↓
Dashboard
```

Avoid:

```text
Dashboard
 ↓
Invent data structure
 ↓
Implement calculations inside components
```

---

## 4.20 MVP Boundary

The implementation team should continuously distinguish between:

```text
Required for R1
```

and:

```text
Future / Optional
```

Features outside the approved R1 scope should not automatically enter implementation simply because they are technically interesting.

---

## 4.21 Definition of Phase Completion

A phase should not be considered complete merely because its code exists.

Each phase should satisfy:

```text
Implementation
    +
Validation
    +
Tests
    +
Review
    =
Phase Complete
```

Where applicable, documentation should also be updated.

---

## 4.22 Phase Review

At the end of each major phase, perform a short review:

1. Does the implementation follow Document 02?
2. Are tests passing?
3. Is the intended behavior working?
4. Has scope expanded unexpectedly?
5. Are new risks present?
6. Does the next phase still make sense?

If the answer to a major architectural question is "no," implementation should pause for review before continuing.

---

## 4.23 Implementation Checkpoints

Recommended checkpoints are:

```text
Checkpoint 0
Project runs

Checkpoint 1
Architecture foundation works

Checkpoint 2
Academic data model works

Checkpoint 3
Persistence works

Checkpoint 4
Core academic management works

Checkpoint 5
Analytics works

Checkpoint 6
Dashboard works

Checkpoint 7
Backup / restore works

Checkpoint 8
MVP passes validation

Checkpoint 9
R1 released
```

---

## 4.24 Recovery from Implementation Problems

If a phase reveals a major problem:

```text
Problem
  ↓
Classify
  ↓
Bug / Design Issue / Architecture Issue / Scope Issue
  ↓
Resolve
  ↓
Re-test
  ↓
Continue
```

The team should avoid accumulating known architectural problems simply to maintain the original schedule.

---

## 4.25 Implementation Order and AI Assistance

AI coding tools may assist at any phase, but they should follow the same sequence.

For example:

```text
Developer identifies task
      ↓
Provides repository context
      ↓
Copilot proposes implementation
      ↓
Developer reviews
      ↓
Tests
      ↓
Merge
```

AI should not be given authority to decide that a later-phase feature should be implemented early without a deliberate scope decision.

---

## 4.26 Recommended First Development Sequence

When actual coding begins, the initial sequence should be:

```text
1. Create repository
2. Initialize React + TypeScript + Vite
3. Configure tooling
4. Configure Git
5. Create architectural folders
6. Establish application shell
7. Establish domain foundation
8. Establish IndexedDB foundation
9. Implement core academic entities
10. Implement first vertical slice
```

The first vertical slice should prove that:

```text
UI
 ↓
Application Logic
 ↓
Domain
 ↓
Repository
 ↓
IndexedDB
 ↓
Tests
```

works end-to-end.

---

## 4.27 First Vertical Slice

The first vertical slice should use a small but meaningful academic feature.

A suitable example is:

```text
Create / View Subject
```

because it exercises:

- Domain model
- Validation
- Repository
- Persistence
- State
- UI
- Testing

The exact first feature may be changed if implementation dependencies indicate a better candidate.

---

## 4.28 Avoiding Premature Optimization

Performance optimization should focus first on correctness and maintainability.

The preferred order is:

```text
Correct
 ↓
Tested
 ↓
Maintainable
 ↓
Performant
 ↓
Optimized
```

Optimization should be driven by observed problems rather than assumptions.

---

## 4.29 Avoiding Premature Infrastructure

R1 should not introduce infrastructure that has no current requirement.

Examples of infrastructure that should not be introduced automatically:

- Dedicated backend
- Cloud database
- Authentication server
- Microservices
- Message queues
- Distributed caching
- Complex deployment infrastructure

Such infrastructure requires an explicit requirement or architectural decision.

---

## 4.30 Release Preparation

Before R1 release:

```text
Requirements Review
      ↓
Architecture Review
      ↓
Functional Testing
      ↓
Data Testing
      ↓
Backup Testing
      ↓
Accessibility Review
      ↓
Security / Privacy Review
      ↓
Build Verification
      ↓
Deployment
```

---

## 4.31 Post-R1

After R1 release, future development should use the same process:

```text
New Requirement
      ↓
Scope Review
      ↓
Architecture Review
      ↓
Implementation
      ↓
Testing
      ↓
Release
```

Future features should not bypass the established process simply because the MVP already exists.

---

## 4.32 Part 4 Rules

The following rules apply:

1. Implementation proceeds from foundation toward features.
2. R1 remains the MVP target.
3. Domain and data foundations precede complex UI implementation.
4. Persistence must be validated before relying on the application for real academic data.
5. Core academic management precedes advanced analytics.
6. Analytics precedes the final dashboard implementation.
7. Backup and restore must be completed before R1 release.
8. High-risk calculations receive early testing.
9. AI is implemented only after the deterministic core is stable.
10. UI prototyping may proceed in parallel where dependencies permit.
11. Phase completion requires implementation and validation.
12. Scope outside R1 should not automatically enter implementation.
13. Architecture problems require explicit review.
14. Infrastructure should not be introduced without justification.
15. The first implementation should prove an end-to-end vertical slice.
16. Development should optimize for correctness before performance.
17. AI coding tools must follow the same architectural and scope boundaries as human-written code.
18. Phase checkpoints should be used to validate progress.
19. Known critical problems should not be carried forward simply to preserve schedule.
20. Future releases should continue using the same controlled development process.

---

## 4.33 Acceptance Criteria

Part 4 is considered complete when:

- Implementation phases are defined.
- Phase dependencies are defined.
- R0/R1 implementation boundaries are defined.
- Project initialization sequence is defined.
- Architecture foundation sequence is defined.
- Domain/data sequence is defined.
- Persistence sequence is defined.
- Core feature sequence is defined.
- Analytics sequence is defined.
- Dashboard sequence is defined.
- Backup/restore sequence is defined.
- Testing/hardening sequence is defined.
- AI implementation boundary is defined.
- MVP release sequence is defined.
- Phase completion criteria are defined.
- Checkpoints are defined.
- First vertical slice is defined.
- Scope-control rules are defined.
- Infrastructure-control rules are defined.
- Post-release development process is defined.


# Part 5 — Core Foundation Development

## 5.1 Purpose

This part defines the implementation of the core technical foundation of Academic OS.

The purpose is to transform the empty repository into a stable development environment that can support the subsequent implementation phases.

The foundation should establish:

- A working React + TypeScript + Vite application.
- The approved repository structure.
- Development and quality tooling.
- Application initialization.
- Initial routing.
- State-management foundations.
- Persistence foundations.
- Error-handling foundations.
- Testing foundations.
- Basic UI foundations.
- A first end-to-end architectural validation.

This phase should establish the system's structure without prematurely implementing the full Academic OS feature set.

---

## 5.2 Foundation Principle

The core foundation should prove that the architecture works before significant feature development begins.

The target is:

```text
Repository
    ↓
Application Shell
    ↓
Architecture
    ↓
Domain Boundary
    ↓
Persistence Boundary
    ↓
Testing
    ↓
Validated Foundation
```

The foundation is successful when new features can be added without restructuring the entire project.

---

## 5.3 Foundation Scope

The foundation includes:

```text
Project Setup
Tooling
Repository Structure
Application Shell
Routing
State Foundation
Persistence Foundation
Error Handling
Validation Infrastructure
Testing Infrastructure
Basic UI Foundation
Documentation
```

The foundation does not include:

```text
Complete Academic Management
Complete Dashboard
Advanced Analytics
Runtime AI
Advanced Visualization
```

Those belong to later implementation phases.

---

## 5.4 Step 1 — Initialize the Repository

Create the initial project repository.

Expected baseline:

```text
academic-os/
```

The repository should be initialized with Git immediately.

Initial actions:

```text
Create Repository
      ↓
Initialize Project
      ↓
Initialize Git
      ↓
Initial Commit
```

The initial commit should represent a clean starting point.

---

## 5.5 Step 2 — Initialize React + TypeScript + Vite

Create the initial application using:

```text
React
TypeScript
Vite
```

The application should successfully support:

- Development mode.
- Production build.
- Type checking.
- Module resolution.
- Environment configuration.

The default starter application should be replaced with the initial Academic OS application shell once the environment has been verified.

---

## 5.6 Step 3 — Establish Package Management

Select one package manager and use it consistently.

The repository should contain the corresponding lockfile.

Dependency installation should be reproducible across development environments.

The package manager should provide scripts for:

```text
Development
Build
Testing
Linting
Formatting
Type Checking
```

---

## 5.7 Step 4 — Configure TypeScript

TypeScript should be configured for strict and maintainable development.

The configuration should prioritize:

- Strict type checking.
- Clear module resolution.
- Predictable imports.
- Avoidance of implicit `any`.
- Compatibility with the selected Vite setup.

TypeScript errors should be treated as development issues rather than ignored.

---

## 5.8 Step 5 — Configure Linting

A linting system should be configured early.

The purpose is to detect:

- Common programming mistakes.
- Suspicious patterns.
- Unused code.
- Invalid imports.
- Maintainability problems.

Linting should run locally and through CI when CI is established.

---

## 5.9 Step 6 — Configure Formatting

A consistent formatting strategy should be established.

Formatting should cover:

- TypeScript.
- TSX.
- Configuration files.
- Documentation where appropriate.

Formatting should be automated rather than dependent on manual consistency.

---

## 5.10 Step 7 — Configure Testing

The testing framework should be configured before feature implementation begins.

The initial test environment should support:

```text
Unit Tests
Component Tests
Integration Tests
```

End-to-end testing infrastructure may be configured during the foundation phase or when the first complete user workflow is implemented.

The important requirement is that tests can execute automatically from the beginning.

---

## 5.11 Step 8 — Create the Repository Structure

Create the initial architectural structure established in Part 3.

Conceptually:

```text
src/
├── app/
├── domain/
├── features/
├── analytics/
├── persistence/
├── state/
├── components/
├── hooks/
├── lib/
├── styles/
├── types/
└── main.*
```

Only directories required by the initial foundation should contain implementation files.

---

## 5.12 Step 9 — Establish the Application Shell

Create the basic application shell.

The shell should establish:

```text
Application
    ↓
Global Providers
    ↓
Router
    ↓
Layout
    ↓
Page
```

At this stage, the UI can remain intentionally simple.

The goal is architectural validation rather than visual completion.

---

## 5.13 Step 10 — Establish Routing

Create the initial route structure.

The initial routes may include placeholders for:

```text
Dashboard
Academic Records
Subjects
Semesters
Goals
Settings
Backup
```

The routes do not need complete functionality at this stage.

Their purpose is to establish navigation and application composition.

---

## 5.14 Step 11 — Establish the Layout System

Create the basic layout structure.

Conceptually:

```text
Application Shell
├── Header
├── Navigation
├── Main Content
└── Global Feedback Area
```

The exact visual design can be refined during the UI development phase.

The foundation should prioritize:

- Responsive structure.
- Accessibility.
- Consistent layout boundaries.
- Reusable components.

---

## 5.15 Step 12 — Establish Shared UI Components

Create only the initial shared components required by the application shell.

Examples:

```text
Button
Card
Input
Dialog
Navigation
Loading State
Error State
Empty State
```

Components should remain generic and presentation-oriented.

Feature-specific components should not be placed in the shared UI layer simply for convenience.

---

## 5.16 Step 13 — Establish State Foundation

Create the initial state-management structure.

The state system should distinguish between:

```text
UI State
Application State
Persistent Data
Derived Data
```

The foundation should avoid storing everything in a single global state object.

Persistent academic data should have a clear relationship with the persistence layer.

---

## 5.17 Step 14 — Establish Domain Foundation

Create the initial domain boundaries without implementing the entire academic model.

The foundation may establish:

```text
Domain Types
Domain Errors
Validation Interfaces
Entity Conventions
Value Object Conventions
```

The complete academic entities will be implemented during the Academic Management phase.

---

## 5.18 Step 15 — Establish Repository Interfaces

Define the initial repository abstraction.

Conceptually:

```text
Feature / Application
        ↓
Repository Interface
        ↓
Persistence Implementation
```

Repository interfaces should represent application needs rather than expose raw IndexedDB APIs.

For example, application code should not need to know:

```text
objectStore
transaction
cursor
IndexedDB request
```

These details belong inside the persistence implementation.

---

## 5.19 Step 16 — Establish IndexedDB Foundation

Initialize the IndexedDB infrastructure.

The foundation should provide:

- Database initialization.
- Connection management.
- Schema initialization.
- Object-store strategy.
- Basic error handling.
- Version management.

The complete academic persistence schema will be developed alongside the domain model.

---

## 5.20 Step 17 — Establish Persistence Error Handling

Persistence errors should be represented consistently.

Examples include:

```text
Database Initialization Error
Read Error
Write Error
Delete Error
Migration Error
Import Error
```

The UI should receive meaningful application-level errors rather than raw browser API errors where possible.

---

## 5.21 Step 18 — Establish Validation Infrastructure

Create validation mechanisms for data entering important boundaries.

Conceptually:

```text
UI Input
   ↓
Input Validation
   ↓
Domain Validation
   ↓
Persistence Validation
```

The exact validation library may be selected during implementation.

Validation should not be duplicated unnecessarily across every layer.

---

## 5.22 Step 19 — Establish Application Error Handling

Create a consistent application-level error strategy.

Errors should be categorized where useful:

```text
Validation Error
Domain Error
Persistence Error
Application Error
External Service Error
Unknown Error
```

The system should provide user-friendly feedback without exposing unnecessary internal implementation details.

---

## 5.23 Step 20 — Establish Loading and Empty States

The application shell should support common states:

```text
Loading
Empty
Success
Error
```

These states should have reusable UI patterns.

This is especially important for a dashboard application because an empty academic record is a valid state rather than necessarily an error.

---

## 5.24 Step 21 — Establish Logging Strategy

A lightweight logging strategy should be established.

Development logging may include:

- Debug information.
- Persistence diagnostics.
- Error information.
- Development warnings.

Production logging should avoid exposing unnecessary academic or personal data.

Sensitive user data should not be casually written to logs.

---

## 5.25 Step 22 — Establish Environment Configuration

Create the basic environment configuration strategy.

The application should distinguish between:

```text
Development
Test
Production
```

Environment configuration should not contain hard-coded secrets.

---

## 5.26 Step 23 — Establish Git Ignore Rules

The repository should exclude:

```text
Dependencies
Build Output
Environment Secrets
IDE-Specific Files
Temporary Files
Local Database Artifacts
Logs
```

The exact `.gitignore` should reflect the selected development environment.

---

## 5.27 Step 24 — Establish README

The initial README should document:

- Project purpose.
- Technology stack.
- Prerequisites.
- Installation.
- Development command.
- Build command.
- Test command.
- Lint command.
- Type-check command.
- Repository structure.
- Development status.

The README should be updated as implementation progresses.

---

## 5.28 Step 25 — Establish CI Foundation

Create a lightweight CI workflow.

Initial pipeline:

```text
Checkout
   ↓
Install Dependencies
   ↓
Type Check
   ↓
Lint
   ↓
Test
   ↓
Build
```

CI should fail if required quality checks fail.

---

## 5.29 Step 26 — Establish Initial Documentation

The repository should document the initial implementation conventions.

At minimum:

```text
Development Setup
Architecture Overview
Testing Instructions
Contribution / Git Workflow
```

These documents can remain concise during R1 development.

---

## 5.30 Step 27 — Create a Foundation Smoke Test

A basic end-to-end foundation test should verify that:

```text
Application Starts
      ↓
Route Loads
      ↓
UI Renders
      ↓
State Initializes
      ↓
Persistence Initializes
      ↓
Application Remains Stable
```

The test does not need to validate complete academic functionality.

Its purpose is to prove that the foundation is connected correctly.

---

## 5.31 Step 28 — First Persistence Proof

Before implementing full academic management, perform a simple persistence proof.

For example:

```text
Write Test Record
      ↓
Close / Reinitialize Application
      ↓
Read Test Record
      ↓
Verify Record
```

The exact test data can be temporary foundation data.

The purpose is to prove that IndexedDB persistence works correctly.

---

## 5.32 Step 29 — Remove Temporary Foundation Data

Temporary test records and placeholder logic should not become accidental production functionality.

Before moving to the next phase:

```text
Foundation Prototype
      ↓
Validate
      ↓
Remove Temporary Logic
      ↓
Keep Reusable Infrastructure
```

---

## 5.33 Step 30 — Architecture Validation

Before beginning full Academic Management implementation, review:

```text
UI
 ↓
Application
 ↓
Domain
 ↓
Repository
 ↓
IndexedDB
```

The dependency boundaries should be checked.

Questions:

1. Can the UI be changed without rewriting domain logic?
2. Can persistence be changed without rewriting the UI?
3. Are domain calculations independent from React?
4. Are feature boundaries clear?
5. Are tests easy to locate?
6. Are circular dependencies absent?
7. Is the project understandable to a single developer?

---

## 5.34 Foundation Definition of Done

The core foundation is considered complete when:

- Project builds successfully.
- Development server works.
- Type checking passes.
- Linting passes.
- Formatting is configured.
- Tests execute successfully.
- Git repository is initialized.
- Repository structure exists.
- Application shell works.
- Initial routing works.
- Shared layout foundation exists.
- State foundation exists.
- Domain boundary exists.
- Repository abstraction exists.
- IndexedDB initializes successfully.
- Persistence proof succeeds.
- Error-handling foundation exists.
- Validation foundation exists.
- CI pipeline works.
- README exists.
- Architecture validation is complete.

---

## 5.35 Foundation Exit Condition

The project should only move to the next phase when the foundation is stable enough that feature development does not require restructuring the core architecture.

The target is:

```text
Foundation Stable
      ↓
Academic Domain Development
      ↓
Feature Implementation
```

not:

```text
Feature Development
      ↓
Repeatedly Rebuild Foundation
```

---

## 5.36 Foundation Scope Control

The following should not become part of the foundation unless required:

- Advanced dashboard visualization.
- Complete academic analytics.
- Runtime AI.
- Complex authentication.
- Cloud synchronization.
- Advanced deployment infrastructure.
- Large design-system implementation.
- Predictive analytics.

These belong to later phases or future releases.

---

## 5.37 AI-Assisted Foundation Development

Copilot may be used during foundation development.

Appropriate tasks include:

- Configuration boilerplate.
- Type definitions.
- Test scaffolding.
- Simple utilities.
- Documentation.
- Refactoring.

High-risk architectural decisions should remain developer-controlled.

The recommended process is:

```text
Developer Defines Architecture
        ↓
Developer Defines Task
        ↓
Copilot Assists
        ↓
Developer Reviews
        ↓
Tests
        ↓
Accept
```

---

## 5.38 Foundation Development with Google AI Studio

Google AI Studio may be used to explore:

- Application shell concepts.
- Dashboard layout concepts.
- Navigation ideas.
- Component visualizations.
- Responsive layouts.

However, generated UI should be adapted to the repository architecture.

The generated code should not automatically determine:

- Domain boundaries.
- Persistence architecture.
- State architecture.
- Analytics architecture.

---

## 5.39 Commit Strategy During Foundation

Foundation development should use small, meaningful commits.

Examples:

```text
chore: initialize React TypeScript Vite project
chore: configure development tooling
feat: establish application shell
feat: establish routing
feat: establish persistence foundation
test: add persistence smoke test
docs: add development setup
ci: add validation workflow
```

Commit messages should describe the actual change.

---

## 5.40 Foundation Review Checkpoint

At the end of the foundation phase, review:

### Technical

- Does the project build?
- Do tests run?
- Does IndexedDB work?
- Does routing work?
- Does the application initialize correctly?

### Architectural

- Are boundaries respected?
- Is domain logic independent?
- Is persistence isolated?
- Are features organized correctly?

### Development

- Can Copilot work effectively with the repository?
- Are scripts documented?
- Can another environment reproduce the project?

### Scope

- Has foundation work expanded into feature development?
- Were unnecessary dependencies introduced?
- Was unnecessary infrastructure added?

---

## 5.41 Part 5 Rules

The following rules apply:

1. The foundation must be established before major feature development.
2. React + TypeScript + Vite remain the initial stack.
3. TypeScript should use strict checking.
4. Linting and formatting should be automated.
5. Testing must be configured before major feature implementation.
6. The repository structure should reflect the approved architecture.
7. Domain logic must remain independent from React.
8. IndexedDB access must remain behind persistence boundaries.
9. The state layer must not become an uncontrolled global data store.
10. Temporary foundation data must not become production data.
11. Error handling must be established early.
12. Validation must exist at important boundaries.
13. Sensitive data should not be written to logs.
14. CI should validate core quality checks.
15. README and development instructions must exist.
16. Foundation development should use small, meaningful commits.
17. Copilot may assist but must not control architecture.
18. Google AI Studio may assist UI exploration but must not control architecture.
19. Advanced features should not be pulled into the foundation without justification.
20. The foundation phase ends only after an architecture validation checkpoint.

---

## 5.42 Acceptance Criteria

Part 5 is considered complete when:

- Repository initialization is defined.
- React + TypeScript + Vite initialization is defined.
- Package management is defined.
- TypeScript configuration is defined.
- Linting is defined.
- Formatting is defined.
- Testing setup is defined.
- Repository structure implementation is defined.
- Application shell implementation is defined.
- Routing foundation is defined.
- Layout foundation is defined.
- Shared UI foundation is defined.
- State foundation is defined.
- Domain foundation is defined.
- Repository abstraction is defined.
- IndexedDB foundation is defined.
- Persistence error handling is defined.
- Validation infrastructure is defined.
- Application error handling is defined.
- Loading/empty/error states are defined.
- Logging strategy is defined.
- Environment configuration is defined.
- Git ignore strategy is defined.
- README requirements are defined.
- CI foundation is defined.
- Foundation smoke testing is defined.
- Persistence proof is defined.
- Architecture validation is defined.
- Foundation definition of done is defined.
- Foundation scope boundaries are defined.

# Part 6 — Academic Management Implementation

## 6.1 Purpose

This part defines the implementation approach for Academic OS's core academic-management functionality.

The objective is to provide a reliable foundation for managing the user's academic information, including:

- Academic profile
- Academic program
- Semesters
- Subjects
- Academic records
- Grades
- Credits
- Requirements
- Goals
- Relationships between academic entities

The implementation must preserve the principles established in previous parts:

- Local-first operation.
- Deterministic academic logic.
- Clear domain boundaries.
- Persistent local data.
- Validation at important boundaries.
- R1 as the MVP.
- Incremental feature development.
- AI as optional assistance rather than an authoritative academic system.

---

## 6.2 Academic Management Principle

Academic OS should treat academic information as structured data rather than UI-only information.

The intended flow is:

```text
User Input
    ↓
Validation
    ↓
Domain Model
    ↓
Application Logic
    ↓
Repository
    ↓
IndexedDB
    ↓
Analytics
    ↓
Dashboard
```

The UI should provide access to this system but should not become the source of truth.

---

## 6.3 Academic Data Ownership

The application should maintain a clear distinction between:

```text
Authoritative Academic Data
```

and:

```text
Derived Academic Data
```

### Authoritative Data

Examples:

- Subject
- Semester
- Credit
- Grade
- Program requirement
- Academic goal

### Derived Data

Examples:

- GPA
- Completed credits
- Remaining credits
- Completion percentage
- Academic trends

Derived information should be recalculated from authoritative data rather than manually maintained wherever practical.

---

## 6.4 Academic Profile

The Academic Profile represents general information about the user's academic context.

Potential information includes:

```text
Student Information
Program
University
Faculty / Department
Academic Year
Expected Graduation
```

Only information required by the approved product scope should be implemented.

The profile should not become a general personal-information management system.

---

## 6.5 Academic Program

The Academic Program represents the structure within which the user's academic progress is evaluated.

Conceptually:

```text
Program
 ├── Total Required Credits
 ├── Required Subjects
 ├── Elective Requirements
 ├── General Requirements
 └── Other Requirements
```

The exact requirement model should follow the approved data architecture.

The program should provide the reference against which academic progress is measured.

---

## 6.6 Program Configuration

The system should allow the user to configure the academic program information required for monitoring.

Examples:

- Program name
- Total credits
- Required courses
- Elective structure
- Requirement categories
- Graduation requirements

The system should avoid forcing the user into a predefined university-specific structure unless such a requirement is explicitly approved.

---

## 6.7 Semester

A Semester represents an academic period.

Conceptually:

```text
Semester
├── Name
├── Academic Year
├── Term
├── Status
└── Subjects
```

Possible statuses may include:

```text
Planned
Current
Completed
```

The exact status model should remain minimal for R1.

---

## 6.8 Semester Management

The user should be able to:

- Create a semester.
- Edit semester information.
- View semester information.
- Remove a semester where appropriate.
- Associate subjects with a semester.

The system should prevent invalid academic relationships.

For example, a subject record should not silently reference a deleted or nonexistent semester.

---

## 6.9 Subject

A Subject represents a course or academic unit.

Potential attributes include:

```text
Subject ID / Code
Subject Name
Credits
Semester
Category
Status
Grade
```

Not every attribute needs to exist directly on the Subject entity.

The implementation should distinguish between:

```text
Subject Definition
```

and:

```text
Student's Academic Record for the Subject
```

when that distinction is useful.

---

## 6.10 Subject Definition vs Academic Record

A subject describes the academic course itself.

An academic record describes the user's result for that subject.

Conceptually:

```text
Subject
   ↓
Academic Record
   ↓
Grade / Result
```

This separation prevents course information and personal academic results from becoming unnecessarily coupled.

---

## 6.11 Academic Record

An Academic Record represents the user's participation/result for a subject.

Potential information includes:

```text
Subject
Semester
Attempt
Grade
Grade Status
Credits Earned
Completion Status
```

The exact model should follow the approved data model.

The system should support the minimum information required to calculate academic progress accurately.

---

## 6.12 Grade Management

Grades should be represented using a structured model.

The system may need to distinguish between:

```text
Grade Value
Grade Type
Numeric Equivalent
Completion Status
```

For example, a grade may have:

```text
Letter Grade
+
Numeric / GPA Equivalent
+
Completion Status
```

The mapping should be configurable where academic systems differ.

The application should not hard-code assumptions about a university's grading system unless explicitly required.

---

## 6.13 Credit Management

Credits should be represented as structured academic data.

The system should distinguish where necessary between:

```text
Credits Attempted
Credits Earned
Credits Required
```

This distinction is important for accurate academic progress.

Credit calculations should be handled by the analytics/domain logic rather than duplicated in UI components.

---

## 6.14 Requirement Management

Requirements define what must be completed to satisfy the academic program.

Possible categories include:

```text
General Education
Major Requirements
Electives
Required Subjects
Credit Requirements
Other Graduation Requirements
```

The system should allow requirements to be represented flexibly enough for the user's actual program.

---

## 6.15 Requirement Completion

A requirement should be evaluated from authoritative academic data.

Conceptually:

```text
Requirement
      +
Academic Records
      ↓
Requirement Status
```

Possible states may include:

```text
Not Started
In Progress
Completed
```

The exact status model should remain simple unless additional states are required.

---

## 6.16 Goal Management

Goals represent user-defined academic targets.

Examples:

```text
Target GPA
Target Credits
Target Graduation Period
Semester GPA Goal
Subject Goal
```

Goals should remain distinct from formal program requirements.

Conceptually:

```text
Program Requirement
≠
Personal Academic Goal
```

---

## 6.17 Goal Evaluation

Goals should be evaluated against current academic information where appropriate.

For example:

```text
Target GPA
     ↓
Current GPA
     ↓
Goal Status
```

The system should avoid presenting a goal as an official academic requirement.

---

## 6.18 CRUD Operations

R1 academic-management features should support the necessary CRUD operations.

```text
Create
Read
Update
Delete
```

However, delete operations should be treated carefully when data relationships exist.

For example:

```text
Delete Subject
      ↓
Existing Academic Records?
      ↓
Prevent / Warn / Handle Relationship
```

The exact behavior should be defined by the data architecture and implementation requirements.

---

## 6.19 Validation

Academic data should be validated before persistence.

Examples:

```text
Subject
 ├── Required name
 ├── Valid credits
 └── Valid identifiers

Semester
 ├── Valid period
 └── Valid status

Grade
 ├── Valid format
 └── Valid mapping

Requirement
 └── Valid configuration
```

Validation should exist at the appropriate domain and application boundaries.

---

## 6.20 Invalid Data

Invalid academic data should not silently enter the authoritative dataset.

Examples:

- Negative credits.
- Missing required subject information.
- Invalid semester relationship.
- Unsupported grade.
- Invalid requirement configuration.

The system should provide useful feedback to the user.

---

## 6.21 Duplicate Data

The application should identify duplicate records where uniqueness matters.

Examples may include:

```text
Duplicate Subject Code
Duplicate Semester Identifier
Duplicate Academic Record
```

The exact uniqueness rules should be established in the data model.

---

## 6.22 Academic Record Updates

Updating an academic record should trigger appropriate recalculation of derived information.

For example:

```text
Grade Changed
    ↓
Academic Record Updated
    ↓
GPA Recalculated
    ↓
Progress Recalculated
    ↓
Dashboard Updated
```

Derived data should not remain stale after authoritative data changes.

---

## 6.23 Persistence Integration

Each academic-management feature should follow the established persistence boundary:

```text
UI
 ↓
Feature Logic
 ↓
Domain / Application Logic
 ↓
Repository
 ↓
IndexedDB
```

UI components should not directly access IndexedDB.

---

## 6.24 State Synchronization

The application should maintain a predictable relationship between persisted data and application state.

Conceptually:

```text
IndexedDB
   ↓
Repository
   ↓
Application State
   ↓
UI
```

After a successful mutation:

```text
User Action
   ↓
Validation
   ↓
Persistence
   ↓
State Update
   ↓
UI Update
```

The system should avoid displaying a successful UI state before the authoritative operation succeeds unless optimistic updates are deliberately introduced.

---

## 6.25 First Academic Vertical Slice

The first academic-management vertical slice should be small but complete.

Recommended:

```text
Subject Management
```

The slice should demonstrate:

```text
Create Subject
      ↓
Validate
      ↓
Persist
      ↓
Read
      ↓
Display
      ↓
Edit
      ↓
Delete / Archive
      ↓
Test
```

This validates the foundation established in Part 5.

---

## 6.26 Vertical Slice Expansion

After the first subject slice is stable, expand incrementally:

```text
Subject
   ↓
Semester
   ↓
Academic Record
   ↓
Grade
   ↓
Program / Requirements
   ↓
Goals
```

Each addition should reuse established patterns rather than introduce an unrelated implementation style.

---

## 6.27 Feature Implementation Pattern

Each feature should generally follow:

```text
1. Define domain model
2. Define validation
3. Define repository operations
4. Implement application logic
5. Connect state
6. Build UI
7. Add tests
8. Verify persistence
```

This pattern should be reused where appropriate.

---

## 6.28 Academic Management UI

The UI should prioritize clarity and efficient data entry.

Important principles:

- Clear forms.
- Understandable labels.
- Useful validation messages.
- Predictable navigation.
- Confirmation for destructive actions.
- Empty states.
- Loading states.
- Error states.
- Responsive layouts.

The UI should not attempt to display every possible academic metric on every screen.

---

## 6.29 Academic Overview

The academic-management area should provide clear views of:

```text
Program
Semesters
Subjects
Academic Records
Requirements
Goals
```

The dashboard remains responsible for high-level monitoring.

Academic-management screens should focus more on managing and inspecting underlying information.

---

## 6.30 Forms

Forms should:

- Use typed inputs.
- Validate before submission.
- Display actionable errors.
- Preserve user input where possible.
- Prevent accidental destructive actions.
- Clearly distinguish required and optional fields.

Forms should not contain complex academic calculations.

---

## 6.31 Delete Operations

Deletion should be conservative.

When a record has dependencies:

```text
Record
 ↓
Related Data
 ↓
Impact Analysis
```

The system should either:

- Prevent deletion.
- Require explicit confirmation.
- Archive the record.
- Apply an approved relationship-handling strategy.

The correct behavior should follow the data architecture.

---

## 6.32 Editing Academic History

Academic history should remain editable because real academic information can change.

Examples:

- Grade correction.
- Credit correction.
- Semester correction.
- Subject information update.

However, changes should be persisted atomically where possible and should immediately invalidate/recalculate affected derived data.

---

## 6.33 Importing Academic Information

Importing academic data is distinct from ordinary manual entry.

Imported data should pass through:

```text
Import
 ↓
Schema Validation
 ↓
Domain Validation
 ↓
Relationship Validation
 ↓
Persistence
```

Import functionality should reuse the same validation rules as ordinary data where practical.

---

## 6.34 Academic Data Integrity

The system should protect relationships between academic entities.

Conceptually:

```text
Program
   ↓
Requirement
   ↓
Subject
   ↓
Academic Record
   ↓
Grade
```

Broken relationships should not be silently accepted.

---

## 6.35 Derived Data Refresh

After relevant changes, derived information should be refreshed.

Examples:

```text
Subject Added
       ↓
Credits / Progress Updated

Grade Changed
       ↓
GPA / Progress Updated

Requirement Changed
       ↓
Requirement Status Updated
```

The preferred implementation is to derive these values from authoritative data rather than maintain many manually synchronized copies.

---

## 6.36 Handling Empty Academic Data

An empty database is a valid initial state.

The application should support:

```text
No Program
No Semesters
No Subjects
No Academic Records
No Goals
```

without treating the state as an application error.

The UI should guide the user toward the next meaningful action.

---

## 6.37 Handling Partial Academic Data

The application should also support partially populated information.

For example:

```text
Program exists
but
No Subjects entered
```

or:

```text
Subjects exist
but
No Grades entered
```

The system should display meaningful partial-progress states rather than generating misleading analytics.

---

## 6.38 Academic Calculation Boundary

Academic-management features should not directly calculate complex metrics.

For example, a Subject page should not independently implement:

```text
GPA Calculation
Program Completion
Credit Progress
```

Instead:

```text
Academic Data
      ↓
Analytics
      ↓
Metric
```

This prevents calculation logic from becoming duplicated across the application.

---

## 6.39 Program Progress Boundary

Program progress should be calculated from:

```text
Required Credits
+
Earned Credits
+
Requirement Completion
```

The exact calculation belongs to the analytics layer.

Academic-management features only maintain the authoritative information required for that calculation.

---

## 6.40 Academic Management and Backup

Academic-management data should be designed with backup compatibility in mind.

New entities should have:

- Stable identifiers.
- Explicit relationships.
- Serializable structures.
- Version-compatible schemas.

This allows backup/restore functionality to operate consistently in Part 8.

---

## 6.41 Academic Management and AI

AI should not be required for academic-management operations.

The following must work without AI:

```text
Create
Read
Update
Delete
Validation
Persistence
Academic Records
Goals
Requirements
```

AI may later provide assistance such as:

- Explaining academic information.
- Suggesting study plans.
- Summarizing progress.

---

## 6.42 Academic Management and Privacy

Academic information should remain local-first according to the approved architecture.

External services should not receive academic data merely because the application contains an AI integration.

Any future external-data flow should be explicit and subject to the privacy/security requirements.

---

## 6.43 Testing Strategy

Each academic entity should receive appropriate tests.

### Unit Tests

Test:

- Validation.
- Domain rules.
- Entity behavior.
- Grade handling.
- Relationship rules.

### Integration Tests

Test:

- Repository operations.
- Persistence.
- State synchronization.
- Feature workflows.

### End-to-End Tests

Test:

```text
Create Academic Data
       ↓
Persist
       ↓
Reload
       ↓
View
       ↓
Edit
       ↓
Verify
```

---

## 6.44 Academic Management Test Scenarios

Important scenarios include:

### Normal

```text
Create valid subject
Create valid semester
Add academic record
Add grade
View information
Edit information
```

### Empty

```text
No academic data
No subjects
No grades
```

### Invalid

```text
Invalid credits
Invalid grade
Invalid relationship
Missing required data
```

### Edge Cases

```text
Zero credits
Repeated subject
Changed grade
Incomplete semester
Multiple academic records where supported
```

The exact scenarios should be expanded as the data model becomes finalized.

---

## 6.45 Feature Completion Criteria

An academic-management feature is considered complete when:

```text
Domain
+
Validation
+
Persistence
+
State
+
UI
+
Tests
```

are all working together.

A UI that only displays mock data is not considered a completed feature.

---

## 6.46 Academic Management MVP Scope

R1 should prioritize the academic-management functionality required to answer:

> "What have I studied, what am I currently studying, what have I completed, and what remains?"

This means the MVP should focus on:

```text
Program
Semesters
Subjects
Academic Records
Grades
Credits
Requirements
Goals
```

Only the approved minimum functionality should be implemented for each.

---

## 6.47 Scope Protection

The following should not automatically enter R1:

- Complex curriculum planning.
- Automated course scheduling.
- Social features.
- Multi-user collaboration.
- Cloud synchronization.
- Advanced recommendation engines.
- Predictive academic models.
- AI-driven academic decisions.

These require separate scope decisions.

---

## 6.48 Academic Management Development Order

Recommended sequence:

```text
Subject
   ↓
Semester
   ↓
Academic Record
   ↓
Grade
   ↓
Program
   ↓
Requirements
   ↓
Goals
```

The exact order may be adjusted if the finalized data model establishes different dependencies.

---

## 6.49 Phase Checkpoint

Before moving to Analytics & Dashboard implementation, verify:

### Data

- Academic data can be created.
- Academic data can be edited.
- Academic data can be retrieved.
- Academic data can be deleted/archived according to defined rules.

### Persistence

- Data survives application restart.
- Relationships remain valid.
- Invalid data is rejected.

### Architecture

- UI does not directly access IndexedDB.
- Domain logic does not depend on React.
- Analytics logic has not leaked into feature components.

### Testing

- Core academic workflows pass.
- Important edge cases are covered.
- Persistence workflows pass.

---

## 6.50 Part 6 Rules

The following rules apply:

1. Academic information is authoritative application data.
2. Derived metrics should be calculated from authoritative data.
3. Subject definitions and academic records should remain conceptually distinct.
4. Academic-management features must use the persistence boundary.
5. UI components must not directly access IndexedDB.
6. Validation must occur before authoritative data is persisted.
7. Invalid academic data must not silently enter the dataset.
8. Duplicate data should be handled according to defined uniqueness rules.
9. Academic relationships must remain valid.
10. Changes to authoritative data must invalidate affected derived information.
11. Empty and partially populated datasets are valid states.
12. Academic-management features should not independently implement complex analytics.
13. AI is not required for academic-management functionality.
14. Academic data should remain local-first unless an explicit future requirement changes this.
15. Imported academic data must be validated before persistence.
16. Destructive actions require appropriate protection.
17. Academic data should remain serializable for future backup/restore.
18. Features should be implemented as complete vertical slices where practical.
19. R1 should contain only approved MVP functionality.
20. Academic-management implementation must remain aligned with the approved architecture and data model.

---

## 6.51 Acceptance Criteria

Part 6 is considered complete when:

- Academic profile implementation scope is defined.
- Program implementation scope is defined.
- Semester implementation scope is defined.
- Subject implementation scope is defined.
- Academic record implementation scope is defined.
- Grade implementation scope is defined.
- Credit implementation scope is defined.
- Requirement implementation scope is defined.
- Goal implementation scope is defined.
- CRUD strategy is defined.
- Validation strategy is defined.
- Duplicate handling is defined.
- Relationship integrity is defined.
- Persistence integration is defined.
- State synchronization is defined.
- First academic vertical slice is defined.
- Academic UI principles are defined.
- Empty and partial-data handling is defined.
- Import handling is defined.
- Backup compatibility requirements are defined.
- AI boundary is defined.
- Privacy boundary is defined.
- Testing strategy is defined.
- MVP scope is defined.
- Scope protection rules are defined.
- Phase checkpoint is defined.

# Part 7 — Analytics & Dashboard Implementation

## 7.1 Purpose

This part defines how Academic OS will calculate, organize, and present academic analytics.

The primary objective is to transform authoritative academic data into reliable, understandable information that helps the user answer:

> "How am I doing academically, and how far am I from my goals?"

This part covers:

- Academic calculations.
- Credit progress.
- Program progress.
- Requirement progress.
- Goal tracking.
- Academic trends.
- Dashboard information hierarchy.
- Dashboard components.
- Visualization principles.
- Analytics validation.
- Dashboard refresh behavior.
- Separation between analytics and UI.

The implementation must follow the architecture established in previous parts.

---

## 7.2 Analytics Principle

Analytics must be derived from authoritative academic data.

The intended flow is:

```text
Authoritative Academic Data
          ↓
Analytics Engine
          ↓
Derived Metrics
          ↓
Dashboard View Models
          ↓
UI Components
```

The dashboard must not become the source of truth.

---

## 7.3 Authoritative vs Derived Data

Academic OS should distinguish between:

### Authoritative Data

Data entered or explicitly configured by the user:

```text
Program
Semester
Subject
Academic Record
Grade
Credits
Requirement
Goal
```

### Derived Data

Values calculated from authoritative data:

```text
GPA
Earned Credits
Remaining Credits
Completion Percentage
Requirement Progress
Goal Progress
Academic Trends
```

Derived values should be recalculated rather than independently maintained wherever practical.

---

## 7.4 Analytics Layer Responsibility

The analytics layer is responsible for:

- Calculating academic metrics.
- Applying academic rules.
- Handling edge cases.
- Producing deterministic results.
- Providing structured results to the application.

The analytics layer should not be responsible for:

- Rendering UI.
- Managing page layout.
- Selecting colors.
- Rendering charts.
- Handling navigation.

Conceptually:

```text
Analytics
   ↓
Data / Metrics
   ↓
Dashboard
```

not:

```text
Analytics
   ↓
React Components
   ↓
Charts
```

---

## 7.5 Deterministic Calculations

Core academic metrics should be deterministic.

Given the same authoritative dataset:

```text
Input Dataset A
      ↓
Analytics
      ↓
Result A

Same Dataset A
      ↓
Analytics
      ↓
Same Result A
```

The same data should produce the same result.

Runtime AI should not be required to calculate core academic metrics.

---

## 7.6 GPA Calculation

GPA should be calculated from the academic records and their applicable grade values.

A weighted GPA can conceptually be represented as:

```text
GPA =
Σ(Grade Point × Applicable Credits)
/
Σ(Applicable Credits)
```

The exact calculation rules must follow the configured grading system.

The implementation should not assume that every academic program uses the same grade scale.

---

## 7.7 GPA Configuration

The grading system should be configurable enough to support the user's academic context.

Potential configuration includes:

```text
Grade
Grade Point
Completion Status
GPA Eligibility
```

For example:

```text
Grade → Point
A     → configured value
B+    → configured value
B     → configured value
...
```

The exact mapping should be determined by the user's academic rules.

---

## 7.8 GPA Edge Cases

The GPA engine should explicitly handle:

- No academic records.
- No graded records.
- Pass/fail records.
- Incomplete records.
- Records without GPA eligibility.
- Repeated subjects where supported.
- Invalid grades.

The analytics layer should never silently produce a misleading GPA.

For example:

```text
No GPA-eligible records
        ↓
No meaningful GPA
```

rather than:

```text
No records
   ↓
GPA = 0
```

unless `0` is explicitly defined as the intended representation.

---

## 7.9 Credit Metrics

Academic OS should calculate at least:

```text
Required Credits
Earned Credits
Remaining Credits
```

Where applicable, it may also distinguish:

```text
Attempted Credits
Completed Credits
GPA-Applicable Credits
```

The exact set should remain within the approved R1 scope.

---

## 7.10 Credit Progress

Credit completion can be represented as:

```text
Credit Progress =
Earned Credits
/
Required Credits
× 100
```

The result should be bounded appropriately for presentation.

For example, the UI should not display:

```text
125% completed
```

as normal program progress unless the product explicitly chooses to represent over-completion.

The underlying data should remain accurate even when earned credits exceed the nominal requirement.

---

## 7.11 Remaining Credits

Remaining credits should be derived from:

```text
Required Credits - Earned Credits
```

with appropriate handling when earned credits exceed required credits.

The user should not be shown a negative "remaining credits" value unless that is an intentional product decision.

---

## 7.12 Program Progress

Program progress should consider the academic requirements established in Part 6.

Conceptually:

```text
Program
   ↓
Requirements
   ↓
Academic Records
   ↓
Completion Status
```

The analytics engine should provide a structured representation of program completion.

---

## 7.13 Requirement Progress

Requirement progress should be evaluated independently where necessary.

For example:

```text
General Education
Major Requirements
Electives
Credit Requirements
```

The system should distinguish between:

```text
Overall Program Progress
```

and:

```text
Requirement Category Progress
```

This allows the dashboard to identify situations where total credits look healthy but a specific graduation requirement remains incomplete.

---

## 7.14 Requirement Status

Requirements may be represented as:

```text
Not Started
In Progress
Completed
```

The exact states should remain aligned with Part 6.

The analytics layer determines the current status from authoritative academic data.

---

## 7.15 Goal Progress

Personal goals should be analyzed separately from formal requirements.

Examples:

```text
Target GPA
Target Credits
Semester GPA Target
Graduation Target
```

Conceptually:

```text
Goal
 ↓
Current Metric
 ↓
Target
 ↓
Progress / Status
```

A goal should never be presented as an official academic requirement.

---

## 7.16 Goal Status

A goal may produce information such as:

```text
Not Started
In Progress
Achieved
At Risk
```

The exact status rules should remain simple and deterministic.

"At Risk" should only be introduced where the system has a clear, explainable rule for determining it.

---

## 7.17 Academic Trends

Academic OS may provide trend information based on historical academic records.

Potential trends include:

```text
Semester GPA
Credits Completed per Semester
Cumulative GPA
Requirement Completion
```

Trend calculations should use actual stored records.

The system should not infer future academic outcomes unless an explicit predictive feature is later approved.

---

## 7.18 Semester Analytics

Each completed or relevant semester may produce:

```text
Semester GPA
Credits Attempted
Credits Earned
Subjects Completed
Subjects Incomplete
```

Semester analytics should remain separate from cumulative analytics.

---

## 7.19 Cumulative Analytics

Cumulative analytics should summarize academic progress across the program.

Examples:

```text
Cumulative GPA
Total Earned Credits
Remaining Credits
Overall Completion
Requirements Completed
Requirements Remaining
```

These metrics form the core of the academic monitoring experience.

---

## 7.20 Dashboard Purpose

The dashboard should answer the most important academic questions quickly.

Primary questions:

```text
Where am I now?
How much have I completed?
How am I performing?
What remains?
Am I meeting my goals?
What needs attention?
```

The dashboard should prioritize decision-useful information rather than displaying every available metric.

---

## 7.21 Dashboard Information Hierarchy

The dashboard should use an information hierarchy.

Recommended structure:

```text
Top-Level Summary
        ↓
Current Academic Status
        ↓
Progress
        ↓
Performance
        ↓
Requirements
        ↓
Goals
        ↓
Trends
```

The exact visual layout may evolve during UI implementation.

---

## 7.22 Dashboard Summary

The top section should provide a concise academic snapshot.

Potential metrics:

```text
Current GPA
Earned Credits
Remaining Credits
Program Progress
Current Semester
```

Only metrics that are meaningful from the available data should be displayed.

---

## 7.23 Dashboard Progress Section

The progress area should communicate:

```text
Overall Program Progress
Credit Completion
Requirement Completion
```

Progress indicators should make the remaining work understandable.

A progress percentage should always have a meaningful denominator.

---

## 7.24 Dashboard Performance Section

The performance section may contain:

```text
Cumulative GPA
Latest Semester GPA
Recent Academic Performance
```

The dashboard should avoid excessive metric duplication.

For example, if the current GPA is already prominently displayed, repeating the same number in multiple cards without additional context provides little value.

---

## 7.25 Dashboard Requirement Section

The dashboard should surface incomplete requirements that matter to graduation progress.

Potential presentation:

```text
Requirement Category
Progress
Remaining
Status
```

The purpose is to answer:

> "What am I still missing?"

rather than simply displaying a large list of completed items.

---

## 7.26 Dashboard Goal Section

The dashboard should display active personal academic goals.

For example:

```text
Target GPA
Current GPA
Status
```

or:

```text
Target Credits
Current Credits
Remaining
```

Goals should remain visually distinct from official academic requirements.

---

## 7.27 Dashboard Trend Section

Trend visualizations may include:

```text
Semester GPA Trend
Credit Progress Over Time
```

Charts should only be used when historical data is sufficient to make them meaningful.

For example:

```text
One semester of data
      ↓
Limited trend value
```

The UI should not create misleading charts simply because a chart component exists.

---

## 7.28 Dashboard Empty State

When there is insufficient data:

```text
No Academic Data
```

should not be treated as an error.

The dashboard should provide a useful next action.

Example:

```text
No academic records yet.

Start by adding your program or first semester.
```

The exact copy will be determined during UI development.

---

## 7.29 Dashboard Partial Data

The dashboard should handle partially configured academic data.

Examples:

```text
Program exists
No grades yet
```

or:

```text
Subjects exist
No program requirements configured
```

The dashboard should display only metrics that can be calculated reliably.

It should not invent missing values.

---

## 7.30 Analytics Result Model

Analytics should return structured results rather than presentation-specific strings.

For example, conceptually:

```text
{
    value: 3.52,
    status: ...,
    context: ...,
    metadata: ...
}
```

The exact TypeScript types will be defined during implementation.

The analytics layer should avoid returning strings such as:

```text
"Your GPA is 3.52"
```

because presentation wording belongs to the UI layer.

---

## 7.31 Dashboard View Models

A dashboard-specific view-model layer may transform analytics results into structures convenient for presentation.

Conceptually:

```text
Academic Data
      ↓
Analytics
      ↓
Dashboard View Model
      ↓
UI
```

This keeps the analytics layer independent from dashboard layout decisions.

---

## 7.32 Analytics Recalculation

Analytics should be recalculated when authoritative data changes.

Example:

```text
Grade Updated
     ↓
Academic Data Updated
     ↓
Analytics Recalculated
     ↓
Dashboard Updated
```

The implementation should avoid stale metrics.

---

## 7.33 Performance

Analytics should initially prioritize correctness and maintainability.

The system should not prematurely introduce:

- Complex caching.
- Distributed computation.
- Background analytics infrastructure.
- External analytics services.

If performance problems emerge with realistic datasets, optimization can be introduced based on evidence.

---

## 7.34 Memoization and Caching

Derived calculations may be memoized where appropriate.

However, caching must not create stale academic information.

The rule is:

```text
Correctness > Performance Optimization
```

A cache should be invalidated when the authoritative data it depends on changes.

---

## 7.35 Analytics Validation

Every major metric should have explicit validation.

Examples:

```text
Known Dataset
      ↓
Expected GPA
      ↓
Actual GPA
      ↓
Compare
```

Test datasets should cover normal and edge cases.

---

## 7.36 GPA Test Example

A representative test might define:

```text
Subject A
3 credits
Grade A
Point 4.0

Subject B
3 credits
Grade B
Point 3.0
```

Expected result:

```text
GPA = 3.50
```

The actual test data and grading scale should match the configured academic system.

---

## 7.37 Credit Test Example

Given:

```text
Required Credits = 126
Earned Credits = 84
```

the analytics layer should calculate:

```text
Remaining Credits = 42
Credit Progress ≈ 66.67%
```

The underlying implementation should preserve sufficient precision while the UI can choose an appropriate display precision.

---

## 7.38 Requirement Test Example

Given:

```text
Required Subjects = 10
Completed Subjects = 7
```

the analytics layer should produce a structured result representing:

```text
7 completed
3 remaining
70% completion
```

The exact requirement logic depends on the configured program.

---

## 7.39 Trend Test Example

Given multiple semester records:

```text
Semester 1 → GPA
Semester 2 → GPA
Semester 3 → GPA
```

the analytics layer should return an ordered time series.

The UI can then decide whether to display:

```text
Line Chart
Table
Summary
```

---

## 7.40 Analytics Error Handling

Analytics should handle invalid or incomplete input safely.

Potential conditions:

```text
Missing Program
No Grades
Invalid Grade
Missing Credits
Broken Relationship
Incomplete Requirement
```

The system should distinguish:

```text
No Data
```

from:

```text
Invalid Data
```

These are not the same condition.

---

## 7.41 Dashboard Error Handling

The dashboard should avoid collapsing completely because one metric fails.

Where possible:

```text
Metric A → Available
Metric B → Available
Metric C → Error
```

should allow the rest of the dashboard to remain usable.

The UI should communicate the affected metric clearly.

---

## 7.42 Visualization Principles

Charts should be used when they improve understanding.

Preferred:

```text
Simple
Readable
Purposeful
Consistent
Accessible
```

Avoid:

```text
Decorative Charts
Excessive Animation
Unnecessary 3D
Overloaded Graphs
```

The dashboard is a monitoring tool, not a visualization showcase.

---

## 7.43 Chart Selection

Recommended uses:

| Information | Suitable Visualization |
|---|---|
| Overall completion | Progress indicator |
| GPA trend | Line chart |
| Requirement categories | Progress bars / compact chart |
| Credits completed | Progress indicator |
| Semester comparison | Bar chart or table |
| Detailed records | Table |

The final UI should use the simplest visualization that communicates the information effectively.

---

## 7.44 Accessibility

Dashboard analytics should not rely on color alone.

For example:

```text
Good
Warning
Incomplete
```

should be distinguishable using combinations of:

- Text.
- Icons.
- Labels.
- Position.
- Visual indicators.

Charts should have meaningful labels and accessible alternatives where appropriate.

---

## 7.45 Responsive Dashboard

The dashboard should work across:

```text
Desktop
Laptop
Tablet
Mobile
```

The information hierarchy should remain intact when the layout changes.

A mobile layout may stack dashboard sections rather than attempting to preserve a desktop grid.

---

## 7.46 Dashboard Loading Strategy

When academic data is loading:

```text
Loading State
```

should be displayed.

Skeletons or equivalent patterns may be used where useful.

The application should avoid showing misleading zero values during loading.

---

## 7.47 Dashboard Refresh Strategy

The dashboard should update after successful authoritative data changes.

For example:

```text
Edit Grade
   ↓
Save
   ↓
Persistence Success
   ↓
Analytics Refresh
   ↓
Dashboard Refresh
```

The dashboard should not require a full browser refresh for normal data changes.

---

## 7.48 Dashboard Navigation

The dashboard should provide useful paths to detailed information.

For example:

```text
GPA Card
   ↓
Academic Records

Requirement Progress
   ↓
Requirements

Semester Performance
   ↓
Semester Details
```

The dashboard should act as an overview rather than replacing detailed management screens.

---

## 7.49 Analytics and Goals

Goal analytics should be transparent.

If a goal is shown as:

```text
At Risk
```

the user should be able to understand why.

The system should avoid unexplained AI-style judgments.

For R1, deterministic rules are preferred.

---

## 7.50 Analytics and AI Boundary

AI must not determine authoritative academic metrics.

AI may later assist with:

```text
Explanation
Summary
Planning Suggestions
Study Recommendations
```

But:

```text
GPA
Credits
Requirement Completion
Program Progress
```

must remain deterministic.

---

## 7.51 Analytics and Privacy

Analytics should operate locally on the user's academic dataset whenever possible.

No external analytics service should be required to calculate:

```text
GPA
Credits
Progress
Requirements
Goals
```

Academic data should not leave the local environment merely to generate basic dashboard metrics.

---

## 7.52 R1 Analytics Scope

R1 should prioritize:

```text
Current GPA
Semester GPA
Earned Credits
Remaining Credits
Program Progress
Requirement Progress
Goal Progress
Basic Academic Trends
```

Only metrics that can be calculated reliably from the user's configured data should be displayed.

---

## 7.53 R1 Dashboard Scope

The R1 dashboard should provide:

```text
Academic Summary
Progress Overview
Performance Overview
Requirement Status
Goal Status
Basic Trends
```

The dashboard should remain focused on academic monitoring.

---

## 7.54 Out-of-Scope Analytics

The following should not automatically enter R1:

- Predictive GPA.
- Graduation probability.
- AI-generated risk scores.
- Advanced forecasting.
- Peer comparison.
- University-wide benchmarking.
- Social comparison.
- Complex machine-learning analytics.

These require separate product and methodological decisions.

---

## 7.55 Analytics Development Order

Recommended implementation sequence:

```text
GPA
   ↓
Credit Metrics
   ↓
Program Progress
   ↓
Requirement Progress
   ↓
Goal Progress
   ↓
Semester Analytics
   ↓
Trend Analytics
   ↓
Dashboard View Models
   ↓
Dashboard UI
```

This follows the dependency relationship between the metrics.

---

## 7.56 First Analytics Milestone

The first analytics milestone should prove:

```text
Academic Records
      ↓
GPA Calculation
      ↓
Credit Calculation
      ↓
Program Progress
      ↓
Display Result
```

This provides the first meaningful monitoring capability of Academic OS.

---

## 7.57 Analytics Testing Strategy

Testing should include:

### Unit Tests

- GPA.
- Credits.
- Progress.
- Requirements.
- Goals.
- Trends.

### Integration Tests

- Academic data → analytics.
- Updated grade → recalculated metrics.
- Updated credits → updated progress.

### UI Tests

- Metric display.
- Empty states.
- Partial data.
- Loading states.
- Error states.

---

## 7.58 Analytics Test Data

The project should maintain controlled test datasets.

Examples:

```text
Empty Dataset
Minimal Dataset
Normal Dataset
Large Dataset
Invalid Dataset
Edge-Case Dataset
```

These datasets should be reusable across analytics tests.

---

## 7.59 Large Dataset Consideration

Academic OS is primarily a personal academic dashboard.

Therefore, R1 does not require optimization for massive datasets.

The system should remain efficient for realistic personal academic data.

Performance optimization should be introduced only if actual use demonstrates a need.

---

## 7.60 Dashboard Acceptance

The dashboard should be considered functionally complete when:

- It displays validated metrics.
- Metrics correspond to current academic data.
- Empty states work.
- Partial data works.
- Errors are handled.
- Navigation to details works.
- Responsive behavior works.
- Accessibility requirements are reasonably satisfied.
- No metric is calculated directly inside presentation components.

---

## 7.61 Phase Checkpoint

Before moving to Backup & Restore implementation, verify:

### Analytics

- GPA is correct.
- Credit calculations are correct.
- Program progress is correct.
- Requirement progress is correct.
- Goal progress is correct.
- Trends are correct where applicable.

### Dashboard

- Summary works.
- Progress works.
- Performance works.
- Requirements work.
- Goals work.
- Trends work.

### Architecture

- Analytics is independent from UI.
- Dashboard does not become a calculation engine.
- Derived values update after authoritative data changes.

### Testing

- Core calculations are covered.
- Edge cases are covered.
- UI states are covered.

---

## 7.62 Part 7 Rules

The following rules apply:

1. Analytics consume authoritative academic data.
2. Derived metrics should not become independent sources of truth.
3. Core academic calculations must be deterministic.
4. GPA calculation must follow the configured grading system.
5. Empty data must not automatically become zero-valued academic metrics.
6. Credit progress must use a meaningful denominator.
7. Requirement progress must consider the actual requirement structure.
8. Personal goals must remain distinct from formal requirements.
9. Analytics must remain independent from UI rendering.
10. Dashboard components must not contain duplicated academic calculation logic.
11. Derived metrics must refresh after authoritative data changes.
12. Caching must not produce stale academic information.
13. Dashboard visualizations should prioritize clarity over decoration.
14. Color must not be the only way to communicate status.
15. Dashboard content should remain useful with partial data.
16. Basic analytics should work without external services.
17. AI must not determine authoritative academic metrics.
18. R1 should prioritize monitoring rather than predictive analytics.
19. Predictive and advanced analytics require separate scope decisions.
20. Analytics and dashboard functionality must remain aligned with the academic data model.

---

## 7.63 Acceptance Criteria

Part 7 is considered complete when:

- Analytics responsibilities are defined.
- Authoritative and derived data boundaries are defined.
- Deterministic calculation requirements are defined.
- GPA calculation requirements are defined.
- GPA configuration requirements are defined.
- GPA edge cases are defined.
- Credit metrics are defined.
- Credit progress is defined.
- Remaining credits are defined.
- Program progress is defined.
- Requirement progress is defined.
- Goal progress is defined.
- Academic trends are defined.
- Semester analytics are defined.
- Cumulative analytics are defined.
- Dashboard purpose is defined.
- Dashboard hierarchy is defined.
- Dashboard summary is defined.
- Dashboard progress section is defined.
- Dashboard performance section is defined.
- Dashboard requirement section is defined.
- Dashboard goal section is defined.
- Dashboard trend section is defined.
- Empty and partial dashboard states are defined.
- Analytics result boundaries are defined.
- Dashboard view-model boundaries are defined.
- Analytics refresh behavior is defined.
- Visualization principles are defined.
- Accessibility requirements are defined.
- Responsive requirements are defined.
- Analytics error handling is defined.
- AI boundaries are defined.
- Privacy boundaries are defined.
- R1 analytics scope is defined.
- R1 dashboard scope is defined.
- Out-of-scope analytics are defined.
- Analytics testing strategy is defined.
- Dashboard acceptance criteria are defined.
- Phase checkpoint is defined.

# Part 8 — Backup & Restore Implementation

## 8.1 Purpose

This part defines the implementation strategy for protecting, exporting, restoring, and validating Academic OS data.

The objective is to ensure that the user's academic information can be recovered reliably without requiring a cloud backend.

The backup system must protect:

- Academic profile.
- Academic program.
- Semesters.
- Subjects.
- Academic records.
- Grades.
- Credits.
- Requirements.
- Goals.
- Other persistent application data approved for backup.

The system must preserve the local-first architecture established in previous parts.

---

## 8.2 Backup Principle

Academic OS should treat backup as a user-controlled data-protection mechanism.

The intended flow is:

```text
Academic OS Data
      ↓
Backup Generator
      ↓
Validated Backup Package
      ↓
User-controlled Storage
```

Restore follows:

```text
Backup Package
      ↓
Validation
      ↓
Compatibility Check
      ↓
Integrity Check
      ↓
Restore
      ↓
IndexedDB
      ↓
Application
```

---

## 8.3 Local-First Backup Strategy

The primary backup strategy for R1 should not depend on a remote cloud service.

The user should be able to export their data to a file and store it wherever they choose.

Examples:

```text
Local Computer
USB Drive
External Drive
Cloud Storage
```

Cloud storage may be used by the user manually, but Academic OS does not need to provide cloud synchronization for R1.

---

## 8.4 Backup Ownership

The user owns the exported backup.

Academic OS should not require:

- Account registration.
- Cloud storage.
- Third-party storage.
- External analytics services.

to perform a basic backup.

---

## 8.5 Backup Format

R1 should use a structured, portable format.

Recommended:

```text
JSON
```

A backup should contain both:

```text
Metadata
+
Application Data
```

Conceptually:

```json
{
  "metadata": {},
  "data": {}
}
```

The exact schema will be defined during implementation.

---

## 8.6 Backup Metadata

The backup metadata should provide enough information to identify and validate the backup.

Potential fields include:

```text
Application Identifier
Backup Format Version
Schema Version
Created At
Application Version
```

Optional metadata may include:

```text
Backup ID
Description
```

The metadata should not contain unnecessary personal information.

---

## 8.7 Backup Versioning

Backup files must be versioned.

Conceptually:

```text
Backup Format v1
       ↓
Backup Format v2
       ↓
Future Versions
```

This allows future versions of Academic OS to identify older backups.

The application must not assume that every backup file uses the current schema.

---

## 8.8 Schema Version

The backup should contain a schema version independent from the application version.

For example:

```text
applicationVersion
schemaVersion
backupVersion
```

These values have different purposes.

### Application Version

Identifies the application release.

### Schema Version

Identifies the structure of stored data.

### Backup Version

Identifies the structure of the exported backup package.

---

## 8.9 Backup Contents

The backup should include all authoritative persistent data required to reconstruct the user's academic environment.

At minimum:

```text
Profile
Program
Semesters
Subjects
Academic Records
Requirements
Goals
Configuration
```

Derived analytics should generally not need to be stored.

For example:

```text
GPA
Progress Percentage
Trend Metrics
```

should be recalculated from authoritative data after restore.

---

## 8.10 Authoritative vs Derived Backup Data

The backup strategy should follow:

```text
Authoritative Data
        ↓
Backup
        ↓
Restore
        ↓
Recalculate Derived Data
```

rather than:

```text
Authoritative Data
+
Every Derived Metric
        ↓
Backup
```

This reduces duplication and minimizes the risk of restoring stale analytics.

---

## 8.11 Backup Generation

When the user requests a backup:

```text
User
 ↓
Create Backup
 ↓
Collect Persistent Data
 ↓
Build Backup Object
 ↓
Validate Backup
 ↓
Serialize
 ↓
Download / Save
```

The backup should only be presented as successfully created after the package has passed validation.

---

## 8.12 Backup Validation

Before export, the application should verify:

- Required entities exist where expected.
- Relationships are structurally valid.
- Data can be serialized.
- Schema information is present.
- Backup metadata is valid.

A malformed backup should not be intentionally generated.

---

## 8.13 Backup File Naming

The exported file should have a predictable filename.

Conceptually:

```text
academic-os-backup-YYYY-MM-DD.json
```

The exact naming convention can be finalized during implementation.

---

## 8.14 Restore Principle

Restore is a potentially destructive operation.

Therefore:

```text
Select Backup
      ↓
Validate
      ↓
Preview / Confirm
      ↓
Create Recovery Point
      ↓
Restore
      ↓
Verify
```

The application should not immediately overwrite the existing dataset merely because the user selected a file.

---

## 8.15 Restore Validation

A backup should be validated before any existing data is modified.

Validation should include:

```text
File Format
Schema Version
Required Metadata
Entity Structure
Identifiers
Relationships
Data Types
Required Fields
```

Invalid data should be rejected before persistence.

---

## 8.16 Restore Compatibility

The application should determine whether a backup is:

```text
Fully Compatible
Compatible with Migration
Unsupported
Invalid
```

Where practical, older schemas may be migrated.

Unsupported versions should not be silently restored.

---

## 8.17 Migration Strategy

If a future schema changes:

```text
Old Backup
    ↓
Migration Layer
    ↓
Current Schema
    ↓
Validation
    ↓
Restore
```

Migration should be explicit and testable.

The system should avoid directly loading an incompatible historical structure into the current database.

---

## 8.18 Restore Atomicity

Restore should aim to behave atomically.

Conceptually:

```text
Restore Starts
      ↓
Validation
      ↓
Prepare Data
      ↓
Write
      ↓
Verify
      ↓
Commit
```

If the restore cannot be completed safely, the application should avoid leaving the database in a partially restored state.

The exact IndexedDB transaction strategy will be defined during implementation.

---

## 8.19 Recovery Point Before Restore

Before replacing existing data, the application should create a recovery point where practical.

Recommended flow:

```text
Existing Data
     ↓
Automatic Safety Backup
     ↓
Restore New Backup
```

This provides a fallback if the user selects the wrong backup.

---

## 8.20 Restore Confirmation

Because restore may replace existing data, the UI should clearly communicate the consequences.

The confirmation should make clear:

- Existing data may be replaced.
- The selected backup's date/version.
- Whether the backup is compatible.
- Whether a safety backup will be created.

The user should explicitly confirm the operation.

---

## 8.21 Restore Modes

R1 should prioritize:

```text
Full Restore
```

A full restore replaces the application's persistent dataset with the selected backup.

Selective restore may be considered later.

---

## 8.22 Selective Restore

Selective restore could eventually allow:

```text
Restore Subjects
Restore Semesters
Restore Goals
Restore Program
```

However, selective restoration introduces relationship and conflict complexity.

Therefore:

```text
Selective Restore → Future Scope
```

unless explicitly required for R1.

---

## 8.23 Conflict Handling

Full restore minimizes many conflict scenarios because the backup becomes the authoritative dataset.

For future selective restore, conflicts could include:

```text
Same Subject ID
Different Subject Data
Same Semester ID
Different Grade
```

These should not be handled implicitly.

Conflict-resolution behavior requires a separate product decision.

---

## 8.24 Duplicate Handling During Restore

The restore process must not blindly append backup records to the existing database.

R1 full restore should:

```text
Replace Existing Dataset
```

rather than:

```text
Append Backup Dataset
```

This prevents duplicate entities.

---

## 8.25 Relationship Integrity

Relationships must remain valid after restoration.

For example:

```text
Semester
   ↓
Subject
   ↓
Academic Record
   ↓
Grade
```

If a restored academic record references a nonexistent subject, the restore must fail validation.

---

## 8.26 Identifier Integrity

Persistent entities should use stable identifiers.

Examples:

```text
Program ID
Semester ID
Subject ID
Academic Record ID
Goal ID
Requirement ID
```

Backup and restore must preserve these identifiers unless a migration explicitly requires changes.

---

## 8.27 Referential Integrity

Before committing a restore, the application should verify references.

Conceptually:

```text
Record.subjectId
       ↓
Subject exists?
       ↓
Yes → Continue
No  → Reject
```

The same principle applies to other entity relationships.

---

## 8.28 Data Type Validation

The restore process should verify that fields have the expected types.

Examples:

```text
Credits → Number
Name → String
Status → Allowed Enum
ID → Valid Identifier
Date → Valid Date Representation
```

Unexpected types should cause validation failure rather than silent coercion where data could be corrupted.

---

## 8.29 Domain Validation

Structural validation is not sufficient.

Restored data should also pass domain rules.

For example:

```text
Credits > 0
Grade is supported
Semester relationship is valid
Requirement configuration is valid
```

The same domain rules used during normal data entry should be reused during restore where possible.

---

## 8.30 Backup Integrity

R1 should provide integrity checking sufficient to detect malformed or corrupted backup files.

At minimum:

```text
Schema Validation
Structural Validation
Relationship Validation
Domain Validation
```

Cryptographic integrity mechanisms may be considered later if a concrete requirement emerges.

---

## 8.31 Encryption

R1 does not require built-in backup encryption unless explicitly approved.

However, academic backups may contain sensitive personal information.

The application should therefore:

- Warn users to store backups securely.
- Avoid unnecessary personal information in metadata.
- Avoid sending backups to external services automatically.

Encrypted backups may be considered as a future enhancement.

---

## 8.32 Privacy

Backup operations should remain local.

The application should not automatically upload backups to:

- Cloud storage.
- Analytics services.
- AI services.
- Third-party APIs.

The user controls where the exported file is stored.

---

## 8.33 Backup UX

The backup interface should make the process understandable.

Potential flow:

```text
Settings
   ↓
Backup & Restore
   ↓
Create Backup
   ↓
Download Backup
```

For restore:

```text
Settings
   ↓
Backup & Restore
   ↓
Select Backup
   ↓
Validate
   ↓
Review
   ↓
Confirm
   ↓
Restore
```

---

## 8.34 Backup Status

The application may display basic backup information such as:

```text
Last Backup
Backup Version
Data Included
```

However, R1 should avoid pretending that a backup exists if the application has no reliable way to verify it.

---

## 8.35 Automatic Backup

Automatic backup is not required for R1.

The browser cannot guarantee that a downloaded file remains available to the application.

Therefore:

```text
Automatic Cloud Backup → Out of Scope
Automatic Local File Backup → Out of Scope
```

for the initial release.

The application may remind users to create backups where appropriate, but the exact reminder mechanism should be separately evaluated.

---

## 8.36 Backup Frequency

Because backup is user-controlled in R1, the product should provide clear guidance rather than enforce a specific schedule.

Potential recommendation:

```text
Before major changes
Before application updates
After significant academic updates
```

The final UX copy will be handled during UI implementation.

---

## 8.37 Backup and Application Updates

Application updates should not automatically invalidate valid backups.

The versioning system should allow:

```text
Older Backup
     ↓
Compatibility Check
     ↓
Migration if Supported
     ↓
Current Schema
```

If migration is not supported, the user should be clearly informed.

---

## 8.38 Backup and Database Schema Changes

Whenever the IndexedDB schema changes:

```text
Database Migration
       +
Backup Schema Consideration
```

must be evaluated together.

The development workflow should include backup compatibility tests when persistent entities change.

---

## 8.39 Restore Verification

After restoration:

```text
Restored Data
     ↓
Validation
     ↓
Recalculate Analytics
     ↓
Load Application
     ↓
Verify Dashboard
```

The dashboard should reflect the restored authoritative data.

---

## 8.40 Restore Verification Checklist

After restore, verify:

- Program exists.
- Semesters exist.
- Subjects exist.
- Academic records exist.
- Requirements exist.
- Goals exist.
- Relationships are valid.
- Analytics recalculate correctly.
- Dashboard reflects restored data.

---

## 8.41 Failed Restore

If restoration fails:

```text
Existing Dataset
       ↓
Must Remain Usable
```

The application should provide a clear error.

It should not leave the user with a partially restored database.

---

## 8.42 Recovery from Failed Restore

If a restore fails after a recovery point has been created:

```text
Failed Restore
      ↓
Recovery Point
      ↓
Restore Previous Dataset
```

The user should not need to manually reconstruct their academic records.

---

## 8.43 Backup Testing Strategy

Backup and restore should be tested as a complete workflow.

### Unit Tests

Test:

- Serialization.
- Schema validation.
- Version validation.
- Domain validation.
- Relationship validation.
- Migration functions.

### Integration Tests

Test:

```text
IndexedDB
   ↓
Backup
   ↓
Restore
   ↓
IndexedDB
```

### End-to-End Tests

Test:

```text
Create Academic Data
       ↓
Backup
       ↓
Modify / Delete Data
       ↓
Restore
       ↓
Verify Original State
```

---

## 8.44 Backup Test Dataset

Testing should include:

```text
Empty Dataset
Minimal Dataset
Normal Academic Dataset
Complex Relationship Dataset
Invalid Dataset
Old Schema Dataset
```

The normal academic dataset should contain enough entities to test relationships between:

```text
Program
Semester
Subject
Academic Record
Requirement
Goal
```

---

## 8.45 Corrupted Backup Testing

The system should test malformed backup files such as:

```text
Invalid JSON
Missing Metadata
Missing Data
Invalid Schema Version
Invalid Entity
Broken Relationship
Invalid Data Type
```

All should be rejected safely.

---

## 8.46 Large Backup Testing

Although Academic OS is designed for personal academic data, the backup system should be tested with reasonably larger datasets.

The purpose is to ensure that:

- Serialization works.
- Validation works.
- Restore remains reliable.
- UI remains responsive enough for realistic use.

Extreme-scale optimization is not required for R1.

---

## 8.47 Backup and Analytics

Derived analytics should not be treated as authoritative backup data.

After restore:

```text
Restored Academic Data
       ↓
Analytics Recalculation
       ↓
Fresh GPA
Fresh Progress
Fresh Requirement Status
Fresh Goal Status
```

This ensures the dashboard reflects the restored dataset.

---

## 8.48 Backup and AI

AI should not participate in core backup or restore operations.

The system must not rely on AI to:

- Validate backup structure.
- Determine whether data is safe to restore.
- Repair corrupted academic records.
- Decide which records to delete.
- Resolve academic-data conflicts.

These operations must remain deterministic.

---

## 8.49 Backup Security Boundary

The application should treat backup files as potentially sensitive.

The system should:

- Avoid unnecessary metadata.
- Avoid automatic uploads.
- Validate imported files.
- Warn before destructive restore.
- Protect existing data with a recovery point where practical.

The application should not claim that plain JSON backups are encrypted or secure against unauthorized access.

---

## 8.50 R1 Backup Scope

R1 should provide:

```text
Manual Full Backup
Manual Full Restore
Backup Validation
Restore Validation
Schema Versioning
Basic Migration Support
Recovery Point Before Restore
Relationship Validation
Analytics Recalculation
Clear Restore Confirmation
```

---

## 8.51 R1 Out-of-Scope Backup Features

The following should remain outside R1 unless separately approved:

- Automatic cloud synchronization.
- Automatic cloud backup.
- Selective restore.
- Multi-device synchronization.
- Conflict resolution UI.
- Encrypted backup format.
- Version history management.
- Remote backup monitoring.
- Third-party storage integration.

---

## 8.52 Backup Development Order

Recommended implementation sequence:

```text
Backup Schema
      ↓
Serialization
      ↓
Backup Validation
      ↓
Export
      ↓
Restore Validation
      ↓
Full Restore
      ↓
Recovery Point
      ↓
Migration Support
      ↓
Restore Verification
      ↓
Backup UI
```

This order keeps the data-protection mechanism independent from the UI.

---

## 8.53 First Backup Milestone

The first milestone should prove:

```text
Existing Academic Data
       ↓
Export JSON
       ↓
Clear / Modify Database
       ↓
Import JSON
       ↓
Validate
       ↓
Restore
       ↓
Verify Original Data
```

This establishes that Academic OS can recover from data loss.

---

## 8.54 Backup Failure Principle

The backup system should fail safely.

Examples:

```text
Invalid Export
   → Do not claim success

Invalid Restore
   → Do not modify existing data

Failed Restore
   → Preserve recovery point

Unsupported Version
   → Reject with clear explanation
```

---

## 8.55 Backup Observability

The application should provide enough feedback for users to understand backup operations.

Examples:

```text
Backup created successfully.
Backup validation failed.
Unsupported backup version.
Restore completed successfully.
Restore failed; existing data was preserved.
```

Exact wording will be determined during UI implementation.

---

## 8.56 Phase Checkpoint

Before moving to AI implementation, verify:

### Backup

- Backup can be generated.
- Backup contains required authoritative data.
- Backup metadata is valid.
- Backup schema is versioned.

### Restore

- Backup can be validated.
- Invalid backups are rejected.
- Existing data is protected.
- Full restore works.
- Relationships remain valid.
- Analytics recalculate.

### Architecture

- Backup does not require cloud services.
- AI is not required.
- Backup logic is separate from UI.
- Database schema changes consider backup compatibility.

### Testing

- Normal backup/restore passes.
- Invalid backups are rejected.
- Failed restore does not destroy existing data.
- Old supported schemas can be migrated.

---

## 8.57 Part 8 Rules

The following rules apply:

1. Backup is a user-controlled data-protection mechanism.
2. R1 backup must work without cloud infrastructure.
3. JSON is the preferred R1 backup format.
4. Backup packages must contain version metadata.
5. Backup schema version must be distinct from application version.
6. Authoritative data should be backed up.
7. Derived analytics should be recalculated after restore.
8. Backup files must be validated before restore.
9. Domain validation must be applied to restored data.
10. Relationship integrity must be verified before restore.
11. R1 should prioritize full restore rather than selective restore.
12. Restore must require explicit user confirmation.
13. A recovery point should be created before destructive restore where practical.
14. Invalid restores must not partially overwrite the existing dataset.
15. Stable identifiers must be preserved.
16. Schema migrations must be explicit and testable.
17. Backup operations must remain independent of AI.
18. Academic backups should not be automatically uploaded to external services.
19. R1 does not require automatic cloud backup.
20. Backup functionality must remain compatible with the local-first architecture.

---

## 8.58 Acceptance Criteria

Part 8 is considered complete when:

- Backup purpose is defined.
- Local-first backup strategy is defined.
- Backup ownership is defined.
- Backup format is defined.
- Backup metadata is defined.
- Backup versioning is defined.
- Schema versioning is defined.
- Backup contents are defined.
- Authoritative vs derived backup data is defined.
- Backup generation is defined.
- Backup validation is defined.
- Restore flow is defined.
- Restore validation is defined.
- Compatibility handling is defined.
- Migration strategy is defined.
- Restore atomicity requirements are defined.
- Recovery-point strategy is defined.
- Restore confirmation is defined.
- R1 restore mode is defined.
- Selective restore scope is defined.
- Conflict handling boundaries are defined.
- Identifier integrity is defined.
- Referential integrity is defined.
- Domain validation is defined.
- Privacy and security boundaries are defined.
- Automatic backup scope is defined.
- Backup update compatibility is defined.
- Restore verification is defined.
- Failed restore handling is defined.
- Backup testing strategy is defined.
- Corrupted backup handling is defined.
- Backup and analytics interaction is defined.
- Backup and AI boundaries are defined.
- R1 backup scope is defined.
- Out-of-scope backup features are defined.
- Backup development order is defined.
- Phase checkpoint is defined.

# Part 9 — AI Implementation

## 9.1 Purpose

This part defines how Artificial Intelligence may be incorporated into Academic OS.

The purpose of AI is to provide additional assistance and interpretation without replacing the deterministic academic management and analytics systems established in previous parts.

AI may help the user understand, plan, summarize, and interact with their academic information.

AI must not become the authoritative source for:

- GPA.
- Credits.
- Academic records.
- Requirement completion.
- Program completion.
- Official academic status.

---

## 9.2 AI Design Principle

The fundamental AI principle is:

```text
Authoritative Academic Data
            ↓
     Deterministic Logic
            ↓
       Verified Metrics
            ↓
          AI Layer
            ↓
 Explanation / Assistance
```

AI consumes trusted information.

It does not determine the underlying academic facts.

---

## 9.3 AI as an Optional Layer

Academic OS should remain functional if AI is unavailable.

The application must continue to support:

```text
Academic Management
Analytics
Dashboard
Backup / Restore
```

without an AI provider.

Therefore:

```text
AI unavailable
      ↓
Core Academic OS continues working
```

AI should enhance the product rather than become a hard dependency.

---

## 9.4 AI Responsibilities

AI may assist with:

- Explaining academic information.
- Summarizing progress.
- Explaining trends.
- Helping interpret requirements.
- Suggesting study or planning approaches.
- Answering questions about the user's stored academic information.
- Generating natural-language summaries.
- Helping the user formulate academic goals.
- Providing contextual recommendations.

The exact R1 feature set is defined later in this part.

---

## 9.5 AI Non-Responsibilities

AI must not be responsible for:

- Calculating GPA.
- Calculating earned credits.
- Determining official completion.
- Determining whether a requirement is officially satisfied.
- Modifying academic records without confirmation.
- Deciding whether a grade is valid.
- Repairing corrupted database records.
- Performing backup validation.
- Performing restore validation.
- Making authoritative graduation decisions.

These remain deterministic application responsibilities.

---

## 9.6 AI Boundary

The following boundary must be maintained:

```text
                 Academic OS
                     │
        ┌────────────┴────────────┐
        ↓                         ↓
 Deterministic System          AI Layer
        │                         │
        ↓                         ↓
 Facts / Metrics            Interpretation
 Rules / Status             Explanation
 Calculations               Suggestions
        │                         │
        └────────────┬────────────┘
                     ↓
                  User
```

The two systems may cooperate, but their responsibilities must remain separate.

---

## 9.7 AI and Academic Metrics

If the user asks:

> "What is my GPA?"

The system should not ask AI to calculate it.

Instead:

```text
Academic Records
      ↓
GPA Engine
      ↓
Verified GPA
      ↓
AI / UI
```

AI may explain the result:

> "Your current GPA is X based on Y completed GPA-eligible credits."

But the value itself must come from deterministic analytics.

---

## 9.8 AI and Requirements

If the user asks:

> "What requirements do I still need?"

The system should first calculate requirement status using the requirement engine.

Then:

```text
Requirement Engine
        ↓
Verified Remaining Requirements
        ↓
AI
        ↓
Natural-language Explanation
```

AI should not independently decide which subjects are required.

---

## 9.9 AI Context

AI should receive only the information necessary for the requested task.

Instead of sending the entire application database, the system should construct a focused context.

Conceptually:

```text
User Question
      ↓
Intent
      ↓
Relevant Data
      ↓
Context Builder
      ↓
AI Model
```

This minimizes unnecessary data exposure.

---

## 9.10 Context Construction

Context may include:

```text
Current GPA
Earned Credits
Remaining Credits
Current Semester
Relevant Subjects
Relevant Requirements
Relevant Goals
Relevant Academic Trends
```

The exact context depends on the user's question.

---

## 9.11 Context Minimization

The system should avoid sending unrelated information.

For example:

```text
Question:
"What requirements do I still need?"
```

does not require:

```text
Personal profile
Unrelated goals
Historical data unrelated to requirements
```

Only relevant requirement and academic-progress information should be provided.

---

## 9.12 Sensitive Data Boundary

Academic information can contain personal information.

Therefore AI requests should follow data minimization principles.

The application should avoid sending:

- Unnecessary personal identifiers.
- Unrelated profile information.
- Internal database identifiers where unnecessary.
- Private metadata unrelated to the request.

Only task-relevant information should be included.

---

## 9.13 External AI Providers

If an external AI provider is used, the application should clearly define what data may be transmitted.

Potential providers may include:

```text
Google Gemini
OpenAI
Other compatible AI provider
```

Provider selection is an implementation/configuration decision and should not alter the AI responsibility boundaries.

---

## 9.14 Provider Abstraction

AI functionality should use an abstraction layer rather than directly coupling the entire application to one provider.

Conceptually:

```text
Academic OS
     ↓
AI Service Interface
     ↓
Provider Adapter
     ↓
AI Provider
```

This allows the provider to be changed without rewriting the entire application.

---

## 9.15 AI Service Interface

The application should expose a controlled AI service interface.

Conceptually:

```text
generateResponse(context, request)
```

The exact implementation will be defined during development.

The rest of the application should not directly call provider-specific SDKs wherever avoidable.

---

## 9.16 AI Configuration

AI configuration may include:

```text
Provider
Model
API Key
Temperature / Generation Settings
Feature Availability
```

Sensitive credentials should never be hard-coded into source code.

---

## 9.17 API Key Security

API keys must not be committed to Git.

They should be managed through appropriate environment or application configuration mechanisms.

The project must not contain:

```text
API_KEY = "real-secret-key"
```

in source-controlled files.

---

## 9.18 Client-Side AI Consideration

Because Academic OS is local-first, direct browser-to-provider communication may expose API credentials or create security concerns.

The implementation must evaluate the security implications before allowing direct client-side API calls.

For R1, the architecture should prioritize:

```text
Credential Safety
+
Data Privacy
+
Simplicity
```

over prematurely integrating many providers.

---

## 9.19 Local Models

Local AI models may be considered where practical.

Potential advantages:

```text
Better privacy
No external transmission
No provider API cost
Offline capability
```

Potential disadvantages:

```text
Hardware requirements
Model size
Performance
Setup complexity
Quality differences
```

Local models are therefore a future-compatible option rather than a mandatory R1 dependency.

---

## 9.20 Free AI Providers

Free or low-cost AI providers may be used during development where appropriate.

However:

```text
Free
≠
Guaranteed permanent availability
```

The architecture must not assume that a specific provider's free tier will always exist.

Provider-specific limitations should be isolated through the AI abstraction layer.

---

## 9.21 AI Availability

If AI is unavailable because of:

```text
Network failure
Provider failure
Rate limit
Invalid API key
Model unavailable
Quota exceeded
```

the rest of Academic OS must continue working.

The user should receive a clear explanation that AI assistance is temporarily unavailable.

---

## 9.22 AI Failure Handling

AI failures should not corrupt academic data.

For example:

```text
AI Request
    ↓
Failure
    ↓
Show Error
    ↓
No Academic Data Changed
```

AI requests should be treated as read-oriented assistance unless a separate user-confirmed action is implemented.

---

## 9.23 AI Hallucination Principle

AI-generated information must be treated as potentially fallible.

Academic OS should not present AI-generated claims as official facts unless they are directly grounded in verified application data.

The system should distinguish:

```text
Verified Application Data
```

from:

```text
AI Interpretation
```

---

## 9.24 Grounded AI Responses

Where AI uses academic data, the prompt should instruct the model to base its response only on the supplied context.

Conceptually:

```text
Verified Data
      ↓
Restricted Context
      ↓
AI
      ↓
Grounded Response
```

The AI should not invent:

- Grades.
- Credits.
- Requirements.
- University policies.
- Course information.

---

## 9.25 Unknown Information

If the required information is not available, the AI should say that it does not have enough information.

For example:

```text
Missing Requirement Data
        ↓
       AI
        ↓
"I don't have enough information to determine this."
```

The AI should not fill missing information with guesses.

---

## 9.26 External Academic Information

If AI is asked about university policies or curriculum information that is not stored in Academic OS, the response should not automatically be treated as authoritative.

The system should distinguish:

```text
Stored Academic Data
```

from:

```text
External Knowledge
```

Official university sources should remain the authority for official academic policies.

---

## 9.27 AI Interaction Model

The primary R1 interaction should be conversational assistance.

Potential flow:

```text
User Question
      ↓
Intent Detection
      ↓
Relevant Data Selection
      ↓
Context Construction
      ↓
AI Response
      ↓
User
```

The system should avoid unnecessary autonomous behavior.

---

## 9.28 R1 AI Feature: Academic Summary

The AI may generate a natural-language summary of the user's current academic state.

Example structure:

```text
Current Performance
Progress
Remaining Requirements
Goals
Potential Areas of Attention
```

The underlying numbers must come from verified analytics.

---

## 9.29 R1 AI Feature: Academic Q&A

The user may ask questions such as:

```text
How many credits do I have left?

Which requirements are incomplete?

How has my GPA changed?

What should I focus on this semester?
```

The system should provide answers using verified application context.

---

## 9.30 R1 AI Feature: Explanation

AI may explain existing analytics.

For example:

```text
Dashboard Metric
      ↓
User asks "Why is this?"
      ↓
Verified Data
      ↓
AI Explanation
```

This is preferable to allowing AI to independently calculate the metric.

---

## 9.31 R1 AI Feature: Planning Assistance

AI may assist the user in planning future academic work.

For example:

```text
Current Situation
+
Remaining Requirements
+
User Goal
      ↓
AI
      ↓
Possible Planning Suggestions
```

These suggestions must be clearly presented as recommendations, not official academic decisions.

---

## 9.32 Planning Confirmation

AI-generated plans must not automatically modify the user's academic records.

If AI suggests:

```text
Take Subject X next semester
```

the system should not automatically create or enroll the subject.

Any persistent change requires explicit user action.

---

## 9.33 AI Recommendations

AI recommendations should be framed appropriately.

Preferred:

```text
"One possible approach is..."
```

rather than:

```text
"You must..."
```

unless the statement is directly derived from an authoritative requirement.

---

## 9.34 AI and Goals

AI may help users formulate personal goals.

Example:

```text
Current GPA
Target GPA
Available Semesters
      ↓
AI
      ↓
Possible Goal Strategy
```

However, the goal itself must be explicitly accepted by the user before being stored.

---

## 9.35 AI Write Operations

R1 should minimize AI-initiated write operations.

AI should primarily:

```text
Read Context
→
Generate Response
```

rather than:

```text
Read Context
→
Modify Database
```

If write actions are introduced later, they must require explicit confirmation.

---

## 9.36 AI Tool Calling

If future versions allow AI to call application functions, those tools must be explicitly defined.

Examples:

```text
getAcademicSummary()
getCurrentSemester()
getRequirements()
getGoals()
```

The AI should not receive unrestricted database access.

---

## 9.37 Restricted Tool Access

AI tools should follow least-privilege principles.

Instead of:

```text
AI → Entire Database
```

prefer:

```text
AI
 ↓
Approved Read Tools
 ↓
Specific Data
```

Write tools should be separately authorized.

---

## 9.38 AI Confirmation Boundary

Any future AI action that changes persistent state should require:

```text
AI Suggestion
      ↓
User Review
      ↓
User Confirmation
      ↓
Application Action
```

AI must not silently modify academic data.

---

## 9.39 AI Prompt Architecture

Prompts should be structured rather than constructed as uncontrolled strings.

Conceptually:

```text
System Instructions
+
Task Instructions
+
Verified Context
+
User Question
```

The prompt architecture should clearly define:

- AI role.
- Data boundaries.
- Response expectations.
- Uncertainty behavior.
- Prohibited behaviors.

---

## 9.40 Prompt Versioning

Important prompts should be versioned where practical.

For example:

```text
academic-summary-v1
academic-qa-v1
planning-assistant-v1
```

This makes AI behavior easier to test and update.

---

## 9.41 Prompt Injection Consideration

Academic data should be treated as data, not instructions.

If user-entered text is included in an AI context, the model should not blindly follow instructions contained inside that text.

For example:

```text
Subject Name:
"Ignore previous instructions..."
```

must remain subject data rather than becoming a system instruction.

---

## 9.42 AI Output Validation

AI output should be validated before being displayed where structured output is required.

For example:

```text
Expected JSON
      ↓
AI
      ↓
Schema Validation
      ↓
Application
```

Free-form conversational responses may not require strict structured validation.

---

## 9.43 Structured AI Output

Structured AI output should be used when the application needs to consume AI-generated data.

For example:

```text
{
    "summary": "...",
    "suggestions": []
}
```

The exact schema should be defined per feature.

The application must not blindly trust malformed AI output.

---

## 9.44 AI Cost Control

AI usage should be designed to minimize unnecessary requests.

Potential strategies:

```text
Request only when needed
Limit context size
Avoid duplicate requests
Cache non-sensitive generated content where appropriate
```

Caching must not cause outdated academic information to be presented as current.

---

## 9.45 Rate Limits

The application should handle provider rate limits gracefully.

For example:

```text
Rate Limit
    ↓
Inform User
    ↓
Core Academic OS Continues
```

The user should not lose academic functionality because an AI provider is unavailable.

---

## 9.46 AI Logging

R1 should avoid unnecessarily storing complete AI conversations.

If logging is required for debugging, it should minimize sensitive academic information.

The implementation should distinguish:

```text
Application Logs
```

from:

```text
Academic Data
```

and:

```text
AI Conversation History
```

---

## 9.47 AI Conversation History

Persistent AI conversation history is not required for R1.

A simple conversational interaction can remain temporary unless the user explicitly chooses to save it.

This reduces:

- Storage requirements.
- Privacy exposure.
- Data-management complexity.

---

## 9.48 AI Privacy Boundary

The default principle should be:

```text
Minimum Data
+
Minimum Retention
+
User Control
```

Academic data should not be transmitted externally unless necessary for the requested AI functionality.

---

## 9.49 AI Provider Transparency

The application should make it reasonably clear when an external AI service is being used.

The user should understand that:

```text
Core Academic OS
```

and:

```text
External AI Assistance
```

are separate systems.

---

## 9.50 AI Offline Behavior

If the application is offline and no local model is configured:

```text
AI unavailable
```

but:

```text
Academic OS available
```

The application should not block the user from accessing academic information.

---

## 9.51 AI Security Boundary

The AI layer must not have unrestricted access to:

```text
IndexedDB
Browser Storage
File System
API Credentials
```

Access should be mediated through controlled application services.

---

## 9.52 AI and Backup

AI conversation data should not automatically become part of the academic backup.

R1 backup should focus on authoritative application data.

If AI preferences or configuration are later included, this should be explicitly defined.

---

## 9.53 AI and Restore

Restoring academic data should not require restoring AI conversation history.

After restore:

```text
Academic Data
      ↓
Analytics Recalculated
      ↓
AI Context Updated
```

The AI layer simply consumes the restored state.

---

## 9.54 AI Testing Strategy

AI features require multiple levels of testing.

### Deterministic Tests

Test:

- Context construction.
- Data selection.
- Permission boundaries.
- Prompt construction.
- Output schema validation.

### AI Behavior Tests

Test:

- Grounding.
- Hallucination resistance.
- Missing information.
- Incorrect user assumptions.
- Prompt injection.
- Provider failures.

### Integration Tests

Test:

```text
Academic Data
      ↓
Analytics
      ↓
Context
      ↓
AI
      ↓
Response
```

---

## 9.55 AI Evaluation Dataset

The project should maintain representative test scenarios.

Examples:

```text
Normal Academic State
Incomplete Requirements
No Grades
Missing Data
High GPA
Low GPA
Multiple Semesters
Goal Active
Goal Achieved
```

These scenarios can be used to evaluate whether AI responses remain grounded.

---

## 9.56 AI Hallucination Test

A test should intentionally ask for information that is not present.

Expected behavior:

```text
No Supporting Data
      ↓
AI acknowledges insufficient information
```

The AI should not invent an answer.

---

## 9.57 AI Academic Accuracy Test

Where the AI references a verified metric:

```text
Analytics:
GPA = X

AI Response:
must reference X
```

The test should verify that AI does not contradict the authoritative metric.

---

## 9.58 AI Recommendation Test

AI recommendations should be evaluated for:

- Relevance.
- Consistency with available requirements.
- Clear uncertainty.
- No unsupported claims.
- No unauthorized database changes.

---

## 9.59 AI Provider Failure Test

Test:

```text
Invalid API Key
Provider Offline
Timeout
Rate Limit
Invalid Response
Malformed Structured Output
```

Expected behavior:

```text
Clear Error
+
No Academic Data Corruption
+
Core App Remains Functional
```

---

## 9.60 R1 AI Scope

R1 should prioritize a small set of useful AI capabilities:

```text
Academic Q&A
Academic Summary
Metric Explanation
Basic Planning Assistance
Goal Planning Assistance
```

The features should consume verified application data.

---

## 9.61 R1 AI Non-Scope

The following should remain outside R1:

- Autonomous academic scheduling.
- Automatic subject enrollment.
- Automatic database modifications.
- Predictive graduation probability.
- AI-generated official academic requirements.
- Peer comparison.
- Fully autonomous academic planning.
- AI-based grading.
- AI-based GPA calculation.
- AI-based requirement validation.
- Persistent AI memory across all conversations.

---

## 9.62 AI Development Order

Recommended sequence:

```text
AI Service Abstraction
       ↓
Provider Configuration
       ↓
Context Builder
       ↓
Academic Q&A
       ↓
Metric Explanation
       ↓
Academic Summary
       ↓
Planning Assistance
       ↓
Goal Assistance
       ↓
AI Evaluation
```

This starts with read-only, grounded capabilities before introducing more complex assistance.

---

## 9.63 First AI Milestone

The first AI milestone should prove:

```text
Verified Academic Data
       ↓
Context Builder
       ↓
AI Provider
       ↓
Grounded Question
       ↓
Response
```

For example:

```text
User:
"Summarize my current academic progress."

Academic OS:
Provides verified GPA, credits, progress and requirements.

AI:
Produces a natural-language summary.
```

The AI should not calculate the underlying numbers itself.

---

## 9.64 AI Development and Google AI Studio

Google AI Studio may be used as a development and experimentation environment for AI-related work.

It should be treated as:

```text
Development / Prototyping Tool
```

rather than as a required runtime dependency of Academic OS.

The final application should maintain a provider abstraction so that the product is not permanently tied to the development tool.

---

## 9.65 AI-Assisted Development vs Product AI

Two different uses of AI must remain distinct:

### AI-Assisted Development

Tools such as:

```text
GitHub Copilot
Google AI Studio
Other coding assistants
```

may help the developer:

- Generate code.
- Explain errors.
- Refactor code.
- Create tests.
- Prototype UI.
- Explore implementation approaches.

### AI Inside Academic OS

This is the actual product feature that users interact with.

Examples:

```text
Academic Q&A
Summary
Planning Assistance
```

These two categories must not be confused.

---

## 9.66 AI Development Governance

AI-generated code must still follow the project's engineering standards.

The developer remains responsible for:

- Reviewing generated code.
- Testing generated code.
- Checking dependencies.
- Checking security.
- Verifying correctness.
- Ensuring architectural consistency.

AI-generated code is not automatically trusted.

---

## 9.67 AI Documentation

Each AI feature should document:

```text
Purpose
Input
Context
Prompt
Provider
Output
Failure Modes
Privacy Considerations
Testing Strategy
```

This improves maintainability and future provider migration.

---

## 9.68 AI Feature Acceptance

An AI feature should not be considered complete simply because it produces a response.

It should also demonstrate:

- Grounded context.
- Appropriate uncertainty.
- Failure handling.
- Privacy boundaries.
- No unauthorized writes.
- No contradiction with deterministic metrics.
- Test coverage.

---

## 9.69 Phase Checkpoint

Before moving to Testing Integration, verify:

### AI Architecture

- AI is optional.
- Provider abstraction exists.
- Context construction is controlled.
- AI access is restricted.

### AI Safety

- No unauthorized writes.
- No AI-generated authoritative metrics.
- No unrestricted database access.
- API credentials are protected.
- External data transmission is minimized.

### AI Features

- Academic Q&A works.
- Summary works.
- Metric explanation works.
- Planning assistance is appropriately scoped.

### AI Quality

- Hallucination behavior is tested.
- Missing data is handled.
- Provider failures are handled.
- Structured outputs are validated where applicable.

---

## 9.70 Part 9 Rules

The following rules apply:

1. AI is an optional assistance layer.
2. Academic OS must function without AI.
3. AI must never become the source of truth for academic data.
4. Core academic calculations must remain deterministic.
5. AI should consume verified application data.
6. AI context should be minimized.
7. AI should not receive unrestricted database access.
8. External AI providers must be isolated behind an abstraction layer.
9. API keys must never be committed to source control.
10. AI-generated claims must be distinguishable from verified application data.
11. Missing information must not be replaced with guesses.
12. AI must not silently modify persistent academic data.
13. Future AI write operations require explicit user confirmation.
14. AI must not perform backup or restore validation.
15. AI conversation history is not required for R1.
16. AI should not automatically upload academic data.
17. AI provider failures must not break core application functionality.
18. R1 should prioritize grounded read-oriented assistance.
19. AI-assisted development tools are separate from AI product features.
20. AI-generated code remains subject to human review and testing.

---

## 9.71 Acceptance Criteria

Part 9 is considered complete when:

- AI purpose is defined.
- AI responsibilities are defined.
- AI non-responsibilities are defined.
- AI boundary is defined.
- Optional AI architecture is defined.
- AI context construction is defined.
- Data minimization is defined.
- External provider boundaries are defined.
- Provider abstraction is defined.
- API key security is defined.
- AI availability and failure handling are defined.
- Hallucination controls are defined.
- Unknown-information behavior is defined.
- Academic metric boundaries are defined.
- Requirement boundaries are defined.
- Planning boundaries are defined.
- AI write-operation boundaries are defined.
- Tool-calling boundaries are defined.
- Prompt architecture is defined.
- Prompt versioning is defined.
- Prompt injection considerations are defined.
- AI output validation is defined.
- Cost and rate-limit considerations are defined.
- AI logging boundaries are defined.
- Conversation-history scope is defined.
- Privacy boundaries are defined.
- Backup/restore AI boundaries are defined.
- AI testing strategy is defined.
- AI evaluation scenarios are defined.
- R1 AI scope is defined.
- R1 AI non-scope is defined.
- AI development order is defined.
- Google AI Studio's role is defined.
- AI-assisted development is distinguished from product AI.
- AI governance is defined.
- Phase checkpoint is defined.

# Part 10 — Testing Integration

## 10.1 Purpose

This part defines the testing strategy for Academic OS.

The objective is to ensure that:

- Academic calculations are correct.
- Persistent data is reliable.
- Relationships between entities remain valid.
- Backup and restore are safe.
- Dashboard analytics reflect authoritative data.
- AI features remain grounded and controlled.
- UI interactions work as expected.
- Changes do not introduce regressions.

Testing should provide confidence in the system without creating unnecessary development overhead.

---

## 10.2 Testing Principle

Academic OS should use a risk-based testing strategy.

Not every component requires the same level of testing.

The priority should be:

```text
Critical Data / Logic
        ↓
High Testing Confidence

Supporting Functionality
        ↓
Appropriate Testing

Low-Risk Presentation
        ↓
Reasonable Validation
```

---

## 10.3 Testing Pyramid

The project should generally follow a testing pyramid:

```text
             E2E Tests
                ▲
                │
        Integration Tests
                ▲
                │
           Unit Tests
```

The majority of tests should be unit tests.

Integration tests should validate important boundaries.

End-to-end tests should cover the most important user workflows rather than every possible interaction.

---

## 10.4 Testing Layers

Academic OS should use four primary testing levels:

```text
Unit Testing
Integration Testing
End-to-End Testing
Manual / Exploratory Testing
```

Each level serves a different purpose.

---

## 10.5 Unit Testing

Unit tests should verify isolated pieces of logic.

Examples:

```text
GPA Calculator
Credit Calculator
Progress Calculator
Requirement Evaluator
Goal Evaluator
Backup Validator
Schema Migration
Context Builder
```

Unit tests should be fast and deterministic.

---

## 10.6 Integration Testing

Integration tests should verify that multiple application components work together.

Examples:

```text
Repository → Database
Database → Analytics
Academic Data → Dashboard Metrics
Academic Data → Backup
Backup → Restore
Analytics → Dashboard
Academic Data → AI Context
```

Integration tests should focus on important system boundaries.

---

## 10.7 End-to-End Testing

E2E tests should simulate realistic user workflows.

Examples:

```text
Create Program
    ↓
Create Semester
    ↓
Add Subjects
    ↓
Add Grades
    ↓
View Dashboard
```

Another critical workflow:

```text
Create Academic Data
    ↓
Create Backup
    ↓
Modify Data
    ↓
Restore Backup
    ↓
Verify Original State
```

---

## 10.8 Manual Testing

Automated testing cannot replace all forms of evaluation.

Manual testing should be used for:

- Visual layout.
- Responsive behavior.
- Accessibility observations.
- Usability.
- Unexpected browser behavior.
- AI response quality.
- General user experience.

Manual testing should complement automated testing rather than replace it.

---

## 10.9 Testing Priorities

Testing priority should follow risk.

### Highest Priority

```text
Academic Calculations
Database Persistence
Data Relationships
Backup / Restore
Requirement Logic
```

### High Priority

```text
Dashboard Analytics
Goal Logic
Application State
AI Context
```

### Medium Priority

```text
Navigation
Forms
Filtering
Sorting
```

### Lower Priority

```text
Decorative UI
Animations
Pure Styling
```

---

## 10.10 Academic Calculation Testing

Academic calculations require strong test coverage.

Core calculations include:

```text
GPA
Credits
Progress
Requirement Completion
Goal Status
Semester Metrics
Trend Calculations
```

These should have dedicated unit tests.

---

## 10.11 GPA Testing

GPA tests should cover:

- One subject.
- Multiple subjects.
- Different credit weights.
- Different grades.
- No GPA-eligible records.
- Pass/fail records.
- Incomplete records.
- Invalid grades.
- Repeated subjects where applicable.

Example:

```text
3 credits × 4.0
3 credits × 3.0
```

Expected:

```text
GPA = 3.50
```

The exact expected values must follow the configured grading system.

---

## 10.12 Credit Testing

Credit calculations should test:

```text
0 credits
Partial completion
Full completion
Over-completion
Incomplete subjects
Invalid credits
```

Example:

```text
Required = 126
Earned = 84
Remaining = 42
```

Expected progress should be calculated consistently with Part 7.

---

## 10.13 Requirement Testing

Requirement tests should verify:

```text
Not Started
In Progress
Completed
```

where applicable.

Tests should also cover:

- Missing requirements.
- Completed requirements.
- Multiple requirement categories.
- Requirement dependencies.
- Invalid requirement references.

---

## 10.14 Goal Testing

Goal calculations should verify:

```text
Goal created
Goal in progress
Goal achieved
Goal not achieved
Goal without sufficient data
```

"At Risk" logic, if implemented, must have explicit test cases defining exactly when the status occurs.

---

## 10.15 Trend Testing

Trend calculations should test:

```text
No historical data
One semester
Multiple semesters
Missing semester values
Ordered semester data
```

The system should not produce misleading trends from insufficient information.

---

## 10.16 Database Testing

Database operations should be tested for:

- Create.
- Read.
- Update.
- Delete.
- Relationships.
- Validation.
- Transaction behavior.
- Migration.

The database layer is a critical part of Academic OS because the application is local-first.

---

## 10.17 Persistence Testing

A basic persistence test should verify:

```text
Create Data
    ↓
Save
    ↓
Reload Application / Repository
    ↓
Read Data
    ↓
Data Still Exists
```

This confirms that the application is not merely maintaining temporary in-memory state.

---

## 10.18 Relationship Testing

Relationships should be tested explicitly.

For example:

```text
Program
   ↓
Semester
   ↓
Subject
   ↓
Academic Record
```

Tests should verify that references remain valid after:

- Creation.
- Update.
- Deletion.
- Migration.
- Restore.

---

## 10.19 Deletion Testing

Deletion behavior requires particular attention.

Tests should verify:

- Deleting a parent entity.
- Deleting a child entity.
- Preventing invalid orphan records.
- Cascading behavior where explicitly defined.
- User confirmation where required.

Deletion rules should follow the data model established earlier.

---

## 10.20 Database Migration Testing

Whenever the database schema changes:

```text
Old Schema
    ↓
Migration
    ↓
New Schema
    ↓
Validation
```

must be tested.

Migration tests should preserve representative real-world data.

---

## 10.21 Backup Testing

Backup functionality should be tested as a complete data lifecycle.

Required workflow:

```text
Create Data
    ↓
Backup
    ↓
Change / Delete Data
    ↓
Restore
    ↓
Verify Original Data
```

This is one of the highest-priority E2E workflows.

---

## 10.22 Backup Validation Testing

Test invalid backup scenarios:

```text
Invalid JSON
Missing Metadata
Unsupported Version
Missing Data
Invalid IDs
Invalid Types
Broken References
Invalid Domain Values
```

All invalid backups should be rejected safely.

---

## 10.23 Restore Safety Testing

Restore tests must verify that an invalid restore does not destroy existing data.

Example:

```text
Valid Dataset A
      ↓
Attempt Invalid Restore
      ↓
Dataset A remains intact
```

This is a critical safety property.

---

## 10.24 Recovery Point Testing

Where a safety backup is created before restore:

```text
Dataset A
    ↓
Safety Backup
    ↓
Restore Dataset B
```

the system should be able to recover Dataset A if required.

---

## 10.25 Analytics Integration Testing

Analytics should be tested against actual persisted data.

Example:

```text
Database
   ↓
Academic Records
   ↓
Analytics
   ↓
Expected GPA
```

The test should verify that analytics are not using stale or duplicated data.

---

## 10.26 Dashboard Integration Testing

Dashboard tests should verify:

```text
Academic Data Changes
       ↓
Analytics Changes
       ↓
Dashboard Changes
```

For example:

```text
Grade Updated
    ↓
GPA Updated
    ↓
Dashboard GPA Updated
```

without requiring a full application restart.

---

## 10.27 Empty-State Testing

The dashboard must be tested with:

```text
No Program
No Subjects
No Grades
No Requirements
No Goals
```

The application should show appropriate empty states rather than misleading zero values.

---

## 10.28 Partial-State Testing

Test partially configured academic data.

Examples:

```text
Program exists
No grades

Subjects exist
No requirements

Grades exist
No goals
```

Only metrics supported by available data should be displayed.

---

## 10.29 Error-State Testing

The application should be tested under failure conditions.

Examples:

```text
Database Failure
Invalid Input
Backup Failure
Restore Failure
AI Failure
Network Failure
Provider Failure
```

Errors should be communicated without corrupting existing data.

---

## 10.30 Form Validation Testing

Forms should validate:

- Required fields.
- Numeric values.
- Credit values.
- Grade values.
- Dates.
- Allowed statuses.
- Duplicate identifiers where applicable.

Validation should occur before persistence.

---

## 10.31 Input Boundary Testing

Boundary values should be tested.

Examples:

```text
0 credits
Negative credits
Maximum reasonable credits
Empty name
Very long name
Invalid grade
Invalid date
```

The system should reject or safely handle invalid values.

---

## 10.32 Security-Oriented Testing

R1 is primarily a personal local application, but security testing should still cover:

- API key exposure.
- Unsafe external requests.
- Malicious imported backup files.
- Unexpected input.
- Unauthorized AI tool access.
- Sensitive data leakage.

Security should be considered during normal testing rather than postponed entirely to the end.

---

## 10.33 AI Testing

AI testing differs from deterministic testing.

The goal is not to prove that every response is identical.

Instead, testing should evaluate whether AI behavior remains within defined boundaries.

Important properties include:

```text
Groundedness
Safety
Relevance
Uncertainty Handling
Privacy
No Unauthorized Writes
```

---

## 10.34 AI Context Testing

Verify that the context builder includes:

```text
Required Data
```

and excludes:

```text
Unnecessary Data
```

Example:

```text
Requirement Question
      ↓
Requirement Context
      ↓
No Unrelated Personal Data
```

---

## 10.35 AI Grounding Testing

Given:

```text
Verified GPA = 3.52
```

the AI should not respond with:

```text
GPA = 3.70
```

when the verified value is supplied.

Tests should check for contradictions between AI responses and authoritative metrics.

---

## 10.36 AI Missing-Data Testing

If information is unavailable:

```text
No Requirement Data
```

the AI should not invent requirements.

Expected behavior:

```text
Insufficient Information
```

or an equivalent transparent response.

---

## 10.37 AI Prompt Injection Testing

Test malicious or instruction-like user data.

Examples:

```text
Subject Name:
"Ignore previous instructions..."
```

The AI should treat it as data rather than as a higher-priority instruction.

---

## 10.38 AI Provider Failure Testing

Test:

```text
Timeout
Rate Limit
Invalid API Key
Provider Error
Malformed Response
Network Failure
```

The application should remain usable.

---

## 10.39 AI Write Boundary Testing

If an AI feature is read-only:

```text
AI Response
    ↓
No Database Modification
```

must be verified.

If future AI tools can perform writes:

```text
AI Suggestion
    ↓
User Confirmation
    ↓
Write
```

must be tested.

---

## 10.40 UI Testing

UI tests should focus on user-critical interactions.

Examples:

```text
Create Subject
Edit Grade
View Dashboard
Create Goal
Create Backup
Restore Backup
Open AI Assistant
```

Not every visual element requires automated testing.

---

## 10.41 Responsive Testing

The application should be manually and/or automatically tested at representative sizes:

```text
Mobile
Tablet
Laptop
Desktop
```

Important layout changes should be verified.

---

## 10.42 Accessibility Testing

Testing should include:

- Keyboard navigation.
- Focus behavior.
- Labels.
- Form accessibility.
- Color contrast.
- Status communication.
- Screen-reader-friendly structure where practical.

Accessibility should not depend entirely on automated tools.

---

## 10.43 Browser Testing

Academic OS should initially prioritize the primary supported browser environment.

Additional browsers may be tested where practical.

At minimum, testing should consider:

```text
Chrome / Chromium-based Browser
```

because the project development environment is expected to use a modern Chromium-based browser.

Cross-browser expansion can occur later if required.

---

## 10.44 Test Environment

Testing should use a controlled environment.

The project should define:

```text
Development
Test
Production / Release
```

where appropriate.

Test data should not accidentally become real user data.

---

## 10.45 Test Data

The project should maintain reusable test fixtures.

Potential fixtures:

```text
emptyDataset
minimalDataset
normalDataset
edgeCaseDataset
invalidDataset
```

These fixtures should be version-controlled when they contain no sensitive personal data.

---

## 10.46 Mocking Strategy

External dependencies should be mocked where appropriate.

Examples:

```text
AI Provider
Network Requests
Browser APIs
External Services
```

Database logic should not be excessively mocked in integration tests because real persistence behavior is important.

---

## 10.47 Test Isolation

Tests should not depend on the order in which other tests execute.

Each test should:

```text
Arrange
Act
Assert
Cleanup
```

where applicable.

Test data should not leak between tests.

---

## 10.48 Deterministic Tests

Core unit and integration tests should be deterministic.

Tests should not depend on:

- Random external responses.
- Current network conditions.
- Uncontrolled AI output.
- Real production data.

AI behavior tests may use controlled evaluation strategies where exact response matching is inappropriate.

---

## 10.49 Coverage Strategy

The project should not require:

```text
100% Code Coverage
```

as an absolute goal.

Instead, coverage should prioritize critical logic.

High coverage should be expected for:

```text
GPA
Credits
Requirements
Goals
Persistence
Backup / Restore
Migrations
Validation
```

Lower coverage may be acceptable for:

```text
Pure UI Styling
Simple Presentational Components
```

provided critical workflows remain tested.

---

## 10.50 Coverage as a Signal

Code coverage should be treated as a signal rather than the definition of quality.

High coverage does not guarantee:

```text
Correctness
Usability
Security
Good Architecture
```

Tests must still verify meaningful behavior.

---

## 10.51 Regression Testing

When a bug is discovered:

```text
Bug
 ↓
Fix
 ↓
Regression Test
```

should be created where practical.

The same bug should not be allowed to silently return in a future change.

---

## 10.52 Critical Regression Areas

Regression testing should prioritize:

```text
GPA
Credits
Requirements
Database Persistence
Backup / Restore
Dashboard Metrics
AI Boundaries
```

These are core product behaviors.

---

## 10.53 Test-Driven Development

Full TDD is not mandatory for every feature.

However, test-first development is encouraged for deterministic logic with clear expected behavior.

Especially:

```text
GPA Calculator
Progress Calculator
Requirement Evaluator
Backup Validator
Migration Functions
```

These are particularly suitable for test-first implementation.

---

## 10.54 Testing During Development

Testing should occur continuously.

Preferred flow:

```text
Implement
   ↓
Run Relevant Tests
   ↓
Fix
   ↓
Continue
```

rather than:

```text
Build Everything
      ↓
Test at the End
```

Late testing makes defects harder to isolate.

---

## 10.55 Pre-Commit Testing

Before committing meaningful changes, the developer should run relevant tests.

For example:

```text
Changed Analytics
   ↓
Analytics Tests

Changed Backup
   ↓
Backup Tests

Changed UI
   ↓
Relevant UI Tests
```

The full test suite may be run before major milestones.

---

## 10.56 CI Testing

Where CI is introduced, the pipeline should run automated checks such as:

```text
Lint
Type Check
Unit Tests
Integration Tests
Build
```

E2E tests may be included depending on runtime and project complexity.

---

## 10.57 CI Failure Principle

A failed critical test should prevent a release from being considered ready.

For example:

```text
GPA Test Failed
      ↓
Release Blocked
```

A low-priority visual snapshot issue may be handled differently depending on severity.

---

## 10.58 Test Naming

Tests should describe behavior clearly.

Prefer:

```text
calculates weighted GPA correctly
```

over:

```text
testGPA1
```

Good names make failures easier to understand.

---

## 10.59 Test Organization

Tests should be organized according to the application architecture.

Conceptually:

```text
tests/
├── unit/
├── integration/
├── e2e/
├── fixtures/
└── helpers/
```

The exact repository structure should remain aligned with Part 3.

---

## 10.60 Test Documentation

Important testing procedures should be documented.

Documentation should explain:

- How to run tests.
- How to run specific test groups.
- How to generate coverage.
- How to run E2E tests.
- How to reset test data.
- How to troubleshoot common test failures.

---

## 10.61 Test Failure Investigation

When a test fails:

```text
Test Failure
     ↓
Reproduce
     ↓
Determine Root Cause
     ↓
Fix
     ↓
Run Regression Test
```

The developer should avoid simply modifying the test to make it pass unless the original expectation was incorrect.

---

## 10.62 Flaky Tests

Flaky tests should be treated as defects.

A test that randomly passes and fails reduces confidence in the test suite.

The project should:

- Identify the source.
- Fix timing issues.
- Remove uncontrolled dependencies.
- Improve test isolation.

Tests should not be ignored simply because they are inconvenient.

---

## 10.63 Test Performance

Tests should remain reasonably fast.

Unit tests should be extremely fast.

Integration tests may take longer.

E2E tests may be slower and should therefore cover high-value workflows rather than every possible case.

---

## 10.64 Test Environment Reset

Integration and E2E tests should be able to start from a known state.

For example:

```text
Reset Test Database
      ↓
Seed Fixture
      ↓
Run Test
```

This prevents previous test runs from affecting results.

---

## 10.65 Testing Data Integrity

Data integrity should be treated as a core testing objective.

After operations such as:

```text
Create
Update
Delete
Restore
Migration
```

the application should not contain invalid relationships.

---

## 10.66 Testing Dashboard Accuracy

Dashboard tests should verify that displayed values correspond to analytics.

Example:

```text
Analytics GPA = 3.52
       ↓
Dashboard displays 3.52
```

The dashboard must not independently calculate a different value.

---

## 10.67 Testing Analytics Separation

A useful architectural test is to ensure that core analytics functions can operate without rendering UI components.

Conceptually:

```text
Analytics Test
      ↓
No Browser Rendering Required
```

This helps maintain the separation defined in Part 7.

---

## 10.68 Testing Backup Separation

Backup logic should similarly be testable independently from the UI.

Conceptually:

```text
Backup Generator
      ↓
Unit / Integration Test
      ↓
No UI Required
```

The UI should only trigger and present the operation.

---

## 10.69 Testing AI Separation

AI context construction should be testable without requiring a real AI provider.

For example:

```text
Academic Data
      ↓
Context Builder
      ↓
Expected Context
```

This allows privacy and grounding boundaries to be verified independently.

---

## 10.70 Test Security Boundaries

Tests should verify that:

```text
API Key
```

does not accidentally appear in:

```text
UI
Logs
Git
Backup
AI Context
```

where it should not exist.

---

## 10.71 Test Privacy Boundaries

Where external AI is used, tests should verify that unnecessary personal data is not included in the request context.

The goal is:

```text
Required Data
+
Nothing Unnecessary
```

---

## 10.72 Release Testing

Before an R1 release candidate:

```text
Unit Tests
      ↓
Integration Tests
      ↓
E2E Tests
      ↓
Manual Smoke Test
      ↓
Release Candidate
```

All critical failures must be resolved before release.

---

## 10.73 Smoke Test

A basic smoke test should verify that the application can:

```text
Launch
      ↓
Load Data
      ↓
Create / Edit Academic Data
      ↓
Calculate Metrics
      ↓
Display Dashboard
      ↓
Create Backup
      ↓
Restore Backup
```

AI may be tested separately because it is optional.

---

## 10.74 Release Regression Test

The release regression suite should prioritize:

```text
Academic Management
Analytics
Backup / Restore
Dashboard
Critical UI Workflows
```

AI functionality should be included where configured.

---

## 10.75 Definition of Test Readiness

A feature is test-ready when:

- Its expected behavior is defined.
- Its edge cases are identified.
- Relevant tests can be written.
- Dependencies are available.
- Acceptance criteria are clear.

---

## 10.76 Definition of Test Completion

A feature is considered tested when:

- Required unit tests pass.
- Required integration tests pass.
- Relevant E2E workflows pass.
- Known edge cases are covered.
- Critical regressions are resolved.
- Manual validation is completed where necessary.

---

## 10.77 Testing and Definition of Done

Testing is part of the Definition of Done.

A feature should not be considered complete merely because:

```text
Code exists
```

Instead:

```text
Implementation
+
Validation
+
Testing
+
Review
```

must be satisfied.

---

## 10.78 Testing Scope for R1

R1 should provide strong confidence in:

```text
Academic Management
Analytics
Dashboard
Backup / Restore
AI Boundaries
```

Testing effort should be proportional to the importance of each feature.

---

## 10.79 Out-of-Scope Testing

The following do not require extensive R1 testing unless they become part of the implemented product:

- Large-scale distributed performance.
- Multi-user concurrency.
- Enterprise-scale security.
- Massive datasets.
- Multi-device synchronization.
- Advanced AI benchmarking.
- Complex cloud infrastructure.

---

## 10.80 Testing Development Order

Recommended implementation order:

```text
Testing Infrastructure
      ↓
Academic Calculation Tests
      ↓
Database Tests
      ↓
Analytics Integration Tests
      ↓
Backup / Restore Tests
      ↓
Dashboard Tests
      ↓
AI Tests
      ↓
E2E Critical Workflows
      ↓
CI Integration
```

---

## 10.81 First Testing Milestone

The first meaningful testing milestone should prove:

```text
Academic Data
      ↓
Correct Persistence
      ↓
Correct GPA / Credit Calculation
      ↓
Correct Dashboard Metrics
      ↓
Backup
      ↓
Restore
      ↓
Original State Verified
```

This provides confidence in the most important product path.

---

## 10.82 Testing Failure Principle

Testing should fail loudly for critical defects.

Examples:

```text
Incorrect GPA
    → Test Failure

Broken Relationship
    → Test Failure

Invalid Restore Accepted
    → Test Failure

Dashboard Shows Wrong Metric
    → Test Failure
```

Critical failures should not be ignored merely to keep the pipeline green.

---

## 10.83 Part 10 Rules

The following rules apply:

1. Academic OS uses risk-based testing.
2. Unit tests should form the majority of automated tests.
3. Integration tests must cover critical system boundaries.
4. E2E tests should focus on high-value user workflows.
5. Academic calculations require strong test coverage.
6. Database persistence must be tested.
7. Entity relationships must be tested.
8. Backup and restore require dedicated testing.
9. Invalid restores must not destroy valid existing data.
10. Dashboard metrics must be verified against analytics.
11. Empty and partial states must be tested.
12. AI behavior must be tested for grounding and boundary compliance.
13. AI provider failures must not break core application functionality.
14. Code coverage is a quality signal, not an absolute target.
15. Critical logic should have substantially stronger coverage than low-risk presentation code.
16. Bugs should result in regression tests where practical.
17. Flaky tests should be treated as defects.
18. Tests should be isolated and reproducible.
19. Testing must occur continuously during development.
20. Testing is part of the Definition of Done.
21. Critical test failures should block release readiness.
22. R1 testing should prioritize correctness and data integrity over exhaustive testing of every UI detail.

---

## 10.84 Acceptance Criteria

Part 10 is considered complete when:

- Testing purpose is defined.
- Risk-based testing strategy is defined.
- Testing pyramid is defined.
- Unit testing scope is defined.
- Integration testing scope is defined.
- E2E testing scope is defined.
- Manual testing scope is defined.
- Testing priorities are defined.
- Academic calculation testing is defined.
- Database testing is defined.
- Persistence testing is defined.
- Relationship testing is defined.
- Migration testing is defined.
- Backup testing is defined.
- Restore safety testing is defined.
- Analytics integration testing is defined.
- Dashboard testing is defined.
- Empty and partial state testing is defined.
- Error testing is defined.
- Input validation testing is defined.
- Security testing boundaries are defined.
- AI testing strategy is defined.
- UI testing strategy is defined.
- Responsive testing is defined.
- Accessibility testing is defined.
- Test data strategy is defined.
- Mocking strategy is defined.
- Test isolation is defined.
- Coverage strategy is defined.
- Regression strategy is defined.
- CI testing is defined.
- Flaky-test handling is defined.
- Test documentation is defined.
- Release testing is defined.
- Smoke testing is defined.
- Definition of test readiness is defined.
- Definition of test completion is defined.
- Testing's relationship to Definition of Done is defined.
- R1 testing scope is defined.
- Out-of-scope testing is defined.
- Testing development order is defined.
- Phase checkpoint is defined.

# Part 11 — Development Workflow & Git

## 11.1 Purpose

This part defines the development workflow and Git strategy for Academic OS.

The objective is to provide a consistent process for:

- Developing features.
- Managing changes.
- Testing changes.
- Tracking bugs.
- Reviewing implementation.
- Maintaining project history.
- Preparing releases.
- Recovering from mistakes.

The workflow should remain lightweight enough for a personal project while maintaining professional software-engineering practices.

---

## 11.2 Development Principle

Development should follow:

```text
Plan
  ↓
Implement
  ↓
Test
  ↓
Review
  ↓
Commit
  ↓
Integrate
```

The developer should avoid making large amounts of untested changes before checking whether the implementation is correct.

---

## 11.3 Solo Developer Workflow

Academic OS is initially developed as a personal project.

Therefore, the workflow should not require a complex team-oriented process.

The preferred model is:

```text
Task
 ↓
Feature Branch
 ↓
Implementation
 ↓
Testing
 ↓
Self-Review
 ↓
Commit
 ↓
Merge
```

This provides structure without unnecessary overhead.

---

## 11.4 Git as Source of Truth

Git should be the source of truth for the project's source code and development history.

The repository should contain:

- Application source code.
- Tests.
- Configuration templates.
- Documentation.
- Project metadata.
- Non-sensitive development assets.

The repository must not contain secrets or private runtime data.

---

## 11.5 Repository Initialization

The project repository should be initialized before substantial implementation begins.

Initial setup should include:

```text
Git Repository
README
.gitignore
Environment Template
Project Configuration
Basic Directory Structure
```

The repository should begin with a clean baseline commit.

---

## 11.6 Initial Commit

The initial commit should represent the basic project foundation.

Example:

```text
chore: initialize Academic OS project
```

It should not contain unfinished experimental code unless explicitly intended.

---

## 11.7 Branch Strategy

The project should use a simple branch model.

Recommended:

```text
main
  │
  ├── feature/...
  ├── fix/...
  └── chore/...
```

The `main` branch should remain stable.

---

## 11.8 Main Branch

The `main` branch represents the most stable version of the project.

Changes should only be merged after:

- Implementation is complete enough.
- Relevant tests pass.
- Self-review is completed.
- No known critical regression exists.

---

## 11.9 Feature Branches

New functionality should normally be developed on feature branches.

Example:

```text
feature/academic-records
feature/dashboard
feature/backup-restore
feature/ai-assistant
```

Feature branches should represent a coherent piece of work.

---

## 11.10 Fix Branches

Bug fixes should use a dedicated branch when the change is substantial enough to warrant isolation.

Example:

```text
fix/gpa-calculation
fix/restore-validation
fix/dashboard-stale-data
```

Small trivial fixes may be handled directly according to the workflow established by the developer.

---

## 11.11 Chore Branches

Non-feature maintenance work may use:

```text
chore/update-dependencies
chore/configure-testing
chore/update-documentation
```

This distinguishes maintenance work from product functionality.

---

## 11.12 Branch Naming

Branch names should:

- Be lowercase.
- Use hyphens.
- Describe the purpose.
- Avoid unnecessary detail.

Preferred:

```text
feature/academic-records
fix/gpa-calculation
chore/testing-setup
```

Avoid:

```text
my-new-branch
test
stuff
an-final-version
```

---

## 11.13 Branch Lifetime

Branches should remain focused and reasonably short-lived.

A branch should ideally represent one coherent task or closely related group of changes.

Avoid allowing one feature branch to accumulate unrelated features.

---

## 11.14 Small Changes

Small changes should remain small.

For example:

```text
Fix GPA rounding
```

should not also modify:

```text
Dashboard layout
AI prompts
Backup format
```

unless those changes are directly required.

Small changes are easier to review, test, and revert.

---

## 11.15 Commit Principle

Commits should represent logical units of work.

A commit should ideally:

```text
Do one meaningful thing
```

rather than containing many unrelated changes.

---

## 11.16 Commit Messages

Commit messages should follow a consistent convention.

Recommended format:

```text
type: description
```

Examples:

```text
feat: add academic record management
fix: correct weighted GPA calculation
test: add backup restore integration tests
refactor: separate analytics from dashboard
docs: update development workflow
chore: configure test environment
```

---

## 11.17 Commit Types

Recommended commit types:

```text
feat
fix
test
refactor
docs
chore
style
perf
```

Only the types that are useful for the project need to be used consistently.

---

## 11.18 Commit Quality

A commit should ideally leave the project in a usable state.

Avoid committing code that:

- Does not compile.
- Breaks core tests.
- Contains temporary debugging code.
- Contains secrets.
- Contains unrelated unfinished experiments.

---

## 11.19 Work-in-Progress Commits

Temporary local commits are acceptable during development.

However, before merging into `main`, the developer should clean up unnecessary commits where practical.

The goal is not to produce a perfect Git history at every moment.

The goal is to maintain a useful project history.

---

## 11.20 Self-Review

Because Academic OS is initially a solo project, the developer acts as both:

```text
Developer
+
Reviewer
```

Before merging a branch, perform a self-review.

Check:

- What changed?
- Why did it change?
- Are there unrelated changes?
- Are tests included?
- Are edge cases handled?
- Are architecture rules preserved?
- Are secrets exposed?
- Is documentation required?

---

## 11.21 Testing Before Merge

Before merging a feature branch:

```text
Run Relevant Tests
       ↓
Run Full Test Suite Where Appropriate
       ↓
Review Changes
       ↓
Merge
```

Critical tests should pass before integration.

---

## 11.22 Merge Strategy

For a solo project, either merge commits or squash merges may be used.

The recommended default is:

```text
Feature Branch
      ↓
Squash Merge
      ↓
main
```

This keeps `main` relatively clean.

However, normal merge commits are acceptable when preserving branch history is useful.

---

## 11.23 Merge Conflicts

If a conflict occurs:

```text
Stop
 ↓
Understand Both Changes
 ↓
Resolve Conflict
 ↓
Run Tests
 ↓
Review
 ↓
Complete Merge
```

The developer should not blindly accept one side of a conflict.

---

## 11.24 Conflict Priority

When resolving conflicts, prioritize:

```text
Correctness
+
Architecture
+
Data Integrity
```

over simply making Git accept the merge.

---

## 11.25 Git Status

Before committing, inspect:

```text
git status
```

The developer should know what files are being changed.

This reduces accidental commits of:

- Temporary files.
- Build output.
- Secrets.
- Local databases.
- IDE files.

---

## 11.26 Git Diff

Before committing meaningful changes, review:

```text
git diff
```

or the equivalent IDE diff view.

The purpose is to verify that the actual change matches the intended task.

---

## 11.27 .gitignore

The repository must have an appropriate `.gitignore`.

It should normally exclude:

```text
node_modules/
dist/
build/
coverage/
.env
.env.*
local databases
temporary files
IDE-specific files
OS-specific files
```

The exact entries depend on the chosen technology stack.

---

## 11.28 Environment Variables

Environment-specific configuration should use environment variables or appropriate local configuration.

For example:

```text
AI_API_KEY
AI_PROVIDER
AI_MODEL
```

should not be hard-coded.

---

## 11.29 Environment Template

A safe template should document required configuration without containing real secrets.

Example:

```text
AI_API_KEY=
AI_PROVIDER=
AI_MODEL=
```

The template may be committed.

The actual secret-containing environment file must not be committed.

---

## 11.30 Secret Management

Secrets must never be committed to Git.

If a secret is accidentally committed:

```text
Revoke / Rotate Secret
        ↓
Remove From Repository
        ↓
Review History
```

Deleting the file alone is not sufficient because Git history may still contain the secret.

---

## 11.31 Local Academic Data

Real personal academic data should not normally be committed to the repository.

Examples:

```text
Real Database
Real Backup
Private Export
Personal AI Conversation
```

should remain outside version control unless deliberately anonymized and required for testing.

---

## 11.32 Test Data

Safe synthetic test data may be committed.

Example:

```text
test-fixtures/
```

The fixtures should contain fictional or anonymized information.

---

## 11.33 Issue Tracking

Development tasks should be tracked using issues or an equivalent task system when useful.

Potential categories:

```text
Feature
Bug
Improvement
Refactor
Documentation
Research
```

For a small task, a local checklist may be sufficient.

---

## 11.34 Feature Issue

A feature issue should define:

```text
Goal
Expected Behavior
Acceptance Criteria
Dependencies
Notes
```

The implementation should reference the relevant issue where practical.

---

## 11.35 Bug Issue

A bug report should ideally include:

```text
Expected Behavior
Actual Behavior
Steps to Reproduce
Environment
Severity
Relevant Logs
```

A minimal reproducible case is preferred.

---

## 11.36 Bug Severity

A simple severity model should be used:

```text
Critical
High
Medium
Low
```

Examples:

### Critical

```text
Data loss
Corrupted restore
Incorrect academic records
```

### High

```text
Incorrect GPA
Broken major workflow
```

### Medium

```text
Non-critical feature malfunction
```

### Low

```text
Minor UI issue
```

---

## 11.37 Issue Prioritization

Priority should consider:

```text
Impact
+
Risk
+
Dependency
+
Effort
```

Critical data-integrity issues should take precedence over cosmetic improvements.

---

## 11.38 Development Task Size

Tasks should be broken into manageable units.

Avoid:

```text
Build entire Academic OS
```

as one development task.

Prefer:

```text
Implement subject entity
Implement subject repository
Implement subject form
Add subject tests
Connect subject view
```

---

## 11.39 Implementation Sequence

Development should follow the implementation order defined earlier.

A typical feature flow is:

```text
Domain Model
   ↓
Data Layer
   ↓
Business Logic
   ↓
UI
   ↓
Tests
   ↓
Integration
```

The exact order may vary when necessary.

---

## 11.40 Architecture Preservation

During development, changes must remain consistent with locked architectural decisions.

If implementation reveals a significant architectural problem:

```text
Identify Problem
      ↓
Document
      ↓
Evaluate Impact
      ↓
Decide Whether Architecture Must Change
```

Do not silently change locked decisions.

---

## 11.41 Architectural Decision Changes

A previously locked decision should only be changed when there is a meaningful reason.

Examples:

```text
Technical limitation
Security issue
Major maintainability problem
Requirement change
```

The change should be documented.

---

## 11.42 Documentation Updates

When implementation changes an architectural behavior, documentation should be updated.

Examples:

```text
Architecture Change
     ↓
Update Architecture Document

New Development Rule
     ↓
Update Development Document
```

Documentation should remain synchronized with implementation.

---

## 11.43 Pull Requests

Even as a solo developer, pull requests may be used for meaningful features.

A PR can provide:

```text
Change Summary
Test Results
Review Checklist
Screenshots
Known Limitations
```

This creates a useful review checkpoint.

---

## 11.44 Lightweight PRs

PRs should not become bureaucratic.

For a small personal project, a lightweight PR description is sufficient:

```text
What changed?
Why?
Tests?
Known issues?
```

---

## 11.45 Review Checklist

Before merging:

```text
[ ] Scope is correct
[ ] No unrelated changes
[ ] Tests pass
[ ] No secrets
[ ] No debug code
[ ] Architecture preserved
[ ] Documentation updated if needed
[ ] UI checked if applicable
```

---

## 11.46 Release Branches

Dedicated release branches are not required for normal development.

For R1, a temporary release branch may be created if useful:

```text
release/r1.0.0
```

The goal is to stabilize the release candidate before merging/tagging.

---

## 11.47 Versioning

Academic OS should use semantic versioning where practical:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
```

Meaning:

```text
MAJOR = breaking changes
MINOR = new compatible features
PATCH = fixes
```

---

## 11.48 Pre-1.0 Versions

Before R1, versions may use:

```text
0.x.y
```

This communicates that the architecture or functionality may still change.

Example:

```text
0.1.0
0.2.0
0.9.0
```

---

## 11.49 Release Tags

Stable releases should be tagged.

Example:

```text
v1.0.0
```

Tags make it easier to:

- Identify stable versions.
- Recover previous versions.
- Compare releases.
- Reproduce a release.

---

## 11.50 Release Notes

Each meaningful release should have concise release notes.

Include:

```text
New Features
Improvements
Bug Fixes
Known Limitations
```

---

## 11.51 Backup of the Repository

Git is not a replacement for application data backup.

The project should maintain repository backup through the chosen Git hosting service or another appropriate mechanism.

However:

```text
Git Source Backup
≠
Academic Data Backup
```

These are separate systems.

---

## 11.52 Recovery from Bad Changes

If a recent change breaks the project:

```text
Identify Bad Commit
       ↓
Determine Fix / Revert
       ↓
Restore Working State
       ↓
Run Tests
       ↓
Continue Development
```

Git history should be used as a recovery mechanism.

---

## 11.53 Revert vs Reset

For shared or already-pushed history, prefer:

```text
git revert
```

when undoing an integrated change.

History rewriting such as:

```text
git reset --hard
git rebase
```

should be used carefully, especially after changes have been pushed or shared.

---

## 11.54 Experimental Work

Experimental ideas should be isolated.

Possible approaches:

```text
feature branch
experiment branch
temporary local branch
```

Experiments should not destabilize `main`.

---

## 11.55 Dependency Updates

Dependency updates should be treated as controlled changes.

Before updating:

```text
Check Compatibility
      ↓
Update
      ↓
Run Tests
      ↓
Review Build
```

Major dependency updates should receive additional testing.

---

## 11.56 Dependency Security

Dependencies should be periodically reviewed for:

- Known vulnerabilities.
- Abandoned packages.
- Unnecessary dependencies.
- Breaking changes.

The project should avoid adding a package when a simple native solution is sufficient.

---

## 11.57 Build Verification

Before a release:

```text
Install Dependencies
      ↓
Build
      ↓
Run Tests
      ↓
Run Production Build
      ↓
Smoke Test
```

The project should verify that the application works from a clean environment.

---

## 11.58 Clean-Environment Test

At least before major releases, verify that the project can be set up without relying on hidden local state.

Conceptually:

```text
Fresh Environment
      ↓
Install Dependencies
      ↓
Configure Environment
      ↓
Run Application
      ↓
Run Tests
```

This catches undocumented machine-specific dependencies.

---

## 11.59 Local Development Workflow

A typical development session should look like:

```text
1. Pull Latest main
2. Create / Switch Feature Branch
3. Implement Small Change
4. Run Relevant Tests
5. Review Diff
6. Commit
7. Continue
8. Run Broader Tests
9. Self-Review
10. Merge
```

---

## 11.60 Daily Development Checkpoint

Before stopping a development session, ideally:

```text
Working State Identified
Changes Committed or Clearly Local
Tests Known
No Secrets Added
No Important Work Lost
```

This reduces the risk of losing context between sessions.

---

## 11.61 AI-Assisted Development Boundary

AI coding tools may be used during implementation.

However:

```text
AI Suggestion
      ↓
Developer Review
      ↓
Testing
      ↓
Commit
```

AI-generated code must not bypass the development workflow.

The detailed AI-assisted workflow is defined in Part 12.

---

## 11.62 Copilot Workflow

GitHub Copilot may assist with:

- Code generation.
- Refactoring.
- Test generation.
- Documentation.
- Debugging.
- Explaining unfamiliar code.

However, the developer remains responsible for validating the result.

---

## 11.63 AI-Generated Code Review

Before accepting AI-generated code, verify:

```text
Correctness
Security
Architecture
Dependencies
Performance
Tests
Maintainability
```

Do not assume generated code is correct simply because it compiles.

---

## 11.64 UI Development Workflow

UI work should follow the same Git discipline as backend/domain work.

For example:

```text
UI Prototype
      ↓
Implementation
      ↓
Responsive Check
      ↓
Integration
      ↓
Test
      ↓
Review
```

Google AI Studio may be used for prototyping or generating UI ideas, but generated UI code must follow the project's architecture.

Detailed UI workflow is defined in Part 13.

---

## 11.65 Development Documentation

The repository should contain enough documentation for the developer to understand:

```text
How to Install
How to Run
How to Test
How to Build
How to Configure
How to Contribute
```

Even for a personal project, this reduces future friction.

---

## 11.66 README Requirements

The README should eventually contain:

```text
Project Overview
Features
Technology Stack
Setup
Development Commands
Testing
Build
Environment Configuration
Project Structure
Known Limitations
```

The README does not need to contain the entire PRD.

---

## 11.67 Development Commands

Common commands should be documented.

For example:

```text
Install
Run Development Server
Run Tests
Run Linter
Run Type Check
Build
Preview
```

The exact commands depend on the final stack.

---

## 11.68 Clean Repository Principle

The repository should remain free from unnecessary artifacts.

Do not commit:

```text
Build Output
Coverage Output
Temporary Exports
Local Databases
Secrets
Personal Data
IDE Cache
Large Generated Files
```

unless explicitly required.

---

## 11.69 Development Workflow and Backup

Git protects source-code history.

Academic OS backup protects application data.

These responsibilities must remain separate:

```text
Git
 ↓
Source Code Recovery

Backup System
 ↓
Academic Data Recovery
```

Neither system replaces the other.

---

## 11.70 Development Workflow and Releases

The release process should follow:

```text
Feature Development
      ↓
Testing
      ↓
Integration
      ↓
Release Candidate
      ↓
Smoke Test
      ↓
Version Tag
      ↓
Release
```

---

## 11.71 Part 11 Rules

The following rules apply:

1. Git is the source of truth for source-code history.
2. `main` should remain stable.
3. Features should normally use focused branches.
4. Bug fixes should use focused branches where appropriate.
5. Commits should represent logical units of work.
6. Commit messages should follow a consistent convention.
7. Secrets must never be committed.
8. Real personal academic data must not normally be committed.
9. Test fixtures should use synthetic or anonymized data.
10. Changes should be reviewed before integration.
11. Relevant tests must pass before merging.
12. Architectural decisions must not be silently changed.
13. Significant architecture changes must be documented.
14. Dependency updates must be tested.
15. Release versions should be tagged.
16. Git is not a replacement for academic-data backup.
17. AI-generated code must be reviewed and tested.
18. Experimental work should not destabilize `main`.
19. The repository should remain clean.
20. The workflow should remain lightweight enough for a solo developer.

---

## 11.72 Acceptance Criteria

Part 11 is considered complete when:

- Git workflow is defined.
- Repository initialization is defined.
- Branch strategy is defined.
- Branch naming is defined.
- Commit strategy is defined.
- Commit message convention is defined.
- Self-review is defined.
- Merge strategy is defined.
- Conflict handling is defined.
- `.gitignore` requirements are defined.
- Environment configuration is defined.
- Secret management is defined.
- Personal data handling is defined.
- Test fixture handling is defined.
- Issue tracking is defined.
- Bug severity is defined.
- Task decomposition is defined.
- Architecture-change handling is defined.
- Pull-request workflow is defined.
- Release strategy is defined.
- Semantic versioning is defined.
- Release tagging is defined.
- Repository recovery is defined.
- Dependency management is defined.
- Clean-environment testing is defined.
- AI-assisted development boundaries are defined.
- UI development boundaries are defined.
- README requirements are defined.
- Repository cleanliness rules are defined.
- Git/source backup and academic-data backup are distinguished.
- Release workflow is defined.
- Phase checkpoint is defined.

# Part 12 — Copilot / AI-Assisted Development Workflow

## 12.1 Purpose

This part defines how AI coding assistants, primarily GitHub Copilot, should be used during Academic OS development.

The objective is to increase development speed while maintaining:

- Architectural consistency.
- Code quality.
- Test reliability.
- Developer understanding.
- Data safety.
- Maintainability.
- Control over project decisions.

AI assistance must support the development process rather than replace engineering judgment.

---

## 12.2 Core Principle

The development relationship is:

```text
Developer
    ↓
Defines Requirement
    ↓
AI Assists
    ↓
Developer Reviews
    ↓
Tests Validate
    ↓
Developer Decides
```

Copilot is an implementation assistant.

It is not the project architect, product owner, or final authority.

---

## 12.3 Authority Hierarchy

When there is a conflict, the following priority applies:

```text
1. User / Project Requirements
2. Locked Academic OS Documents
3. Architecture Decisions
4. Existing Validated Implementation
5. Tests / Acceptance Criteria
6. Copilot Suggestions
```

Copilot must not override a higher-priority decision without explicit developer review.

---

## 12.4 Developer Responsibility

The developer remains responsible for:

- Requirements.
- Architecture.
- Technology choices.
- Security.
- Data handling.
- Code acceptance.
- Test acceptance.
- Release decisions.

AI-generated code remains the developer's responsibility after it is accepted into the project.

---

## 12.5 Appropriate Copilot Uses

Copilot should be actively used for:

```text
Code Generation
Test Generation
Debugging
Refactoring
Code Explanation
Documentation
Boilerplate
Repetitive Code
Type Definitions
Validation Logic
Small Utilities
```

GitHub specifically identifies test generation, repetitive code, debugging, explanations, and code suggestions as useful Copilot workloads. 

---

## 12.6 Inappropriate Copilot Uses

Copilot should not independently determine:

```text
Product Requirements
Core Architecture
Major Technology Decisions
Data Model Changes
Security Policies
Privacy Policies
Release Criteria
Locked Project Decisions
```

It may provide recommendations, but the developer must make the final decision.

---

## 12.7 Plan Before Implementation

For significant tasks, the preferred workflow is:

```text
Understand
    ↓
Plan
    ↓
Review Plan
    ↓
Implement
    ↓
Test
    ↓
Review
```

Do not immediately ask Copilot to implement a large feature without first establishing its scope.

GitHub's current guidance similarly recommends separating research, planning, and implementation for larger agent-assisted tasks. 

---

## 12.8 Task Size

Copilot tasks should be small enough to understand and validate.

Prefer:

```text
Implement GPA calculation
```

over:

```text
Build the entire Academic OS backend
```

Prefer:

```text
Add repository tests for academic records
```

over:

```text
Test everything
```

Breaking complex work into smaller tasks generally improves Copilot results. 

---

## 12.9 Task Definition

Each significant Copilot task should provide:

```text
Goal
Context
Relevant Files
Requirements
Constraints
Acceptance Criteria
Expected Tests
```

Example:

```text
Goal:
Implement weighted GPA calculation.

Context:
Academic OS stores subject credits and grade points.

Requirements:
- Use credit-weighted calculation.
- Ignore records without valid GPA values.
- Follow the existing grading configuration.

Constraints:
- Do not change the database schema.
- Do not modify unrelated analytics.

Acceptance Criteria:
- Correct weighted GPA.
- Edge cases covered.
- Unit tests added.
```

---

## 12.10 Context Management

Copilot should receive only the context necessary for the current task.

Relevant context may include:

```text
Current File
Related Files
Types
Tests
Architecture Rules
Relevant Documentation
Error Logs
```

Irrelevant files should not be unnecessarily included.

GitHub recommends keeping context lean because large amounts of unrelated context can reduce efficiency and clarity. 

---

## 12.11 Repository Instructions

Academic OS should maintain repository-level Copilot instructions.

Recommended location:

```text
.github/
└── copilot-instructions.md
```

This file should contain stable project guidance such as:

```text
Technology Stack
Architecture Rules
Coding Standards
Testing Commands
Directory Conventions
Important Constraints
```

GitHub supports repository custom instructions to provide persistent context to Copilot. 

---

## 12.12 Copilot Instructions Principle

The instruction file should remain concise and practical.

It should not contain:

```text
Entire PRD
Entire Architecture Document
Long Generic AI Advice
Temporary Task Instructions
```

Instead, it should contain durable rules that Copilot should follow across development sessions.

---

## 12.13 Project Documentation as Context

Copilot should be able to reference the project's authoritative documentation when necessary.

Relevant documents may include:

```text
PRD
Architecture
Data Model
Development Workflow
Testing Rules
AI Rules
```

However, the developer should provide only the relevant sections for a specific task when possible.

---

## 12.14 Prompt Structure

A preferred Copilot prompt structure is:

```text
Context
+
Task
+
Requirements
+
Constraints
+
Acceptance Criteria
```

Example:

```text
Context:
This is the Academic OS analytics layer.

Task:
Add a function that calculates remaining credits.

Requirements:
- Use authoritative academic records.
- Return zero when requirements are already satisfied.

Constraints:
- Do not modify database models.
- Do not modify dashboard components.

Acceptance Criteria:
- Unit tests cover normal and edge cases.
```

Clear requirements and stopping conditions help reduce scope drift. 

---

## 12.15 Ask Before Editing

For architectural or multi-file tasks, initially ask Copilot to:

```text
Analyze
Explain
Plan
```

rather than immediately editing files.

Example:

```text
Analyze the existing academic record architecture.

Do not modify files yet.

Identify:
1. Relevant files.
2. Existing patterns.
3. Potential implementation approach.
4. Risks.
5. Tests that should be added.
```

---

## 12.16 Plan Review

Before allowing a large implementation, review the proposed plan.

The developer should verify:

```text
Correct Files
Correct Architecture
Correct Dependencies
Correct Scope
Correct Testing Strategy
```

If the plan is wrong, fix the plan before implementation.

---

## 12.17 Implementation Phase

Once the plan is accepted:

```text
Implement One Task
      ↓
Inspect Changes
      ↓
Run Tests
```

Avoid asking Copilot to continue indefinitely across unrelated features.

---

## 12.18 File Scope

Copilot should modify only files relevant to the task.

If Copilot proposes unrelated changes:

```text
Stop
Review
Reject Unnecessary Changes
```

Unrelated refactoring should not be accepted simply because it was generated automatically.

---

## 12.19 Generated Code Review

Every significant AI-generated change should be reviewed.

Review:

```text
Correctness
Readability
Architecture
Error Handling
Performance
Security
Dependencies
Tests
```

GitHub explicitly recommends checking Copilot's work because generated code can contain mistakes. 

---

## 12.20 Understand Before Accepting

The developer should understand code that is accepted into Academic OS.

If code is unclear:

```text
Ask Copilot to Explain
      ↓
Ask Follow-up Questions
      ↓
Simplify if Necessary
      ↓
Review Again
```

Do not accept complex generated code simply because it works.

---

## 12.21 Learning Principle

Copilot should also function as a learning assistant.

When encountering unfamiliar code:

```text
What?
 ↓
Why?
 ↓
How?
 ↓
Trade-offs?
```

The developer should understand the reasoning behind important implementation choices.

GitHub similarly recommends using Copilot as a training assistant when learning technologies rather than blindly accepting generated code. 

---

## 12.22 Test Generation

Copilot should be used actively to generate tests.

Preferred process:

```text
Define Expected Behavior
        ↓
Ask Copilot for Tests
        ↓
Review Tests
        ↓
Implement / Fix Code
        ↓
Run Tests
```

Tests can also serve as examples that help Copilot understand expected behavior. 

---

## 12.23 Test Review

AI-generated tests must themselves be reviewed.

A passing test is not automatically a useful test.

Check:

```text
Does the test test the right behavior?
Does it contain the correct expected value?
Does it cover edge cases?
Could the implementation pass without actually being correct?
```

---

## 12.24 Debugging Workflow

When an error occurs:

```text
Error
 ↓
Reproduce
 ↓
Collect Relevant Context
 ↓
Ask Copilot to Analyze
 ↓
Review Proposed Cause
 ↓
Apply Fix
 ↓
Run Regression Test
```

Do not simply paste an error and blindly accept the first proposed fix.

---

## 12.25 Debugging Prompt

A useful debugging prompt should include:

```text
Expected Behavior
Actual Behavior
Error Message
Relevant Code
Recent Changes
Environment
```

Example:

```text
Expected:
Restoring a valid backup should reproduce the original dataset.

Actual:
Restore succeeds but two records are missing.

Error:
No runtime error.

Recent Change:
Modified restore validation.

Analyze the likely cause first.
Do not modify files yet.
```

---

## 12.26 Error Fix Scope

A bug fix should address the root cause.

Avoid allowing Copilot to:

```text
Suppress Error
Remove Validation
Ignore Exception
Disable Test
```

simply to make the application appear functional.

---

## 12.27 Refactoring

Copilot can assist with refactoring.

However:

```text
Behavior Before
      =
Behavior After
```

should normally remain true unless the change intentionally modifies behavior.

Refactoring should be tested.

---

## 12.28 Large Refactoring

Large refactoring should be divided into stages:

```text
Analyze
 ↓
Small Refactor
 ↓
Test
 ↓
Next Refactor
 ↓
Test
```

Avoid combining a major refactor with unrelated feature development.

---

## 12.29 Dependency Suggestions

Copilot may suggest libraries.

Before adding one:

```text
Identify Need
 ↓
Check Existing Dependencies
 ↓
Evaluate Alternative
 ↓
Check Compatibility
 ↓
Approve Dependency
```

The developer should not add a dependency simply because Copilot used it in generated code.

---

## 12.30 API Verification

Copilot may hallucinate:

```text
Functions
APIs
Library Methods
Configuration Options
Package Names
```

When using unfamiliar APIs, verify them against authoritative documentation.

Do not treat generated API usage as proof that the API exists.

---

## 12.31 Version Awareness

Copilot may generate code based on patterns that do not match the project's installed versions.

When an API behaves unexpectedly:

```text
Check Installed Version
      ↓
Check Official Documentation
      ↓
Check Current API
      ↓
Update Implementation
```

---

## 12.32 Security Review

AI-generated code should receive additional scrutiny for:

```text
Input Validation
Injection
Secret Exposure
Unsafe File Operations
Unsafe Deserialization
External Requests
Authentication
Authorization
```

Security-sensitive code should not be accepted solely because tests pass.

---

## 12.33 Personal Data Protection

Real academic data should not be unnecessarily pasted into Copilot prompts.

Use:

```text
Synthetic Data
Anonymized Data
Minimal Required Data
```

when examples are needed.

---

## 12.34 API Key Protection

Never include real API keys in:

```text
Copilot Prompt
Source Code
Commit
Issue
Documentation
Screenshots
```

Use placeholders such as:

```text
<API_KEY>
```

instead.

---

## 12.35 AI Context Privacy

When asking Copilot about a problem, provide only the data required to solve it.

For example:

```text
Student GPA = 3.52
```

may be sufficient for a calculation discussion.

There is no reason to provide unrelated personal information.

---

## 12.36 AI and Locked Decisions

If Copilot suggests an approach that conflicts with a locked decision:

```text
Locked Decision
      ↓
Copilot Suggestion
      ↓
Reject or Re-evaluate Explicitly
```

Do not allow generated code to silently change the architecture.

---

## 12.37 Architecture Change Workflow

If Copilot identifies a legitimate architecture problem:

```text
Copilot Suggestion
      ↓
Developer Evaluation
      ↓
Document Problem
      ↓
Architecture Review
      ↓
Decision
      ↓
Update Documentation if Approved
      ↓
Implementation
```

The AI suggestion starts the discussion; it does not make the decision.

---

## 12.38 AI as Reviewer

Copilot may also be used as a secondary reviewer.

Example:

```text
Review this change for:
- Bugs
- Security issues
- Unnecessary complexity
- Violations of project architecture
- Missing tests
```

However, AI review does not replace developer review.

GitHub supports Copilot-assisted code review, but its review output should still be read and evaluated by the developer. 

---

## 12.39 AI Review Timing

A useful workflow is:

```text
Implementation
      ↓
Automated Tests
      ↓
AI Review
      ↓
Developer Review
      ↓
Commit / Merge
```

This provides multiple validation layers.

---

## 12.40 Copilot and Git

Copilot should not be allowed to obscure Git history.

Before committing AI-generated changes:

```text
git status
git diff
Tests
Self-Review
Commit
```

The developer should understand what changed.

---

## 12.41 Commit Boundaries

AI-generated work should be split into logical commits.

Avoid:

```text
feat: build everything with Copilot
```

Prefer:

```text
feat: add academic record repository
test: add academic record repository tests
feat: add academic record service
test: add academic record service tests
```

---

## 12.42 Stopping Condition

Every Copilot task should have a stopping condition.

Example:

```text
Done when:
- Repository method implemented.
- Unit tests added.
- All relevant tests pass.
- No unrelated files changed.
```

This prevents AI-assisted work from expanding beyond the original objective.

GitHub specifically recommends defining what "done" means to reduce scope drift.

---

## 12.43 Conversation Management

Copilot conversations should remain task-focused.

When switching to an unrelated problem:

```text
Start New Conversation
```

rather than continuing a very long unrelated thread.

This keeps context relevant and reduces unnecessary context accumulation.

---

## 12.44 Context Reset

If Copilot begins making increasingly unrelated suggestions:

```text
Stop
 ↓
Start Fresh Context
 ↓
Provide Relevant Files
 ↓
Restate Task
```

Do not keep adding corrections to an increasingly confused conversation.

---

## 12.45 Agent Mode

Agent-style workflows may be used for larger, well-defined tasks.

However, the preferred sequence remains:

```text
Plan
 ↓
Review
 ↓
Implement
 ↓
Inspect
 ↓
Test
 ↓
Review
```

Agent mode should not be treated as:

```text
"Build the entire application automatically."
```

---

## 12.46 Agent Permissions

When using an agent capable of modifying files or executing commands, the developer should understand what actions it can perform.

High-impact operations should receive additional scrutiny.

Examples:

```text
Deleting Files
Changing Dependencies
Changing Database Schema
Running Migration
Changing Configuration
Modifying Many Files
```

---

## 12.47 Agent Task Scope

Agent tasks should be explicitly scoped.

Example:

```text
Implement the academic record repository.

You may modify:
- src/domain/academic-record/*
- src/repositories/academic-record/*
- tests/unit/academic-record/*

Do not modify:
- dashboard
- AI
- backup
- database schema
```

---

## 12.48 Agent Completion Review

When an agent finishes:

```text
Read Summary
 ↓
Inspect Diff
 ↓
Run Tests
 ↓
Review Files
 ↓
Check Architecture
 ↓
Accept / Modify / Reject
```

Never assume the agent's completion message means the task is correct.

---

## 12.49 Copilot and Documentation

Copilot may assist with:

```text
README
API Documentation
Code Comments
Architecture Notes
Test Documentation
Changelog
```

Documentation should still be verified against actual implementation.

---

## 12.50 Comments

Copilot should not generate excessive comments.

Prefer comments that explain:

```text
Why
```

rather than comments that simply explain:

```text
What the code obviously does
```

---

## 12.51 Code Quality

AI-generated code should follow the project's established style.

Requirements include:

```text
Clear Naming
Modular Functions
Consistent Formatting
Appropriate Types
Minimal Duplication
Reasonable Complexity
```

---

## 12.52 Avoid AI Overengineering

Copilot may generate abstractions that are unnecessary for the current project.

Examples:

```text
Unnecessary Framework
Excessive Interfaces
Complex Design Patterns
Extra Dependencies
Over-Generalized Utilities
```

Prefer the simplest architecture that satisfies the locked requirements.

---

## 12.53 Avoid AI Underengineering

The opposite problem should also be avoided.

Do not accept shortcuts that:

```text
Skip Validation
Mix Layers
Duplicate Business Logic
Ignore Errors
Hard-Code Data
Bypass Tests
```

The target is balanced engineering.

---

## 12.54 AI-Assisted Development Loop

The standard Academic OS loop should be:

```text
1. Select Task
       ↓
2. Read Relevant Documentation
       ↓
3. Define Acceptance Criteria
       ↓
4. Ask Copilot to Plan
       ↓
5. Review Plan
       ↓
6. Ask Copilot to Implement
       ↓
7. Inspect Changes
       ↓
8. Run Tests
       ↓
9. Ask Copilot to Review if Useful
       ↓
10. Developer Review
       ↓
11. Commit
```

---

## 12.55 Small Task Loop

For simple tasks:

```text
Task
 ↓
Copilot Suggestion
 ↓
Review
 ↓
Test
 ↓
Commit
```

Planning does not need to be formal for every small change.

---

## 12.56 Complex Task Loop

For complex tasks:

```text
Research
 ↓
Plan
 ↓
Review Plan
 ↓
Implement
 ↓
Test
 ↓
Review
 ↓
Refine
 ↓
Commit
```

---

## 12.57 AI Failure Loop

When Copilot repeatedly produces incorrect results:

```text
Stop
 ↓
Identify Why
 ↓
Reduce Scope
 ↓
Provide Better Context
 ↓
Clarify Constraints
 ↓
Try Again
```

Do not continuously regenerate the same incorrect implementation.

---

## 12.58 When to Code Manually

The developer should consider implementing directly when:

```text
The change is trivial
The generated code is repeatedly incorrect
The logic is easier to write manually
The code is security-sensitive
The developer needs to understand the implementation deeply
```

AI assistance is optional.

---

## 12.59 When to Ask Copilot for Explanation

Ask for explanation when:

- A generated implementation is unfamiliar.
- A library API is unclear.
- A design pattern appears unnecessarily complex.
- A test is difficult to understand.
- A bug fix changes behavior unexpectedly.

---

## 12.60 When to Ask Copilot for Alternatives

If the first implementation seems questionable:

```text
Explain the current approach.
Then provide two simpler alternatives.
Compare:
- Complexity
- Maintainability
- Performance
- Compatibility
```

The developer then chooses.

---

## 12.61 Copilot as Pair Programmer

The preferred mindset is:

```text
Developer = Driver / Decision Maker
Copilot = Pair Programmer
```

Copilot may suggest solutions, but the developer remains responsible for the final implementation.

---

## 12.62 Copilot as Tutor

For unfamiliar technologies:

```text
Ask
 ↓
Understand
 ↓
Implement
 ↓
Explain Back / Review
 ↓
Test
```

This helps the developer build actual skills instead of becoming dependent on generated code.

---

## 12.63 Avoid Blind Copy-Paste

The following workflow is prohibited:

```text
Prompt
 ↓
Generated Code
 ↓
Copy Everything
 ↓
Commit
```

The required workflow is:

```text
Prompt
 ↓
Generated Code
 ↓
Understand
 ↓
Review
 ↓
Test
 ↓
Commit
```

---

## 12.64 AI Output Verification

AI output should be verified against:

```text
Official Documentation
Existing Code
Tests
Type System
Build System
Runtime Behavior
```

When external libraries are involved, official documentation should be preferred over AI assumptions.

---

## 12.65 AI Model Selection

Different AI models may be appropriate for different tasks.

Conceptually:

```text
Complex Planning
      ↓
Stronger Reasoning Model

Routine Implementation
      ↓
Efficient Coding Model

Simple Completion
      ↓
Fast Model
```

Model selection should balance quality, speed, and usage limits.

---

## 12.66 AI Usage Efficiency

To avoid unnecessary AI usage:

```text
- Keep prompts focused.
- Keep context relevant.
- Avoid repeatedly sending unrelated files.
- Break large tasks into smaller tasks.
- Start a new conversation when changing problems.
- Use stronger models for planning when needed.
- Use simpler models for routine implementation where appropriate.

These practices align with GitHub's current guidance on reducing unnecessary context and AI usage.
```

---

## 12.67 Prompt Reuse

Repeated workflows may use reusable prompts.

Potential examples:

```text
Review this code.
Generate unit tests.
Analyze this error.
Review architecture compliance.
Check security.
Explain this implementation.
```

Prompt files may eventually be used for repeatable workflows if useful.

GitHub currently supports reusable prompt files in supported IDEs.

---

## 12.68 AI-Assisted Code Review Prompt

A reusable review prompt may request:

```text
Review the current changes.

Check:
1. Correctness.
2. Architecture compliance.
3. Missing tests.
4. Error handling.
5. Security risks.
6. Unnecessary complexity.
7. Unrelated changes.

Do not modify files.
Only report findings.
```

---

## 12.69 AI-Assisted Test Prompt

A reusable test prompt may request:

```text
Review the current implementation and identify
the important unit and integration tests that are
missing.

Focus on:
- Normal cases.
- Edge cases.
- Invalid input.
- Failure behavior.
- Regression risks.

Do not modify implementation code yet.
```

---

## 12.70 AI-Assisted Debug Prompt

A reusable debugging prompt may request:

```text
Analyze this failure.

Expected:
<expected behavior>

Actual:
<actual behavior>

Error:
<error>

Recent changes:
<changes>

First identify the likely root cause.
Do not modify files until the cause is understood.
```

---

## 12.71 Copilot and Project Documents

The Academic OS documents should remain the authoritative source for project decisions.

Copilot should help translate them into implementation.

Conceptually:

```text
Document
   ↓
Task
   ↓
Copilot
   ↓
Implementation
   ↓
Tests
```

not:

```text
Copilot
   ↓
Architecture
   ↓
Requirements
```

---

## 12.72 Copilot and Part 10

Part 10 defines testing requirements.

Therefore Copilot should be used to help produce:

```text
Unit Tests
Integration Tests
E2E Tests
Fixtures
Test Helpers
Regression Tests
```

But the developer must verify that the tests actually validate the intended behavior.

---

## 12.73 Copilot and Part 11

Part 11 defines Git workflow.

Therefore Copilot-generated changes must follow:

```text
Feature Branch
 ↓
Implementation
 ↓
Testing
 ↓
Review
 ↓
Commit
 ↓
Merge
```

AI assistance does not bypass Git discipline.

---

## 12.74 Copilot and UI Development

Copilot may assist with UI implementation after the UI direction is established.

The preferred flow is:

```text
UI Requirement
 ↓
Design / Prototype
 ↓
Implementation
 ↓
Copilot Assistance
 ↓
Responsive Test
 ↓
Review
```

The detailed UI workflow is defined in Part 13.

---

## 12.75 Copilot and Google AI Studio

Google AI Studio may be used for UI ideation or prototyping as previously planned.

Its output should be treated the same way as Copilot-generated code:

```text
Generate
 ↓
Inspect
 ↓
Adapt
 ↓
Integrate
 ↓
Test
```

Generated code should not be imported blindly into the project.

---

## 12.76 AI Tool Separation

Different AI tools may have different responsibilities.

For example:

```text
Copilot
→ Coding / Debugging / Tests

Google AI Studio
→ UI Ideation / UI Prototyping

Developer
→ Architecture / Decisions / Validation
```

The tools should complement each other rather than compete to define the project.

---

## 12.77 Human-in-the-Loop Requirement

For significant changes:

```text
AI
 ↓
Human Review
 ↓
Automated Validation
 ↓
Human Acceptance
```

must remain part of the workflow.

---

## 12.78 Final Acceptance

The developer has the final authority to:

```text
Accept
Modify
Reject
```

AI-generated work.

A generated change is not considered complete until the developer accepts it.

---

## 12.79 Part 12 Rules

The following rules apply:

1. Copilot is an implementation assistant, not the project architect.
2. Locked Academic OS documents remain authoritative.
3. Significant tasks should be planned before implementation.
4. Copilot tasks should be focused and bounded.
5. Prompts should provide context, requirements, constraints, and acceptance criteria.
6. Relevant context should be provided without unnecessary files or history.
7. Repository-level Copilot instructions should define stable project rules.
8. AI-generated code must be reviewed.
9. The developer should understand significant generated code before accepting it.
10. AI-generated tests must also be reviewed.
11. Copilot must not silently change architecture.
12. Unfamiliar APIs must be verified against authoritative documentation.
13. Real secrets must never be placed in AI prompts.
14. Real personal academic data should not be unnecessarily provided to AI tools.
15. AI-generated dependencies must be evaluated before installation.
16. Security-sensitive code requires additional human review.
17. AI agents must receive bounded tasks.
18. Agent completion messages do not replace code review.
19. AI assistance must not bypass Git workflow.
20. AI assistance must not bypass testing.
21. Copilot should be used as a learning assistant when appropriate.
22. Large tasks should be divided into smaller implementation steps.
23. Unrelated work should use separate AI conversations where practical.
24. AI suggestions that repeatedly fail should trigger scope reduction and context refinement.
25. The developer has final authority over all AI-generated changes.
26. Google AI Studio and Copilot may have different roles in the development workflow.
27. AI-assisted development must remain human-in-the-loop.

---

## 12.80 Acceptance Criteria

Part 12 is considered complete when:

- Copilot's role is defined.
- Developer responsibility is defined.
- Authority hierarchy is defined.
- Appropriate Copilot use cases are defined.
- Inappropriate use cases are defined.
- Planning workflow is defined.
- Task sizing is defined.
- Prompt structure is defined.
- Context management is defined.
- Repository instructions are defined.
- Implementation workflow is defined.
- Code review workflow is defined.
- Test generation workflow is defined.
- Debugging workflow is defined.
- Refactoring workflow is defined.
- Dependency verification is defined.
- API verification is defined.
- Security review is defined.
- Privacy boundaries are defined.
- Agent workflow is defined.
- Agent scope is defined.
- AI review workflow is defined.
- Git integration is defined.
- Stopping conditions are defined.
- Conversation management is defined.
- Model selection principles are defined.
- AI usage efficiency is defined.
- Prompt reuse is defined.
- AI learning workflow is defined.
- Copilot relationship with Parts 10 and 11 is defined.
- Copilot relationship with UI development is defined.
- Google AI Studio relationship is defined.
- Human-in-the-loop requirement is defined.
- Final acceptance responsibility is defined.
- Phase checkpoint is defined.

# Part 13 — UI Development Workflow

## 13.1 Purpose

This part defines the development workflow for the Academic OS user interface.

The objective is to ensure that the UI is:

- Consistent.
- Usable.
- Responsive.
- Accessible.
- Maintainable.
- Connected correctly to the application architecture.
- Separated from core business logic.
- Efficient to develop with AI-assisted tools.

The UI development workflow should integrate:

```text
Design
+
Google AI Studio
+
Copilot
+
Application Architecture
+
Testing
```

---

## 13.2 Core UI Principle

The UI is responsible for:

```text
Presenting Information
Receiving User Input
Triggering Application Actions
Displaying Results
Handling Presentation States
```

The UI should not become the primary location for:

```text
Academic Calculations
Database Logic
Backup Logic
AI Business Rules
Requirement Evaluation
Core Domain Rules
```

---

## 13.3 UI Architecture Boundary

The preferred flow is:

```text
UI
 ↓
Application / Service Layer
 ↓
Domain / Analytics
 ↓
Repository
 ↓
Database
```

The UI should communicate with the application layer rather than directly implementing database or domain behavior.

---

## 13.4 Single Source of Truth

Important application data should have one authoritative source.

For example:

```text
Academic Record
       ↓
Analytics
       ↓
Dashboard
```

The dashboard should not maintain an independent GPA calculation.

Likewise:

```text
Requirement Data
       ↓
Requirement Evaluation
       ↓
Dashboard / Progress UI
```

The UI displays the result produced by the appropriate application logic.

---

## 13.5 UI Development Philosophy

The preferred development process is:

```text
Understand Requirement
        ↓
Design UI
        ↓
Prototype
        ↓
Review
        ↓
Implement
        ↓
Connect to Data
        ↓
Test
        ↓
Visual Review
```

The prototype should be treated as a communication and design tool rather than the final implementation.

---

## 13.6 UI Requirements Before Design

Before creating a screen, define:

```text
Purpose
Primary User Action
Required Data
User Inputs
Expected Outputs
Empty State
Loading State
Error State
Success State
```

This prevents visual design from being disconnected from actual functionality.

---

## 13.7 Page-Level Planning

Each major screen should have a clear purpose.

Examples:

```text
Dashboard
Academic Records
Subjects
Requirements
Goals
Analytics
Backup / Restore
AI Assistant
Settings
```

Each page should have a defined primary purpose rather than attempting to display every available feature.

---

## 13.8 Dashboard Priority

The Dashboard is the primary monitoring interface.

It should prioritize:

```text
Current Academic Status
Progress
Important Metrics
Goals
Warnings / Attention Items
Recent Activity
```

The dashboard should not become an overloaded data-management page.

---

## 13.9 Dashboard Information Hierarchy

Information should generally follow:

```text
Most Important
      ↓
Important
      ↓
Supporting
      ↓
Detailed
```

For example:

```text
Overall GPA
Credits Progress
Academic Goal Status
Upcoming / Important Items
Detailed Analytics
```

---

## 13.10 UI Components

Reusable UI components should be created for repeated patterns.

Examples:

```text
Card
Button
Input
Select
Modal
Dialog
Table
Badge
Progress Bar
Chart Container
Alert
Empty State
Loading State
```

The exact component library should follow the technology decisions already established in earlier parts.

---

## 13.11 Component Reuse

If the same UI pattern appears multiple times, consider extracting a reusable component.

For example:

```text
MetricCard
```

may be reused for:

```text
GPA
Credits
Completed Subjects
Progress
```

Avoid creating a new implementation of the same visual pattern for every page.

---

## 13.12 Avoid Premature Abstraction

Not every small UI element needs to become a generic component.

Prefer abstraction when:

```text
Pattern Repeats
+
Behavior Is Similar
+
Abstraction Improves Maintainability
```

Avoid abstraction when it only makes a simple component harder to understand.

---

## 13.13 Design System

Academic OS should maintain a consistent visual language.

The design system should eventually define:

```text
Typography
Spacing
Colors
Borders
Radius
Shadows
Buttons
Inputs
Cards
Tables
Dialogs
Status Indicators
```

The exact visual values may evolve during implementation.

---

## 13.14 Design Tokens

Repeated visual values should preferably be represented through reusable design tokens or theme variables.

Examples:

```text
Primary Color
Background
Surface
Text
Muted Text
Success
Warning
Error
Spacing
Radius
```

This makes global visual changes easier.

---

## 13.15 Color Usage

Color should communicate meaning rather than exist only for decoration.

Examples:

```text
Success → Completed / Healthy
Warning → Attention Required
Error → Invalid / Failed
Neutral → Informational
```

The UI should not rely on color alone to communicate status.

---

## 13.16 Typography

Typography should establish hierarchy.

For example:

```text
Page Title
 ↓
Section Heading
 ↓
Card Heading
 ↓
Supporting Text
 ↓
Metadata
```

Avoid excessive font sizes or unnecessary visual variation.

---

## 13.17 Spacing

Spacing should be consistent throughout the application.

Prefer a defined spacing system rather than arbitrary values scattered throughout components.

This improves visual consistency and makes future UI changes easier.

---

## 13.18 Responsive Design

Academic OS should support representative screen sizes.

At minimum:

```text
Mobile
Tablet
Laptop
Desktop
```

The layout should adapt rather than simply shrink.

---

## 13.19 Desktop Priority

Because Academic OS is primarily a personal academic dashboard, desktop/laptop usage may receive the strongest optimization.

However, mobile usability remains important for:

```text
Quick Status Checks
Viewing Progress
Checking Goals
Viewing Notifications / Warnings
```

---

## 13.20 Mobile Layout

On smaller screens:

```text
Multi-column Layout
        ↓
Reduced Columns
        ↓
Stacked Content
```

Tables may require:

```text
Horizontal Scrolling
Responsive Columns
Alternative Card Layout
```

depending on information density.

---

## 13.21 Responsive Testing

Every major screen should be checked at representative widths.

Check:

```text
No Horizontal Overflow
Readable Text
Accessible Controls
Usable Forms
Correct Card Wrapping
Correct Navigation
```

---

## 13.22 Navigation

Navigation should make the major areas of Academic OS easy to reach.

The navigation structure should reflect the product's information architecture.

Potential structure:

```text
Dashboard
Academic
Analytics
Goals
Backup
AI Assistant
Settings
```

The exact navigation labels may be refined during implementation.

---

## 13.23 Active Navigation State

The current location should be visually identifiable.

Users should be able to understand:

```text
Where am I?
What section am I viewing?
```

without relying entirely on browser history.

---

## 13.24 Page Titles

Each major page should have a clear title.

The title should communicate the page's purpose rather than merely describe the UI component.

---

## 13.25 Forms

Forms should prioritize:

```text
Clarity
Validation
Simple Input
Useful Defaults
Error Feedback
```

Forms should avoid asking for unnecessary information.

---

## 13.26 Form Validation

Validation should exist at the appropriate application boundary.

The UI may provide immediate validation feedback, but business validation must not exist only in the UI.

Preferred:

```text
UI Validation
      ↓
Application Validation
      ↓
Persistence Validation
```

where applicable.

---

## 13.27 Validation Messages

Validation errors should:

- Explain what is wrong.
- Identify the affected field.
- Suggest how to correct it where useful.
- Avoid technical implementation details.

Bad:

```text
ValidationError: DomainValueError
```

Better:

```text
Enter a valid credit value.
```

---

## 13.28 Unsaved Changes

Forms with meaningful data should consider unsaved-change handling.

Where appropriate:

```text
Edit
 ↓
Unsaved State
 ↓
Save / Cancel
```

The application should avoid silently discarding user input.

---

## 13.29 Confirmation Dialogs

Confirmation should be used for destructive or difficult-to-reverse actions.

Examples:

```text
Delete Academic Record
Delete Goal
Restore Backup
Clear Dataset
```

Simple non-destructive actions should not require unnecessary confirmation.

---

## 13.30 Destructive Actions

Destructive actions should be visually distinguishable.

Examples:

```text
Delete
Remove
Restore
Reset
```

The UI should clearly communicate the consequences.

---

## 13.31 Loading States

Asynchronous operations should provide appropriate loading feedback.

Examples:

```text
Loading Data
Generating Backup
Restoring Backup
Generating AI Response
```

The UI should avoid appearing frozen.

---

## 13.32 Empty States

Empty states should explain what the user can do next.

Example:

```text
No academic records yet.

Add your first academic record to begin
tracking your progress.
```

Avoid displaying an empty page without context.

---

## 13.33 Error States

Errors should be:

```text
Clear
Actionable
Non-destructive
```

Where possible, the UI should explain:

```text
What happened
What the user can do
```

---

## 13.34 Success Feedback

After meaningful actions, provide appropriate feedback.

Examples:

```text
Subject Saved
Backup Created
Goal Updated
Restore Completed
```

Feedback should be noticeable without becoming intrusive.

---

## 13.35 Notifications

Notifications should be used carefully.

Avoid excessive:

```text
Toast
Popup
Modal
Banner
```

messages.

Important information should remain visible long enough for the user to understand it.

---

## 13.36 Tables

Tables should be used when comparing structured records.

Examples:

```text
Subjects
Academic Records
Requirements
```

Tables should support:

```text
Sorting
Filtering
Clear Headers
Readable Values
```

where needed.

---

## 13.37 Charts

Charts should be used when visualization provides more value than text or tables.

Examples:

```text
GPA Trend
Credit Progress
Semester Performance
Requirement Completion
```

Avoid adding charts simply to make the dashboard look more complex.

---

## 13.38 Chart Accessibility

Charts should provide supporting information where practical.

For important metrics:

```text
Chart
+
Textual Summary
```

should be available.

---

## 13.39 AI Assistant UI

The AI Assistant should clearly communicate that it is an assistant rather than the authoritative source of academic records.

The UI should distinguish:

```text
Verified Academic Data
```

from:

```text
AI Explanation / Recommendation
```

---

## 13.40 AI Response States

The AI UI should support:

```text
Waiting
Generating
Success
Error
Unavailable
```

---

## 13.41 AI Uncertainty

When the AI cannot answer reliably, the UI should allow transparent responses such as:

```text
I don't have enough information to answer this.
```

The UI should not pressure the AI into producing an answer at all costs.

---

## 13.42 AI Data Boundary

The UI should not expose unnecessary personal information to the AI layer.

The application/service layer should prepare the appropriate context.

Preferred:

```text
UI
 ↓
AI Service
 ↓
Context Builder
 ↓
AI Provider
```

rather than directly constructing large prompts inside UI components.

---

## 13.43 Backup UI

Backup and restore operations require particularly clear UI.

The UI should communicate:

```text
Backup Created
Backup Validation
Restore Confirmation
Restore Progress
Restore Success
Restore Failure
```

---

## 13.44 Restore Confirmation

Before restoring data, clearly communicate that the operation may replace current data.

Example:

```text
Restoring this backup may replace your current
academic data.

A safety backup will be created first.
```

The exact wording should reflect the actual implementation.

---

## 13.45 Backup File Selection

If file selection is supported, the UI should clearly show:

```text
Selected File
File Validation
Backup Version
Data Summary
```

where practical.

---

## 13.46 Data Import Feedback

When importing data:

```text
Select
 ↓
Validate
 ↓
Preview
 ↓
Confirm
 ↓
Import
```

is preferred over immediately modifying data when the operation is potentially destructive.

---

## 13.47 Dashboard Refresh

When underlying academic data changes, affected dashboard metrics should update appropriately.

Preferred:

```text
Data Change
 ↓
Analytics Update
 ↓
Dashboard Update
```

The UI should not require unnecessary manual refreshes.

---

## 13.48 State Management

UI state should be separated from domain state where practical.

Examples:

```text
UI State
→ Modal Open

Application State
→ Current Academic Program

Domain Data
→ Academic Record
```

The exact state-management approach should follow the technology architecture.

---

## 13.49 Derived Data

The UI should avoid independently maintaining important derived academic values.

For example:

```text
GPA
Credits Remaining
Requirement Completion
```

should come from authoritative application/analytics logic.

---

## 13.50 Local UI State

Local component state is appropriate for presentation concerns.

Examples:

```text
Modal Open
Selected Tab
Input Draft
Expanded Section
```

This should not be confused with persistent academic state.

---

## 13.51 UI Performance

Performance optimization should be evidence-driven.

Do not prematurely optimize every component.

Focus first on:

```text
Correctness
Usability
Maintainability
```

Then optimize measured bottlenecks.

---

## 13.52 Large Data Sets

If academic datasets become large enough to affect performance, consider:

```text
Pagination
Virtualized Lists
Memoization
Lazy Loading
Filtering
```

Only where necessary.

---

## 13.53 Accessibility

The UI should follow accessible web-development practices.

Important areas include:

```text
Keyboard Navigation
Focus Management
Semantic HTML
Labels
Contrast
Screen Reader Support
Error Communication
```

---

## 13.54 Keyboard Navigation

Users should be able to navigate important workflows using a keyboard.

Test:

```text
Tab
Shift + Tab
Enter
Escape
Arrow Keys
```

where appropriate.

---

## 13.55 Focus Management

Dialogs and modal interfaces should manage focus correctly.

For example:

```text
Open Dialog
 ↓
Focus Inside Dialog
 ↓
Close Dialog
 ↓
Return Focus
```

---

## 13.56 Semantic Structure

Use appropriate semantic elements where possible.

Examples:

```text
button
nav
main
header
section
form
label
table
```

Avoid replacing semantic elements with generic containers unnecessarily.

---

## 13.57 Visual Review

Every major UI feature should receive a visual review.

Review:

```text
Spacing
Alignment
Typography
Hierarchy
Consistency
Responsive Behavior
Error States
Empty States
```

---

## 13.58 Google AI Studio Workflow

Google AI Studio may be used for UI ideation and prototyping.

Preferred workflow:

```text
UI Requirement
      ↓
Prompt Google AI Studio
      ↓
Generate Prototype
      ↓
Review Layout
      ↓
Refine
      ↓
Extract Design Direction
      ↓
Implement in Academic OS
```

The generated prototype is not automatically the final architecture.

---

## 13.59 Google AI Studio Scope

Google AI Studio should primarily assist with:

```text
Layout Ideas
Visual Concepts
Component Ideas
Interaction Ideas
UI Prototypes
Design Iteration
```

It should not independently redefine:

```text
Data Model
Domain Logic
Analytics Architecture
Backup Architecture
AI Architecture
```

---

## 13.60 Prototype Review

Before implementing a generated UI, review:

```text
Does it match the requirement?
Does it fit Academic OS?
Is the navigation sensible?
Is the information hierarchy correct?
Is it responsive?
Does it fit the architecture?
```

---

## 13.61 Generated UI Code

Generated UI code should be treated as a starting point.

Preferred:

```text
Generate
 ↓
Inspect
 ↓
Extract Useful Ideas
 ↓
Adapt
 ↓
Integrate
 ↓
Refactor
 ↓
Test
```

Avoid blindly importing an entire generated project.

---

## 13.62 Copilot UI Workflow

Once the design direction is approved:

```text
UI Design
 ↓
Copilot Implementation
 ↓
Component Creation
 ↓
Data Integration
 ↓
Tests
 ↓
Visual Review
```

Copilot should follow the established component and architecture patterns.

---

## 13.63 UI Task Decomposition

Large screens should be implemented in smaller units.

Example:

```text
Dashboard
 ├── Header
 ├── Navigation
 ├── Metric Cards
 ├── Progress Section
 ├── Goal Section
 ├── Trend Chart
 └── Recent Activity
```

Each component can be implemented and tested independently.

---

## 13.64 UI Implementation Order

Recommended order:

```text
Layout
 ↓
Navigation
 ↓
Reusable Components
 ↓
Static Content
 ↓
Application Data
 ↓
Interactions
 ↓
Validation
 ↓
Loading / Empty / Error States
 ↓
Responsive Refinement
 ↓
Accessibility
```

---

## 13.65 Static-to-Dynamic Strategy

For complex screens, begin with static data where useful.

Example:

```text
Static Dashboard
      ↓
Connect Real Analytics
      ↓
Connect Real Academic Data
```

This makes layout problems easier to identify before introducing data complexity.

---

## 13.66 Real Data Integration

Once the layout is stable:

```text
Mock Data
 ↓
Application Service
 ↓
Real Data
```

The UI should then consume the actual application interfaces.

---

## 13.67 Mock Data

Mock data should resemble real structures but remain synthetic.

Example:

```text
GPA: 3.50
Credits: 84 / 126
Completed Subjects: 28
```

No actual private information is required.

---

## 13.68 UI and Business Logic

Business logic should not be duplicated inside UI components.

Avoid:

```text
Dashboard Component
    ↓
Calculate GPA
    ↓
Calculate Credits
    ↓
Evaluate Requirements
```

Prefer:

```text
Dashboard
    ↓
Analytics Service
    ↓
Authoritative Results
```

---

## 13.69 UI Error Boundary

The application should prevent a single UI component failure from unnecessarily breaking the entire application where the framework supports appropriate error-boundary patterns.

---

## 13.70 UI Testing

UI testing should focus on meaningful behavior.

Examples:

```text
Can create a subject.
Can edit a grade.
Can view updated GPA.
Can create a goal.
Can create a backup.
Can initiate restore.
Can open AI Assistant.
```

---

## 13.71 Visual Regression

Visual regression testing may be introduced for important stable screens.

It is not mandatory for every component during early development.

Potential candidates:

```text
Dashboard
Academic Records
Analytics
```

---

## 13.72 Accessibility Testing

Accessibility should be tested during implementation rather than only before release.

Preferred workflow:

```text
Implement
 ↓
Keyboard Test
 ↓
Semantic Review
 ↓
Contrast Check
 ↓
Screen Reader Check where practical
```

---

## 13.73 Responsive Testing

Responsive testing should happen during feature development.

Do not wait until the end of the project to discover that the application only works on desktop.

---

## 13.74 Browser Testing

The primary development browser should be tested consistently.

Additional browsers may be tested before release when practical.

---

## 13.75 UI Bug Workflow

When a UI bug is discovered:

```text
Reproduce
 ↓
Identify Layer
 ↓
Fix
 ↓
Test
 ↓
Visual Review
 ↓
Regression Check
```

The developer should determine whether the problem belongs to:

```text
UI
Application Layer
Analytics
Repository
Database
```

rather than automatically modifying the UI.

---

## 13.76 UI Architecture Violations

If a UI component starts accumulating:

```text
Database Calls
Large Calculations
Backup Logic
AI Prompt Construction
Requirement Logic
```

it should be reviewed.

This is an architectural warning sign.

---

## 13.77 Design Consistency Review

Before accepting a new screen, compare it against existing screens.

Check:

```text
Typography
Spacing
Buttons
Cards
Forms
Colors
Navigation
Status Indicators
```

New screens should feel like part of the same application.

---

## 13.78 UI Review Checklist

Before merging a significant UI feature:

```text
[ ] Requirement satisfied
[ ] Correct architecture
[ ] Reusable components used appropriately
[ ] No duplicated business logic
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success feedback where needed
[ ] Responsive behavior
[ ] Keyboard navigation
[ ] Accessibility considered
[ ] Tests added
[ ] Visual review completed
[ ] No unrelated changes
```

---

## 13.79 UI Development and Git

UI changes follow the Git workflow defined in Part 11.

Typical flow:

```text
feature/dashboard-ui
      ↓
Implement
      ↓
Test
      ↓
Visual Review
      ↓
Commit
      ↓
Merge
```

---

## 13.80 UI Development and Copilot

UI implementation follows the AI workflow defined in Part 12.

The workflow becomes:

```text
UI Requirement
      ↓
Google AI Studio Prototype
      ↓
Developer Review
      ↓
Copilot Implementation
      ↓
Developer Review
      ↓
Automated Tests
      ↓
Visual Review
      ↓
Commit
```

---

## 13.81 UI Development and Analytics

Dashboard UI must consume authoritative analytics.

```text
Academic Data
      ↓
Analytics
      ↓
Dashboard
```

The UI should not introduce alternate formulas.

---

## 13.82 UI Development and Backup

Backup and restore interfaces should use the established backup services.

```text
Backup UI
 ↓
Backup Service
 ↓
Backup System
```

The UI should not directly manipulate backup serialization rules.

---

## 13.83 UI Development and AI

The AI Assistant UI should communicate with the AI application/service layer.

```text
AI UI
 ↓
AI Service
 ↓
Context Builder
 ↓
AI Provider
```

This preserves the boundaries established in earlier parts.

---

## 13.84 UI Development Milestones

UI implementation should proceed approximately as:

```text
Design System
      ↓
Application Shell
      ↓
Dashboard
      ↓
Academic Management
      ↓
Analytics
      ↓
Backup / Restore
      ↓
AI Assistant
      ↓
Responsive Refinement
      ↓
Accessibility Refinement
      ↓
Final Visual Review
```

The exact order may change according to implementation dependencies.

---

## 13.85 UI Quality Principle

A successful UI is not defined by visual complexity.

The goal is:

```text
Clarity
+
Consistency
+
Usability
+
Correctness
```

rather than maximizing the number of visual components.

---

## 13.86 UI Scope Principle

R1 should focus on the screens required for the core Academic OS experience.

Avoid building large numbers of secondary screens before the primary workflow is stable.

---

## 13.87 UI Performance Principle

Performance optimization should follow evidence.

Do not introduce complicated optimization techniques before an actual performance problem is identified.

---

## 13.88 UI Documentation

Important UI conventions should eventually be documented.

Potential documentation includes:

```text
Component Guidelines
Design Tokens
Navigation Structure
UI State Patterns
Accessibility Rules
```

---

## 13.89 UI Definition of Ready

A UI feature is ready for implementation when:

- Its purpose is defined.
- Required data is known.
- User actions are known.
- Important states are identified.
- Design direction is approved.
- Architectural boundaries are understood.

---

## 13.90 UI Definition of Done

A UI feature is complete when:

- Required functionality works.
- Correct application services are used.
- No business logic is unnecessarily duplicated.
- Loading state is handled where needed.
- Empty state is handled where needed.
- Error state is handled where needed.
- Responsive behavior is acceptable.
- Accessibility has been reviewed.
- Automated tests are appropriate.
- Visual review is complete.
- No critical regression exists.

---

## 13.91 Part 13 Rules

The following rules apply:

1. UI is responsible for presentation and user interaction.
2. UI must not become the primary location for business logic.
3. Important academic calculations must remain in authoritative application/domain/analytics layers.
4. The UI should consume authoritative data.
5. Reusable components should be used where they improve consistency.
6. Premature abstraction should be avoided.
7. Academic OS should maintain a consistent design system.
8. Responsive behavior must be considered during development.
9. Empty, loading, error, and success states must be considered.
10. Forms must provide appropriate validation feedback.
11. Destructive operations require clear user communication.
12. Accessibility must be considered during implementation.
13. Charts should provide meaningful analytical value.
14. Google AI Studio may be used for UI ideation and prototyping.
15. Google AI Studio output is not automatically the final implementation.
16. Copilot may assist with implementation after the design direction is established.
17. AI-generated UI code must be reviewed and tested.
18. UI should communicate with application/service layers rather than directly implementing domain or persistence logic.
19. Dashboard metrics must come from authoritative analytics.
20. Backup UI must use the backup service rather than implementing backup logic itself.
21. AI UI must communicate through the AI service/context architecture.
22. UI development must follow Git workflow.
23. Visual review is required for significant UI changes.
24. R1 should prioritize usability and clarity over visual complexity.
25. Performance optimization should be evidence-driven.
26. UI development should remain consistent with the locked architecture.

---

## 13.92 Acceptance Criteria

Part 13 is considered complete when:

- UI purpose is defined.
- UI architecture boundary is defined.
- UI development workflow is defined.
- Dashboard design principles are defined.
- Component strategy is defined.
- Design system principles are defined.
- Responsive strategy is defined.
- Navigation principles are defined.
- Form strategy is defined.
- Validation strategy is defined.
- Loading states are defined.
- Empty states are defined.
- Error states are defined.
- Success feedback is defined.
- Destructive-action handling is defined.
- Table strategy is defined.
- Chart strategy is defined.
- AI Assistant UI boundaries are defined.
- Backup UI boundaries are defined.
- State management principles are defined.
- Derived-data principles are defined.
- Accessibility strategy is defined.
- Visual review process is defined.
- Google AI Studio workflow is defined.
- Copilot UI workflow is defined.
- UI task decomposition is defined.
- UI implementation order is defined.
- Mock-data strategy is defined.
- UI testing strategy is defined.
- Visual regression strategy is defined.
- UI bug workflow is defined.
- UI architecture violation handling is defined.
- UI review checklist is defined.
- UI relationship with Git is defined.
- UI relationship with Copilot is defined.
- UI relationship with analytics is defined.
- UI relationship with backup is defined.
- UI relationship with AI is defined.
- UI milestones are defined.
- UI Definition of Ready is defined.
- UI Definition of Done is defined.
- Phase checkpoint is defined.

# Part 14 — Milestones & Definition of Done

## 14.1 Purpose

This part defines the milestones, development gates, completion criteria, and release conditions for Academic OS.

The objective is to provide a clear answer to:

- What should be built first?
- What must be completed before moving forward?
- When is a feature actually finished?
- When is a milestone complete?
- When is R1 ready?
- What does "Academic OS is complete" mean?

The project should use measurable completion criteria rather than relying on subjective judgments.

---

## 14.2 Completion Philosophy

Academic OS should be considered complete based on:

```text
Required Functionality
+
Correctness
+
Testing
+
Architecture Compliance
+
Usability
+
Data Safety
+
Documentation
```

A feature is not considered complete merely because it appears on the screen.

---

## 14.3 Development Lifecycle

The overall development lifecycle is:

```text
Planning
   ↓
Foundation
   ↓
Core Academic Management
   ↓
Analytics
   ↓
Dashboard
   ↓
Backup / Restore
   ↓
AI Assistant
   ↓
UI Refinement
   ↓
Integration Testing
   ↓
Release Preparation
   ↓
R1
```

---

## 14.4 Release Structure

Academic OS should use incremental releases.

Conceptually:

```text
R0
 ↓
R1
 ↓
Future Releases
```

---

## 14.5 R0 Definition

R0 represents the minimum functional foundation required to begin using and validating the architecture.

R0 should prioritize:

```text
Core Architecture
Core Data Model
Basic Persistence
Basic Academic Data
Basic Application Flow
Basic Testing
```

R0 does not need the complete polished dashboard or AI experience.

---

## 14.6 R0 Goal

The purpose of R0 is to prove:

```text
The architecture works.
The data can be stored.
The core academic workflow works.
The application can be tested.
```

---

## 14.7 R0 Boundary

R0 should avoid unnecessary feature expansion.

Potentially excluded from R0:

```text
Advanced Analytics
Advanced Dashboard
AI Assistant
Advanced Backup UX
Visual Polish
Complex Notifications
```

These can be developed after the foundation is validated.

---

## 14.8 R1 Definition

R1 represents the first complete usable version of Academic OS.

R1 should provide the core experience:

```text
Academic Data Management
+
Progress Monitoring
+
Analytics
+
Dashboard
+
Goals
+
Backup / Restore
+
AI Assistance
```

subject to the scope defined in the PRD and earlier documents.

---

## 14.9 R1 Goal

The goal of R1 is:

> Provide a reliable personal academic operating system that allows the user to record academic information, monitor progress, understand performance, manage goals, protect data, and optionally use AI-assisted academic insights.

---

## 14.10 R1 Completion Principle

R1 should be:

```text
Complete enough to use
+
Stable enough to trust
+
Simple enough to maintain
```

It does not need every future feature.

---

## 14.11 Future Features

Features not required for R1 should remain outside the R1 completion gate.

Examples may include:

```text
Advanced Automation
Advanced Notifications
Multi-User Support
Cloud Synchronization
Advanced Integrations
Mobile Application
Advanced AI Agents
```

These should not delay R1 unless explicitly promoted into scope.

---

## 14.12 Milestone Structure

Development should be divided into major milestones.

Recommended:

```text
M0 — Project Setup
M1 — Core Foundation
M2 — Academic Management
M3 — Analytics
M4 — Dashboard
M5 — Goals & Monitoring
M6 — Backup / Restore
M7 — AI Assistant
M8 — UI Refinement
M9 — Integration & Stabilization
M10 — R1 Release
```

---

## 14.13 M0 — Project Setup

### Objective

Establish the development environment and repository.

### Includes

```text
Repository
Project Structure
Development Environment
Package Management
Environment Configuration
Git Workflow
Testing Framework
Basic CI / Validation where appropriate
Copilot Instructions
Initial UI Foundation
```

### Exit Criteria

```text
Project installs successfully.
Project runs locally.
Tests can execute.
Git repository is functional.
No secrets are committed.
Basic project documentation exists.
```

---

## 14.14 M1 — Core Foundation

### Objective

Implement the technical foundation.

### Includes

```text
Domain Foundation
Data Models
Repository Layer
Persistence
Application Services
Validation
Error Handling
Core Testing
```

### Exit Criteria

```text
Core entities can be created.
Core entities can be retrieved.
Core entities can be updated.
Core entities can be deleted where appropriate.
Persistence works correctly.
Validation works.
Tests pass.
```

---

## 14.15 M2 — Academic Management

### Objective

Implement the core academic-management workflow.

### Includes

```text
Subjects
Courses / Academic Records
Grades
Credits
Semester Organization
Academic Program Information
Relevant Academic Requirements
```

### Exit Criteria

```text
Academic data can be entered.
Academic data can be edited.
Academic data can be removed where appropriate.
Data validation works.
Data persists correctly.
Relevant tests pass.
```

---

## 14.16 M3 — Analytics

### Objective

Implement authoritative academic calculations.

### Includes

```text
GPA
Credit Progress
Academic Progress
Requirement Evaluation
Performance Metrics
Trend Calculations
```

### Exit Criteria

```text
Calculations are correct.
Edge cases are covered.
Results are testable.
Analytics are separated from presentation.
Dashboard can consume analytics results.
```

---

## 14.17 M4 — Dashboard

### Objective

Create the main Academic OS monitoring interface.

### Includes

```text
Application Shell
Navigation
Metric Cards
Academic Progress
GPA Overview
Credit Progress
Goal Summary
Important Status Information
Relevant Charts
```

### Exit Criteria

```text
Dashboard displays real application data.
Metrics come from authoritative analytics.
Navigation works.
Loading states work.
Empty states work.
Error states work.
Responsive behavior is acceptable.
Visual review is complete.
```

---

## 14.18 M5 — Goals & Monitoring

### Objective

Allow the user to define and monitor academic goals.

### Includes

```text
Goal Creation
Goal Editing
Goal Progress
Goal Status
Target Tracking
Relevant Dashboard Integration
```

### Exit Criteria

```text
Goals can be created.
Goals can be edited.
Goal progress is calculated correctly.
Goals appear in relevant monitoring interfaces.
Tests pass.
```

---

## 14.19 M6 — Backup / Restore

### Objective

Protect user academic data.

### Includes

```text
Backup Creation
Backup Validation
Backup Restoration
Restore Safety
Version Handling
Backup UI
Error Handling
```

### Exit Criteria

```text
Backup can be created.
Backup can be validated.
Valid backup can be restored.
Invalid backup is rejected safely.
Restore does not silently corrupt data.
Safety procedures work.
Integration tests pass.
```

---

## 14.20 M7 — AI Assistant

### Objective

Provide AI-assisted academic insights without making AI the authoritative data source.

### Includes

```text
AI Service
Context Builder
AI Provider Integration
AI Assistant UI
Prompt Handling
Error Handling
Unavailable State
Relevant Academic Insights
```

### Exit Criteria

```text
AI can receive appropriate context.
AI can provide responses.
Sensitive data is minimized.
AI failures are handled.
AI is clearly separated from authoritative academic data.
The application remains usable when AI is unavailable.
```

---

## 14.21 M8 — UI Refinement

### Objective

Improve consistency, usability, responsiveness, and accessibility.

### Includes

```text
Design System Refinement
Responsive Layout
Accessibility
Visual Consistency
Loading States
Empty States
Error States
Interaction Refinement
```

### Exit Criteria

```text
Major screens are visually consistent.
Desktop experience is stable.
Mobile experience is usable.
Keyboard navigation works for important flows.
Accessibility issues have been reviewed.
Major UI regressions are resolved.
```

---

## 14.22 M9 — Integration & Stabilization

### Objective

Validate the entire system as one application.

### Includes

```text
Integration Testing
End-to-End Workflows
Regression Testing
Data Integrity Testing
Backup / Restore Testing
AI Failure Testing
UI Testing
Performance Review
Security Review
Architecture Review
Bug Fixing
```

### Exit Criteria

```text
Critical workflows pass.
No known critical data-integrity issues remain.
Major regression issues are resolved.
Backup / restore is trustworthy.
AI failure does not break the application.
Major UI workflows work correctly.
Architecture remains compliant.
```

---

## 14.23 M10 — R1 Release

### Objective

Release the first complete usable Academic OS version.

### Includes

```text
Final Test Suite
Final Build
Documentation
Release Notes
Version Tag
Known Limitations
Backup Verification
Release Validation
```

### Exit Criteria

```text
All R1 requirements are satisfied.
Critical tests pass.
Critical bugs are resolved.
Data integrity is verified.
Core workflows work.
Documentation is sufficient.
Release version is tagged.
```

---

## 14.24 Milestone Dependencies

Milestones should generally follow:

```text
M0
 ↓
M1
 ↓
M2
 ↓
M3
 ↓
M4
 ↓
M5
 ↓
M6
 ↓
M7
 ↓
M8
 ↓
M9
 ↓
M10
```

Some implementation work may overlap where dependencies permit.

However, foundational architecture should not be repeatedly rebuilt because later features were implemented prematurely.

---

## 14.25 Parallel Development

Some tasks may be developed in parallel.

For example:

```text
Analytics
      ↘
       Dashboard
      ↗
UI Components
```

or:

```text
Backup Service
      ↘
       Backup UI
```

Parallel work is acceptable when dependencies are clear.

---

## 14.26 Definition of Ready

A task is "Ready" when:

```text
Purpose Is Clear
Requirements Are Known
Dependencies Are Known
Acceptance Criteria Exist
Relevant Architecture Is Known
Required Context Is Available
```

A task should not enter implementation when its intended behavior is still fundamentally unclear.

---

## 14.27 Definition of Done

A feature is "Done" when:

```text
Implementation Complete
+
Tests Complete
+
Architecture Verified
+
UI Reviewed if Applicable
+
Documentation Updated if Needed
+
No Critical Known Issues
```

---

## 14.28 Feature Definition of Done

For a normal feature:

```text
[ ] Requirement implemented
[ ] Acceptance criteria satisfied
[ ] Correct architecture used
[ ] Relevant tests added
[ ] Relevant tests pass
[ ] Error handling implemented
[ ] Edge cases considered
[ ] No unrelated changes
[ ] Code reviewed
[ ] Documentation updated if necessary
```

---

## 14.29 Backend Definition of Done

For backend/domain functionality:

```text
[ ] Domain behavior correct
[ ] Validation implemented
[ ] Repository interaction correct
[ ] Error handling implemented
[ ] Unit tests added
[ ] Integration tests added where needed
[ ] No business logic duplicated
[ ] Architecture compliant
```

---

## 14.30 Analytics Definition of Done

For analytics:

```text
[ ] Formula / rule defined
[ ] Correct data source used
[ ] Edge cases handled
[ ] Unit tests cover calculations
[ ] Boundary cases tested
[ ] Results exposed through appropriate service
[ ] UI does not duplicate calculation
```

---

## 14.31 UI Definition of Done

For UI features:

```text
[ ] Functionality works
[ ] Real application data connected
[ ] Loading state handled
[ ] Empty state handled
[ ] Error state handled
[ ] Responsive behavior checked
[ ] Accessibility reviewed
[ ] Visual consistency checked
[ ] UI tests added where appropriate
[ ] No duplicated business logic
```

---

## 14.32 Backup Definition of Done

For backup / restore:

```text
[ ] Backup generated correctly
[ ] Backup validated
[ ] Restore tested
[ ] Invalid backup rejected
[ ] Data integrity verified
[ ] Safety backup behavior verified
[ ] Error handling verified
[ ] Integration tests pass
```

---

## 14.33 AI Definition of Done

For AI functionality:

```text
[ ] AI service implemented
[ ] Context generation verified
[ ] Prompt boundaries defined
[ ] Error handling implemented
[ ] AI unavailable state handled
[ ] Sensitive data minimized
[ ] AI does not become authoritative data source
[ ] Relevant tests pass
```

---

## 14.34 Testing Gate

A milestone cannot be considered complete if its critical tests are failing.

The workflow is:

```text
Implementation
      ↓
Testing
      ↓
Failure?
  ↙       ↘
Yes       No
 ↓         ↓
Fix       Continue
```

---

## 14.35 Architecture Gate

Before major milestone completion:

```text
Review Architecture
      ↓
Check Locked Decisions
      ↓
Identify Violations
      ↓
Fix or Explicitly Reconsider
```

Silent architectural drift is not acceptable.

---

## 14.36 Data Integrity Gate

Academic data integrity receives a higher priority than cosmetic improvements.

The following should be treated as high-priority failures:

```text
Incorrect GPA
Incorrect Credits
Incorrect Requirement Status
Data Loss
Corrupted Restore
Incorrect Academic Record
```

---

## 14.37 UI Gate

Before a UI milestone is complete:

```text
Functional Check
 ↓
Responsive Check
 ↓
Accessibility Check
 ↓
Visual Check
```

---

## 14.38 Release Gate

Before R1:

```text
Requirements
      ↓
Testing
      ↓
Data Integrity
      ↓
Architecture
      ↓
Security
      ↓
UI
      ↓
Documentation
      ↓
Release
```

All critical gates must pass.

---

## 14.39 Critical Bug Definition

A critical bug is one that can:

```text
Cause Data Loss
Cause Data Corruption
Produce Incorrect Core Academic Results
Break Core Application Startup
Prevent Core Academic Workflow
Create Serious Security Risk
```

Critical bugs must be resolved before R1.

---

## 14.40 High-Priority Bug Definition

A high-priority bug significantly affects a major workflow but does not necessarily cause permanent data loss.

Examples:

```text
Incorrect non-critical analytics
Broken major UI workflow
Failed backup creation with recoverable data
Major accessibility failure
```

High-priority issues should normally be resolved before R1.

---

## 14.41 Medium-Priority Bug Definition

A medium-priority bug affects functionality but has a reasonable workaround.

Examples:

```text
Minor workflow malfunction
Non-critical display problem
Secondary feature issue
```

---

## 14.42 Low-Priority Bug Definition

Low-priority issues include:

```text
Minor visual inconsistency
Small spacing issue
Non-critical cosmetic issue
```

These should not block R1 unless they affect usability significantly.

---

## 14.43 Scope Control

A milestone should not continuously expand.

If a new feature is discovered:

```text
New Idea
 ↓
Evaluate
 ↓
R1 Required?
 ↙        ↘
Yes       No
 ↓         ↓
Add       Backlog
```

---

## 14.44 Feature Promotion

A future feature should only be moved into R1 if:

```text
User Value
+
Feasibility
+
Available Time
+
Architecture Compatibility
```

justify the change.

---

## 14.45 Scope Freeze

Before final R1 stabilization, a scope freeze should occur.

After the freeze:

```text
No New Major Features
```

unless a feature is necessary to fix a fundamental requirement gap.

---

## 14.46 Stabilization Period

After scope freeze:

```text
Feature Development
      ↓
Stops
      ↓
Bug Fixing
Testing
Performance
Accessibility
Documentation
      ↓
Release
```

This prevents the project from endlessly adding features before release.

---

## 14.47 Release Candidate

A release candidate should represent:

```text
Feature Complete
+
Under Final Validation
```

No major unfinished feature should remain.

---

## 14.48 Release Candidate Checklist

```text
[ ] R1 features complete
[ ] Critical tests pass
[ ] Integration tests pass
[ ] Core workflows pass
[ ] Backup tested
[ ] Restore tested
[ ] AI failure tested
[ ] Dashboard validated
[ ] Responsive UI checked
[ ] Accessibility reviewed
[ ] Security reviewed
[ ] Documentation updated
[ ] Known limitations documented
```

---

## 14.49 Performance Review

Performance should be evaluated before release.

Focus on:

```text
Application Startup
Dashboard Loading
Academic Record Operations
Analytics
Backup / Restore
AI Interaction
```

Optimization should target actual bottlenecks.

---

## 14.50 Security Review

Before R1:

```text
Secrets
Input Validation
Data Handling
Dependencies
File Operations
AI Context
Backup Files
```

should be reviewed.

---

## 14.51 Documentation Review

Before release, documentation should be sufficient to answer:

```text
What is Academic OS?
How do I install it?
How do I run it?
How do I configure it?
How do I test it?
How do I back up data?
How do I restore data?
What are the limitations?
```

---

## 14.52 Known Limitations

R1 should explicitly document features or limitations that are intentionally outside scope.

Examples:

```text
No multi-user support
No cloud synchronization
Limited mobile optimization
Limited external integrations
```

Only actual limitations should be listed.

---

## 14.53 Release Readiness

Academic OS is R1-ready when:

```text
R1 Scope Complete
        +
Critical Tests Pass
        +
Critical Bugs Resolved
        +
Data Integrity Verified
        +
Architecture Stable
        +
UI Acceptable
        +
Documentation Complete
```

---

## 14.54 "Complete" vs "Finished Forever"

Academic OS being complete does not mean development ends permanently.

It means:

> The current release has fulfilled its defined requirements and can be maintained as a stable product.

Future development may continue through later releases.

---

## 14.55 Post-R1 Development

After R1:

```text
R1
 ↓
Feedback
 ↓
Backlog Review
 ↓
Prioritization
 ↓
R2 Planning
```

New features should not automatically be added to R1.

---

## 14.56 Milestone Tracking

Each milestone should track:

```text
Status
Tasks
Dependencies
Tests
Known Issues
Exit Criteria
```

A milestone should not be marked complete simply because most tasks are finished.

---

## 14.57 Milestone Status

Recommended statuses:

```text
Not Started
In Progress
Blocked
Ready for Review
Complete
```

---

## 14.58 Blocked State

A milestone should be marked `Blocked` when a dependency prevents meaningful progress.

Examples:

```text
Architecture Decision Missing
Required Technology Not Working
External Dependency Unavailable
Critical Bug Blocking Development
```

---

## 14.59 Review State

`Ready for Review` means:

```text
Implementation Complete
Tests Complete
Developer Review Required
```

This separates implementation completion from formal acceptance.

---

## 14.60 Milestone Completion

A milestone becomes `Complete` only when:

```text
Exit Criteria Satisfied
+
Critical Issues Resolved
+
Required Review Complete
```

---

## 14.61 Progress Tracking

Progress should be measured by completed requirements and milestones rather than raw lines of code.

Avoid metrics such as:

```text
Lines of Code
Number of Files
Number of Components
Number of AI Prompts
```

These do not reliably represent project progress.

---

## 14.62 Recommended Progress Metrics

Useful progress indicators include:

```text
Completed Requirements
Completed Milestones
Passing Critical Tests
Resolved Critical Bugs
Completed R1 Features
```

---

## 14.63 Academic OS Completion Model

A useful high-level model is:

```text
Foundation
   ↓
Functionality
   ↓
Analytics
   ↓
Monitoring
   ↓
Protection
   ↓
Assistance
   ↓
Validation
   ↓
Release
```

---

## 14.64 Final R1 Checklist

Before declaring R1 complete:

```text
PROJECT
[ ] All R1 requirements implemented
[ ] No unresolved critical requirements

ACADEMIC MANAGEMENT
[ ] Academic records work
[ ] Grades work
[ ] Credits work
[ ] Requirements work

ANALYTICS
[ ] GPA is correct
[ ] Progress calculations are correct
[ ] Requirement evaluation is correct

DASHBOARD
[ ] Core metrics work
[ ] Dashboard uses real data
[ ] Navigation works
[ ] Responsive behavior works

GOALS
[ ] Goals work
[ ] Progress tracking works

BACKUP
[ ] Backup works
[ ] Restore works
[ ] Invalid backup is safely rejected
[ ] Data integrity verified

AI
[ ] AI assistant works
[ ] AI unavailable state works
[ ] Context is controlled
[ ] AI is not authoritative

TESTING
[ ] Unit tests pass
[ ] Integration tests pass
[ ] Critical end-to-end workflows pass

UI
[ ] Visual review complete
[ ] Responsive review complete
[ ] Accessibility reviewed

SECURITY
[ ] No secrets committed
[ ] Input validation reviewed
[ ] Data handling reviewed

DOCUMENTATION
[ ] README updated
[ ] Setup documented
[ ] Backup / restore documented
[ ] Known limitations documented
[ ] Release notes prepared

RELEASE
[ ] Version selected
[ ] Release tagged
[ ] Final validation complete
```

---

## 14.65 Part 14 Rules

The following rules apply:

1. Academic OS development should use measurable milestones.
2. R0 represents architectural and functional validation.
3. R1 represents the first complete usable version.
4. Future features should not unnecessarily delay R1.
5. Milestones require explicit exit criteria.
6. Features require a Definition of Done.
7. Tasks require a Definition of Ready.
8. Critical tests must pass before milestone completion.
9. Architecture must be reviewed before major milestone completion.
10. Data integrity receives higher priority than cosmetic improvements.
11. Critical bugs block R1.
12. High-priority bugs should normally be resolved before R1.
13. Scope should be controlled throughout development.
14. R1 should enter scope freeze before final stabilization.
15. Release candidates should be feature-complete.
16. Performance optimization should be evidence-driven.
17. Security review is required before R1.
18. Documentation review is required before R1.
19. Completion means the current release meets its requirements, not that the product can never evolve.
20. Future development should occur through later releases.
21. Progress should be measured by requirements, milestones, tests, and resolved issues rather than code volume.
22. Milestones must not be marked complete until their exit criteria are satisfied.
23. The final release must pass the R1 completion checklist.

---

## 14.66 Acceptance Criteria

Part 14 is considered complete when:

- Development lifecycle is defined.
- R0 is defined.
- R1 is defined.
- R1 boundaries are defined.
- Future-release boundaries are defined.
- Major milestones are defined.
- Milestone dependencies are defined.
- M0 through M10 are defined.
- Milestone exit criteria are defined.
- Definition of Ready is defined.
- Definition of Done is defined.
- Feature completion criteria are defined.
- Backend completion criteria are defined.
- Analytics completion criteria are defined.
- UI completion criteria are defined.
- Backup completion criteria are defined.
- AI completion criteria are defined.
- Testing gates are defined.
- Architecture gates are defined.
- Data integrity gates are defined.
- UI gates are defined.
- Release gates are defined.
- Bug severity is defined.
- Scope control is defined.
- Scope freeze is defined.
- Stabilization period is defined.
- Release candidate criteria are defined.
- Performance review is defined.
- Security review is defined.
- Documentation review is defined.
- Known limitations are defined.
- Release readiness is defined.
- Post-R1 workflow is defined.
- Milestone tracking is defined.
- Progress measurement is defined.
- Final R1 checklist is defined.
- Phase checkpoint is defined.

# Part 15 — Implementation Review & Finalization

## 15.1 Purpose

This part defines the final review process for Academic OS before implementation and before the R1 release.

The purpose is to ensure that:

- Requirements are covered.
- Architecture is consistent.
- Locked decisions are respected.
- Implementation follows the approved design.
- Testing covers critical functionality.
- Academic calculations are correct.
- Data remains safe.
- UI follows the established design principles.
- AI and backup functionality remain within their defined boundaries.
- Documentation remains synchronized with the implementation.

This part is a verification framework rather than another feature-development phase.

---

## 15.2 Finalization Principle

The project should follow:

```text
Plan
 ↓
Implement
 ↓
Verify
 ↓
Correct
 ↓
Release
```

The final review should identify gaps rather than introduce unnecessary new scope.

---

## 15.3 Source of Truth

The project documentation should maintain a clear hierarchy.

Conceptually:

```text
Product Requirements
        ↓
Architecture
        ↓
Technical Design
        ↓
Implementation
        ↓
Testing
```

Each implementation decision should be traceable to an appropriate requirement or technical decision.

---

## 15.4 Cross-Document Consistency

Before implementation and before R1, the documentation should be checked for contradictions.

Review:

```text
PRD
Architecture
Data Model
API / Service Design
UI Design
Testing Strategy
Security Rules
Backup Strategy
AI Strategy
Development Workflow
```

Conflicting decisions should be resolved explicitly.

---

## 15.5 Locked Decisions

Locked decisions should be treated as the current baseline.

Developers should not silently replace them during implementation.

If a locked decision becomes impractical:

```text
Problem Identified
 ↓
Evaluate Impact
 ↓
Propose Change
 ↓
Review
 ↓
Approve / Reject
 ↓
Update Documentation
```

---

## 15.6 Decision Change Rule

A locked decision may be changed when:

```text
Technical Constraint
+
Important New Information
+
Security Concern
+
Major Usability Problem
+
Performance Problem
```

provides sufficient justification.

Convenience alone should generally not justify changing a major architectural decision.

---

## 15.7 Architecture Traceability

Implementation should be traceable to the architecture.

For example:

```text
UI Requirement
 ↓
UI Component
 ↓
Application Service
 ↓
Domain Logic
 ↓
Repository
 ↓
Database
```

A feature should not bypass architectural boundaries without explicit justification.

---

## 15.8 Requirement Traceability

Each important requirement should map to:

```text
Requirement
 ↓
Feature
 ↓
Implementation
 ↓
Test
```

This provides evidence that requirements are actually implemented.

---

## 15.9 Requirement Coverage

Before R1, review all R1 requirements and classify them as:

```text
Implemented
Partially Implemented
Not Implemented
Deferred
```

Only requirements explicitly outside the R1 scope may remain deferred.

---

## 15.10 Feature Coverage Matrix

A useful final review structure is:

| Requirement | Feature | Implementation | Test | Status |
|---|---|---|---|---|
| Requirement A | Feature A | Complete | Passing | Complete |
| Requirement B | Feature B | Complete | Passing | Complete |
| Requirement C | Feature C | Partial | Partial | Review |

The actual matrix should be maintained during implementation.

---

## 15.11 Architecture Review

The final architecture review should verify:

```text
Layer Boundaries
Dependency Direction
Domain Isolation
Repository Usage
Application Services
Data Access
UI Boundaries
AI Boundaries
Backup Boundaries
```

---

## 15.12 Dependency Direction

Dependencies should generally move toward stable application/domain concepts.

Avoid unnecessary dependencies such as:

```text
Domain → UI
Domain → Specific UI Component
Domain → AI Provider
Domain → Database Implementation
```

where those dependencies violate the established architecture.

---

## 15.13 UI Boundary Review

Review the UI for accidental business logic.

Look for:

```text
GPA Calculations
Requirement Evaluation
Database Queries
Backup Serialization
AI Prompt Construction
```

If substantial logic appears inside UI components, move it to the appropriate application/service/domain layer.

---

## 15.14 Analytics Review

Analytics must be treated as an authoritative calculation layer.

Review:

```text
GPA
Credits
Progress
Requirements
Trends
Goals
```

Each calculation should have a clearly defined source and rule.

---

## 15.15 Academic Correctness

Academic correctness receives high priority.

The final review should verify:

```text
GPA Accuracy
Credit Accuracy
Requirement Accuracy
Semester Accuracy
Grade Handling
Edge Cases
```

A visually polished application with incorrect academic calculations is not acceptable.

---

## 15.16 Calculation Verification

Important calculations should be verified using:

```text
Known Examples
Boundary Cases
Invalid Cases
Regression Tests
```

Where appropriate, manually calculate representative examples and compare them with application results.

---

## 15.17 Data Integrity Review

Review:

```text
Create
Read
Update
Delete
Import
Export
Backup
Restore
```

for data-integrity risks.

---

## 15.18 Data Loss Prevention

The final review should verify that normal operations do not unexpectedly destroy academic data.

Particular attention should be given to:

```text
Delete
Restore
Import
Migration
Reset
```

---

## 15.19 Backup Review

The backup system should be tested independently and as part of the complete application.

Review:

```text
Backup Creation
Backup Validation
Backup Storage
Restore
Invalid Backup Handling
Version Compatibility
Safety Backup
```

---

## 15.20 Restore Review

Restore is considered especially sensitive.

Verify:

```text
Valid Backup → Successful Restore
Invalid Backup → Safe Rejection
Corrupted Backup → Safe Rejection
Unexpected Format → Safe Rejection
```

The exact behavior should match the previously established backup design.

---

## 15.21 AI Review

The AI subsystem should be reviewed for:

```text
Context Accuracy
Data Minimization
Failure Handling
Provider Integration
Prompt Construction
Response Handling
Availability
```

---

## 15.22 AI Authority Boundary

The final review must verify:

```text
Academic Data
      ↓
Authoritative Application Logic
```

while:

```text
AI
 ↓
Explanation
Recommendation
Assistance
```

The AI should not silently become the source of truth for academic records.

---

## 15.23 AI Failure Review

The application should remain usable when:

```text
AI Provider Unavailable
Network Failure
Timeout
Invalid Response
Rate Limit
Unexpected Response
```

occurs.

AI failure should not break core academic functionality.

---

## 15.24 UI Review

The final UI review should cover:

```text
Consistency
Hierarchy
Spacing
Typography
Navigation
Forms
Tables
Charts
Responsive Design
Accessibility
Loading States
Empty States
Error States
```

---

## 15.25 Dashboard Review

The Dashboard should answer the primary user questions quickly:

```text
How am I doing?
How much progress have I made?
What should I pay attention to?
Am I meeting my goals?
```

The dashboard should not require the user to navigate through several pages to understand basic academic status.

---

## 15.26 Responsive Review

Review at representative:

```text
Mobile
Tablet
Laptop
Desktop
```

sizes.

Check:

```text
Overflow
Navigation
Cards
Tables
Forms
Charts
Dialogs
```

---

## 15.27 Accessibility Review

Verify:

```text
Keyboard Navigation
Focus
Labels
Semantic Elements
Contrast
Error Messages
Screen Reader Compatibility where practical
```

---

## 15.28 Testing Review

The final testing review should include:

```text
Unit Tests
Integration Tests
End-to-End Tests
UI Tests where appropriate
Regression Tests
Data Integrity Tests
Backup / Restore Tests
```

The exact distribution should follow the project's testing strategy.

---

## 15.29 Test Coverage Philosophy

Coverage percentage should not be treated as the only quality metric.

Priority should be given to:

```text
Critical Business Logic
Academic Calculations
Data Persistence
Backup / Restore
Important Application Workflows
```

---

## 15.30 Regression Review

After major changes, verify that previously completed functionality remains operational.

Examples:

```text
Changing Academic Data
 → GPA still works

Changing Analytics
 → Dashboard still works

Changing Repository
 → Backup still works

Changing AI
 → Core application still works
```

---

## 15.31 Integration Review

The final review should test complete user workflows.

Example:

```text
Create Academic Record
 ↓
Save
 ↓
Analytics Update
 ↓
Dashboard Update
 ↓
Goal Progress Update
 ↓
Backup
 ↓
Restore
 ↓
Verify Data
```

This validates the system as a whole.

---

## 15.32 End-to-End Academic Workflow

At least one representative complete academic workflow should be tested from start to finish.

For example:

```text
Add Semester
 ↓
Add Subjects
 ↓
Add Grades
 ↓
Calculate GPA
 ↓
Calculate Credits
 ↓
Evaluate Requirements
 ↓
View Dashboard
 ↓
Set Goal
 ↓
Create Backup
 ↓
Restore Backup
 ↓
Verify Results
```

---

## 15.33 Performance Review

Performance should be reviewed for:

```text
Startup
Dashboard
Academic Data Operations
Analytics
Backup
Restore
AI Interaction
```

Problems should be measured before optimization.

---

## 15.34 Security Review

The final security review should include:

```text
Secrets
Environment Variables
Dependencies
Input Validation
File Handling
Data Exposure
AI Context
Backup Files
```

---

## 15.35 Secrets Review

Before release:

```text
[ ] No API keys committed
[ ] No passwords committed
[ ] No private tokens committed
[ ] Environment configuration reviewed
[ ] Example configuration contains no real secrets
```

---

## 15.36 Dependency Review

Review important dependencies for:

```text
Known Vulnerabilities
Version Compatibility
Unused Packages
Unnecessary Dependencies
```

Only relevant dependencies should remain in the project.

---

## 15.37 Technical Debt Review

Before R1, identify technical debt.

Classify it as:

```text
Critical
High
Medium
Low
```

Critical technical debt that threatens data integrity, security, or maintainability should be resolved before release.

---

## 15.38 Temporary Code Review

Search for:

```text
TODO
FIXME
Temporary Hack
Mock Data
Debug Output
Placeholder UI
Disabled Validation
```

Each item should be:

```text
Removed
Completed
Documented
```

as appropriate.

---

## 15.39 Debugging Review

Production/R1 builds should not contain unnecessary:

```text
Console Logs
Debug Panels
Test Buttons
Development-only Endpoints
```

unless intentionally included.

---

## 15.40 Documentation Review

Review:

```text
README
Setup Instructions
Architecture
Development Workflow
Testing
Backup / Restore
AI Usage
Known Limitations
Release Notes
```

Documentation should match the actual implementation.

---

## 15.41 Documentation Synchronization

When implementation changes a documented decision:

```text
Implementation Change
 ↓
Documentation Review
 ↓
Update Relevant Document
```

Documentation must not intentionally describe an obsolete architecture.

---

## 15.42 Final Decision Audit

Before R1, review the locked decisions from the project documentation.

For each decision:

```text
Still Valid?
Implemented?
Tested?
Documented?
```

If a decision changed, its change should be explicitly recorded.

---

## 15.43 Architecture Drift

Architecture drift occurs when implementation gradually deviates from the approved architecture without an explicit decision.

Examples:

```text
UI starts querying database directly.
Analytics logic appears in multiple components.
AI calls are scattered across the application.
Backup logic appears inside UI components.
```

Architecture drift should be corrected.

---

## 15.44 Change Control

If an architectural change is necessary:

```text
Identify Problem
 ↓
Document Proposed Change
 ↓
Evaluate Alternatives
 ↓
Evaluate Impact
 ↓
Approve Decision
 ↓
Update Architecture
 ↓
Update Implementation
 ↓
Update Tests
```

---

## 15.45 Final Scope Review

Before R1:

```text
Required Feature?
Optional Feature?
Future Feature?
```

Every feature should have an explicit classification.

---

## 15.46 Scope Creep Review

Remove or defer features that were added without clear R1 justification.

The goal is:

```text
Stable Core Product
```

rather than:

```text
Large Unstable Feature Set
```

---

## 15.47 Release Candidate Review

Before creating the final R1 release:

```text
Feature Complete
 ↓
Testing Complete
 ↓
Bug Review
 ↓
Architecture Review
 ↓
Security Review
 ↓
UI Review
 ↓
Documentation Review
 ↓
Release Candidate
```

---

## 15.48 Release Candidate Freeze

After the release candidate is created:

```text
No New Major Features
```

Only:

```text
Bug Fixes
Critical Improvements
Documentation Corrections
Release Preparation
```

should normally occur.

---

## 15.49 Final Release Checklist

```text
REQUIREMENTS
[ ] All R1 requirements complete
[ ] No required feature remains unfinished

ARCHITECTURE
[ ] Architecture compliant
[ ] No unresolved architecture drift
[ ] Locked decisions reviewed

ACADEMIC CORRECTNESS
[ ] GPA verified
[ ] Credit calculations verified
[ ] Requirement calculations verified
[ ] Edge cases tested

DATA
[ ] CRUD operations verified
[ ] Data integrity verified
[ ] Import/export verified where applicable

BACKUP
[ ] Backup verified
[ ] Restore verified
[ ] Invalid backup handling verified
[ ] Safety behavior verified

ANALYTICS
[ ] Metrics verified
[ ] Dashboard uses authoritative results

AI
[ ] AI service verified
[ ] Context verified
[ ] Failure handling verified
[ ] AI does not act as authoritative data source

UI
[ ] Major screens reviewed
[ ] Responsive behavior reviewed
[ ] Accessibility reviewed
[ ] Loading states reviewed
[ ] Empty states reviewed
[ ] Error states reviewed

TESTING
[ ] Unit tests pass
[ ] Integration tests pass
[ ] End-to-end workflows pass
[ ] Regression testing complete

SECURITY
[ ] Secrets reviewed
[ ] Dependencies reviewed
[ ] Input validation reviewed
[ ] File handling reviewed

PERFORMANCE
[ ] Startup reviewed
[ ] Dashboard reviewed
[ ] Core workflows reviewed

DOCUMENTATION
[ ] README updated
[ ] Setup instructions updated
[ ] Architecture updated
[ ] Testing instructions updated
[ ] Backup instructions updated
[ ] Known limitations documented
[ ] Release notes prepared

RELEASE
[ ] Scope frozen
[ ] Release candidate validated
[ ] Version assigned
[ ] Release tagged
[ ] Final backup created
[ ] R1 released
```

---

## 15.50 Final Acceptance Criteria

Academic OS is considered ready for R1 when:

```text
R1 Requirements
      +
Architecture Compliance
      +
Academic Correctness
      +
Data Integrity
      +
Testing
      +
Security
      +
UI Quality
      +
Documentation
```

have all reached their required acceptance level.

---

## 15.51 Post-Release Review

After R1 release, conduct a short review.

Review:

```text
What Worked?
What Failed?
What Was Delayed?
What Technical Debt Remains?
What Features Should Be Prioritized?
```

This information becomes input for future releases.

---

## 15.52 Post-R1 Backlog

After release:

```text
Feedback
 ↓
Issues
 ↓
Feature Ideas
 ↓
Prioritization
 ↓
R2 Backlog
```

New ideas should be captured rather than immediately added to the released version.

---

## 15.53 Project Handoff

At the end of R1, Academic OS should be in a state where future development can continue without requiring the entire architecture to be rediscovered.

The project should have:

```text
Source Code
Documentation
Tests
Architecture
Development Workflow
Release Information
Known Limitations
Backlog
```

---

## 15.54 Final Project State

The desired final state is:

```text
Academic OS R1
│
├── Stable Application
├── Documented Architecture
├── Tested Core Logic
├── Verified Academic Calculations
├── Working Dashboard
├── Working Backup / Restore
├── Controlled AI Integration
├── Consistent UI
├── Release Documentation
└── Future Backlog
```

---

## 15.55 Finalization Principle

The project should finish with:

```text
Known State
+
Known Scope
+
Known Limitations
+
Known Architecture
+
Known Next Steps
```

rather than an undefined state where development simply stops.

---

## 15.56 Part 15 Rules

The following rules apply:

1. Final review verifies rather than continuously expands scope.
2. Requirements must be traceable to implementation and testing.
3. Locked decisions form the baseline for review.
4. Changes to locked decisions require explicit review.
5. Architecture drift must be identified and corrected.
6. Academic calculations receive high-priority verification.
7. Data integrity receives high-priority verification.
8. Backup and restore require dedicated validation.
9. AI must remain an assistance layer rather than the academic source of truth.
10. UI must remain separated from core business logic.
11. Critical bugs block R1.
12. Security must be reviewed before R1.
13. Documentation must match the actual implementation.
14. Technical debt must be reviewed before release.
15. Temporary development code should be removed or explicitly justified.
16. Scope must be frozen before final stabilization.
17. Release candidates should not receive new major features.
18. R1 requires explicit release acceptance.
19. Post-R1 issues should become backlog items rather than destabilizing R1.
20. Future releases should build on the documented R1 baseline.
21. The project should finish with a known and maintainable state.

---

## 15.57 Acceptance Criteria

Part 15 is considered complete when:

- Final review process is defined.
- Source-of-truth hierarchy is defined.
- Cross-document consistency review is defined.
- Locked-decision review is defined.
- Decision-change process is defined.
- Architecture traceability is defined.
- Requirement traceability is defined.
- Requirement coverage is defined.
- Architecture review is defined.
- UI boundary review is defined.
- Analytics review is defined.
- Academic correctness review is defined.
- Data integrity review is defined.
- Backup review is defined.
- Restore review is defined.
- AI review is defined.
- UI review is defined.
- Responsive review is defined.
- Accessibility review is defined.
- Testing review is defined.
- Regression review is defined.
- Integration review is defined.
- End-to-end review is defined.
- Performance review is defined.
- Security review is defined.
- Secrets review is defined.
- Dependency review is defined.
- Technical debt review is defined.
- Temporary-code review is defined.
- Documentation review is defined.
- Final decision audit is defined.
- Architecture drift review is defined.
- Change-control process is defined.
- Final scope review is defined.
- Release candidate process is defined.
- Final release checklist is defined.
- Post-release review is defined.
- Project handoff is defined.
- Final project state is defined.
- Phase checkpoint is defined.