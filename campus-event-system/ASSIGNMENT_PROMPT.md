# Campus Event Management System - Assignment Documentation Prompt

Use this prompt to help document your Campus Event Management System project according to assignment requirements:

## System Overview
You have built a comprehensive Campus Event Management System with the following components:

### Database Schema
**Tables and Relationships:**
- **Events**: id, name, description, date, location, capacity
- **Students**: id, name, email, year
- **Registrations**: id, student_id, event_id, registration_date
- **Attendance**: id, registration_id, attended_at
- **Feedback**: id, registration_id, score, comments, submitted_at

**Key Relationships:**
- Students can register for multiple events (many-to-many via Registrations)
- Each registration can have one attendance record
- Each registration can have one feedback record

### API Endpoints
**Core CRUD Operations:**
- `POST /api/events` - Create new event
- `GET /api/events` - List all events
- `POST /api/students` - Register new student
- `GET /api/students` - List all students
- `POST /api/registrations` - Register student for event
- `POST /api/attendance` - Mark attendance
- `POST /api/feedback` - Submit feedback

**Reporting Endpoints:**
- `GET /api/reports/event-popularity` - Events ranked by registration count
- `GET /api/reports/attendance` - Events with attendance percentages
- `GET /api/reports/feedback` - Events with average feedback scores
- `GET /api/reports/top-students` - Top 3 students by events attended

**Utility Endpoints:**
- `POST /api/init-db` - Initialize database with sample data

### Sample Data (Indian University Context)
**Events:**
- Tech Symposium 2024 (Dr. A.P.J. Abdul Kalam Auditorium)
- Campus Placement Drive (Central Placement Cell)
- Cultural Fest - Rangmanch (University Amphitheatre)
- Entrepreneurship Summit (Innovation Hub)

**Students:**
- Arjun Sharma, Priya Patel, Rahul Gupta, Sneha Reddy, Vikram Singh, Ananya Iyer, Karthik Nair, Meera Joshi
- All with university.ac.in email addresses and different academic years

### Technology Stack
- **Frontend**: Next.js 14 with React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless functions)
- **Database**: In-memory data store (for serverless compatibility)
- **UI Components**: Radix UI with shadcn/ui styling
- **Deployment**: Vercel platform

### Key Features
- Modern, professional UI with neutral color palette
- Real-time data updates
- Comprehensive reporting system
- Mobile-responsive design
- Form validation and error handling

## Assignment Documentation Tasks

### 1. AI Conversation Log
Document your interaction with AI including:
- Initial requirements gathering
- Database schema design decisions
- API endpoint planning
- UI/UX design choices
- Problem-solving for serverless deployment
- Iterations and improvements made

### 2. Design Document
Create detailed documentation covering:

**Data Tracking:**
- Events: name, description, date, location, capacity
- Student registrations with timestamps
- Attendance tracking linked to registrations
- Feedback scores (1-5) with comments

**Database Schema:**
- Draw ER diagram showing relationships between Events, Students, Registrations, Attendance, Feedback
- Note foreign key constraints and data types

**API Design:**
- List all endpoints with HTTP methods
- Document request/response payloads
- Include error handling responses

**Workflows:**
- Registration flow: Student → Event → Registration record
- Attendance flow: Registration → Check-in → Attendance record
- Feedback flow: Attendance → Feedback submission
- Reporting flow: Data aggregation → Report generation

**Assumptions & Edge Cases:**
- Duplicate registrations prevented by UI validation
- Events can be cancelled (handled in frontend)
- Missing feedback is optional (reports filter null values)
- Capacity limits enforced in registration logic

### 3. Personal README
Write in your own words:

**Project Understanding:**
- How you interpreted the campus event management requirements
- Why you chose this particular data structure
- How the system addresses real university needs

**Architecture Decisions:**
- Why in-memory storage over traditional database
- Benefits of Next.js API routes for this use case
- UI design choices for Indian university context

**Setup Instructions:**
\`\`\`bash
# Clone the repository
git clone [your-repo-url]
cd campus-event-system

# Install dependencies
npm install

# Run development server
npm run dev

# Initialize database with sample data
# Click "Initialize Database and Seed Data" in the UI
\`\`\`

### 4. Reports/Outputs
Take screenshots of:

**Event Popularity Query:**
- Shows events ranked by total registrations
- Tech Symposium, Cultural Fest, Campus Placement Drive, Entrepreneurship Summit

**Attendance Report:**
- Shows attendance percentages per event
- Demonstrates which events had better turnout

**Feedback Analysis:**
- Average scores per event (1-5 scale)
- Shows student satisfaction levels

**Top Students Report:**
- Lists top 3 most active students
- Shows engagement levels across events

### 5. Bonus Features Implemented
- **UI Mockups**: Professional design with Indian university branding
- **Event Browsing**: Clean card-based event listing
- **Registration System**: Intuitive student registration forms
- **Attendance Check-in**: Simple attendance marking interface
- **Feedback Collection**: Star rating with comments
- **Advanced Queries**: Multiple report types with sorting and filtering

### Sample Query Results to Document:
\`\`\`json
// Event Popularity
[
  {"event_name": "Tech Symposium 2024", "total_registrations": 4},
  {"event_name": "Cultural Fest - Rangmanch", "total_registrations": 2},
  {"event_name": "Campus Placement Drive", "total_registrations": 3}
]

// Top Students
[
  {"student_name": "Arjun Sharma", "events_attended": 2},
  {"student_name": "Priya Patel", "events_attended": 2},
  {"student_name": "Rahul Gupta", "events_attended": 2}
]
\`\`\`

Use this comprehensive information to complete all assignment requirements, ensuring you document both the technical implementation and your personal learning journey.
