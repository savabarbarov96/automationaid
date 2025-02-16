
import { WebhookCard } from './webhook/WebhookCard';
import { WebhookAddDialog } from './webhook/WebhookAddDialog';
import { useIsMobile } from '../hooks/use-mobile';

interface WebhookListProps {
  webhooks: any[];
  isLoading: boolean;
  onAdd: (url: string, name: string, method: string, body?: any) => Promise<boolean>;
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
  const isMobile = useIsMobile();

  return (
    <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-4 sm:p-8">
      <div className={`${isMobile ? 'flex flex-col space-y-4' : 'flex justify-between items-center'} mb-8`}>
        <h1 className="text-3xl font-bold">Webhooks</h1>
        {!isMobile && <WebhookAddDialog onAdd={onAdd} />}
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : webhooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No webhooks configured yet.</p>
          <p className="text-sm text-gray-400 mt-2">Click the button to add your first webhook.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {webhooks.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onDelete={onDelete}
              onUpdateName={onUpdateName}
              onUpdateSchedule={onUpdateSchedule}
              onExecute={onExecute}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      )}
      
      {isMobile && (
        <div className="mt-6 sticky bottom-4">
          <WebhookAddDialog onAdd={onAdd} />
        </div>
      )}
    </div>
  );
};
