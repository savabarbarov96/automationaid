
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
    type?: 'form' | 'normal';
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
    <div className={`bg-white shadow-sm border border-gray-100 rounded-xl transition-all duration-200 hover:shadow-md ${
      !webhook.is_active ? 'opacity-60' : ''
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-medium truncate">{webhook.name}</h3>
              <Badge 
                variant={webhook.method === 'GET' ? 'secondary' : 'default'}
                className="text-xs font-semibold"
              >
                {webhook.method}
              </Badge>
              <Badge 
                variant={webhook.type === 'form' ? 'outline' : 'secondary'}
                className="text-xs"
              >
                {webhook.type === 'form' ? '🔤 Form' : '🔗 API'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 break-all font-mono">{webhook.url}</p>
            {webhook.schedule && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{webhook.schedule}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={webhook.is_active}
              onCheckedChange={(checked) => onToggleStatus(webhook.id, checked)}
              className="data-[state=checked]:bg-green-500"
            />
            <div className="flex items-center gap-2">
              {webhook.is_active && (
                <Button
                  variant="ghost"
                  size="lg"
                  className={`h-12 w-12 text-green-600 hover:text-green-700 hover:bg-green-50 
                    transition-all duration-300 transform hover:scale-105
                    ${isExecuting ? 'animate-pulse' : ''}`}
                  onClick={handleExecution}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <Terminal className="h-5 w-5 animate-spin" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
              )}
              <WebhookEditDialog webhook={webhook} onUpdateName={onUpdateName} />
              <WebhookScheduleDialog webhook={webhook} onUpdateSchedule={onUpdateSchedule} />
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => onDelete(webhook.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {webhook.method === 'POST' && webhook.body && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <pre className="text-sm font-mono whitespace-pre-wrap break-all overflow-x-auto text-gray-600">
            {JSON.stringify(webhook.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
