# 7. M7 Academic Workflows & Presentation

Date: 2026-08-31

## Status

Accepted

## Context

The Academic OS previously featured a monolithic `App.tsx` containing all UI elements for managing the academic domain, calculating analytics, goal tracking, and backup/restore. As the prototype expanded, the presentation layer became unmaintainable. Furthermore, there were no application-level services to handle workflows like uniqueness validation, safe lifecycle management (preventing destructive deletions of referenced records), or archiving.

## Decision

We transformed the prototype presentation layer into a maintainable application through the following decisions:

1. **Presentation Decomposition**: The single `App.tsx` has been refactored into a `Shell` providing top-level layout and routing, and individual modules for `Dashboard`, `Academics`, `Planner`, `Goals`, and `BackupRestore`. The `Academics` module is further decomposed into specific CRUD views (Profile, Programs, Years, Semesters, Subjects, Enrollments, Grades) with their own sub-navigation.

2. **Lightweight Hash-based Navigation**: We introduced `useHashRouter`, a custom hook providing hash-based routing. This was chosen over external dependencies like `react-router-dom` to maintain the repository's lightweight footprint while ensuring the UI is linkable, handles reloads, and requires no backend server.

3. **Application Services for Academic Workflows**: We introduced an `AcademicService` at the application layer to mediate all academic operations. It coordinates between UI interactions and repository methods, performing necessary validations before saving or deleting.

4. **Lifecycle and Deletion Policy**:
   - **Safe Deletion**: A record can only be permanently deleted if it is not referenced by any other authoritative record (e.g., a Subject cannot be deleted if referenced by Enrollments, Tasks, or Events).
   - **No Cascade Deletion**: We strictly avoid silent cascade deletes to protect academic history.
   - **Archiving**: Rather than relying exclusively on deletion, we introduced an `archived` state for records like `Subject`. Archiving a Subject prevents new enrollments while retaining historical data and derived analytics intact.

5. **Persistence and Schema Compatibility**:
   - The `archived` state was implemented as an optional boolean directly in the TypeScript interfaces.
   - Because IndexedDB stores arbitrary JSON objects, we persisted the archive state without needing a new index. Consequently, we **did not bump the IndexedDB schema version (remains at v5)**.
   - This approach fully preserves compatibility with the M5 backup payload and restore operations.

6. **Uniqueness and Integrity**:
   - The `AcademicService` enforces semantically justified uniqueness rules, such as preventing duplicate Subject names/codes and preventing duplicate Academic Year labels.

## Consequences

- The presentation layer is drastically simplified and modular.
- Referential integrity is protected against accidental user deletions.
- Full compatibility with prior M3 (Analytics), M4 (Planner), M5 (Backup/Restore), and M6 (Goals) functionalities is maintained.
- M5 backups capture the `archived` state naturally and seamlessly restore it.
