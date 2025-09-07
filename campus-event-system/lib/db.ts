interface Event {
  id: number
  name: string
  description: string
  date: string
  location: string
  capacity: number
}

interface Student {
  id: number
  name: string
  email: string
  year: number
}

interface Registration {
  id: number
  student_id: number
  event_id: number
  registration_date: string
}

interface Attendance {
  id: number
  registration_id: number
  attended_at: string
}

interface Feedback {
  id: number
  registration_id: number
  score: number
  comments: string
  submitted_at: string
}

// In-memory data store
let dataStore = {
  events: [] as Event[],
  students: [] as Student[],
  registrations: [] as Registration[],
  attendance: [] as Attendance[],
  feedback: [] as Feedback[],
  initialized: false,
  nextIds: {
    events: 1,
    students: 1,
    registrations: 1,
    attendance: 1,
    feedback: 1,
  },
}

export async function getDb() {
  return {
    all: async (query: string, params: any[] = []) => {
      // Parse different query types and return appropriate data
      if (query.includes("FROM events") && query.includes("ORDER BY date DESC")) {
        return dataStore.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      }

      if (query.includes("FROM students") && query.includes("ORDER BY name")) {
        return dataStore.students.sort((a, b) => a.name.localeCompare(b.name))
      }

      // Event popularity report
      if (query.includes("total_registrations") && query.includes("FROM events e")) {
        return dataStore.events
          .map((event) => ({
            event_name: event.name,
            total_registrations: dataStore.registrations.filter((r) => r.event_id === event.id).length,
          }))
          .sort((a, b) => b.total_registrations - a.total_registrations)
      }

      // Attendance report
      if (query.includes("attendance_percentage") && query.includes("FROM events e")) {
        return dataStore.events
          .map((event) => {
            const registrations = dataStore.registrations.filter((r) => r.event_id === event.id)
            const attendances = dataStore.attendance.filter((a) =>
              registrations.some((r) => r.id === a.registration_id),
            )
            const percentage =
              registrations.length === 0
                ? 0
                : Math.round(((attendances.length * 100.0) / registrations.length) * 100) / 100
            return {
              event_name: event.name,
              attendance_percentage: percentage,
            }
          })
          .sort((a, b) => b.attendance_percentage - a.attendance_percentage)
      }

      // Feedback report
      if (query.includes("average_feedback") && query.includes("FROM events e")) {
        return dataStore.events
          .map((event) => {
            const registrations = dataStore.registrations.filter((r) => r.event_id === event.id)
            const feedbacks = dataStore.feedback.filter((f) => registrations.some((r) => r.id === f.registration_id))
            if (feedbacks.length === 0) return null
            const average = Math.round((feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length) * 100) / 100
            return {
              event_name: event.name,
              average_feedback: average,
            }
          })
          .filter(Boolean)
          .sort((a, b) => b.average_feedback - a.average_feedback)
      }

      // Top students report
      if (query.includes("events_attended") && query.includes("FROM students s")) {
        return dataStore.students
          .map((student) => {
            const registrations = dataStore.registrations.filter((r) => r.student_id === student.id)
            const attendances = dataStore.attendance.filter((a) =>
              registrations.some((r) => r.id === a.registration_id),
            )
            return {
              student_name: student.name,
              events_attended: attendances.length,
            }
          })
          .filter((s) => s.events_attended > 0)
          .sort((a, b) => b.events_attended - a.events_attended)
          .slice(0, 3)
      }

      return []
    },

    run: async (query: string, params: any[] = []) => {
      if (query.includes("INSERT INTO events")) {
        const [name, description, date, location, capacity] = params
        const newEvent: Event = {
          id: dataStore.nextIds.events++,
          name,
          description,
          date,
          location,
          capacity,
        }
        dataStore.events.push(newEvent)
        return { lastID: newEvent.id }
      }

      if (query.includes("INSERT INTO students")) {
        const [name, email, year] = params
        const newStudent: Student = {
          id: dataStore.nextIds.students++,
          name,
          email,
          year,
        }
        dataStore.students.push(newStudent)
        return { lastID: newStudent.id }
      }

      return { lastID: 0 }
    },
  }
}

