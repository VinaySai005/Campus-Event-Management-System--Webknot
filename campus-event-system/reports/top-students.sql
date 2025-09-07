-- Top 3 Most Active Students
-- Shows top 3 students by events attended

SELECT s.name, 
       s.email,
       s.college,
       COUNT(*) AS events_attended
FROM students s
JOIN attendance a ON s.student_id = a.student_id
WHERE a.status='present'
GROUP BY s.student_id, s.name, s.email, s.college
ORDER BY events_attended DESC, s.name
LIMIT 3;

-- Sample Output:
-- name          | email                        | college     | events_attended
-- --------------|------------------------------|-------------|----------------
-- Alice Johnson | alice.johnson@university.edu | Engineering | 4
-- David Wilson  | david.wilson@university.edu  | Engineering | 2
-- Emma Brown    | emma.brown@university.edu    | Science     | 2
