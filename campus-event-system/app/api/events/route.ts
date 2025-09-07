import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const events = await db.all(`
      SELECT id, name, description, date, location, capacity 
      FROM events 
      ORDER BY date DESC
    `)
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, date, location, capacity } = await request.json()

    const db = await getDb()
    const result = await db.run(
      `
      INSERT INTO events (name, description, date, location, capacity)
      VALUES (?, ?, ?, ?, ?)
    `,
      [name, description, date, location, capacity],
    )

    return NextResponse.json({ id: result.lastID, message: "Event created successfully" })
  } catch (error) {
    console.error("Error creating event:", error)
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
