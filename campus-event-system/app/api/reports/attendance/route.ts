import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Attendance report requested")
    const db = await getDb()
    const results = await db.all(`
      SELECT 
        e.name as event_name,
        CASE 
          WHEN COUNT(r.id) = 0 THEN 0
          ELSE ROUND((COUNT(a.id) * 100.0) / COUNT(r.id), 2)
        END as attendance_percentage
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN attendance a ON r.id = a.registration_id
      GROUP BY e.id, e.name
      ORDER BY attendance_percentage DESC
    `)
    console.log("[v0] Attendance results:", results)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error fetching attendance:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}
