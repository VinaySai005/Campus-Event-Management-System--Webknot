import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Feedback report requested")
    const db = await getDb()
    const results = await db.all(`
      SELECT 
        e.name as event_name,
        ROUND(AVG(f.score), 2) as average_feedback
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      LEFT JOIN feedback f ON r.id = f.registration_id
      WHERE f.score IS NOT NULL
      GROUP BY e.id, e.name
      ORDER BY average_feedback DESC
    `)
    console.log("[v0] Feedback results:", results)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
