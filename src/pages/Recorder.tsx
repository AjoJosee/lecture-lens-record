import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Square, Upload, ArrowLeft, Clock } from "lucide-react";

const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setStatus("Recording in progress...");
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording Started",
        description: "Your lecture is being recorded successfully",
      });
    } catch (error) {
      setStatus("Microphone access denied or not available");
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setStatus("Processing recording...");
      setIsProcessing(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate backend processing
    setTimeout(() => {
      setUploadProgress(100);
      setStatus("Transcription complete!");
      
      // Store session data
      const sessionData = {
        id: Date.now(),
        title: `Lecture ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        duration: recordingTime,
        transcript: "Today we discussed sorting algorithms, specifically focusing on quicksort and mergesort. Quicksort has an average time complexity of O(n log n) but can degrade to O(n²) in worst-case scenarios. Mergesort, on the other hand, maintains O(n log n) in all cases but requires additional O(n) space. We also covered the importance of choosing the right pivot in quicksort and how this affects performance. The divide-and-conquer approach used in both algorithms demonstrates fundamental computer science principles that apply to many problem-solving scenarios.",
        summary: "Lecture covered sorting algorithms including quicksort and mergesort, their time complexities, space requirements, and practical considerations for implementation. Key focus on divide-and-conquer strategies and pivot selection techniques."
      };

      // Save to localStorage
      const existingSessions = JSON.parse(localStorage.getItem('lectureSessions') || '[]');
      existingSessions.unshift(sessionData);
      localStorage.setItem('lectureSessions', JSON.stringify(existingSessions));
      localStorage.setItem('currentSession', JSON.stringify(sessionData));

      toast({
        title: "Processing Complete!",
        description: "Your lecture has been transcribed successfully",
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setStatus(`Uploading ${file.name}...`);
        setIsProcessing(true);
        processAudio(file);
        toast({
          title: "File Uploaded",
          description: `Processing ${file.name}...`,
        });
      } else {
        setStatus("Please select a valid audio file");
        toast({
          title: "Invalid File",
          description: "Please select an audio file (.mp3, .wav, .webm, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Record Lecture</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Recording Card */}
          <Card className="bg-gradient-card">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Audio Recorder</CardTitle>
              <CardDescription>
                Record your lecture or upload an existing audio file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timer */}
              {(isRecording || recordingTime > 0) && (
                <div className="flex items-center justify-center space-x-2 text-2xl font-mono">
                  <Clock className="h-6 w-6" />
                  <span>{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Recording Controls */}
              <div className="flex justify-center space-x-4">
                <Button
                  size="lg"
                  onClick={startRecording}
                  disabled={isRecording || isProcessing}
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg shadow-primary"
                >
                  <Mic className="h-6 w-6 mr-2" />
                  Start Recording
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  disabled={!isRecording || isProcessing}
                  className="px-8 py-4 text-lg"
                >
                  <Square className="h-6 w-6 mr-2" />
                  Stop & Save
                </Button>
              </div>

              {/* Status */}
              {status && (
                <div className="text-center">
                  <p className={`text-lg font-medium ${
                    status.includes('Recording') ? 'text-accent' :
                    status.includes('complete') ? 'text-accent' :
                    status.includes('denied') || status.includes('Failed') ? 'text-destructive' :
                    'text-muted-foreground'
                  }`}>
                    {status}
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing audio... {uploadProgress}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Audio File
              </CardTitle>
              <CardDescription>
                Already have a recording? Upload it here for transcription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="audio-file">Select Audio File</Label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    disabled={isRecording || isProcessing}
                    className="mt-2"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported formats: MP3, WAV, WebM, M4A, and other audio formats
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Recording Tips:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure you're in a quiet environment for best results</li>
                <li>• Speak clearly and at a moderate pace</li>
                <li>• Position your microphone close to the speaker</li>
                <li>• Keep background noise to a minimum</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Recorder;