export async function initializeDatabase() {
  if (dataStore.initialized) return

  // Reset data store
  dataStore = {
    events: [
      {
        id: 1,
        name: "Tech Symposium 2024",
        description: "Annual technology symposium featuring AI, blockchain, and emerging technologies",
        date: "2024-03-15T09:00:00",
        location: "Dr. A.P.J. Abdul Kalam Auditorium",
        capacity: 300,
      },
      {
        id: 2,
        name: "Campus Placement Drive",
        description: "Meet top recruiters from leading Indian and multinational companies",
        date: "2024-03-20T10:00:00",
        location: "Central Placement Cell",
        capacity: 200,
      },
      {
        id: 3,
        name: "Cultural Fest - Rangmanch",
        description: "Celebrate diversity with music, dance, and cultural performances",
        date: "2024-04-01T18:00:00",
        location: "University Amphitheatre",
        capacity: 500,
      },
      {
        id: 4,
        name: "Entrepreneurship Summit",
        description: "Learn from successful Indian entrepreneurs and startup founders",
        date: "2024-04-10T14:00:00",
        location: "Innovation Hub",
        capacity: 150,
      },
    ],
    students: [
      { id: 1, name: "Arjun Sharma", email: "arjun.sharma@university.ac.in", year: 3 },
      { id: 2, name: "Priya Patel", email: "priya.patel@university.ac.in", year: 2 },
      { id: 3, name: "Rahul Gupta", email: "rahul.gupta@university.ac.in", year: 4 },
      { id: 4, name: "Sneha Reddy", email: "sneha.reddy@university.ac.in", year: 1 },
      { id: 5, name: "Vikram Singh", email: "vikram.singh@university.ac.in", year: 3 },
      { id: 6, name: "Ananya Iyer", email: "ananya.iyer@university.ac.in", year: 2 },
      { id: 7, name: "Karthik Nair", email: "karthik.nair@university.ac.in", year: 4 },
      { id: 8, name: "Meera Joshi", email: "meera.joshi@university.ac.in", year: 1 },
    ],
    registrations: [
      { id: 1, student_id: 1, event_id: 1, registration_date: "2024-03-01T10:00:00" },
      { id: 2, student_id: 1, event_id: 2, registration_date: "2024-03-02T10:00:00" },
      { id: 3, student_id: 2, event_id: 1, registration_date: "2024-03-03T10:00:00" },
      { id: 4, student_id: 2, event_id: 3, registration_date: "2024-03-04T10:00:00" },
      { id: 5, student_id: 3, event_id: 2, registration_date: "2024-03-05T10:00:00" },
      { id: 6, student_id: 3, event_id: 3, registration_date: "2024-03-06T10:00:00" },
      { id: 7, student_id: 4, event_id: 1, registration_date: "2024-03-07T10:00:00" },
      { id: 8, student_id: 5, event_id: 4, registration_date: "2024-03-08T10:00:00" },
      { id: 9, student_id: 6, event_id: 1, registration_date: "2024-03-09T10:00:00" },
      { id: 10, student_id: 7, event_id: 2, registration_date: "2024-03-10T10:00:00" },
    ],
    attendance: [
      { id: 1, registration_id: 1, attended_at: "2024-03-15T09:00:00" },
      { id: 2, registration_id: 2, attended_at: "2024-03-20T10:00:00" },
      { id: 3, registration_id: 3, attended_at: "2024-03-15T09:00:00" },
      { id: 4, registration_id: 5, attended_at: "2024-03-20T10:00:00" },
      { id: 5, registration_id: 6, attended_at: "2024-04-01T18:00:00" },
      { id: 6, registration_id: 8, attended_at: "2024-04-10T14:00:00" },
      { id: 7, registration_id: 9, attended_at: "2024-03-15T09:00:00" },
    ],
    feedback: [
      {
        id: 1,
        registration_id: 1,
        score: 5,
        comments: "Excellent symposium! Very informative sessions.",
        submitted_at: "2024-03-15T17:00:00",
      },
      {
        id: 2,
        registration_id: 2,
        score: 4,
        comments: "Great placement opportunities and company interactions",
        submitted_at: "2024-03-20T17:00:00",
      },
      {
        id: 3,
        registration_id: 3,
        score: 5,
        comments: "Outstanding technical content and speakers",
        submitted_at: "2024-03-15T17:00:00",
      },
      {
        id: 4,
        registration_id: 5,
        score: 3,
        comments: "Good event but could improve organization",
        submitted_at: "2024-03-20T17:00:00",
      },
      {
        id: 5,
        registration_id: 6,
        score: 4,
        comments: "Amazing cultural performances and diversity",
        submitted_at: "2024-04-01T22:00:00",
      },
      {
        id: 6,
        registration_id: 8,
        score: 5,
        comments: "Inspiring entrepreneurs and valuable insights",
        submitted_at: "2024-04-10T18:00:00",
      },
    ],
    initialized: true,
    nextIds: {
      events: 5,
      students: 9,
      registrations: 11,
      attendance: 8,
      feedback: 7,
    },
  }
}
