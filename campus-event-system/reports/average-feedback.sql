-- Average Feedback Report
-- Shows average rating per event

SELECT e.title, 
       COUNT(f.rating) AS feedback_count,
       ROUND(AVG(f.rating), 2) AS average_rating
FROM events e
JOIN feedback f ON e.event_id = f.event_id
GROUP BY e.event_id, e.title
ORDER BY average_rating DESC;

-- Sample Output:
-- title                        | feedback_count | average_rating
-- -----------------------------|----------------|---------------
-- Tech Innovation Summit       | 4              | 4.50
-- Art Exhibition Opening       | 3              | 4.67
-- Business Leadership Workshop | 4              | 4.00
-- Science Research Symposium   | 4              | 4.00
