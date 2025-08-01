import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromToken } from "@/lib/auth"

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { id } = params
    const { status, comment, point } = await request.json()

    // Check if this is a flag submission (prefixed with 'flag_')
    if (id.startsWith("flag_")) {
      const flagSubmissionId = id.replace("flag_", "")

      // Update flag submission
      const updatedFlagSubmission = await prisma.flagSubmission.update({
        where: { id: flagSubmissionId },
        data: {
          isCorrect: status === "accepted",
        },
        include: {
          team: true,
          challenge: true,
        },
      })

      // Update team points if accepted
      if (status === "accepted" && !updatedFlagSubmission.isCorrect) {
        await prisma.team.update({
          where: { id: updatedFlagSubmission.teamId },
          data: {
            totalPoints: {
              increment: updatedFlagSubmission.challenge.points,
            },
          },
        })
      }

      return NextResponse.json({
        message: "Flag submission reviewed successfully",
        submission: updatedFlagSubmission,
      })
    } else {
      // Handle regular submission
      const updatedSubmission = await prisma.submission.update({
        where: { id },
        data: {
          status,
          isCorrect: status === "accepted",
          points: status === "accepted" ? parseInt(point,10): 0, // Keep existing points if accepted, set to 0 if rejected
        },
        include: {
          team: true,
          challenge: true,
        },
      })

      // Update team points if accepted and not already counted
      if (status === "accepted" && updatedSubmission.points > 0) {
        await prisma.team.update({
          where: { id: updatedSubmission.teamId },
          data: {
            totalPoints: {
              increment: updatedSubmission.points,
            },
          },
        })
      }

      return NextResponse.json({
        message: "Submission reviewed successfully",
        submission: updatedSubmission,
      })
    }
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json(
      {
        error: "Failed to review submission",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
