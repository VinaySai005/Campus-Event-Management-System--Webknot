import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    console.log("[v0] Event popularity report requested")
    const db = await getDb()
    const results = await db.all(`
      SELECT 
        e.name as event_name,
        COUNT(r.id) as total_registrations
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id, e.name
      ORDER BY total_registrations DESC
    `)
    console.log("[v0] Event popularity results:", results)
    return NextResponse.json(results)
  } catch (error) {
    console.error("[v0] Error fetching event popularity:", error)
    return NextResponse.json({ error: "Failed to fetch event popularity" }, { status: 500 })
  }
}
