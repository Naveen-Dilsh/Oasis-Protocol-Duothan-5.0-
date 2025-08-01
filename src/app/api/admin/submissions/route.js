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

    // Use raw SQL to handle invalid datetime values
    const [submissions, flagSubmissions] = await Promise.all([
      // Regular submissions with raw SQL to handle invalid dates
      prisma.$queryRaw`
        SELECT 
          s.id,
          s.teamId,
          s.challengeId,
          s.type,
          s.content,
          s.githubLink,
          s.language,
          s.output,
          s.status,
          s.isCorrect,
          s.points,
          CASE 
            WHEN s.createdAt = '0000-00-00 00:00:00' OR s.createdAt IS NULL 
            THEN NOW() 
            ELSE s.createdAt 
          END as createdAt,
          t.id as team_id,
          t.name as team_name,
          t.email as team_email,
          c.id as challenge_id,
          c.title as challenge_title,
          c.points as challenge_points
        FROM submissions s
        LEFT JOIN teams t ON s.teamId = t.id
        LEFT JOIN challenges c ON s.challengeId = c.id
        ORDER BY 
          CASE 
            WHEN s.createdAt = '0000-00-00 00:00:00' OR s.createdAt IS NULL 
            THEN NOW() 
            ELSE s.createdAt 
          END DESC
      `,

      // Flag submissions with raw SQL to handle invalid dates
      prisma.$queryRaw`
        SELECT 
          fs.id,
          fs.teamId,
          fs.challengeId,
          fs.flag,
          fs.isCorrect,
          CASE 
            WHEN fs.createdAt = '0000-00-00 00:00:00' OR fs.createdAt IS NULL 
            THEN NOW() 
            ELSE fs.createdAt 
          END as createdAt,
          t.id as team_id,
          t.name as team_name,
          t.email as team_email,
          c.id as challenge_id,
          c.title as challenge_title,
          c.points as challenge_points
        FROM flag_submissions fs
        LEFT JOIN teams t ON fs.teamId = t.id
        LEFT JOIN challenges c ON fs.challengeId = c.id
        ORDER BY 
          CASE 
            WHEN fs.createdAt = '0000-00-00 00:00:00' OR fs.createdAt IS NULL 
            THEN NOW() 
            ELSE fs.createdAt 
          END DESC
      `,
    ])

    // Format regular submissions
    const formattedSubmissions = submissions.map((submission) => ({
      id: submission.id,
      teamId: submission.teamId,
      challengeId: submission.challengeId,
      type: submission.type,
      content: submission.content,
      githubLink: submission.githubLink,
      language: submission.language,
      output: submission.output,
      status: submission.status || "pending",
      isCorrect: submission.isCorrect,
      points: submission.points || 0,
      createdAt: submission.createdAt,
      team: {
        id: submission.team_id,
        name: submission.team_name,
        email: submission.team_email,
      },
      challenge: {
        id: submission.challenge_id,
        title: submission.challenge_title,
        points: submission.challenge_points,
      },
    }))

    // Format flag submissions to match submission structure
    const formattedFlagSubmissions = flagSubmissions.map((flagSubmission) => ({
      id: `flag_${flagSubmission.id}`, // Prefix to avoid ID conflicts
      teamId: flagSubmission.teamId,
      challengeId: flagSubmission.challengeId,
      type: "algorithmic",
      content: `Flag: ${flagSubmission.flag}`, // Show the submitted flag
      githubLink: null,
      language: null,
      output: null,
      status: flagSubmission.isCorrect ? "accepted" : "rejected",
      isCorrect: flagSubmission.isCorrect,
      points: flagSubmission.isCorrect ? flagSubmission.challenge_points : 0,
      createdAt: flagSubmission.createdAt,
      team: {
        id: flagSubmission.team_id,
        name: flagSubmission.team_name,
        email: flagSubmission.team_email,
      },
      challenge: {
        id: flagSubmission.challenge_id,
        title: flagSubmission.challenge_title,
        points: flagSubmission.challenge_points,
      },
    }))

    // Combine and sort all submissions by creation date
    const allSubmissions = [...formattedSubmissions, ...formattedFlagSubmissions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json(allSubmissions)
  } catch (error) {
    console.error("Submissions fetch error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch submissions",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
