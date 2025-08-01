import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getTeamFromToken } from "@/lib/team-auth"

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const team = await getTeamFromToken(token)
    if (!team) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { challengeId, flag } = await request.json()

    if (!challengeId || !flag) {
      return NextResponse.json({ error: "Challenge ID and flag are required" }, { status: 400 })
    }

    // Get the challenge with algorithmic problem
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: { algorithmicProblem: true },
    })

    if (!challenge || !challenge.algorithmicProblem) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }

    // Check if flag is correct
    const isCorrect = flag.trim() === challenge.algorithmicProblem.flag.trim()

    // Create flag submission
    const flagSubmission = await prisma.flagSubmission.create({
      data: {
        teamId: team.id,
        challengeId,
        flag: flag.trim(),
        isCorrect,
      },
    })

    if (isCorrect) {
      // Update team's total points
      await prisma.team.update({
        where: { id: team.id },
        data: {
          totalPoints: {
            increment: challenge.points,
          },
        },
      })
    }

    return NextResponse.json({
      isCorrect,
      message: isCorrect ? "Correct flag! Buildathon challenge unlocked!" : "Incorrect flag. Try again.",
      points: isCorrect ? challenge.points : 0,
    })
  } catch (error) {
    console.error("Flag submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
