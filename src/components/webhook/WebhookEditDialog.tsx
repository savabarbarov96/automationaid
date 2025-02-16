
import { useState } from 'react';
import { Edit2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WebhookEditDialogProps {
  webhook: {
    id: string;
    name: string;
  };
  onUpdateName: (id: string, name: string) => Promise<boolean>;
}

export const WebhookEditDialog = ({ webhook, onUpdateName }: WebhookEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(webhook.name);

  const handleSave = async () => {
    const success = await onUpdateName(webhook.id, name);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Webhook</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter new name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSave}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};
