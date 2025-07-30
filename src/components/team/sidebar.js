"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Code, BarChart3, User, LogOut, Menu, X, Target } from "lucide-react"
import { toast } from "sonner"

export default function Sidebar({ team, onNavigate, currentView }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const navigationItems = [
    {
      id: "challenges",
      label: "Challenges",
      icon: Code,
      description: "Solve algorithmic problems",
      badge: team?.activeChallenges || 0,
    },
    {
      id: "progress",
      label: "Progress",
      icon: Target,
      description: "Track your advancement",
      badge: null,
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      description: "Team rankings",
      badge: team?.rank ? `#${team.rank}` : null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Performance metrics",
      badge: null,
    },
    {
      id: "profile",
      label: "Team Profile",
      icon: User,
      description: "Manage team settings",
      badge: null,
    },
  ]

  const handleLogout = async () => {
    try {
      localStorage.removeItem("teamToken")
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  const handleNavigation = (itemId) => {
    if (onNavigate) {
      onNavigate(itemId)
    }
  }

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{team?.name || "Team Portal"}</h2>
                <p className="text-xs text-gray-500">{team?.points || 0} points</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.id}
            variant={currentView === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"} h-12`}
            onClick={() => handleNavigation(item.id)}
          >
            <item.icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && (
              <>
                <div className="flex-1 text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </div>

      {/* Team Stats */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Team Rank</span>
              <Badge variant="outline">#{team?.rank || "N/A"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Points</span>
              <span className="text-sm font-bold text-blue-600">{team?.points || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-2"}`} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
}
