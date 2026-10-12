# School Database Design

## Table Explanations & Relationships

- **`students` table**: Stores unique profile details for each learner (`id`, `name`, `email`).
- **`courses` table**: Stores catalog details for subjects offered by the school (`id`, `title`, `description`).
- **`enrolments` table (Join Table)**: Acts as the intermediary table connecting students to courses. 
  - **Relationships**: 
    - A student can have many enrolments, and a course can have many students, creating a **many-to-many relationship** between `students` and `courses`.
    - Because relational databases cannot directly represent many-to-many relationships in a single table, a **join table** (`enrolments`) is required. It breaks the many-to-many relationship into two one-to-many relationships (`students` to `enrolments`, and `courses` to `enrolments`) while also housing relationship-specific metadata (the `grade` and a composite `UNIQUE` constraint).

## Recommended Index
- **Index on `enrolments(student_id)` and `enrolments(course_id)`** (or reliance on foreign key indexing):
  - *Reason:* Foreign keys are frequently used in `JOIN` conditions and `WHERE` clauses to link students and courses. Adding an index on these foreign key columns speeds up lookup performance when filtering or joining large datasets.

## SQL vs. NoSQL Choice
For a school management system handling students, courses, and grades, **SQL (Relational Database)** is the optimal choice. Relational databases excel at enforcing strict data integrity rules, unique constraints (such as preventing duplicate emails or double enrolment), and handling structured transactional data with complex relationships and foreign key constraints. NoSQL would be better suited for unstructured logs or rapid-write document storage, but a school database heavily relies on consistent relationships and tabular querying.