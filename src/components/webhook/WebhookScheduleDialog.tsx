
import { useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface WebhookScheduleDialogProps {
  webhook: {
    id: string;
    schedule?: string;
  };
  onUpdateSchedule: (id: string, schedule: string) => Promise<boolean>;
}

export const WebhookScheduleDialog = ({ webhook, onUpdateSchedule }: WebhookScheduleDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState('custom');
  const [customCron, setCustomCron] = useState(webhook.schedule || '');

  const predefinedSchedules = {
    'every-minute': '* * * * *',
    'every-5-minutes': '*/5 * * * *',
    'hourly': '0 * * * *',
    'daily': '0 0 * * *',
    'weekly': '0 0 * * 0',
    'monthly': '0 0 1 * *',
  };

  const handleScheduleUpdate = async () => {
    const cronExpression = frequency === 'custom' ? customCron : predefinedSchedules[frequency as keyof typeof predefinedSchedules];
    const success = await onUpdateSchedule(webhook.id, cronExpression);
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
        <Clock className="h-4 w-4" />
      </Button>
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
            onClick={handleScheduleUpdate}
            className="w-full"
          >
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
