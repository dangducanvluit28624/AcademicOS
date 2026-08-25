# Part 1 — Architecture Foundation

This part defines the foundational architectural principles, boundaries, goals, and constraints for Academic OS.

The purpose of this part is to establish the architectural direction before defining individual application modules, data structures, persistence mechanisms, or technology-specific implementation details.

All architectural decisions in this document must remain consistent with the locked Product Requirements Document (Document 01).

---

## 1.1 Architectural Purpose

Academic OS is designed as a personal, local-first academic management system.

The architecture must support the product's primary purpose:

> Provide a reliable personal operating system for managing academic planning, progress, productivity, knowledge, analytics, and future career development.

The architecture should prioritize:

- Reliability
- Data ownership
- Maintainability
- Privacy
- Offline capability
- Extensibility
- Clear module boundaries
- Recoverability
- Performance
- Accessibility

The architecture must allow Academic OS to begin as a focused academic management application while providing a controlled path toward future productivity, knowledge, analytics, career, and AI capabilities.

---

## 1.2 Architectural Goals

The architecture has the following primary goals.

### AG-001 — Local-First Operation

Academic OS should be capable of operating primarily from locally stored data.

Core functionality should not require a permanent network connection.

---

### AG-002 — User Data Ownership

The user's academic and personal productivity data should remain under the user's control.

The architecture should avoid unnecessary transmission of personal data to external services.

---

### AG-003 — Reliable Persistence

Core user data must be stored using a persistence mechanism appropriate for structured application data.

The architecture must support:

- Persistent storage
- Transactions
- Data validation
- Schema evolution
- Backup
- Restore
- Recovery

---

### AG-004 — Modular Architecture

Academic OS should be divided into clearly defined modules.

The architecture should minimize unnecessary coupling between modules.

Major product modules include:

- Dashboard
- Academic
- Planner
- Knowledge
- Analytics
- Career
- AI
- Settings

---

### AG-005 — Incremental Development

The architecture must support incremental implementation according to the release strategy defined in the PRD.

```text
R0 → Foundation
R1 → Academic Core / MVP
R2 → Productivity
R3 → Knowledge
R4 → Analytics
R5 → Career
R6 → Intelligent Academic OS
R7 → Future Expansion
```

The architecture should not require future modules to be fully implemented before the MVP can function.

---

### AG-006 — Maintainability

The system should be structured so that individual features and modules can be modified without requiring unnecessary changes throughout the application.

Code organization, dependencies, interfaces, and data access should therefore be explicit.

---

### AG-007 — Testability

Architectural components should be designed so that important behavior can be tested independently.

The architecture should support:

- Unit testing
- Integration testing
- End-to-end testing
- Data migration testing
- Backup and restore testing

---

### AG-008 — Recoverability

The architecture must support recovery from accidental data loss or invalid application state.

Backup and restore functionality is considered part of the core architecture rather than an optional future capability.

This directly supports the mitigation strategy for `RISK-006`.

---

### AG-009 — Future Extensibility

The architecture should allow future functionality to be added without requiring a fundamental rewrite of the entire application.

Potential future extensions include:

- Analytics
- Career management
- AI
- Cloud synchronization
- External integrations
- Local AI
- Mobile or desktop applications

Future extensibility must not unnecessarily complicate the MVP.

---

## 1.3 Architectural Principles

The following principles govern architectural decisions.

### AP-001 — Local-First

The application should assume that local storage is the primary source of application data unless a future architecture explicitly introduces synchronization.

---

### AP-002 — Source Data Is Authoritative

Original user-entered records are authoritative.

Derived information such as:

- Analytics
- Recommendations
- Calculated values
- AI-generated insights

must not silently replace authoritative source records.

---

### AP-003 — Separate Data From Presentation

User data and business logic should not be tightly coupled to UI components.

The architecture should separate:

```text
Presentation
    ↓
Application Logic
    ↓
Domain Logic
    ↓
Data Access
    ↓
Persistence
```

The exact implementation of these layers will be defined in later parts of this document.

---

### AP-004 — Explicit Dependencies

Modules should depend on explicitly defined interfaces or services rather than directly accessing unrelated modules.

---

### AP-005 — Feature Isolation

A feature should be implemented within the module responsible for it whenever practical.

Cross-module communication should occur through defined interfaces.

---

### AP-006 — Progressive Complexity

The architecture should begin with the minimum complexity necessary for R0 and R1.

Additional infrastructure should be introduced only when justified by product requirements.

---

### AP-007 — No Premature External Services

External services should not be introduced unless they provide a clear product or architectural benefit.

The MVP should not depend on external services unnecessarily.

---

### AP-008 — Graceful Degradation

Optional capabilities should fail independently where possible.

In particular:

```text
AI unavailable
      ↓
Core Academic OS continues operating
```

The failure of an optional service must not make core academic functionality unusable.

---

### AP-009 — Privacy by Design

Privacy should be considered during architectural decisions rather than added after implementation.

Data should only leave the local environment when there is a justified requirement and the user is appropriately informed.

---

### AP-010 — Recoverability by Design

Backup, restore, validation, and schema migration should be considered architectural capabilities from the beginning.

They should not be treated as afterthoughts.

---

## 1.4 System Boundary

Academic OS is primarily a client-side application.

The initial system boundary is:

```text
┌────────────────────────────────────────────┐
│              Academic OS                   │
│                                            │
│  ┌──────────────┐     ┌────────────────┐   │
│  │ Presentation │ ──> │  Application   │   │
│  │    Layer     │     │     Logic      │   │
│  └──────────────┘     └──────┬─────────┘   │
│                              │             │
│                      ┌───────▼──────────┐  │
│                      │  Domain Logic    │  │
│                      │ (Business Logic) │  │
│                      └───────┬──────────┘  │
│                              │             │
│                       ┌──────▼───────┐     │
│                       │  Repository  │     │
│                       │    Layer     │     │
│                       └──────┬───────┘     │
│                              │             │
│                       ┌──────▼───────┐     │
│                       │  IndexedDB   │     │
│                       └──────────────┘     │
│                                            │
└────────────────────────────────────────────┘
```

External services are outside the core system boundary.

Potential future integrations may include:

```text
Academic OS
     │
     ├── External Calendar
     ├── Cloud Sync
     ├── AI Provider
     ├── GitHub
     └── Other Services
```

These integrations must be isolated from the core application.

---

## 1.5 Core System Boundary

The following capabilities belong to the core Academic OS architecture:

- Application shell
- Navigation
- Academic data
- Semester management
- Subject management
- Grade management
- GPA calculation
- Credit tracking
- Degree planning
- Dashboard
- Planner
- Persistence
- Backup
- Restore
- Validation
- Settings

These capabilities should remain functional without optional external services.

---

## 1.6 Optional System Boundary

The following capabilities are outside the initial core:

- AI services
- Cloud synchronization
- External calendar services
- GitHub integration
- Other third-party integrations

These should be implemented through explicit abstraction boundaries.

---

## 1.7 Architectural Layers

Academic OS will use a layered architectural model.

### Layer 1 — Presentation

Responsible for:

- Pages
- Components
- Forms
- Tables
- Charts
- Navigation
- User interaction
- Visual feedback

The presentation layer should not directly manipulate persistent storage.

---

### Layer 2 — Application

Responsible for:

- Application use cases
- Coordinating domain operations
- Managing workflows
- Connecting presentation requests to domain logic

Examples:

```text
Create Subject
Calculate GPA
Plan Semester
Create Assignment
Create Backup
Restore Backup
```

---

### Layer 3 — Domain

Responsible for:

- Core business rules
- Academic calculations
- Validation rules
- Domain entities
- Derived academic logic

Examples:

```text
GPA calculation
Credit calculation
Graduation progress
Semester validation
Academic planning rules
```

---

### Layer 4 — Repository / Data Access

Responsible for:

- Reading data
- Writing data
- Updating data
- Deleting data
- Transactions
- Querying
- Persistence abstraction

The application and domain layers should not depend directly on IndexedDB implementation details.

---

### Layer 5 — Infrastructure

Responsible for:

- IndexedDB
- Browser APIs
- File APIs
- Backup files
- Import/export mechanisms
- Optional external integrations
- Future AI providers

Infrastructure details should remain behind appropriate interfaces.

---

## 1.8 Dependency Direction

Dependencies should generally flow inward:

```text
Presentation
     ↓
Application
     ↓
Domain
     ↓
Repository Interfaces
     ↓
Infrastructure Implementations
```

The domain should not depend on:

- UI components
- Browser-specific presentation code
- AI providers
- External APIs
- Specific storage implementations

This allows core logic to remain testable and replaceable.

---

## 1.9 Architecture and Release Strategy

The architecture should evolve alongside releases.

### R0 — Foundation

Focus:

- Application shell
- Navigation
- Persistence
- Repository layer
- Validation
- Error handling
- Backup
- Restore
- Schema versioning

### R1 — Academic Core / MVP

Focus:

- Academic module
- Degree configuration
- Semester planning
- Subject management
- Grades
- GPA
- Credits
- Graduation progress
- Academic dashboard

### R2 — Productivity

Focus:

- Calendar
- Timetable
- Tasks
- Assignments
- Exams
- Study planner
- Study sessions
- Focus timer

### R3 — Knowledge

Focus:

- Notes
- Resources
- Books
- Code snippets
- Tags
- Search

### R4 — Analytics

Focus:

- Academic analytics
- GPA analytics
- Subject analytics
- Credit analytics
- Productivity analytics
- Historical trends

### R5 — Career

Focus:

- Projects
- Skills
- Certifications
- Competitions
- Internship tracking
- Portfolio
- Learning roadmap

### R6 — Intelligent Academic OS

Focus:

- AI Assistant
- GPA Advisor
- AI Study Planner
- Academic Insights
- Semester Review
- AI Recommendations

AI remains optional.

### R7 — Future Expansion

Potential capabilities:

- Cloud synchronization
- External integrations
- Mobile application
- Desktop application
- Local AI
- OCR
- Voice notes
- Plugin architecture

These capabilities are not commitments for the MVP.

---

## 1.10 Architecture Constraints

The following constraints originate from the product requirements and must be respected during architecture design.

### ACNST-001 — Personal Use

Academic OS is designed for a single personal user.

The architecture does not require:

- Multi-user administration
- Role management
- Organization management
- Admin dashboards
- User provisioning

---

### ACNST-002 — Local-First

Core application functionality must not require continuous network connectivity.

---

### ACNST-003 — Browser-Based Initial Architecture

The initial architecture should target a modern web application environment.

Specific framework and library selections will be determined in Part 2.

---

### ACNST-004 — IndexedDB Persistence

The application will use IndexedDB as the primary local structured-data persistence mechanism.

The specific schema and repository architecture will be defined later.

---

### ACNST-005 — No Required Backend for MVP

The MVP should not require a custom backend server.

A future backend may be introduced if justified by synchronization, authentication, collaboration, or other future requirements.

---

### ACNST-006 — Optional AI

AI must not be required for core functionality.

---

### ACNST-007 — Data Recovery

The architecture must support user-controlled backup and restoration.

---

### ACNST-008 — Privacy

The architecture should minimize unnecessary external transmission of user data.

---

## 1.11 Architecture Quality Attributes

The architecture should be evaluated against the following qualities:

| Quality | Goal |
|---|---|
| Reliability | Core operations should behave predictably |
| Availability | Core functionality should work offline |
| Performance | UI interactions should remain responsive |
| Maintainability | Modules should remain understandable and modifiable |
| Testability | Core logic should be independently testable |
| Privacy | User data should remain under user control |
| Recoverability | Data should be recoverable from backups |
| Extensibility | Future modules should be addable without major rewrites |
| Accessibility | UI should support accessible interaction |
| Security | Stored and transmitted data should be appropriately protected |

---

## 1.12 Architecture Decision Boundaries

This part intentionally does not finalize detailed implementation choices.

The following decisions will be addressed later:

| Decision | Planned Part |
|---|---|
| Frontend framework | Part 2 |
| Language/toolchain | Part 2 |
| Component architecture | Part 3 |
| Data model | Part 4 |
| IndexedDB schema | Part 5 |
| Repository implementation | Part 5 |
| State management solution | Part 6 |
| Module boundaries | Part 7 |
| Backup format | Part 8 |
| Analytics implementation | Part 10 |
| AI abstraction | Part 11 |
| AI model | Future ADR |
| Deployment strategy | Part 12 |

This prevents architectural decisions from being made before the relevant requirements and constraints have been analyzed.

---

## 1.13 Architecture Governance

Architecture decisions should follow the following process:

```text
Requirement
    ↓
Architectural Problem
    ↓
Available Options
    ↓
Trade-off Analysis
    ↓
Decision
    ↓
Implementation
    ↓
Verification
```

Significant decisions should be documented through an Architecture Decision Record (ADR).

ADRs must reference relevant PRD identifiers where applicable.

Example:

```text
PRD:
NFR-XXX
RISK-006
FEAT-004

        ↓

ADR:
ADR-002 — Persistence Strategy

        ↓

Architecture:
IndexedDB + Repository Layer
```

---

## 1.14 Architecture Change Management

The architecture may evolve as implementation reveals new constraints.

However, changes should preserve:

- Locked PRD requirements
- Core architectural principles
- Data integrity
- Backup/recovery capabilities
- Privacy requirements
- Module boundaries

If a proposed architecture change requires changing a locked product requirement, the change must be reviewed against Document 01 before implementation.

Significant architectural changes should result in a new or updated ADR.

---

## 1.15 Part 1 Completion Criteria

Part 1 is considered complete when:

- Architectural goals are defined.
- Architectural principles are defined.
- System boundaries are defined.
- Core and optional capabilities are distinguished.
- Layer responsibilities are defined.
- Dependency direction is defined.
- Release architecture is aligned with the PRD.
- Core architectural constraints are documented.
- Architecture quality attributes are defined.
- Future architecture decision boundaries are identified.
- Architecture governance is defined.

No framework-specific implementation decision is required to complete this part.

# Part 2 — Application Architecture

This part defines how Academic OS is organized internally at the application level. It builds directly on the layered architecture and dependency direction established in locked Part 1.

The focus here is **how the application is structured and how its major layers communicate**. Detailed UI implementation, database schema, persistence implementation, state-management technology, and AI implementation are intentionally deferred to later parts.

---

## 2.1 Purpose

The application architecture provides a structured boundary between:

- User interface
- Application workflows
- Academic/business rules
- Data access
- Infrastructure

The architecture should make it possible to add or modify features without creating unnecessary dependencies across the entire system.

The application should remain understandable as functionality expands from the R0 foundation and R1 MVP toward later releases.

---

## 2.2 Application Architecture Model

Academic OS will follow the layered structure established in Part 1:

    ┌──────────────────────────────────────────────┐
    │              Presentation Layer              │
    │                                              │
    │ Pages • Components • Forms • Charts • UI     │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │              Application Layer               │
    │                                              │
    │ Use Cases • Services • Workflows             │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │                 Domain Layer                 │
    │                                              │
    │ Entities • Rules • Calculations • Validation │
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │          Repository / Data Access            │
    │                                              │
    │ Repository Interfaces • Queries • Persistence│
    └──────────────────────┬───────────────────────┘
                           │
                           ▼
    ┌──────────────────────────────────────────────┐
    │             Infrastructure Layer             │
    │                                              │
    │ IndexedDB • Browser APIs • File APIs • APIs  │
    └──────────────────────────────────────────────┘

The direction of dependency should remain consistent with Part 1:

    Presentation
         ↓
    Application
         ↓
    Domain
         ↓
    Repository Interfaces
         ↓
    Infrastructure Implementations

---

## 2.3 Presentation Layer

The Presentation Layer is responsible for displaying information and receiving user interaction.

It includes:

- Pages
- Layouts
- UI components
- Forms
- Tables
- Charts
- Dialogs
- Navigation
- Notifications
- Loading states
- Error states

The Presentation Layer should primarily answer:

> **How should information be presented to the user?**

It should not contain core academic calculations or direct persistence operations.

For example, a GPA page may display a calculated GPA, but the GPA calculation itself belongs to the Domain/Application architecture rather than the UI component.

---

## 2.4 Application Layer

The Application Layer coordinates user-facing operations.

It represents application **use cases** rather than individual UI elements.

Examples include:

- Create subject
- Update subject
- Record grade
- Calculate academic progress
- Plan semester
- Create task
- Create backup
- Restore backup
- Search knowledge
- Generate analytics

A typical workflow should follow:

    User Action
        ↓
    Presentation
        ↓
    Application Use Case
        ↓
    Domain Logic
        ↓
    Repository
        ↓
    Persistence

The Application Layer should coordinate operations without becoming the location for all business rules.

---

## 2.5 Domain Layer

The Domain Layer contains rules that define how Academic OS behaves.

Examples include:

### Academic Rules

- GPA calculation
- Credit calculation
- Subject completion
- Semester validation
- Graduation progress
- Academic planning rules

### Planner Rules

- Task state transitions
- Scheduling constraints
- Study-session calculations

### Analytics Rules

- GPA trends
- Credit progress
- Historical calculations

The Domain Layer should remain independent from:

- UI frameworks
- IndexedDB
- Browser-specific APIs
- External APIs
- AI providers

This allows core logic to be tested independently.

---

## 2.6 Repository Layer

The Repository Layer provides an abstraction between the application/domain logic and the actual persistence mechanism.

For example:

- `SubjectRepository`
- `GradeRepository`
- `SemesterRepository`
- `TaskRepository`
- `NoteRepository`
- `SettingsRepository`

The application should interact with repository interfaces rather than directly accessing IndexedDB.

Conceptually:

    Application / Domain
            │
            ▼
    Repository Interface
            │
            ▼
    Repository Implementation
            │
            ▼
         IndexedDB

This allows the underlying persistence mechanism to change without requiring the entire application to be rewritten.

---

## 2.7 Infrastructure Layer

The Infrastructure Layer contains technology-specific implementations.

Potential responsibilities include:

- IndexedDB access
- Browser storage APIs
- File APIs
- Import/export
- Backup file handling
- External APIs
- Future AI providers

Infrastructure code should not leak unnecessary implementation details into the Domain Layer.

For example:

    Domain:
        SubjectRepository

    Infrastructure:
        IndexedDBSubjectRepository

The domain understands the repository contract, while infrastructure understands how the data is physically stored.

---

## 2.8 Application Modules

Academic OS will organize functionality into major feature modules.

    Academic OS
    │
    ├── Dashboard
    ├── Academic
    ├── Planner
    ├── Knowledge
    ├── Analytics
    ├── Career
    ├── AI
    └── Settings

These modules correspond to the product structure established in the PRD.

The modules should remain independently understandable while sharing common application infrastructure where appropriate.

---

## 2.9 Core vs Optional Modules

The architecture distinguishes between core and optional modules.

### Core Modules

These support the MVP and fundamental operation:

    Application Shell
    Academic
    Dashboard
    Settings
    Persistence
    Backup / Restore

### Later Modules

    Planner
    Knowledge
    Analytics
    Career

### Optional Intelligent Layer

    AI

The AI module must remain optional.

The absence or failure of AI must not prevent the core application from functioning.

---

## 2.10. Application Services

Application Services coordinate operations that may involve multiple domain objects or repositories.

Examples:

    AcademicService
    PlanningService
    BackupService
    AnalyticsService
    SearchService
    SettingsService

A service should represent a meaningful application operation rather than simply wrapping every repository method.

For example:

    CalculateGraduationProgress()

is a meaningful application operation.

A service should not exist merely because:

    repository.get()

was called.

The architecture should avoid unnecessary abstraction.

---

## 2.11 Use Case Structure

Application operations should be represented as use cases where appropriate.

Example:

    | Create Subject |

    Presentation
         ↓
    CreateSubjectUseCase
         ↓
    Validate Subject
         ↓
    Subject Domain Rules
         ↓
    SubjectRepository
         ↓
    IndexedDB

Another example:

    | Calculate GPA | 

    Presentation
         ↓
    CalculateGPAUseCase
         ↓
    GradeRepository
         ↓
    GPA Domain Logic
         ↓
    Calculated Result
         ↓
    Presentation

The exact implementation pattern may be adjusted during development if justified by complexity.

---

## 2.12 Cross-Module Communication

Modules should avoid directly manipulating another module's internal data.

Preferred communication:

    Module A
       │
       ▼
    Application Service / Interface
       │
       ▼
    Module B

Avoid:

    Module A
       │
       └──────────────► Module B internal database access

For example, the Dashboard should not directly manipulate Academic module storage.

Instead:

    Dashboard
        ↓
    Academic Application Service
        ↓
    Academic Data

This protects module boundaries.

---

## 2.13 Shared Services

Some functionality is inherently shared across modules.

Potential shared services include:

- Validation
- Date/time handling
- ID generation
- Search
- Notifications
- Error handling
- Backup/restore
- Import/export
- Configuration
- Logging

Shared services should remain small and focused.

A shared service should exist when functionality genuinely belongs across multiple modules, rather than simply because reuse is possible.

---

## 2.14 Shared Domain Concepts

Some concepts may be referenced by multiple modules.

Examples:

- Semester
- Subject
- Date
- Tag
- Category
- Status
- Academic Year

Shared concepts should have clear ownership.

For example:

    Academic
       ├── Subject
       ├── Semester
       ├── Grade
       └── ...

Planner may reference a Subject but should not redefine the Subject entity independently.

This prevents duplicate representations of the same underlying concept.

---

## 2.15 Dependency Rules

The following dependency rules apply.

### Rule 1 — UI Does Not Own Business Logic

Presentation components should not become the source of truth for academic rules.

---

### Rule 2 — UI Does Not Access Persistence Directly

Presentation components should use application-level operations.

Avoid:

    Component
       ↓
    IndexedDB

Prefer:

    Component
       ↓
    Use Case / Service
       ↓
    Repository
       ↓
    IndexedDB

---

### Rule 3 — Domain Does Not Depend on Infrastructure

Domain logic should not import IndexedDB-specific implementations.

---

### Rule 4 — Modules Do Not Access Other Modules' Internals

Modules should communicate through defined application interfaces or shared domain contracts.

---

### Rule 5 — Infrastructure Does Not Define Product Rules

Infrastructure should implement technical behavior rather than deciding academic business rules.

---

## 2.16 Error Propagation

Errors should move through the architecture in a controlled manner.

Conceptually:

    Infrastructure Error
            ↓
    Repository Error
            ↓
    Application Error
            ↓
    Presentation Error State
            ↓
    User Feedback

Technical errors should not be exposed directly to the user when they contain implementation details.

For example, the UI should not display a raw IndexedDB exception as the primary user-facing message.

Instead:

    Technical Error
          ↓
    Mapped Application Error
          ↓
    User-friendly Message

Detailed error information may still be recorded for debugging.

---

## 2.17 Validation Responsibility

Validation should occur at the appropriate architectural level.

### Presentation Validation

Used for immediate user feedback.

Examples:

- Required field
- Invalid format
- Invalid input type

### Domain Validation

Used for business rules.

Examples:

- Invalid grade
- Invalid credit value
- Invalid semester relationship
- Invalid academic state

### Persistence Validation

Used to protect stored data integrity.

Examples:

- Invalid record structure
- Missing required identifiers
- Unsupported schema version

Validation should not rely exclusively on the UI.

---

## 2.18 Derived Data

Academic OS will contain both authoritative and derived data.

### Authoritative Data

Examples:

- Subject records
- Grades
- Credits
- Semester information
- Tasks
- Notes

### Derived Data

Examples:

- GPA
- Credit completion percentage
- Graduation progress
- Analytics
- Charts
- Recommendations

Derived information should be recalculable from authoritative data wherever practical.

This reduces the risk of inconsistent stored results.

---

## 2.19. Application Startup

The application startup process should conceptually follow:

    Application Start
           ↓
    Initialize Environment
           ↓
    Initialize Persistence
           ↓
    Validate / Migrate Schema
           ↓
    Load Application Configuration
           ↓
    Initialize Required Services
           ↓
    Initialize Application State
           ↓
    Render Application

Optional services should not block core application startup unnecessarily.

For example:

    AI initialization failure
            ↓
    Log / notify if necessary
            ↓
    Continue application startup

---

## 2.20 Application Shutdown / Persistence Safety

Because Academic OS is local-first, the architecture should minimize the possibility of data loss during normal operation.

Important operations should be persisted through appropriate transactions.

The application should avoid relying exclusively on temporary in-memory state for authoritative user data.

---

## 2.21. Technology Boundary

Part 2 establishes the architectural boundary for technology selection without prematurely locking every library.

The following categories require explicit decisions:

| Category | Decision Status |
|---|---|
| Web framework | To be evaluated |
| Programming language | To be evaluated |
| Build tool | To be evaluated |
| UI library | To be evaluated |
| State management | Part 6 |
| IndexedDB implementation | Part 5 |
| Testing framework | Part 12 |
| Charting | Later architecture decision |
| AI provider | Future ADR |
| Deployment platform | Part 12 |

Technology choices must be evaluated against the requirements and architectural principles established in Part 1.

---

## 2.22 Technology Selection Principles

Technology selection should prioritize:

1. Long-term maintainability
2. Reliability
3. Strong ecosystem support
4. Type safety where beneficial
5. Testing support
6. Developer productivity
7. Bundle/performance considerations
8. Offline compatibility
9. Accessibility
10. Minimal unnecessary complexity

Popularity alone should not determine a technology choice.

---

## 2.23. Application Architecture and MVP

The MVP should use the simplest architecture capable of satisfying the locked PRD requirements.

The MVP should not require:

- Microservices
- Custom backend infrastructure
- Multi-user architecture
- Authentication servers
- Cloud databases
- AI infrastructure
- Complex distributed systems

The architecture should remain capable of evolving toward these capabilities if future requirements justify them.

---

## 2.24 Architectural Trade-Off

Academic OS intentionally favors:

> **Modular simplicity over premature architectural complexity.**

The application should have clear boundaries, but those boundaries should not become unnecessary layers or abstractions that provide no practical benefit.

The architecture should therefore follow:

    Clear Boundaries
           +
    Simple Implementation
           +
    Explicit Dependencies
           +
    Incremental Complexity

rather than:

    Maximum Abstraction
           +
    Maximum Infrastructure
           +
    Maximum Complexity

---

## 2.25. Part 2 Completion Criteria

Part 2 is considered complete when:

- Application layers are clearly defined.
- Responsibilities of each layer are documented.
- Application modules are identified.
- Core and optional modules are distinguished.
- Application services are defined conceptually.
- Use-case responsibilities are established.
- Cross-module communication rules are defined.
- Dependency rules are documented.
- Error propagation is defined.
- Validation responsibilities are defined.
- Authoritative and derived data are distinguished.
- Application startup behavior is defined.
- Technology-selection boundaries are established.
- MVP architectural complexity is constrained.
- No unnecessary technology decision is prematurely locked.

Detailed frontend implementation will be defined in Part 3.

Detailed data architecture will be defined in Part 4.

Detailed persistence architecture will be defined in Part 5.

# Part 3 — Frontend Architecture

This part defines the frontend architecture of Academic OS.

It builds on the architectural foundation established in Part 1 and the application structure established in Part 2.

The purpose of this part is to define how the user interface is organized, how frontend components communicate with application logic, how navigation is structured, and how the frontend should remain maintainable as Academic OS expands.

Technology-specific implementation details should only be locked where they are justified by the requirements and architecture.

---

## 3.1. Purpose

The frontend is the primary interaction layer between the user and Academic OS.

It should provide:

- Clear navigation
- Consistent visual structure
- Responsive interaction
- Accessible interfaces
- Fast feedback
- Reliable forms
- Clear data presentation
- Consistent error handling
- Support for desktop and smaller screens
- A foundation for future modules

The frontend should make Academic OS feel like a coherent operating system rather than a collection of unrelated pages.

---

## 3.2 Frontend Architecture Principles

The frontend should follow these principles:

### FP-001 — Component Reusability

Common interface patterns should be implemented as reusable components.

Examples include:

- Buttons
- Inputs
- Selects
- Modals
- Cards
- Tables
- Tabs
- Dropdowns
- Notifications
- Empty states

---

### FP-002 — Feature-Oriented Organization

Frontend code should primarily be organized around features rather than placing all components into a single global component directory.

Conceptually:

```text
features/
├── academic/
├── planner/
├── knowledge/
├── analytics/
├── career/
└── ai/
```

Shared components should remain separate from feature-specific components.

---

### FP-003 — Presentation Does Not Own Business Rules

Frontend components should not become the source of truth for:

- GPA calculation
- Credit calculation
- Graduation requirements
- Academic validation
- Data persistence

These responsibilities belong to the appropriate application/domain layers.

---

### FP-004 — Consistent Interaction Patterns

Equivalent actions should behave consistently throughout Academic OS.

For example:

- Save buttons should behave consistently.
- Destructive actions should require appropriate confirmation.
- Validation messages should use a consistent pattern.
- Loading states should behave consistently.
- Success feedback should follow a common pattern.

---

### FP-005 — Progressive Disclosure

The interface should show the most important information first while allowing deeper details to be accessed when needed.

The dashboard should therefore prioritize high-value academic information rather than displaying every available metric simultaneously.

---

### FP-006 — Responsive Design

The interface should adapt to different viewport sizes.

The initial target is desktop and laptop usage, while smaller-screen compatibility should be maintained.

---

### FP-007 — Accessibility

Frontend components should follow accessible interaction principles.

The application should consider:

- Keyboard navigation
- Focus management
- Semantic HTML
- Form labels
- Color contrast
- Screen-reader compatibility
- Error identification
- Reduced-motion preferences where appropriate

---

## 3.3 Frontend Layer Structure

The frontend should follow the application architecture defined in Part 2.

```text
UI Components
      ↓
Feature Pages
      ↓
Feature Application Interfaces
      ↓
Application Services / Use Cases
      ↓
Domain Logic
```

The frontend should not bypass the application architecture.

Avoid:

```text
UI Component
      ↓
IndexedDB
```

Prefer:

```text
UI Component
      ↓
Feature/Application Interface
      ↓
Use Case / Service
      ↓
Repository
      ↓
Persistence
```

---

## 3.4 Frontend Composition

The frontend should conceptually be composed of:

```text
Application Shell
│
├── Navigation
├── Header
├── Main Content
├── Global Feedback
└── Feature Pages
```

Feature pages are responsible for composing feature-specific UI.

For example:

```text
Academic
├── Academic Overview
├── Subjects
├── Semesters
├── Grades
└── Degree Progress
```

---

## 3.5 Application Shell

The Application Shell provides the persistent structure around the application.

It should contain:

- Primary navigation
- Application branding
- Current page context
- Global notifications
- Global command/search access where implemented
- Main content container
- Application-level error boundaries
- Theme configuration

The shell should remain stable as new modules are added.

---

## 3.6 Navigation Architecture

Navigation should reflect the product's major information architecture.

Initial navigation should conceptually include:

```text
Dashboard

Academic
    ├── Overview
    ├── Subjects
    ├── Semesters
    ├── Grades
    └── Degree Progress

Planner

Knowledge

Analytics

Career

AI

Settings
```

Not every item needs to be implemented in R1.

Unavailable or future modules should not create confusing dead-end navigation.

---

## 3.7. Navigation Principles

### Navigation Rule 1

Primary navigation should expose the most important areas of Academic OS.

### Navigation Rule 2

Deeply nested navigation should be avoided where possible.

### Navigation Rule 3

Current location should always be visually clear.

### Navigation Rule 4

Navigation should remain usable with keyboard input.

### Navigation Rule 5

Future modules should be addable without restructuring the entire navigation system.

---

## 3.8 Dashboard Architecture

The Dashboard is the primary overview screen.

Its responsibility is to answer:

> "What is important for me right now?"

The dashboard should prioritize information such as:

- Current semester
- Current GPA
- Overall GPA
- Completed credits
- Remaining credits
- Upcoming academic events
- Current tasks
- Academic progress
- Important alerts
- Recent activity

The dashboard should avoid becoming a general-purpose display of every available dataset.

---

## 3.9 Dashboard Data Flow

The dashboard should consume derived information from application/domain services.

Conceptually:

```text
Dashboard
    │
    ├── Academic Summary
    ├── Credit Progress
    ├── GPA Summary
    ├── Upcoming Tasks
    └── Recent Activity
             │
             ▼
       Application Services
             │
             ▼
       Domain / Repositories
```

The dashboard should not calculate complex academic rules directly inside UI components.

---

## 3.10 Feature Page Structure

Feature pages should generally follow:

```text
Page
├── Page Header
│   ├── Title
│   ├── Description
│   └── Primary Action
│
├── Filters / Controls
│
├── Main Content
│
└── Secondary Information
```

Not every page needs all sections.

The structure should adapt to the purpose of the feature.

---

## 3.11 Component Hierarchy

Components should generally be organized into levels.

### Level 1 — Primitive Components

Examples:

- Button
- Input
- Label
- Checkbox
- Select
- Badge
- Icon

### Level 2 — Composite Components

Examples:

- Search box
- Form field
- Data table
- Statistic card
- Filter panel
- Confirmation dialog

### Level 3 — Feature Components

Examples:

- GPA summary
- Semester card
- Subject editor
- Degree progress chart
- Assignment list

### Level 4 — Page Components

Examples:

- Dashboard page
- Subjects page
- Semester page
- Analytics page

This structure prevents page components from becoming excessively large.

