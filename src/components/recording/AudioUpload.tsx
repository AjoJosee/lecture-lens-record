import { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface AudioUploadProps {
  onFileUpload: (file: File) => void;
  disabled: boolean;
}

const AudioUpload = ({ onFileUpload, disabled }: AudioUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
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
              onChange={handleFileChange}
              disabled={disabled}
              className="mt-2"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Supported formats: MP3, WAV, WebM, M4A, and other audio formats
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioUpload;