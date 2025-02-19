
import { useState } from 'react';
import { Plus, AlertCircle, Wand2 } from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface WebhookAddDialogProps {
  onAdd: (url: string, name: string, method: string, body?: any) => Promise<boolean>;
}

export const WebhookAddDialog = ({ onAdd }: WebhookAddDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookName, setNewWebhookName] = useState('');
  const [urlError, setUrlError] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [webhookBody, setWebhookBody] = useState('');
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookType, setWebhookType] = useState('standard');
  const [showForm, setShowForm] = useState(false);
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
      setIsOpen(false);
    }
  };

  const handleTestWebhook = async () => {
    if (!newWebhookUrl || !validateUrl(newWebhookUrl)) return;
    
    if (webhookType === 'form') {
      setShowForm(true);
      return;
    }
    
    setIsTestingWebhook(true);
    console.log('Testing webhook:', {
      url: newWebhookUrl,
      method: selectedMethod,
      body: webhookBody ? JSON.parse(webhookBody) : undefined
    });

    try {
      const response = await fetch(newWebhookUrl, { 
        method: selectedMethod,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        ...(selectedMethod === 'POST' && webhookBody && {
          body: webhookBody
        })
      });
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = await response.text();
      }

      console.log('Webhook test response:', {
        status: response.status,
        data: responseData
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
      console.error('Webhook test error:', error);
      toast({
        title: "Error",
        description: "Could not test webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-black hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Webhook
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
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
            <Select value={webhookType} onValueChange={setWebhookType}>
              <SelectTrigger>
                <SelectValue placeholder="Select webhook type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Webhook</SelectItem>
                <SelectItem value="form">Form Webhook</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMethod} onValueChange={setSelectedMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
              </SelectContent>
            </Select>
            {selectedMethod === 'POST' && webhookType === 'standard' && (
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

      {/* Form Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Form Preview</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <iframe
                src={newWebhookUrl}
                className="w-full h-[500px] border-0"
                title="Form Preview"
              />
            </div>
            <Button onClick={() => setShowForm(false)}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