---

## 3.12 Shared Component Library

A shared UI component library should be created for patterns used throughout Academic OS.

Potential shared components include:

```text
Button
Input
Select
Textarea
Checkbox
Radio
Badge
Card
Modal
Drawer
Tabs
Table
Pagination
Dropdown
Tooltip
Toast
Alert
Progress
Skeleton
EmptyState
ConfirmDialog
```

Only components that provide genuine reuse should be promoted to the shared library.

---

## 3.13 Feature Components

Feature-specific components should remain inside their respective feature modules.

For example:

```text
academic/
├── components/
│   ├── SubjectCard
│   ├── SubjectForm
│   ├── GradeInput
│   └── SemesterSelector
│
├── pages/
│   ├── AcademicOverview
│   ├── Subjects
│   └── Semesters
│
└── services/
```

A component should not be moved into the shared library simply because another component could theoretically use it.

---

## 3.14 Forms Architecture

Forms are important because Academic OS contains substantial structured data.

Forms should support:

- Field validation
- Clear labels
- Helpful descriptions
- Validation feedback
- Save state
- Cancel behavior
- Unsaved-change handling where necessary
- Keyboard interaction
- Appropriate defaults

Form validation should exist at both frontend and domain levels.

---

## 3.15 Form Submission Flow

A typical form submission should follow:

```text
User Input
    ↓
Frontend Validation
    ↓
Form Submission
    ↓
Application Use Case
    ↓
Domain Validation
    ↓
Repository Operation
    ↓
Persistence
    ↓
Success / Error Result
    ↓
UI Feedback
```

The frontend should not assume that successful form validation guarantees successful persistence.

---

## 3.16 Loading States

The frontend should explicitly represent loading states when operations may take noticeable time.

Potential states include:

```text
Idle
Loading
Success
Error
```

For more complex operations:

```text
Idle
   ↓
Validating
   ↓
Processing
   ↓
Success / Error
```

Loading indicators should communicate meaningful progress without unnecessarily blocking the interface.

---

## 3.17 Empty States

Empty states should explain what the user can do next.

Avoid:

```text
No data.
```

Prefer:

```text
No subjects have been added yet.

Add your first subject to begin planning your semester.
```

Where appropriate, the empty state should provide a direct action.

---

## 3.18 Error States

Errors should be:

- Understandable
- Actionable where possible
- Non-destructive
- Consistent

Example:

```text
Unable to save subject.

Your data was not changed.

Try again or check the subject information.
```

Technical implementation details should generally remain hidden from normal users.

---

## 3.19 Destructive Actions

Actions that may permanently remove data should use an appropriate confirmation mechanism.

Examples:

- Delete subject
- Delete semester
- Delete task
- Delete note
- Clear data
- Restore backup

The UI should clearly communicate:

1. What will be deleted or replaced.
2. Whether the operation is reversible.
3. What the user should expect after confirmation.

---

## 3.20 Data Tables

Tables should be used when structured comparison is important.

Potential uses include:

- Subject lists
- Grade records
- Semester records
- Tasks
- Career items
- Knowledge resources

Tables should support appropriate:

- Sorting
- Filtering
- Search
- Pagination or virtualization when necessary
- Responsive behavior

Not every table needs every capability.

---

## 3.21 Charts and Visualization

Charts should be used when visual representation provides more value than raw numbers.

Potential charts include:

- GPA trend
- Credit completion
- Semester performance
- Study time
- Productivity trends

Charts should not be used merely for decoration.

Every chart should communicate a meaningful insight.

---

## 3.22 Responsive Architecture

The frontend should support at least three conceptual viewport categories:

```text
Large Desktop
      ↓
Laptop / Tablet
      ↓
Small Screen
```

The layout should adapt rather than simply shrinking desktop components.

Examples:

```text
Desktop:
Sidebar + Main Content

Small Screen:
Compact Navigation + Main Content
```

---

## 3.23 Desktop-First Consideration

Because Academic OS is primarily a personal productivity application and is expected to be used heavily for academic planning, desktop and laptop screens are the initial priority.

However, mobile compatibility should be considered during component design to avoid architectural decisions that make responsive behavior difficult later.

---

## 3.24 Theme Architecture

The application should support a centralized theme system.

At minimum, the architecture should allow:

- Light theme
- Dark theme

Potential future options may include:

- System preference
- Custom accent colors

Theme configuration should be centralized rather than hard-coded independently inside components.

---

## 3.25 Design Token Strategy

The frontend should use centralized design tokens for recurring visual properties.

Potential token categories include:

- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Breakpoints
- Component dimensions
- Motion

Conceptually:

```text
Design Tokens
      ↓
Shared Components
      ↓
Feature Components
      ↓
Pages
```

This allows the visual system to remain consistent.

---

## 3.26 Visual Design Direction

Academic OS should use a style that communicates:

- Academic
- Professional
- Modern
- Calm
- Focused
- Information-rich
- Clean

The interface should avoid excessive decoration.

The visual hierarchy should prioritize:

```text
Important Information
        ↓
Primary Actions
        ↓
Secondary Information
        ↓
Supporting Details
```

The interface should feel like a productivity tool rather than a generic dashboard template.

---

## 3.27 Accessibility Architecture

Accessibility should be considered at the shared-component level.

For example, if a shared Button component correctly handles:

- Keyboard interaction
- Focus states
- Disabled states
- Accessible naming

then feature pages can inherit those behaviors.

Accessibility issues should therefore be fixed at the lowest reusable level whenever practical.

---

## 3.28 Frontend State Boundary

Frontend state should be separated conceptually into:

### UI State

Examples:

- Modal open/closed
- Selected tab
- Filter state
- Sidebar state
- Form input state

### Application State

Examples:

- Current semester
- Loaded academic records
- Planner state
- User settings

### Persistent Data

Examples:

- Subjects
- Grades
- Semesters
- Tasks
- Notes

Persistent data should not be treated as merely temporary UI state.

Detailed state-management architecture is defined in Part 6.

---

## 3.29 URL / Route State

Where appropriate, important navigation state should be represented in application routes or URL state.

Examples:

```text
/academic
/academic/subjects
/academic/subjects/:id
/academic/semesters
/academic/grades
/analytics
/planner
/settings
```

This improves:

- Navigation
- Browser history
- Deep linking
- Refresh behavior
- Application structure

Exact routing technology will be determined during implementation.

---

## 3.30 Frontend Security Considerations

The frontend should not assume that UI restrictions are security controls.

For example:

```text
Hidden Button ≠ Protected Data
```

Actual authorization or data-access restrictions, if introduced in a future architecture, must be enforced at the appropriate application/infrastructure layer.

Because Academic OS is initially single-user and local-first, the MVP does not require a complex authentication architecture.

---

## 3.31. Performance Principles

The frontend should prioritize perceived responsiveness.

Important principles include:

- Avoid unnecessary re-rendering
- Avoid loading unnecessary data
- Use appropriate lazy loading
- Keep initial application startup lightweight
- Avoid excessively large dependencies
- Optimize large lists
- Avoid unnecessary chart rendering
- Keep interactions responsive

Performance optimization should be evidence-driven rather than premature.

---

## 3.32 Frontend Error Boundary

The application should include an application-level error boundary or equivalent mechanism.

Its responsibilities include:

- Preventing one rendering failure from crashing the entire application
- Displaying a recoverable error state
- Providing a reload/recovery option
- Recording useful debugging information

A frontend error should not automatically imply data loss.

---

## 3.33 Frontend and Backup Operations

Backup and restore interfaces should be treated as high-impact operations.

The UI should clearly communicate:

### Backup

- What is being backed up
- When the backup was created
- Where the file is saved

### Restore

- What data will be replaced
- Whether current data will be overwritten
- Whether the user should create a backup first
- Whether the restore succeeded

Restore should never be presented as an ordinary low-risk action.

---

## 3.34 Frontend and AI

The AI interface must remain visually and architecturally distinct from authoritative academic data.

For example:

```text
Academic Data
     │
     ├── Authoritative
     └── User-controlled

AI Output
     │
     ├── Generated
     ├── Advisory
     └── Potentially Incorrect
```

AI-generated information should therefore be presented as recommendations or assistance rather than silently replacing user data.

The frontend should communicate AI-generated content appropriately.

Detailed AI architecture will be defined in Part 11.

---

## 3.35 Frontend Technology Selection

The frontend technology stack should be selected according to the principles established in Part 2.

The selection should consider:

- Maintainability
- Ecosystem maturity
- Performance
- Type safety
- Accessibility
- Testing
- Developer productivity
- Local-first compatibility
- Build complexity
- Long-term support

The frontend framework should not be selected solely because it is currently popular.

The final selection should be documented through an ADR if it represents a significant architectural decision.

---

## 3.36 Recommended Frontend Project Structure

The following is a recommended conceptual structure:

```text
src/
├── app/
│   ├── routes/
│   ├── providers/
│   ├── layouts/
│   └── app-shell/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── features/
│   ├── academic/
│   ├── planner/
│   ├── knowledge/
│   ├── analytics/
│   ├── career/
│   └── ai/
│
├── domain/
│
├── application/
│
├── repositories/
│
├── infrastructure/
│
├── hooks/
│
├── utils/
│
├── types/
│
└── styles/
```

This structure is conceptual.

The exact folder structure may be adjusted after technology selection.

---

## 3.37 Frontend Module Dependency Example

A feature should conceptually look like:

```text
Academic Page
      ↓
Academic Feature Components
      ↓
Academic Application Interface
      ↓
Academic Use Case
      ↓
Academic Domain Logic
      ↓
Academic Repository
```

The feature should not bypass the architecture by directly importing infrastructure implementations.

---

## 3.38 Frontend Testing Boundaries

Frontend testing should occur at multiple levels.

### Component Tests

Test:

- Rendering
- User interaction
- Validation feedback
- Component states

### Feature Tests

Test:

- Feature workflows
- Form submission
- Navigation
- Application integration

### End-to-End Tests

Test:

- Complete user journeys
- Academic workflows
- Backup/restore workflows
- Critical navigation

Detailed testing architecture will be defined in Part 12.

---

## 3.39 Frontend Architecture Trade-Off

Academic OS should favor:

> **A consistent, reusable interface over excessive component abstraction.**

The frontend should avoid both extremes:

```text
Too Little Structure
→ Large duplicated components
→ Inconsistent UI
→ Difficult maintenance
```

and:

```text
Too Much Structure
→ Excessive abstraction
→ Difficult development
→ Unnecessary complexity
```

The goal is practical reuse.

---

## 3.40 Part 3 Completion Criteria

Part 3 is considered complete when:

- Frontend responsibilities are defined.
- Frontend architectural principles are established.
- Application shell structure is defined.
- Navigation architecture is defined.
- Dashboard responsibilities are defined.
- Feature/page structure is established.
- Component hierarchy is defined.
- Shared and feature-specific components are distinguished.
- Form architecture is defined.
- Loading, empty, and error states are defined.
- Destructive action behavior is defined.
- Responsive behavior is defined.
- Theme and design-token strategy is established.
- Accessibility principles are established.
- Frontend state boundaries are defined.
- Route responsibilities are established.
- Performance principles are defined.
- AI presentation boundaries are established.
- Recommended project structure is documented.
- Frontend testing boundaries are established.
- Technology selection remains appropriately separated from implementation details.

Detailed data architecture will be defined in Part 4.

Detailed persistence architecture will be defined in Part 5.

Detailed state-management architecture will be defined in Part 6.

# Part 4 — Data Architecture

This part defines the data architecture of Academic OS.

It establishes the structure, ownership, relationships, lifecycle, and integrity rules for the information managed by the application.

The purpose of this part is to ensure that Academic OS has a reliable data foundation for:

- Academic monitoring
- Semester planning
- GPA tracking
- Credit tracking
- Graduation progress
- Task management
- Knowledge management
- Analytics
- Career management
- Future AI-assisted features

The architecture distinguishes authoritative user data from derived information, analytics, and AI-generated information.

---

## 4.1 Purpose

The Data Architecture defines:

- Core entities
- Entity ownership
- Relationships
- Authoritative data
- Derived data
- Temporary data
- Metadata
- Validation rules
- Data lifecycle
- Data consistency
- Data versioning
- Data dependencies
- Cross-module data relationships

The data model should remain understandable and extensible without introducing unnecessary complexity.

---

## 4.2 Data Architecture Principles

### DA-001 — Authoritative Data Has a Single Source of Truth

Every important piece of user-controlled information should have a clearly defined authoritative source.

For example:

```text
Subject
Grade
Credits
Semester
```

should not have multiple independent copies acting as sources of truth.

Derived views should reference authoritative data.

---

### DA-002 — Derived Data Should Be Recalculable

Where practical, derived information should be calculated from authoritative data.

For example:

```text
Grades + Credits
        ↓
      GPA
```

The GPA should not become an independent source of truth if it can be reliably recalculated.

---

### DA-003 — Data Ownership Must Be Explicit

Every entity should have a clearly defined owning module.

Other modules may reference an entity without taking ownership of its authoritative record.

---

### DA-004 — Avoid Unnecessary Duplication

The same academic information should not be duplicated across multiple modules unless there is a justified performance or historical requirement.

---

### DA-005 — Preserve User Data

Academic OS should prioritize data integrity over convenience.

Operations that could cause significant data loss should require appropriate safeguards.

---

### DA-006 — Local-First Data Model

The initial architecture should support local-first operation.

Core academic functionality should not depend on a continuously available external server.

---

### DA-007 — AI Does Not Own Academic Truth

AI-generated information must not become authoritative academic data without explicit user confirmation.

---

## 4.3 Data Classification

Academic OS data should be classified into several categories.

```text
Authoritative Data
        ↓
Derived Data
        ↓
Analytics Data
        ↓
AI-Generated Data
        ↓
Temporary UI State
```

Each category has different persistence and validation requirements.

---

## 4.4 Authoritative Data

Authoritative data represents information that the user explicitly provides, confirms, or controls.

Examples include:

- Student profile
- Academic program
- Semester
- Subject
- Subject enrollment
- Grade
- Credit value
- Academic goal
- Task
- Note
- Resource
- Project
- Skill
- Career record
- Application settings

Authoritative data should be persisted reliably.

---

## 4.5. Derived Data

Derived data is calculated from authoritative data.

Examples:

- GPA
- Credit completion percentage
- Graduation progress
- Semester GPA
- Grade distribution
- Academic performance indicators
- Task completion percentage

Conceptually:

```text
Authoritative Data
        ↓
Calculation
        ↓
Derived Data
```

Derived data should not be edited directly by the user unless the value is explicitly converted into authoritative information.

---

## 4.6. Analytics Data

Analytics data represents aggregated or interpreted information used for monitoring and visualization.

Examples:

- GPA trend
- Semester comparison
- Credit progress trend
- Subject performance distribution
- Productivity trends
- Completion trends

Analytics should normally be generated from authoritative and derived data.

---

## 4.7 AI-Generated Data

AI-generated information is considered advisory rather than authoritative.

Examples:

- Study suggestions
- Planning suggestions
- Possible areas of improvement
- Summaries
- Recommendations
- Explanations

AI output should be explicitly distinguishable from user-controlled data.

Conceptually:

```text
Academic Data
    ↓
AI Context
    ↓
AI Model
    ↓
Generated Output
    ↓
User Review
    ↓
Optional User Confirmation
```

AI-generated information should not silently modify authoritative academic records.

---

## 4.8 Temporary Data

Temporary data exists only to support current application interaction.

Examples:

- Modal state
- Selected filters
- Form drafts
- Search input
- Current tab
- Temporary UI preferences
- Unsaved editing state

Temporary data does not necessarily require persistent storage.

---

## 4.9 Core Data Domains

Academic OS should organize its data into major domains.

```text
Academic Domain
Planner Domain
Knowledge Domain
Analytics Domain
Career Domain
AI Domain
Settings Domain
System Domain
```

Each domain should have clearly defined entities and ownership.

---

# 4.10 Academic Domain

The Academic Domain is the central domain of Academic OS.

It represents the user's academic history, current studies, and degree progress.

Core entities include:

```text
Student Profile
Academic Program
Academic Year
Semester
Subject
Enrollment
Grade
Academic Goal
```

---

## 4.11 Student Profile

The Student Profile represents information about the user relevant to Academic OS.

Potential information includes:

- Name
- Student identifier
- University
- Faculty
- Major/program
- Expected graduation period
- Academic status

Only information necessary for Academic OS should be stored.

The system should avoid collecting unnecessary personal information.

---

## 4.12 Academic Program

The Academic Program represents the degree/program structure the user is following.

Potential information includes:

- Program name
- Major
- Total required credits
- Required subjects
- Elective requirements
- Graduation requirements
- Program version

The Academic Program provides context for calculating degree progress.

---

## 4.13 Academic Year

Academic Year represents the academic period in which semesters occur.

Example:

```text
2026–2027
```

It should provide a stable reference for organizing semesters chronologically.

---

## 4.14 Semester

Semester represents a period of academic study.

Potential attributes include:

- Semester identifier
- Academic year
- Semester name
- Start date
- End date
- Status
- Planned credits
- Completed credits

Possible statuses include:

```text
Planned
Active
Completed
Archived
```

A semester should belong to an academic year.

---

## 4.15 Subject

Subject represents an academic course/module.

Potential attributes include:

- Subject identifier
- Subject code
- Subject name
- Credit value
- Subject type
- Description
- Prerequisites
- Program relationship

The subject represents the academic course itself.

Its enrollment in a specific semester should be represented separately.

---

## 4.16 Enrollment

Enrollment represents the relationship between a subject and a semester.

This distinction is important because the same subject may potentially appear in different academic contexts.

Potential attributes include:

- Enrollment identifier
- Subject identifier
- Semester identifier
- Enrollment status
- Attempt number
- Grade reference
- Notes

Conceptually:

```text
Subject
   │
   └── Enrollment
           │
           └── Semester
```

This prevents the Subject entity from becoming responsible for semester-specific information.

---

## 4.17 Grade

Grade represents the academic result associated with an enrollment.

Potential information includes:

- Grade value
- Grade scale
- Letter grade
- Numeric grade
- Grade status
- Finalized status

The exact grading system should be configurable to match the user's academic program.

---

## 4.18 Grade and GPA Separation

Grades are authoritative academic information.

GPA is derived information.

Therefore:

```text
Grade
  ↓
GPA Calculation
  ↓
GPA
```

The system should avoid treating a manually entered GPA as more authoritative than the underlying grades when sufficient grade information exists.

---

## 4.19 Credit Data

Credits should be associated with academic requirements and subjects.

Potential credit concepts include:

```text
Subject Credits
Completed Credits
Attempted Credits
Required Credits
Remaining Credits
```

The architecture should distinguish these concepts rather than treating every credit number as identical.

---

## 4.20 Academic Goal

Academic Goal represents a target the user wants to achieve.

Examples:

- Target GPA
- Target graduation date
- Target completed credits
- Semester GPA target
- Academic performance target

Goals are user-defined data.

The system may calculate progress toward goals, but should not modify goals without explicit user action.

---

# 4.21 Planner Domain

The Planner Domain supports academic planning and productivity.

Core entities may include:

```text
Task
Schedule Item
Deadline
Study Session
Academic Event
```

---

## 4.22 Task

Task represents an actionable item.

Potential attributes include:

- Task identifier
- Title
- Description
- Status
- Priority
- Due date
- Related subject
- Related semester
- Tags
- Completion date

Possible statuses include:

```text
Not Started
In Progress
Completed
Cancelled
```

---

## 4.23 Schedule Item

Schedule Item represents a planned activity or time block.

Potential information includes:

- Start time
- End time
- Title
- Type
- Related subject
- Location
- Recurrence
- Notes

Schedule data should remain separate from task data because an activity and an actionable task are not necessarily the same thing.

---

## 4.24 Academic Event

Academic Event represents events important to the user's academic life.

Examples:

- Exam
- Assignment deadline
- Presentation
- Class
- Project milestone
- Registration deadline

Events may optionally reference a Subject or Semester.

---

# 4.25 Knowledge Domain

The Knowledge Domain stores information that supports learning and academic organization.

Potential entities include:

```text
Note
Resource
Reference
Tag
Collection
```

---

## 4.26 Note

A Note represents user-created knowledge or information.

Potential attributes include:

- Note identifier
- Title
- Content
- Created date
- Modified date
- Tags
- Related subject
- Related project

Notes should remain user-controlled authoritative content.

---

## 4.27 Resource

Resource represents an external or local learning resource.

Examples:

- Book
- Website
- Article
- PDF
- Video
- Course material
- Documentation

Potential attributes include:

- Title
- Type
- URL or file reference
- Description
- Tags
- Related subject
- Status

---

## 4.28 Tag

Tags provide lightweight classification across supported entities.

Examples:

```text
Machine Learning
Python
Semester 5
Important
Exam
Project
Career
```

Tag ownership should be centralized where practical to avoid duplicate tag definitions.

---

# 4.29 Analytics Domain

The Analytics Domain consumes academic and productivity information.

It should not become the primary owner of academic records.

Conceptually:

```text
Academic Data
Planner Data
Knowledge Data
       ↓
Analytics Engine
       ↓
Metrics / Trends
       ↓
Dashboard / Reports
```

---

## 4.30 Academic Metrics

Potential academic metrics include:

- Current GPA
- Cumulative GPA
- Semester GPA
- Completed credits
- Remaining credits
- Credit completion percentage
- GPA change
- Grade distribution
- Subject performance

---

## 4.31 Graduation Progress

Graduation progress should be derived from:

```text
Program Requirements
        +
Completed Academic Records
        ↓
Graduation Progress
```

Potential outputs include:

- Required credits
- Completed credits
- Remaining credits
- Required subjects completed
- Required subjects remaining
- Elective progress
- Graduation readiness

The calculation should remain deterministic.

---

# 4.32 Career Domain

The Career Domain supports the user's transition from academic study toward professional development.

Potential entities include:

```text
Skill
Project
Experience
Internship
Portfolio Item
Career Goal
Application
```

---

## 4.33 Skill

Skill represents a competency the user is developing.

Potential information:

- Skill name
- Category
- Proficiency level
- Related subjects
- Related projects
- Learning status

---

## 4.34 Project

Project represents an academic or personal project.

Potential attributes include:

- Project name
- Description
- Status
- Start date
- End date
- Technologies
- Related skills
- Repository reference
- Portfolio status

Projects may be linked to academic subjects or career goals.

---

## 4.35 Career Goal

Career Goal represents a professional objective.

Examples:

- Internship target
- Data Science role
- Skill target
- Portfolio target
- Certification target

The goal should remain user-controlled.

---

# 4.36 Settings Domain

The Settings Domain contains user preferences and application configuration.

Examples include:

- Theme
- Appearance
- Preferred academic settings
- Default semester
- Notification preferences
- Dashboard preferences
- Data preferences

Settings should be separated from academic records.

---

# 4.37 System Domain

System-level data supports application operation.

Potential entities include:

```text
Database Metadata
Schema Version
Migration State
Backup Metadata
Application Preferences
```

System data should not be confused with user academic data.

---

# 4.38 Entity Ownership

The following ownership model is recommended:

| Entity | Primary Owner |
|---|---|
| Student Profile | Academic |
| Academic Program | Academic |
| Academic Year | Academic |
| Semester | Academic |
| Subject | Academic |
| Enrollment | Academic |
| Grade | Academic |
| Academic Goal | Academic |
| Task | Planner |
| Schedule Item | Planner |
| Academic Event | Planner |
| Note | Knowledge |
| Resource | Knowledge |
| Tag | Shared / Knowledge |
| Analytics Metric | Analytics |
| Skill | Career |
| Project | Career |
| Career Goal | Career |
| Settings | Settings |
| Schema Metadata | System |
| AI Conversation / Output | AI |

Ownership determines which module is responsible for the authoritative representation of an entity.

---

# 4.39 Entity Relationships

The core academic relationship can be represented as:

```text
Academic Program
       │
       ├── Requirements
       │
       └── Academic Years
              │
              └── Semesters
                     │
                     └── Enrollments
                            │
                            ├── Subject
                            │
                            └── Grade
```

This structure allows the system to calculate academic progress without duplicating the same information across multiple records.

---

# 4.40 Subject Relationship Example

A simplified relationship is:

```text
Subject
   │
   ├── Subject Code
   ├── Subject Name
   └── Credits
         │
         ▼
    Enrollment
         │
         ├── Semester
         ├── Status
         └── Grade
                │
                ▼
             GPA
```

---

# 4.41 Cross-Domain Relationships

Cross-domain references should be explicit.

For example:

```text
Academic Subject
       │
       ├────────► Planner Task
       │
       ├────────► Knowledge Note
       │
       ├────────► Resource
       │
       └────────► Project
```

These relationships should reference the authoritative entity rather than duplicate it.

---

# 4.42 Referential Integrity

Where one entity references another, Academic OS should maintain referential integrity.

For example:

```text
Task
  ↓
Subject ID
```

should not reference a non-existent Subject.

If a referenced entity is deleted, the application should have a defined policy for dependent records.

Possible policies include:

- Prevent deletion
- Cascade deletion
- Detach reference
- Archive the referenced entity

The appropriate policy should be defined per relationship rather than assumed globally.

---

# 4.43 Deletion Policy

Academic OS should distinguish between:

### Soft Deletion / Archiving

Useful for:

- Subjects
- Semesters
- Projects
- Notes
- Resources

### Permanent Deletion

Potentially appropriate for:

- Temporary records
- User-requested data removal
- Obsolete system data

Permanent deletion should be used carefully because academic history may have long-term value.

---

# 4.44 Historical Data

Academic records are inherently historical.

The architecture should preserve the user's academic history across semesters.

For example:

```text
Semester 1
    ↓
Semester 2
    ↓
Semester 3
    ↓
Semester 4
    ↓
Semester 5
    ↓
...
```

Completed semesters should remain available for:

- GPA history
- Credit tracking
- Performance analysis
- Academic review

---

# 4.45 Data Lifecycle

A typical academic entity may follow:

```text
Created
   ↓
Active
   ↓
Updated
   ↓
Completed
   ↓
Archived
```

Not every entity needs every lifecycle state.

The lifecycle should reflect the semantics of the entity.

---

# 4.46 Timestamps

Important persistent entities should maintain appropriate timestamps.

Potential fields include:

```text
createdAt
updatedAt
```

Some entities may also require:

```text
completedAt
archivedAt
deletedAt
```

Timestamps should use a consistent representation across the application.

---

# 4.47 Identifiers

Persistent entities should have stable unique identifiers.

Identifiers should:

- Remain stable across normal updates
- Not depend on display names
- Not be reused unnecessarily
- Support relationships between entities

Display names should never be treated as reliable primary identifiers.

---

# 4.48 Data Validation

Validation should occur at multiple levels.

### Presentation Validation

Protects against invalid user input.

### Domain Validation

Protects business rules.

### Persistence Validation

Protects stored data integrity.

For example:

```text
Grade Input
    ↓
UI Validation
    ↓
Domain Validation
    ↓
Persistence Validation
```

---

# 4.49 Academic Data Validation

Examples of academic validation rules include:

- Credit values must be valid.
- Grade values must follow the configured grading system.
- A semester must have a valid academic period.
- Enrollment must reference a valid subject.
- Graduation calculations must use valid program requirements.
- GPA calculations must use valid grade and credit information.

The exact grading rules should remain configurable where necessary.

---

# 4.50 Derived Calculation Rules

Derived calculations should be deterministic.

Examples:

```text
GPA
Credit Completion
Graduation Progress
Semester Performance
```

For the same authoritative input, the calculation should produce the same result.

---

# 4.51 GPA Calculation

The GPA engine should consume authoritative grade and credit information.

Conceptually:

```text
Subject Grade
      ×
Subject Credit
      ↓
Weighted Grade
      ↓
Sum
      ↓
Total Applicable Credits
      ↓
GPA
```

The exact GPA formula should be defined according to the academic grading system used by the user.

The GPA engine should not depend on AI.

---

# 4.52 Academic Progress Calculation

Academic progress should be derived from:

```text
Completed Credits
        ÷
Required Credits
        ×
100
```

Additional requirements should be considered where graduation depends on more than total credits.

---

# 4.53 Target GPA Calculation

The system may calculate the GPA required to reach a target.

Conceptually:

```text
Current Academic Record
        +
Remaining Credits
        +
Target GPA
        ↓
Required Future Performance
```

This calculation should be deterministic and transparent.

AI should not replace the calculation.

---

# 4.54 Data Consistency

Academic OS should avoid storing multiple independently editable versions of the same derived information.

For example:

```text
Grade Records
      ↓
GPA Engine
      ↓
Dashboard GPA
```

The dashboard should not maintain a separate manually editable GPA value unless explicitly required for a special use case.

---

# 4.55 Data Dependencies

Data dependencies should be understood explicitly.

Example:

```text
Subject
   ↓
Enrollment
   ↓
Grade
   ↓
GPA
   ↓
Academic Analytics
   ↓
Dashboard
```

This dependency chain should guide updates and recalculation.

---

# 4.56 Change Propagation

When authoritative data changes, affected derived information should be updated.

Example:

```text
User changes grade
       ↓
Grade updated
       ↓
GPA recalculated
       ↓
Credit / progress metrics recalculated if necessary
       ↓
Analytics refreshed
       ↓
Dashboard refreshed
```

The application should avoid stale derived information.

---

# 4.57 Data Snapshotting

Where historical accuracy is required, the application may preserve snapshots of important derived information.

For example, a completed semester may preserve its final academic state.

However, snapshots should not unnecessarily replace authoritative records.

---

# 4.58 Importable Data

Academic OS may support importing academic information from external sources.

Potential sources include:

- Manual files
- CSV
- JSON
- Future university exports

Imported data should pass validation before becoming authoritative.

Conceptually:

```text
Imported Data
      ↓
Validation
      ↓
Preview
      ↓
User Confirmation
      ↓
Authoritative Data
```

---

# 4.59. Exportable Data

Users should be able to export important information.

Potential formats include:

- JSON
- CSV
- Human-readable reports

The canonical backup format should be defined in Part 8.

---

# 4.60 Data Privacy

Academic OS should follow data minimization principles.

The system should store only information necessary to support its features.

Sensitive or unnecessary information should not be collected merely because the application could store it.

Local-first operation reduces the need to transmit academic information externally.

---

# 4.61 AI Data Boundary

AI access to user data should be explicitly controlled.

The default conceptual flow is:

```text
Authoritative Academic Data
          ↓
Data Selection / Minimization
          ↓
AI Context
          ↓
AI Provider
          ↓
Generated Output
```

The AI layer should not automatically receive the entire database.

Only information necessary for the specific AI operation should be provided.

---

# 4.62 AI Output Persistence

AI-generated output should not automatically become permanent academic data.

If AI output is saved, it should retain metadata indicating that it was generated.

Potential metadata includes:

- Generation timestamp
- AI provider
- Model identifier
- Prompt/context reference where appropriate
- Generated status
- User confirmation status

This allows AI-generated content to remain distinguishable from user-authored content.

---

# 4.63 Data Versioning

Persistent data should include a schema version mechanism.

Conceptually:

```text
Application Version
        ↓
Schema Version
        ↓
Data Migration
        ↓
Current Data Model
```

Schema migrations should be deterministic and testable.

---

# 4.64 Migration Principles

A migration should:

- Preserve valid user data
- Transform old structures into new structures
- Avoid silent data loss
- Be repeatable or safely guarded
- Be tested before release
- Provide a recovery path where appropriate

Before significant migrations, backup mechanisms should be available.

---

# 4.65 Data Integrity During Updates

Data updates should be atomic where multiple related records must change together.

For example:

```text
Update Enrollment
        +
Update Grade
        +
Update Derived State
```

should not leave the application in an inconsistent state if one part fails.

The exact transaction strategy is defined in Part 5.

---

# 4.66 Data and Dashboard

The Dashboard should consume data rather than own it.

Conceptually:

```text
Academic Repository
        ↓
Academic Services
        ↓
Analytics / Derived Calculations
        ↓
Dashboard
```

This ensures that dashboard values remain consistent with the underlying academic records.

---

# 4.67 Data and Planner

Planner records may reference academic entities.

For example:

```text
Task
 ├── title
 ├── dueDate
 └── subjectId
```

The Planner owns the Task.

Academic owns the Subject.

The Task should not duplicate the Subject's complete information.

---

# 4.68 Data and Knowledge

Knowledge records may reference academic entities.

Example:

```text
Note
 ├── title
 ├── content
 └── subjectId
```

The Knowledge module owns the Note.

The Academic module owns the Subject.

---

# 4.69. Data and Career

Career records may reference projects and skills.

Example:

```text
Project
   ├── Skills
   ├── Technologies
   └── Related Subjects
```

This allows Academic OS to connect academic development with career development without duplicating academic records.

---

# 4.70 Data and Analytics

Analytics should primarily be a consumer of other domains.

```text
Academic
Planner
Career
      ↓
Analytics
      ↓
Metrics
      ↓
Visualizations
```

Analytics should not silently modify source records.

---

# 4.71. Data and Search

Search should operate across supported entities through defined indexes or application-level search services.

Potential searchable entities include:

- Subjects
- Tasks
- Notes
- Resources
- Projects

Search indexes should not become independent sources of truth.

---

# 4.72 Data and Settings

Settings should control behavior without changing the meaning of authoritative academic records.

