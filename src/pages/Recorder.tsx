
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mic, Square, Upload, FileAudio } from "lucide-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import RecordingControls from "@/components/recording/RecordingControls";
import RecordingStatus from "@/components/recording/RecordingStatus";
import RecordingTimer from "@/components/recording/RecordingTimer";
import RecordingInstructions from "@/components/recording/RecordingInstructions";
import AudioUpload from "@/components/recording/AudioUpload";
import SessionNameDialog from "@/components/recording/SessionNameDialog";

interface SessionData {
  id: number;
  title: string;
  date: string;
  duration: number;
  transcript: string;
  summary: string;
  audioUrl?: string;
}

const Recorder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useLocalStorage<SessionData[]>('lectureSessions', []);
  
  const {
    isRecording,
    isProcessing,
    audioBlob,
    duration,
    startRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder();

  const [showNameDialog, setShowNameDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast({
        title: "Recording Started",
        description: "Your lecture is now being recorded",
      });
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "Could not start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setShowNameDialog(true);
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setShowNameDialog(true);
  };

  const handleSaveSession = (title: string) => {
    const sessionData: SessionData = {
      id: Date.now(),
      title,
      date: new Date().toISOString(),
      duration: uploadedFile ? 0 : duration, // We don't know duration of uploaded files
      transcript: generateMockTranscript(title),
      summary: generateMockSummary(title),
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : (uploadedFile ? URL.createObjectURL(uploadedFile) : undefined)
    };

    const updatedSessions = [sessionData, ...sessions];
    setSessions(updatedSessions);
    
    // Store the current session to be selected in dashboard
    localStorage.setItem('currentSession', JSON.stringify(sessionData));

    setShowNameDialog(false);
    resetRecording();
    setUploadedFile(null);

    toast({
      title: "Session Saved",
      description: `"${title}" has been saved successfully`,
    });

    // Navigate to dashboard
    navigate('/dashboard');
  };

  // Mock functions for demonstration
  const generateMockTranscript = (title: string) => {
    return `This is a mock transcript for "${title}". In this lecture, we discussed various important concepts and methodologies. The session covered theoretical foundations as well as practical applications. Students were engaged throughout the discussion, asking pertinent questions and contributing valuable insights. Key topics included advanced problem-solving techniques, critical thinking approaches, and real-world applications of the subject matter. The lecture concluded with a comprehensive review of the main points and assignments for the next session.`;
  };

  const generateMockSummary = (title: string) => {
    return `Summary of "${title}": This lecture provided a comprehensive overview of key concepts with emphasis on practical applications and theoretical understanding. Main topics covered included advanced methodologies and critical thinking approaches relevant to the subject matter.`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Record New Lecture</h1>
            <p className="text-xl text-muted-foreground">
              Record your lecture or upload an existing audio file
            </p>
          </div>

          {/* Recording Section */}
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-card-foreground">Audio Recording</CardTitle>
              <CardDescription className="text-muted-foreground">
                Click start to begin recording your lecture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <RecordingStatus isRecording={isRecording} isProcessing={isProcessing} />
              
              {isRecording && (
                <div className="text-center">
                  <RecordingTimer duration={duration} />
                </div>
              )}

              <RecordingControls
                isRecording={isRecording}
                isProcessing={isProcessing}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
              />

              {!isRecording && !isProcessing && (
                <RecordingInstructions />
              )}
            </CardContent>
          </Card>

          {/* Upload Section */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-muted-foreground mb-4">
              <div className="h-px bg-border flex-1"></div>
              <span className="px-4 text-sm">OR</span>
              <div className="h-px bg-border flex-1"></div>
            </div>
          </div>

          <AudioUpload onFileUpload={handleFileUpload} />

          {/* Session Name Dialog */}
          <SessionNameDialog
            open={showNameDialog}
            onClose={() => {
              setShowNameDialog(false);
              resetRecording();
              setUploadedFile(null);
            }}
            onSave={handleSaveSession}
          />
        </div>
      </div>
    </div>
  );
};

export default Recorder;
