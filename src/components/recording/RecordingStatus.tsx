import { Progress } from "@/components/ui/progress";

interface RecordingStatusProps {
  status: string;
  isProcessing: boolean;
  uploadProgress: number;
}

const RecordingStatus = ({ status, isProcessing, uploadProgress }: RecordingStatusProps) => {
  const getStatusColor = (status: string) => {
    if (status.includes('Recording')) return 'text-accent';
    if (status.includes('complete')) return 'text-accent';
    if (status.includes('denied') || status.includes('Failed')) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      {/* Status Message */}
      {status && (
        <div className="text-center">
          <p className={`text-lg font-medium ${getStatusColor(status)}`}>
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
    </div>
  );
};

export default RecordingStatus;