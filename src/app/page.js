"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, Code, Trophy, Users, Target, ArrowRight, CheckCircle, Key, HelpCircle } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "Enterprise-grade security system with role-based access control",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Code,
      title: "Algorithmic Challenges",
      description: "Comprehensive coding assessments with automated evaluation",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Trophy,
      title: "Project Showcase",
      description: "Full-stack development challenges with real-world applications",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Collaborative workspace with integrated project management",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const phases = [
    {
      icon: Target,
      title: "Assessment Phase",
      description: "Complete algorithmic challenges to demonstrate technical proficiency",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Code,
      title: "Development Phase",
      description: "Build innovative solutions using modern technologies and frameworks",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Trophy,
      title: "Evaluation Phase",
      description: "Present your solutions and compete for recognition and prizes",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">OASIS Protocol</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push("/flag-guide")}
                variant="ghost"
                className="text-gray-600 hover:text-gray-900"
              >
                <Key className="h-4 w-4 mr-2" />
                Flag Guide
              </Button>
              <Button
                onClick={() => router.push("/login")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Admin Portal
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-20">
          <div className="mb-8">
            <div className="inline-flex p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8">
              <Shield className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The <span className="professional-text">OASIS Protocol</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              A comprehensive buildathon platform designed to challenge developers through algorithmic problem-solving
              and innovative project development. Test your skills, collaborate with teams, and build the future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button
              onClick={() => router.push("/admin/login")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
            >
              <Shield className="h-5 w-5 mr-2" />
              Admin Dashboard
            </Button>
            <Button
              onClick={() => router.push("/teams/register")}
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg bg-transparent"
            >
              <Users className="h-5 w-5 mr-2" />
              Team Registration
            </Button>
            <Button
              onClick={() => router.push("/teams/login")}
              size="lg"
              variant="outline"
              className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg bg-transparent"
            >
              Team Login
            </Button>
          </div>

          {/* New Flag Guide CTA */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-16 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                <Key className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">New to OASIS Protocol?</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Learn how to solve challenges and find flags with our comprehensive guide!
            </p>
            <Button onClick={() => router.push("/flag-guide")} className="bg-yellow-500 hover:bg-yellow-600 text-white">
              <HelpCircle className="h-4 w-4 mr-2" />
              View Flag Guide
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="stats-card border-0 shadow-lg bg-white">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto mb-4 p-4 rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-gray-900 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Overview */}
        <Card className="border-0 shadow-xl bg-white max-w-6xl mx-auto mb-20">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Competition Process</CardTitle>
            <p className="text-gray-600 text-lg">A structured approach to technical assessment and innovation</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {phases.map((phase, index) => (
                <div key={index} className="text-center relative">
                  <div
                    className={`mb-6 p-6 rounded-2xl ${phase.bgColor} mx-auto w-20 h-20 flex items-center justify-center`}
                  >
                    <phase.icon className={`h-10 w-10 ${phase.color}`} />
                  </div>
                  <h3 className={`font-bold text-lg mb-3 ${phase.color}`}>{phase.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{phase.description}</p>
                  {index < phases.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-10 -right-4 h-6 w-6 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose OASIS Protocol?</h2>
            <div className="space-y-4">
              {[
                "Comprehensive skill assessment through algorithmic challenges",
                "Real-world project development experience",
                "Collaborative team environment",
                "Industry-standard evaluation criteria",
                "Professional development opportunities",
                "Recognition and networking possibilities",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="text-center">
              <div className="inline-flex p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to Begin?</h3>
              <p className="text-gray-600 mb-6">Join the next generation of developers and innovators</p>
              <Button
                onClick={() => router.push("/flag-guide")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">OASIS Protocol</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering the next generation of developers through innovative challenges and collaborative learning.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Challenges</li>
                <li>Leaderboard</li>
                <li>Teams</li>
                <li>Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>Help Center</li>
                <li>Contact</li>
                <li>Status</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 OASIS Protocol. Building the future of competitive programming.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