For example:

```text
Theme = Dark
```

changes presentation.

It should not modify academic data.

---

# 4.73 Recommended Core Entity Map

The initial conceptual data model is:

```text
                    Academic Program
                           │
                           ▼
                     Academic Year
                           │
                           ▼
                        Semester
                           │
                           ▼
                       Enrollment
                        /       \
                       /         \
                  Subject       Grade
                     │
          ┌──────────┼───────────┐
          ↓          ↓           ↓
        Tasks      Notes       Resources
          │          │           │
          └──────────┼───────────┘
                     ↓
                  Analytics
                     │
                     ↓
                  Dashboard
```

Career entities may connect to Subjects, Projects, and Skills.

AI remains an advisory layer above the authoritative data model.

---

# 4.74 MVP Data Scope

The R1 MVP should prioritize the smallest reliable academic data model.

Recommended core entities:

```text
Student Profile
Academic Program
Academic Year
Semester
Subject
Enrollment
Grade
Academic Goal
Settings
System Metadata
```

Planner, Knowledge, Career, and AI entities can be introduced according to their respective release boundaries.

---

# 4.75 Data Architecture and MVP

The MVP should not attempt to model every possible future academic concept.

The data architecture should support future expansion without requiring speculative entities.

The guiding principle is:

> **Model what the current product needs, while preserving clear extension points for future releases.**

---

# 4.76 Data Architecture Trade-Off

Academic OS should favor:

> **Reliable authoritative data and deterministic derived calculations over convenience-driven duplication.**

The architecture should avoid:

- Duplicate sources of truth
- Hidden data transformations
- AI-controlled academic records
- Unnecessary persistence
- Excessive speculative entities

---

# 4.77 Part 4 Completion Criteria

Part 4 is considered complete when:

- Data classification is defined.
- Authoritative data is distinguished from derived data.
- Analytics data is distinguished from source data.
- AI-generated data is distinguished from authoritative data.
- Core domains are defined.
- Entity ownership is established.
- Core academic entities are defined.
- Planner entities are defined.
- Knowledge entities are defined.
- Analytics responsibilities are defined.
- Career entities are defined.
- Settings and system data are separated.
- Core entity relationships are documented.
- Referential integrity principles are defined.
- Deletion policies are established conceptually.
- Historical data requirements are established.
- Identifier and timestamp principles are defined.
- Validation responsibilities are defined.
- Derived calculation principles are established.
- GPA and academic progress calculations are separated from AI.
- Change propagation is defined.
- Import/export boundaries are established.
- Privacy and data minimization principles are established.
- AI data boundaries are defined.
- Schema versioning and migration principles are established.
- Dashboard data ownership is defined.
- Cross-domain relationships are defined.
- MVP data scope is established.

Detailed persistence implementation will be defined in Part 5.

Detailed state-management behavior will be defined in Part 6.

Detailed backup implementation will be defined in Part 8.

Detailed analytics implementation will be defined in Part 10.

Detailed AI data handling will be defined in Part 11.

# Part 5 — Persistence Architecture

This part defines how Academic OS persists, retrieves, updates, migrates, and protects application data.

The persistence architecture implements the data model established in Part 4 while preserving the local-first principle established by the overall architecture.

The primary objective is to provide:

- Reliable local data persistence
- Clear separation between application logic and storage
- Transactional data operations where required
- Data integrity
- Schema versioning
- Migration support
- Backup and restore compatibility
- Efficient retrieval
- Controlled access to persistent data
- A clear path for future persistence extensions

The persistence layer must not become the owner of business rules. It is responsible for storing and retrieving data according to contracts defined by the application and domain layers.

---

## 5.1 Persistence Principles

### PA-001 — Local-First Persistence

Academic OS should operate primarily using local persistent storage.

Core academic functionality must remain usable without requiring a continuously available external server.

The initial persistence implementation should therefore prioritize browser-local storage.

---

### PA-002 — IndexedDB as the Primary Persistent Store

IndexedDB should be used as the primary structured persistent storage mechanism for the initial Academic OS implementation.

The persistence architecture should be designed around IndexedDB without allowing application features to become tightly coupled to raw IndexedDB APIs.

Conceptually:

```text
Feature
   ↓
Application Service
   ↓
Repository
   ↓
Persistence Adapter
   ↓
IndexedDB
```

---

### PA-003 — No Direct Database Access from UI

Frontend components must not directly access IndexedDB.

The following pattern is prohibited:

```text
UI Component
     ↓
IndexedDB
```

The preferred pattern is:

```text
UI
 ↓
Application Layer
 ↓
Repository
 ↓
Persistence Layer
 ↓
IndexedDB
```

This keeps storage implementation details outside the presentation layer.

---

### PA-004 — Repository Abstraction

Persistent entities should be accessed through repository abstractions.

A repository defines the operations required by the application without exposing the underlying storage implementation.

For example:

```text
SubjectRepository

create()
getById()
getAll()
update()
delete()
```

The application layer should depend on the repository contract rather than directly depending on IndexedDB.

---

### PA-005 — Storage Implementation Must Be Replaceable

The architecture should minimize unnecessary coupling to IndexedDB.

If a future version requires another persistence mechanism, the application should be able to introduce a new persistence adapter without rewriting the entire application.

For example:

```text
SubjectRepository
       │
       ├── IndexedDB Adapter
       │
       └── Future Adapter
```

The initial implementation should not introduce unnecessary abstraction solely for hypothetical future databases.

---

### PA-006 — Persistence Does Not Define Business Rules

The persistence layer should not determine academic business logic.

For example:

```text
Persistence:
"Store this grade."

Domain/Application:
"Is this grade valid?"
"How does this grade affect GPA?"
"Does this enrollment satisfy a requirement?"
```

Business rules belong to the appropriate domain or application layer.

---

### PA-007 — Atomicity for Related Updates

Operations that modify multiple related records should be atomic where required.

For example:

```text
Update Enrollment
       +
Update Grade
       +
Update Related Data
```

should not leave the database in an invalid intermediate state.

IndexedDB transactions should be used where appropriate.

---

### PA-008 — Persistent Data Must Be Recoverable

The persistence architecture must support the backup and restore architecture defined later in Part 8.

The database should therefore have a predictable and exportable structure.

---

## 5.2 Persistence Responsibilities

The persistence layer is responsible for:

- Storing persistent entities
- Retrieving entities
- Updating entities
- Deleting or archiving entities
- Maintaining database indexes
- Managing transactions
- Managing schema versions
- Running migrations
- Enforcing persistence-level constraints
- Supporting backup/export operations
- Supporting restore/import operations
- Handling persistence errors
- Providing persistence diagnostics where appropriate

The persistence layer is not responsible for:

- UI rendering
- Navigation
- Business decisions
- Academic recommendations
- AI reasoning
- Dashboard presentation
- User interaction design

---

# 5.3 Persistence Architecture Layers

The persistence architecture should conceptually consist of:

```text
Application Layer
        ↓
Repository Interfaces
        ↓
Repository Implementations
        ↓
Persistence Adapter
        ↓
IndexedDB
```

A more detailed representation is:

```text
┌─────────────────────────────┐
│      Presentation Layer     │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│      Application Layer      │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│    Repository Interfaces    │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Repository Implementations  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│   IndexedDB Persistence     │
└─────────────────────────────┘
```

---

# 5.4 Repository Pattern

Repositories provide a controlled interface for persistent data.

For example:

```text
SubjectRepository
    ├── create
    ├── getById
    ├── getAll
    ├── update
    ├── delete
    └── find
```

The exact repository operations should be determined by the requirements of each entity.

Repositories should avoid exposing low-level IndexedDB implementation details to higher layers.

---

# 5.5 Repository Responsibilities

A repository may be responsible for:

- Persistence operations
- Querying
- Mapping stored records
- Persistence-level validation
- Transaction participation
- Handling storage-specific errors

A repository should not be responsible for:

- Calculating GPA
- Deciding academic eligibility
- Generating recommendations
- Rendering UI
- Managing application navigation

---

# 5.6 IndexedDB Database

The initial Academic OS database should use a single application database.

Conceptually:

```text
AcademicOSDB
```

The database should contain object stores corresponding to persistent entities or logically grouped persistence structures.

Potential stores include:

```text
studentProfiles
academicPrograms
academicYears
semesters
subjects
enrollments
grades
academicGoals
tasks
scheduleItems
academicEvents
notes
resources
tags
skills
projects
careerGoals
settings
systemMetadata
```

The exact object-store list may be adjusted during implementation if the final data model requires a different structure.

---

# 5.7 Object Store Design

Each object store should have a clearly defined purpose.

For example:

```text
subjects
```

should store Subject records.

```text
enrollments
```

should store Enrollment records.

```text
grades
```

should store Grade records.

This separation should reflect the conceptual ownership established in Part 4.

---

# 5.8 Primary Keys

Each persistent entity should have a stable primary key.

The preferred conceptual structure is:

```text
id
```

The identifier should:

- Be unique
- Remain stable
- Not depend on display names
- Not depend on array position
- Not normally be reused
- Support references between entities

---

# 5.9 Secondary Indexes

IndexedDB indexes should be created for fields that are frequently queried.

Potential examples include:

```text
subjects.code
enrollments.semesterId
enrollments.subjectId
grades.enrollmentId
tasks.dueDate
tasks.status
tasks.subjectId
notes.subjectId
resources.subjectId
projects.status
```

Indexes should be introduced based on actual query requirements rather than created indiscriminately.

---

# 5.10 Query Strategy

Persistence queries should be designed around application use cases.

For example:

```text
Get subjects for semester
```

should preferably query by:

```text
semesterId
```

rather than loading every subject and filtering them unnecessarily in the UI.

However, query optimization should remain proportionate to the expected MVP data size.

---

# 5.11 Data Serialization

Persistent records should use a consistent representation compatible with IndexedDB and backup/export requirements.

Where possible, data should remain straightforward to serialize and restore.

Specialized runtime objects should not be persisted without a defined serialization strategy.

---

# 5.12 Dates and Times

Date/time values should use a consistent representation throughout the application.

The persistence layer should avoid inconsistent mixtures of:

```text
Date objects
Strings
Timestamps
```

without an explicit convention.

The selected representation should be compatible with:

- IndexedDB
- Export / Import
- Migration
- Comparison
- Sorting

The exact convention should be finalized during implementation and recorded as an ADR if it represents a significant architectural decision.

---

# 5.13 Transaction Management

IndexedDB transactions should be used whenever multiple persistence operations must succeed or fail together.

Example:

```text
Create Enrollment
      +
Create Grade
```

may require a shared transaction if both records must remain consistent.

Transactions should be kept as small and focused as practical.

---

# 5.14 Transaction Boundaries

Transaction boundaries should generally be determined by application use cases rather than individual UI actions.

For example:

```text
"Complete Semester"
```

may involve multiple related persistence operations.

The application layer should coordinate the operation, while the persistence layer provides the transaction mechanism.

---

# 5.15 Concurrency Considerations

Academic OS is primarily a personal, single-user application.

Therefore, distributed multi-user concurrency is outside the MVP scope.

However, the persistence architecture should still account for:

- Multiple browser tabs
- Concurrent application instances
- Unexpected application termination
- Transaction conflicts
- Database upgrade events

The application should fail safely where possible.

---

# 5.16 Database Initialization

On first application launch:

```text
Application Start
       ↓
Open AcademicOSDB
       ↓
Check Database Version
       ↓
Create Required Stores
       ↓
Create Required Indexes
       ↓
Initialize System Metadata
       ↓
Application Ready
```

Initialization should be deterministic.

---

# 5.17 Database Versioning

The IndexedDB database must maintain a schema version.

Conceptually:

```text
Database Version 1
        ↓
Database Version 2
        ↓
Database Version 3
        ↓
Current Version
```

Each schema change should have an associated migration strategy.

---

# 5.18 Schema Migration

Schema migration is required when the persistence structure changes.

Examples:

- New object store
- New index
- Changed field structure
- Renamed field
- Data transformation
- Relationship restructuring

Migration should preserve valid user data wherever possible.

---

# 5.19 Migration Process

A migration should conceptually follow:

```text
Open Database
      ↓
Detect Existing Version
      ↓
Determine Required Migration
      ↓
Backup / Safety Check where appropriate
      ↓
Execute Migration
      ↓
Validate Result
      ↓
Open Current Schema
```

Migration failures must not silently result in data loss.

---

# 5.20 Migration Compatibility

The application should define which historical schema versions are supported.

The implementation should avoid accumulating unnecessary migration complexity.

If an extremely old version is no longer supported, the application should provide an appropriate recovery or export path where practical.

---

# 5.21 Persistence Errors

Persistence errors should be handled explicitly.

Potential error categories include:

```text
DatabaseUnavailable
TransactionFailed
ConstraintViolation
MigrationFailed
StorageQuotaExceeded
InvalidRecord
DatabaseUpgradeBlocked
UnknownPersistenceError
```

Errors should be mapped into application-level errors rather than exposing raw browser/database errors directly to the UI.

---

# 5.22 User-Facing Persistence Errors

Technical persistence errors should be translated into understandable messages.

For example:

Instead of:

```text
QuotaExceededError: Failed to execute 'put'
```

the user should receive something similar to:

```text
Academic OS could not save your changes because
browser storage is full.

Your existing data has not been intentionally deleted.
Please free storage space and try again.
```

The exact UI wording belongs to the UI/UX specification.

---

# 5.23 Storage Quota

Because IndexedDB uses browser-managed storage, Academic OS must recognize that storage capacity is not unlimited.

The MVP data volume is expected to be relatively small because the application primarily stores structured academic and productivity information.

Large binary files should not automatically be stored directly in IndexedDB.

---

# 5.24 File and Large-Object Strategy

Academic OS may eventually reference external or local files.

The persistence architecture should distinguish:

```text
Metadata
    vs.
Binary Content
```

For example:

```text
Resource
 ├── title
 ├── type
 ├── reference
 └── metadata
```

The actual file-storage strategy should be defined only if the Knowledge/Resource feature requires it.

---

# 5.25 Repository Error Mapping

Storage-specific errors should be converted into application-level errors.

Conceptually:

```text
IndexedDB Error
      ↓
Persistence Adapter
      ↓
Repository Error
      ↓
Application Error
      ↓
UI Feedback
```

This prevents higher layers from depending on IndexedDB-specific error types.

---

# 5.26 Persistence and Validation

Validation should occur before persistence.

Conceptually:

```text
User Input
    ↓
Application Validation
    ↓
Domain Validation
    ↓
Repository
    ↓
IndexedDB
```

Persistence-level validation may provide an additional integrity boundary but should not replace domain validation.

---

# 5.27 Persistence and Authoritative Data

The persistence layer stores authoritative data.

For example:

```text
Grade
Enrollment
Subject
Semester
```

should be persisted as defined by Part 4.

Derived values such as GPA may be calculated from those records rather than treated as independent authoritative records.

---

# 5.28 Persistence and Derived Data

Derived data may be:

### Calculated on demand

```text
Grades
  ↓
GPA calculation
  ↓
Result
```

or:

### Cached

```text
Grades
  ↓
Calculation
  ↓
Cached Result
```

If derived data is cached, the architecture must define how it is invalidated and recalculated.

The MVP should favor simplicity and correctness over premature caching.

---

# 5.29 Persistence and Analytics

Analytics should generally query authoritative data and use application-level calculation services.

The persistence layer should not contain analytics logic.

Example:

```text
Analytics Service
      ↓
Enrollment Repository
Grade Repository
Semester Repository
      ↓
Academic Data
```

---

# 5.30 Persistence and Dashboard

The Dashboard should obtain persistent information through application services or repositories.

It should never directly query IndexedDB.

Preferred flow:

```text
Dashboard
    ↓
Dashboard / Application Service
    ↓
Repositories / Analytics Services
    ↓
Persistence
```

---

# 5.31 Persistence and Backup

Backup functionality should access persistence through controlled export mechanisms.

Conceptually:

```text
Persistence Layer
       ↓
Export Service
       ↓
Backup Representation
       ↓
Backup File
```

The backup format and restore process will be defined in Part 8.

---

# 5.32 Import and Restore

Imported or restored data must pass through validation before becoming active application data.

Conceptually:

```text
Backup / Import File
        ↓
Parse
        ↓
Schema Validation
        ↓
Version Check
        ↓
Migration if required
        ↓
Data Validation
        ↓
User Confirmation
        ↓
Transaction
        ↓
Persistent Database
```

---

# 5.33 Restore Safety

Restore operations should protect against accidental data loss.

Where a restore would replace existing data, the user should be clearly informed.

The application should preferably support:

```text
Current Data
      ↓
Backup Current State
      ↓
Restore Selected Backup
```

when technically practical.

---

# 5.34 Persistence and Local-First Operation

Core operations should work without an external network connection.

Examples:

- View subjects
- Add subjects
- Record grades
- Calculate GPA
- View academic progress
- Manage tasks
- View notes
- View analytics

External services should only be required for features that explicitly depend on them.

---

# 5.35 Offline Behavior

The application should provide a usable experience when offline.

For core functionality:

```text
Offline
   ↓
IndexedDB
   ↓
Application
   ↓
  UI
```

No network request should be required merely to retrieve the user's existing academic data.

---

# 5.36 Future Synchronization

Cloud synchronization is outside the initial persistence scope.

However, the architecture should avoid making future synchronization impossible.

Future synchronization may introduce:

```text
Local Database
      ↕
Synchronization Layer
      ↕
Remote Storage
```

Such functionality should be introduced through a future architectural decision rather than embedded prematurely into the MVP.

---

# 5.37 Persistence Security

The application should recognize that local browser storage is not equivalent to a secure server-side vault.

The system should therefore:

- Minimize sensitive information
- Avoid storing unnecessary credentials
- Avoid storing secrets in plain text
- Avoid treating IndexedDB as a security boundary
- Clearly define future authentication/security requirements if synchronization is introduced

The MVP should not claim stronger security guarantees than the platform can provide.

---

# 5.38 Data Corruption Handling

The application should detect persistence failures where possible.

Potential recovery strategy:

```text
Database Error
      ↓
Detect Failure
      ↓
Prevent Further Corruption
      ↓
Notify User
      ↓
Offer Recovery / Restore
```

Backup support is therefore an important companion to persistence.

---

# 5.39 Database Health

Academic OS may maintain lightweight system metadata for:

- Schema version
- Database initialization state
- Migration status
- Last successful operation where useful
- Last backup metadata where applicable

This information should not be mixed with academic records.

---

# 5.40 Persistence Testing

Persistence components should be tested independently.

Important tests include:

### Repository Tests

- Create
- Read
- Update
- Delete
- Query
- Invalid data handling

### Transaction Tests

- Successful transaction
- Failed transaction
- Rollback behavior

### Migration Tests

- Existing version
- Upgrade
- Data preservation
- Migration failure

### Backup Tests

- Export
- Import
- Restore
- Invalid backup handling

---

# 5.41 Persistence Test Isolation

Persistence tests should use isolated databases or test environments.

Tests should not modify the user's real Academic OS database.

---

# 5.42 Performance Considerations

The MVP is expected to contain relatively small structured datasets.

Therefore, the persistence architecture should prioritize:

1. Correctness
2. Maintainability
3. Data integrity
4. Simplicity
5. Reasonable performance

Premature optimization should be avoided.

---

# 5.43 Caching Strategy

Caching should not be introduced automatically.

Because Academic OS is a relatively small personal application, many values can be calculated or retrieved efficiently.

Caching may be introduced later if profiling demonstrates a real performance requirement.

If caching is introduced, cache invalidation must be explicitly defined.

---

# 5.44 Persistence Boundaries

The following boundaries should remain clear:

```text
UI
 └── Does not access database

Application
 └── Coordinates use cases

Domain
 └── Defines business rules

Repository
 └── Defines persistent access

Persistence Adapter
 └── Implements storage details

IndexedDB
 └── Stores persistent records
```

---

# 5.45 Recommended Initial Persistence Structure

The conceptual implementation may follow:

```text
src/
│
├── domain/
│
├── application/
│
├── infrastructure/
│   └── persistence/
│       ├── indexeddb/
│       │   ├── database
│       │   ├── migrations
│       │   ├── adapters
│       │   └── schemas
│       │
│       └── repositories/
│
└── presentation/
```

The exact folder structure remains subject to the final technology stack and should remain consistent with Part 1–3.

---

# 5.46 Persistence Dependency Direction

Dependencies should flow toward abstractions.

Preferred:

```text
Application
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
IndexedDB
```

The application should not depend directly on the concrete IndexedDB implementation.

---

# 5.47 Persistence and Copilot

Because Copilot will assist with implementation, persistence rules should be explicit in the project's development instructions.

Copilot should be instructed that:

- UI components must not access IndexedDB directly.
- Repositories must be used for persistent access.
- Business logic must not be embedded in persistence adapters.
- Database schema changes require migration handling.
- New indexes should have a documented reason.
- Persistence operations should be tested.
- New dependencies should not be introduced without justification.

---

# 5.48 Persistence and Google AI Studio

Google AI Studio may generate UI code that assumes a particular persistence mechanism.

Such generated code must be adapted to the Academic OS persistence architecture.

AI-generated UI code should not automatically introduce:

- Firebase
- Firestore
- Supabase
- External databases
- Server-side persistence
- Authentication services

unless such infrastructure has been explicitly approved by a future architecture decision.

The approved initial persistence model remains:

```text
Academic OS
     ↓
Application / Repository Layer
     ↓
IndexedDB
```

---

# 5.49 MVP Persistence Scope

The R1 MVP should implement:

- IndexedDB database
- Core object stores
- Repository interfaces
- Repository implementations
- Basic CRUD operations
- Required indexes
- Database initialization
- Schema versioning
- Basic migrations
- Persistence error handling
- Basic import/export support where required
- Transaction handling for critical multi-record operations

Advanced cloud synchronization is not part of the MVP.

---

# 5.50 Future Persistence Extensions

Future releases may introduce:

- Cloud synchronization
- Multi-device support
- Remote backup
- Conflict resolution
- Advanced encryption
- Shared academic data
- External integrations

These should be treated as separate architectural extensions.

They must not compromise the local-first MVP architecture.

---

# 5.51 Persistence Architecture Trade-Off

The selected architecture intentionally favors:

```text
Local-First
+
IndexedDB
+
Repository Abstraction
+
Simple Data Model
+
Deterministic Persistence
```

over:

```text
Immediate Cloud Backend
+
Authentication Infrastructure
+
Remote Database
+
Synchronization Complexity
```

The chosen approach reduces initial development complexity and supports the personal-use nature of Academic OS.

---

# 5.52 Part 5 Completion Criteria

Part 5 is considered complete when:

- Local-first persistence is defined.
- IndexedDB is established as the initial primary persistence mechanism.
- UI-to-database direct access is prohibited.
- Repository abstraction is established.
- Persistence responsibilities are defined.
- Database structure is conceptually defined.
- Object-store responsibilities are established.
- Primary-key principles are defined.
- Indexing principles are defined.
- Query strategy is defined.
- Serialization principles are established.
- Date/time persistence principles are defined.
- Transaction boundaries are defined.
- Concurrency considerations are documented.
- Database initialization is defined.
- Schema versioning is defined.
- Migration principles are defined.
- Persistence error handling is defined.
- Storage quota considerations are documented.
- Large-object handling principles are established.
- Authoritative and derived data persistence boundaries are defined.
- Backup/restore integration is defined.
- Import/restore validation is defined.
- Offline behavior is defined.
- Future synchronization boundaries are established.
- Persistence security limitations are acknowledged.
- Data corruption handling is considered.
- Persistence testing requirements are established.
- Performance principles are established.
- Persistence dependency direction is defined.
- Copilot implementation rules are established.
- Google AI Studio integration boundaries are established.
- MVP persistence scope is defined.
- Future persistence extensions are explicitly separated from the MVP.

Part 6 will define State Management and how persistent, derived, application, and UI state interact at runtime.

# Part 6 — State Management

This part defines how Academic OS manages application state during runtime.

The State Management Architecture connects persistent data, application logic, derived calculations, and presentation state while maintaining the architectural boundaries established in Parts 1–5.

The primary objectives are:

- Provide predictable state flow
- Keep UI state separate from persistent data
- Keep authoritative data separate from derived state
- Prevent duplicated sources of truth
- Ensure changes propagate consistently
- Support reactive UI updates
- Minimize unnecessary global state
- Preserve the local-first architecture
- Keep state management understandable and testable

---

## 6.1 Purpose

State management defines how information is:

- Loaded
- Held during runtime
- Updated
- Derived
- Shared between components
- Synchronized with persistence
- Refreshed after changes
- Cleared or discarded

State management should complement the architecture defined in previous parts rather than becoming a replacement for the domain, application, or persistence layers.

---

## 6.2 State Management Principles

### SM-001 — Persistent Data Is Not the Same as Runtime State

Data stored in IndexedDB and data currently held in application memory have different responsibilities.

Conceptually:

```text
IndexedDB
   ↓
Persistent Data

Application Runtime
   ↓
Runtime State
```

Persistent data survives application restarts.

Runtime state normally exists only while the application is running.

---

### SM-002 — One Authoritative Runtime Source

For data that is actively managed by the application, there should be one authoritative runtime representation where practical.

The application should avoid maintaining multiple independent copies of the same entity.

---

### SM-003 — Derived State Should Be Recalculable

Derived state should be calculated from authoritative state.

For example:

```text
Grades
  +
Credits
  ↓
GPA
```

The GPA should not become an independently editable state value.

---

### SM-004 — UI State Should Remain Local Where Possible

State that only affects a single UI component should normally remain local to that component.

Examples:

- Modal visibility
- Input focus
- Temporary form values
- Expanded/collapsed sections

Such state should not become global merely for convenience.

---

### SM-005 — Global State Should Be Intentional

Only state that genuinely needs to be shared across multiple parts of the application should be placed in shared application state.

This prevents the application from developing an unnecessarily large global state.

---

### SM-006 — Persistent Data Should Be Accessed Through Application Boundaries

UI components should not directly read or write IndexedDB.

The preferred flow remains:

```text
UI
 ↓
Application Layer
 ↓
Repository
 ↓
Persistence
 ↓
IndexedDB
```

---

### SM-007 — State Changes Must Follow Controlled Flows

State should be changed through defined actions, commands, or application operations rather than arbitrary mutations from unrelated components.

---

### SM-008 — AI Must Not Directly Control Core State

AI-generated output must not silently modify authoritative application state.

Any AI-generated change that could affect authoritative data requires explicit user confirmation.

---

# 6.3 State Categories

Academic OS should distinguish several categories of runtime state.

```text
┌─────────────────────────┐
│ Persistent Data         │
│ IndexedDB               │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Application State       │
│ Shared runtime data     │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Derived State           │
│ Calculated information  │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ UI State                │
│ Presentation interaction│
└─────────────────────────┘
```

A fifth category may also exist:

```text
Temporary / Form State
```

for information that has not yet been committed.

---

# 6.4 Persistent Data

Persistent data represents authoritative information stored through the persistence layer.

Examples:

- Subjects
- Semesters
- Enrollments
- Grades
- Tasks
- Notes
- Projects
- Academic goals

Persistent data is not itself a UI state mechanism.

---

# 6.5 Application State

Application state represents data that needs to be available across multiple application features during runtime.

Potential examples include:

- Current user profile
- Current academic year
- Current semester
- Loaded academic records
- Application initialization status
- Global notification state
- Current application mode

Application state should remain limited to genuinely shared information.

---

# 6.6 Derived State

Derived state is calculated from authoritative state.

Examples:

```text
Current GPA
Completed Credits
Remaining Credits
Credit Completion Precentage
Semester GPA
Target GPA Progress
```

Conceptually:

```text
Authoritative State
       ↓
Calculation
       ↓
Derived State
```

Derived state should not normally be persisted independently unless there is a clear caching or historical requirement.

---

# 6.7 UI State

UI state represents the current presentation and interaction state.

Examples:

- Active navigation item
- Selected semester
- Open modal
- Expanded card
- Selected filter
- Table sorting
- Search input
- Current page
- Sidebar visibility

UI state should generally remain close to the components that use it.

---

# 6.8 Form State

Form state represents information currently being edited.

Example:

```text
Subject Form

Name: Introduction to ML
Credits: 3
Code: DATA301
```

Before submission, this information is temporary.

The lifecycle is:

```text
Form State
   ↓
Validation
   ↓
Application Command
   ↓
Persistent Data
```

---

# 6.9 State Ownership

Each state value should have a clear owner.

For example:

| State | Owner |
|---|---|
| Subject records | Academic/Application |
| Semester records | Academic/Application |
| GPA | Analytics/Derived |
| Current semester selection | Application/UI |
| Modal visibility | UI component |
| Form input | Form |
| Theme | Settings |
| Toast notification | Global UI |
| AI generation status | AI/Application |

The ownership model prevents multiple components from independently modifying the same information.

---

# 6.10 State Flow

The preferred state flow is:

```text
User Interaction
      ↓
UI Event
      ↓
Application Operation
      ↓
Domain / Business Rules
      ↓
Repository
      ↓
Persistent Data
      ↓
State Update
      ↓
Derived State
      ↓
UI Update
```

This provides a predictable unidirectional flow.

---

# 6.11 Read Flow

Reading data should conceptually follow:

```text
UI
 ↓
Application Query
 ↓
Repository
 ↓
IndexedDB
 ↓
Application State
 ↓
Derived State
 ↓
UI
```

The UI should consume state rather than performing database operations itself.

---

# 6.12 Write Flow

Writing data should conceptually follow:

```text
UI Interaction
      ↓
Form / Command
      ↓
Validation
      ↓
Application Operation
      ↓
Domain Rules
      ↓
Repository
      ↓
IndexedDB
      ↓
State Refresh / Update
      ↓
Derived State Recalculation
      ↓
     UI
```

---

# 6.13 State Synchronization with Persistence

When persistent data changes, runtime state must eventually reflect the new persistent value.

Example:

```text
User changes grade
       ↓
Save Grade
       ↓
IndexedDB updated
       ↓
Academic state updated
       ↓
GPA recalculated
       ↓
Dashboard refreshed
```

The application should avoid displaying stale academic information after successful updates.

---

# 6.14 Optimistic vs Confirmed Updates

The MVP should favor confirmed persistence updates for critical academic information.

For example:

```text
User saves Grade
       ↓
Persist
       ↓
Success
       ↓
Update UI
```

rather than immediately showing the new value before persistence succeeds.

This reduces the risk of displaying data that was not successfully stored.

Optimistic updates may be used later for low-risk interactions where the benefit is clear.

---

# 6.15 Loading State

Asynchronous operations should expose loading state where necessary.

Examples:

```text
Loading Subjects
Loading Analytics
Saving Grade
Restoring Backup
Generating AI Response
```

A generic conceptual state is:

```text
idle
loading
success
error
```

More detailed states may be introduced where required.

---

# 6.16 Error State

State associated with asynchronous operations should support error handling.

Example:

```text
Load Subjects
      ↓
    Error
      ↓
Display Recovery Option
```

The UI should receive application-level errors rather than raw persistence errors.

---

# 6.17 Empty State

The application should distinguish between:

```text
Loading
Error
Empty
Loaded
```

For example:

```text
Loading:
"Loading your subjects..."

Empty:
"No subjects have been added yet."

Error:
"We couldn't load your subjects."
```

These states should not be treated as interchangeable.

---

# 6.18 Application Initialization State

At startup, Academic OS may require several initialization operations.

Conceptually:

```text
Application Start
       ↓
Initialize Database
       ↓
Load Configuration
       ↓
Load User Profile
       ↓
Load Current Academic Context
       ↓
Initialize Application State
       ↓
Application Ready
```

The application should not render features that require unavailable data as though the data were empty.

---

# 6.19 Current Academic Context

Academic OS should provide a concept of current academic context.

Potential context includes:

```text
Current Academic Year
Current Semester
Current Academic Program
```

This context may be shared across several features.

For example:

```text
Dashboard
Planner
Subjects
Analytics
```

may all use the current semester.

---

# 6.20 Selected vs Current Semester

The application should distinguish between:

### Current Semester

The semester currently considered active by the academic context.

### Selected Semester

The semester currently being viewed by the user.

For example:

```text
Current Semester = Semester 5

User selects:
Semester 3

Current Semester remains Semester 5.
Selected Semester becomes Semester 3.
```

This prevents navigation and viewing actions from unintentionally changing the user's academic context.

---

# 6.21 Application Context

A lightweight application context may contain:

```text
User
Current Academic Program
Current Academic Year
Current Semester
Selected Semester
Application Status
```

The context should not become a general-purpose container for arbitrary data.

---

# 6.22 State Normalization

Where multiple features reference the same entities, the runtime state should avoid unnecessary duplication.

Conceptually:

```text
subjectsById
enrollmentsById
gradesById
```

may be used where normalization provides a clear benefit.

However, normalization should not be introduced purely for theoretical completeness.

The data volume of Academic OS is expected to be relatively small.

---

# 6.23 State Duplication

Avoid patterns such as:

```text
Dashboard Subjects
Planner Subjects
Analytics Subjects
```

where each is an independently maintained copy of the same subject data.

Instead:

```text
Authoritative Subject State
       ↓
Dashboard
Planner
Analytics
```

should consume the same underlying information.

---

# 6.24 State Selectors

Features should retrieve only the state they require.

