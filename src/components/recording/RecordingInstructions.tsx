import { Card, CardContent } from "@/components/ui/card";

const RecordingInstructions = () => {
  return (
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
  );
};

export default RecordingInstructions;