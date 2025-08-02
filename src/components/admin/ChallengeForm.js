"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Code, Wrench, Settings } from "lucide-react"

export default function ChallengeForm({ challenge, onSave, onCancel ,onStatsUpdate }) {
  const [formData, setFormData] = useState({
    title: challenge?.title || "",
    description: challenge?.description || "",
    points: challenge?.points || 100,
    isActive: challenge?.isActive ?? true,
    algorithmicProblem: {
      title: challenge?.algorithmicProblem?.title || "",
      description: challenge?.algorithmicProblem?.description || "",
      inputFormat: challenge?.algorithmicProblem?.inputFormat || "",
      outputFormat: challenge?.algorithmicProblem?.outputFormat || "",
      constraints: challenge?.algorithmicProblem?.constraints || "",
      examples: challenge?.algorithmicProblem?.examples || [{ input: "", output: "" }],
      flag: challenge?.algorithmicProblem?.flag || "",
    },
    buildathonProblem: {
      title: challenge?.buildathonProblem?.title || "",
      description: challenge?.buildathonProblem?.description || "",
      requirements: challenge?.buildathonProblem?.requirements || "",
      resources: challenge?.buildathonProblem?.resources || [""],
    },
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")
      const url = challenge ? `/api/admin/challenges/${challenge.id}` : `/api/admin/challenges/${null}`
      const method = challenge ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        const savedChallenge = await response.json()
        toast.success(challenge ? "Challenge updated!" : "Challenge created!")
        onSave(savedChallenge)
        if (onStatsUpdate) {
        onStatsUpdate()
      }
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save challenge")
      }
    } catch (error) {
      toast.error("Failed to save challenge")
    } finally {
      setIsLoading(false)
    }
  }

  const addExample = () => {
    setFormData((prev) => ({
      ...prev,
      algorithmicProblem: {
        ...prev.algorithmicProblem,
        examples: [...prev.algorithmicProblem.examples, { input: "", output: "" }],
      },
    }))
  }

  const removeExample = (index) => {
    setFormData((prev) => ({
      ...prev,
      algorithmicProblem: {
        ...prev.algorithmicProblem,
        examples: prev.algorithmicProblem.examples.filter((_, i) => i !== index),
      },
    }))
  }

  const addResource = () => {
    setFormData((prev) => ({
      ...prev,
      buildathonProblem: {
        ...prev.buildathonProblem,
        resources: [...prev.buildathonProblem.resources, ""],
      },
    }))
  }

  const removeResource = (index) => {
    setFormData((prev) => ({
      ...prev,
      buildathonProblem: {
        ...prev.buildathonProblem,
        resources: prev.buildathonProblem.resources.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">{challenge ? "Edit Challenge" : "Create New Challenge"}</h1>
            <p className="text-blue-100 text-lg">
              {challenge ? "Update challenge details and problems" : "Design algorithmic and buildathon challenges"}
            </p>
          </div>
          <div className="p-4 rounded-full bg-white/20">
            <Settings className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Challenge Info */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              Challenge Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter challenge title"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter challenge description"
                required
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="points" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) }))}
                  min="1"
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Active Challenge
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithmic Problem */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              Algorithmic Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
              <Input
                value={formData.algorithmicProblem.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, title: e.target.value },
                  }))
                }
                placeholder="Algorithmic problem title"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                value={formData.algorithmicProblem.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, description: e.target.value },
                  }))
                }
                placeholder="Problem description"
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input Format</Label>
                <Textarea
                  value={formData.algorithmicProblem.inputFormat}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      algorithmicProblem: { ...prev.algorithmicProblem, inputFormat: e.target.value },
                    }))
                  }
                  placeholder="Input format description"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output Format</Label>
                <Textarea
                  value={formData.algorithmicProblem.outputFormat}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      algorithmicProblem: { ...prev.algorithmicProblem, outputFormat: e.target.value },
                    }))
                  }
                  placeholder="Output format description"
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Constraints</Label>
              <Textarea
                value={formData.algorithmicProblem.constraints}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, constraints: e.target.value },
                  }))
                }
                placeholder="Problem constraints"
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Examples</Label>
                <Button type="button" onClick={addExample} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Example
                </Button>
              </div>
              <div className="space-y-4">
                {formData.algorithmicProblem.examples.map((example, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div>
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Input</Label>
                      <Textarea
                        value={example.input}
                        onChange={(e) => {
                          const newExamples = [...formData.algorithmicProblem.examples]
                          newExamples[index].input = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            algorithmicProblem: { ...prev.algorithmicProblem, examples: newExamples },
                          }))
                        }}
                        placeholder="Example input"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</Label>
                        {formData.algorithmicProblem.examples.length > 1 && (
                          <Button type="button" onClick={() => removeExample(index)} size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Textarea
                        value={example.output}
                        onChange={(e) => {
                          const newExamples = [...formData.algorithmicProblem.examples]
                          newExamples[index].output = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            algorithmicProblem: { ...prev.algorithmicProblem, examples: newExamples },
                          }))
                        }}
                        placeholder="Example output"
                        className="mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Flag (Correct Answer)</Label>
              <Input
                value={formData.algorithmicProblem.flag}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, flag: e.target.value },
                  }))
                }
                placeholder="Enter the flag/correct answer"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Buildathon Problem */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-purple-600" />
              Buildathon Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
              <Input
                value={formData.buildathonProblem.title}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildathonProblem: { ...prev.buildathonProblem, title: e.target.value },
                  }))
                }
                placeholder="Buildathon problem title"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
              <Textarea
                value={formData.buildathonProblem.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildathonProblem: { ...prev.buildathonProblem, description: e.target.value },
                  }))
                }
                placeholder="Buildathon problem description"
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</Label>
              <Textarea
                value={formData.buildathonProblem.requirements}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    buildathonProblem: { ...prev.buildathonProblem, requirements: e.target.value },
                  }))
                }
                placeholder="Project requirements and specifications"
                className="mt-1 min-h-[100px]"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Resources</Label>
                <Button type="button" onClick={addResource} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>
              <div className="space-y-2">
                {formData.buildathonProblem.resources.map((resource, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={resource}
                      onChange={(e) => {
                        const newResources = [...formData.buildathonProblem.resources]
                        newResources[index] = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          buildathonProblem: { ...prev.buildathonProblem, resources: newResources },
                        }))
                      }}
                      placeholder="Resource URL or description"
                      className="flex-1"
                    />
                    {formData.buildathonProblem.resources.length > 1 && (
                      <Button type="button" onClick={() => removeResource(index)} size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" onClick={onCancel} variant="outline" size="lg">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} size="lg" className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Saving..." : challenge ? "Update Challenge" : "Create Challenge"}
          </Button>
        </div>
      </form>
    </div>
  )
}
