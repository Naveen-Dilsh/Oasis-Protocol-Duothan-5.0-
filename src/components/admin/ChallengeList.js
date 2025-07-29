"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ChallengeList({ onEdit, onDelete }) {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  

  const handleDelete = async (challengeId) => {
    if (!confirm("Are you sure you want to delete this challenge?")) return

  }

  if (loading) {
    return (
      <div className="grid gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="oasis-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-cyan-500/20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <Card className="oasis-card border-cyan-500/30">
        <CardContent className="p-12 text-center">
          <div className="text-cyan-400 text-lg mb-2">No challenges found</div>
          <p className="text-cyan-200/70">Create your first challenge to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="oasis-card border-cyan-500/30">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-cyan-400 mb-2">{challenge.title}</CardTitle>
                <p className="text-cyan-200/80 text-sm">{challenge.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={challenge.isActive ? "default" : "secondary"}>
                  {challenge.isActive ? "Active" : "Inactive"}
                </Badge>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                  {challenge.points} pts
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center space-x-2 text-cyan-200/70">
                <Users className="h-4 w-4" />
                <span className="text-sm">{challenge._count.submissions} submissions</span>
              </div>
              <div className="text-cyan-200/70 text-sm">Created: {formatDate(challenge.createdAt)}</div>
              <div className="text-cyan-200/70 text-sm">Updated: {formatDate(challenge.updatedAt)}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {challenge.algorithmicProblem && (
                <div className="p-3 bg-blue-500/10 rounded border border-blue-500/30">
                  <div className="text-blue-400 font-medium text-sm mb-1">Algorithmic Problem</div>
                  <div className="text-blue-200 text-sm">{challenge.algorithmicProblem.title}</div>
                </div>
              )}
              {challenge.buildathonProblem && (
                <div className="p-3 bg-green-500/10 rounded border border-green-500/30">
                  <div className="text-green-400 font-medium text-sm mb-1">Buildathon Problem</div>
                  <div className="text-green-200 text-sm">{challenge.buildathonProblem.title}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(challenge)}
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
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
  )
}
