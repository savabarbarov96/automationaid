
import { useState } from 'react';
import { Plus, Trash2, Edit2, Clock, Play, Terminal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WebhookListProps {
  webhooks: any[];
  isLoading: boolean;
  onAdd: (url: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onUpdateName: (id: string, name: string) => Promise<boolean>;
  onUpdateSchedule: (id: string, schedule: string) => Promise<boolean>;
  onExecute: (webhook: any) => Promise<boolean>;
}

export const WebhookList = ({
  webhooks,
  isLoading,
  onAdd,
  onDelete,
  onUpdateName,
  onUpdateSchedule,
  onExecute
}: WebhookListProps) => {
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [schedulingWebhook, setSchedulingWebhook] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newWebhookUrl) return;
    const success = await onAdd(newWebhookUrl);
    if (success) {
      setNewWebhookUrl('');
    }
  };

  const handleExecution = async (webhook: any) => {
    setIsExecuting(webhook.id);
    await onExecute(webhook);
    setIsExecuting(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Webhook</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Enter webhook URL"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
              />
              <Button onClick={handleAdd}>Add Webhook</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No webhooks configured yet.</p>
          <p className="text-sm text-gray-400 mt-2">Click the button above to add your first webhook.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <div
              key={webhook.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-medium">{webhook.name}</p>
                  <p className="text-sm text-gray-500">{webhook.url}</p>
                  {webhook.schedule && (
                    <p className="text-sm text-gray-500">
                      Schedule: {webhook.schedule}
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Added {new Date(webhook.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105"
                    onClick={() => handleExecution(webhook)}
                    disabled={isExecuting === webhook.id}
                  >
                    {isExecuting === webhook.id ? (
                      <div className="animate-spin">
                        <Terminal className="h-4 w-4" />
                      </div>
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingWebhook(webhook)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename Webhook</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Enter new name"
                        defaultValue={webhook.name}
                        onChange={(e) => setEditingWebhook({
                          ...webhook,
                          name: e.target.value
                        })}
                      />
                      <Button
                        onClick={() => onUpdateName(webhook.id, editingWebhook.name)}
                      >
                        Save
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSchedulingWebhook(webhook)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Schedule</DialogTitle>
                      </DialogHeader>
                      <Input
                        placeholder="Enter cron schedule (e.g., * * * * *)"
                        defaultValue={webhook.schedule || ''}
                        onChange={(e) => setSchedulingWebhook({
                          ...webhook,
                          schedule: e.target.value
                        })}
                      />
                      <Button
                        onClick={() => onUpdateSchedule(webhook.id, schedulingWebhook.schedule)}
                      >
                        Save Schedule
                      </Button>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => onDelete(webhook.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className={`h-3 w-3 rounded-full ${webhook.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
