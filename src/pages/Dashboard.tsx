
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/recorder')} 
              className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-primary text-white font-semibold px-6 py-3 h-auto"
            >
              <Mic className="h-5 w-5 mr-2" />
              New Recording
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-primary/20 hover:bg-primary/5">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Recent Sessions */}
          <div className="lg:col-span-1 space-y-4">
            {/* Recent Sessions */}
            <Card className="bg-white/80 backdrop-blur-sm border-primary/10 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/10 rounded-t-lg">
                <CardTitle className="flex items-center text-primary">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Sessions
                </CardTitle>
                <CardDescription className="text-primary/70">
                  {sessions.length} total recordings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-6">
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg">No recordings yet</p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => navigate('/recorder')} 
                        className="w-full bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-primary text-white font-semibold"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Record First Lecture
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={addSampleSession} 
                        className="w-full border-primary/20 hover:bg-primary/5 text-primary"
                      >
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
              <Card className="h-96 flex items-center justify-center bg-white/80 backdrop-blur-sm border-primary/10 shadow-lg">
                <CardContent className="text-center">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="mb-4 text-2xl text-primary">No Session Selected</CardTitle>
                  <CardDescription className="mb-8 text-lg text-muted-foreground">
                    Select a session from the sidebar or create a new recording to get started
                  </CardDescription>
                  <Button 
                    onClick={() => navigate('/recorder')}
                    className="bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary shadow-primary text-white font-semibold px-8 py-3 h-auto"
                  >
                    <Plus className="h-5 w-5 mr-2" />
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
