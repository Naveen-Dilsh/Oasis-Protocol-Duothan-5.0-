"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

export default function ChallengeForm({ challenge, onSave, onCancel }) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Challenge Info */}
      <Card className="oasis-card border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Challenge Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-cyan-200">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter challenge title"
              required
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-cyan-200">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter challenge description"
              required
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="points" className="text-cyan-200">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData((prev) => ({ ...prev, points: Number.parseInt(e.target.value) }))}
                min="1"
                required
                className="bg-black/20 border-cyan-500/30 text-white"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-cyan-500/30"
              />
              <Label htmlFor="isActive" className="text-cyan-200">
                Active
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithmic Problem */}
      <Card className="oasis-card border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Algorithmic Problem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-cyan-200">Title</Label>
            <Input
              value={formData.algorithmicProblem.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  algorithmicProblem: { ...prev.algorithmicProblem, title: e.target.value },
                }))
              }
              placeholder="Algorithmic problem title"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <Label className="text-cyan-200">Description</Label>
            <Textarea
              value={formData.algorithmicProblem.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  algorithmicProblem: { ...prev.algorithmicProblem, description: e.target.value },
                }))
              }
              placeholder="Problem description"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-cyan-200">Input Format</Label>
              <Textarea
                value={formData.algorithmicProblem.inputFormat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, inputFormat: e.target.value },
                  }))
                }
                placeholder="Input format description"
                className="bg-black/20 border-cyan-500/30 text-white"
              />
            </div>
            <div>
              <Label className="text-cyan-200">Output Format</Label>
              <Textarea
                value={formData.algorithmicProblem.outputFormat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    algorithmicProblem: { ...prev.algorithmicProblem, outputFormat: e.target.value },
                  }))
                }
                placeholder="Output format description"
                className="bg-black/20 border-cyan-500/30 text-white"
              />
            </div>
          </div>
          <div>
            <Label className="text-cyan-200">Constraints</Label>
            <Textarea
              value={formData.algorithmicProblem.constraints}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  algorithmicProblem: { ...prev.algorithmicProblem, constraints: e.target.value },
                }))
              }
              placeholder="Problem constraints"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-cyan-200">Examples</Label>
              <Button type="button" onClick={addExample} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Example
              </Button>
            </div>
            {formData.algorithmicProblem.examples.map((example, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 p-4 border border-cyan-500/30 rounded">
                <div>
                  <Label className="text-cyan-200 text-sm">Input</Label>
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
                    className="bg-black/20 border-cyan-500/30 text-white"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <Label className="text-cyan-200 text-sm">Output</Label>
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
                    className="bg-black/20 border-cyan-500/30 text-white"
                  />
                </div>
              </div>
            ))}
          </div>
          <div>
            <Label className="text-cyan-200">Flag (Correct Answer)</Label>
            <Input
              value={formData.algorithmicProblem.flag}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  algorithmicProblem: { ...prev.algorithmicProblem, flag: e.target.value },
                }))
              }
              placeholder="Enter the flag/correct answer"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buildathon Problem */}
      <Card className="oasis-card border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400">Buildathon Problem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-cyan-200">Title</Label>
            <Input
              value={formData.buildathonProblem.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  buildathonProblem: { ...prev.buildathonProblem, title: e.target.value },
                }))
              }
              placeholder="Buildathon problem title"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <Label className="text-cyan-200">Description</Label>
            <Textarea
              value={formData.buildathonProblem.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  buildathonProblem: { ...prev.buildathonProblem, description: e.target.value },
                }))
              }
              placeholder="Buildathon problem description"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <Label className="text-cyan-200">Requirements</Label>
            <Textarea
              value={formData.buildathonProblem.requirements}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  buildathonProblem: { ...prev.buildathonProblem, requirements: e.target.value },
                }))
              }
              placeholder="Project requirements and specifications"
              className="bg-black/20 border-cyan-500/30 text-white"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-cyan-200">Resources</Label>
              <Button type="button" onClick={addResource} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Resource
              </Button>
            </div>
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
                  className="bg-black/20 border-cyan-500/30 text-white"
                />
                {formData.buildathonProblem.resources.length > 1 && (
                  <Button type="button" onClick={() => removeResource(index)} size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700">
          {isLoading ? "Saving..." : challenge ? "Update Challenge" : "Create Challenge"}
        </Button>
      </div>
    </form>
  )
}
