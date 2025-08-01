import { NextResponse } from "next/server"
import { getTeamFromToken } from "@/lib/team-auth"
import { executeCode, SUPPORTED_LANGUAGES } from "@/lib/code-execution"

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

    const { code, language, input } = await request.json()

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 })
    }

    if (!SUPPORTED_LANGUAGES[language]) {
      return NextResponse.json(
        {
          error: `Unsupported language: ${language}. Supported languages: ${Object.keys(SUPPORTED_LANGUAGES).join(", ")}`,
        },
        { status: 400 },
      )
    }

    // Execute code using the hybrid execution service
    const result = await executeCode(code, language, input)

    return NextResponse.json({
      output: result.output,
      error: result.error,
      status: result.status,
      time: result.time,
      memory: result.memory,
      exitCode: result.exitCode,
      languageUsed: result.languageUsed,
      success: result.success,
    })
  } catch (error) {
    console.error("Code execution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