For example:

```text
Dashboard
  → current GPA
  → current semester
  → upcoming tasks
```

rather than subscribing to every piece of application data.

This can reduce unnecessary UI updates.

---

# 6.25 Derived State Selectors

Derived information should be calculated through dedicated selectors or services where practical.

Examples:

```text
getCurrentGPA()
getCompletedCredits()
getRemainingCredits()
getSemesterGPA()
getTargetGPAProgress()
```

The exact implementation depends on the selected frontend/state-management technology.

---

# 6.26 GPA State

GPA should be treated as derived state.

Conceptually:

```text
Grades
   +
Credits
   ↓
GPA Calculation Service
   ↓
Current GPA
```

The GPA should not be independently editable in application state.

---

# 6.27 Academic Progress State

Academic progress should similarly be derived.

```text
Program Requirements
        +
Academic Records
        ↓
Progress Calculation
        ↓
Academic Progress
```

The dashboard consumes the result.

---

# 6.28 Planner State

Planner state may include:

```text
Tasks
Schedule Items
Academic Events
Selected Date
Filters
```

Persistent planner records should remain separate from temporary planner UI state.

For example:

```text
Task
```

is persistent data.

```text
Selected Task Filter = "Incomplete"
```

is UI state.

---

# 6.29 Knowledge State

Knowledge-related state may include:

```text
Notes
Resources
Selected Tag
Search Query
Selected Note
```

Persistent notes and resources must remain distinct from temporary search/filter state.

---

# 6.30 Career State

Career-related state may include:

```text
Skills
Projects
Career Goals
Selected Skill
Selected Project
```

The same separation applies:

```text
Project
```

is persistent data.

```text
Selected Project Tab
```

is UI state.

---

# 6.31 AI State

AI features may require runtime state such as:

```text
idle
preparing
generating
success
error
```

AI conversation history, if persisted, should follow the AI data model defined in Part 4.

AI state must remain isolated from authoritative academic state.

---

# 6.32 AI State Boundary

The preferred flow is:

```text
Academic State
      ↓
Context Selection
      ↓
AI Request State
      ↓
AI Service
      ↓
AI Response State
      ↓
User Review
```

AI output should not directly mutate:

```text
Grades
Subjects
Credits
Semesters
Academic Goals
```

without explicit user confirmation.

---

# 6.33 Notifications State

Global notifications may be represented as transient application state.

Examples:

```text
Success
Warning
Error
Information
```

Example:

```text
Grade saved successfully.
```

Notifications should normally disappear after their intended lifetime.

They should not become permanent academic records.

---

# 6.34 Search State

Search state should generally remain local to the feature or page using it.

Examples:

```text
Search query
Search filters
Sort order
Pagination
```

Global search should only be introduced if the application provides a genuine cross-module search experience.

---

# 6.35 Filter State

Filters should normally be UI state.

For example:

```text
Semester = Semester 5
Status = In Progress
```

Changing a filter should not modify the underlying academic records.

---

# 6.36 URL / Navigation State

Where appropriate, navigation state may be represented in the URL.

For example:

```text
/academic/subjects
/academic/semesters/semester-5
/analytics/gpa
```

URL state should be used for navigational context rather than persistent academic information.

---

# 6.37 State Persistence

Not every runtime state should be persisted.

The application should explicitly determine whether a state value needs to survive application restarts.

### Usually Persistent

```text
Subjects
Grades
Tasks
Notes
Settings
Academic Goals
```

### Usually Runtime Only

```text
Loading State
Modal State
Selected Tab
Temporary Form State
Toast Notifications
```

### Potentially Persisted

```text
Theme
Dashboard Layout
Selected Academic Context
User Preferences
```

The decision should be made according to user value.

---

# 6.38 Temporary Form Recovery

For important forms, the application may eventually support recovery of unsaved drafts.

This should not be part of the MVP unless there is a clear need.

If implemented, draft state must remain distinguishable from authoritative data.

---

# 6.39 State Reset

The application should provide controlled state reset behavior.

Examples:

```text
Reset Filters
Clear Search
Close Modal
Cancel Form
Logout / Clear Session
```

Resetting runtime state should not accidentally delete persistent academic data.

---

# 6.40 State Invalidation

When authoritative data changes, dependent derived state should be invalidated or recalculated.

Example:

```text
Grade Changed
     ↓
Invalidate GPA
     ↓
Recalculate GPA
     ↓
Invalidate Academic Analytics
     ↓
Refresh Dashboard
```

The exact invalidation mechanism depends on the implementation.

---

# 6.41 State Refresh

A refresh may be necessary after:

- Database update
- Import
- Restore
- Migration
- External synchronization in a future release

For example:

```text
Restore Backup
      ↓
Invalidate Runtime State
      ↓
Reload Persistent Data
      ↓
Recalculate Derived State
      ↓
Refresh UI
```

---

# 6.42 Multiple-Tab Considerations

Academic OS is primarily a personal single-user application, but users may open multiple tabs.

The MVP does not require sophisticated real-time synchronization between tabs.

However, the application should avoid assuming that another tab cannot modify the database.

Future multi-tab synchronization may be introduced if required.

---

# 6.43 State and Browser Lifecycle

The application should handle browser lifecycle events appropriately.

Potential scenarios include:

- Refresh
- Tab close
- Browser restart
- Application reopening
- Temporary loss of memory state

Persistent data must remain available after these events.

---

# 6.44 State and Offline Operation

Because Academic OS is local-first:

```text
Offline
   ↓
Persistent Data
   ↓
Runtime State
   ↓
Application
```

must remain functional for core features.

Network availability should not determine whether the application can display existing academic information.

---

# 6.45 State and Backup/Restore

Backup and restore operations require special state handling.

During restore:

```text
Restore Started
      ↓
Application State = Restoring
      ↓
Block Conflicting Operations
      ↓
Restore Database
      ↓
Reload State
      ↓
Recalculate Derived State
      ↓
Application Ready
```

This prevents the UI from displaying inconsistent information during restoration.

---

# 6.46 State and Analytics

Analytics should consume authoritative data and derived calculations.

Example:

```text
Academic State
      ↓
Analytics Service
      ↓
Analytics State
      ↓
Charts / Dashboard
```

Analytics state should not become a separate source of truth.

---

# 6.47 State and Dashboard

The Dashboard should primarily consume:

```text
Current Academic Context
Academic Metrics
Upcoming Tasks
Relevant Events
Recent Activity
```

It should not maintain independent copies of the underlying records.

---

# 6.48 State Loading Strategy

The application should avoid loading every possible entity at startup.

The recommended approach is:

```text
Application Start
      ↓
Load Essential Context
      ↓
Render Core UI
      ↓
Load Feature Data When Needed
```

This keeps startup behavior simple and scalable.

For the small expected dataset, eager loading may still be appropriate for some core academic data.

The final strategy should be determined through implementation and profiling.

---

# 6.49 State Management Complexity

The MVP should avoid introducing a state-management framework merely because one is available.

The selected approach should be based on:

- Application size
- Number of shared states
- Reactivity requirements
- Developer familiarity
- Testing needs
- Maintainability

The architecture should allow the state-management implementation to evolve without changing the underlying data model.

---

# 6.50 Recommended State Layers

The conceptual state structure is:

```text
┌─────────────────────────────┐
│ Persistent State            │
│ IndexedDB                   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Application State           │
│ Shared runtime information  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Derived State               │
│ GPA / Progress / Analytics  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ Feature State               │
│ Planner / Academic / etc.   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ UI State                    |
│ Modal / Filter / Selection  |
└─────────────────────────────┘
```

---

# 6.51 State Dependency Direction

Dependencies should flow from authoritative data toward derived representations.

Preferred:

```text
Persistent Data
      ↓
Application State
      ↓
Derived State
      ↓
UI State / Presentation
```

The reverse direction should occur through explicit user actions and application commands.

For example:

```text
UI
 ↓
Command
 ↓
Application
 ↓
Persistence
```

rather than:

```text
UI
 ↓
Direct State Mutation
 ↓
Database
```

---

# 6.52 State and Domain Rules

State management should not become the location of business rules.

For example, the following should not be implemented merely inside a UI state setter:

```text
"If grade changes, calculate graduation eligibility."
```

Instead:

```text
Application Operation
       ↓
Domain / Calculation Service
       ↓
State Update
```

This keeps business logic testable and reusable.

---

# 6.53 State and Application Services

Application services should coordinate state-changing operations.

Example:

```text
Update Grade
      ↓
Validate Grade
      ↓
Persist Grade
      ↓
Refresh Academic State
      ↓
Recalculate GPA
      ↓
Refresh Analytics
```

The UI should trigger the operation rather than implementing the sequence itself.

---

# 6.54 State Consistency Rules

The application should avoid states such as:

```text
Database:
Grade = A

Runtime:
Grade = B
```

after a successful persistence operation.

After successful writes, runtime state should converge with persistent state.

If persistence fails:

```text
Database:
Grade = A

Runtime:
Grade = A
```

should remain the safe result unless an explicitly supported optimistic-update mechanism is being used.

---

# 6.55 State and Error Recovery

When a state-changing operation fails:

```text
Operation
   ↓
Failure
   ↓
No invalid authoritative state
   ↓
Error State
   ↓
User Recovery
```

The application should avoid partially applying changes.

---

# 6.56 State Testing

State management should be tested at several levels.

### State Logic Tests

- Initial state
- State transitions
- Derived calculations
- Invalidation
- Error states

### Application Tests

- Load data
- Save data
- Refresh state
- Restore state

### UI Tests

- Loading state
- Empty state
- Error state
- Successful update
- State-dependent rendering

---

# 6.57 State Performance

The application should avoid unnecessary state updates.

Potential strategies include:

- Selective subscriptions
- Memoized derived calculations
- Component-local state
- Feature-level state boundaries
- Avoiding duplicated state

Optimization should be driven by actual performance requirements.

---

# 6.58 State and Copilot

Because Copilot will assist with implementation, the development rules should explicitly state:

- Do not introduce global state unnecessarily.
- Do not duplicate persistent entities in multiple state containers.
- Do not put business rules inside UI state.
- Do not allow UI components to access IndexedDB directly.
- Derived values should come from authoritative data.
- State changes should follow application operations.
- New global state should have a documented reason.
- State behavior should be tested.

---

# 6.59 State and Google AI Studio

Google AI Studio-generated frontend code may introduce its own state-management patterns.

Generated code should therefore be reviewed against this architecture.

AI-generated code must not introduce an alternative state architecture without an explicit decision.

For example, if the generated application stores academic records in component-local state:

```text
useState(subjects)
```

that may be appropriate for a temporary prototype but should not automatically become the production persistence architecture.

Production Academic OS should follow:

```text
IndexedDB
   ↓
Repository
   ↓
Application State
   ↓
UI
```

---

# 6.60 MVP State Scope

The R1 MVP should implement:

- Persistent academic data loading
- Core application state
- Current academic context
- Selected semester state
- Derived GPA state
- Derived credit-progress state
- Dashboard state
- Feature-level UI state
- Form state
- Loading states
- Empty states
- Error states
- State refresh after persistence operations
- Basic invalidation of derived state
- Local-first operation

Advanced multi-tab synchronization is outside the MVP.

---

# 6.61 Future State Extensions

Future releases may introduce:

- Advanced caching
- Multi-tab synchronization
- Cloud synchronization state
- Offline synchronization queues
- Conflict resolution
- Advanced background processing
- Cross-device state synchronization

These features should be introduced through future architecture decisions.

---

# 6.62 State Management Trade-Off

The architecture intentionally favors:

```text
Clear State Ownership
+
Minimal Global State
+
Unidirectional Data Flow
+
Deterministic Derived State
+
Application-Level Operations
```

over:

```text
Everything in Global State
+
Direct UI Mutations
+
Duplicated Data
+
Database Access from Components
```

The goal is to keep Academic OS understandable as the number of features grows.

---

# 6.63 Part 6 Completion Criteria

Part 6 is considered complete when:

- Persistent state and runtime state are distinguished.
- Authoritative and derived state are distinguished.
- UI state is distinguished from application state.
- Form state is defined.
- State ownership is established.
- State flow is defined.
- Read flow is defined.
- Write flow is defined.
- Persistence synchronization is defined.
- Optimistic vs confirmed update principles are defined.
- Loading states are defined.
- Error states are defined.
- Empty states are defined.
- Application initialization state is defined.
- Current and selected academic context are distinguished.
- State normalization principles are defined.
- State duplication is prohibited where unnecessary.
- Selective state consumption is encouraged.
- GPA is explicitly treated as derived state.
- Academic progress is explicitly treated as derived state.
- Planner state boundaries are defined.
- Knowledge state boundaries are defined.
- Career state boundaries are defined.
- AI state boundaries are defined.
- Notification state is defined.
- Search and filter state boundaries are defined.
- Persistence requirements for different state categories are defined.
- State invalidation is defined.
- State refresh behavior is defined.
- Multi-tab considerations are documented.
- Browser lifecycle behavior is considered.
- Offline state behavior is defined.
- Backup/restore state transitions are defined.
- Analytics state boundaries are defined.
- Dashboard state boundaries are defined.
- Loading strategy is defined.
- State-management complexity principles are established.
- State dependency direction is defined.
- Domain rules are kept outside state management.
- Application services are responsible for coordinated state-changing operations.
- State consistency rules are defined.
- State error recovery is defined.
- State testing requirements are defined.
- State performance principles are established.
- Copilot state-management rules are established.
- Google AI Studio state-management boundaries are established.
- MVP state scope is defined.
- Future state extensions are separated from MVP scope.

Part 7 will define the Feature Module Architecture and establish how Academic OS is divided into independent but connected feature domains.

# Part 7 — Feature Module Architecture

This part defines how Academic OS is divided into feature modules and how those modules interact with the shared application, domain, persistence, analytics, and AI layers.

The purpose of the Feature Module Architecture is to prevent Academic OS from becoming a single large collection of tightly coupled screens and components.

Academic OS should be organized around meaningful academic and productivity capabilities rather than around individual UI pages.

The architecture should support:

- Clear feature ownership
- Independent feature development
- Controlled dependencies
- Shared domain concepts
- Reusable application services
- Consistent data access
- Incremental implementation
- Easier testing
- Easier maintenance
- Future feature expansion

---

## 7.1 Feature Architecture Principles

### FM-001 — Organize Around Capabilities

Features should represent meaningful user capabilities.

Examples:

```text
Academic Planning
Academic Progress
Planner
Knowledge
Career
Analytics
```

A feature should not exist merely because a screen exists.

---

### FM-002 — Feature Boundaries Must Be Explicit

Each feature should have a clear responsibility.

For example:

```text
Academic Progress
    → GPA
    → Credits
    → Graduation Progress
```

while:

```text
Planner
    → Tasks
    → Schedule
    → Events
```

The two features may consume related academic information but should not become one feature.

---

### FM-003 — Features Should Not Directly Access Other Features' Persistence

A feature should not bypass application/domain boundaries to read another feature's database records directly.

Preferred:

```text
Feature A
    ↓
Application / Domain Service
    ↓
Feature B's exposed capability
```

rather than:

```text
Feature A
    ↓
Feature B Database Store
```

---

### FM-004 — Shared Concepts Belong in Shared Layers

If multiple features depend on the same concept, the underlying domain model or shared service should own it.

For example:

```text
Subject
Semester
Enrollment
Grade
```

may be used by:

```text
Dashboard
Planner
Analytics
Academic Progress
```

They should not each define independent versions of these concepts.

---

### FM-005 — Feature Independence

Features should be as independent as practical.

Removing or changing one feature should not require rewriting unrelated features.

---

### FM-006 — Features Communicate Through Contracts

Feature-to-feature communication should use explicit contracts.

Possible mechanisms include:

- Application services
- Domain services
- Shared domain models
- Queries
- Commands
- Events where justified

Direct component-to-component coupling across unrelated features should be minimized.

---

### FM-007 — UI Components Are Not Feature Boundaries

A page or component is not automatically a feature.

For example:

```text
GPA Card
```

is a UI component.

```text
Academic Progress
```

is a feature.

The feature may contain multiple screens, services, components, queries, and domain operations.

---

### FM-008 — Feature Complexity Must Be Proportional

Small features should not be given unnecessarily complex internal architectures.

The architecture should scale with actual feature complexity.

---

# 7.2 Academic OS Feature Map

The initial Academic OS feature architecture is:

```text
Academic OS
│
├── Dashboard
│
├── Academic
│   ├── Academic Profile
│   ├── Programs
│   ├── Semesters
│   ├── Subjects
│   ├── Enrollments
│   └── Grades
│
├── Progress
│   ├── GPA
│   ├── Credits
│   ├── Academic Progress
│   └── Graduation Progress
│
├── Planner
│   ├── Tasks
│   ├── Schedule
│   ├── Calendar
│   └── Academic Events
│
├── Knowledge
│   ├── Notes
│   ├── Resources
│   ├── Tags
│   └── Search
│
├── Career
│   ├── Skills
│   ├── Projects
│   ├── Career Goals
│   └── Portfolio Tracking
│
├── Analytics
│   ├── Academic Analytics
│   ├── Time / Productivity Analytics
│   └── Progress Analytics
│
├── AI
│   ├── Academic Assistant
│   ├── Insights
│   └── Recommendations
│
└── Settings
    ├── Preferences
    ├── Data Management
    └── Application Configuration
```

This structure represents the conceptual feature architecture and may be adjusted during implementation if requirements change.

---

# 7.3 Dashboard Feature

The Dashboard is the primary overview experience.

It should provide a concise view of the user's academic situation.

Potential dashboard information includes:

- Current GPA
- Credit completion
- Current semester
- Current academic goals
- Upcoming deadlines
- Upcoming classes/events
- Recent academic activity
- Progress indicators
- Important reminders
- Relevant insights

The Dashboard should primarily aggregate information from other modules.

It should not become the owner of those underlying records.

---

# 7.4 Academic Feature

The Academic feature owns core academic records.

Potential responsibilities include:

```text
Academic Profile
Programs
Academic Years
Semesters
Subjects
Enrollments
Grades
```

This feature provides the authoritative academic foundation for other features.

---

# 7.5 Academic Profile

The Academic Profile contains personal academic context required by Academic OS.

Potential information includes:

- Student information
- University information
- Program information
- Academic targets
- Academic configuration

The exact personal information stored should be minimized.

---

# 7.6 Program Management

The Program module represents the academic program structure.

Potential information:

```text
Program
 ├── Required Credits
 ├── Required Subjects
 ├── Elective Requirements
 └── Graduation Requirements
```

Program requirements provide the basis for academic progress calculations.

---

# 7.7 Semester Management

Semester management represents academic periods.

Example:

```text
Academic Year
 ├── Semester 1
 ├── Semester 2
 ├── Semester 3
 └── ...
```

Each semester may contain:

- Subjects
- Enrollments
- Grades
- Schedule information
- Academic goals
- Notes

---

# 7.8 Subject Management

The Subject feature manages subject information.

Potential information includes:

- Subject code
- Subject name
- Credits
- Category
- Prerequisites
- Description
- Program relationship

Subject information should be separated from enrollment-specific information.

---

# 7.9 Enrollment Management

Enrollment represents the relationship between:

```text
Student
+
Subject
+
Semester
```

Potential enrollment information includes:

- Enrollment status
- Semester
- Subject
- Attempt number
- Completion status

---

# 7.10 Grade Management

Grade management represents academic outcomes.

Potential information includes:

- Grade
- Score
- Grade status
- Assessment information where required

Grade changes should flow through the application/domain layer.

They should not be directly modified by analytics or AI modules.

---

# 7.11 Progress Feature

The Progress feature transforms academic records into understandable progress information.

Potential capabilities:

- GPA
- Semester GPA
- Cumulative GPA
- Completed credits
- Remaining credits
- Credit completion percentage
- Graduation progress
- Academic goal progress

The Progress feature primarily consumes authoritative academic data.

---

# 7.12 GPA

GPA is calculated from authoritative academic records.

Conceptually:

```text
Grades
   +
Credits
   ↓
GPA Calculation
   ↓
GPA
```

GPA is therefore derived information rather than an independently maintained academic record.

---

# 7.13 Credit Progress

Credit progress may include:

```text
Completed Credits
Required Credits
Remaining Credits
Completion Percentage
```

The calculation should use program requirements and academic records.

---

# 7.14 Graduation Progress

Graduation progress may eventually include:

```text
Required Courses
Completed Courses
Remaining Courses
Required Credits
Completed Credits
Remaining Requirements
```

This feature should make requirements understandable rather than merely displaying raw records.

---

# 7.15 Planner Feature

The Planner manages academic and productivity planning.

Potential capabilities include:

- Tasks
- Schedule
- Calendar
- Academic events
- Deadlines
- Study planning

Planner records should remain separate from academic records even when they reference academic entities.

---

# 7.16 Task Management

Tasks may contain:

- Title
- Description
- Due date
- Priority
- Status
- Subject relationship
- Project relationship
- Tags

Example:

```text
Task
 ├── Complete ML Assignment
 ├── Due: Friday
 ├── Subject: Introduction to ML
 └── Priority: High
```

---

# 7.17 Schedule Management

Schedule management represents planned time commitments.

Potential information includes:

- Subject
- Class type
- Start time
- End time
- Location
- Recurrence

Schedule data should remain distinct from academic enrollment records.

---

# 7.18 Calendar

The Calendar provides a temporal view of:

- Classes
- Tasks
- Exams
- Deadlines
- Academic events

It aggregates information rather than becoming the owner of every underlying record.

---

# 7.19 Knowledge Feature

The Knowledge feature manages academic information collected by the user.

Potential capabilities:

- Notes
- Resources
- Tags
- Search
- Subject-linked knowledge
- Reference management

---

# 7.20 Notes

Notes may be associated with:

- Subjects
- Projects
- Skills
- Academic topics
- Personal study areas

Notes remain user-owned knowledge rather than authoritative university records.

---

# 7.21 Resources

Resources may include references to:

- Websites
- Documents
- Books
- Videos
- Courses
- Study materials

The persistence architecture should distinguish resource metadata from large binary files.

---

# 7.22 Tags

Tags provide lightweight organization across knowledge and productivity records.

Potential examples:

```text
Machine Learning
Python
ICPC
Research
Exam
Project
Career
```

Tags should remain generic enough to be reused across applicable features.

---

# 7.23 Search

Search may eventually provide:

```text
Notes
Resources
Subjects
Tasks
Projects
```

Search should be designed as a capability rather than forcing every feature to implement unrelated search logic.

---

# 7.24 Career Feature

The Career feature supports long-term professional development.

Potential capabilities:

- Skills
- Projects
- Career goals
- Portfolio tracking
- Experience tracking
- Internship preparation

---

# 7.25 Skills

Skills may represent technical and professional capabilities.

Examples:

```text
Python
SQL
Machine Learning
Data Analysis
Git
Communication
```

Skills may be linked to:

- Subjects
- Projects
- Courses
- Career goals

---

# 7.26 Projects

Projects provide a way to track practical work.

Potential information:

- Project name
- Description
- Technologies
- Skills
- Status
- Repository/reference
- Outcomes

Projects may later support portfolio preparation.

---

# 7.27 Career Goals

Career goals represent longer-term objectives.

Examples:

```text
Data Science Internship
Research Project
Graduate Study
Portfolio Development
```

Goals may be connected to skills, projects, tasks, and academic progress.

---

# 7.28 Analytics Feature

Analytics transforms academic and productivity information into trends and measurements.

Potential capabilities:

- GPA trends
- Credit progress
- Semester comparison
- Study/task trends
- Goal progress
- Productivity trends

Analytics must not modify authoritative academic data.

---

# 7.29 Analytics Dependency

Analytics should follow:

```text
Authoritative Data
      ↓
Analytics Services
      ↓
Derived Metrics
      ↓
Visualization
```

Analytics should not become an alternative data store for academic records.

---

# 7.30 AI Feature

The AI feature provides advisory capabilities.

Potential capabilities include:

- Academic assistant
- Study recommendations
- Progress insights
- Planning assistance
- Explanations of trends
- Summarization

AI is not an authoritative source of academic data.

---

# 7.31 AI Feature Boundary

The AI feature should operate through:

```text
Academic / Application Data
        ↓
Context Selection
        ↓
AI Service
        ↓
AI Output
        ↓
User Review
```

AI-generated recommendations must remain distinguishable from authoritative academic records.

---

# 7.32 AI and Academic Data

AI may consume selected academic context.

Examples:

```text
Current GPA
Current Subjects
Upcoming Deadlines
Academic Goals
```

AI should receive only the information required for the requested operation.

---

# 7.33 AI and User Confirmation

If AI proposes an action that changes persistent data:

```text
AI Recommendation
       ↓
User Review
       ↓
User Confirmation
       ↓
Application Command
       ↓
Persistence
```

AI should not directly perform authoritative changes.

---

# 7.34 Settings Feature

Settings manages application configuration.

Potential areas:

```text
Preferences
Appearance
Academic Configuration
Data Management
AI Preferences
```

Settings should not become a generic storage location for unrelated application state.

---

# 7.35 Feature Dependency Map

A simplified dependency model is:

```text
                    ┌─────────────┐
                    │  Dashboard  │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ↓                ↓                ↓
      Academic          Progress         Planner
          │                │                │
          └────────┬───────┴────────┬───────┘
                   ↓                ↓
               Analytics          Knowledge
                   │                │
                   └───────┬────────┘
                           ↓
                          AI
                           │
                           ↓
                        Career
```

This is conceptual rather than a requirement that every feature directly depend on every other feature.

---

# 7.36 Dependency Direction

The preferred direction is:

```text
Presentation
      ↓
Feature Application Logic
      ↓
Domain / Shared Services
      ↓
Repositories
      ↓
Persistence
```

Feature modules should not bypass these boundaries.

---

# 7.37 Shared Domain Layer

Some concepts are inherently shared.

Potential shared concepts include:

```text
Student
AcademicProgram
AcademicYear
Semester
Subject
Enrollment
Grade
Task
Goal
Skill
Project
```

Shared concepts should have one authoritative domain representation.

---

# 7.38 Shared Utilities

Shared utilities may include:

- Date utilities
- Formatting
- Validation helpers
- ID generation
- Error handling
- Common types

Utilities should remain small and focused.

A generic `utils` module should not become a dumping ground for business logic.

---

# 7.39 Cross-Feature References

Features may reference entities from another feature.

For example:

```text
Task
  → Subject

Project
  → Skill

Note
  → Subject

Career Goal
  → Skill
```

References should use stable identifiers.

---

# 7.40 Cross-Feature Coupling

Cross-feature coupling should be minimized.

For example, Planner should not require direct knowledge of the internal implementation of Academic Analytics.

Instead:

```text
Planner
   ↓
Shared Academic Capability
```

where necessary.

---

# 7.41 Feature Events

Events may be used where they provide meaningful decoupling.

Example:

```text
GradeUpdated
      ↓
Progress recalculates
      ↓
Analytics refreshes
      ↓
Dashboard updates
```

Events should not be introduced everywhere.

Direct application service coordination is preferred when the dependency is simple and explicit.

---

# 7.42 Feature Commands and Queries

Features may expose application-level operations.

Example:

```text
Commands:
CreateSubject
UpdateGrade
CreateTask
CreateProject

Queries:
GetCurrentSemester
GetGPA
GetUpcomingTasks
GetAcademicProgress
```

Commands change state.

Queries retrieve information.

This distinction should remain conceptually clear even if the implementation does not use formal CQRS.

---

# 7.43 Feature Internal Structure

A complex feature may use:

```text
feature/
├── components/
├── pages/
├── hooks/
├── services/
├── queries/
├── commands/
├── models/
└── tests/
```

The exact structure should be adapted to the chosen frontend framework.

---

# 7.44 Feature Ownership

Each feature should have an identifiable owner within the architecture.

Example:

| Feature | Primary Responsibility |
|---|---|
| Dashboard | Overview |
| Academic | Authoritative academic records |
| Progress | Academic progress calculations |
| Planner | Planning and scheduling |
| Knowledge | Notes and resources |
| Career | Skills and professional development |
| Analytics | Metrics and trends |
| AI | Advisory intelligence |
| Settings | Application configuration |

---

# 7.45 Dashboard as an Aggregator

The Dashboard should not duplicate feature logic.

Instead:

```text
Dashboard
    ↓
Queries / Services
    ├── Progress
    ├── Planner
    ├── Academic
    ├── Career
    └── Analytics
```

This allows the Dashboard to remain an overview layer.

---

# 7.46 Academic as the Authoritative Foundation

The Academic feature is the primary source for academic records.

Other features may consume academic information but should not create competing versions of:

```text
Subject
Semester
Enrollment
Grade
```

---

# 7.47 Progress as a Derived Feature

Progress does not own the underlying academic records.

Instead:

```text
Academic
   ↓
Progress Calculations
   ↓
Progress Feature
```

---

# 7.48 Analytics as a Derived Feature

Analytics similarly consumes information from authoritative and operational modules.

It should not modify the underlying records simply to produce analytics.

---

# 7.49 AI as an Advisory Feature

AI should sit above application/domain data rather than becoming a foundational dependency.

The system must remain usable without AI.

Conceptually:

```text
Core Academic OS
       │
       ├── Works without AI
       │
       └── AI provides optional assistance
```

---

# 7.50 Feature Availability

The MVP should prioritize core features.

A recommended release structure is:

```text
R0 — Foundation
    ├── Application Shell
    ├── Data Model
    ├── Persistence
    └── Core Architecture

R1 — MVP
    ├── Dashboard
    ├── Academic
    ├── Progress
    ├── Planner
    ├── Basic Analytics
    └── Settings / Data Management

Future Releases
    ├── Knowledge Expansion
    ├── Career Expansion
    ├── Advanced Analytics
    └── AI
```

The exact feature allocation should remain aligned with the PRD's release priorities.

---

# 7.51 Feature Priority

Feature priorities should follow the established PRD priority model.

The architecture should not force implementation of low-priority features simply because their module has already been defined.

A module may exist architecturally while remaining unimplemented until its planned release.

---

# 7.52 Feature Flags

Feature flags may be used where necessary to control unfinished features.

Example:

```text
AI_ENABLED = false
```

during early development.

Feature flags should not replace proper release planning.

---

# 7.53 Feature Testing

Each feature should have tests appropriate to its responsibility.

Examples:

### Academic

- Subject creation
- Enrollment
- Grade updates
- Semester relationships

### Progress

- GPA calculations
- Credit calculations
- Graduation progress

### Planner

- Task creation
- Due dates
- Schedule

### Knowledge

- Note creation
- Search
- Tagging

### Career

- Skill management
- Project management
- Goal relationships

### Analytics

- Metric calculations
- Trend generation

### AI

- Context preparation
- Output validation
- Error handling
- User confirmation

---

# 7.54 Feature Isolation in Tests

Feature tests should avoid unnecessary dependencies on unrelated features.

For example:

```text
Progress Test
```

should not require rendering the entire Dashboard.

This improves test speed and maintainability.

---

# 7.55 Feature Documentation

Complex feature modules should contain lightweight documentation describing:

- Purpose
- Inputs
- Outputs
- Dependencies
- State ownership
- Persistence relationships
- Important business rules

This documentation should remain consistent with the PRD and architecture.

---

# 7.56 Feature and Copilot

Copilot should be instructed to respect feature boundaries.

It should:

- Place functionality in the appropriate module.
- Avoid creating duplicate domain models.
- Avoid direct cross-feature database access.
- Reuse shared services where appropriate.
- Avoid unnecessary global state.
- Keep feature-specific logic inside the feature.
- Add tests with feature implementations.

---

# 7.57 Feature and Google AI Studio

Google AI Studio may generate screens across multiple feature areas.

Generated UI should be reorganized according to the feature architecture before being treated as production structure.

For example:

```text
Generated:
components/
    Dashboard.tsx
    Subjects.tsx
    Planner.tsx
    Analytics.tsx
```

may eventually become:

```text
features/
├── dashboard/
├── academic/
├── planner/
└── analytics/
```

The generated structure is therefore a starting point rather than an architectural authority.

---

# 7.58 Feature Evolution

Features should be allowed to grow independently.

For example:

```text
Planner
   ↓
Basic Tasks
   ↓
Calendar
   ↓
Study Planning
   ↓
Advanced Planning
```

The initial architecture should not require every future capability to be implemented immediately.

---

# 7.59 Feature Splitting

A feature may be split when it becomes too large.

For example:

```text
Knowledge
```

could eventually become:

```text
Notes
Resources
Research
```

Such splitting should occur when justified by complexity rather than prematurely.

---

# 7.60 Feature Merging

Small features may be merged if maintaining separate modules creates unnecessary complexity.

Architecture should remain pragmatic.

---

# 7.61 Feature Security Boundary

Features should not assume that another feature has validated its input.

Important application-level operations should validate their inputs before performing persistent changes.

---

# 7.62 Feature Data Ownership Summary

The ownership model is:

```text
Academic
 └── Authoritative academic records

Progress
 └── Derived academic progress

Planner
 └── Planning records

Knowledge
 └── User knowledge records

Career
 └── Professional development records

Analytics
 └── Derived analytical information

AI
 └── Advisory outputs

Settings
 └── Application configuration

Dashboard
 └── Aggregated presentation
```

---

# 7.63 Feature Architecture and Local-First Design

