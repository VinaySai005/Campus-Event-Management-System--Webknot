-- Sample data for Campus Event Reporting System

-- Insert sample students
INSERT INTO students (name, email, college) VALUES
('Alice Johnson', 'alice.johnson@university.edu', 'Engineering'),
('Bob Smith', 'bob.smith@university.edu', 'Business'),
('Carol Davis', 'carol.davis@university.edu', 'Arts'),
('David Wilson', 'david.wilson@university.edu', 'Engineering'),
('Emma Brown', 'emma.brown@university.edu', 'Science'),
('Frank Miller', 'frank.miller@university.edu', 'Business'),
('Grace Lee', 'grace.lee@university.edu', 'Arts'),
('Henry Taylor', 'henry.taylor@university.edu', 'Engineering'),
('Ivy Chen', 'ivy.chen@university.edu', 'Science'),
('Jack Anderson', 'jack.anderson@university.edu', 'Business');

-- Insert sample events
INSERT INTO events (title, type, date, college, status) VALUES
('Tech Innovation Summit', 'Conference', '2024-03-15', 'Engineering', 'completed'),
('Business Leadership Workshop', 'Workshop', '2024-03-20', 'Business', 'completed'),
('Art Exhibition Opening', 'Exhibition', '2024-03-25', 'Arts', 'completed'),
('Science Research Symposium', 'Symposium', '2024-04-01', 'Science', 'completed'),
('Entrepreneurship Bootcamp', 'Bootcamp', '2024-04-10', 'Business', 'active'),
('Digital Art Workshop', 'Workshop', '2024-04-15', 'Arts', 'active'),
('AI & Machine Learning Conference', 'Conference', '2024-04-20', 'Engineering', 'active'),
('Environmental Science Fair', 'Fair', '2024-04-25', 'Science', 'active');

-- Insert sample registrations
INSERT INTO registrations (student_id, event_id) VALUES
-- Tech Innovation Summit (event_id: 1)
(1, 1), (4, 1), (8, 1), (2, 1), (5, 1),
-- Business Leadership Workshop (event_id: 2)
(2, 2), (6, 2), (10, 2), (1, 2),
-- Art Exhibition Opening (event_id: 3)
(3, 3), (7, 3), (1, 3), (9, 3),
-- Science Research Symposium (event_id: 4)
(5, 4), (9, 4), (1, 4), (4, 4), (8, 4),
-- Entrepreneurship Bootcamp (event_id: 5)
(2, 5), (6, 5), (10, 5), (3, 5), (7, 5),
-- Digital Art Workshop (event_id: 6)
(3, 6), (7, 6), (1, 6),
-- AI & Machine Learning Conference (event_id: 7)
(1, 7), (4, 7), (8, 7), (5, 7), (9, 7), (2, 7),
-- Environmental Science Fair (event_id: 8)
(5, 8), (9, 8), (1, 8), (4, 8);

-- Insert sample attendance (only for completed events)
INSERT INTO attendance (student_id, event_id, status) VALUES
-- Tech Innovation Summit
(1, 1, 'present'), (4, 1, 'present'), (8, 1, 'present'), (2, 1, 'absent'), (5, 1, 'present'),
-- Business Leadership Workshop
(2, 2, 'present'), (6, 2, 'present'), (10, 2, 'present'), (1, 2, 'present'),
-- Art Exhibition Opening
(3, 3, 'present'), (7, 3, 'present'), (1, 3, 'present'), (9, 3, 'absent'),
-- Science Research Symposium
(5, 4, 'present'), (9, 4, 'present'), (1, 4, 'present'), (4, 4, 'present'), (8, 4, 'absent');

-- Insert sample feedback (only for attended events)
INSERT INTO feedback (student_id, event_id, rating, comment) VALUES
-- Tech Innovation Summit
(1, 1, 5, 'Excellent speakers and great networking opportunities'),
(4, 1, 4, 'Very informative, could use more hands-on sessions'),
(8, 1, 5, 'Outstanding event, learned a lot about emerging technologies'),
(5, 1, 4, 'Good content, venue could be better'),
-- Business Leadership Workshop
(2, 2, 5, 'Transformative experience, great leadership insights'),
(6, 2, 4, 'Practical tips, well organized'),
(10, 2, 3, 'Average content, expected more interactive sessions'),
(1, 2, 4, 'Good cross-disciplinary learning opportunity'),
-- Art Exhibition Opening
(3, 3, 5, 'Beautiful artwork, inspiring evening'),
(7, 3, 5, 'Amazing creativity on display'),
(1, 3, 4, 'Great cultural experience'),
-- Science Research Symposium
(5, 4, 4, 'Cutting-edge research presentations'),
(9, 4, 5, 'Excellent scientific discussions'),
(1, 4, 4, 'Good interdisciplinary exposure'),
(4, 4, 3, 'Interesting but too technical for my level');
