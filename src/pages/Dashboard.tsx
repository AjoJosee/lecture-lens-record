import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  Download, 
  Clock, 
  Calendar, 
  FileText, 
  User,
  LogOut,
  Plus
} from "lucide-react";
import jsPDF from 'jspdf';

interface LectureSession {
  id: number;
  title: string;
  date: string;
  duration: number;
  transcript: string;
  summary: string;
}

const Dashboard = () => {
  const [sessions, setSessions] = useState<LectureSession[]>([]);
  const [currentSession, setCurrentSession] = useState<LectureSession | null>(null);
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));

    // Load sessions
    const sessionsData = localStorage.getItem('lectureSessions');
    const parsedSessions = sessionsData ? JSON.parse(sessionsData) : [];
    setSessions(parsedSessions);

    // Load current session if exists
    const currentSessionData = localStorage.getItem('currentSession');
    if (currentSessionData) {
      setCurrentSession(JSON.parse(currentSessionData));
      localStorage.removeItem('currentSession'); // Clear after loading
    } else if (parsedSessions.length > 0) {
      setCurrentSession(parsedSessions[0]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lectureSessions');
    localStorage.removeItem('currentSession');
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const downloadPDF = (session: LectureSession) => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(session.title, 20, 30);
      
      // Date and duration
      doc.setFontSize(12);
      doc.text(`Date: ${formatDate(session.date)}`, 20, 45);
      doc.text(`Duration: ${formatDuration(session.duration)}`, 20, 55);
      
      // Summary section
      doc.setFontSize(16);
      doc.text('Summary', 20, 75);
      doc.setFontSize(11);
      const summaryLines = doc.splitTextToSize(session.summary, 170);
      doc.text(summaryLines, 20, 85);
      
      // Transcript section
      const summaryHeight = summaryLines.length * 5;
      doc.setFontSize(16);
      doc.text('Transcript', 20, 95 + summaryHeight);
      doc.setFontSize(10);
      const transcriptLines = doc.splitTextToSize(session.transcript, 170);
      doc.text(transcriptLines, 20, 105 + summaryHeight);
      
      // Save
      doc.save(`${session.title.replace(/\s+/g, '_')}_transcript.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your transcript has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF",
        variant: "destructive",
      });
    }
  };

  const addSampleSession = () => {
    const sampleSession: LectureSession = {
      id: Date.now(),
      title: `Sample Lecture ${sessions.length + 1}`,
      date: new Date().toISOString(),
      duration: 1800 + Math.floor(Math.random() * 600), // 30-40 minutes
      transcript: "This is a sample lecture transcript. In today's session, we explored advanced concepts in computer science, including algorithm optimization, data structure efficiency, and practical applications in real-world scenarios. We discussed the importance of time complexity analysis and how different approaches can significantly impact performance. The session also covered best practices for code implementation and debugging strategies that can help developers write more efficient and maintainable code.",
      summary: "Sample lecture covering advanced computer science concepts, algorithm optimization, and practical development strategies with focus on performance and maintainability."
    };

    const updatedSessions = [sampleSession, ...sessions];
    setSessions(updatedSessions);
    localStorage.setItem('lectureSessions', JSON.stringify(updatedSessions));
    setCurrentSession(sampleSession);
    
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
            <Button onClick={() => navigate('/recorder')} className="bg-gradient-primary hover:bg-primary-hover">
              <Mic className="h-4 w-4 mr-2" />
              New Recording
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Sessions</span>
                  <Badge variant="secondary">{sessions.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Your recorded lectures and transcripts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No sessions yet</p>
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
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <Card 
                          key={session.id}
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            currentSession?.id === session.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setCurrentSession(session)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2">{session.title}</h3>
                            <div className="flex items-center text-xs text-muted-foreground space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(session.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(session.duration)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div className="lg:col-span-2">
            {currentSession ? (
              <div className="space-y-6">
                {/* Session Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{currentSession.title}</CardTitle>
                        <CardDescription>
                          {formatDate(currentSession.date)} • {formatDuration(currentSession.duration)}
                        </CardDescription>
                      </div>
                      <Button onClick={() => downloadPDF(currentSession)} className="bg-accent hover:bg-accent/90">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">
                      {currentSession.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Transcript */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transcript</CardTitle>
                    <CardDescription>
                      Full transcription of your lecture
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full rounded border p-4">
                      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {currentSession.transcript}
                      </p>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Session Selected</h3>
                    <p className="text-muted-foreground mb-4">
                      Select a session from the list to view its transcript and summary
                    </p>
                    <Button onClick={() => navigate('/recorder')}>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  </div>
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