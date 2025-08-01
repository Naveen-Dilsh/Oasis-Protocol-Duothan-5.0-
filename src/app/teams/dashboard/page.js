"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Sidebar from "@/components/team/Sidebar"
import ActiveChallenge from "@/components/team/ActiveChallenge"
import ChallengeProgress from "@/components/team/ChallengeProgress"
import Leaderboard from "@/components/team/Leaderboard"
import PerformanceMetrics from "@/components/team/PerformanceMetrics"
import TeamProfile from "@/components/team/TeamProfile"


export default function TeamDashboard() {
  const [currentView, setCurrentView] = useState("challenges")
  const [team, setTeam] = useState()
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

      // Fetch team profile data
      const teamResponse = await fetch("/api/teams/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (teamResponse.ok) {
        const teamData = await teamResponse.json()
        setTeam({
          name: teamData.name,
          email: teamData.email,
          points: teamData.points,
          rank: teamData.rank,
          members: teamData.members,
          createdAt: teamData.createdAt,
        })
      } else if (teamResponse.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem("teamToken")
        router.push("/teams/login")
        return
      }

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
        console.log(progress)
      }
      // Fetch team submissions data
      const submissionsResponse = await fetch("/api/teams/submissions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (submissionsResponse.ok) {
        const submissionsData = await submissionsResponse.json()
        setSubmissions(submissionsData)
        console.log(submissionsData)
      } else {
        console.error("Failed to fetch submissions")
        setSubmissions([]) // Set empty array as fallback
      }
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