Feature modules must operate within the local-first architecture.

Core feature operations should not require a remote server.

For example:

```text
Academic
   ↓
IndexedDB

Planner
   ↓
IndexedDB

Progress
   ↓
Local calculations

Dashboard
   ↓
Local data
```

---

# 7.64 Feature Architecture and Offline Operation

Core features should remain usable offline.

AI and external integrations may have additional availability requirements.

If an optional external capability is unavailable, the core Academic OS should continue operating.

---

# 7.65 Feature Architecture and Future Synchronization

Future synchronization should occur below feature boundaries where possible.

Conceptually:

```text
Feature
   ↓
Application
   ↓
Repository
   ↓
Local Persistence
   ↕
Future Sync Layer
```

Features should not need to know whether data is synchronized remotely.

---

# 7.66 Feature Architecture and AI Safety

AI must remain an optional layer.

The architecture should prevent AI from becoming a hidden dependency of core academic functionality.

If the AI service fails:

```text
AI Failure
   ↓
Core Academic OS
   ↓
Continues Operating
```

---

# 7.67 Feature Architecture Trade-Off

The architecture intentionally favors:

```text
Clear Feature Ownership
+
Shared Domain Concepts
+
Controlled Dependencies
+
Optional AI
+
Local-First Operation
```

over:

```text
One Giant Application Module
+
Direct Cross-Feature Access
+
Duplicated Data
+
AI-Centric Architecture
```

This provides a balance between modularity and the relatively small scale of a personal academic system.

---

# 7.68 MVP Feature Scope

The R1 MVP should prioritize:

### Core

- Dashboard
- Academic
- Progress
- Planner
- Settings / Data Management

### Supporting

- Basic Analytics
- Basic search where required
- Basic academic goals

### Future / Optional

- Advanced Knowledge
- Advanced Career management
- Advanced Analytics
- AI Assistant
- AI Recommendations
- Advanced external integrations

The exact release allocation remains governed by the PRD.

---

# 7.69 Feature Completion Criteria

Part 7 is considered complete when:

- Feature architecture principles are defined.
- Feature boundaries are explicit.
- Academic OS feature map is established.
- Dashboard responsibilities are defined.
- Academic responsibilities are defined.
- Progress responsibilities are defined.
- Planner responsibilities are defined.
- Knowledge responsibilities are defined.
- Career responsibilities are defined.
- Analytics responsibilities are defined.
- AI responsibilities are defined.
- Settings responsibilities are defined.
- Feature dependency principles are established.
- Shared domain concepts are identified.
- Cross-feature references are defined.
- Feature coupling rules are established.
- Feature events are considered.
- Commands and queries are defined conceptually.
- Feature internal structure is established.
- Feature ownership is documented.
- Dashboard aggregation responsibilities are defined.
- Academic authoritative-data ownership is established.
- Progress and Analytics are defined as derived capabilities.
- AI is explicitly defined as optional and advisory.
- Feature release prioritization is established.
- Feature testing requirements are defined.
- Feature documentation expectations are defined.
- Copilot feature-development rules are established.
- Google AI Studio feature-structure boundaries are established.
- Feature evolution and splitting principles are established.
- Local-first feature operation is established.
- Offline feature behavior is defined.
- Future synchronization boundaries are established.
- AI safety boundaries are established.
- MVP feature scope is defined.
- Feature architecture trade-offs are documented.

Part 8 will define Backup & Restore Architecture, including backup formats, validation, restoration safety, version compatibility, and protection against accidental data loss.

# Document 02 — System Architecture & Technical Design

# Part 8 — Backup & Restore Architecture

## 8.1 Purpose

This part defines the architecture for protecting, exporting, restoring, validating, and recovering Academic OS data.

Because Academic OS follows a local-first architecture, browser-based persistent storage is an important source of truth.

The Backup & Restore Architecture therefore provides a controlled mechanism for creating portable copies of Academic OS data and safely restoring those copies when necessary.

The primary objectives are:

- Prevent accidental academic data loss
- Provide portable backups
- Support manual backup and restore
- Validate backup integrity
- Prevent unsafe restoration
- Support schema/version compatibility
- Preserve data relationships
- Provide clear recovery states
- Keep backup operations local-first
- Keep the MVP implementation practical

---

## 8.2 Backup & Restore Principles

### BR-001 — User Owns the Backup

Academic OS should allow the user to explicitly create and control their backups.

The system should not assume that browser storage alone is sufficient protection.

### BR-002 — Local-First Backup

The primary backup mechanism should operate locally.

The MVP should allow the user to export Academic OS data to a portable backup file.

```text
IndexedDB
   ↓
Export
   ↓
Backup File
   ↓
User Storage
```

### BR-003 — Restore Must Be Explicit

Restoring a backup is potentially destructive.

The application must require explicit user confirmation before replacing or modifying existing data.

### BR-004 — Validate Before Restore

A backup must be validated before it is applied.

Validation should verify, where applicable:

- File format
- Backup version
- Schema compatibility
- Required metadata
- Data structure
- Entity identifiers
- Referential integrity

### BR-005 — Never Restore Blindly

Academic OS should never assume that a selected file is a valid Academic OS backup simply because it has the expected file extension.

The file must pass validation before restoration.

### BR-006 — Preserve Data Relationships

Backup and restore operations must preserve relationships between entities.

For example:

```text
Semester
   ↓
Enrollment
   ↓
Subject
   ↓
Grade
```

References between these entities must remain valid after restoration.

### BR-007 — Backup Format Should Be Portable

The backup format should not depend on the internal IndexedDB implementation.

The user should be able to export data into a defined application-level backup format.

### BR-008 — Restore Must Be Transaction-Safe

Where technically possible, restoration should behave as an atomic operation.

The application should avoid leaving the database in a partially restored state.

Preferred:

```text
Validate
   ↓
Prepare
   ↓
Restore
   ↓
Commit
```

rather than:

```text
Restore some data
   ↓
Error
   ↓
Partially restored database
```

### BR-009 — Backup Should Be Versioned

Every backup must contain version information.

This allows future versions of Academic OS to determine whether a backup is:

- Fully compatible
- Migratable
- Unsupported

### BR-010 — Restore Should Be Reversible Where Practical

Before replacing existing data, Academic OS should provide a safety mechanism where practical.

For example:

```text
Current Data
     ↓
Temporary Safety Backup
     ↓
Restore Selected Backup
```

This reduces the risk of accidental irreversible replacement.

---

## 8.3 Backup Scope

A backup should contain the user's meaningful Academic OS data.

Potential backup categories include:

```text
Academic Data
Planner Data
Knowledge Data
Career Data
Goals
Settings
Application Metadata
```

The exact entities included should follow the Data Architecture defined in Part 4.

---

## 8.4 Data Included in Backup

### Academic

- Academic profile
- Programs
- Academic years
- Semesters
- Subjects
- Enrollments
- Grades

### Planner

- Tasks
- Schedule items
- Academic events

### Knowledge

- Notes
- Resources
- Tags

### Career

- Skills
- Projects
- Career goals

### Settings

- User preferences
- Relevant application settings

---

## 8.5 Derived Data

Derived information should generally not be treated as authoritative backup data.

For example:

```text
Grades
+
Credits
   ↓
GPA
```

The backup should preserve the authoritative information required to recalculate GPA rather than relying on a stored GPA value.

Similarly:

```text
Academic Records
+
Program Requirements
   ↓
Academic Progress
```

should be recalculated after restoration.

---

## 8.6 Backup Metadata

A backup should contain metadata such as:

```text
Backup Format Version
Application Version
Schema Version
Created At
Backup Identifier
```

Future versions may add optional metadata such as:

```text
Backup Description
User-Provided Label
```

Unnecessary personal or device information should not be included.

---

## 8.7 Recommended Backup Structure

The conceptual backup structure is:

```text
Backup
├── metadata
│   ├── formatVersion
│   ├── applicationVersion
│   ├── schemaVersion
│   ├── backupId
│   └── createdAt
│
├── academic
│   ├── profile
│   ├── programs
│   ├── academicYears
│   ├── semesters
│   ├── subjects
│   ├── enrollments
│   └── grades
│
├── planner
│   ├── tasks
│   ├── schedules
│   └── events
│
├── knowledge
│   ├── notes
│   ├── resources
│   └── tags
│
├── career
│   ├── skills
│   ├── projects
│   └── goals
│
└── settings
    └── preferences
```

This represents a logical format rather than a mandatory implementation structure.

---

## 8.8 Backup File Format

The MVP should use a structured, human-readable format where practical.

JSON is the preferred initial format because:

- It is widely supported.
- It is easy to generate.
- It is easy to validate.
- It is portable.
- It is straightforward to debug.
- It does not depend on IndexedDB internals.

A future compressed format may be introduced if backup size becomes significant.

---

## 8.9 Backup File Naming

The application may generate names similar to:

```text
academic-os-backup-2026-08-19.json
```

The naming convention should help the user identify the backup without exposing unnecessary personal information.

---

## 8.10 Backup Creation Flow

The preferred flow is:

```text
User selects "Create Backup"
          ↓
Collect authoritative data
          ↓
Construct backup structure
          ↓
Add metadata
          ↓
Validate backup
          ↓
Generate file
          ↓
User saves file
          ↓
Backup completed
```

---

## 8.11 Backup Validation

Before a backup is exported, Academic OS should validate the generated structure.

Validation may include:

- Required metadata exists
- Supported format version
- Valid entity structures
- Valid identifiers
- Valid references
- No impossible relationships
- Serialization succeeds

---

## 8.12 Backup Integrity

The MVP should provide basic structural validation.

Future versions may add stronger integrity mechanisms such as:

```text
Backup Data
    ↓
Hash
    ↓
Integrity Metadata
```

Cryptographic integrity mechanisms should only be introduced where they provide meaningful value.

---

## 8.13 Backup Encryption

The MVP does not require encrypted backup files unless security requirements establish this as necessary.

However, users should be informed that a plain JSON backup may contain personal academic information.

Future versions may support:

```text
Backup
   ↓
Encryption
   ↓
Encrypted Backup File
```

If encryption is introduced, password/key management must be designed carefully.

---

## 8.14 Backup Privacy

Backup files may contain personal and academic information.

Academic OS should therefore:

- Avoid unnecessary personal information
- Avoid unnecessary device information
- Avoid unnecessary analytics metadata
- Avoid including transient UI state
- Avoid including raw AI prompts unless explicitly stored as user data

---

## 8.15 AI Data in Backups

AI-related information should follow the AI data model.

If AI conversation history is explicitly persisted by the user, it may be included in backups.

If AI output is temporary runtime state, it should not automatically be included.

The backup architecture should distinguish:

```text
Persisted AI Data
```

from:

```text
Temporary AI Runtime State
```

---

## 8.16 External Files

Large external files should not automatically be embedded into the primary JSON backup.

For example:

```text
Large PDF
Large Image
Video
```

may require a separate strategy.

The MVP should prioritize backing up metadata and application records.

Future versions may support packaged backups containing external files.

---

## 8.17 Backup Destination

The MVP should allow the user to save the backup file through the browser's normal file-download mechanism.

The application should not require a cloud account.

Possible destinations include:

- Local computer
- External drive
- Cloud storage chosen by the user
- Other user-managed storage

Academic OS does not need to manage these destinations in the MVP.

---

## 8.18 Backup Frequency

The MVP should support manual backup.

The application may recommend regular backups.

For example:

```text
Last Backup:
2026-08-19

Backup Reminder:
Consider creating a new backup.
```

Automatic scheduled backups may be considered later.

---

## 8.19 Automatic Backup

Automatic backup is a future capability.

Potential future architecture:

```text
Application
    ↓
Backup Scheduler
    ↓
Backup Generator
    ↓
User-Configured Destination
```

Automatic backups should not silently upload private academic data.

---

## 8.20 Backup Reminder

A lightweight reminder may be implemented in the future.

Possible conditions:

```text
No backup for X days
```

or:

```text
Significant data changes since last backup
```

The reminder should remain non-intrusive.

---

## 8.21 Restore Flow

The preferred restore flow is:

```text
User selects backup file
          ↓
Read file
          ↓
Parse
          ↓
Validate format
          ↓
Validate schema
          ↓
Validate references
          ↓
Show restore summary
          ↓
User confirms
          ↓
Create safety backup
          ↓
Restore data
          ↓
Rebuild runtime state
          ↓
Recalculate derived state
          ↓
Verify restored data
          ↓
Application Ready
```

---

## 8.22 Restore Preview

Before confirmation, the application should show a summary where practical.

Example:

```text
Backup created:
19 August 2026

Contains:
12 Subjects
5 Semesters
38 Grades
24 Tasks
17 Notes
8 Projects
```

This helps the user confirm that the selected backup is the intended one.

---

## 8.23 Restore Confirmation

The confirmation message should clearly communicate the consequences.

Example:

```text
Restoring this backup will replace the current Academic OS data.

A safety backup will be created before restoration.

Continue?
```

The wording should be explicit rather than vague.

---

## 8.24 Restore Modes

The MVP should prioritize a full restore.

```text
Full Restore
    ↓
Replace current application data
```

Future versions may support:

```text
Merge
Selective Restore
Entity-Level Restore
```

These should not be included unless there is a clear requirement.

---

## 8.25 Full Restore

Full restore replaces the current dataset with the selected backup.

Preferred flow:

```text
Current Data
    ↓
Safety Backup
    ↓
Clear / Replace
    ↓
Restore Backup
    ↓
Verify
```

---

## 8.26 Merge Restore

Merge restoration is more complex because conflicts must be resolved.

Example:

```text
Current:
Subject A → Grade B

Backup:
Subject A → Grade A
```

The system would need to determine which value should win.

Therefore merge restore is outside the MVP.

---

## 8.27 Selective Restore

Selective restoration may eventually allow:

```text
Restore only:
☑ Academic
☐ Planner
☐ Knowledge
☐ Career
```

This is also outside the MVP unless a strong user need emerges.

---

## 8.28 Restore Compatibility

A backup should be classified according to compatibility.

Possible states:

```text
Compatible
Compatible with Migration
Unsupported
Invalid
```

---

## 8.29 Schema Migration

If the backup schema is older than the current application schema:

```text
Old Backup
    ↓
Migration
    ↓
Current Schema
    ↓
Validation
    ↓
Restore
```

Migration should occur before persistent data is committed.

---

## 8.30 Unsupported Backups

If a backup cannot be safely migrated:

```text
Restore Blocked
```

The application should explain why the backup cannot be restored.

It should not attempt a best-effort restore that could silently corrupt data.

---

## 8.31 Invalid Backup

An invalid backup should produce an error state.

Possible causes:

- Invalid JSON
- Missing metadata
- Invalid schema
- Missing required fields
- Broken references
- Unsupported format
- Corrupted content

The existing database should remain untouched.

---

## 8.32 Restore Transaction Safety

The restore operation should be designed so that failure does not leave the application in an inconsistent state.

Preferred:

```text
Validate
   ↓
Prepare
   ↓
Transaction
   ↓
Commit
```

If the transaction fails:

```text
Rollback
```

where supported by the persistence implementation.

---

## 8.33 Safety Backup Before Restore

Before replacing existing data, Academic OS should create a safety backup where practical.

Conceptually:

```text
Existing Data
     ↓
Safety Export
     ↓
Restore New Backup
```

If restoration fails, the safety backup can be used for recovery.

---

## 8.34 Restore Verification

After restoration, the application should verify that:

- Required entities exist
- References remain valid
- Database operations succeed
- Expected record counts are reasonable
- Derived calculations can execute
- Application state can be rebuilt

---

## 8.35 Post-Restore Recalculation

After restore:

```text
Restored Academic Data
       ↓
Load Application State
       ↓
Recalculate GPA
       ↓
Recalculate Credit Progress
       ↓
Recalculate Analytics
       ↓
Refresh Dashboard
```

Derived values should reflect the restored authoritative data.

---

## 8.36 Post-Restore UI State

After a restore, temporary UI state should be reset where appropriate.

For example:

```text
Selected Semester
Search Query
Open Modal
Current Form
```

should not be assumed to remain valid after the underlying dataset changes.

---

## 8.37 Restore Completion State

After successful restoration, the application should communicate:

```text
Restore completed successfully.
```

It may also display:

```text
Restored:
X subjects
Y semesters
Z grades
```

---

## 8.38 Restore Failure State

If restoration fails:

1. Preserve the previous valid dataset where possible.
2. Display a clear error.
3. Avoid presenting partially restored data as valid.
4. Provide a recovery path.

---

## 8.39 Backup and Persistence Layer

Backup operations should interact with the repository/application layer rather than directly manipulating IndexedDB internals.

Preferred:

```text
Backup Service
      ↓
Repositories
      ↓
Persistence
```

rather than:

```text
Backup Service
      ↓
Direct IndexedDB Tables
```

This keeps the backup mechanism aligned with the persistence architecture.

---

## 8.40 Restore and Persistence Layer

Restore should similarly use the persistence abstraction.

Conceptually:

```text
Restore Service
      ↓
Validation
      ↓
Repository / Persistence Operations
      ↓
IndexedDB
```

The implementation may use optimized bulk operations internally.

---

## 8.41 Backup and State Management

Backup and state management must remain coordinated.

During backup:

```text
Application State
      ↓
Authoritative Persistent Data
      ↓
Backup
```

The backup should be generated from authoritative persistent information rather than temporary UI state.

---

## 8.42 Restore and State Management

During restore:

```text
Restore Started
      ↓
State = Restoring
      ↓
Persistent Data Updated
      ↓
Runtime State Invalidated
      ↓
State Reloaded
      ↓
Derived State Recalculated
      ↓
State = Ready
```

---

## 8.43 Restore and Feature Modules

Restoration should not require each feature to implement its own independent restore mechanism.

The central backup system should coordinate restoration.

Conceptually:

```text
Backup Service
     ├── Academic
     ├── Planner
     ├── Knowledge
     ├── Career
     └── Settings
```

Feature-specific validation may be delegated to the appropriate application/domain layer.

---

## 8.44 Backup Versioning

The backup format should have its own version separate from the application version.

Example:

```text
applicationVersion:
1.2.0

schemaVersion:
4

backupFormatVersion:
1
```

This separation allows the backup format to evolve independently.

---

## 8.45 Version Compatibility Matrix

Future documentation should maintain a compatibility model such as:

| Backup Version | Application Version | Result |
|---|---|---|
| Current | Current | Supported |
| Older | Current | Migration |
| Much Older | Current | Depends on migration support |
| Newer | Older | Unsupported |
| Invalid | Any | Rejected |

---

## 8.46 Backup Integrity and IDs

Entities should retain stable identifiers during backup and restore.

For example:

```text
Subject ID
Semester ID
Enrollment ID
Grade ID
```

should remain consistent unless a migration explicitly requires identifier changes.

---

## 8.47 Referential Integrity

The restore process should verify relationships such as:

```text
Enrollment.subjectId
       ↓
Existing Subject

Enrollment.semesterId
       ↓
Existing Semester

Grade.enrollmentId
       ↓
Existing Enrollment
```

Broken references should cause validation failure unless a documented migration can repair them safely.

---

## 8.48 Duplicate Prevention

A full restore should not accidentally duplicate records.

For example:

```text
Backup:
10 subjects

After restore:
10 subjects
```

rather than:

```text
Current:
10 subjects

Restore:
10 subjects

Result:
20 subjects
```

unless a future merge operation explicitly requests this behavior.

---

## 8.49 Backup and Deletion

Deleting data should not automatically delete previously exported backup files.

Backup files are user-controlled external artifacts.

Academic OS should clearly distinguish:

```text
Application Data
```

from:

```text
External Backup Files
```

---

## 8.50 Data Export vs Backup

### Backup

Designed to restore the complete application dataset.

### Export

Designed to provide user-readable or feature-specific data.

For example:

```text
Backup:
Academic OS → Academic OS

Export:
Grades → CSV
Tasks → CSV
```

These are different capabilities.

---

## 8.51 Data Import vs Restore

### Restore

Reconstructs an Academic OS dataset.

### Import

Introduces selected external data into the application.

For example:

```text
Restore:
Academic OS Backup → Academic OS

Import:
CSV Grades → Academic OS
```

Import should be treated as a separate future capability.

---

## 8.52 Backup User Experience

Backup functionality should be easy to discover.

A possible location:

```text
Settings
   ↓
Data Management
   ├── Create Backup
   ├── Restore Backup
   └── Export Data
```

The Dashboard may optionally display a reminder, but backup management should remain under Data Management.

---

## 8.53 Backup Status

The application may display:

```text
Last Backup:
19 August 2026
```

This information is useful but should not be treated as proof that the backup file still exists.

The user controls the external file.

---

## 8.54 Backup Failure

If backup creation fails:

```text
Backup Started
     ↓
Error
     ↓
No backup presented as successful
```

The application should clearly indicate failure.

---

## 8.55 Backup Storage Quota

IndexedDB storage limitations should be considered.

The primary JSON backup should contain structured records rather than unnecessary duplicated or binary data.

The application should not assume unlimited browser storage.

---

## 8.56 Large Dataset Considerations

Academic OS is expected to contain a relatively small personal dataset.

Therefore the MVP does not require a distributed backup architecture.

If the dataset grows substantially in future releases, backup generation may be optimized through:

- Streaming
- Compression
- Chunking
- Separate asset archives

---

## 8.57 Security Considerations

Backup and restore operations should protect against:

- Malformed files
- Unexpected data structures
- Invalid identifiers
- Excessively large inputs
- Unexpected nested structures
- Unsafe parsing behavior

The restore parser should not execute arbitrary code contained in a backup.

Backup data must be treated strictly as data.

---

## 8.58 Malicious or Untrusted Backups

Even though Academic OS is a personal application, backup files may originate from outside the current environment.

The application should therefore assume:

```text
Backup File = Untrusted Input
```

Validation must occur before the data is committed.

---

## 8.59 Restore Resource Limits

The application may apply reasonable limits to prevent extremely large or malformed backups from consuming excessive browser resources.

Potential validation limits include:

- Maximum file size
- Maximum record counts
- Maximum nesting depth
- Maximum string length

Exact values should be determined during implementation.

---

## 8.60 Backup Logging

The MVP does not require extensive backup logs.

Basic metadata may be sufficient:

```text
Last Backup Created
Last Restore Performed
```

Future versions may maintain more detailed operation history.

---

## 8.61 Backup Audit Information

If operation history is implemented later, it should not store unnecessary sensitive information.

Example:

```text
Backup Created
2026-08-19 09:00
```

is preferable to storing unnecessary copies of backup content.

---

## 8.62 Recovery Strategy

The recovery hierarchy should be:

```text
Current Valid Database
        ↓
Safety Backup
        ↓
User Backup
        ↓
Manual Recovery
```

The application should make the safest recovery option clear.

---

## 8.63 Disaster Scenario

If the browser's IndexedDB data is lost:

```text
Browser Data Lost
       ↓
Open / Reinstall Academic OS
       ↓
Restore Backup
       ↓
Validate
       ↓
Restore
       ↓
Recalculate Derived State
       ↓
Continue Using Academic OS
```

This is the primary purpose of the backup system.

---

## 8.64 MVP Backup Strategy

The R1 MVP should provide:

- Manual backup creation
- JSON backup format
- Backup metadata
- Backup validation
- Manual restore
- Restore preview
- Explicit restore confirmation
- Full restore
- Compatibility checking
- Basic schema migration support where required
- Safety backup before destructive restore where practical
- Restore verification
- Runtime state refresh
- Derived-state recalculation
- Clear success/failure feedback

---

## 8.65 Features Outside MVP

The following should remain outside the MVP unless requirements change:

- Automatic cloud backup
- Automatic scheduled backup
- Encrypted cloud storage
- Multi-device synchronization
- Merge restore
- Selective entity restore
- Packaged binary asset backup
- Advanced backup history
- Automatic conflict resolution

---

## 8.66 Recommended Backup UX

A simple Data Management screen may contain:

```text
Data Management
────────────────────────────

Backup
[ Create Backup ]

Last backup:
19 August 2026

Restore
[ Restore Backup ]

Export
[ Export Data ]

────────────────────────────

⚠ Restoring a backup can replace
your current Academic OS data.
```

The interface should prioritize clarity over complexity.

---

## 8.67 Backup Architecture Diagram

```text
                         ┌───────────────────┐
                         │   Academic OS     │
                         └─────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ↓                             ↓
             Backup Service                Restore Service
                    │                             │
                    ↓                             ↓
             Data Collection                 File Input
                    │                             │
                    ↓                             ↓
             Backup Builder                 Validation
                    │                             │
                    ↓                             ↓
             Backup Validation              Compatibility
                    │                             │
                    ↓                             ↓
              Backup File                  User Confirmation
                                                  │
                                                  ↓
                                           Safety Backup
                                                  │
                                                  ↓
                                             Persistence
                                                  │
                                                  ↓
                                          State Reload
                                                  │
                                                  ↓
                                      Derived State Rebuild
                                                  │
                                                  ↓
                                               UI Ready
```

---

## 8.68 Architectural Relationship

```text
┌──────────────────────────────┐
│ Presentation / UI            │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Application Layer            │
│ Backup / Restore Services    │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ Repository / Persistence     │
└──────────────┬───────────────┘
               ↓
┌──────────────────────────────┐
│ IndexedDB                    │
└──────────────────────────────┘
```

External backup files exist outside the normal application persistence boundary.

---

## 8.69 Architectural Rules

The following rules are mandatory:

1. Backup files must use a defined versioned format.
2. Backup data must be validated before restoration.
3. Restore must require explicit user confirmation.
4. Restore must not silently merge data.
5. Existing data should be protected before destructive restoration where practical.
6. Derived state should be recalculated after restoration.
7. UI state should be reset or refreshed after restoration.
8. Broken references must not be silently accepted.
9. Backup operations must not bypass the persistence architecture.
10. Backup files must be treated as untrusted input.
11. Core Academic OS functionality must not depend on cloud backup.
12. AI must not silently modify backup or restore data.
13. Backup and restore failures must leave the application in a known state where possible.
14. Backup and export must remain conceptually distinct.
15. Restore and import must remain conceptually distinct.

---

## 8.70 Testing Requirements

Backup and restore must be tested with:

### Valid Backup

```text
Create → Restore → Verify
```

### Invalid JSON

```text
Invalid File → Reject
```

### Missing Metadata

```text
Missing Version → Reject
```

### Broken References

```text
Invalid Subject Reference → Reject
```

### Older Schema

```text
Old Backup → Migration → Restore
```

### Unsupported Schema

```text
Unsupported Backup → Reject
```

### Restore Failure

```text
Restore Error → Existing Data Preserved
```

### Derived State

```text
Restore Grades
      ↓
GPA Recalculated
```

### Duplicate Prevention

```text
Restore Backup
      ↓
No Unintended Duplicate Records
```

---

## 8.71 Part 8 Completion Criteria

Part 8 is considered complete when:

- Backup ownership is defined.
- Local-first backup is established.
- Explicit restore confirmation is established.
- Backup validation is required.
- Data relationships are preserved.
- Backup format is versioned.
- Backup scope is defined.
- Backup metadata is defined.
- Derived data handling is defined.
- Backup privacy requirements are defined.
- External-file handling is defined.
- Backup creation flow is defined.
- Restore flow is defined.
- Restore preview is defined.
- Full restore is defined.
- Merge restore is deferred.
- Selective restore is deferred.
- Compatibility handling is defined.
- Schema migration is defined conceptually.
- Invalid backups are rejected.
- Restore transaction safety is established.
- Safety backup strategy is established.
- Restore verification is defined.
- Post-restore recalculation is defined.
- State refresh after restore is defined.
- Feature-module restoration boundaries are defined.
- Backup and export are distinguished.
- Restore and import are distinguished.
- Security considerations are defined.
- Recovery strategy is defined.
- MVP backup scope is defined.
- Future backup capabilities are separated from MVP.
- Backup UX is defined.
- Backup testing requirements are defined.

# Document 02 — System Architecture & Technical Design

# Part 9 — Cross-Cutting Architecture

## 9.1 Purpose

This part defines architectural concerns that affect multiple or all areas of Academic OS.

Unlike feature-specific architecture, cross-cutting architecture provides shared rules, services, and conventions used throughout the application.

The objectives are to ensure that Academic OS has:

- Consistent behavior across modules
- Predictable error handling
- Consistent validation
- Centralized configuration
- Consistent logging
- Clear security boundaries
- Accessible user interfaces
- Reusable infrastructure
- Maintainable code
- Consistent user feedback
- Clear separation of responsibilities

---

## 9.2 Cross-Cutting Architecture Principles

### CC-001 — Shared Infrastructure

Common application concerns should be implemented through reusable infrastructure rather than independently inside every feature.

Examples include:

- Validation
- Error handling
- Notifications
- Logging
- Configuration
- Formatting
- Accessibility utilities

---

### CC-002 — Feature Independence

Feature modules should remain independently understandable.

A feature should use shared infrastructure without becoming tightly coupled to unrelated feature modules.

Preferred:

```text
Feature Module
      ↓
Shared Infrastructure
```

rather than:

```text
Feature A
      ↓
Feature B
      ↓
Feature C
```

---

### CC-003 — Single Responsibility

Each shared service should have a clearly defined responsibility.

For example:

```text
Validation Service
→ Validation

Notification Service
→ User notifications

Logging Service
→ Application diagnostics
```

Shared services should not become uncontrolled "utility" containers.

---

### CC-004 — Consistent Application Behavior

The same type of operation should behave consistently throughout Academic OS.

For example:

- Errors should follow a common presentation pattern.
- Confirmation dialogs should follow common conventions.
- Forms should use consistent validation behavior.
- Loading states should be represented consistently.

---

## 9.3 Application Error Handling

Academic OS should use a structured error-handling strategy.

Errors should be classified according to their origin and severity.

Potential categories:

```text
Validation Error
Persistence Error
Application Error
Network Error
AI Service Error
Import / Export Error
Backup / Restore Error
Unexpected Error
```

---

## 9.4 Error Handling Layers

Errors should be handled at the appropriate architectural layer.

```text
UI
 ↓
Application Layer
 ↓
Domain / Service Layer
 ↓
Repository
 ↓
Persistence
```

Lower layers should provide meaningful error information to higher layers.

The UI should decide how user-facing errors are presented.

---

## 9.5 User-Facing Errors

Technical implementation details should not normally be exposed directly to the user.

Avoid:

```text
DOMException: ConstraintError at IndexedDB transaction...
```

Prefer:

```text
Unable to save this subject.

Your data was not changed.
Please try again.
```

Technical details may still be recorded in diagnostics where appropriate.

---

## 9.6 Error Severity

Errors may be classified as:

### Informational

The operation completed with additional information.

### Warning

The operation can continue, but the user should be aware of a condition.

### Recoverable Error

The operation failed but the application remains usable.

### Critical Error

A major application operation failed and may require recovery.

---

## 9.7 Error Recovery

Where possible, errors should provide a recovery action.

Examples:

```text
Save failed
    ↓
[Retry]
```

or:

```text
Restore failed
    ↓
Existing data preserved
    ↓
[Try Again]
```

The application should avoid leaving users without a clear next step.

---

## 9.8 Unexpected Errors

Unexpected errors should be caught at an application-level boundary where practical.

The application should:

1. Prevent the interface from becoming unusable where possible.
2. Display a safe user-facing message.
3. Record diagnostic information where appropriate.
4. Provide a recovery or reload option when applicable.

---

## 9.9 Validation Architecture

Validation should be performed at appropriate boundaries.

Potential validation layers:

```text
UI Validation
      ↓
Application Validation
      ↓
Domain Validation
      ↓
Persistence Constraints
```

UI validation improves user experience, but should not be the only validation mechanism.

---

## 9.10 Form Validation

Forms should provide:

- Required-field validation
- Type validation
- Range validation
- Format validation
- Relationship validation where applicable

Validation feedback should appear close to the relevant field.

---

## 9.11 Domain Validation

Business rules should not exist only inside UI components.

For example:

```text
Grade
   ↓
Domain Validation
   ↓
Valid Grade
```

This allows the same rule to be used by:

- Forms
- Imports
- Restores
- Tests
- Future APIs

---

## 9.12 Validation Messages

Validation messages should be:

- Clear
- Specific
- Actionable
- Concise

Avoid vague messages such as:

```text
Invalid input.
```

Prefer:

```text
Credits must be greater than 0.
```

---

## 9.13 Shared Notification System

Academic OS should provide a consistent notification mechanism.

Possible notification types:

```text
Success
Info
Warning
Error
```

Examples:

```text
Subject saved successfully.
```

```text
Backup created successfully.
```

```text
Unable to restore backup.
```

---

## 9.14 Notification Behavior

Notifications should:

- Be visually consistent
- Avoid unnecessary interruption
- Remain readable
- Provide meaningful feedback
- Disappear automatically when appropriate

Critical messages may require explicit dismissal.

---

## 9.15 Confirmation Dialogs

Confirmation dialogs should be used for potentially destructive actions.

Examples:

- Delete subject
- Delete semester
- Delete notes
- Restore backup
- Clear data

They should clearly describe the consequence.

---

## 9.16 Loading States

Long-running operations should provide visible loading feedback.

Examples:

```text
Loading...
Saving...
Restoring...
Calculating...
Generating...
```

The application should avoid making users wonder whether an action was registered.

---

## 9.17 Disabled States

