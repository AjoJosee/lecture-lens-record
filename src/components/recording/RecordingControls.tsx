
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
}: RecordingControlsProps) => {
  return (
    <div className="flex justify-center space-x-4">
      <Button
        size="lg"
        onClick={onStartRecording}
        disabled={isRecording || isProcessing}
        className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg shadow-primary"
      >
        <Mic className="h-6 w-6 mr-2" />
        Start Recording
      </Button>

      <Button
        size="lg"
        variant="destructive"
        onClick={onStopRecording}
        disabled={!isRecording || isProcessing}
        className="px-8 py-4 text-lg"
      >
        <Square className="h-6 w-6 mr-2" />
        Stop & Save
      </Button>
    </div>
  );
};

export default RecordingControls;
