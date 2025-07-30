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
    
    const challenges = await prisma.challenge.findMany({
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
        _count: {
          select: { submissions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(challenges)
  } catch (error) {
    console.error("Challenges fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const data = await request.json()
    const { title, description, points, algorithmicProblem, buildathonProblem } = data
    console.log(data)
    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        points: Number.parseInt(points),
        algorithmicProblem: algorithmicProblem
          ? {
              create: {
                title: algorithmicProblem.title,
                description: algorithmicProblem.description,
                inputFormat: algorithmicProblem.inputFormat,
                outputFormat: algorithmicProblem.outputFormat,
                constraints: algorithmicProblem.constraints,
                examples: algorithmicProblem.examples,
                flag: algorithmicProblem.flag,
              },
            }
          : undefined,
        buildathonProblem: buildathonProblem
          ? {
              create: {
                title: buildathonProblem.title,
                description: buildathonProblem.description,
                requirements: buildathonProblem.requirements,
                resources: buildathonProblem.resources,
              },
            }
          : undefined,
      },
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
      },
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error("Challenge creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

//FIXME:check is there have a other method to passed id without params
export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const admin = await getAdminFromToken(token)
    if (!admin) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
    
    const challengeId = params.id
    
    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 })
    }
    
    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
        _count: {
          select: { 
            submissions: true,
            flagSubmissions: true
          }
        }
      }
    })
    
    if (!existingChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }
    
    // Delete the challenge (related records will be deleted due to onDelete: Cascade)
    await prisma.challenge.delete({
      where: { id: challengeId }
    })
    
    return NextResponse.json({ 
      message: "Challenge deleted successfully",
      deletedChallenge: {
        id: existingChallenge.id,
        title: existingChallenge.title,
        submissionsCount: existingChallenge._count.submissions,
        flagSubmissionsCount: existingChallenge._count.flagSubmissions
      }
    })
    
  } catch (error) {
    console.error("Challenge deletion error:", error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

//FIXME::check is there have a other method to passed id without params
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
    
    const challengeId = params.id
    
    if (!challengeId) {
      return NextResponse.json({ error: "Challenge ID is required" }, { status: 400 })
    }
    
    const data = await request.json()
    const { title, description, points, isActive, algorithmicProblem, buildathonProblem } = data
    
    // Check if challenge exists
    const existingChallenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
      }
    })
    
    if (!existingChallenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }
    
    // Update challenge
    const updatedChallenge = await prisma.challenge.update({
      where: { id: challengeId },
      data: {
        title,
        description,
        points: Number.parseInt(points),
        isActive: isActive !== undefined ? isActive : existingChallenge.isActive,
        algorithmicProblem: algorithmicProblem
          ? existingChallenge.algorithmicProblem
            ? {
                update: {
                  title: algorithmicProblem.title,
                  description: algorithmicProblem.description,
                  inputFormat: algorithmicProblem.inputFormat,
                  outputFormat: algorithmicProblem.outputFormat,
                  constraints: algorithmicProblem.constraints,
                  examples: algorithmicProblem.examples,
                  flag: algorithmicProblem.flag,
                },
              }
            : {
                create: {
                  title: algorithmicProblem.title,
                  description: algorithmicProblem.description,
                  inputFormat: algorithmicProblem.inputFormat,
                  outputFormat: algorithmicProblem.outputFormat,
                  constraints: algorithmicProblem.constraints,
                  examples: algorithmicProblem.examples,
                  flag: algorithmicProblem.flag,
                },
              }
          : existingChallenge.algorithmicProblem
          ? { delete: true }
          : undefined,
        buildathonProblem: buildathonProblem
          ? existingChallenge.buildathonProblem
            ? {
                update: {
                  title: buildathonProblem.title,
                  description: buildathonProblem.description,
                  requirements: buildathonProblem.requirements,
                  resources: buildathonProblem.resources,
                },
              }
            : {
                create: {
                  title: buildathonProblem.title,
                  description: buildathonProblem.description,
                  requirements: buildathonProblem.requirements,
                  resources: buildathonProblem.resources,
                },
              }
          : existingChallenge.buildathonProblem
          ? { delete: true }
          : undefined,
      },
      include: {
        algorithmicProblem: true,
        buildathonProblem: true,
        _count: {
          select: { submissions: true },
        },
      },
    })
    
    return NextResponse.json(updatedChallenge)
    
  } catch (error) {
    console.error("Challenge update error:", error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 })
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