During operations that must not be duplicated, controls may be temporarily disabled.

For example:

```text
[Restoring...]
```

instead of allowing multiple restore operations simultaneously.

---

## 9.18 Configuration Architecture

Application-wide configuration should be centralized.

Potential configuration categories:

```text
Application Settings
Feature Flags
Environment Configuration
Storage Configuration
AI Configuration
Development Configuration
```

---

## 9.19 User Settings vs System Configuration

The architecture should distinguish:

### User Settings

Preferences controlled by the user.

Examples:

- Theme
- Language
- Display preferences
- Notification preferences

### System Configuration

Configuration required by the application.

Examples:

- Database schema version
- Application version
- Feature availability

These should not be mixed unnecessarily.

---

## 9.20 Environment Configuration

Environment-specific values should not be hard-coded throughout the application.

For example:

```text
Development
Production
Testing
```

may require different configuration.

---

## 9.21 Secrets

Sensitive secrets must not be stored directly in client-side source code.

If an external service requires credentials, the architecture must consider whether that service is appropriate for a local-first application.

Client-side applications cannot safely conceal secrets embedded in shipped frontend code.

---

## 9.22 AI Configuration Boundary

AI configuration should remain isolated from the rest of the application.

Conceptually:

```text
AI Feature
    ↓
AI Service
    ↓
Provider Adapter
    ↓
AI Provider
```

The rest of Academic OS should not depend directly on a specific AI provider.

This allows providers to be changed without rewriting unrelated features.

---

## 9.23 Logging Architecture

Academic OS should use structured application logging rather than scattered console statements throughout production code.

Potential levels:

```text
DEBUG
INFO
WARN
ERROR
```

---

## 9.24 Logging Rules

Logs should:

- Provide useful diagnostic context
- Avoid sensitive information
- Avoid unnecessary verbosity
- Be disabled or reduced appropriately in production
- Use consistent formatting

---

## 9.25 Sensitive Data in Logs

The application should not log:

- Passwords
- API keys
- Backup contents
- Personal academic records unnecessarily
- AI credentials
- Sensitive user-entered content unnecessarily

---

## 9.26 Development vs Production Logging

Development may use more detailed diagnostic information.

Production should prioritize:

```text
Useful
+
Minimal
+
Privacy-Aware
```

logging.

---

## 9.27 Monitoring

The MVP does not require a remote monitoring infrastructure.

Because Academic OS is primarily local-first and personal-use oriented, remote telemetry should not be a core architectural dependency.

Future monitoring capabilities may be considered if the product evolves into a broader platform.

---

## 9.28 Security Boundary

Academic OS should treat the browser environment as a security boundary.

The architecture should protect against:

- Untrusted input
- Malicious imported files
- Malformed backup files
- Unsafe external content
- Exposed credentials
- Accidental data disclosure

---

## 9.29 Input Sanitization

User-generated content should be treated as untrusted input.

This includes:

- Notes
- Titles
- Descriptions
- Resource metadata
- Imported data
- AI-generated content

Content must be safely rendered.

---

## 9.30 HTML and Script Injection

Academic OS should not insert arbitrary user-provided strings into the DOM as executable HTML.

Preferred:

```text
User Input
   ↓
Safe Rendering
```

rather than:

```text
User Input
   ↓
Raw HTML Injection
```

---

## 9.31 External Links

External links should be treated as untrusted destinations.

Where appropriate, links should:

- Use safe navigation behavior
- Be clearly identifiable
- Avoid executing unexpected content

---

## 9.32 File Handling

Uploaded or imported files should be treated as untrusted.

Validation should occur before processing.

This applies to:

- Backup files
- CSV files
- JSON files
- Documents
- Images
- Other future imported resources

---

## 9.33 Accessibility Architecture

Accessibility should be considered a cross-cutting concern rather than an optional feature.

The application should support:

- Keyboard navigation
- Visible focus states
- Semantic HTML
- Appropriate labels
- Accessible forms
- Readable contrast
- Meaningful error messages

---

## 9.34 Keyboard Navigation

Core workflows should be usable without requiring a mouse.

Examples:

```text
Navigate
Tab
Enter
Escape
Arrow Keys
```

where appropriate.

---

## 9.35 Focus Management

The application should maintain logical focus when:

- Opening dialogs
- Closing dialogs
- Submitting forms
- Displaying validation errors
- Changing views

---

## 9.36 Semantic Structure

The interface should use semantic elements where practical.

Examples:

```text
header
nav
main
section
form
button
label
```

This improves accessibility and maintainability.

---

## 9.37 Responsive Architecture

Academic OS should support different viewport sizes.

The architecture should not assume that the application will only be used on a single desktop resolution.

Primary support should include:

- Desktop
- Laptop
- Tablet
- Mobile-sized viewport where practical

---

## 9.38 Responsive Layout

Responsive behavior should be defined at the design-system level.

For example:

```text
Desktop
Sidebar + Main Content

Tablet
Compact Navigation + Main Content

Mobile
Navigation Drawer / Compact Navigation
```

Feature modules should reuse the common responsive patterns.

---

## 9.39 Design System

Academic OS should maintain a shared design system.

The design system should define:

- Typography
- Spacing
- Colors
- Borders
- Radius
- Shadows
- Buttons
- Inputs
- Cards
- Tables
- Dialogs
- Notifications

---

## 9.40 Component Consistency

Common components should be reused.

Examples:

```text
Button
Input
Select
Modal
Card
Table
Badge
Toast
Empty State
Loading State
```

This reduces visual and behavioral inconsistency.

---

## 9.41 Empty States

Feature modules should provide meaningful empty states.

Instead of:

```text
No data.
```

prefer:

```text
No subjects added yet.

Add your first subject to start
tracking your academic progress.
```

where appropriate.

---

## 9.42 Error States

Feature modules should use shared error-state patterns.

Example:

```text
Unable to load subjects.

[Retry]
```

---

## 9.43 Internationalization

The architecture should avoid hard-coding user-facing text throughout components.

This allows future internationalization.

The MVP may prioritize one language, but the architecture should avoid making future localization unnecessarily difficult.

---

## 9.44 Date and Number Formatting

Formatting should use shared utilities.

This includes:

- Dates
- Times
- GPA values
- Credits
- Percentages
- Currency if future features require it

---

## 9.45 Academic Formatting

Academic-specific formatting should be centralized where practical.

Examples:

```text
GPA: 3.52
Credits: 84
Progress: 66.7%
```

This prevents different modules from presenting the same information inconsistently.

---

## 9.46 Time and Date Handling

Academic OS should use consistent date/time handling.

The application should distinguish between:

```text
Date
Time
DateTime
Academic Period
```

where appropriate.

---

## 9.47 IDs and Entity Identity

Entity identifiers should be generated and managed consistently.

Feature modules should not invent incompatible ID strategies independently.

The application should use a shared identifier convention.

---

## 9.48 Data Transformation

Data transformation between layers should be explicit.

For example:

```text
Persistence Model
       ↓
Domain Model
       ↓
View Model
```

This prevents persistence-specific structures from leaking throughout the UI.

---

## 9.49 API Boundary

If Academic OS later introduces external APIs or backend services, communication should occur through defined service boundaries.

Feature modules should not make uncontrolled direct network requests.

Preferred:

```text
Feature
   ↓
Application Service
   ↓
API Client
```

---

## 9.50 Offline-First Behavior

Core Academic OS functionality should remain usable without network connectivity.

The local application should not require a network connection for:

- Viewing academic records
- Editing academic records
- Viewing planner data
- Viewing notes
- Viewing progress
- Using locally available analytics

---

## 9.51 Network Failure

When an optional external service is unavailable:

```text
Network Failure
      ↓
Local Functionality Continues
```

where technically possible.

This is particularly important for optional AI functionality.

---

## 9.52 AI Failure Isolation

AI failures should not break core Academic OS functionality.

For example:

```text
AI Service Unavailable
        ↓
AI Feature Unavailable
        ↓
Academic OS Continues Normally
```

---

## 9.53 AI Output Trust Boundary

AI-generated information should be treated as non-authoritative.

AI output should not silently modify authoritative academic records.

For example:

```text
AI Suggestion
      ↓
User Review
      ↓
Explicit User Action
      ↓
Persistent Data
```

rather than:

```text
AI Output
      ↓
Automatic Database Update
```

---

## 9.54 Feature Flags

Feature flags may be used for capabilities that are under development or optional.

Potential examples:

```text
AI Features
Experimental Analytics
Future Integrations
```

The MVP should avoid unnecessary feature-flag complexity.

---

## 9.55 Shared Utility Layer

A shared utility layer may contain small, genuinely reusable functions.

Examples:

- Date formatting
- Number formatting
- ID generation
- Validation helpers
- Safe parsing
- Common constants

It should not become a dumping ground for unrelated application logic.

---

## 9.56 Dependency Management

Dependencies should be kept minimal and justified.

Before adding a dependency, consider:

- Is the functionality necessary?
- Can existing platform APIs provide it?
- Does it increase bundle size?
- Does it introduce security risk?
- Does it increase maintenance burden?

---

## 9.57 Third-Party Dependency Boundary

Third-party libraries should be isolated where practical.

The application should avoid allowing a third-party library's API to spread unnecessarily throughout the codebase.

---

## 9.58 Performance Architecture

Performance should be considered across shared infrastructure.

Important areas include:

- Initial loading
- Database queries
- Rendering
- Large lists
- Analytics calculations
- Backup generation
- Restore operations

---

## 9.59 Lazy Loading

Feature modules that are not immediately required may be loaded lazily where beneficial.

The MVP should prioritize simplicity over premature optimization.

---

## 9.60 Large List Handling

Large datasets should not unnecessarily render every item simultaneously.

Where required, the application may use:

- Pagination
- Virtualization
- Incremental rendering

The appropriate strategy depends on actual dataset size.

---

## 9.61 Performance and Analytics

Analytics calculations should avoid unnecessary recalculation.

For example:

```text
Academic Data Changed
       ↓
Invalidate Relevant Derived Data
       ↓
Recalculate
```

rather than recalculating everything after every unrelated UI interaction.

---

## 9.62 Performance and Backup

Backup operations should avoid blocking the user interface unnecessarily.

For small personal datasets, a straightforward implementation is acceptable.

If backup size grows significantly, background processing may be introduced.

---

## 9.63 Performance and Restore

Restore operations should provide clear progress feedback where operations take noticeable time.

The UI should prevent accidental repeated restore actions.

---

## 9.64 State Consistency

Cross-cutting infrastructure must respect the state-management architecture defined in Part 6.

Shared services should not introduce hidden global state without architectural justification.

---

## 9.65 Event Architecture

Where events are required, the application should use a controlled event mechanism.

Examples:

```text
Subject Updated
      ↓
Invalidate Academic Progress

Grade Updated
      ↓
Recalculate GPA
```

Events should remain understandable and traceable.

---

## 9.66 Avoiding Event Coupling

The application should avoid creating chains of hidden event dependencies.

For example:

```text
A changes
 ↓
B event
 ↓
C event
 ↓
D event
 ↓
Unexpected UI change
```

When direct application-service coordination is clearer, it should be preferred.

---

## 9.67 Auditability

Important application operations should be traceable during development and debugging.

Examples:

- Data save
- Data deletion
- Backup
- Restore
- Migration
- AI request

This does not require a permanent audit log in the MVP.

---

## 9.68 Data Deletion

Destructive deletion should follow consistent rules.

For important entities:

```text
Delete Request
      ↓
Dependency Check
      ↓
Confirmation
      ↓
Delete
      ↓
Update Derived State
```

---

## 9.69 Dependency-Aware Deletion

If an entity is referenced elsewhere, the application should determine the correct behavior.

Example:

```text
Delete Semester
      ↓
Enrollments Exist
      ↓
Warn User
```

The system should not silently create broken references.

---

## 9.70 Migration Architecture

Database and application migrations should be versioned.

Conceptually:

```text
Current Schema
      ↓
Migration
      ↓
New Schema
```

Migrations should be deterministic and testable.

---

## 9.71 Migration Safety

A migration should:

- Validate assumptions
- Preserve data
- Avoid silent loss
- Be testable
- Fail safely where possible

---

## 9.72 Application Lifecycle

The application lifecycle should account for:

```text
Initialization
     ↓
Database Initialization
     ↓
Schema Validation / Migration
     ↓
Application State Initialization
     ↓
UI Ready
```

---

## 9.73 Initialization Failure

If initialization fails:

```text
Initialization Error
       ↓
Safe Error State
```

The application should avoid presenting an apparently functional interface backed by an unavailable or corrupted database.

---

## 9.74 Cross-Cutting Testing

Shared infrastructure must be tested independently where practical.

Testing should cover:

- Validation
- Error handling
- Notifications
- Persistence boundaries
- Migration
- Formatting
- Accessibility
- Security boundaries
- Backup/restore integration
- AI failure isolation

---

## 9.75 Architecture Rules

The following rules are mandatory:

1. Shared concerns should use reusable infrastructure.
2. Feature modules should remain independently understandable.
3. UI validation must not be the only validation layer.
4. User-facing errors must remain understandable.
5. Destructive operations require confirmation where appropriate.
6. Sensitive information must not be unnecessarily logged.
7. User input must be treated as untrusted.
8. Core functionality must remain usable without network connectivity.
9. AI failures must not break core functionality.
10. AI output must not silently modify authoritative academic data.
11. Secrets must not be embedded in client-side source code.
12. Shared components should follow the common design system.
13. Accessibility must be considered across the application.
14. Persistence details should not leak unnecessarily into the UI.
15. Third-party dependencies should be minimized and isolated where practical.
16. Shared utilities must not become a dumping ground for application logic.
17. Hidden global state should be avoided.
18. Migrations must be versioned and testable.
19. Destructive data operations must respect entity relationships.
20. Cross-cutting infrastructure must remain consistent with the architecture defined in previous parts.

---

## 9.76 MVP Scope

The R1 MVP should include:

- Centralized error handling
- Shared validation patterns
- Shared notification system
- Loading and error states
- Confirmation dialogs
- Centralized user settings
- Basic structured logging
- Safe input rendering
- Core accessibility practices
- Shared design-system components
- Responsive layout foundation
- Local-first/offline operation
- AI failure isolation
- Basic performance practices
- Versioned migration foundation
- Shared formatting utilities
- Consistent entity ID strategy

---

## 9.77 Features Outside MVP

The following should remain future considerations unless requirements change:

- Remote monitoring infrastructure
- Advanced telemetry
- Complex event-bus architecture
- Automatic performance optimization
- Multi-device synchronization
- Enterprise authentication
- Advanced localization
- Distributed backend infrastructure
- Advanced security infrastructure

---

## 9.78 Cross-Cutting Architecture Diagram

```text
                         ┌─────────────────────┐
                         │     Academic OS     │
                         └──────────┬──────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        ↓                           ↓                           ↓
┌───────────────┐           ┌────────────────┐          ┌────────────────┐
│ Feature       │           │ Shared         │          │ Persistence    │
│ Modules       │──────────→│ Infrastructure │←────────→│ Layer          │
└───────────────┘           └───────┬────────┘          └────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ↓                         ↓                         ↓
    Validation                 Error Handling             Logging
          │                         │                         │
          ↓                         ↓                         ↓
    Notifications              Security                Configuration
          │                         │                         │
          ↓                         ↓                         ↓
    Accessibility              Formatting              Design System
          │                         │                         │
          └─────────────────────────┼─────────────────────────┘
                                    ↓
                              Application State
```

---

## 9.79 Part 9 Completion Criteria

Part 9 is considered complete when:

- Shared infrastructure responsibilities are defined.
- Error-handling architecture is defined.
- Validation architecture is defined.
- Notification behavior is defined.
- Loading and confirmation behavior is defined.
- Configuration boundaries are defined.
- Secret-handling rules are defined.
- Logging architecture is defined.
- Privacy-aware logging rules are defined.
- Security boundaries are defined.
- Input handling rules are defined.
- Accessibility architecture is defined.
- Responsive architecture is defined.
- Design-system responsibilities are defined.
- Formatting conventions are defined.
- Entity identity rules are defined.
- API boundaries are defined.
- Offline-first behavior is defined.
- AI failure isolation is defined.
- AI trust boundaries are defined.
- Dependency-management rules are defined.
- Performance principles are defined.
- Event architecture is defined.
- Deletion rules are defined.
- Migration architecture is defined.
- Application lifecycle is defined.
- Cross-cutting testing requirements are defined.
- MVP scope is defined.
- Future scope is separated from MVP.

# Document 02 — System Architecture & Technical Design

# Part 10 — Analytics Architecture

## 10.1 Purpose

This part defines the architecture for calculating, presenting, and maintaining academic analytics within Academic OS.

The purpose of the Analytics Architecture is to transform authoritative academic data into meaningful indicators that help the user understand:

- Academic progress
- Credit completion
- GPA performance
- Semester performance
- Subject performance
- Program completion progress
- Academic trends
- Goals and milestones
- Areas requiring attention

Analytics are intended to support the Academic OS dashboard and decision-making workflows.

The analytics system must remain derived from authoritative data and must not become an independent source of truth.

---

## 10.2 Analytics Principles

### AN-001 — Authoritative Data First

Analytics must be calculated from authoritative application data.

Conceptually:

```text
Academic Records
      ↓
Analytics Engine
      ↓
Derived Metrics
      ↓
Dashboard
```

The dashboard should not independently maintain academic values.

---

### AN-002 — Derived Data Is Recalculable

Analytics should be reproducible from stored academic data.

For example:

```text
Grades
+
Credits
+
Academic Rules
      ↓
GPA
```

If an analytics value is deleted or becomes stale, it should be possible to calculate it again.

---

### AN-003 — No Duplicate Source of Truth

Academic OS should avoid maintaining separate manually editable copies of:

- GPA
- Completed credits
- Remaining credits
- Completion percentage
- Semester averages

These should be derived from authoritative records where possible.

---

### AN-004 — Explainable Metrics

Academic metrics should be understandable to the user.

For example:

```text
GPA: 3.52

Calculated from:
84 completed credits
```

The user should be able to understand where important values originate.

---

### AN-005 — Consistent Calculations

The same metric should produce the same result throughout the application.

For example, GPA displayed on:

```text
Dashboard
Academic Overview
Semester Detail
Progress Page
```

should use the same calculation rules.

---

### AN-006 — Analytics Should Support Decisions

Analytics should provide useful information rather than simply maximizing the number of charts.

A metric should exist because it helps the user understand or act on their academic progress.

---

## 10.3 Analytics Categories

Academic OS analytics should be organized into categories.

### Core Categories

```text
Academic Overview
Credit Progress
GPA Performance
Semester Performance
Subject Performance
Program Completion
Academic Trends
Goals & Milestones
```

Future analytics may include:

```text
Study Patterns
Time Management
Career Progress
Learning Analytics
Predictive Analytics
```

These should not automatically become MVP requirements.

---

## 10.4 Academic Overview

The dashboard should provide a concise academic overview.

Potential indicators include:

```text
Current GPA
Completed Credits
Remaining Credits
Completion Percentage
Current Semester
Current Academic Standing
```

The exact metrics displayed should follow the product requirements defined in the PRD.

---

## 10.5 Credit Progress

Credit progress should be calculated from authoritative enrollment and completion data.

Conceptually:

```text
Completed Credits
        ÷
Required Credits
        × 100
        =
Completion Percentage
```

The system should distinguish between:

```text
Completed Credits
Attempted Credits
Required Credits
Remaining Credits
```

where applicable.

---

## 10.6 Credit Completion

Credit completion should account for the program requirements.

Example:

```text
Required Credits: 126
Completed Credits: 84

Remaining:
42 Credits
```

The calculation should use the program's authoritative credit requirements.

---

## 10.7 GPA Architecture

GPA should be calculated through a centralized academic calculation service.

Conceptually:

```text
Grades
   +
Credits
   +
Grade Rules
   ↓
GPA Calculation Service
   ↓
GPA
```

Feature modules should not implement their own GPA formulas independently.

---

## 10.8 GPA Calculation Rules

The GPA engine should support the academic grading model defined by the user's program.

The architecture should allow:

- Letter grades
- Numeric grades
- Grade points
- Credit-weighted calculations
- Excluded or non-GPA courses where applicable

The exact institutional grading rules should be configurable rather than hard-coded throughout the UI.

---

## 10.9 GPA Precision

The internal calculation should retain sufficient precision.

Display precision should be handled separately.

For example:

```text
Internal:
3.5246875

Display:
3.52
```

The displayed value should not necessarily become the stored calculation source.

---

## 10.10 Semester GPA

Semester GPA should be calculated independently from cumulative GPA.

Conceptually:

```text
Semester Grades
      +
Semester Credits
      ↓
Semester GPA
```

This enables comparisons between semesters.

---

## 10.11 Cumulative GPA

Cumulative GPA should be calculated from all relevant completed academic records.

Conceptually:

```text
All Relevant Grades
       +
All Relevant Credits
       ↓
Cumulative GPA
```

The system should avoid averaging semester GPAs directly when credit weighting is required.

---

## 10.12 GPA Trend

Academic OS may visualize GPA changes over time.

Example:

```text
Semester 1 → 3.20
Semester 2 → 3.38
Semester 3 → 3.52
Semester 4 → 3.61
```

This can be presented as a line or bar visualization.

---

## 10.13 Credit Trend

Credit accumulation may also be visualized.

Example:

```text
Semester 1 → 18
Semester 2 → 36
Semester 3 → 54
Semester 4 → 72
```

This helps the user understand academic progression over time.

---

## 10.14 Semester Analytics

Each semester may provide:

- Semester GPA
- Credits completed
- Credits attempted
- Number of subjects
- Passed subjects
- Failed subjects
- Average grade
- Academic goals
- Semester status

The exact set should remain aligned with the product requirements.

---

## 10.15 Subject Analytics

Subject-level analytics may include:

- Grade
- Grade point
- Credits
- Completion status
- Subject category
- Prerequisite status
- Performance classification

Subject analytics should remain descriptive rather than pretending to predict outcomes without sufficient evidence.

---

## 10.16 Subject Performance Classification

Academic OS may classify subject performance using configurable thresholds.

For example:

```text
Excellent
Good
Average
Needs Attention
```

Thresholds should be configurable and clearly documented.

The system should avoid presenting subjective classifications as objective facts.

---

## 10.17 Program Completion

Program completion should combine:

```text
Completed Credits
+
Program Requirements
+
Required Courses
```

to estimate progress toward graduation.

Conceptually:

```text
Program Requirements
        ↓
Requirement Engine
        ↓
Completion Status
        ↓
Progress Dashboard
```

---

## 10.18 Requirement Categories

The requirement architecture may support:

```text
General Education
Major Requirements
Electives
Required Electives
Other Program Requirements
```

The exact categories depend on the user's curriculum.

---

## 10.19 Requirement Completion

The system should distinguish between:

```text
Completed
In Progress
Planned
Remaining
```

This allows the dashboard to provide a more accurate picture than simply counting all enrolled courses.

---

## 10.20 Remaining Requirements

The dashboard may display:

```text
Remaining:
3 Required Subjects
9 Credits
```

This should be derived from the program requirement model.

---

## 10.21 Graduation Progress

Graduation progress may combine multiple conditions.

For example:

```text
Credit Requirement
        +
Required Subjects
        +
Other Program Requirements
        ↓
Graduation Progress
```

The system should avoid reducing graduation eligibility to credits alone if other requirements exist.

---

## 10.22 Academic Goals

Analytics should support user-defined academic goals.

Examples:

```text
Target GPA: 3.60
Target Credits: 100
Target Graduation Semester: Semester 8
```

The system can compare current state with user-defined targets.

---

## 10.23 Goal Progress

Goal progress should be calculated separately from authoritative academic records.

Conceptually:

```text
Current Metric
      +
User Goal
      ↓
Goal Progress
```

Goals themselves are user-controlled data.

---

## 10.24 Goal Status

Potential goal states:

```text
Not Started
In Progress
On Track
At Risk
Completed
```

The criteria for these states should be transparent.

---

## 10.25 Milestones

The application may define milestones such as:

```text
25% Credits Completed
50% Credits Completed
75% Credits Completed
100% Credits Completed
```

Milestones should be derived rather than manually maintained.

---

## 10.26 Trend Analysis

Trend analytics should identify changes over time.

Examples:

```text
GPA Increasing
GPA Stable
GPA Decreasing
```

Trend calculations should use sufficient historical data.

If insufficient data exists, the system should communicate that clearly.

---

## 10.27 Insufficient Data

Analytics should not fabricate conclusions when insufficient data exists.

Example:

```text
Only one semester available.

A meaningful GPA trend cannot yet be calculated.
```

This is preferable to presenting a misleading trend.

---

## 10.28 Analytics Confidence

Simple descriptive metrics generally do not require a confidence score.

However, future predictive analytics should communicate uncertainty where appropriate.

Predictive analytics must not present uncertain estimates as guaranteed outcomes.

---

## 10.29 Predictive Analytics

Predictive academic features are outside the initial analytics scope.

Potential future examples:

```text
Estimated GPA
Graduation Risk
Course Outcome Prediction
Academic Performance Forecast
```

These should require additional validation before being introduced.

---

## 10.30 Analytics Engine

Analytics calculations should be centralized.

Conceptually:

```text
Academic Data
      ↓
Analytics Engine
      ├── GPA
      ├── Credits
      ├── Progress
      ├── Semester Metrics
      ├── Trends
      └── Goals
```

---

## 10.31 Analytics Services

The analytics layer may contain services such as:

```text
GPA Service
Credit Progress Service
Semester Analytics Service
Requirement Progress Service
Goal Analytics Service
Trend Service
```

These services should use shared domain rules rather than duplicating business logic.

---

## 10.32 Calculation Dependencies

Analytics calculations may depend on:

```text
Subjects
Enrollments
Grades
Semesters
Programs
Requirements
Goals
```

The dependency structure should remain explicit.

---

## 10.33 Analytics Recalculation

Analytics should be recalculated when relevant authoritative data changes.

For example:

```text
Grade Updated
      ↓
Invalidate GPA
      ↓
Recalculate GPA
      ↓
Update Dashboard
```

Unrelated changes should not require complete analytics recalculation.

---

## 10.34 Derived State

Some analytics values may be represented as derived runtime state.

Example:

```text
Academic Data
      ↓
Derived Analytics State
      ↓
Dashboard
```

Derived state should be invalidated and rebuilt when source data changes.

---

## 10.35 Cached Analytics

Analytics may be cached if calculation cost becomes meaningful.

However:

```text
Cache ≠ Source of Truth
```

If cached analytics become stale, they must be safely rebuildable from authoritative data.

---

## 10.36 Analytics Cache Invalidation

Where caching is used:

```text
Source Data Changed
      ↓
Invalidate Relevant Cache
      ↓
Recalculate
      ↓
Store New Derived Result
```

The MVP should avoid unnecessary caching complexity.

---

## 10.37 Dashboard Data Flow

The primary dashboard flow is:

```text
IndexedDB
    ↓
Repositories
    ↓
Domain / Academic Services
    ↓
Analytics Engine
    ↓
Derived Metrics
    ↓
Dashboard View Model
    ↓
UI Components
```

---

## 10.38 Dashboard Independence

The dashboard should not directly query raw IndexedDB data for calculations.

Preferred:

```text
Dashboard
   ↓
Analytics Service
   ↓
Domain / Repository
   ↓
Persistence
```

This keeps calculation rules centralized.

---

## 10.39 Analytics View Models

Analytics should be transformed into UI-oriented structures where useful.

Example:

```text
Analytics Result
      ↓
Dashboard View Model
      ↓
GPA Card
Credit Progress Card
Trend Chart
```

This prevents UI components from implementing calculation logic.

---

## 10.40 Visualization Architecture

Visualizations should be treated as presentation of analytics rather than analytics themselves.

For example:

```text
GPA Data
   ↓
Chart Component
```

The chart should not calculate GPA.

---

## 10.41 Chart Types

Possible visualizations include:

### KPI Cards

For:

- GPA
- Credits
- Completion

### Progress Bars

For:

- Program completion
- Credit progress
- Goal progress

### Line Charts

For:

- GPA trend
- Credit accumulation

### Bar Charts

For:

- Semester GPA
- Subject performance

The exact chart selection should depend on usability rather than the desire to include every possible chart type.

---

## 10.42 Visualization Accessibility

Charts should not be the only way to understand important information.

For example:

```text
GPA Trend Chart

Semester 1: 3.20
Semester 2: 3.38
Semester 3: 3.52
```

The underlying data should remain accessible in text or tabular form.

---

## 10.43 Color Usage

Color should not be the sole indicator of academic status.

For example:

```text
Green = Good
Red = Poor
```

should be accompanied by:

```text
On Track
Needs Attention
```

or another meaningful label.

---

## 10.44 Dashboard Priority

The dashboard should prioritize high-value metrics.

Recommended hierarchy:

```text
1. Current Academic Status
2. GPA
3. Credit Progress
4. Current Semester
5. Program Completion
6. Recent Trends
7. Goals
8. Secondary Analytics
```

The exact layout remains a UI concern, but the analytics layer should provide data in a form that supports this hierarchy.

---

## 10.45 Analytics Filtering

Future analytics may support filtering by:

- Semester
- Academic year
- Subject category
- Course type
- Requirement category

Filtering should be performed through analytics services rather than duplicated inside each visualization.

---

## 10.46 Comparison Analytics

The system may support comparisons such as:

```text
Current Semester
vs
Previous Semester
```

or:

```text
Current GPA
vs
Target GPA
```

Comparisons should use clearly defined reference points.

---

## 10.47 Academic Alerts

Analytics may generate informational alerts when meaningful conditions occur.

Examples:

```text
Your GPA is below your target.
```

```text
You have 9 credits remaining.
```

```text
Your GPA increased compared with the previous semester.
```

These should be informational rather than punitive.

---

## 10.48 Alert Rules

Alert rules should be centralized and configurable.

They should not be hard-coded independently into dashboard components.

---

## 10.49 Avoiding Notification Overload

Academic OS should avoid generating excessive alerts.

The dashboard should prioritize:

- Important
- Actionable
- Relevant

information.

---

## 10.50 Analytics and Privacy

Analytics should primarily operate on local data.

The MVP should not require sending academic records to external analytics services.

---

## 10.51 Remote Analytics

Remote telemetry about academic performance is outside the MVP.

If future versions introduce remote analytics, explicit privacy requirements must be defined.

---

## 10.52 AI and Analytics

AI may eventually provide explanations or recommendations based on analytics.

However:

```text
Analytics Engine
      ↓
Authoritative Metrics
      ↓
AI Explanation
```

AI should not replace the analytics engine.

For example:

```text
Analytics:
GPA = 3.52

AI:
"Your GPA has increased compared with the previous semester."
```

The AI should consume the calculated metric rather than independently calculating it.

---

## 10.53 AI Analytics Trust Boundary

AI-generated recommendations should remain non-authoritative.

Preferred:

```text
Analytics
   ↓
AI Recommendation
   ↓
User Review
```

rather than:

```text
AI
   ↓
Automatic Academic Decision
```

---

## 10.54 Analytics and Backup

Authoritative academic data must be included in backups according to Part 8.

Derived analytics should generally be recalculable after restoration.

Therefore:

```text
Backup
   ↓
Academic Data
   ↓
Restore
   ↓
Analytics Recalculation
```

---

## 10.55 Analytics and Migration

When the academic schema changes:

```text
Migration
   ↓
Current Academic Data
   ↓
Analytics Recalculation
```

Analytics should be recalculated using the new schema rather than blindly restoring obsolete derived values.

---

## 10.56 Analytics Testing

Analytics calculations require deterministic tests.

Important test cases include:

- GPA calculation
- Credit calculation
- Completion percentage
- Semester GPA
- Cumulative GPA
- Requirement completion
- Goal progress
- Trend calculations
- Edge cases
- Empty datasets
- Missing values
- Repeated calculations

---

## 10.57 GPA Test Example

Example:

```text
Subject A:
3 credits × 4.0

Subject B:
3 credits × 3.0

GPA:
(3×4.0 + 3×3.0) / 6
= 3.50
```

The calculation engine should produce the expected result.

---

## 10.58 Empty Dataset

When no academic data exists:

```text
GPA:
Not available

Progress:
Not available
```

The system should not display:

```text
0.00 GPA
```

unless zero is explicitly meaningful in the academic model.

---

## 10.59 Partial Dataset

If academic information is incomplete, analytics should clearly indicate limitations.

Example:

```text
Some grades are missing.

GPA may be incomplete.
```

---

## 10.60 Invalid Data

Invalid academic records should not silently produce misleading analytics.

The analytics layer should either:

- Reject invalid input
- Exclude it according to defined rules
- Report that the calculation cannot be completed

The behavior must be deterministic and documented.

---

## 10.61 Performance Requirements

The MVP should prioritize correctness and maintainability.

For expected personal academic datasets, analytics should calculate quickly enough for normal interactive use.

Advanced optimization should only be introduced when actual performance data indicates a need.

---

## 10.62 Analytics Architecture Diagram

