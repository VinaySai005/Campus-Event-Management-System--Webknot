-- Student Participation Report
-- Shows events attended per student

SELECT s.name, COUNT(*) AS events_attended
FROM students s
JOIN attendance a ON s.student_id = a.student_id
WHERE a.status='present'
GROUP BY s.student_id, s.name
ORDER BY events_attended DESC;

-- Sample Output:
-- name          | events_attended
-- --------------|----------------
-- Alice Johnson | 4
-- David Wilson  | 2
-- Emma Brown    | 2
-- Bob Smith     | 1
-- Carol Davis   | 1
-- Frank Miller  | 1
-- Grace Lee     | 1
-- Henry Taylor  | 1
-- Ivy Chen      | 2
-- Jack Anderson | 1
