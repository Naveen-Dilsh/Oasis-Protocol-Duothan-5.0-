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

    // Get current date for active teams calculation (teams active in last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const [
      teamCount,
      challengeCount,
      submissionCount,
      activeChallenges,
      pendingSubmissions,
      activeTeams,
      recentFlagSubmissions,
      systemAlerts,
    ] = await Promise.all([
      // Total teams
      prisma.team.count(),

      // Total challenges
      prisma.challenge.count(),

      // Total submissions (both regular submissions and flag submissions)
      prisma.submission.count(),

      // Active challenges
      prisma.challenge.count({ where: { isActive: true } }),

      // Pending submissions (submissions with status 'pending')
      prisma.submission.count({
        where: {
          status: "pending",
        },
      }),

      // Active teams (teams that have made submissions in the last 7 days)
      prisma.team.count({
        where: {
          OR: [
            {
              submissions: {
                some: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
              },
            },
            {
              flagSubmissions: {
                some: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
              },
            },
          ],
        },
      }),

      // Get recent flag submissions for additional metrics
      prisma.flagSubmission.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),

      // System alerts - count teams with issues (you can customize this logic)
      // For example: teams with rejected submissions in the last 24 hours
      prisma.team.count({
        where: {
          submissions: {
            some: {
              status: "rejected",
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
              },
            },
          },
        },
      }),
    ])

    // Calculate total submissions including flag submissions
    const totalFlagSubmissions = await prisma.flagSubmission.count()
    const totalAllSubmissions = submissionCount + totalFlagSubmissions

    return NextResponse.json({
      teamCount,
      challengeCount,
      submissionCount: totalAllSubmissions, // Include both submission types
      activeChallenges,
      pendingSubmissions,
      activeTeams,
      systemAlerts,
      // Additional useful stats
      recentActivity: {
        recentSubmissions: submissionCount,
        recentFlagSubmissions,
        totalRecentActivity: recentFlagSubmissions,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
