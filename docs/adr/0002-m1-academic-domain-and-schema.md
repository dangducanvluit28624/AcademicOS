# ADR 0002: M1 Academic Domain and IndexedDB Schema

- Status: Accepted
- Date: 2026-08-25

## Context

M1 establishes the authoritative academic foundation used by later features. The project documents define seven core academic entities and their relationships, but leave exact grading rules, uniqueness rules, and deletion behavior open.

## Decision

The domain contains stable-ID records for Student Profile, Academic Program, Academic Year, Semester, Subject, Enrollment, and Grade. Only explicit relationships are represented:

```text
Academic Program -> Subject
Academic Year -> Semester
Semester -> Enrollment -> Subject
Enrollment -> Grade
```

The native IndexedDB database uses schema version `2` and creates one object store per entity. Stores use `id` as their key path. Relationship indexes are created for academic year, program, subject, semester, and enrollment references.

Repository writes validate domain records before persistence and verify referenced records exist. No cascade, restrict, detach, archive, uniqueness, or grading-scale policy is encoded because the source documents do not select one.

## Consequences

Authoritative records can be persisted and retrieved without a backend. Derived values such as GPA, credits earned, remaining credits, and analytics are not stored. The schema upgrade callback is the migration boundary for future versions.

## Deferred Decisions

- Exact grading scales and numeric-to-letter mappings
- Record uniqueness rules
- Delete versus archive behavior for related records
- Complete academic-program requirement model
- Academic management UI and application CRUD workflows
