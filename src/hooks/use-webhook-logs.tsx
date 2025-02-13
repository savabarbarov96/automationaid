
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWebhookLogs = (session: any) => {
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select(`
          *,
          webhook_integrations (
            name,
            url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching logs",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const executeWebhook = async (webhook: any) => {
    try {
      // First, create a log entry for the attempt
      const { data: logEntry, error: logError } = await supabase
        .from('webhook_logs')
        .insert([{
          webhook_id: webhook.id,
          user_id: session.user.id,
          request_data: { timestamp: new Date().toISOString() },
          status: 'pending'
        }])
        .select()
        .single();

      if (logError) throw logError;

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timestamp: new Date().toISOString() }),
        });

        const responseData = await response.text();
        const status = response.ok ? 'success' : 'error';

        // Update the log entry with the response
        await supabase
          .from('webhook_logs')
          .update({
            response_data: { status: response.status, data: responseData },
            status
          })
          .eq('id', logEntry.id);

        toast({
          title: status === 'success' ? "Success" : "Error",
          description: `Webhook ${status === 'success' ? 'executed' : 'failed'}`,
          variant: status === 'success' ? "default" : "destructive",
        });

      } catch (error: any) {
        // Update the log entry with the error
        await supabase
          .from('webhook_logs')
          .update({
            response_data: { error: error.message },
            status: 'error'
          })
          .eq('id', logEntry.id);

        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }

      fetchLogs();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    logs,
    fetchLogs,
    executeWebhook
  };
};
