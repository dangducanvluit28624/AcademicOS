# ADR 0003: M3 Derived Academic Analytics

- Status: Accepted
- Date: 2026-08-26

## Context

M3 derives academic progress information from the authoritative M2 records. Academic records remain persisted in the existing IndexedDB stores. Official GPA remains the user-provided `StudentProfile.overallGpa` and is distinct from calculated GPA.

## Decision

M3 calculations are pure, deterministic domain functions orchestrated by application analytics services. No analytics result is persisted and no IndexedDB schema migration is required.

Only terminal `completed` enrollments are eligible for performance and credit calculations. Planned and in-progress enrollments are excluded. A finalized grade is required. Failed grades are represented by the existing `F`/`0.0` conversion, participate in GPA and attempted credits, and do not earn completed credits.

Missing or unfinalized grades produce an `Incomplete` GPA result. Multiple grades for one enrollment produce a `Data integrity issue`; analytics does not select or repair one. Repeated subjects are not assigned an invented retake rule; cumulative GPA is `Incomplete` when repeated-subject ambiguity exists.

`Subject.credits` is the only course-credit source. Required-credit progress uses `AcademicProgram.totalRequiredCredits` when present. Without it, attempted and completed credits remain available while remaining credits and completion percentage are unavailable. Calculated GPA and percentages retain full internal precision and display to two decimal places.

Semester trends use valid semester start dates for deterministic chronology. Trends are unavailable when chronology cannot be established from the current data. No prediction, AI, backend, cloud service, or complex graduation requirement engine is included.

## Consequences

The dashboard can explain calculated values through source counts, credits, weighted points, incomplete records, and integrity issues. Updating authoritative grades causes metrics to be recalculated from current records on reload. The presentation layer consumes application services and does not access IndexedDB or concrete repositories.

The university-specific repeated/retaken-subject policy remains deferred. A future policy can replace the ambiguity result without changing the persistence model or dashboard data flow.
