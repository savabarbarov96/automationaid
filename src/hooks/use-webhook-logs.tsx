
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
  let popupWindow: Window | null = null;

  if (webhook.type === 'form') {
    // Calculate dimensions
    const width = Math.min(800, window.innerWidth - 40);
    const height = Math.min(800, window.innerHeight - 40);
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    // Open a blank window immediately
    popupWindow = window.open(
      '',
      'WebhookForm',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
    
    if (!popupWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }
  }

  try {
    // Create initial log entry (async operation)
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

    if (webhook.type === 'form') {
      // Now navigate the already opened window to the URL
      popupWindow!.location.href = webhook.url;

      // Update the log entry as successful
      await supabase
        .from('webhook_logs')
        .update({
          status: 'success',
          response_data: {
            status: 200,
            data: 'Form opened successfully'
          }
        })
        .eq('id', logEntry.id);

      toast({
        title: "Form Opened",
        description: "The web form has been opened in a new window",
      });

      fetchLogs();
      return true;
    } else {
      // Handle non-form webhooks...
    }
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
