# 5. M5 Local Backup and Restore

Date: 2026-08-28

## Status

Accepted

## Context

M5 requires a reliable local backup/export and restore/import workflow for all authoritative Academic OS data. This provides users with a safety mechanism and a way to export their data without relying on a backend or cloud sync.

The backup must contain all authoritative data from M1-M4. Crucially, derived analytics must be excluded from the backup and recalculated upon restore, and the official university-reported GPA must be preserved independently. The restore operation is a full replacement and must be safe (e.g. failing to restore should not corrupt the current database).

## Decisions

1. **Versioned JSON Format**: The backup uses an application-level JSON format (formatVersion: 1) completely decoupled from the IndexedDB schema version. This allows future schema changes to be handled transparently during the backup/restore process without directly tying the backup contract to IndexedDB details.
2. **Authoritative Data Only**: The backup stores authoritative source records only (student profiles, programs, semesters, subjects, enrollments, grades, tasks, events). Derived M3 analytics like calculated GPA and completion trends are intentionally omitted and are dynamically regenerated upon restore.
3. **Full Replacement**: The restore model is a full replacement of the database. Merge, selective restore, and conflict resolution were intentionally excluded to minimize complexity.
4. **Validation Before Mutation**: Imported backups are treated as untrusted input. The system strictly validates the JSON envelope, format compatibility, structural correctness, and internal cross-references _before_ attempting any database mutations.
5. **Transactional Replacement**: The restore process executes inside a single IndexedDB `readwrite` transaction encompassing all academic stores. If any part of the restore fails, the transaction is aborted, naturally restoring the previous state (safety backup) without leaving partial data.
6. **No Persistent History Store**: The backup is purely an exportable artifact. No historical database schema or persistent backend backup logs were added.

## Consequences

- The user has a reliable mechanism to export data and recover their exact academic state.
- Because restore relies on full replacement within an atomic transaction, the system is immune to partial corruption from invalid backups.
- Decoupling the backup format from the database schema allows for future flexibility while adhering to the M5 requirement of preserving the schema version at v4.
