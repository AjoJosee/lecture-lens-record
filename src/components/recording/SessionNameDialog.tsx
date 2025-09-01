
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SessionNameDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName: string;
}

const SessionNameDialog = ({ open, onClose, onSave, defaultName }: SessionNameDialogProps) => {
  const [sessionName, setSessionName] = useState(defaultName);

  const handleSave = () => {
    if (sessionName.trim()) {
      onSave(sessionName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name Your Session</DialogTitle>
          <DialogDescription>
            Give your lecture recording a memorable name
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session-name">Session Name</Label>
            <Input
              id="session-name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter session name..."
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!sessionName.trim()}>
              Save Recording
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionNameDialog;
