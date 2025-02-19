
import { useState } from 'react';
import { Edit2, Clock, Play, Terminal, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { WebhookScheduleDialog } from './WebhookScheduleDialog';
import { WebhookEditDialog } from './WebhookEditDialog';
import { useIsMobile } from '../../hooks/use-mobile';

interface WebhookCardProps {
  webhook: {
    id: string;
    name: string;
    url: string;
    method: string;
    body?: any;
    schedule?: string;
    created_at: string;
    is_active: boolean;
  };
  onDelete: (id: string) => Promise<void>;
  onUpdateName: (id: string, name: string) => Promise<boolean>;
  onUpdateSchedule: (id: string, schedule: string) => Promise<boolean>;
  onExecute: (webhook: any) => Promise<boolean>;
  onToggleStatus: (id: string, is_active: boolean) => Promise<boolean>;
}

export const WebhookCard = ({
  webhook,
  onDelete,
  onUpdateName,
  onUpdateSchedule,
  onExecute,
  onToggleStatus
}: WebhookCardProps) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const isMobile = useIsMobile();

  const handleExecution = async () => {
    setIsExecuting(true);
    await onExecute(webhook);
    setIsExecuting(false);
  };

  return (
    <div className={`p-6 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${
      !webhook.is_active ? 'opacity-60' : ''
    }`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-2 flex-grow">
          <div className="flex items-start gap-2 flex-wrap">
            <p className="text-base font-medium">{webhook.name}</p>
            <Badge variant={webhook.method === 'GET' ? 'secondary' : 'default'} className="text-xs">
              {webhook.method}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 break-all">{webhook.url}</p>
          {webhook.schedule && (
            <p className="text-xs text-gray-500">
              Schedule: {webhook.schedule}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Added {new Date(webhook.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className={`flex ${isMobile ? 'flex-wrap justify-start' : 'flex-col'} gap-3`}>
          <Switch
            checked={webhook.is_active}
            onCheckedChange={(checked) => onToggleStatus(webhook.id, checked)}
            className="data-[state=checked]:bg-green-500 h-12 w-12"
          />
          {webhook.is_active && (
            <Button
              variant="outline"
              size="lg"
              className="bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105 h-12 w-12"
              onClick={handleExecution}
              disabled={isExecuting}
            >
              {isExecuting ? (
                <div className="animate-spin">
                  <Terminal className="h-5 w-5" />
                </div>
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
          )}
          <WebhookEditDialog webhook={webhook} onUpdateName={onUpdateName} />
          <WebhookScheduleDialog webhook={webhook} onUpdateSchedule={onUpdateSchedule} />
          <Button
            variant="outline"
            size="lg"
            className="text-red-500 hover:text-red-600 h-12 w-12"
            onClick={() => onDelete(webhook.id)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
      {webhook.method === 'POST' && webhook.body && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <pre className="text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto">
            {JSON.stringify(webhook.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
