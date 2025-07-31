"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Code, Hammer, Play, CheckCircle, AlertCircle, Clock, Github, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"

const CodeEditor = ({ value, onChange, language, height }) => {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-mono text-sm resize-none"
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
<<<<<<< Updated upstream

  //Handle Code Execution
=======
  console.log(challenge.title)
>>>>>>> Stashed changes
  const handleCodeExecution = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to execute")
      return
    }

    setIsExecuting(true)
    setExecutionResult(null)


  }

  //Flag Submission
  const handleFlagSubmission = async () => {
    if (!flag.trim()) {
      toast.error("Please enter a flag")
      return
    }

    setIsSubmitting(true)

    
  }

  //Buildathon Submission
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
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select a challenge to get started</p>
      </div>
    )
  }

  return (
<<<<<<< Updated upstream
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <p className="text-muted-foreground">{challenge.description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{challenge.points} points</Badge>
          {progress?.buildathonCompleted && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Completed
=======
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">{challenge.title}</h1>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">{challenge.description}</p>
          </div>
          <div className="flex items-center space-x-3 ml-6">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 border-amber-200 px-4 py-2 text-sm font-semibold"
            >
              {challenge.points} points
>>>>>>> Stashed changes
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="algorithmic" className="flex items-center space-x-2">
            <Code className="h-4 w-4" />
            <span>Algorithmic Challenge</span>
            {progress?.algorithmicCompleted && <CheckCircle className="h-3 w-3 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger
            value="buildathon"
            disabled={!progress?.algorithmicCompleted}
            className="flex items-center space-x-2"
          >
            <Hammer className="h-4 w-4" />
            <span>Buildathon Challenge</span>
            {progress?.buildathonCompleted && <CheckCircle className="h-3 w-3 text-green-500" />}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="algorithmic" className="space-y-6">
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

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
                <CardDescription>Write your solution here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-1 border rounded-md bg-background"
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
                  <label className="text-sm font-medium">Input (Optional)</label>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter test input here..."
                    className="mt-1 font-mono text-sm"
                    rows={3}
                  />
                </div>
                <Button onClick={handleCodeExecution} disabled={isExecuting} className="w-full">
                  {isExecuting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isExecuting ? "Executing..." : "Run Code"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Execution Results</CardTitle>
                <CardDescription>Output and execution details</CardDescription>
              </CardHeader>
              <CardContent>
                {executionResult ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Status:</span>
                      <Badge variant={executionResult.error ? "destructive" : "default"}>
                        {executionResult.status || (executionResult.error ? "Error" : "Success")}
                      </Badge>
                    </div>
                    {executionResult.output && (
                      <div>
                        <label className="text-sm font-medium">Output:</label>
                        <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-x-auto">
                          {executionResult.output}
                        </pre>
                      </div>
                    )}
                    {executionResult.error && (
                      <div>
                        <label className="text-sm font-medium text-destructive">Error:</label>
                        <pre className="mt-1 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm overflow-x-auto text-destructive">
                          {executionResult.error}
                        </pre>
                      </div>
                    )}
                    {(executionResult.time || executionResult.memory) && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {executionResult.time && (
                          <div>
                            <span className="font-medium">Time:</span> {executionResult.time}ms
                          </div>
                        )}
                        {executionResult.memory && (
                          <div>
                            <span className="font-medium">Memory:</span> {executionResult.memory}KB
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <div className="text-center">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <p>Run your code to see results</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Submit Flag</CardTitle>
              <CardDescription>Enter the correct output as your flag to unlock the buildathon phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your flag here..."
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleFlagSubmission} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Submit Flag
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Hint: The correct flag is the expected output from your program
              </p>
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

              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Solution</CardTitle>
                  <CardDescription>
                    Provide a GitHub repository link containing your buildathon solution
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">GitHub Repository URL</label>
                    <Input
                      placeholder="https://github.com/username/repository"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Project Description (Optional)</label>
                    <Textarea
                      placeholder="Describe your solution, technologies used, and any special features..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleBuildathonSubmission} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Github className="h-4 w-4 mr-2" />
                    )}
                    Submit Project
                  </Button>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Submission Requirements:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Repository must be public</li>
                      <li>• Include a detailed README.md</li>
                      <li>• Source code should be well-documented</li>
                      <li>• Include setup/installation instructions</li>
                      <li>• Demonstrate the working solution</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>Complete the algorithmic challenge first to unlock this phase</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
