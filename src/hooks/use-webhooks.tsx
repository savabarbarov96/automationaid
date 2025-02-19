import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useWebhooks = (session: any) => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebhooks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching webhooks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addWebhook = async (url: string, name: string, method: string, body?: any) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .insert({
          url,
          name,
          method,
          body: body || {},
          user_id: session.user.id,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook added successfully",
      });
      
      fetchWebhooks();
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

  const toggleWebhookStatus = async (id: string, is_active: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .update({ is_active })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Webhook ${is_active ? 'enabled' : 'disabled'} successfully`,
      });
      fetchWebhooks();
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

  const deleteWebhook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook deleted successfully",
      });
      fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateWebhookName = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook name updated successfully",
      });
      fetchWebhooks();
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

  const updateWebhookSchedule = async (id: string, schedule: string) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .update({ schedule })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook schedule updated successfully",
      });
      fetchWebhooks();
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

  // New function to execute a webhook
  const executeWebhook = async (webhook: any) => {
    console.log("Executing webhook:", webhook);
    if (webhook.type === 'form') {
      // Open a new window/tab immediately in response to the user action
      console.log("Opening new window for form webhook with URL:", webhook.url);
      const newWindow = window.open('', '_blank');
      if (!newWindow) {
        toast({
          title: "Error",
          description: "New window blocked. Please allow popups/new windows for this site.",
          variant: "destructive",
        });
        return false;
      }
      // Optionally, write a loading message:
      newWindow.document.write("Loading form...");
      newWindow.location.href = webhook.url;
      toast({
        title: "Form Opened",
        description: "The webhook form has been opened in a new window.",
      });
      return true;
    } else {
      // For non-form webhooks, execute a regular HTTP request
      try {
        console.log("Executing non-form webhook request");
        const response = await fetch(webhook.url, {
          method: webhook.method,
          headers: webhook.method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
          body: webhook.method === 'POST' ? JSON.stringify(webhook.body) : undefined,
        });
        if (!response.ok) {
          toast({
            title: "Error",
            description: `Webhook call failed with status ${response.status}`,
            variant: "destructive",
          });
          return false;
        }
        toast({
          title: "Success",
          description: "Webhook executed successfully.",
        });
        return true;
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
    }
  };

  return {
    webhooks,
    isLoading,
    fetchWebhooks,
    addWebhook,
    deleteWebhook,
    updateWebhookName,
    updateWebhookSchedule,
    toggleWebhookStatus,
    executeWebhook, // Newly added function
  };
};
