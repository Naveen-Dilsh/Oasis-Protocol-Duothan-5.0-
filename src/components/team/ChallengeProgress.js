"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, Lock, Code, Hammer, Trophy, ArrowRight, Timer,TrendingUp } from "lucide-react"

export default function ChallengeProgress({ challenges, teamProgress, onChallengeSelect }) {
  const getStatusIcon = (challenge, progress) => {
    if (progress?.buildathonCompleted) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else if (progress?.algorithmicCompleted) {
      return <Clock className="h-5 w-5 text-yellow-500" />
    } else {
      return <Lock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusText = (challenge, progress) => {
    if (progress?.buildathonCompleted) {
      return "Completed"
    } else if (progress?.algorithmicCompleted) {
      return "Buildathon Phase"
    } else {
      return "Algorithmic Phase"
    }
  }

  const getStatusVariant = (challenge, progress) => {
    if (progress?.buildathonCompleted) {
      return "default"
    } else if (progress?.algorithmicCompleted) {
      return "secondary"
    } else {
      return "outline"
    }
  }

  const completedChallenges = teamProgress?.filter((p) => p.buildathonCompleted).length || 0
  const totalChallenges = challenges?.length || 0
  const overallProgress = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Challenge Progress</h1>
            </div>
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl">Track your journey through the OASIS challenges</p>
          </div>
          <div className="flex items-center space-x-3 ml-6">
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Overall Progress</span>
          </CardTitle>
          <CardDescription>Your team's progress across all challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Challenges Completed</span>
              <span className="text-sm text-muted-foreground">
                {completedChallenges} of {totalChallenges}
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Challenges</h2>
        <div className="grid gap-4">
          {challenges?.map((challenge, index) => {
            const progress = teamProgress?.find((p) => p.challengeId === challenge.id)
            const isLocked = index > 0 && !teamProgress?.some((p, i) => i === index - 1 && p.buildathonCompleted)

            return (
              <Card
                key={challenge.id}
                className={`transition-all hover:shadow-md ${
                  isLocked ? "opacity-60" : "cursor-pointer hover:border-primary/50"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(challenge, progress)}
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <Badge variant={getStatusVariant(challenge, progress)}>
                          {getStatusText(challenge, progress)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{challenge.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4" />
                          <span>{challenge.points} points</span>
                        </div>
                        {progress?.totalTime && (
                          <div className="flex items-center space-x-1">
                            <Timer className="h-4 w-4" />
                            <span>{Math.round(progress.totalTime / 60)}m</span>
                          </div>
                        )}
                      </div>
                      {/* Progress Phases */}
                      <div className="mt-4 flex items-center space-x-4">
                        <div
                          className={`flex items-center space-x-2 ${
                            progress?.algorithmicCompleted ? "text-green-600" : "text-muted-foreground"
                          }`}
                        >
                          <Code className="h-4 w-4" />
                          <span className="text-sm">Algorithmic</span>
                          {progress?.algorithmicCompleted && <CheckCircle className="h-4 w-4" />}
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div
                          className={`flex items-center space-x-2 ${
                            progress?.buildathonCompleted
                              ? "text-green-600"
                              : progress?.algorithmicCompleted
                                ? "text-yellow-600"
                                : "text-muted-foreground"
                          }`}
                        >
                          <Hammer className="h-4 w-4" />
                          <span className="text-sm">Buildathon</span>
                          {progress?.buildathonCompleted && <CheckCircle className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Button
                        onClick={() => onChallengeSelect(challenge)}
                        disabled={isLocked}
                        variant={progress?.buildathonCompleted ? "outline" : "default"}
                      >
                        {isLocked ? "Locked" : progress?.buildathonCompleted ? "Review" : "Continue"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
