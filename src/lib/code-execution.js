import { executeCode as executePiston, testPistonConnection, SUPPORTED_LANGUAGES as PISTON_LANGUAGES } from "./piston"

// Primary execution service (Piston - free and reliable)
export const SUPPORTED_LANGUAGES = PISTON_LANGUAGES

export async function executeCode(code, language, input = "") {
  try {
    // Try Piston API first (free and reliable)
    console.log("Attempting code execution with Piston API...")
    const result = await executePiston(code, language, input)

    if (result.success) {
      return result
    }

    // If Piston fails, return a fallback response
    throw new Error("Primary execution service failed")
  } catch (error) {
    console.error("All code execution services failed:", error)

    // Return a mock execution for development/testing
    return {
      success: false,
      output: "",
      error: `Code execution service temporarily unavailable: ${error.message}`,
      status: "Service Unavailable",
      time: null,
      memory: null,
      exitCode: null,
      languageUsed: SUPPORTED_LANGUAGES[language]?.name || language,
    }
  }
}

export async function testConnection() {
  const pistonTest = await testPistonConnection()

  return {
    piston: pistonTest,
    primary: pistonTest.success ? "piston" : "none",
  }
}

// Simple local execution for basic cases (fallback)
export function executeCodeLocally(code, language, input = "") {
  try {
    // This is a very basic simulation - only for demonstration
    // In a real scenario, you'd need a proper sandboxed execution environment

    if (language === "javascript") {
      // Very basic JavaScript evaluation (UNSAFE - only for demo)
      // In production, never use eval() with user input
      const mockConsoleLog = []
      const mockConsole = {
        log: (...args) => mockConsoleLog.push(args.join(" ")),
      }

      // This is just a demo - don't use in production
      return {
        success: true,
        output: "Local execution not implemented for security reasons",
        error: "",
        status: "Demo Mode",
        time: null,
        memory: null,
        exitCode: 0,
        languageUsed: "JavaScript (Local Demo)",
      }
    }

    return {
      success: false,
      output: "",
      error: "Local execution not available for this language",
      status: "Not Supported",
      time: null,
      memory: null,
      exitCode: 1,
      languageUsed: language,
    }
  } catch (error) {
    return {
      success: false,
      output: "",
      error: error.message,
      status: "Error",
      time: null,
      memory: null,
      exitCode: 1,
      languageUsed: language,
    }
  }
}
