import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import PageHeader from "@/components/ui/PageHeader";
import RecordingTimer from "@/components/recording/RecordingTimer";
import RecordingControls from "@/components/recording/RecordingControls";
import RecordingStatus from "@/components/recording/RecordingStatus";
import AudioUpload from "@/components/recording/AudioUpload";
import RecordingInstructions from "@/components/recording/RecordingInstructions";

const Recorder = () => {
  const navigate = useNavigate();
  const { state, actions } = useAudioRecorder();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Record Lecture"
          showBackButton
          onBack={() => navigate('/dashboard')}
          backText="Back to Dashboard"
        />

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
              <RecordingTimer
                recordingTime={state.recordingTime}
                isVisible={state.isRecording || state.recordingTime > 0}
              />

              <RecordingControls
                isRecording={state.isRecording}
                isProcessing={state.isProcessing}
                onStartRecording={actions.startRecording}
                onStopRecording={actions.stopRecording}
              />

              <RecordingStatus
                status={state.status}
                isProcessing={state.isProcessing}
                uploadProgress={state.uploadProgress}
              />
            </CardContent>
          </Card>

          <AudioUpload
            onFileUpload={actions.handleFileUpload}
            disabled={state.isRecording || state.isProcessing}
          />

          <RecordingInstructions />
        </div>
      </div>
    </div>
  );
};

export default Recorder;