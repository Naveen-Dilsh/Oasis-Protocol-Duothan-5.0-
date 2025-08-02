"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Edit, Trash2, Users, Search, Code, Wrench, Trophy, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ChallengeList({ onEdit, onDelete,onStatsUpdate }) {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/challenges/${null}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setChallenges(data)
      } else {
        toast.error("Failed to fetch challenges")
      }
    } catch (error) {
      toast.error("Failed to fetch challenges")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (challengeId) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/challenges/${challengeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        toast.success("Challenge deleted successfully")
        setChallenges((prev) => prev.filter((c) => c.id !== challengeId))
        onDelete?.(challengeId)
        if (onStatsUpdate) {
        onStatsUpdate()
      }
      } else {
        toast.error("Failed to delete challenge")
      }
    } catch (error) {
      toast.error("Failed to delete challenge")
    }
  }

  const handleEdit = async (challengeId, updatedData) => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/challenges/${challengeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })
      if (response.ok) {
        const updatedChallenge = await response.json()
        toast.success("Challenge updated successfully")
        setChallenges((prev) => prev.map((c) => (c.id === challengeId ? updatedChallenge : c)))
        return updatedChallenge
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to update challenge")
        return null
      }
    } catch (error) {
      toast.error("Failed to update challenge")
      return null
    }
  }

  const toggleChallengeStatus = async (challengeId, currentStatus) => {
    const challenge = challenges.find((c) => c.id === challengeId)
    if (!challenge) return
    const updatedData = {
      title: challenge.title,
      description: challenge.description,
      points: challenge.points,
      isActive: !currentStatus,
      algorithmicProblem: challenge.algorithmicProblem,
      buildathonProblem: challenge.buildathonProblem,
    }
    await handleEdit(challengeId, updatedData)
  }

  const filteredChallenges = challenges.filter(
    (challenge) =>
      challenge.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400 text-lg">Loading challenges...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Challenges</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{challenges.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Code className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Challenges</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {challenges.filter((c) => c.isActive).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {challenges.reduce((sum, c) => sum + (c._count?.submissions || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Points</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {challenges.length > 0
                    ? Math.round(challenges.reduce((sum, c) => sum + c.points, 0) / challenges.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Challenges Table */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Code className="w-5 h-5 mr-2 text-blue-600" />
              All Challenges ({filteredChallenges.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <Card key={challenge.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{challenge.title}</h3>
                        <Badge
                          variant={challenge.isActive ? "default" : "secondary"}
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => toggleChallengeStatus(challenge.id, challenge.isActive)}
                        >
                          {challenge.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                          {challenge.points} pts
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{challenge._count?.submissions || 0} submissions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Created {formatDate(challenge.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Updated {formatDate(challenge.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {challenge.algorithmicProblem && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Code className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                            Algorithmic Problem
                          </span>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 text-sm">
                          {challenge.algorithmicProblem.title}
                        </div>
                      </div>
                    )}
                    {challenge.buildathonProblem && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Wrench className="w-4 h-4 text-purple-600" />
                          <span className="text-purple-700 dark:text-purple-300 font-medium text-sm">
                            Buildathon Problem
                          </span>
                        </div>
                        <div className="text-purple-600 dark:text-purple-400 text-sm">
                          {challenge.buildathonProblem.title}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit?.(challenge, handleEdit)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(challenge.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No challenges found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Create your first challenge to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
