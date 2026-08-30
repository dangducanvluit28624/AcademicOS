# 0006: M6 - Goals & Graduation Progress

## Context

Following the completion of M5 (Local Backup & Restore), we are introducing M6 to allow users to set and monitor academic goals (e.g., Target GPA, Target Credits) and track their graduation progress against a primary academic program. This functionality must adhere to the existing offline-first architecture, without introducing complex predictive forecasting, backends, or heavy dependency on external calculations. The metrics should strictly rely on the derived outputs from M3 (Academic Analytics).

## Decisions

1. **AcademicGoal Domain Model:**
   - Introduced `AcademicGoal` to model user-defined targets.
   - Allowed `targetType` is restricted to `'gpa'`, `'credits'`, and `'graduation-credits'`.
   - Goals are considered **authoritative configuration**, meaning they are persisted by the user, while their progress (achieved/in-progress status) is derived dynamically from the current academic records.

2. **Persistence (v4 to v5):**
   - The IndexedDB schema version is bumped from 4 to 5.
   - An additive migration creates the `'goals'` store. Existing data from v1-v4 remains untouched.
   - We reuse the transaction-completion logic to avoid race conditions.

3. **Analytics Integration:**
   - Goal progress calculations rely exclusively on existing M3 analytics functions (`calculateCumulativeGpa`, `calculateCreditProgress`).
   - Official GPA and derived calculations strictly follow M3 precedence.
   - A lack of a source metric (e.g. no grades, or missing program for graduation credits) yields explicit states (`'Unavailable'`, `'Incomplete'`, `'Data integrity issue'`) rather than falling back to false zero assumptions.

4. **Backup & Restore (M5 Compliance):**
   - Since goals are authoritative, they are added to the `BackupEnvelope` payload.
   - `schemaVersion` is updated to allow `5` in backups.
   - Backward compatibility is strictly enforced: when a v4 backup is restored, the missing `goals` field is cleanly defaulted to `[]` and does not break the restoration of tasks, events, or academic records.

5. **Exclusions:**
   - No complex graduation rule engine (e.g., major-specific prerequisites).
   - No predictive GPA trends or AI analytics.
   - We do not persist derived percentages.

## Status

Accepted.

## Consequences

- The user can explicitly plan long-term targets and track them alongside their standard semester performance.
- We incur an IndexedDB schema bump, which requires all clients to smoothly upgrade and the M5 backup functionality to account for legacy v4 payloads.
