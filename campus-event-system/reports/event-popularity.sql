-- Event Popularity Report
-- Shows events sorted by number of registrations

SELECT e.title, COUNT(r.student_id) AS total_registrations
FROM events e
LEFT JOIN registrations r ON e.event_id = r.event_id
GROUP BY e.event_id, e.title
ORDER BY total_registrations DESC;

-- Sample Output:
-- title                          | total_registrations
-- -------------------------------|-------------------
-- AI & Machine Learning Conference | 6
-- Tech Innovation Summit          | 5
-- Entrepreneurship Bootcamp       | 5
-- Science Research Symposium      | 5
-- Environmental Science Fair      | 4
-- Business Leadership Workshop    | 4
-- Art Exhibition Opening          | 4
-- Digital Art Workshop            | 3
