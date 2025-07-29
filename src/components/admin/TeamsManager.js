"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Search, Mail, Trophy, CheckCircle, XCircle, MoreHorizontal, Download } from "lucide-react"

export default function TeamsManager() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")



  const handleTeamAction = async (teamId, action) => {
    
  }

  const exportTeams = () => {
    const csvContent = [
      ["Name", "Email", "Members", "Total Points", "Created At"].join(","),
      ...teams.map((team) =>
        [
          `"${team.name}"`,
          `"${team.email}"`,
          getMemberCount(team.members),
          team.totalPoints,
          `"${new Date(team.createdAt).toLocaleDateString()}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "teams.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Safe function to get member count
  const getMemberCount = (members) => {
    if (!members) return 0

    try {
      // If it's already a number or array
      if (typeof members === "number") return members
      if (Array.isArray(members)) return members.length

      // Try to parse as JSON first
      if (typeof members === "string") {
        try {
          const parsed = JSON.parse(members)
          return Array.isArray(parsed) ? parsed.length : 1
        } catch {
          // If JSON parsing fails, try to count comma-separated values
          return members.split(",").filter((member) => member.trim().length > 0).length
        }
      }

      return 0
    } catch (error) {
      console.error("Error parsing members:", error)
      return 0
    }
  }

  // Safe function to display members
  const displayMembers = (members) => {
    if (!members) return "No members"

    try {
      if (Array.isArray(members)) {
        return members.join(", ")
      }

      if (typeof members === "string") {
        try {
          const parsed = JSON.parse(members)
          if (Array.isArray(parsed)) {
            return parsed.join(", ")
          }
          return members
        } catch {
          return members
        }
      }

      return String(members)
    } catch (error) {
      return "Error displaying members"
    }
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400 text-lg">Loading teams...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Teams Management</h1>
            <p className="text-blue-100 text-lg">Manage and monitor team participants</p>
          </div>
          <Button onClick={exportTeams} className="bg-white text-blue-600 hover:bg-blue-50">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Teams</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{teams.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Teams</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {teams.filter((team) => team.totalPoints > 0).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {teams.length > 0 ? Math.max(...teams.map((team) => team.totalPoints)) : 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {teams.length > 0
                    ? Math.round(teams.reduce((sum, team) => sum + team.totalPoints, 0) / teams.length)
                    : 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-orange-500">
                <MoreHorizontal className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Table */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              All Teams ({filteredTeams.length})
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Team</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Members</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team) => (
                  <tr
                    key={team.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{team.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Created {new Date(team.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center text-gray-700 dark:text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {team.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {getMemberCount(team.members)} members
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{team.totalPoints}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        className={
                          team.totalPoints > 0
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {team.totalPoints > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTeamAction(team.id, "activate")}
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          title="Set team as active (gives minimum 1 point)"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTeamAction(team.id, "deactivate")}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          title="Set team as inactive (resets points to 0)"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No teams found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm ? "Try adjusting your search terms." : "Teams will appear here when they register."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
