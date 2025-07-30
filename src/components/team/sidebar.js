"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Code, BarChart3, User, LogOut, Menu, X, Target, Star, Award } from "lucide-react"
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
      color: "blue",
    },
    {
      id: "progress",
      label: "Progress",
      icon: Target,
      description: "Track your advancement",
      badge: null,
      color: "emerald",
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      description: "Team rankings",
      badge: team?.rank ? `#${team.rank}` : null,
      color: "amber",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      description: "Performance metrics",
      badge: null,
      color: "purple",
    },
    {
      id: "profile",
      label: "Team Profile",
      icon: User,
      description: "Manage team settings",
      badge: null,
      color: "indigo",
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

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: {
        bg: isActive ? "bg-blue-100" : "hover:bg-blue-50",
        text: isActive ? "text-blue-700" : "text-slate-700 hover:text-blue-600",
        icon: isActive ? "text-blue-600" : "text-slate-500",
        border: isActive ? "border-blue-200" : "border-transparent",
      },
      emerald: {
        bg: isActive ? "bg-emerald-100" : "hover:bg-emerald-50",
        text: isActive ? "text-emerald-700" : "text-slate-700 hover:text-emerald-600",
        icon: isActive ? "text-emerald-600" : "text-slate-500",
        border: isActive ? "border-emerald-200" : "border-transparent",
      },
      amber: {
        bg: isActive ? "bg-amber-100" : "hover:bg-amber-50",
        text: isActive ? "text-amber-700" : "text-slate-700 hover:text-amber-600",
        icon: isActive ? "text-amber-600" : "text-slate-500",
        border: isActive ? "border-amber-200" : "border-transparent",
      },
      purple: {
        bg: isActive ? "bg-purple-100" : "hover:bg-purple-50",
        text: isActive ? "text-purple-700" : "text-slate-700 hover:text-purple-600",
        icon: isActive ? "text-purple-600" : "text-slate-500",
        border: isActive ? "border-purple-200" : "border-transparent",
      },
      indigo: {
        bg: isActive ? "bg-indigo-100" : "hover:bg-indigo-50",
        text: isActive ? "text-indigo-700" : "text-slate-700 hover:text-indigo-600",
        icon: isActive ? "text-indigo-600" : "text-slate-500",
        border: isActive ? "border-indigo-200" : "border-transparent",
      },
    }
    return colors[color] || colors.blue
  }

  return (
    <div
      className={`bg-white border-r border-slate-200 shadow-sm transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">{team?.name || "Team Portal"}</h2>
                <div className="flex items-center space-x-2">
                  <Star className="h-3 w-3 text-amber-500" />
                  <p className="text-sm text-slate-600 font-medium">{team?.points || 0} points</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-lg"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3">Navigation</h3>
          )}
        </div>
        {navigationItems.map((item) => {
          const isActive = currentView === item.id
          const colorClasses = getColorClasses(item.color, isActive)

          return (
            <button
              key={item.id}
              className={`w-full flex items-center ${isCollapsed ? "justify-center px-3" : "justify-start px-4"} py-3 rounded-xl transition-all duration-200 border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} group`}
              onClick={() => handleNavigation(item.id)}
            >
              <item.icon className={`h-5 w-5 ${colorClasses.icon} ${isCollapsed ? "" : "mr-3"} transition-colors`} />
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors">
                      {item.description}
                    </div>
                  </div>
                  {item.badge && (
                    <Badge
                      className={`ml-2 text-xs px-2 py-1 ${
                        isActive
                          ? "bg-white/80 text-slate-700 border-slate-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Team Stats */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <Award className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold text-slate-800">Team Stats</h4>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Current Rank</span>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-2 py-1 text-xs font-semibold">
                  #{team?.rank || "N/A"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Total Points</span>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 text-blue-500" />
                  <span className="text-sm font-bold text-blue-600">{team?.points || 0}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Active Challenges</span>
                  <span className="text-xs font-semibold text-slate-700">{team?.activeChallenges || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <Button
          variant="outline"
          className={`w-full ${isCollapsed ? "justify-center px-3" : "justify-start px-4"} py-3 text-red-600 border-red-200 hover:bg-red-50 bg-white hover:border-red-300 transition-all duration-200 rounded-xl font-medium`}
          onClick={handleLogout}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </div>
  )
}
