# ADR 0004: M4 Planner

- Status: Accepted
- Date: 2026-08-27

## Decision

Planner owns `Task` and `AcademicEvent` records. Both are persisted in native IndexedDB stores added by the version 3 to version 4 additive upgrade. Planner records may reference Academic `Subject` records by `subjectId`; they never copy subject data. Subject references are checked through the Academic repository interface before saving.

Tasks use planned, in-progress, completed, and cancelled statuses and low, medium, and high priorities. Academic events use the supported event types and planned/cancelled lifecycle. Completion and cancellation update existing records rather than deleting them. Dates are stored as the existing ISO timestamp representation; recurrence, notifications, external calendars, and timezone services are out of scope.

Planner orchestration belongs in the application layer. Presentation consumes Planner services, while infrastructure owns IndexedDB. Today and Upcoming are local derived views over persisted Planner records; no productivity analytics or Planner analytics are stored. Academic and M3 analytics records remain unchanged.

## Migration

Schema version 4 adds `tasks` and `academicEvents` stores with `id` key paths. Existing version-3 stores and records are preserved; no reset or destructive migration is performed.
