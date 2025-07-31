"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Sidebar from "@/components/team/Sidebar"
import ActiveChallenge from "@/components/team/ActiveChallenge"
// import PerformanceMetrics from "@/components/dashboard/PerformanceMetrics"
// import ChallengeProgress from "@/components/dashboard/ChallengeProgress"
// import Leaderboard from "@/components/dashboard/Leaderboard"
// import TeamProfile from "@/components/dashboard/TeamProfile"

export default function TeamDashboard() {
  const [currentView, setCurrentView] = useState("challenges")
  const [team, setTeam] = useState(null)
  const [challenges, setChallenges] = useState([])
  const [teamProgress, setTeamProgress] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [selectedChallenge, setSelectedChallenge] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("teamToken")
    if (!token) {
      router.push("/teams/login")
      return
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("teamToken")

      // Fetch challenges and team progress
      const challengesResponse = await fetch("/api/teams/challenges", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json()
        setChallenges(challengesData)

        // Set first incomplete challenge as selected
        const firstIncomplete = challengesData.find((c) => !c.buildathonCompleted)
        if (firstIncomplete) {
          setSelectedChallenge(firstIncomplete)
        }

        // Extract team progress from challenges data
        const progress = challengesData.map((challenge) => ({
          challengeId: challenge.id,
          algorithmicCompleted: challenge.algorithmicCompleted,
          buildathonCompleted: challenge.buildathonCompleted,
          totalTime: Math.floor(Math.random() * 3600), // Mock data
        }))
        setTeamProgress(progress)
      }

      // Fetch team info from leaderboard
      const leaderboardResponse = await fetch("/api/teams/leaderboard")
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json()
        // Find current team in leaderboard (mock implementation)
        const currentTeam = leaderboardData[0] // This should be properly implemented
        setTeam({
          name: "Your Team", // This should come from token/session
          email: "team@example.com",
          points: currentTeam?.totalPoints || 0,
          rank: currentTeam?.rank || 1,
          members: ["Member 1", "Member 2", "Member 3"],
          createdAt: new Date().toISOString(),
        })
      }

      // Mock submissions data
      setSubmissions([
        {
          id: 1,
          challengeId: 1,
          type: "algorithmic",
          status: "accepted",
          createdAt: new Date().toISOString(),
          challenge: { title: "Binary Search Tree" },
        },
        {
          id: 2,
          challengeId: 1,
          type: "buildathon",
          status: "accepted",
          createdAt: new Date().toISOString(),
          challenge: { title: "Binary Search Tree" },
        },
      ])
    } catch (error) {
      toast.error("Failed to fetch data")
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigation = (view) => {
    setCurrentView(view)
  }

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge)
    setCurrentView("challenges")
  }

  const handleSubmitFlag = async (challengeId, flag) => {
    // Refresh data after successful submission
    await fetchData()
  }

  const handleSubmitBuildathon = async (challengeId, githubLink) => {
    // Refresh data after successful submission
    await fetchData()
  }

  const handleTeamUpdate = (updatedTeam) => {
    setTeam(updatedTeam)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 text-lg">Loading dashboard...</div>
          </div>
        </div>
      )
    }

    switch (currentView) {
      case "challenges":
        return (
          <ActiveChallenge
            challenge={selectedChallenge}
            progress={teamProgress.find((p) => p.challengeId === selectedChallenge?.id)}
            onSubmitFlag={handleSubmitFlag}
            onSubmitBuildathon={handleSubmitBuildathon}
          />
        )
      case "progress":
        return (
          <ChallengeProgress
            challenges={challenges}
            teamProgress={teamProgress}
            onChallengeSelect={handleChallengeSelect}
          />
        )
      case "leaderboard":
        return <Leaderboard currentTeam={team} />
      case "analytics":
        return <PerformanceMetrics team={team} submissions={submissions} progress={teamProgress} />
      case "profile":
        return <TeamProfile team={team} onUpdate={handleTeamUpdate} />
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Select a section from the sidebar</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      <Sidebar team={team} onNavigate={handleNavigation} currentView={currentView} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{renderContent()}</div>
      </div>
    </div>
  )
}
