import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDb()
    const students = await db.all(`
      SELECT id, name, email, year 
      FROM students 
      ORDER BY name
    `)
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, year } = await request.json()

    const db = await getDb()
    const result = await db.run(
      `
      INSERT INTO students (name, email, year)
      VALUES (?, ?, ?)
    `,
      [name, email, year],
    )

    return NextResponse.json({ id: result.lastID, message: "Student created successfully" })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 })
  }
}
