import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    // Verify and decode token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const teamId = decoded.teamId

    // Fetch team data with all required information
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        name: true,
        email: true,
        members: true,
        totalPoints: true,
        createdAt: true,
        flagSubmissions: {
          where: { isCorrect: true },
          select: {
            createdAt: true,
            challenge: {
              select: {
                points: true,
              },
            },
          },
        },
        submissions: {
          where: {
            type: "buildathon",
            status: "accepted",
          },
          select: {
            createdAt: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Get team's rank from leaderboard
    const allTeams = await prisma.team.findMany({
      select: {
        id: true,
        totalPoints: true,
        createdAt: true,
      },
      orderBy: [{ totalPoints: "desc" }, { createdAt: "asc" }],
    })

    const teamRank = allTeams.findIndex((t) => t.id === teamId) + 1

    // Format the response
    const teamProfile = {
      id: team.id,
      name: team.name,
      email: team.email,
      points: team.totalPoints,
      rank: teamRank,
      members: team.members ? (Array.isArray(team.members) ? team.members : [team.members]) : [],
      createdAt: team.createdAt.toISOString(),
      challengesCompleted: team.flagSubmissions.length,
      buildathonsCompleted: team.submissions.length,
    }

    return NextResponse.json(teamProfile)
  } catch (error) {
    console.error("Team profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
