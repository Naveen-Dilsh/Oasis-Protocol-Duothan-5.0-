import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTeamFromToken } from "@/lib/team-auth"

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const team = await getTeamFromToken(token)
    if (!team) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const challenges = await prisma.challenge.findMany({
      where: { isActive: true },
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
        flagSubmissions: {
          where: { teamId: team.id, isCorrect: true },
        },
      },
      orderBy: { order: "asc" },
    })

    // Add completion status to each challenge
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      isUnlocked: true, // For now, all challenges are unlocked
      algorithmicCompleted: challenge.flagSubmissions.length > 0,
      buildathonCompleted: team.submissions.some(
        (sub) => sub.challengeId === challenge.id && sub.type === "buildathon" && sub.status === "accepted",
      ),
    }))

    return NextResponse.json(challengesWithStatus)
  } catch (error) {
    console.error("Challenges fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
