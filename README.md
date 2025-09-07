# Campus-Event-Management-System--Webknot

Campus Event Management System
A comprehensive system for managing college events, built with Flask and SQLite. This tool helps organize events, track student participation, and generate useful reports.

Features
Event Management: Create and view upcoming campus events

Student Registration: Register students for events they want to attend

Attendance Tracking: Record which students actually attended events

Feedback Collection: Gather ratings and comments from attendees

Reporting: Generate analytics on event popularity and participation

Project Structure
/
├── src/

│   ├── app.py              # Main application file

│   └── requirements.txt    # Python dependencies

├── db/

│   ├── schema.sql          # Database structure

│   ├── seed.sql            # Sample data

│   └── campus_events.db    # Database file (created automatically)

├── reports/

│   ├── event-popularity.sql      # Popular events query

│   ├── attendance-percentage.sql # Attendance tracking

│   ├── average-feedback.sql      # Feedback analysis

│   ├── student-participation.sql # Student activity

│   └── top-students.sql          # Top participants

└── README.md              # This documentation
Installation
Prerequisites
Python 3.7 or newer

pip package manager

Setup Instructions
Download the project files

Install required packages

bash
cd src
pip install -r requirements.txt
Launch the application

bash
python app.py
Access the system at http://localhost:5000 using a web browser or API testing tool. The database initializes automatically with sample data on first run.

Database Schema
Tables
students: Student information (ID, name, email, college)

events: Event details (ID, title, type, date, location, status)

registrations: Event registrations (ID, student ID, event ID)

attendance: Attendance records (ID, student ID, event ID, status)

feedback: Event feedback (ID, student ID, event ID, rating, comment)

Constraints
Students may register for each event only once

Attendance recording requires prior registration

Feedback submission requires verified attendance

Ratings must be on a 1-5 scale

API Reference
Core Operations
Create Event
http
POST /events
Content-Type: application/json

{
  "title": "AI Workshop",
  "type": "Workshop",
  "date": "2024-05-01",
  "college": "Engineering",
  "status": "active"
}
Create Student
http
POST /students
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@university.edu",
  "college": "Engineering"
}
Register for Event
http
POST /registrations
Content-Type: application/json

{
  "student_id": 1,
  "event_id": 1
}
Record Attendance
http
POST /attendance
Content-Type: application/json

{
  "student_id": 1,
  "event_id": 1,
  "status": "present"
}
Submit Feedback
http
POST /feedback
Content-Type: application/json

{
  "student_id": 1,
  "event_id": 1,
  "rating": 5,
  "comment": "Excellent workshop!"
}
Data Retrieval
List Events
http
GET /events
Get Event Details
http
GET /events/1
List Students
http
GET /students
View Event Registrations
http
GET /events/1/registrations
Reporting Endpoints
Event Popularity Report
http
GET /reports/event-popularity
Returns events sorted by registration numbers.

Attendance Report
http
GET /reports/attendance
Shows attendance percentages for each event.

Feedback Report
http
GET /reports/feedback
Displays average feedback scores per event.

Student Participation Report
http
GET /reports/student-participation/1
Shows events attended by a specific student.

Top Students Report
http
GET /reports/top-students
Identifies the three most active students.

Sample Data
The system includes pre-loaded sample data:

10 students from various colleges

8 events of different types

Registration, attendance, and feedback records

API Testing
Test endpoints using:

curl: Command-line tool

Postman: Graphical interface

HTTPie: User-friendly command alternative

Example Commands
bash
# Retrieve all events
curl http://localhost:5000/events

# Create new student
curl -X POST http://localhost:5000/students \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Student","email":"test@university.edu","college":"Science"}'

# Generate popularity report
curl http://localhost:5000/reports/event-popularity
Error Handling
The API returns standard HTTP status codes:

200: Successful request

201: Resource created successfully

400: Invalid request parameters

404: Resource not found

500: Server error

Error responses include descriptive messages:

json
{
  "error": "Student already registered for this event"
}
Technical Notes
Database auto-initializes on first launch

Foreign key constraints enforce data integrity

Unique constraints prevent duplicate registrations

Business rules ensure data validity

Troubleshooting
Database Issues: Delete db/campus_events.db and restart to regenerate.

Port Conflicts: Modify the port number in app.py if 5000 is unavailable.

Permission Errors: Verify write permissions in the project directory.
