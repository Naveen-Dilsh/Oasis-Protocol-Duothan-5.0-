import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getAdminFromToken } from "@/lib/auth"

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const [teamCount, challengeCount, submissionCount, activeChallenges] = await Promise.all([
      prisma.team.count(),
      prisma.challenge.count(),
      prisma.submission.count(),
      prisma.challenge.count({ where: { isActive: true } }),
    ])

    return NextResponse.json({
      teamCount,
      challengeCount,
      submissionCount,
      activeChallenges,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
