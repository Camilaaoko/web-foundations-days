-- 1. CREATE TABLES
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT
);

CREATE TABLE enrolments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    UNIQUE(student_id, course_id)
);


-- 2. INSERT SAMPLE DATA
-- Add at least 3 students
INSERT INTO students (name, email) VALUES 
('Alice Wanjiku', 'alice@example.com'),
('Brian Kiprop', 'brian@example.com'),
('Cynthia Achieng', 'cynthia@example.com'),
('David Omondi', 'david@example.com'); -- Added 4th student to test "no enrolments" query

-- Add at least 3 courses
INSERT INTO courses (title, description) VALUES 
('Database Engineering', 'Introduction to SQL and relational databases'),
('Web Development', 'HTML, CSS, and JavaScript fundamentals'),
('Project Management', 'Agile and PMBOK methodologies');

-- Add at least 5 enrolments (preventing duplicate student-course pairs)
INSERT INTO enrolments (student_id, course_id, grade) VALUES 
(1, 1, 'A'),
(1, 2, 'B+'),
(2, 1, 'A-'),
(2, 3, 'B'),
(3, 2, 'A');


-- 3. FIVE REQUIRED QUERIES

-- Query 1: All courses for one student (by name, e.g., 'Alice Wanjiku')
SELECT c.title, c.description, e.grade 
FROM courses c
JOIN enrolments e ON c.id = e.course_id
JOIN students s ON s.id = e.student_id
WHERE s.name = 'Alice Wanjiku';

-- Query 2: All students on one course (e.g., 'Database Engineering')
SELECT s.name, s.email, e.grade 
FROM students s
JOIN enrolments e ON s.id = e.student_id
JOIN courses c ON c.id = e.course_id
WHERE c.title = 'Database Engineering';

-- Query 3: The number of students per course
SELECT c.title, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.id = e.course_id
GROUP BY c.id, c.title;

-- Query 4: Students who have no enrolments
SELECT s.name, s.email 
FROM students s
LEFT JOIN enrolments e ON s.id = e.student_id
WHERE e.id IS NULL;

-- Query 5: Update one enrolment's grade
UPDATE enrolments 
SET grade = 'A+' 
WHERE student_id = 1 AND course_id = 1;