"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  FileText,
  Users,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Shield,
  Activity,
  LogOut,
  Target,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { useTheme } from "@/components/theme/ThemeProvider"
import { toast } from "sonner"

const navigation = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    id: "challenges",
    name: "Challenges",
    icon: Trophy,
    badge: "1",
    description: "Manage Problems",
  },
  {
    id: "submissions",
    name: "Submissions",
    icon: FileText,
    badge: "5",
    badgeColor: "bg-red-500",
    description: "Review Solutions",
  },
  {
    id: "teams",
    name: "Teams",
    icon: Users,
    badge: "2",
    description: "Manage Participants",
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    icon: Target,
    description: "Rankings & Stats",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: Activity,
    description: "Performance Insights",
  },
  {
    id: "system",
    name: "System",
    icon: Database,
    badge: "0",
    badgeColor: "bg-green-500",
    description: "Platform Health",
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    description: "Platform Config",
  },
]

export default function AdminSidebar({ activeTab, setActiveTab, stats, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false)
//   const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleNavigation = (tabId) => {
    if (setActiveTab) {
      setActiveTab(tabId)
    }
    if (onNavigate) {
      onNavigate(tabId)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("adminToken")
      toast.success("Logged out successfully")
      router.push("/login")
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <div
      className={`${collapsed ? "w-16" : "w-64"} transition-all duration-300 ease-in-out bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Portal</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">OASIS Protocol</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = activeTab === item.id
          const badgeCount = stats
            ? item.id === "challenges"
              ? stats.totalChallenges
              : item.id === "submissions"
                ? stats.pendingSubmissions
                : item.id === "teams"
                  ? stats.totalTeams
                  : item.id === "system"
                    ? stats.systemAlerts
                    : item.badge
            : item.badge

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              <item.icon
                className={`
                  ${collapsed ? "w-5 h-5" : "w-5 h-5 mr-3"} 
                  ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"}
                  transition-colors duration-200
                `}
              />

              {!collapsed && (
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.name}</span>
                    {badgeCount && badgeCount !== "0" && (
                      <Badge
                        className={`
                          text-xs px-1.5 py-0.5 
                          ${item.badgeColor || "bg-blue-500"} 
                          text-white border-0
                        `}
                      >
                        {badgeCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">System Status</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Active Teams</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{stats?.activeTeams || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-400">Server Load</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Normal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={}
            className={`${collapsed ? "w-full justify-center" : "w-full justify-start"} text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white`}
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {!collapsed && <span className="ml-2 text-sm">{theme === "light" ? "Dark" : "Light"} Mode</span>}
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={`${collapsed ? "w-full justify-center" : "w-full justify-start"} text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2 text-sm">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
