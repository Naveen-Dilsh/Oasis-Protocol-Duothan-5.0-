"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminDashboardOverview from "@/components/admin/AdminDashboardOverview"
import ChallengeList from "@/components/admin/ChallengeList"
import ChallengeForm from "@/components/admin/ChallengeForm"
import SubmissionsManager from "@/components/admin/SubmissionsManager"
import TeamsManager from "@/components/admin/TeamsManager"

export default function AdminDashboardNew() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalChallenges: 0,
    activeChallenges: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    activeTeams: 0,
    systemAlerts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState(null)
  const [challengeFormMode, setChallengeFormMode] = useState("list") // 'list', 'create', 'edit'
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchStats()
  }, [])



  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        localStorage.removeItem("adminToken")
        toast.error("Session expired. Please login again.")
        router.push("/admin/login")
      }
    } catch (error) {
      localStorage.removeItem("adminToken")
      router.push("/admin/login")
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats({
          totalTeams: data.teamCount || 0,
          totalChallenges: data.challengeCount || 0,
          activeChallenges: data.activeChallenges || 0,
          totalSubmissions: data.submissionCount || 0,
          pendingSubmissions: data.pendingSubmissions || 0,
          activeTeams: data.activeTeams || 0, 
          systemAlerts: data.systemAlerts || 0,
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigation = (view) => {
    setActiveTab(view)
    if (view === "challenges") {
      setChallengeFormMode("list")
      setSelectedChallenge(null)
    }
  }

  const handleChallengeEdit = (challenge) => {
    setSelectedChallenge(challenge)
    setChallengeFormMode("edit")
  }

  const handleChallengeCreate = () => {
    setSelectedChallenge(null)
    setChallengeFormMode("create")
  }

  const handleChallengeSave = () => {
    setChallengeFormMode("list")
    setSelectedChallenge(null)
    
  }

  const handleChallengeCancel = () => {
    setChallengeFormMode("list")
    setSelectedChallenge(null)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400 text-lg">Loading dashboard...</div>
          </div>
        </div>
      )
    }

    switch (activeTab) {
      case "dashboard":
        return <AdminDashboardOverview stats={stats} onNavigate={handleNavigation} />
      case "challenges":
        if (challengeFormMode === "create" || challengeFormMode === "edit") {
          return (
            <ChallengeForm
              challenge={selectedChallenge}
              onSave={handleChallengeSave}
              onCancel={handleChallengeCancel}
            />
          )
        }
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-4">Challenge Management</h1>
                  <p className="text-blue-100 text-lg">Create and manage OASIS security challenges</p>
                </div>
                <button
                  onClick={handleChallengeCreate}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Create Challenge
                </button>
              </div>
            </div>
            <ChallengeList onEdit={handleChallengeEdit} />
          </div>
        )
      case "submissions":
        return <SubmissionsManager />
      case "teams":
        return <TeamsManager />
      case "leaderboard":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold mb-4">Leaderboard Management</h1>
              <p className="text-blue-100 text-lg">Monitor team rankings and performance</p>
            </div>
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">Leaderboard management coming soon...</p>
            </div>
          </div>
        )
      case "analytics":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold mb-4">Analytics Dashboard</h1>
              <p className="text-blue-100 text-lg">Detailed platform analytics and insights</p>
            </div>
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">Advanced analytics coming soon...</p>
            </div>
          </div>
        )
      case "system":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold mb-4">System Management</h1>
              <p className="text-blue-100 text-lg">Platform health and system configuration</p>
            </div>
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">System management coming soon...</p>
            </div>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
              <h1 className="text-4xl font-bold mb-4">Platform Settings</h1>
              <p className="text-blue-100 text-lg">Configure platform settings and preferences</p>
            </div>
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-xl">Settings panel coming soon...</p>
            </div>
          </div>
        )
      default:
        return <AdminDashboardOverview stats={stats} onNavigate={handleNavigation} />
    }
  }

  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} onNavigate={handleNavigation}/>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{renderContent()}</div>
        </div>
      </div>
  )
}
