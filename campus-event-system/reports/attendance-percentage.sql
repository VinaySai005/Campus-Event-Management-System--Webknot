-- Attendance Percentage Report
-- Shows attendance percentage per event

SELECT e.title,
       COUNT(a.student_id) AS total_marked,
       SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) AS present_count,
       ROUND(SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.student_id), 2) AS attendance_percentage
FROM events e
JOIN attendance a ON e.event_id = a.event_id
GROUP BY e.event_id, e.title
ORDER BY attendance_percentage DESC;

-- Sample Output:
-- title                        | total_marked | present_count | attendance_percentage
-- -----------------------------|--------------|---------------|---------------------
-- Business Leadership Workshop | 4            | 4             | 100.00
-- Art Exhibition Opening       | 4            | 3             | 75.00
-- Science Research Symposium   | 5            | 4             | 80.00
-- Tech Innovation Summit       | 5            | 4             | 80.00
