"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Users, TrendingUp, Star, GraduationCap, MapPin } from "lucide-react"

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

interface ReportData {
  event_name?: string
  total_registrations?: number
  attendance_percentage?: number
  average_feedback?: number
  student_name?: string
  events_attended?: number
}

export default function CampusEventSystem() {
  const [events, setEvents] = useState<Event[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [reports, setReports] = useState<{
    popularity: ReportData[]
    attendance: ReportData[]
    feedback: ReportData[]
    topStudents: ReportData[]
  }>({
    popularity: [],
    attendance: [],
    feedback: [],
    topStudents: [],
  })

  // Form states
  const [eventForm, setEventForm] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  })

  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    year: "",
  })

  useEffect(() => {
    fetchEvents()
    fetchStudents()
    fetchReports()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchReports = async () => {
    try {
      const [popularityRes, attendanceRes, feedbackRes, topStudentsRes] = await Promise.all([
        fetch("/api/reports/event-popularity"),
        fetch("/api/reports/attendance"),
        fetch("/api/reports/feedback"),
        fetch("/api/reports/top-students"),
      ])

      const popularity = popularityRes.ok ? await popularityRes.json() : []
      const attendance = attendanceRes.ok ? await attendanceRes.json() : []
      const feedback = feedbackRes.ok ? await feedbackRes.json() : []
      const topStudents = topStudentsRes.ok ? await topStudentsRes.json() : []

      setReports({ popularity, attendance, feedback, topStudents })
    } catch (error) {
      console.error("Error fetching reports:", error)
    }
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventForm,
          capacity: Number.parseInt(eventForm.capacity),
        }),
      })

      if (response.ok) {
        setEventForm({ name: "", description: "", date: "", location: "", capacity: "" })
        fetchEvents()
      }
    } catch (error) {
      console.error("Error creating event:", error)
    }
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...studentForm,
          year: Number.parseInt(studentForm.year),
        }),
      })

      if (response.ok) {
        setStudentForm({ name: "", email: "", year: "" })
        fetchStudents()
      }
    } catch (error) {
      console.error("Error creating student:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <GraduationCap className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900">Campus Event System</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {""}
          </p>
        </div>

        <Tabs defaultValue="events" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-16 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm rounded-xl">
            <TabsTrigger
              value="events"
              className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              Students
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="manage"
              className="text-lg font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
            >
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 p-8">
                  <CardTitle className="text-2xl text-gray-900 font-semibold">Create New Event</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Add a new campus event to engage students
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleEventSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="event-name" className="text-base font-medium text-gray-700">
                        Event Name
                      </Label>
                      <Input
                        id="event-name"
                        value={eventForm.name}
                        onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                        placeholder="Enter event name"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="event-description" className="text-base font-medium text-gray-700">
                        Description
                      </Label>
                      <Textarea
                        id="event-description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl resize-none text-base"
                        placeholder="Describe your event"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="event-date" className="text-base font-medium text-gray-700">
                          Date & Time
                        </Label>
                        <Input
                          id="event-date"
                          type="datetime-local"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="event-capacity" className="text-base font-medium text-gray-700">
                          Capacity
                        </Label>
                        <Input
                          id="event-capacity"
                          type="number"
                          value={eventForm.capacity}
                          onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                          placeholder="Max attendees"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="event-location" className="text-base font-medium text-gray-700">
                        Location
                      </Label>
                      <Input
                        id="event-location"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                        placeholder="Event venue"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Create Event
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 p-8">
                  <CardTitle className="text-2xl text-gray-900 font-semibold">Upcoming Events</CardTitle>
                  <CardDescription className="text-lg text-gray-600">All scheduled campus events</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6 max-h-[500px] overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        <h3 className="font-semibold text-xl text-gray-900 mb-3">{event.name}</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-base">{event.description}</p>
                        <div className="flex flex-wrap items-center gap-6 text-base">
                          <span className="flex items-center gap-2 text-blue-600 font-medium">
                            <CalendarDays className="h-5 w-5" />
                            {new Date(event.date).toLocaleDateString("en-IN")}
                          </span>
                          <span className="flex items-center gap-2 text-sky-600 font-medium">
                            <Users className="h-5 w-5" />
                            {event.capacity} capacity
                          </span>
                          <span className="flex items-center gap-2 text-gray-500 font-medium">
                            <MapPin className="h-5 w-5" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 p-8">
                  <CardTitle className="text-2xl text-gray-900 font-semibold">Register New Student</CardTitle>
                  <CardDescription className="text-lg text-gray-600">Add a new student to the system</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleStudentSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="student-name" className="text-base font-medium text-gray-700">
                        Student Name
                      </Label>
                      <Input
                        id="student-name"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="student-email" className="text-base font-medium text-gray-700">
                        Email Address
                      </Label>
                      <Input
                        id="student-email"
                        type="email"
                        value={studentForm.email}
                        onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base"
                        placeholder="student@university.edu"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="student-year" className="text-base font-medium text-gray-700">
                        Academic Year
                      </Label>
                      <Select
                        value={studentForm.year}
                        onValueChange={(value) => setStudentForm({ ...studentForm, year: value })}
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base">
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st Year</SelectItem>
                          <SelectItem value="2">2nd Year</SelectItem>
                          <SelectItem value="3">3rd Year</SelectItem>
                          <SelectItem value="4">4th Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      Register Student
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 p-8">
                  <CardTitle className="text-2xl text-gray-900 font-semibold">Registered Students</CardTitle>
                  <CardDescription className="text-lg text-gray-600">All students in the system</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-5 max-h-[400px] overflow-y-auto">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-200"
                      >
                        <h3 className="font-semibold text-xl text-gray-900 mb-2">{student.name}</h3>
                        <p className="text-gray-600 text-base mb-3">{student.email}</p>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1 text-sm font-medium rounded-lg"
                        >
                          Year {student.year}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl text-gray-900 font-semibold">
                    <TrendingUp className="h-7 w-7 text-blue-600" />
                    Event Popularity
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">Total registrations per event</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-5">
                    {reports.popularity.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-5 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-lg text-gray-900">{item.event_name}</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-2 text-sm font-medium"
                        >
                          {item.total_registrations} registrations
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl text-gray-900 font-semibold">
                    <Users className="h-7 w-7 text-sky-600" />
                    Attendance Rates
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">Attendance percentage per event</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-5">
                    {reports.attendance.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-5 rounded-xl bg-gray-50/50 hover:bg-sky-50/50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-lg text-gray-900">{item.event_name}</span>
                        <Badge
                          variant="outline"
                          className="bg-sky-100 text-sky-700 border-sky-200 px-3 py-2 text-sm font-medium"
                        >
                          {item.attendance_percentage}% attended
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl text-gray-900 font-semibold">
                    <Star className="h-7 w-7 text-blue-600" />
                    Feedback Scores
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">Average feedback per event</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-5">
                    {reports.feedback.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-5 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-lg text-gray-900">{item.event_name}</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-2 text-sm font-medium"
                        >
                          {item.average_feedback}/5 stars
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 p-8">
                  <CardTitle className="flex items-center gap-4 text-2xl text-gray-900 font-semibold">
                    <TrendingUp className="h-7 w-7 text-sky-600" />
                    Top Students
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600">Most active students</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-5">
                    {reports.topStudents.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-5 rounded-xl bg-gray-50/50 hover:bg-sky-50/50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-lg text-gray-900">{item.student_name}</span>
                        <Badge
                          variant="outline"
                          className="bg-sky-100 text-sky-700 border-sky-200 px-3 py-2 text-sm font-medium"
                        >
                          {item.events_attended} events
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-8">
            <div className="max-w-3xl mx-auto">
              <Card className="border-gray-200 shadow-lg bg-white rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50 p-10 text-center">
                  <CardTitle className="text-3xl text-gray-900 font-semibold">Database Management</CardTitle>
                  <CardDescription className="text-xl text-gray-600">
                    Initialize database and seed with sample data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="space-y-8 text-center">
                    <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200">
                      <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-6" />
                      <h3 className="text-2xl font-semibold mb-4 text-gray-900">Sample University Data</h3>
                      <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        {""}  
                      </p>
                    </div>
                    <Button
                      onClick={async () => {
                        try {
                          const response = await fetch("/api/init-db", { method: "POST" })
                          if (response.ok) {
                            alert("Database initialized successfully with Indian university data!")
                            fetchEvents()
                            fetchStudents()
                            fetchReports()
                          }
                        } catch (error) {
                          console.error("Error initializing database:", error)
                        }
                      }}
                      className="w-full h-16 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-semibold text-xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Initialize Database & Seed Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
