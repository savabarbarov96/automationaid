
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
            url,
            method
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      console.error('Error fetching logs:', error);
    }
  };

  const executeWebhook = async (webhook: any) => {
    try {
      // Create initial log entry
      const { data: logEntry, error: logError } = await supabase
        .from('webhook_logs')
        .insert([{
          webhook_id: webhook.id,
          user_id: session.user.id,
          status: 'pending',
          request_data: webhook.body || {}
        }])
        .select()
        .single();

      if (logError) throw logError;

      // Execute the webhook
      const response = await fetch(webhook.url, {
        method: webhook.method,
        headers: webhook.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
        body: webhook.method === 'POST' ? JSON.stringify(webhook.body) : undefined
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }

      // Update log entry with response
      await supabase
        .from('webhook_logs')
        .update({
          status: response.ok ? 'success' : 'error',
          response_data: {
            status: response.status,
            data: responseData
          }
        })
        .eq('id', logEntry.id);

      toast({
        title: response.ok ? "Success" : "Error",
        description: response.ok ? "Webhook executed successfully" : `Failed with status ${response.status}`,
        variant: response.ok ? "default" : "destructive",
      });

      fetchLogs();
      return true;
    } catch (error: any) {
      console.error('Error executing webhook:', error);
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
