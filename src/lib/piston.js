
// Language mapping for Piston API
export const SUPPORTED_LANGUAGES = {
  javascript: { language: "javascript", version: "18.15.0", name: "JavaScript (Node.js 18.15.0)" },
  python: { language: "python", version: "3.10.0", name: "Python (3.10.0)" },
  java: { language: "java", version: "15.0.2", name: "Java (OpenJDK 15.0.2)" },
  cpp: { language: "cpp", version: "10.2.0", name: "C++ (GCC 10.2.0)" },
  c: { language: "c", version: "10.2.0", name: "C (GCC 10.2.0)" },
}

export async function executeCode(code, language, input = "") {
  try {
    const languageConfig = SUPPORTED_LANGUAGES[language]
    if (!languageConfig) {
      throw new Error(`Unsupported language: ${language}`)
    }

    // Submit code to Piston API
    const response = await fetch(`${process.env.PISTON_API_URL}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: getFileName(language),
            content: code,
          },
        ],
        stdin: input,
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Piston API Error:", response.status, errorText)
      throw new Error(`Piston API returned ${response.status}: ${errorText}`)
    }

    const result = await response.json()

    // Handle compilation errors
    if (result.compile && result.compile.code !== 0) {
      return {
        success: true,
        output: "",
        error: result.compile.stderr || result.compile.output || "Compilation failed",
        status: "Compilation Error",
        time: null,
        memory: null,
        exitCode: result.compile.code,
        languageUsed: languageConfig.name,
      }
    }

    // Handle runtime results
    const runResult = result.run || {}

    return {
      success: true,
      output: runResult.stdout || "",
      error: runResult.stderr || "",
      status: runResult.code === 0 ? "Accepted" : "Runtime Error",
      time: null, // Piston doesn't provide execution time
      memory: null, // Piston doesn't provide memory usage
      exitCode: runResult.code,
      languageUsed: languageConfig.name,
    }
  } catch (error) {
    console.error("Code execution error:", error)
    return {
      success: false,
      output: "",
      error: error.message || "Code execution failed",
      status: "Error",
      time: null,
      memory: null,
      exitCode: null,
    }
  }
}

function getFileName(language) {
  const fileNames = {
    javascript: "main.js",
    python: "main.py",
    java: "Main.java",
    cpp: "main.cpp",
    c: "main.c",
  }
  return fileNames[language] || "main.txt"
}

export async function testPistonConnection() {
  try {
    const response = await fetch(`${PISTON_API_URL}/runtimes`)

    if (response.ok) {
      const runtimes = await response.json()
      console.log("✅ Piston connection successful. Available runtimes:", runtimes.length)
      return { success: true, runtimes }
    } else {
      console.error("❌ Piston connection failed:", response.status)
      return { success: false, error: `HTTP ${response.status}` }
    }
  } catch (error) {
    console.error("❌ Piston connection error:", error)
    return { success: false, error: error.message }
  }
}
