
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const addWebhook = async (url: string) => {
    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .insert([{ url, user_id: session.user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook added successfully",
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

  return {
    webhooks,
    isLoading,
    fetchWebhooks,
    addWebhook,
    deleteWebhook,
    updateWebhookName,
    updateWebhookSchedule
  };
};
