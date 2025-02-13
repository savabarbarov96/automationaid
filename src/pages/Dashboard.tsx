
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '../components/Navigation';
import { WebhookList } from '../components/WebhookList';
import { LogList } from '../components/LogList';
import { useWebhooks } from '../hooks/use-webhooks';
import { useWebhookLogs } from '../hooks/use-webhook-logs';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
    });
  }, [navigate]);

  const {
    webhooks,
    isLoading,
    fetchWebhooks,
    addWebhook,
    deleteWebhook,
    updateWebhookName,
    updateWebhookSchedule
  } = useWebhooks(session);

  const {
    logs,
    fetchLogs,
    executeWebhook
  } = useWebhookLogs(session);

  useEffect(() => {
    if (session) {
      fetchWebhooks();
      fetchLogs();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <Tabs defaultValue="webhooks" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="webhooks">
            <WebhookList
              webhooks={webhooks}
              isLoading={isLoading}
              onAdd={addWebhook}
              onDelete={deleteWebhook}
              onUpdateName={updateWebhookName}
              onUpdateSchedule={updateWebhookSchedule}
              onExecute={executeWebhook}
            />
          </TabsContent>

          <TabsContent value="logs">
            <LogList logs={logs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
