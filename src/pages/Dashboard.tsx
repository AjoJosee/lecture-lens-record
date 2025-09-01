import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mic, FileText, LogOut, User } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/ui/PageHeader";
import SessionCard from "@/components/dashboard/SessionCard";
import TranscriptViewer from "@/components/dashboard/TranscriptViewer";

interface SessionData {
  id: number;
  title: string;
  date: string;
  duration: number;
  transcript: string;
  summary: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useLocalStorage<SessionData[]>('lectureSessions', []);
  const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Check for a newly created session
    const currentSession = localStorage.getItem('currentSession');
    if (currentSession) {
      const session = JSON.parse(currentSession);
      setSelectedSession(session);
      localStorage.removeItem('currentSession');
    } else if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  }, [navigate, sessions]);

  const handleSessionClick = (session: SessionData) => {
    setSelectedSession(session);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lectureSessions');
    localStorage.removeItem('currentSession');
    navigate('/');
  };

  const addSampleSession = () => {
    const sampleSession: SessionData = {
      id: Date.now(),
      title: `Sample Lecture ${sessions.length + 1}`,
      date: new Date().toISOString(),
      duration: 1800 + Math.floor(Math.random() * 600), // 30-40 minutes
      transcript: "This is a sample lecture transcript. In today's session, we explored advanced concepts in computer science, including algorithm optimization, data structure efficiency, and practical applications in real-world scenarios. We discussed the importance of time complexity analysis and how different approaches can significantly impact performance. The session also covered best practices for code implementation and debugging strategies that can help developers write more efficient and maintainable code.",
      summary: "Sample lecture covering advanced computer science concepts, algorithm optimization, and practical development strategies with focus on performance and maintainability."
    };

    const updatedSessions = [sampleSession, ...sessions];
    setSessions(updatedSessions);
    setSelectedSession(sampleSession);
    
    toast({
      title: "Sample Session Added",
      description: "A sample lecture has been added to your dashboard",
    });
  };

  if (!user) {
    return null; // Loading or redirecting
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/recorder')} className="bg-accent hover:bg-accent/90 text-white">
              <Mic className="h-4 w-4 mr-2" />
              New Recording
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Recent Sessions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Sessions
                </CardTitle>
                <CardDescription>
                  {sessions.length} total recordings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No recordings yet</p>
                    <div className="space-y-2">
                      <Button onClick={() => navigate('/recorder')} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Record First Lecture
                      </Button>
                      <Button variant="outline" onClick={addSampleSession} className="w-full">
                        Add Sample Session
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`${
                          selectedSession?.id === session.id ? 'ring-2 ring-primary rounded-lg' : ''
                        }`}
                      >
                        <SessionCard
                          session={session}
                          onClick={() => handleSessionClick(session)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Transcript View */}
          <div className="lg:col-span-2">
            {selectedSession ? (
              <TranscriptViewer session={selectedSession} />
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="mb-2">No Session Selected</CardTitle>
                  <CardDescription className="mb-6">
                    Select a session from the sidebar or create a new recording to get started
                  </CardDescription>
                  <Button 
                    onClick={() => navigate('/recorder')}
                    className="bg-accent hover:bg-accent/90 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Recording
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
