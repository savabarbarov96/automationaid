
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface WebhookEditDialogProps {
  webhook: {
    id: string;
    name: string;
    url: string;
    method: string;
  };
  onUpdateName: (id: string, name: string) => Promise<boolean>;
}

export const WebhookEditDialog = ({ webhook, onUpdateName }: WebhookEditDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(webhook.name);
  const [url, setUrl] = useState(webhook.url);
  const [method, setMethod] = useState(webhook.method);

  const handleSave = async () => {
    // For now we only update the name as that's what the interface supports
    // You'll need to update the parent components to support updating other fields
    const success = await onUpdateName(webhook.id, name);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-12"
        onClick={() => setIsOpen(true)}
      >
        <Edit2 className="h-5 w-5" />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Webhook</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter webhook name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              placeholder="Enter webhook URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Method</Label>
            <Select
              value={method}
              onValueChange={setMethod}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
