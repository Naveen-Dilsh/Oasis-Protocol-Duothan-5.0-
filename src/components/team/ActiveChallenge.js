"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Code,
  Hammer,
  Play,
  CheckCircle,
  AlertCircle,
  Clock,
  Github,
  Send,
  Loader2,
  Trophy,
  Target,
} from "lucide-react"
import { toast } from "sonner"

const CodeEditor = ({ value, onChange, language, height }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-sm resize-none border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
      style={{ height }}
      placeholder={`Write your ${language} code here...`}
    />
  )
}

export default function ActiveChallenge({ challenge, progress, onSubmitCode, onSubmitFlag, onSubmitBuildathon }) {
  const [activeTab, setActiveTab] = useState("algorithmic")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("python")
  const [input, setInput] = useState("")
  const [flag, setFlag] = useState("")
  const [githubLink, setGithubLink] = useState("")
  const [description, setDescription] = useState("")
  const [isExecuting, setIsExecuting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [executionResult, setExecutionResult] = useState(null)

  useEffect(() => {
    if (progress?.algorithmicCompleted && !progress?.buildathonCompleted) {
      setActiveTab("buildathon")
    }
  }, [progress])

  const getDefaultCode = (lang) => {
    const templates = {
      python: `# Your solution here
def solve():
    # Read input
    n = int(input())
    
    # Your logic here
    
    # Print output
    print("Your answer")

solve()`,
      javascript: `// Your solution here
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    // Your logic here
    console.log("Your answer");
    rl.close();
});`,
      java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        // Your logic here
        
        System.out.println("Your answer");
        scanner.close();
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int main() {
    // Your logic here
    
    cout << "Your answer" << endl;
    return 0;
}`,
      c: `#include <stdio.h>

int main() {
    // Your logic here
    
    printf("Your answer\\n");
    return 0;
}`,
    }
    return templates[lang] || templates.python
  }

  useEffect(() => {
    setCode(getDefaultCode(language))
  }, [language])
  console.log(challenge[0].title)
  const handleCodeExecution = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to execute")
      return
    }

    setIsExecuting(true)
    setExecutionResult(null)

    
  }

  const handleFlagSubmission = async () => {
    if (!flag.trim()) {
      toast.error("Please enter a flag")
      return
    }

    setIsSubmitting(true)

    
  }

  const handleBuildathonSubmission = async () => {
    if (!githubLink.trim()) {
      toast.error("Please enter a GitHub repository link")
      return
    }

    const githubRegex = /^https:\/\/github\.com\/[\w\-.]+\/[\w\-.]+/
    if (!githubRegex.test(githubLink)) {
      toast.error("Please enter a valid GitHub repository URL")
      return
    }

    setIsSubmitting(true)

    
  }

  if (!challenge) {
    return (
      <div className="flex items-center justify-center h-64 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200">
        <div className="text-center">
          <Target className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-slate-600 font-medium">Select a challenge to get started</p>
          <p className="text-slate-400 text-sm mt-1">Choose from the available challenges to begin coding</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">{challenge[0].title}</h1>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">{challenge[0].description}</p>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-semibold"
            >
              {challenge.points} points
            </Badge>
            {progress?.buildathonCompleted && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-2">
                <CheckCircle className="h-4 w-4 mr-2" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl h-14">
          <TabsTrigger
            value="algorithmic"
            className="flex items-center space-x-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-12 text-base font-medium"
          >
            <Code className="h-5 w-5" />
            <span>Algorithmic Challenge</span>
            {progress?.algorithmicCompleted && <CheckCircle className="h-4 w-4 text-emerald-500" />}
          </TabsTrigger>
          <TabsTrigger
            value="buildathon"
            disabled={!progress?.algorithmicCompleted}
            className="flex items-center space-x-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg h-12 text-base font-medium disabled:opacity-50"
          >
            <Hammer className="h-5 w-5" />
            <span>Buildathon Challenge</span>
            {progress?.buildathonCompleted && <CheckCircle className="h-4 w-4 text-emerald-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithmic" className="space-y-6">
          {/* Problem Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Problem Statement</CardTitle>
              <CardDescription>Solve this algorithmic problem to unlock the buildathon phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{challenge.algorithmicProblem?.title}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{challenge.algorithmicProblem?.description}</p>
                </div>

                {challenge.algorithmicProblem?.inputFormat && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Input Format</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{challenge.algorithmicProblem.inputFormat}</p>
                  </div>
                )}

                {challenge.algorithmicProblem?.outputFormat && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Output Format</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{challenge.algorithmicProblem.outputFormat}</p>
                  </div>
                )}

                {challenge.algorithmicProblem?.constraints && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Constraints</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{challenge.algorithmicProblem.constraints}</p>
                  </div>
                )}

                {challenge.algorithmicProblem?.examples && challenge.algorithmicProblem.examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                    {challenge.algorithmicProblem.examples.map((example, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Input</h5>
                            <pre className="text-sm text-gray-700 bg-white p-2 rounded border">{example.input}</pre>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-900 mb-1">Output</h5>
                            <pre className="text-sm text-gray-700 bg-white p-2 rounded border">{example.output}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Code Editor and Results */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Code Editor</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Write your solution here
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="c">C</option>
                  </select>
                </div>
                <CodeEditor value={code} onChange={setCode} language={language} height="300px" />
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block dark:text-gray-300">
                    Input (Optional)
                  </label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter test input here..."
                    className="font-mono text-sm border-gray-300 focus:border-purple-400 focus:ring-purple-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleCodeExecution}
                  disabled={isExecuting}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-medium"
                >
                  {isExecuting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isExecuting ? "Executing..." : "Run Code"}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-900 dark:text-white">Execution Results</CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300">
                      Output and execution details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {executionResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Status:</span>
                      <Badge
                        className={
                          executionResult.error
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-green-100 text-green-800 border-green-200"
                        }
                      >
                        {executionResult.status || (executionResult.error ? "Error" : "Success")}
                      </Badge>
                    </div>
                    {executionResult.output && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block dark:text-gray-300">
                          Output:
                        </label>
                        <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm overflow-x-auto font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          {executionResult.output}
                        </pre>
                      </div>
                    )}
                    {executionResult.error && (
                      <div>
                        <label className="text-sm font-semibold text-red-700 mb-2 block dark:text-red-300">
                          Error:
                        </label>
                        <pre className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm overflow-x-auto text-red-700 font-mono dark:bg-gray-700 dark:border-red-600 dark:text-red-300">
                          {executionResult.error}
                        </pre>
                      </div>
                    )}
                    {(executionResult.time || executionResult.memory) && (
                      <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-4 rounded-lg">
                        {executionResult.time && (
                          <div className="text-blue-800 dark:text-blue-300">
                            <span className="font-semibold">Time:</span> {executionResult.time}ms
                          </div>
                        )}
                        {executionResult.memory && (
                          <div className="text-blue-800 dark:text-blue-300">
                            <span className="font-semibold">Memory:</span> {executionResult.memory}KB
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                      <p>Run your code to see results</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Flag Submission */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-200">
              <CardTitle className="text-xl text-slate-800">Submit Flag</CardTitle>
              <CardDescription className="text-slate-600">
                Enter the correct output as your flag to unlock the buildathon phase
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex space-x-3">
                <Input
                  placeholder="Enter your flag here..."
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="flex-1 border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <Button
                  onClick={handleFlagSubmission}
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-semibold transition-colors"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Submit Flag
                </Button>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  <strong>Hint:</strong> The correct flag is the expected output from your program
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buildathon" className="space-y-6">
          {progress?.algorithmicCompleted ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Buildathon Challenge</CardTitle>
                  <CardDescription>Build a complete solution for this challenge</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{challenge.buildathonProblem?.title}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{challenge.buildathonProblem?.description}</p>
                    </div>

                    {challenge.buildathonProblem?.requirements && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{challenge.buildathonProblem.requirements}</p>
                      </div>
                    )}

                    {challenge.buildathonProblem?.resources && challenge.buildathonProblem.resources.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                        <ul className="space-y-1">
                          {challenge.buildathonProblem.resources.map((resource, index) => (
                            <li key={index} className="text-blue-600 hover:text-blue-700">
                              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-sm">
                                {resource}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-slate-200">
                  <CardTitle className="text-xl text-slate-800">Submit Your Solution</CardTitle>
                  <CardDescription className="text-slate-600">
                    Provide a GitHub repository link containing your buildathon solution
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">GitHub Repository URL</label>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Project Description (Optional)
                    </label>
                    <Textarea
                      placeholder="Describe your solution, technologies used, and any special features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleBuildathonSubmission}
                    disabled={isSubmitting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Github className="h-4 w-4 mr-2" />
                    )}
                    Submit Project
                  </Button>
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-3">Submission Requirements:</h4>
                    <ul className="text-sm text-slate-600 space-y-2">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Repository must be public
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Include a detailed README.md
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Source code should be well-documented
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Include setup/installation instructions
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Demonstrate the working solution
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-center h-48 bg-gradient-to-br from-slate-50 to-amber-50">
                <div className="text-center text-slate-600">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                  <p className="font-semibold text-lg">Complete the algorithmic challenge first</p>
                  <p className="text-sm mt-1">Unlock this phase by solving the coding problem above</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
