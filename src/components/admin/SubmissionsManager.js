"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Search, Clock, CheckCircle, XCircle, Eye, MessageSquare, ExternalLink } from "lucide-react"

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [reviewComment, setReviewComment] = useState("")
  const [points, setPoints] = useState("")
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/admin/submissions/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      } else {
        console.error("Failed to fetch submissions")
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleReview = async (submissionId, status) => {
    setReviewing(true)
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/admin/submissions/${submissionId}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          comment: reviewComment,
          point : points
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result.message)
        setSelectedSubmission(null)
        setReviewComment("")
        fetchSubmissions()
      } else {
        const error = await response.json()
        console.error("Review failed:", error.error)
      }
    } catch (error) {
      console.error("Review error:", error)
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>
    }
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.challenge?.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400 text-lg">Loading submissions...</div>
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
            <h1 className="text-4xl font-bold mb-4">Submissions Review</h1>
            <p className="text-purple-100 text-lg">Review and evaluate team submissions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {submissions.filter((s) => !s.status || s.status === "pending").length}
            </div>
            <div className="text-purple-100">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Submissions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{submissions.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {submissions.filter((s) => !s.status || s.status === "pending").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {submissions.filter((s) => s.status === "accepted").length}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {submissions.filter((s) => s.status === "rejected").length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-red-500">
                <XCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card className="shadow-md border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              All Submissions
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search submissions..."
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
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Challenge</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Points</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {submission.team?.name || "Unknown Team"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {submission.challenge?.title || "Unknown Challenge"}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {submission.type || "Unknown"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(submission.status)}</td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">{submission.points || 0}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No submissions found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Submissions will appear here when teams submit their work."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Review Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Team</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.team?.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Challenge</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.challenge?.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Type</h3>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {selectedSubmission.type || "Unknown"}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Language</h3>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.language || "Not specified"}</p>
                </div>
              </div>

              {selectedSubmission.githubLink && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">GitHub Link</h3>
                  <a
                    href={selectedSubmission.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {selectedSubmission.githubLink}
                  </a>
                </div>
              )}

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Submission Content</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                    {selectedSubmission.content || "No content available"}
                  </pre>
                </div>
              </div>

              {selectedSubmission.output && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Output</h3>
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-32 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                      {selectedSubmission.output}
                    </pre>
                  </div>
                </div>
              )}
              {(!selectedSubmission.status || selectedSubmission.status === "pending") && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Add Points</h3>
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg max-h-64 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                    <input
                    placeholder="Add your review comment..."
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="min-h-[10px] border-2"
                  />
                  </pre>
                </div>
              </div>
              )}

              {(!selectedSubmission.status || selectedSubmission.status === "pending") && (
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Review Comment</h3>
                  <Textarea
                    placeholder="Add your review comment..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {(!selectedSubmission.status || selectedSubmission.status === "pending") && (
                  <>
                    <Button
                      onClick={() => handleReview(selectedSubmission.id, "accepted")}
                      disabled={reviewing}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {reviewing ? "Processing..." : "Accept"}
                    </Button>
                    <Button
                      onClick={() => handleReview(selectedSubmission.id, "rejected")}
                      disabled={reviewing}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {reviewing ? "Processing..." : "Reject"}
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedSubmission(null)
                    setReviewComment("")
                  }}
                  disabled={reviewing}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
