import { useState } from 'react';
import { Plus, AlertCircle, ArrowRight, ArrowLeft, Globe, FormInput } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WebhookWizardProps {
  onAdd: (url: string, name: string, method: string, body?: any) => Promise<boolean>;
}

const FUNNY_NAMES = [
  "🚀 Cosmic Caller",
  "🎭 Quirky Query",
  "🌈 Rainbow Request",
  "🎪 Circus Circuit",
  "🎲 Lucky Link",
  "🎯 Bullseye Ping",
  "🎨 Artsy API",
  "🎮 Game Gateway",
  "🎪 Fun Form",
  "🎭 Masked Messenger",
  "🎪 Circus Send",
  "🎯 Target Talk",
  "🎲 Random Relay",
  "🎨 Color Courier",
  "🎮 Play Ping",
];

export const WebhookWizard = ({ onAdd }: WebhookWizardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [webhookType, setWebhookType] = useState<'form' | 'api' | ''>('');
  const [webhookData, setWebhookData] = useState({
    name: '',
    url: '',
    method: 'GET',
    body: '',
  });
  const [urlError, setUrlError] = useState('');
  const { toast } = useToast();

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

  const handleNext = () => {
    if (step === 2 && !validateUrl(webhookData.url)) {
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleAdd = async () => {
    if (!webhookData.url || !validateUrl(webhookData.url)) return;
    
    let body;
    if (webhookData.method === 'POST' && webhookData.body) {
      try {
        body = JSON.parse(webhookData.body);
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
      webhookData.url,
      webhookData.name || `Webhook-${Math.random().toString(36).substring(7)}`,
      webhookType === 'form' ? 'GET' : webhookData.method,
      body
    );

    if (success) {
      setIsOpen(false);
      setStep(1);
      setWebhookType('');
      setWebhookData({
        name: '',
        url: '',
        method: 'GET',
        body: '',
      });
    }
  };

  const generateFunnyName = () => {
    const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
    setWebhookData(prev => ({ ...prev, name: randomName }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Choose Webhook Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setWebhookType('form');
                  handleNext();
                }}
                className={cn(
                  "p-4 border rounded-lg text-left space-y-2 transition-all",
                  webhookType === 'form' 
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-400"
                )}
              >
                <FormInput className="h-8 w-8 text-blue-500" />
                <h4 className="font-medium">Form Webhook</h4>
                <p className="text-sm text-gray-500">
                  Create a webhook for embedding forms
                </p>
              </button>
              <button
                onClick={() => {
                  setWebhookType('api');
                  handleNext();
                }}
                className={cn(
                  "p-4 border rounded-lg text-left space-y-2 transition-all",
                  webhookType === 'api'
                    ? "border-blue-500 bg-blue-50"
                    : "hover:border-gray-400"
                )}
              >
                <Globe className="h-8 w-8 text-blue-500" />
                <h4 className="font-medium">API Webhook</h4>
                <p className="text-sm text-gray-500">
                  Create a webhook for API integrations
                </p>
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Name
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter webhook name"
                  value={webhookData.name}
                  onChange={(e) => setWebhookData({ ...webhookData, name: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateFunnyName}
                  className="whitespace-nowrap"
                >
                  🎲 Generate
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <Input
                placeholder="Enter webhook URL"
                value={webhookData.url}
                onChange={(e) => {
                  setWebhookData({ ...webhookData, url: e.target.value });
                  validateUrl(e.target.value);
                }}
                className={urlError ? 'border-red-500' : ''}
              />
              {urlError && (
                <div className="flex items-center text-red-500 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {urlError}
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return webhookType === 'api' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HTTP Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={webhookData.method === 'GET' ? 'default' : 'outline'}
                  onClick={() => setWebhookData({ ...webhookData, method: 'GET' })}
                >
                  GET
                </Button>
                <Button
                  type="button"
                  variant={webhookData.method === 'POST' ? 'default' : 'outline'}
                  onClick={() => setWebhookData({ ...webhookData, method: 'POST' })}
                >
                  POST
                </Button>
              </div>
            </div>
            {webhookData.method === 'POST' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Body (JSON)
                </label>
                <Textarea
                  placeholder="Enter JSON body"
                  value={webhookData.body}
                  onChange={(e) => setWebhookData({ ...webhookData, body: e.target.value })}
                  className="font-mono"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Form Webhook Configuration</h3>
            <p className="text-sm text-gray-500">
              Your form webhook has been configured. When executed, it will open the form in a
              modal window for easy access.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Webhook</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                className="ml-auto"
                onClick={handleNext}
                disabled={step === 2 && (!webhookData.url || !!urlError)}
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                className="ml-auto"
                onClick={handleAdd}
                disabled={!webhookData.url || !!urlError}
              >
                Create Webhook
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
