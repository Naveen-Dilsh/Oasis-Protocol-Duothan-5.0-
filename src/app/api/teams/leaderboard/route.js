import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
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
      orderBy: [{ totalPoints: "desc" }, { createdAt: "asc" }],
    })

    const leaderboard = teams.map((team, index) => ({
      rank: index + 1,
      name: team.name,
      totalPoints: team.totalPoints,
      challengesCompleted: team.flagSubmissions.length,
      buildathonsCompleted: team.submissions.length,
      lastActivity:
        team.flagSubmissions.length > 0
          ? Math.max(...team.flagSubmissions.map((s) => new Date(s.createdAt).getTime()))
          : new Date(team.createdAt).getTime(),
    }))

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
