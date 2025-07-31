"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Users, Mail, Calendar, Trophy, Edit, CheckCircle, Shield, Star, Award } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"

export default function TeamProfile({ team, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: team?.name || "",
    members: Array.isArray(team?.members) ? team.members.join("\n") : team?.members || "",
    email: team?.email || "",
  })

  const handleSave = async () => {
    
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Team Profile</h1>
            </div>
            <p className="text-slate-600 text-lg">Manage your team information and track your progress</p>
          </div>
          <Button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
              isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Edit className="h-4 w-4" />
            <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Basic Information */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
              <Users className="h-5 w-5 text-blue-600" />
              <span>Team Information</span>
            </CardTitle>
            <CardDescription className="text-slate-600">Basic details about your team and members</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Team Name</label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-colors"
                  placeholder="Enter your team name"
                />
              ) : (
                <div className="p-4 rounded-lg border border-slate-200">
                  <p className="text-lg font-semibold text-slate-800">{team?.name || "No team name set"}</p>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-colors"
                  placeholder="team@example.com"
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-700">{team?.email || "No email provided"}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Team Members</label>
              {isEditing ? (
                <Textarea
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                  placeholder="Enter team member names (one per line)"
                  className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-colors"
                  rows={5}
                />
              ) : (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {team?.members && team.members.length > 0 ? (
                    <div className="space-y-3">
                      {(Array.isArray(team.members) ? team.members : team.members.split("\n"))
                        .filter((member) => member.trim())
                        .map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 bg-white rounded-md border border-slate-100"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm">
                                {member.trim().charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-slate-700 font-medium">{member.trim()}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No members listed</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Registration Date</label>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700">{team?.createdAt ? formatDate(team.createdAt) : "Unknown"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-emerald-50 border-b border-slate-200">
              <CardTitle className="flex items-center space-x-3 text-xl text-slate-800">
                <Trophy className="h-5 w-5 text-emerald-600" />
                <span>Performance Stats</span>
              </CardTitle>
              <CardDescription className="text-slate-600">
                Your team's current standing and achievements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center justify-center mb-3">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-1">{team?.points || 0}</div>
                  <div className="text-sm font-medium text-blue-600">Total Points</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-center justify-center mb-3">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-700 mb-1">#{team?.rank || "N/A"}</div>
                  <div className="text-sm font-medium text-purple-600">Current Rank</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">Authentication Status</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">Verified</Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">Account Type</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">Team</Badge>
                </div>

                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-slate-700">Challenge Access</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50 border-b border-slate-200">
              <CardTitle className="text-lg text-slate-800">Quick Actions</CardTitle>
              <CardDescription className="text-slate-600">Common team management tasks</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="justify-start h-12 border-slate-200 hover:bg-slate-50 text-slate-700 bg-transparent"
                >
                  <Trophy className="h-4 w-4 mr-3" />
                  View Leaderboard
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 border-slate-200 hover:bg-slate-50 text-slate-700 bg-transparent"
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Challenge History
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 border-slate-200 hover:bg-slate-50 text-slate-700 bg-transparent"
                >
                  <Mail className="h-4 w-4 mr-3" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            Save Changes
          </Button>
        </div>
      )}
    </div>
  )
}
