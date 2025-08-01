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

    const { challengeId, githubLink, description } = await request.json()

    if (!challengeId || !githubLink) {
      return NextResponse.json({ error: "Challenge ID and GitHub link are required" }, { status: 400 })
    }

    // Validate GitHub URL
    const githubRegex = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+/
    if (!githubRegex.test(githubLink)) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 })
    }

    // Check if team has completed algorithmic part
    const flagSubmission = await prisma.flagSubmission.findFirst({
      where: {
        teamId: team.id,
        challengeId,
        isCorrect: true,
      },
    })

    if (!flagSubmission) {
      return NextResponse.json({ error: "Complete the algorithmic challenge first" }, { status: 400 })
    }

    // Create buildathon submission
    const submission = await prisma.submission.create({
      data: {
        teamId: team.id,
        challengeId,
        type: "buildathon",
        content: description || "",
        githubLink,
        status: "pending",
      },
    })

    return NextResponse.json({
      message: "Buildathon submission successful!",
      submission: {
        id: submission.id,
        githubLink: submission.githubLink,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    })
  } catch (error) {
    console.error("Buildathon submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
