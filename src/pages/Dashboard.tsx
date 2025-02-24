
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import WebhookList from '@/components/WebhookList';
import LogList from '@/components/LogList';
import { useWebhooks } from '@/hooks/use-webhooks';
import { useWebhookLogs } from '@/hooks/use-webhook-logs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { webhooks, isLoading, fetchWebhooks, addWebhook, deleteWebhook, updateWebhookName, toggleWebhookStatus, updateWebhook } = useWebhooks(session);
  const { logs, fetchLogs, executeWebhook } = useWebhookLogs(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchWebhooks();
    fetchLogs();
  }, []);

  if (!session) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="webhooks">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="webhooks" className="mt-6">
              <WebhookList
                webhooks={webhooks}
                isLoading={isLoading}
                onAdd={addWebhook}
                onDelete={deleteWebhook}
                onUpdateName={updateWebhookName}
                onToggleStatus={toggleWebhookStatus}
                onExecute={executeWebhook}
                onUpdate={updateWebhook}
              />
            </TabsContent>
            <TabsContent value="logs" className="mt-6">
              <LogList logs={logs} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
