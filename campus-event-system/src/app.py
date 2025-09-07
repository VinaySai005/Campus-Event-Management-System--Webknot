from flask import Flask, request, jsonify
import sqlite3
import os
from datetime import datetime
import json

app = Flask(__name__)

# Database configuration
DATABASE_PATH = 'db/campus_events.db'

def get_db_connection():
    """Get database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def init_database():
    """Initialize database with schema and seed data"""
    if not os.path.exists('db'):
        os.makedirs('db')
    
    conn = get_db_connection()
    
    # Read and execute schema
    with open('db/schema.sql', 'r') as f:
        conn.executescript(f.read())
    
    # Read and execute seed data
    with open('db/seed.sql', 'r') as f:
        conn.executescript(f.read())
    
    conn.commit()
    conn.close()
    print("Database initialized successfully!")

@app.route('/events', methods=['GET'])
def get_events():
    """Get all events"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT event_id, title, type, date, college, status
            FROM events
            ORDER BY date DESC
        ''')
        
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'events': events}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get a specific event by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT event_id, title, type, date, college, status
            FROM events
            WHERE event_id = ?
        ''', (event_id,))
        
        event = cursor.fetchone()
        conn.close()
        
        if event:
            return jsonify({'event': dict(event)}), 200
        else:
            return jsonify({'error': 'Event not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/students', methods=['GET'])
def get_students():
    """Get all students"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT student_id, name, email, college
            FROM students
            ORDER BY name
        ''')
        
        students = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'students': students}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    """Get a specific student by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT student_id, name, email, college
            FROM students
            WHERE student_id = ?
        ''', (student_id,))
        
        student = cursor.fetchone()
        conn.close()
        
        if student:
            return jsonify({'student': dict(student)}), 200
        else:
            return jsonify({'error': 'Student not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/events/<int:event_id>/registrations', methods=['GET'])
def get_event_registrations(event_id):
    """Get all registrations for a specific event"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT r.reg_id, r.student_id, r.event_id, r.registration_date,
                   s.name, s.email, s.college
            FROM registrations r
            JOIN students s ON r.student_id = s.student_id
            WHERE r.event_id = ?
            ORDER BY r.registration_date
        ''', (event_id,))
        
        registrations = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({'registrations': registrations}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# API Routes

@app.route('/events', methods=['POST'])
def create_event():
    """Create a new event"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'type', 'date', 'college']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO events (title, type, date, college, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (data['title'], data['type'], data['date'], data['college'], 
              data.get('status', 'active')))
        
        event_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Event created successfully',
            'event_id': event_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/students', methods=['POST'])
def create_student():
    """Create a new student"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'college']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO students (name, email, college)
            VALUES (?, ?, ?)
        ''', (data['name'], data['email'], data['college']))
        
        student_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Student created successfully',
            'student_id': student_id
        }), 201
        
    except sqlite3.IntegrityError as e:
        return jsonify({'error': 'Email already exists'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/registrations', methods=['POST'])
def create_registration():
    """Register a student to an event"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['student_id', 'event_id']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if student and event exist
        cursor.execute('SELECT student_id FROM students WHERE student_id = ?', (data['student_id'],))
        if not cursor.fetchone():
            return jsonify({'error': 'Student not found'}), 404
            
        cursor.execute('SELECT event_id FROM events WHERE event_id = ?', (data['event_id'],))
        if not cursor.fetchone():
            return jsonify({'error': 'Event not found'}), 404
        
        cursor.execute('''
            INSERT INTO registrations (student_id, event_id)
            VALUES (?, ?)
        ''', (data['student_id'], data['event_id']))
        
        reg_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Registration successful',
            'registration_id': reg_id
        }), 201
        
    except sqlite3.IntegrityError as e:
        return jsonify({'error': 'Student already registered for this event'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/attendance', methods=['POST'])
def mark_attendance():
    """Mark student attendance for an event"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['student_id', 'event_id', 'status']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if data['status'] not in ['present', 'absent']:
            return jsonify({'error': 'Status must be either "present" or "absent"'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if student is registered for the event
        cursor.execute('''
            SELECT reg_id FROM registrations 
            WHERE student_id = ? AND event_id = ?
        ''', (data['student_id'], data['event_id']))
        
        if not cursor.fetchone():
            return jsonify({'error': 'Student must be registered for the event first'}), 400
        
        cursor.execute('''
            INSERT OR REPLACE INTO attendance (student_id, event_id, status)
            VALUES (?, ?, ?)
        ''', (data['student_id'], data['event_id'], data['status']))
        
        attendance_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Attendance marked successfully',
            'attendance_id': attendance_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/feedback', methods=['POST'])
def submit_feedback():
    """Submit feedback rating for an event"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['student_id', 'event_id', 'rating']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        if not (1 <= data['rating'] <= 5):
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if student attended the event
        cursor.execute('''
            SELECT attendance_id FROM attendance 
            WHERE student_id = ? AND event_id = ? AND status = 'present'
        ''', (data['student_id'], data['event_id']))
        
        if not cursor.fetchone():
            return jsonify({'error': 'Feedback allowed only for attended events'}), 400
        
        cursor.execute('''
            INSERT OR REPLACE INTO feedback (student_id, event_id, rating, comment)
            VALUES (?, ?, ?, ?)
        ''', (data['student_id'], data['event_id'], data['rating'], 
              data.get('comment', '')))
        
        feedback_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'message': 'Feedback submitted successfully',
            'feedback_id': feedback_id
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Reporting endpoints
@app.route('/reports/event-popularity', methods=['GET'])
def get_event_popularity():
    """Get event popularity report - total registrations per event"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT e.event_id, e.title, e.type, e.date, e.college,
                   COUNT(r.student_id) AS total_registrations
            FROM events e
            LEFT JOIN registrations r ON e.event_id = r.event_id
            GROUP BY e.event_id, e.title, e.type, e.date, e.college
            ORDER BY total_registrations DESC, e.title
        ''')
        
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'report_type': 'event_popularity',
            'events': events
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reports/attendance', methods=['GET'])
def get_attendance_report():
    """Get attendance percentage report per event"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT e.event_id, e.title, e.type, e.date, e.college,
                   COUNT(a.student_id) AS total_attendees,
                   SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) AS present_count,
                   CASE 
                       WHEN COUNT(a.student_id) > 0 THEN
                           ROUND(SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.student_id), 2)
                       ELSE 0
                   END AS attendance_percentage
            FROM events e
            LEFT JOIN attendance a ON e.event_id = a.event_id
            GROUP BY e.event_id, e.title, e.type, e.date, e.college
            ORDER BY attendance_percentage DESC, e.title
        ''')
        
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'report_type': 'attendance_percentage',
            'events': events
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reports/feedback', methods=['GET'])
def get_feedback_report():
    """Get average feedback score per event"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT e.event_id, e.title, e.type, e.date, e.college,
                   COUNT(f.rating) AS feedback_count,
                   ROUND(AVG(f.rating), 2) AS average_rating
            FROM events e
            LEFT JOIN feedback f ON e.event_id = f.event_id
            GROUP BY e.event_id, e.title, e.type, e.date, e.college
            HAVING COUNT(f.rating) > 0
            ORDER BY average_rating DESC, feedback_count DESC, e.title
        ''')
        
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'report_type': 'average_feedback',
            'events': events
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reports/student-participation/<int:student_id>', methods=['GET'])
def get_student_participation(student_id):
    """Get events attended by a specific student"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First check if student exists
        cursor.execute('SELECT name, email, college FROM students WHERE student_id = ?', (student_id,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({'error': 'Student not found'}), 404
        
        cursor.execute('''
            SELECT e.event_id, e.title, e.type, e.date, e.college,
                   a.status AS attendance_status,
                   f.rating AS feedback_rating,
                   f.comment AS feedback_comment
            FROM events e
            JOIN attendance a ON e.event_id = a.event_id
            LEFT JOIN feedback f ON e.event_id = f.event_id AND f.student_id = a.student_id
            WHERE a.student_id = ? AND a.status = 'present'
            ORDER BY e.date DESC
        ''')
        
        events = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'report_type': 'student_participation',
            'student': dict(student),
            'student_id': student_id,
            'events_attended': len(events),
            'events': events
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/reports/top-students', methods=['GET'])
def get_top_students():
    """Get top 3 students by events attended"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT s.student_id, s.name, s.email, s.college,
                   COUNT(a.event_id) AS events_attended
            FROM students s
            JOIN attendance a ON s.student_id = a.student_id
            WHERE a.status = 'present'
            GROUP BY s.student_id, s.name, s.email, s.college
            ORDER BY events_attended DESC, s.name
            LIMIT 3
        ''')
        
        students = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'report_type': 'top_students',
            'students': students
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Initialize database on startup
    init_database()
    
    print("Campus Event Reporting System API")
    print("Database initialized with sample data")
    print("Server starting on http://localhost:5000")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
