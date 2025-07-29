"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Trophy,
  FileText,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Target,
} from "lucide-react"

export default function AdminDashboardOverview({ stats, onNavigate }) {
  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "submission",
      message: 'Team "Code Warriors" submitted solution for "Binary Search Tree"',
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "team",
      message: 'New team "Debug Masters" registered',
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 3,
      type: "challenge",
      message: 'Challenge "SQL Injection" was updated',
      time: "1 hour ago",
      status: "info",
    },
  ])

  const statCards = [
    {
      title: "Total Teams",
      value: stats?.totalTeams || 0,
      change: "+12%",
      changeType: "positive",
      icon: Users,
      color: "bg-blue-500",
      onClick: () => onNavigate("teams"),
    },
    {
      title: "Active Challenges",
      value: stats?.activeChallenges || 0,
      change: "+2",
      changeType: "positive",
      icon: Trophy,
      color: "bg-green-500",
      onClick: () => onNavigate("challenges"),
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingSubmissions || 0,
      change: "-5",
      changeType: "negative",
      icon: FileText,
      color: "bg-orange-500",
      onClick: () => onNavigate("submissions"),
    },
    {
      title: "Total Submissions",
      value: stats?.totalSubmissions || 0,
      change: "+24%",
      changeType: "positive",
      icon: TrendingUp,
      color: "bg-purple-500",
      onClick: () => onNavigate("analytics"),
    },
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "info":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">Monitor and manage the OASIS Protocol platform</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{new Date().toLocaleDateString()}</div>
            <div className="text-blue-200">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-0 shadow-md hover:scale-105"
            onClick={card.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{card.value}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "positive" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Latest platform events and updates</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  {getStatusIcon(activity.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="shadow-md border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              System Health
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">Real-time system metrics</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "45%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">62%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "62%" }}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Database</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">API Response</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Quick Actions
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">Common administrative tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => onNavigate("challenges")} className="h-16 bg-blue-600 hover:bg-blue-700 text-white">
              <Trophy className="w-5 h-5 mr-2" />
              Create Challenge
            </Button>
            <Button
              onClick={() => onNavigate("submissions")}
              variant="outline"
              className="h-16 border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <FileText className="w-5 h-5 mr-2" />
              Review Submissions
            </Button>
            <Button
              onClick={() => onNavigate("teams")}
              variant="outline"
              className="h-16 border-green-200 text-green-700 hover:bg-green-50"
            >
              <Users className="w-5 h-5 mr-2" />
              Manage Teams
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
