import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { hashPassword, generateTeamToken } from "@/lib/team-auth"

export async function POST(request) {
  try {
    const { name, email, password, members } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if team name or email already exists
    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [{ name }, { email }],
      },
    })

    if (existingTeam) {
      return NextResponse.json({ error: "Team name or email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)

    const team = await prisma.team.create({
      data: {
        name,
        email,
        password: hashedPassword,
        members: members || [],
      },
    })

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
    console.error("Team registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
