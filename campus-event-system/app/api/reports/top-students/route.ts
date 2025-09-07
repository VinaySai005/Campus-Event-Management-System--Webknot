import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Top students report requested")
    const db = await getDb()
    const results = await db.all(`
      SELECT 
        s.name as student_name,
        COUNT(a.id) as events_attended
      FROM students s
      LEFT JOIN registrations r ON s.id = r.student_id
      LEFT JOIN attendance a ON r.id = a.registration_id
      GROUP BY s.id, s.name
      HAVING events_attended > 0
      ORDER BY events_attended DESC
      LIMIT 3
    `)
    console.log("[v0] Top students results:", results)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error fetching top students:", error)
    return NextResponse.json({ error: "Failed to fetch top students" }, { status: 500 })
  }
}
