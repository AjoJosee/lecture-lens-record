import { Clock } from "lucide-react";

interface RecordingTimerProps {
  recordingTime: number;
  isVisible: boolean;
}

const RecordingTimer = ({ recordingTime, isVisible }: RecordingTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center space-x-2 text-2xl font-mono">
      <Clock className="h-6 w-6" />
      <span>{formatTime(recordingTime)}</span>
    </div>
  );
};

export default RecordingTimer;