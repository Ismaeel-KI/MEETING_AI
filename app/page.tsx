"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Mic,
  Play,
  Pause,
  Square,
  Settings,
  Download,
  Share2,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Brain,
  FileText,
  Zap,
  BookOpen,
  ExternalLink,
  Loader2,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

interface TranscriptEntry {
  id: string
  speaker: string
  text: string
  timestamp: string
  confidence: number
}

interface Task {
  id: string
  title: string
  assignee: string
  priority: "high" | "medium" | "low"
  completed: boolean
  dueDate?: string
}

interface Summary {
  keyPoints: string[]
  decisions: string[]
  nextSteps: string[]
  participants: string[]
}

export default function MeetingTranscriptApp() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [meetingDuration, setMeetingDuration] = useState(0)
  const [activeTab, setActiveTab] = useState("transcript")
  const scrollRef = useRef<HTMLDivElement>(null)

  const [isNotionDialogOpen, setIsNotionDialogOpen] = useState(false)
  const [notionConfig, setNotionConfig] = useState({
    apiKey: "",
    databaseId: "",
    pageTitle: "",
  })
  const [isExportingToNotion, setIsExportingToNotion] = useState(false)
  const [
    /* remove notionDatabases */
  ] = useState<Array<{ id: string; title: string }>>([])

  // Handle theme mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data for demonstration
  useEffect(() => {
    const mockTranscript: TranscriptEntry[] = [
      {
        id: "1",
        speaker: "John Smith",
        text: "Good morning everyone, let's start with the quarterly review discussion.",
        timestamp: "09:00:15",
        confidence: 0.95,
      },
      {
        id: "2",
        speaker: "Sarah Johnson",
        text: "Thanks John. I've prepared the analytics report showing a 23% increase in user engagement.",
        timestamp: "09:00:32",
        confidence: 0.92,
      },
      {
        id: "3",
        speaker: "Mike Chen",
        text: "That's excellent news. We should focus on the mobile optimization project next quarter.",
        timestamp: "09:01:05",
        confidence: 0.88,
      },
    ]

    const mockSummary: Summary = {
      keyPoints: [
        "Quarterly review shows 23% increase in user engagement",
        "Mobile optimization identified as priority for next quarter",
        "Analytics report demonstrates positive growth trends",
      ],
      decisions: [
        "Proceed with mobile optimization project",
        "Allocate additional resources to user engagement initiatives",
      ],
      nextSteps: ["Schedule mobile optimization planning session", "Review budget allocation for Q2 initiatives"],
      participants: ["John Smith", "Sarah Johnson", "Mike Chen"],
    }

    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Schedule mobile optimization planning session",
        assignee: "John Smith",
        priority: "high",
        completed: false,
        dueDate: "2024-02-15",
      },
      {
        id: "2",
        title: "Review budget allocation for Q2 initiatives",
        assignee: "Sarah Johnson",
        priority: "medium",
        completed: false,
        dueDate: "2024-02-20",
      },
      {
        id: "3",
        title: "Prepare mobile optimization proposal",
        assignee: "Mike Chen",
        priority: "high",
        completed: false,
        dueDate: "2024-02-18",
      },
    ]

    setTranscript(mockTranscript)
    setSummary(mockSummary)
    setTasks(mockTasks)
  }, [])

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [transcript])

  // Meeting timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setMeetingDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    setIsProcessing(true)
    // Simulate processing delay
    setTimeout(() => setIsProcessing(false), 2000)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setMeetingDuration(0)
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleNotionExport = async () => {
    if (!notionConfig.apiKey || !notionConfig.databaseId) {
      toast.error("Please configure Notion API key and database")
      return
    }

    setIsExportingToNotion(true)

    try {
      // Simulate export process - replace with your actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Export configuration saved!", {
        description: "Your Notion settings have been configured. Integration ready for backend implementation.",
      })

      setIsNotionDialogOpen(false)
    } catch (error) {
      toast.error("Failed to save configuration", {
        description: "Please check your settings and try again.",
      })
    } finally {
      setIsExportingToNotion(false)
    }
  }

  /* Remove fetchNotionDatabases */

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Light mode background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:opacity-0 transition-opacity duration-1000">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>

        {/* Dark mode background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-0 dark:opacity-100 transition-opacity duration-1000">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-full blur-3xl animate-float-slow"></div>

          {/* Animated particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse-slower"></div>
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400/30 rounded-full animate-pulse-slow"></div>
            <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400/30 rounded-full animate-pulse-slower"></div>
          </div>
        </div>

        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-black/5 animate-shimmer"></div>
      </div>

      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Brain className="h-8 w-8 text-blue-600 animate-pulse-gentle" />
                  <div className="absolute inset-0 h-8 w-8 text-blue-600 animate-ping opacity-20">
                    <Brain className="h-8 w-8" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]">
                  MeetingAI
                </h1>
              </div>
              {isRecording && (
                <Badge
                  variant="secondary"
                  className="animate-pulse bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  LIVE
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">Duration: {formatTime(meetingDuration)}</div>

              {/* Theme Toggle */}
              {mounted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="relative overflow-hidden group transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-500 transition-transform duration-300 group-hover:rotate-180" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-600 transition-transform duration-300 group-hover:-rotate-12" />
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="hover:scale-105 transition-transform duration-200 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the component remains the same, but update the main container */}
      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {!isRecording ? (
                      <Button
                        onClick={handleStartRecording}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Mic className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button onClick={handlePauseResume} variant="outline">
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button onClick={handleStopRecording} variant="destructive">
                          <Square className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Dialog open={isNotionDialogOpen} onOpenChange={setIsNotionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 hover:scale-105 transition-all duration-300 dark:from-blue-950/20 dark:to-purple-950/20 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Export to Notion
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span>Export to Notion</span>
                          </DialogTitle>
                          <DialogDescription>
                            Export your meeting summary and tasks to a Notion database. Configure your Notion
                            integration below.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="notion-api-key">Notion API Key</Label>
                            <Input
                              id="notion-api-key"
                              type="password"
                              placeholder="secret_..."
                              value={notionConfig.apiKey}
                              onChange={(e) => setNotionConfig((prev) => ({ ...prev, apiKey: e.target.value }))}
                            />
                            <p className="text-xs text-muted-foreground">
                              Get your API key from{" "}
                              <a
                                href="https://www.notion.so/my-integrations"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline inline-flex items-center"
                              >
                                Notion Integrations
                                <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notion-database">Database ID</Label>
                            <Input
                              id="notion-database"
                              placeholder="Enter your Notion database ID"
                              value={notionConfig.databaseId}
                              onChange={(e) => setNotionConfig((prev) => ({ ...prev, databaseId: e.target.value }))}
                            />
                            <p className="text-xs text-muted-foreground">
                              Copy the database ID from your Notion database URL
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="page-title">Page Title</Label>
                            <Input
                              id="page-title"
                              placeholder={`Meeting Summary - ${new Date().toLocaleDateString()}`}
                              value={notionConfig.pageTitle}
                              onChange={(e) => setNotionConfig((prev) => ({ ...prev, pageTitle: e.target.value }))}
                            />
                          </div>

                          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 space-y-2">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              What will be exported:
                            </h4>
                            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                              <li>• Meeting summary with key points and decisions</li>
                              <li>• Action items with assignees and due dates</li>
                              <li>• Full transcript with timestamps</li>
                              <li>• Meeting duration and participant list</li>
                            </ul>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsNotionDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={handleNotionExport}
                            disabled={!notionConfig.apiKey || !notionConfig.databaseId || isExportingToNotion}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {isExportingToNotion ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Exporting...
                              </>
                            ) : (
                              <>
                                <BookOpen className="h-4 w-4 mr-2" />
                                Export to Notion
                              </>
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {isProcessing && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                      <Zap className="h-4 w-4 animate-pulse" />
                      Processing with AI...
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm glass-enhanced">
                <TabsTrigger value="transcript" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Transcript</span>
                </TabsTrigger>
                <TabsTrigger value="summary" className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Summary</span>
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Tasks</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-6">
                <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>Live Transcript</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96" ref={scrollRef}>
                      <div className="space-y-4">
                        {transcript.map((entry) => (
                          <div key={entry.id} className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {entry.speaker
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.speaker}</p>
                                <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(entry.confidence * 100)}%
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300">{entry.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="mt-6">
                <div className="space-y-6">
                  {summary && (
                    <>
                      <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            <span>Key Points</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span>Decisions Made</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.decisions.map((decision, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{decision}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>

                      <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
                        <CardHeader>
                          <CardTitle className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-orange-600" />
                            <span>Next Steps</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {summary.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Action Items</span>
                      </div>
                      <Badge variant="secondary">{tasks.filter((t) => !t.completed).length} pending</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border bg-white/40 dark:bg-slate-700/40"
                        >
                          <button onClick={() => toggleTaskComplete(task.id)} className="flex-shrink-0">
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-muted-foreground">Assigned to: {task.assignee}</span>
                              {task.dueDate && (
                                <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                              )}
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Meeting Info */}
            <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Meeting Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Participants</p>
                  <div className="mt-2 space-y-2">
                    {summary?.participants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {participant
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="text-sm">{participant}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isRecording ? (isPaused ? "Paused" : "Recording") : "Stopped"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm card-hover glass-enhanced">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Words spoken</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Key points</span>
                  <span className="font-medium">{summary?.keyPoints.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Action items</span>
                  <span className="font-medium">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-medium">{tasks.filter((t) => t.completed).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
