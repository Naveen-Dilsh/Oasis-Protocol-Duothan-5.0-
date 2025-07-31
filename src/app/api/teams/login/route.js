import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, generateTeamToken } from "@/lib/team-auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const team = await prisma.team.findUnique({
      where: { email },
    })

    if (!team) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValidPassword = await verifyPassword(password, team.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateTeamToken({ teamId: team.id, email: team.email })

    return NextResponse.json({
      token,
      team: {
        id: team.id,
        name: team.name,
        email: team.email,
        members: team.members,
        totalPoints: team.totalPoints,
      },
    })
  } catch (error) {
    console.error("Team login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
