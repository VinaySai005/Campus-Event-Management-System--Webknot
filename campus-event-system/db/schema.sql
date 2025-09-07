-- Campus Event Reporting System Database Schema

-- Students table
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    college VARCHAR(100) NOT NULL
);

-- Events table
CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    college VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed'))
);

-- Registrations table
CREATE TABLE registrations (
    reg_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE(student_id, event_id) -- A student can register only once per event
);

-- Attendance table
CREATE TABLE attendance (
    attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    status VARCHAR(10) NOT NULL CHECK (status IN ('present', 'absent')),
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE(student_id, event_id), -- One attendance record per student per event
    -- Ensure attendance requires prior registration
    FOREIGN KEY (student_id, event_id) REFERENCES registrations(student_id, event_id)
);

-- Feedback table
CREATE TABLE feedback (
    feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    UNIQUE(student_id, event_id), -- One feedback per student per event
    -- Ensure feedback allowed only if attended
    FOREIGN KEY (student_id, event_id) REFERENCES attendance(student_id, event_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_registrations_student ON registrations(student_id);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_event ON attendance(event_id);
CREATE INDEX idx_feedback_event ON feedback(event_id);