```text
                    ┌───────────────────────┐
                    │    Academic Data      │
                    │ Subjects / Grades /   │
                    │ Semesters / Programs  │
                    └───────────┬───────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │   Domain Services     │
                    └───────────┬───────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │   Analytics Engine    │
                    ├───────────────────────┤
                    │ GPA                   │
                    │ Credit Progress       │
                    │ Semester Metrics      │
                    │ Requirements          │
                    │ Goals                 │
                    │ Trends                │
                    └───────────┬───────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │ Derived Metrics       │
                    └───────────┬───────────┘
                                │
                                ↓
                    ┌───────────────────────┐
                    │ Dashboard View Model  │
                    └───────────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    ↓                       ↓
              KPI Components          Visualizations
                    │                       │
                    └───────────┬───────────┘
                                ↓
                         Academic Dashboard
```

---

## 10.63 Analytics Architecture Rules

The following rules are mandatory:

1. Analytics must be derived from authoritative academic data.
2. Analytics must not become an independent source of truth.
3. GPA calculations must be centralized.
4. Credit calculations must be centralized.
5. Program completion must use program requirements.
6. Derived metrics must be recalculable.
7. Cached analytics must never become authoritative.
8. Dashboard components must not independently calculate academic metrics.
9. Analytics should recalculate when relevant source data changes.
10. Unrelated UI changes should not trigger unnecessary analytics recalculation.
11. Analytics should not fabricate conclusions from insufficient data.
12. Visualizations must not be the only representation of important information.
13. Color must not be the sole indicator of status.
14. Remote academic analytics are outside the MVP.
15. AI must consume authoritative analytics rather than replace the analytics engine.
16. AI-generated recommendations remain non-authoritative.
17. Analytics should remain primarily local-first.
18. Analytics must be recalculated after relevant data migration or restore.
19. Analytics calculations must be deterministic and testable.
20. The analytics architecture should prioritize useful insights over excessive metrics.

---

## 10.64 MVP Scope

The R1 MVP should include:

- Current GPA
- Semester GPA
- Completed credits
- Remaining credits
- Credit completion percentage
- Program completion progress
- Semester-level performance
- Basic GPA trend
- Basic credit trend
- Goal progress
- Dashboard KPI metrics
- Basic progress visualizations
- Centralized calculation services
- Deterministic analytics tests
- Local-first analytics
- Recalculation after data changes
- Recalculation after restore
- Basic empty and incomplete-data handling

---

## 10.65 Features Outside MVP

The following should remain future considerations:

- Predictive GPA models
- Graduation-risk prediction
- Course outcome prediction
- Advanced learning analytics
- Time-series forecasting
- Remote academic analytics
- AI-generated predictive academic decisions
- Complex anomaly detection
- Advanced personalized recommendation engines
- Cross-user benchmarking

---

## 10.66 Analytics Acceptance Criteria

Part 10 is considered complete when:

- The source of truth for analytics is defined.
- Derived-data principles are defined.
- GPA architecture is defined.
- Credit-progress architecture is defined.
- Program-completion architecture is defined.
- Semester analytics are defined.
- Subject analytics are defined.
- Goal analytics are defined.
- Trend analytics are defined.
- Insufficient-data handling is defined.
- Analytics recalculation behavior is defined.
- Cache behavior is defined.
- Dashboard data flow is defined.
- Visualization responsibilities are defined.
- Accessibility requirements for analytics are defined.
- Analytics privacy boundaries are defined.
- AI analytics boundaries are defined.
- Backup/restore interaction is defined.
- Migration interaction is defined.
- Testing requirements are defined.
- MVP analytics scope is defined.                                                        
- Future analytics capabilities are separated from MVP.

# Document 02 — System Architecture & Technical Design

# Part 11 — AI Architecture

## 11.1 Purpose

This part defines the architecture, boundaries, responsibilities, and safety rules for Artificial Intelligence features within Academic OS.

AI is considered an optional enhancement to Academic OS.

The core academic-management functionality must remain usable without AI.

The purpose of AI within Academic OS is to assist the user with tasks such as:

- Explaining academic information
- Summarizing academic progress
- Providing suggestions
- Helping interpret analytics
- Assisting with planning
- Supporting natural-language interaction where appropriate

AI must not replace deterministic application logic, authoritative academic data, or user decision-making.

---

## 11.2 AI Architecture Principles

### AI-001 — AI Is Optional

Academic OS must not require AI for core functionality.

Core features must continue to work when:

- No AI provider is configured
- The AI provider is unavailable
- The user disables AI
- The device is offline
- An AI request fails
- An AI response is rejected

---

### AI-002 — AI Is Not the Source of Truth

AI must never become the authoritative source for:

- GPA
- Credits
- Course completion
- Graduation requirements
- Academic records
- Stored grades
- Program requirements

These values must come from the deterministic academic and analytics systems.

---

### AI-003 — Deterministic Logic First

If a task can be performed reliably using deterministic application logic, AI should not replace it.

For example:

```text
Calculate GPA
        ↓
Analytics Engine
```

not:

```text
Calculate GPA
        ↓
AI Model
```

---

### AI-004 — Human-in-the-Loop

AI-generated recommendations, interpretations, and suggestions should remain subject to user review.

Conceptually:

```text
Academic Data
      ↓
Analytics / Domain Logic
      ↓
AI Assistance
      ↓
User Review
      ↓
Optional User Action
```

---

### AI-005 — Provider Independence

The application should not become tightly coupled to one AI provider.

The architecture should use an abstraction layer between Academic OS and external AI providers.

Conceptually:

```text
Academic OS
     ↓
AI Service
     ↓
Provider Adapter
     ↓
AI Provider
```

This allows providers to be changed without rewriting the application's AI-consuming features.

---

## 11.3 AI Feature Categories

AI capabilities may be divided into several categories.

### Category A — Explanation

AI explains information that has already been calculated.

Example:

```text
Analytics:
GPA increased from 3.38 → 3.52

AI:
Explain what this change means.
```

---

### Category B — Summarization

AI summarizes existing academic information.

Examples:

- Semester summary
- Academic progress summary
- Notes summary
- Study-plan summary

---

### Category C — Recommendation

AI may provide suggestions based on authoritative information.

Examples:

- Planning suggestions
- Study recommendations
- Subject prioritization suggestions

Recommendations must remain non-authoritative.

---

### Category D — Natural Language Interaction

Future versions may allow users to ask questions such as:

```text
"How many credits do I have left?"

"How has my GPA changed?"

"What should I focus on this semester?"
```

The AI system should use authoritative application data when answering factual questions.

---

## 11.4 AI and Academic Data

AI requests involving academic data should follow a controlled data flow.

```text
Academic Database
       ↓
Relevant Data Selection
       ↓
Data Minimization
       ↓
AI Request
       ↓
AI Response
       ↓
Validation / Safety Checks
       ↓
User
```

The application should avoid sending unnecessary academic data to an AI provider.

---

## 11.5 Data Minimization

Only information necessary for an AI task should be included in a request.

For example, if the user asks:

```text
"Explain my GPA trend."
```

the AI request may only need:

```text
Semester
GPA
```

It should not automatically receive the user's entire academic database.

---

## 11.6 Sensitive Data Boundary

Academic OS should treat academic records as private user data.

The AI architecture should minimize exposure of:

- Student information
- Academic records
- Grades
- Personal notes
- Identifying information
- Other private user content

The system should avoid transmitting unnecessary information to external providers.

---

## 11.7 Local AI

Local AI models may be considered when technically practical.

Potential advantages include:

- Improved privacy
- Offline operation
- No external data transmission
- Greater user control

However, local AI should not be required for the MVP unless the technical requirements and available hardware make it practical.

---

## 11.8 External AI Providers

External AI providers may be used for optional AI features.

However, the architecture should assume that external providers may:

- Require network connectivity
- Have usage limits
- Become unavailable
- Change APIs
- Change pricing
- Change model behavior
- Produce incorrect results

Academic OS must therefore remain functional without them.

---

## 11.9 Provider Adapter

Each provider should be accessed through an adapter.

Conceptually:

```text
AI Service
    ↓
Provider Interface
    ├── Provider A Adapter
    ├── Provider B Adapter
    └── Local Model Adapter
```

The rest of the application should depend on the provider interface rather than a provider-specific SDK.

---

## 11.10 AI Service

The AI Service provides a stable application-level interface.

Potential responsibilities include:

- Request construction
- Provider selection
- Prompt management
- Response handling
- Error handling
- Timeout handling
- Retry policy
- Privacy filtering
- Usage tracking where appropriate

---

## 11.11 Prompt Management

Prompts should be treated as application configuration rather than being scattered throughout UI components.

For example:

```text
AI Prompt Templates
        ↓
AI Service
        ↓
Provider
```

This makes prompts easier to:

- Review
- Test
- Version
- Update

---

## 11.12 Prompt Context

AI requests should provide only the context required for the requested task.

Context should be structured where practical.

Example:

```text
Task:
Explain GPA trend

Context:
Semester 1: 3.20
Semester 2: 3.38
Semester 3: 3.52
```

rather than sending an unstructured database dump.

---

## 11.13 Structured AI Requests

Where practical, AI requests should use structured inputs.

Example:

```text
{
  task: "explain_gpa_trend",
  data: [
    { semester: 1, gpa: 3.20 },
    { semester: 2, gpa: 3.38 },
    { semester: 3, gpa: 3.52 }
  ]
}
```

This reduces ambiguity and improves reproducibility.

---

## 11.14 Structured AI Responses

Where practical, AI responses should use structured output.

For example:

```text
{
  summary: "...",
  observations: [
    "...",
    "..."
  ],
  suggestions: [
    "..."
  ]
}
```

The exact schema depends on the feature.

---

## 11.15 Response Validation

AI output should be validated before being used by the application.

Validation may include:

- Required fields
- Data types
- Length limits
- Allowed values
- Schema compliance

Invalid AI responses should not be treated as successful results.

---

## 11.16 Hallucination Handling

AI responses may contain incorrect or fabricated information.

Academic OS should therefore distinguish between:

```text
Authoritative Data
```

and:

```text
AI-Generated Interpretation
```

The UI should make this distinction clear where appropriate.

---

## 11.17 Factual Verification

When AI answers factual questions about the user's academic state, authoritative application data should take precedence.

Example:

```text
Application:
Completed Credits = 84

AI:
"You have completed approximately 80 credits."
```

The application should not blindly display the AI value.

The authoritative value remains:

```text
84 Credits
```

---

## 11.18 AI Calculations

AI should not independently calculate authoritative academic metrics when deterministic calculations are available.

For example:

```text
Application:
GPA = 3.52

AI:
"Your GPA is 3.52."
```

The AI is interpreting the authoritative metric rather than generating it.

---

## 11.19 AI Recommendations

Recommendations should be presented as suggestions.

Example:

```text
Suggestion:

You may want to prioritize subjects that contribute
toward your remaining graduation requirements.
```

The application should avoid presenting recommendations as mandatory decisions.

---

## 11.20 User Approval

AI-generated changes that affect persistent data should require explicit user action.

Preferred:

```text
AI Suggestion
      ↓
Review
      ↓
[Apply]
```

Not:

```text
AI Suggestion
      ↓
Automatic Database Update
```

---

## 11.21 AI-Generated Academic Plans

If AI helps generate an academic plan:

```text
Current Academic Data
        ↓
Requirements
        ↓
AI Planning Assistance
        ↓
Suggested Plan
        ↓
User Review
        ↓
User Approval
        ↓
Saved Plan
```

The AI-generated plan should not automatically overwrite the user's existing plan.

---

## 11.22 AI and Analytics

The Analytics Engine remains authoritative.

The relationship is:

```text
Academic Data
      ↓
Analytics Engine
      ↓
Authoritative Metrics
      ↓
AI
      ↓
Explanation / Recommendation
```

AI should consume analytics rather than replace them.

---

## 11.23 AI and Dashboard

AI may provide optional dashboard assistance.

Examples:

- "Explain my progress"
- "Summarize this semester"
- "What should I focus on?"
- "Explain this trend"

The dashboard must remain fully useful without these capabilities.

---

## 11.24 AI Availability States

The UI should distinguish between AI states.

Potential states:

```text
Available
Unavailable
Disabled
Loading
Rate Limited
Error
Not Configured
```

---

## 11.25 AI Failure Handling

If an AI request fails:

```text
AI Request
    ↓
Failure
    ↓
User-Friendly Error
    ↓
Core Application Continues
```

The application should not become unusable.

---

## 11.26 Retry Behavior

AI requests may use limited retries for transient failures.

The system should avoid aggressive automatic retries that could:

- Waste API usage
- Increase latency
- Duplicate requests
- Increase costs

---

## 11.27 Timeout Handling

AI requests should have reasonable timeouts.

If the provider does not respond:

```text
Timeout
   ↓
Cancel / Fail Safely
   ↓
Application Continues
```

---

## 11.28 Rate Limits

External providers may impose rate limits.

Academic OS should handle rate-limit responses gracefully.

Example:

```text
AI usage limit reached.

You can continue using Academic OS normally.
```

---

## 11.29 AI Usage Tracking

If usage tracking is implemented, it should primarily serve:

- Debugging
- User awareness
- Provider limits
- Cost control

It should not require sending additional academic data to a remote analytics service.

---

## 11.30 AI Privacy Controls

Users should be able to control whether AI features are enabled.

Potential settings:

```text
AI Enabled
AI Disabled
```

Future versions may provide more granular controls.

---

## 11.31 Provider Selection

Provider selection should be configurable.

Potential strategies include:

```text
User Selected Provider
Default Provider
Local Model
No AI
```

The MVP should avoid unnecessary provider-management complexity.

---

## 11.32 Free and Reliable AI Models

The architecture should allow the use of free or low-cost AI providers where appropriate.

However, "free" must not automatically be treated as "safe" or "reliable."

Provider selection should consider:

- Privacy
- Reliability
- Availability
- Model quality
- Rate limits
- Data handling policies
- Cost
- Technical compatibility

---

## 11.33 AI Provider Evaluation

Before integrating an AI provider, Academic OS should evaluate:

```text
Privacy
+
Reliability
+
Quality
+
Availability
+
Cost
+
Integration Complexity
```

No provider should be permanently assumed to be the only solution.

---

## 11.34 API Key Security

API credentials must not be embedded directly in public frontend source code.

If direct client-side API access is used, the security and exposure implications must be explicitly accepted.

For stronger protection, a controlled backend or local execution model may be considered in future architecture.

---

## 11.35 MVP AI Strategy

The MVP should use AI conservatively.

Recommended R1 approach:

```text
Core Academic OS
       ↓
Fully Functional
       │
       └── Optional AI Layer
                 ↓
          Explanation / Assistance
```

AI should not be required to demonstrate the success of the MVP.

---

## 11.36 AI Feature Priorities

### P1 — Potential MVP AI

- Explain academic progress
- Summarize semester performance
- Explain analytics
- Provide simple planning suggestions

### P2 — Future

- Natural-language academic assistant
- AI-assisted study planning
- AI-assisted goal planning

### P3 — Future

- Advanced personalized recommendations
- Predictive academic insights
- Long-term academic forecasting

### P4 — Experimental

- Autonomous academic planning
- Automated decision-making
- Highly personalized AI agents

---

## 11.37 AI and Offline Operation

AI features may require network access if external providers are used.

Therefore:

```text
Offline
  ↓
Core Academic OS → Available
AI Features       → Optional / Unavailable
```

If a local model is available, AI functionality may continue offline.

---

## 11.38 AI Data Retention

Academic OS should minimize retention of AI request and response data.

Unless explicitly required by a feature, AI interactions should not become a permanent copy of the user's academic data.

---

## 11.39 AI Conversation History

Persistent AI conversation history is not required for the MVP.

If introduced later, it should have explicit:

- Storage rules
- Deletion rules
- Privacy controls
- Backup rules

---

## 11.40 AI and Backup

AI conversation history should not automatically be included in academic backups unless the user explicitly chooses to preserve it.

Authoritative academic records remain the primary backup concern.

---

## 11.41 AI and Migration

Changes to AI configuration or schemas should be versioned where persistent AI-related data exists.

The MVP should minimize persistent AI-specific storage.

---

## 11.42 AI Observability

AI-related diagnostics should record only information necessary for debugging.

Logs should avoid storing:

- API keys
- Full academic records
- Full private prompts
- Sensitive AI responses

unless explicitly required and appropriately protected.

---

## 11.43 AI Testing

AI features should use multiple testing strategies.

### Deterministic Tests

Test:

- Request construction
- Data filtering
- Schema validation
- Error handling
- Provider adapters

### Mock Provider Tests

Use mocked responses to test application behavior without depending on a real AI provider.

### Human Evaluation

AI output quality should be evaluated separately because deterministic unit tests cannot fully measure usefulness or correctness.

---

## 11.44 AI Evaluation

AI features should be evaluated against:

- Factual consistency
- Relevance
- Helpfulness
- Safety
- Hallucination frequency
- Response consistency
- Privacy behavior

---

## 11.45 AI Safety Boundary

AI should never be trusted to make irreversible academic decisions automatically.

Examples include:

- Deleting academic records
- Changing grades
- Marking courses as completed
- Removing graduation requirements
- Automatically committing an academic plan

These require explicit application logic and/or user confirmation.

---

## 11.46 AI Architecture Diagram

```text
                         ┌─────────────────────┐
                         │    Academic OS      │
                         └──────────┬──────────┘
                                    │
                                    ↓
                         ┌─────────────────────┐
                         │     AI Service      │
                         └──────────┬──────────┘
                                    │
                          ┌─────────┴─────────┐
                          ↓                   ↓
                 ┌────────────────┐   ┌────────────────┐
                 │ Provider       │   │ Local Model    │
                 │ Interface      │   │ Adapter        │
                 └───────┬────────┘   └────────────────┘
                         │
              ┌──────────┼──────────┐
              ↓          ↓          ↓
         Provider A  Provider B  Future Provider
              │          │          │
              └──────────┼──────────┘
                         ↓
                    AI Response
                         │
                         ↓
                Response Validation
                         │
                         ↓
                  User / Feature
```

---

## 11.47 AI Data Flow

```text
Authoritative Academic Data
          ↓
Relevant Data Selection
          ↓
Data Minimization
          ↓
Prompt Construction
          ↓
AI Provider
          ↓
Response Validation
          ↓
AI Interpretation
          ↓
User Review
          ↓
Optional User Action
```

---

## 11.48 AI Architecture Rules

The following rules are mandatory:

1. AI is optional.
2. Core Academic OS functionality must not depend on AI.
3. AI must never become the authoritative source of academic data.
4. Deterministic calculations must be preferred when available.
5. AI providers must be accessed through an abstraction boundary.
6. AI requests should use data minimization.
7. Unnecessary academic data must not be transmitted to AI providers.
8. AI output must be treated as potentially incorrect.
9. Authoritative application data must take precedence over conflicting AI output.
10. AI-generated changes to persistent data require explicit user action.
11. AI must not automatically perform irreversible academic actions.
12. AI failures must not break core functionality.
13. API credentials must not be embedded in public frontend source code.
14. AI-related logs must respect privacy requirements.
15. AI conversation history is not required for the MVP.
16. External AI providers must be evaluated for privacy, reliability, quality, availability, cost, and compatibility.
17. AI should consume authoritative analytics rather than replace the analytics engine.
18. Predictive AI should remain outside the MVP.
19. Local AI may be considered when technically practical.
20. No AI provider should become an irreversible architectural dependency.

---

## 11.49 MVP Scope

The R1 MVP may include limited AI assistance such as:

- Academic progress explanation
- Semester summary
- Analytics explanation
- Basic planning suggestions

AI must remain optional.

The entire Academic OS MVP must remain functional when AI is unavailable or disabled.

---

## 11.50 Features Outside MVP

The following should remain future considerations:

- Full conversational academic assistant
- Persistent AI conversation history
- Advanced personalized recommendations
- Predictive GPA
- Graduation-risk prediction
- Autonomous planning
- AI agents
- Automatic academic decisions
- Cross-user AI benchmarking
- Complex multi-provider orchestration

---

## 11.51 Part 11 Acceptance Criteria

Part 11 is considered complete when:

- AI's role within Academic OS is defined.
- AI's optional nature is defined.
- The authoritative-data boundary is defined.
- Deterministic-vs-AI responsibilities are defined.
- Human review requirements are defined.
- Provider abstraction is defined.
- Data minimization is defined.
- Privacy boundaries are defined.
- External-provider limitations are defined.
- Local AI considerations are defined.
- Prompt architecture is defined.
- Response validation is defined.
- Hallucination handling is defined.
- AI failure handling is defined.
- API-key security rules are defined.
- AI and analytics boundaries are defined.
- AI and backup boundaries are defined.
- AI and migration boundaries are defined.
- AI testing requirements are defined.
- AI evaluation requirements are defined.
- AI safety boundaries are defined.
- MVP AI scope is defined.
- Future AI scope is separated from MVP.



# Part 12 — Testing & Deployment Architecture

## 12.1 Purpose

This part defines the testing, quality assurance, build, release, and deployment architecture for Academic OS.

The purpose is to ensure that Academic OS can be developed and released with:

- Reliable academic calculations
- Stable application behavior
- Safe data handling
- Predictable releases
- Reproducible builds
- Controlled changes
- Recoverable deployment states

Testing and deployment should support the architectural principles established in previous parts while remaining appropriate for a personal academic-management platform.

---

## 12.2 Testing Principles

### TD-001 — Correctness First

Testing should prioritize correctness of academic and data-related functionality.

Particular attention should be given to:

- GPA calculations
- Credit calculations
- Program requirements
- Academic progress
- Data persistence
- Backup and restore
- State transitions

---

### TD-002 — Test the Highest-Risk Logic First

Testing effort should be concentrated on functionality where an incorrect result could materially affect the user's academic records or decisions.

Priority areas include:

```text
Academic Calculations
        ↓
Data Persistence
        ↓
Backup / Restore
        ↓
Requirement Tracking
        ↓
State Management
        ↓
UI Behavior
```

---

### TD-003 — Deterministic Tests

Core business logic should be deterministic and testable without external services.

For example:

```text
Input Academic Records
        ↓
Calculation
        ↓
Expected Result
```

The result should be reproducible.

---

### TD-004 — Test Isolation

Tests should minimize dependencies on:

- External APIs
- Network connectivity
- AI providers
- Production databases
- User-specific machine configuration

Where external dependencies are required, mocks or controlled test adapters should be preferred.

---

### TD-005 — Regression Protection

When a defect is discovered, an appropriate regression test should be added where practical.

The goal is to prevent previously fixed problems from returning.

---

## 12.3 Testing Levels

Academic OS should use multiple testing levels.

```text
Unit Tests
    ↓
Integration Tests
    ↓
Feature Tests
    ↓
End-to-End Tests
    ↓
Release Validation
```

Each level has a different purpose.

---

## 12.4 Unit Testing

Unit tests should validate isolated logic.

Examples:

- GPA calculations
- Credit calculations
- Progress calculations
- Requirement evaluation
- Goal calculations
- Validation rules
- Utility functions
- State transformations

Unit tests should be fast enough to run frequently during development.

---

## 12.5 Domain Logic Testing

Domain logic should receive particularly strong unit-test coverage.

Example:

```text
Grades
+
Credits
+
Rules
    ↓
GPA Service
    ↓
Expected GPA
```

This should not require rendering a UI component.

---

## 12.6 Repository Testing

Repository implementations should be tested to verify:

- Create operations
- Read operations
- Update operations
- Delete operations
- Query behavior
- Persistence behavior
- Error handling

Repository tests should verify that domain objects are correctly persisted and retrieved.

---

## 12.7 Persistence Testing

Persistence tests should verify:

- Database initialization
- Schema behavior
- Data serialization
- Data deserialization
- Migration behavior
- Transaction or atomic-operation behavior where applicable
- Data integrity

---

## 12.8 Migration Testing

Database migrations must be tested against representative previous schemas.

Conceptually:

```text
Old Schema
    ↓
Migration
    ↓
New Schema
    ↓
Validation
```

Migration failures must not silently produce corrupted academic records.

---

## 12.9 Backup and Restore Testing

Backup and restore functionality should have dedicated tests.

Test scenarios should include:

- Valid backup
- Empty dataset backup
- Large expected dataset
- Corrupted backup
- Invalid backup format
- Restore into empty database
- Restore over existing data
- Interrupted restore
- Backup version mismatch

---

## 12.10 Analytics Testing

Analytics must be tested independently from visualization.

Examples:

- GPA
- Semester GPA
- Credit progress
- Completion percentage
- Goal progress
- Trends
- Requirement completion

The analytics engine should produce predictable results from known input data.

---

## 12.11 AI Testing

AI features should not depend exclusively on live provider calls for automated testing.

Testing should use:

```text
Mock AI Provider
       ↓
Known Response
       ↓
Application Behavior
```

This allows reliable testing of:

- Request construction
- Response validation
- Error handling
- Provider failures
- Timeout handling
- Invalid responses

---

## 12.12 AI Quality Evaluation

AI output quality requires separate evaluation from deterministic testing.

Evaluation areas include:

- Factual consistency
- Relevance
- Helpfulness
- Hallucination behavior
- Privacy behavior
- Response consistency

AI quality evaluation should not be treated as equivalent to ordinary unit-test coverage.

---

## 12.13 Component Testing

UI components should be tested where their behavior contains meaningful logic.

Examples:

- Forms
- Validation states
- Progress indicators
- Dashboard cards
- Modals
- Data tables
- Navigation behavior

Purely presentational components may require less testing than interactive components.

---

## 12.14 Integration Testing

Integration tests should verify interactions between architectural layers.

Examples:

```text
Repository
    +
Domain Service
    ↓
Expected Result
```

and:

```text
Domain Service
    +
Analytics Service
    ↓
Dashboard Data
```

---

## 12.15 Feature Testing

Important features should be tested as complete workflows.

Examples:

```text
Add Subject
    ↓
Save Subject
    ↓
Subject Appears
```

or:

```text
Enter Grade
    ↓
Save Grade
    ↓
GPA Recalculated
    ↓
Dashboard Updated
```

---

## 12.16 End-to-End Testing

End-to-end tests should verify important user journeys.

Potential E2E scenarios:

### Academic Setup

```text
Create Academic Profile
        ↓
Configure Program
        ↓
Add Academic Records
        ↓
View Dashboard
```

### Grade Update

```text
Update Grade
        ↓
Save
        ↓
Analytics Recalculate
        ↓
Dashboard Reflects Change
```

### Backup

```text
Create Backup
        ↓
Clear / Reset Test Data
        ↓
Restore Backup
        ↓
Verify Academic State
```

---

## 12.17 Critical User Journeys

The following should receive higher testing priority:

1. Initial setup
2. Academic record creation
3. Grade entry/update
4. GPA calculation
5. Credit progress
6. Program completion
7. Backup
8. Restore
9. Data import/export where implemented
10. AI failure without affecting core functionality

---

## 12.18 Test Data

Testing should use controlled test datasets.

Test data should cover:

- Normal cases
- Boundary cases
- Empty cases
- Invalid cases
- Incomplete data
- Multiple semesters
- Different grade combinations
- Different credit values

Real personal academic data should not be required for automated tests.

---

## 12.19 Test Fixtures

Reusable fixtures should be created for common scenarios.

Example:

```text
Minimal Academic Dataset
Typical Academic Dataset
Incomplete Academic Dataset
Large Academic Dataset
Migration Dataset
Backup Dataset
```

Fixtures should remain deterministic.

---

## 12.20 Edge-Case Testing

Academic OS should explicitly test edge cases.

Examples:

- Zero completed credits
- One completed subject
- All subjects completed
- Missing grade
- Zero-credit course
- Duplicate records
- Invalid credit value
- GPA boundary values
- Empty semester
- No program configured

---

## 12.21 Error Testing

The system should test expected failures rather than only successful paths.

Examples:

```text
Invalid Input
    ↓
Validation Error
```

```text
Database Failure
    ↓
User-Friendly Error
```

```text
AI Provider Failure
    ↓
AI Error
    ↓
Core Application Continues
```

---

## 12.22 Regression Testing

A regression suite should protect important previously working functionality.

Regression testing should be run before releases.

At minimum, the suite should cover:

- Academic calculations
- Persistence
- Backup/restore
- Critical workflows

---

## 12.23 Performance Testing

Performance testing should be proportional to the expected application scale.

Academic OS is intended primarily for personal use, so excessive performance engineering is unnecessary during the MVP stage.

Testing should nevertheless identify:

- Slow database operations
- Slow dashboard calculations
- Excessive rendering
- Large-data issues
- Unnecessary repeated calculations

---

## 12.24 Performance Baseline

A basic performance baseline should be established for:

- Application startup
- Dashboard loading
- Academic calculations
- Database operations
- Backup creation
- Restore operations

Optimization should be driven by observed problems rather than speculation.

---

## 12.25 Browser Testing

Because Academic OS is a web-based dashboard, compatibility should be validated in the primary supported browser environment.

At minimum, the development environment should verify:

- Application startup
- Core navigation
- Forms
- IndexedDB behavior
- Charts
- Backup/restore
- Responsive behavior

Additional browser support can be added according to actual user needs.

---

## 12.26 Responsive Testing

The dashboard should be tested at representative viewport sizes.

Testing should cover:

- Desktop
- Laptop
- Tablet
- Mobile-sized viewport

The application does not necessarily need identical layouts across all sizes, but functionality should remain accessible.

---

## 12.27 Accessibility Testing

Important accessibility checks should include:

- Keyboard navigation
- Form labels
- Focus states
- Text readability
- Semantic structure
- Screen-reader compatibility where practical
- Non-color status indicators
- Accessible chart alternatives

---

## 12.28 Security Testing

Security testing should focus on the actual architecture and threat model.

Relevant areas include:

- Local data protection
- Input validation
- XSS prevention
- Dependency vulnerabilities
- API-key exposure
- AI provider configuration
- Backup file handling
- Import/export validation

---

## 12.29 Dependency Security

Third-party dependencies should be reviewed periodically.

The project should avoid unnecessary dependencies.

Dependency updates should be tested before being incorporated into stable releases.

---

## 12.30 Static Analysis

Where supported by the chosen development stack, automated static analysis should be used.

Examples include:

- Type checking
- Linting
- Formatting
- Build validation

These checks should run before release.

---

## 12.31 Code Quality Gates

A release candidate should satisfy minimum quality gates.

Example:

```text
Lint
  ↓
Type Check
  ↓
Unit Tests
  ↓
Integration Tests
  ↓
Build
  ↓
Release Validation
```

The exact sequence may evolve with the implementation.

---

## 12.32 Continuous Integration

A CI pipeline may be introduced to automate:

- Dependency installation
- Linting
- Type checking
- Tests
- Build verification

CI is recommended but should remain proportionate to the project's personal-use scope.

---

## 12.33 Local Development Validation

Developers should be able to run the primary quality checks locally before committing.

At minimum:

```text
Install
Build
Lint
Test
```

This reduces the likelihood of discovering basic problems only after deployment.

---

## 12.34 Git Workflow

Development should use version control.

Recommended conceptual workflow:

```text
main
  ↓
Feature Branch
  ↓
Development
  ↓
Test
  ↓
Review
  ↓
Merge
```

For a personal project, the exact branching model may remain lightweight.

---

## 12.35 Commit Discipline

Commits should represent meaningful changes where practical.

Examples:

```text
feat: add semester tracking
fix: correct GPA calculation
test: add credit progress cases
refactor: simplify analytics service
docs: update architecture
```

The exact commit convention may be adapted to personal workflow.

---

## 12.36 Release Strategy

Academic OS should use controlled releases.

Conceptually:

```text
Development
    ↓
Release Candidate
    ↓
Validation
    ↓
Stable Release
```

Experimental changes should not automatically become stable releases.

---

## 12.37 Versioning

Application releases should use a consistent versioning scheme.

Semantic versioning may be used:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
1.0.0
1.1.0
1.1.1
```

The exact versioning strategy may be finalized during implementation.

---

## 12.38 Release Notes

Stable releases should record significant changes.

Release notes may include:

- New features
- Bug fixes
- Architecture changes
- Migration requirements
- Known limitations

---

## 12.39 Database Versioning

The application schema should have its own version information.

Conceptually:

```text
Application Version
        +
Database Schema Version
```

These should not be assumed to always be identical.

---

## 12.40 Deployment Architecture

The MVP deployment should remain simple.

The preferred deployment model is:

```text
Browser
   ↓
Academic OS Web Application
   ↓
Local Persistence
```

Core academic data should remain local-first.

---

## 12.41 Static Deployment

If the selected frontend architecture supports it, Academic OS may be deployed as a static web application.

Potential architecture:

```text
Static Hosting
      ↓
Frontend Application
      ↓
Browser
      ↓
IndexedDB
```

This minimizes infrastructure requirements.

---

## 12.42 Backend Requirement

A backend should not be introduced merely because it is conventional.

The MVP should remain backend-free if the selected functionality can safely operate using:

- Client-side application logic
- IndexedDB
- Local backup/export
- Optional external AI services

A backend may be introduced later if new requirements justify it.

---

## 12.43 Environment Configuration

Environment-specific configuration should be separated from application logic.

Potential environments:

```text
Development
Testing
Production
```

Sensitive configuration should not be committed to source control.

---

## 12.44 Secrets Management

Secrets must not be hard-coded into source code.

Examples:

- AI API keys
- External service credentials
- Deployment credentials

If a deployment model requires client-side credentials, the security implications must be explicitly evaluated.

---

## 12.45 Build Reproducibility

The project should use versioned dependency information.

A fresh environment should be able to reproduce the intended build using the project's configuration.

---

## 12.46 Deployment Validation

After deployment, a smoke test should verify:

- Application loads
- Navigation works
- Database initializes
- Core dashboard loads
- Academic data can be read
- Core calculations work
- Backup/restore remains functional

---

## 12.47 Rollback Strategy

If a release introduces a serious defect:

```text
Failed Release
      ↓
