import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export interface AudioRecorderState {
  isRecording: boolean;
  recordingTime: number;
  isProcessing: boolean;
  uploadProgress: number;
  status: string;
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const processAudio = useCallback(async (audioBlob: Blob): Promise<any> => {
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
    return new Promise((resolve) => {
      setTimeout(() => {
        setUploadProgress(100);
        setStatus("Transcription complete!");
        
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

        resolve(sessionData);
      }, 3000);
    });
  }, [recordingTime, toast]);

  const startRecording = useCallback(async () => {
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
  }, [processAudio, toast]);

  const stopRecording = useCallback(() => {
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
  }, [isRecording]);

  const handleFileUpload = useCallback((file: File) => {
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
  }, [processAudio, toast]);

  const reset = useCallback(() => {
    setIsRecording(false);
    setRecordingTime(0);
    setIsProcessing(false);
    setUploadProgress(0);
    setStatus("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  return {
    state: {
      isRecording,
      recordingTime,
      isProcessing,
      uploadProgress,
      status,
    },
    actions: {
      startRecording,
      stopRecording,
      handleFileUpload,
      reset,
    },
  };
};