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

    // Fetch team's submissions (both regular submissions and flag submissions)
    const [submissions, flagSubmissions] = await Promise.all([
      // Regular submissions (buildathon)
      prisma.submission.findMany({
        where: { teamId },
        select: {
          id: true,
          challengeId: true,
          type: true,
          status: true,
          isCorrect: true,
          points: true,
          createdAt: true,
          challenge: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      // Flag submissions (algorithmic)
      prisma.flagSubmission.findMany({
        where: { teamId },
        select: {
          id: true,
          challengeId: true,
          isCorrect: true,
          createdAt: true,
          challenge: {
            select: {
              title: true,
              points: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    // Format regular submissions
    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      challengeId: submission.challengeId,
      type: submission.type,
      status: submission.status || (submission.isCorrect ? "accepted" : "rejected"),
      createdAt: submission.createdAt.toISOString(),
      challenge: {
        title: submission.challenge.title,
      },
    }))

    // Format flag submissions as algorithmic submissions
    const formattedFlagSubmissions = flagSubmissions.map((flagSubmission) => ({
      id: `flag_${flagSubmission.id}`, // Prefix to avoid ID conflicts
      challengeId: flagSubmission.challengeId,
      type: "algorithmic",
      status: flagSubmission.isCorrect ? "accepted" : "rejected",
      createdAt: flagSubmission.createdAt.toISOString(),
      challenge: {
        title: flagSubmission.challenge.title,
      },
    }))

    // Combine and sort all submissions by creation date
    const allSubmissions = [...formattedSubmissions, ...formattedFlagSubmissions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json(allSubmissions)
  } catch (error) {
    console.error("Team submissions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
