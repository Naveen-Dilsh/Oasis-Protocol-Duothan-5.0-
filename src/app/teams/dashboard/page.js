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
  const [selectedChallenge, setSelectedChallenge] = useState([
    {
      title: "The First Key",
      description:
        "Unlock the first layer of the OASIS security system. This challenge tests your ability to decode encrypted messages and understand the fundamental structure of the virtual world.",
      points: 500,
      order: 1,
      algorithmicProblem: {
        title: "Array Sum Challenge",
        description:
          "Given an array of integers, find the sum of all elements and return it as a string with the prefix 'SUM_'.",
        inputFormat: "First line contains n (array size). Second line contains n space-separated integers.",
        outputFormat: "Single line containing 'SUM_' followed by the sum",
        constraints: "1 ≤ n ≤ 1000, -1000 ≤ array elements ≤ 1000",
        examples: [
          {
            input: "3\n1 2 3",
            output: "SUM_6",
          },
          {
            input: "4\n-1 0 1 2",
            output: "SUM_2",
          },
        ],
        flag: "SUM_6",
      },
      buildathonProblem: {
        title: "Task Management Dashboard",
        description: "Build a responsive task management dashboard with user authentication and real-time updates.",
        requirements: `
1. User authentication system (login/register)
2. Create, read, update, delete tasks
3. Task categories and priorities
4. Responsive design for mobile and desktop
5. Search and filter functionality
6. Data persistence (database or local storage)
7. Clean, modern UI/UX design
        `,
        resources: [
          "https://react.dev",
          "https://nextjs.org/docs",
          "https://tailwindcss.com/docs",
          "https://ui.shadcn.com",
        ],
      },
    },
    {
      title: "The Second Gate",
      description: "Navigate through the second security layer by solving complex algorithmic puzzles.",
      points: 750,
      order: 2,
      algorithmicProblem: {
        title: "String Reversal Cipher",
        description:
          "Reverse each word in a sentence while keeping the word order intact. Return the result with 'REVERSED_' prefix.",
        inputFormat: "Single line containing a sentence with words separated by spaces.",
        outputFormat: "Single line containing 'REVERSED_' followed by the processed sentence",
        constraints: "1 ≤ sentence length ≤ 1000 characters",
        examples: [
          {
            input: "hello world",
            output: "REVERSED_olleh dlrow",
          },
          {
            input: "the quick brown fox",
            output: "REVERSED_eht kciuq nworb xof",
          },
        ],
        flag: "REVERSED_olleh dlrow",
      },
      buildathonProblem: {
        title: "E-commerce Product Catalog",
        description: "Create a modern e-commerce product catalog with shopping cart functionality.",
        requirements: `
1. Product listing with search and filters
2. Product detail pages with images
3. Shopping cart with add/remove items
4. User authentication and profiles
5. Responsive design
6. Product categories and sorting
7. Checkout process simulation
        `,
        resources: [
          "https://stripe.com/docs",
          "https://nextjs.org/docs/app/building-your-application/data-fetching",
          "https://www.prisma.io/docs",
        ],
      },
    },
  ]
)
  const [loading, setLoading] = useState(true)
  const router = useRouter()


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
    if (!loading) {
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
