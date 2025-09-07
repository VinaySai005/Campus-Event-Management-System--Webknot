# Campus Event Reporting System - API Documentation

## Base URL
\`\`\`
http://localhost:5000
\`\`\`

## Authentication
No authentication required for this prototype.

## Content Type
All POST requests require `Content-Type: application/json` header.

---

## Events API

### Create Event
Creates a new campus event.

**Endpoint:** `POST /events`

**Request Body:**
\`\`\`json
{
  "title": "Tech Innovation Summit",
  "type": "Conference",
  "date": "2024-03-15",
  "college": "Engineering",
  "status": "active"
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "message": "Event created successfully",
  "event_id": 1
}
\`\`\`

**Validation Rules:**
- `title`: Required, max 200 characters
- `type`: Required, max 50 characters
- `date`: Required, format: YYYY-MM-DD
- `college`: Required, max 100 characters
- `status`: Optional, values: "active", "cancelled", "completed" (default: "active")

### Get All Events
Retrieves all events in the system.

**Endpoint:** `GET /events`

**Response:** `200 OK`
\`\`\`json
{
  "events": [
    {
      "event_id": 1,
      "title": "Tech Innovation Summit",
      "type": "Conference",
      "date": "2024-03-15",
      "college": "Engineering",
      "status": "completed"
    }
  ]
}
\`\`\`

### Get Event by ID
Retrieves a specific event.

**Endpoint:** `GET /events/{event_id}`

**Response:** `200 OK`
\`\`\`json
{
  "event": {
    "event_id": 1,
    "title": "Tech Innovation Summit",
    "type": "Conference",
    "date": "2024-03-15",
    "college": "Engineering",
    "status": "completed"
  }
}
\`\`\`

---

## Students API

### Create Student
Creates a new student record.

**Endpoint:** `POST /students`

**Request Body:**
\`\`\`json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@university.edu",
  "college": "Engineering"
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "message": "Student created successfully",
  "student_id": 1
}
\`\`\`

**Validation Rules:**
- `name`: Required, max 100 characters
- `email`: Required, unique, max 100 characters
- `college`: Required, max 100 characters

### Get All Students
Retrieves all students in the system.

**Endpoint:** `GET /students`

**Response:** `200 OK`
\`\`\`json
{
  "students": [
    {
      "student_id": 1,
      "name": "Alice Johnson",
      "email": "alice.johnson@university.edu",
      "college": "Engineering"
    }
  ]
}
\`\`\`

---

## Registrations API

### Register Student for Event
Registers a student for an event.

**Endpoint:** `POST /registrations`

**Request Body:**
\`\`\`json
{
  "student_id": 1,
  "event_id": 1
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "message": "Registration successful",
  "registration_id": 1
}
\`\`\`

**Business Rules:**
- Student must exist
- Event must exist
- Student can register only once per event

### Get Event Registrations
Retrieves all registrations for a specific event.

**Endpoint:** `GET /events/{event_id}/registrations`

**Response:** `200 OK`
\`\`\`json
{
  "registrations": [
    {
      "reg_id": 1,
      "student_id": 1,
      "event_id": 1,
      "registration_date": "2024-03-10T10:30:00",
      "name": "Alice Johnson",
      "email": "alice.johnson@university.edu",
      "college": "Engineering"
    }
  ]
}
\`\`\`

---

## Attendance API

### Mark Attendance
Marks student attendance for an event.

**Endpoint:** `POST /attendance`

**Request Body:**
\`\`\`json
{
  "student_id": 1,
  "event_id": 1,
  "status": "present"
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "message": "Attendance marked successfully",
  "attendance_id": 1
}
\`\`\`

**Validation Rules:**
- `status`: Must be "present" or "absent"
- Student must be registered for the event first

---

## Feedback API

### Submit Feedback
Submits feedback rating for an event.

**Endpoint:** `POST /feedback`

**Request Body:**
\`\`\`json
{
  "student_id": 1,
  "event_id": 1,
  "rating": 5,
  "comment": "Excellent event with great speakers!"
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "message": "Feedback submitted successfully",
  "feedback_id": 1
}
\`\`\`

**Validation Rules:**
- `rating`: Required, integer between 1-5
- `comment`: Optional, text field
- Student must have attended the event (status = "present")

---

## Reports API

### Event Popularity Report
Shows events ranked by total registrations.

**Endpoint:** `GET /reports/event-popularity`

**Response:** `200 OK`
\`\`\`json
{
  "report_type": "event_popularity",
  "events": [
    {
      "event_id": 7,
      "title": "AI & Machine Learning Conference",
      "type": "Conference",
      "date": "2024-04-20",
      "college": "Engineering",
      "total_registrations": 6
    }
  ]
}
\`\`\`

### Attendance Percentage Report
Shows attendance percentage for each event.

**Endpoint:** `GET /reports/attendance`

**Response:** `200 OK`
\`\`\`json
{
  "report_type": "attendance_percentage",
  "events": [
    {
      "event_id": 2,
      "title": "Business Leadership Workshop",
      "type": "Workshop",
      "date": "2024-03-20",
      "college": "Business",
      "total_attendees": 4,
      "present_count": 4,
      "attendance_percentage": 100.0
    }
  ]
}
\`\`\`

### Average Feedback Report
Shows average feedback rating for each event.

**Endpoint:** `GET /reports/feedback`

**Response:** `200 OK`
\`\`\`json
{
  "report_type": "average_feedback",
  "events": [
    {
      "event_id": 3,
      "title": "Art Exhibition Opening",
      "type": "Exhibition",
      "date": "2024-03-25",
      "college": "Arts",
      "feedback_count": 3,
      "average_rating": 4.67
    }
  ]
}
\`\`\`

### Student Participation Report
Shows events attended by a specific student.

**Endpoint:** `GET /reports/student-participation/{student_id}`

**Response:** `200 OK`
\`\`\`json
{
  "report_type": "student_participation",
  "student": {
    "name": "Alice Johnson",
    "email": "alice.johnson@university.edu",
    "college": "Engineering"
  },
  "student_id": 1,
  "events_attended": 4,
  "events": [
    {
      "event_id": 1,
      "title": "Tech Innovation Summit",
      "type": "Conference",
      "date": "2024-03-15",
      "college": "Engineering",
      "attendance_status": "present",
      "feedback_rating": 5,
      "feedback_comment": "Excellent speakers and great networking opportunities"
    }
  ]
}
\`\`\`

### Top Students Report
Shows top 3 most active students by events attended.

**Endpoint:** `GET /reports/top-students`

**Response:** `200 OK`
\`\`\`json
{
  "report_type": "top_students",
  "students": [
    {
      "student_id": 1,
      "name": "Alice Johnson",
      "email": "alice.johnson@university.edu",
      "college": "Engineering",
      "events_attended": 4
    }
  ]
}
\`\`\`

---

## Error Responses

### 400 Bad Request
\`\`\`json
{
  "error": "Missing required field: title"
}
\`\`\`

### 404 Not Found
\`\`\`json
{
  "error": "Student not found"
}
\`\`\`

### 500 Internal Server Error
\`\`\`json
{
  "error": "Internal server error"
}
\`\`\`

---

## Common Error Scenarios

1. **Duplicate Registration**: Student already registered for event
2. **Missing Registration**: Trying to mark attendance without registration
3. **Missing Attendance**: Trying to submit feedback without attending
4. **Invalid Rating**: Rating not between 1-5
5. **Duplicate Email**: Email already exists when creating student
6. **Invalid Status**: Attendance status not "present" or "absent"
