
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SessionNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sessionName: string) => void;
  defaultName?: string;
}

const SessionNameDialog = ({ open, onOpenChange, onConfirm, defaultName }: SessionNameDialogProps) => {
  const [sessionName, setSessionName] = useState(defaultName || `Lecture ${new Date().toLocaleDateString()}`);

  const handleConfirm = () => {
    if (sessionName.trim()) {
      onConfirm(sessionName.trim());
      onOpenChange(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Name Your Recording Session</DialogTitle>
          <DialogDescription>
            Give your lecture recording a memorable name for easy identification.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!sessionName.trim()}>
            Save Recording
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionNameDialog;
