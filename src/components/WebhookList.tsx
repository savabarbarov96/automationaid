import { useState } from 'react';
import { Plus, Trash2, Edit2, Clock, Play, Terminal, AlertCircle, Wand2, Power } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WebhookListProps {
  webhooks: any[];
  isLoading: boolean;
  onAdd: (url: string, name: string, method: string, body?: object) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
  onUpdateName: (id: string, name: string) => Promise<boolean>;
  onUpdateSchedule: (id: string, schedule: string) => Promise<boolean>;
  onExecute: (webhook: any) => Promise<boolean>;
  onToggleStatus: (id: string, is_active: boolean) => Promise<boolean>;
}

export const WebhookList = ({
  webhooks,
  isLoading,
  onAdd,
  onDelete,
  onUpdateName,
  onUpdateSchedule,
  onExecute,
  onToggleStatus
}: WebhookListProps) => {
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');
  const [urlError, setUrlError] = useState('');
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [schedulingWebhook, setSchedulingWebhook] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const [frequency, setFrequency] = useState('custom');
  const [customCron, setCustomCron] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [webhookBody, setWebhookBody] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const generateWebhookName = () => {
    const randomString = Math.random().toString(36).substring(7);
    setNewWebhookName(`Webhook-${randomString}`);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };

  const handleAdd = async () => {
    if (!newWebhookUrl) {
      setUrlError('URL is required');
      return;
    }
    if (!validateUrl(newWebhookUrl)) return;
    
    let body;
    if (selectedMethod === 'POST' && webhookBody) {
      try {
        body = JSON.parse(webhookBody);
      } catch (error) {
        toast({
          title: "Invalid JSON",
          description: "Please enter valid JSON for the webhook body",
          variant: "destructive",
        });
        return;
      }
    }
    
    const success = await onAdd(
      newWebhookUrl, 
      newWebhookName || `Webhook-${Math.random().toString(36).substring(7)}`, 
      selectedMethod,
      body
    );
    if (success) {
      setNewWebhookUrl('');
      setNewWebhookName('');
      setWebhookBody('');
      setUrlError('');
      setIsAddDialogOpen(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!newWebhookUrl || !validateUrl(newWebhookUrl)) return;
    
    setIsTestingWebhook(true);
    try {
      const response = await fetch(newWebhookUrl, { 
        method: selectedMethod,
        ...(selectedMethod === 'POST' && webhookBody && {
          headers: { 'Content-Type': 'application/json' },
          body: webhookBody
        })
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Webhook test was successful",
        });
      } else {
        toast({
          title: "Error",
          description: `Webhook test failed with status ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleExecution = async (webhook: any) => {
    setIsExecuting(webhook.id);
    await onExecute(webhook);
    setIsExecuting(null);
  };

  const predefinedSchedules = {
    'every-minute': '* * * * *',
    'every-5-minutes': '*/5 * * * *',
    'hourly': '0 * * * *',
    'daily': '0 0 * * *',
    'weekly': '0 0 * * 0',
    'monthly': '0 0 1 * *',
  };

  const handleScheduleUpdate = async (webhook: any) => {
    const cronExpression = frequency === 'custom' ? customCron : predefinedSchedules[frequency];
    await onUpdateSchedule(webhook.id, cronExpression);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Webhook</DialogTitle>
              <DialogDescription>
                Configure your webhook endpoint and settings
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter webhook name"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateWebhookName}
                  title="Generate random name"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter webhook URL"
                  value={newWebhookUrl}
                  onChange={(e) => {
                    setNewWebhookUrl(e.target.value);
                    validateUrl(e.target.value);
                  }}
                  className={urlError ? 'border-red-500' : ''}
                />
                {urlError && (
                  <div className="flex items-center text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {urlError}
                  </div>
                )}
              </div>
              <Select value={selectedMethod} onValueChange={setSelectedMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
              {selectedMethod === 'POST' && (
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">Request Body (JSON)</label>
                  <Textarea
                    placeholder="Enter JSON body"
                    value={webhookBody}
                    onChange={(e) => setWebhookBody(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleTestWebhook}
                  disabled={isTestingWebhook || !newWebhookUrl}
                >
                  {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
                </Button>
                <Button onClick={handleAdd} disabled={!newWebhookUrl || !!urlError}>
                  Add Webhook
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
              className={`p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${
                !webhook.is_active ? 'opacity-60' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{webhook.name}</p>
                    <Badge variant={webhook.method === 'GET' ? 'secondary' : 'default'}>
                      {webhook.method}
                    </Badge>
                  </div>
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
                  <Switch
                    checked={webhook.is_active}
                    onCheckedChange={(checked) => onToggleStatus(webhook.id, checked)}
                  />
                  {webhook.is_active && (
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
                  )}

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
                        <DialogDescription>
                          Choose how often this webhook should be executed
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Select
                          value={frequency}
                          onValueChange={setFrequency}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="every-minute">Every minute</SelectItem>
                            <SelectItem value="every-5-minutes">Every 5 minutes</SelectItem>
                            <SelectItem value="hourly">Every hour</SelectItem>
                            <SelectItem value="daily">Every day</SelectItem>
                            <SelectItem value="weekly">Every week</SelectItem>
                            <SelectItem value="monthly">Every month</SelectItem>
                            <SelectItem value="custom">Custom schedule</SelectItem>
                          </SelectContent>
                        </Select>

                        {frequency === 'custom' && (
                          <div className="space-y-2">
                            <Input
                              placeholder="Enter cron expression (e.g., * * * * *)"
                              value={customCron}
                              onChange={(e) => setCustomCron(e.target.value)}
                            />
                            <p className="text-sm text-gray-500">
                              Format: minute hour day month weekday
                            </p>
                          </div>
                        )}

                        <Button
                          onClick={() => handleScheduleUpdate(webhook)}
                          className="w-full"
                        >
                          Save Schedule
                        </Button>
                      </div>
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
              {webhook.method === 'POST' && webhook.body && (
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm font-mono">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(webhook.body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