Identify Problem
      ↓
Rollback / Restore Previous Version
      ↓
Protect User Data
```

Application rollback must not accidentally destroy or downgrade valid academic data.

---

## 12.48 Database Compatibility During Rollback

Rollback planning must consider database schema changes.

For example:

```text
Version 1
   ↓
Migration
   ↓
Version 2
```

Returning to Version 1 may not be safe if the database has already migrated.

Therefore, schema migrations must be designed with rollback implications in mind.

---

## 12.49 Backup Before Risky Migration

Before significant schema migrations:

```text
Existing Data
     ↓
Verified Backup
     ↓
Migration
     ↓
Validation
```

This is especially important for academic records.

---

## 12.50 Recovery Testing

Recovery procedures should be tested periodically.

Testing should verify that:

```text
Backup
   ↓
Restore
   ↓
Application
   ↓
Expected Academic State
```

is achievable.

---

## 12.51 Deployment and AI

AI providers must remain external dependencies.

A provider outage should not prevent deployment or use of the core application.

The deployment should therefore tolerate:

```text
AI Provider Offline
       ↓
AI Disabled
       ↓
Academic OS Still Functional
```

---

## 12.52 Deployment and Privacy

The deployment model should minimize unnecessary remote services.

The MVP should avoid introducing:

- Remote analytics
- User tracking
- Unnecessary third-party services

unless explicitly required.

---

## 12.53 Production Data Protection

Production academic data should be treated as valuable user data.

Before destructive operations such as:

- Database reset
- Major migration
- Restore over existing data

the system should provide appropriate confirmation and/or backup mechanisms.

---

## 12.54 Release Checklist

Before a stable release:

```text
[ ] Code builds successfully
[ ] Lint passes
[ ] Type checking passes
[ ] Unit tests pass
[ ] Integration tests pass
[ ] Critical E2E flows pass
[ ] Migration tests pass
[ ] Backup/restore tests pass
[ ] Security checks pass
[ ] Production build validated
[ ] Smoke test passes
[ ] Release notes updated
```

---

## 12.55 MVP Testing Scope

R1 should prioritize:

- Unit tests for domain logic
- GPA tests
- Credit/progress tests
- Repository tests
- Persistence tests
- Migration tests
- Backup/restore tests
- Critical feature workflows
- Basic UI/component testing
- AI mock-provider testing where AI is implemented
- Build validation
- Basic security checks

---

## 12.56 MVP Deployment Scope

R1 deployment should prioritize:

- Simple web deployment
- Local-first persistence
- Reproducible builds
- Versioned releases
- Backup before risky migrations
- Basic rollback planning
- Minimal external infrastructure

---

## 12.57 Future Testing Improvements

Future versions may introduce:

- Larger automated E2E suites
- Advanced performance testing
- Cross-browser automation
- Visual regression testing
- Advanced accessibility automation
- More extensive AI evaluation
- Automated dependency security scanning
- More sophisticated CI/CD

These should be introduced when justified by project complexity.

---

## 12.58 Future Deployment Improvements

Future versions may introduce:

- Automated production deployment
- Preview environments
- Advanced CI/CD
- Remote synchronization
- Backend services
- Multi-device synchronization
- Managed authentication
- Cloud infrastructure

These are outside the initial MVP unless future requirements require them.

---

## 12.59 Testing & Deployment Architecture Rules

The following rules are mandatory:

1. Core academic calculations must have deterministic tests.
2. High-risk academic logic receives higher testing priority.
3. Tests should minimize external dependencies.
4. External AI services should be mocked during automated tests.
5. Backup and restore must be tested independently.
6. Database migrations must be tested.
7. Critical user journeys must have workflow-level tests.
8. Regression tests should be added for important defects.
9. Static analysis should run before stable releases.
10. Builds should be reproducible.
11. Production releases should be validated before use.
12. Risky migrations should be preceded by verified backups.
13. Rollback planning must consider database compatibility.
14. AI failure must not break core application functionality.
15. Secrets must not be hard-coded into source control.
16. Deployment should remain simple during the MVP.
17. A backend is not required unless justified by product requirements.
18. Remote tracking and analytics should not be introduced unnecessarily.
19. User academic data must be protected during destructive operations.
20. Testing and deployment complexity should remain proportional to Academic OS's personal-use scope.

---

## 12.60 Acceptance Criteria

Part 12 is considered complete when:

- Testing principles are defined.
- Testing levels are defined.
- Domain testing is defined.
- Repository testing is defined.
- Persistence testing is defined.
- Migration testing is defined.
- Backup/restore testing is defined.
- Analytics testing is defined.
- AI testing is defined.
- Integration testing is defined.
- E2E testing is defined.
- Regression testing is defined.
- Performance testing boundaries are defined.
- Accessibility testing is defined.
- Security testing is defined.
- Static analysis requirements are defined.
- CI considerations are defined.
- Release strategy is defined.
- Versioning is defined.
- Deployment architecture is defined.
- Rollback considerations are defined.
- Recovery testing is defined.
- MVP testing scope is defined.
- MVP deployment scope is defined.
- Future testing/deployment improvements are separated from MVP.


# Part 13 — Architecture Traceability

## 13.1 Purpose

This part establishes traceability between the Academic OS product requirements and the technical architecture.

The purpose is to verify that:

- PRD requirements have architectural support.
- Major product decisions have corresponding technical decisions.
- High-priority requirements are represented in the architecture.
- Important risks have architectural mitigations.
- MVP boundaries are reflected in the technical design.
- Future features do not unnecessarily complicate the MVP architecture.

Traceability is intended to provide architectural confidence without requiring every implementation detail to be mapped individually.

---

## 13.2 Traceability Principles

### TR-001 — Requirement-to-Architecture Traceability

Important product requirements should map to one or more architectural decisions or components.

Conceptually:

```text
PRD Requirement
      ↓
Architecture Decision
      ↓
System Component
      ↓
Implementation
      ↓
Test
```

---

### TR-002 — Priority Awareness

Higher-priority requirements should receive stronger architectural attention.

For example:

```text
P0 / P1 Requirement
        ↓
Explicit Architecture Support
        ↓
Dedicated Testing
```

Lower-priority future features should not unnecessarily influence the MVP architecture.

---

### TR-003 — Risk Traceability

Important risks should map to architectural mitigations.

Conceptually:

```text
Risk
 ↓
Mitigation
 ↓
Architecture
 ↓
Validation
```

---

### TR-004 — MVP Boundary Traceability

Requirements assigned to R1 MVP should be supported by the current architecture.

Features outside R1 should not automatically become implementation requirements.

---

### TR-005 — Decision Traceability

Major architectural decisions should be identifiable through Architecture Decision Records (ADRs) or equivalent decision references.

---

## 13.3 Traceability Layers

Academic OS traceability should operate across the following layers:

```text
Product Vision
      ↓
PRD Requirements
      ↓
Priorities
      ↓
Risks
      ↓
Architecture Decisions
      ↓
Architecture Components
      ↓
Testing
      ↓
Release
```

---

## 13.4 Product Vision Traceability

The architecture must support the central purpose of Academic OS:

> Provide a personal academic dashboard for monitoring and understanding academic progress.

This purpose is reflected through:

```text
Academic Data
      ↓
Academic Domain
      ↓
Analytics
      ↓
Dashboard
```

The architecture should therefore prioritize academic monitoring over unrelated platform capabilities.

---

## 13.5 Core Requirement Mapping

The core requirements should map approximately as follows:

| Product Capability | Primary Architectural Area |
|---|---|
| Academic data management | Domain + Data Architecture |
| Subject management | Feature Module Architecture |
| Semester management | Domain + Feature Architecture |
| Grade management | Domain + Data Architecture |
| GPA calculation | Analytics Architecture |
| Credit tracking | Analytics Architecture |
| Program progress | Requirement + Analytics Architecture |
| Dashboard | Frontend + Analytics Architecture |
| Goals | Feature + Analytics Architecture |
| Backup | Backup & Restore Architecture |
| Restore | Backup & Restore Architecture |
| AI assistance | AI Architecture |
| Data persistence | Persistence Architecture |
| Testing | Testing Architecture |
| Deployment | Deployment Architecture |

---

## 13.6 Requirement-to-Part Mapping

The following mapping provides high-level architectural traceability.

### Academic Management

Supported by:

```text
Part 2 — Application Architecture
Part 4 — Data Architecture
Part 7 — Feature Module Architecture
```

---

### Dashboard

Supported by:

```text
Part 3 — Frontend Architecture
Part 6 — State Management
Part 10 — Analytics Architecture
```

---

### Academic Progress

Supported by:

```text
Part 4 — Data Architecture
Part 10 — Analytics Architecture
```

---

### GPA

Supported by:

```text
Part 4 — Data Architecture
Part 10 — Analytics Architecture
Part 12 — Testing Architecture
```

---

### Credit Progress

Supported by:

```text
Part 4 — Data Architecture
Part 10 — Analytics Architecture
Part 12 — Testing Architecture
```

---

### Program Completion

Supported by:

```text
Part 4 — Data Architecture
Part 7 — Feature Architecture
Part 10 — Analytics Architecture
```

---

### Backup and Restore

Supported by:

```text
Part 5 — Persistence Architecture
Part 8 — Backup & Restore Architecture
Part 12 — Testing & Deployment Architecture
```

---

### AI Assistance

Supported by:

```text
Part 10 — Analytics Architecture
Part 11 — AI Architecture
Part 12 — Testing & Deployment Architecture
```

---

### Privacy

Supported by:

```text
Part 5 — Persistence Architecture
Part 8 — Backup & Restore Architecture
Part 9 — Cross-Cutting Architecture
Part 11 — AI Architecture
```

---

## 13.7 Priority Traceability

Requirements should be evaluated according to their PRD priority.

### P0 — Critical

P0 requirements should have:

- Explicit architecture support
- Dedicated implementation attention
- Dedicated testing
- Release validation

Examples include:

```text
Core academic data
Academic calculations
Persistence
Backup / restore
```

---

### P1 — Important

P1 requirements should have:

- Architectural support
- Appropriate testing
- Inclusion in R1 where applicable

Examples include:

```text
Dashboard analytics
Goals
Progress tracking
Basic AI assistance
```

---

### P2 — Future / Secondary

P2 features may be represented in the architecture but should not complicate the MVP unnecessarily.

---

### P3 / P4 — Future / Experimental

P3 and P4 features should remain architectural extension points rather than MVP implementation requirements.

---

## 13.8 MVP Traceability

R1 is the MVP.

The architecture should therefore prioritize:

```text
R1
 ↓
Core Academic Management
 ↓
Academic Analytics
 ↓
Dashboard
 ↓
Persistence
 ↓
Backup / Restore
 ↓
Testing
 ↓
Deployment
```

AI remains optional even if limited AI features are included in R1.

---

## 13.9 R0 / R1 Boundary

The architecture must preserve the previously established distinction between R0 and R1.

Conceptually:

```text
R0
 ↓
Foundation
 ↓
Architecture / Setup / Core Infrastructure

R1
 ↓
MVP
 ↓
Usable Academic OS
```

The R0/R1 boundary should not be blurred by introducing future features prematurely.

---

## 13.10 Risk-to-Architecture Mapping

Important project risks should map to technical mitigations.

Example:

| Risk Area | Architectural Mitigation |
|---|---|
| Data loss | Backup & Restore Architecture |
| Incorrect academic calculations | Centralized Analytics + Tests |
| Data corruption | Validation + Persistence Rules |
| AI hallucination | AI Boundary + Deterministic Analytics |
| AI provider failure | Optional AI + Provider Abstraction |
| Vendor lock-in | AI Provider Adapter |
| Migration failure | Migration Testing + Backup |
| Deployment failure | Release Validation + Rollback |
| Excessive complexity | MVP Boundary + Modular Architecture |
| Privacy risk | Local-first + Data Minimization |

---

## 13.11 RISK-006 Traceability

RISK-006's previously approved backup strategy must remain connected to:

```text
Risk
 ↓
Backup Strategy
 ↓
Backup Architecture
 ↓
Restore Testing
 ↓
Recovery Validation
```

The approved strategy should remain the authoritative mitigation for the identified risk.

---

## 13.12 AI Risk Traceability

AI-related risks should map to:

```text
Hallucination
    ↓
Deterministic Analytics
    +
AI Non-Authority
    +
User Review
```

Privacy risk:

```text
Academic Data
    ↓
Data Minimization
    ↓
Controlled AI Request
```

Provider failure:

```text
AI Provider
    ↓
Adapter
    ↓
Optional AI
    ↓
Core App Continues
```

---

## 13.13 Data Loss Traceability

The architecture should provide:

```text
Authoritative Data
      ↓
Persistence
      ↓
Backup
      ↓
Restore
      ↓
Validation
```

This ensures that data protection is represented across multiple architectural layers.

---

## 13.14 Calculation Integrity Traceability

Academic calculations should follow:

```text
Academic Records
      ↓
Domain Rules
      ↓
Centralized Analytics
      ↓
Deterministic Tests
      ↓
Dashboard
```

This reduces the risk of different application areas producing different academic results.

---

## 13.15 Privacy Traceability

Privacy requirements should map to:

```text
Local-first Persistence
        +
Data Minimization
        +
Limited External Services
        +
AI Privacy Controls
```

This architecture supports the project's preference for minimizing unnecessary external data exposure.

---

## 13.16 AI Provider Independence

The requirement to avoid unnecessary provider lock-in maps to:

```text
AI Service
      ↓
Provider Interface
      ↓
Provider Adapter
```

This allows future providers or local models to be considered without redesigning the entire application.

---

## 13.17 Testing Traceability

Important architectural requirements must have corresponding tests.

Examples:

| Architecture Requirement | Test Area |
|---|---|
| GPA calculation | Unit test |
| Credit calculation | Unit test |
| Repository behavior | Integration test |
| Migration | Migration test |
| Backup | Backup test |
| Restore | Restore test |
| Dashboard workflow | E2E test |
| AI provider failure | Mock-provider test |
| Deployment | Smoke test |

---

## 13.18 Architecture-to-Test Traceability

The relationship should be:

```text
Architecture Decision
        ↓
Expected Behavior
        ↓
Test
        ↓
Release Validation
```

This prevents architectural rules from existing only as documentation.

---

## 13.19 Architecture-to-Implementation Traceability

During implementation, important architecture decisions should map to actual code structures.

For example:

```text
Analytics Architecture
        ↓
Analytics Service
        ↓
GPA Module
Credit Module
Progress Module
```

and:

```text
AI Architecture
        ↓
AI Service
        ↓
Provider Adapter
```

The implementation should not bypass the defined architectural boundaries without an explicit decision.

---

## 13.20 Architecture-to-Documentation Traceability

The following documents should remain consistent:

```text
Document 00
Project Vision

Document 01
PRD

Document 02
System Architecture & Technical Design
```

If an architectural decision changes the product requirements, the relevant PRD section should be reviewed.

If a product requirement changes the architecture, the affected architecture part should be reviewed.

---

## 13.21 Change Traceability

Significant changes should follow:

```text
Change Request
      ↓
Affected Requirement
      ↓
Affected Architecture
      ↓
Affected Tests
      ↓
Affected Documentation
```

This prevents silent inconsistencies.

---

## 13.22 Change Impact Analysis

Before making a significant change, identify:

- Affected requirements
- Affected architecture parts
- Affected data structures
- Affected tests
- Affected documentation
- Migration implications
- Backup implications
- Security/privacy implications

---

## 13.23 Architecture Consistency

The architecture should maintain consistency between:

```text
Requirements
+
Architecture
+
Implementation
+
Tests
```

A feature should not be considered complete if these layers significantly contradict one another.

---

## 13.24 Traceability Matrix

A high-level traceability matrix should be maintained.

Example:

| Requirement Area | PRD | Architecture | Test | Release |
|---|---|---|---|---|
| Academic Records | ✓ | ✓ | ✓ | ✓ |
| GPA | ✓ | ✓ | ✓ | ✓ |
| Credit Progress | ✓ | ✓ | ✓ | ✓ |
| Dashboard | ✓ | ✓ | ✓ | ✓ |
| Program Completion | ✓ | ✓ | ✓ | ✓ |
| Backup | ✓ | ✓ | ✓ | ✓ |
| Restore | ✓ | ✓ | ✓ | ✓ |
| AI Assistance | ✓ | ✓ | ✓ | Optional |
| Privacy | ✓ | ✓ | ✓ | ✓ |
| Future Predictive AI | ✓ | Extension | Future | No |

The matrix should remain high-level and should not become a second implementation tracker.

---

## 13.25 Architecture Decision Records

Major decisions should be represented through ADRs.

Examples:

```text
ADR-001 — Local-First Architecture
ADR-002 — IndexedDB Persistence
ADR-003 — Modular Application Architecture
ADR-004 — Centralized Analytics
ADR-005 — Backup Strategy
ADR-006 — Optional AI Architecture
ADR-007 — Provider Abstraction
```

The exact ADR numbering should follow the project's established convention.

---

## 13.26 ADR Traceability

Each significant ADR should identify:

- Decision
- Context
- Alternatives
- Consequences
- Related requirements
- Related architecture parts

This creates a connection between architectural decisions and product needs.

---

## 13.27 Requirement Change and ADR Review

When a major requirement changes, related ADRs should be reviewed.

For example:

```text
New Cloud Sync Requirement
        ↓
Review Local-First ADR
        ↓
Review Persistence Architecture
        ↓
Review Security Architecture
        ↓
Review Backup Architecture
```

An existing ADR should not be assumed to remain valid after major requirement changes.

---

## 13.28 Future Feature Traceability

Future features should be represented as extension points where appropriate.

Examples:

```text
Predictive Analytics
      ↓
Analytics Extension

Local AI
      ↓
AI Provider Adapter

Cloud Sync
      ↓
Persistence / Sync Extension
```

Future extension points should not require implementing the future feature during R1.

---

## 13.29 Preventing Premature Architecture

Architecture should not be expanded solely because a future feature might eventually exist.

Preferred:

```text
Current Requirement
       ↓
Current Architecture
       ↓
Simple Extension Point
```

rather than:

```text
Possible Future Feature
       ↓
Complex Infrastructure
       ↓
Unused MVP Components
```

---

## 13.30 Traceability and Scope Control

Traceability should help prevent scope creep.

When a proposed feature is introduced, ask:

```text
Does the PRD require it?
        ↓
What priority is it?
        ↓
Is it R1?
        ↓
What architecture does it require?
        ↓
What testing does it require?
        ↓
Does the added complexity justify the value?
```

---

## 13.31 Traceability and Technical Debt

Architecture traceability should help identify technical debt.

Examples:

```text
Requirement
    ↓
No Architectural Support
```

or:

```text
Architecture
    ↓
No Tests
```

or:

```text
Implementation
    ↓
Bypasses Architecture
```

These should be considered candidates for technical-debt review.

---

## 13.32 Traceability and Release Readiness

A release should be considered ready when:

```text
Required Features
      ↓
Architecture Supported
      ↓
Implementation Complete
      ↓
Tests Passing
      ↓
Deployment Validated
```

This does not require every future requirement to be implemented.

---

## 13.33 Traceability Ownership

Because Academic OS is a personal project, formal organizational roles are unnecessary.

The project owner/developer is responsible for maintaining:

- Requirement consistency
- Architecture consistency
- ADR updates
- Test alignment
- Release traceability

The process should remain lightweight.

---

## 13.34 Traceability Maintenance

Traceability should be updated when:

- Major requirements change
- Architecture changes
- Major risks change
- MVP scope changes
- New ADRs are created
- Important tests are added
- Deployment architecture changes

It does not need to be updated for every small implementation change.

---

## 13.35 Traceability Rules

The following rules are mandatory:

1. Important PRD requirements should map to architecture.
2. High-priority requirements receive stronger architectural and testing attention.
3. Important risks must have corresponding mitigations.
4. R1 MVP requirements must be supported by the architecture.
5. Future features should not unnecessarily complicate R1.
6. Major architecture decisions should be represented by ADRs.
7. Architecture decisions should identify related requirements where practical.
8. Important architecture rules should have corresponding tests.
9. Significant changes should include impact analysis.
10. Requirements, architecture, implementation, and tests should remain consistent.
11. Backup and restore risks must remain traceable to their approved mitigation.
12. AI risks must remain traceable to AI architectural boundaries.
13. Traceability should help control scope rather than expand it.
14. Traceability should remain lightweight and appropriate for a personal project.
15. Documentation should be updated when significant architectural decisions change.

---

## 13.36 Acceptance Criteria

Part 13 is considered complete when:

- Requirement-to-architecture traceability is defined.
- Priority traceability is defined.
- MVP traceability is defined.
- R0/R1 boundaries are represented.
- Risk-to-architecture traceability is defined.
- RISK-006 traceability is defined.
- AI risk traceability is defined.
- Data-loss traceability is defined.
- Calculation-integrity traceability is defined.
- Privacy traceability is defined.
- Testing traceability is defined.
- Architecture-to-implementation traceability is defined.
- Documentation consistency is defined.
- Change impact analysis is defined.
- Traceability matrix structure is defined.
- ADR traceability is defined.
- Future feature traceability is defined.
- Scope-control rules are defined.
- Technical-debt traceability is defined.
- Release-readiness traceability is defined.
- Traceability maintenance responsibilities are defined.



# Part 14 — Final Architecture Review

## 14.1 Purpose

This part provides the final consistency review of the Academic OS architecture.

The purpose is to verify that the architecture defined across Parts 1–13:

- Supports the Project Vision.
- Aligns with the PRD.
- Supports the R1 MVP.
- Preserves the R0/R1 boundary.
- Protects academic data.
- Maintains calculation integrity.
- Provides appropriate backup and recovery.
- Maintains a clear AI boundary.
- Provides adequate testing and deployment foundations.
- Allows reasonable future extension.
- Does not introduce unnecessary complexity.

Part 14 does not introduce major new architecture.

It serves as the final architectural approval layer for Document 02.

---

## 14.2 Architecture Completion Principle

The architecture should be considered complete when the major product requirements have:

```text
Requirement
    ↓
Architectural Support
    ↓
Implementation Boundary
    ↓
Testing Strategy
    ↓
Deployment Consideration
```

This does not mean every future feature must already be implemented.

---

## 14.3 Architecture Alignment with Project Vision

Academic OS is intended to function as a personal academic monitoring dashboard.

The architecture therefore prioritizes:

```text
Academic Data
      ↓
Academic Management
      ↓
Analytics
      ↓
Dashboard
      ↓
Progress Monitoring
```

The architecture should not shift the project's primary purpose toward:

- General-purpose productivity
- Social networking
- Multi-user collaboration
- Enterprise administration
- Unnecessary cloud infrastructure
- AI-first interaction

unless the Project Vision is formally changed.

---

## 14.4 PRD Alignment

The architecture must remain aligned with the requirements defined in Document 01.

The relationship is:

```text
Document 00
Project Vision
      ↓
Document 01
Product Requirements
      ↓
Document 02
System Architecture
```

Document 02 should implement the architectural consequences of the PRD rather than independently redefining the product.

---

## 14.5 MVP Alignment

R1 is the MVP.

The architecture must therefore provide sufficient support for the MVP without requiring future infrastructure.

The MVP foundation is:

```text
Academic Management
        +
Academic Analytics
        +
Dashboard
        +
Persistence
        +
Backup / Restore
        +
Testing
        +
Deployment
```

AI remains an optional assistance layer rather than a prerequisite for the core product.

---

## 14.6 R0 / R1 Boundary Review

The architecture preserves the established distinction:

### R0

Foundation and development infrastructure.

### R1

The first usable Academic OS MVP.

The architecture should not require R1 to implement features that were explicitly deferred to future releases.

---

## 14.7 Architecture Layer Review

The architecture consists of cooperating layers.

Conceptually:

```text
Presentation
      ↓
Application
      ↓
Domain
      ↓
Data / Persistence
```

Cross-cutting concerns operate across these layers:

```text
Validation
Error Handling
Security
Logging
Testing
Configuration
```

Analytics and AI remain clearly bounded capabilities rather than uncontrolled dependencies.

---

## 14.8 Frontend Architecture Review

The frontend architecture should:

- Provide the academic dashboard.
- Support feature modules.
- Consume application/domain services.
- Avoid embedding core business calculations directly into UI components.
- Maintain responsive behavior.
- Provide accessible interaction.
- Remain independent from external AI providers.

The UI should represent application state rather than become the source of truth for academic data.

---

## 14.9 Domain Architecture Review

Academic rules should remain centralized.

Examples include:

- GPA calculation
- Credit calculation
- Requirement evaluation
- Progress calculation
- Academic status rules

The same domain rule should not be independently reimplemented across multiple UI components.

---

## 14.10 Data Architecture Review

The data architecture must provide appropriate structures for:

- Academic profile
- Program information
- Courses/subjects
- Semesters
- Enrollments
- Grades
- Requirements
- Goals
- Analytics inputs
- Application metadata

Data structures should support the MVP without unnecessarily modeling future infrastructure.

---

## 14.11 Persistence Architecture Review

Persistence should remain aligned with the local-first design.

Conceptually:

```text
Application
     ↓
Repository
     ↓
Persistence Layer
     ↓
IndexedDB / Local Storage Mechanism
```

Application features should not directly manipulate low-level persistence structures when a repository or persistence abstraction is defined.

---

## 14.12 Backup and Recovery Review

Backup and restore remain core reliability mechanisms.

The architecture should support:

```text
Application Data
      ↓
Backup
      ↓
External User-Controlled Storage
      ↓
Restore
      ↓
Validation
```

Backup should not be treated as an optional convenience feature when it is required for protecting important academic records.

---

## 14.13 Calculation Integrity Review

Academic calculations are authoritative application logic.

The preferred flow is:

```text
Stored Academic Data
        ↓
Domain Rules
        ↓
Centralized Analytics
        ↓
Validated Result
        ↓
Dashboard
```

The dashboard should display calculated results rather than independently calculating them.

---

## 14.14 Analytics Architecture Review

Analytics should remain separate from presentation.

Examples:

```text
GPA Service
Credit Progress Service
Requirement Progress Service
Goal Progress Service
Trend Service
```

These services should provide structured results that can be consumed by the dashboard.

---

## 14.15 AI Architecture Review

AI must remain an assistance layer.

The architectural boundary is:

```text
Academic Data
      ↓
Deterministic Application Logic
      ↓
Authoritative Results
      ↓
Optional AI Assistance
```

AI must not replace authoritative academic calculations.

---

## 14.16 AI Reliability Review

The system should assume that AI output can be:

- Incorrect
- Incomplete
- Inconsistent
- Unavailable
- Provider-dependent

Therefore:

```text
AI Failure
    ↓
Graceful Degradation
    ↓
Core Academic OS Continues
```

AI should never become a single point of failure for academic management.

---

## 14.17 AI Privacy Review

Only information necessary for an AI operation should be considered for transmission to an external provider.

The architecture should support:

- Data minimization
- Explicit AI boundaries
- Provider abstraction
- Optional AI usage
- Future local-model support

The exact AI provider or model should be selected during implementation and evaluation rather than hard-coded into the architecture.

---

## 14.18 Security Review

Security should remain proportional to the system's actual threat model.

Important areas include:

- Input validation
- XSS prevention
- Dependency security
- Secret management
- Backup file validation
- External AI data handling
- Destructive-operation confirmation

The architecture should avoid unnecessary remote services that increase the attack surface.

---

## 14.19 Privacy Review

The local-first architecture supports privacy by reducing unnecessary external data transmission.

The system should avoid unnecessary:

- Tracking
- Remote analytics
- Third-party data collection
- Cloud storage
- External synchronization

unless explicitly introduced by a future requirement.

---

## 14.20 Backup Risk Review

RISK-006 remains addressed through the approved backup strategy.

The mitigation chain is:

```text
Data Loss Risk
      ↓
Backup
      ↓
Restore
      ↓
Validation
      ↓
Recovery
```

The architecture and testing strategy must continue to preserve this mitigation.

---

## 14.21 Testing Review

The architecture has corresponding testing strategies for:

- Domain logic
- Academic calculations
- Persistence
- Migrations
- Backup/restore
- Analytics
- AI integration
- Critical workflows
- Deployment

Testing effort remains proportional to risk.

---

## 14.22 Deployment Review

The MVP deployment should remain simple.

Preferred model:

```text
Web Application
      ↓
Browser
      ↓
Local Persistence
```

A backend, cloud database, authentication service, or synchronization infrastructure should only be introduced when justified by actual requirements.

---

## 14.23 Release Review

A release should pass:

```text
Build
 ↓
Static Checks
 ↓
Automated Tests
 ↓
Critical Workflow Validation
 ↓
Backup / Migration Validation
 ↓
Production Smoke Test
```

The exact automation level may evolve as the project grows.

---

## 14.24 Failure Isolation Review

Failures in optional components should not compromise core functionality.

Examples:

```text
AI Failure
    → Core application continues

Analytics Visualization Failure
    → Underlying data remains intact

Deployment Failure
    → Previous stable version remains recoverable

Migration Failure
    → Backup provides recovery path
```

---

## 14.25 Future Extensibility Review

The architecture provides reasonable extension points for future capabilities.

Potential future areas include:

- Local AI
- Alternative AI providers
- Predictive analytics
- Cloud synchronization
- Multi-device synchronization
- Additional analytics
- Advanced reporting

These should remain extension opportunities rather than MVP dependencies.

---

## 14.26 Avoiding Overengineering

The architecture should not introduce complexity without a corresponding requirement.

The preferred principle is:

```text
Requirement
    ↓
Necessary Architecture
    ↓
Simple Implementation
```

rather than:

```text
Possible Future Need
    ↓
Complex Infrastructure
    ↓
Unused MVP Components
```

---

## 14.27 Architecture Consistency Review

The following relationships should remain consistent:

```text
Project Vision
      ↕
PRD
      ↕
Architecture
      ↕
Implementation
      ↕
Testing
      ↕
Deployment
```

A significant change in one layer should trigger review of the affected layers.

---

## 14.28 Architecture Decision Review

Major architectural decisions should remain documented through ADRs or equivalent records.

Examples include:

- Local-first architecture
- Persistence technology
- Modular architecture
- Centralized analytics
- Backup strategy
- AI abstraction
- AI non-authoritative boundary

These decisions should be revisited only when new requirements or evidence justify doing so.

---

## 14.29 Technical Debt Review

The architecture should identify technical debt when:

- Implementation bypasses architectural boundaries.
- Important tests are missing.
- Duplicate business logic appears.
- Temporary solutions become permanent.
- Documentation diverges from implementation.

Technical debt should be managed according to impact rather than eliminated indiscriminately.

---

## 14.30 Documentation Consistency Review

The following documents should remain aligned:

```text
Document 00 — Project Vision
Document 01 — Product Requirements
Document 02 — System Architecture & Technical Design
```

When a significant change is introduced:

```text
Change
  ↓
Affected Document(s)
  ↓
Review
  ↓
Update
  ↓
Re-lock
```

Locked does not mean permanently immutable.

It means the content should not be changed casually without review.

---

## 14.31 Final Architecture Principles

The following principles summarize the architecture:

1. Academic OS is a personal academic monitoring platform.
2. R1 is the MVP.
3. Local-first architecture is preferred.
4. Academic data is authoritative.
5. Academic calculations are deterministic.
6. Business rules should remain centralized.
7. Analytics should remain independent from presentation.
8. Backup and restore are core reliability mechanisms.
9. AI is optional and non-authoritative.
10. AI failure must not break the core application.
11. External data transmission should be minimized.
12. Testing effort should follow risk.
13. Deployment should remain simple during R1.
14. Future features should use extension points rather than MVP infrastructure.
15. Architecture complexity should remain proportional to actual requirements.

---

## 14.32 Final Architecture Acceptance Criteria

Document 02 is considered architecturally complete when:

- The architecture supports the Project Vision.
- The architecture aligns with the PRD.
- R1 MVP requirements are supported.
- R0/R1 boundaries remain clear.
- Core academic data is modeled appropriately.
- Persistence boundaries are defined.
- Academic calculations are centralized.
- Analytics boundaries are defined.
- Backup and restore are defined.
- RISK-006 remains mitigated.
- AI boundaries are defined.
- AI is not authoritative.
- AI provider failure is isolated.
- Privacy boundaries are defined.
- Security responsibilities are identified.
- Testing strategy is defined.
- Deployment strategy is defined.
- Rollback and recovery considerations are defined.
- Future extension points are identified.
- Overengineering is explicitly discouraged.
- Requirement-to-architecture traceability exists.
- Architecture decisions are documented.
- Major risks have corresponding mitigations.
- Documentation consistency is defined.

---

## 14.33 Final Architecture Status

Upon approval of Part 14:

```text
Document 02
System Architecture & Technical Design
        ↓
Architecture Reviewed
        ↓
Architecture Consistent
        ↓
Architecture Locked
```

The architecture then becomes the technical baseline for implementation.

Future changes should be handled through controlled change review rather than informal modification.