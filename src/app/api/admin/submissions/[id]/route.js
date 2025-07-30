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

    const submissions = await prisma.submission.findMany({
      include: {
        team: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        challenge: {
          select: {
            id: true,
            title: true,
            points: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(submissions)
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
