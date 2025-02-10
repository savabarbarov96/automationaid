
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Clock, RotateCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navigation from '../components/Navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [schedulingWebhook, setSchedulingWebhook] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
        fetchWebhooks();
      }
    });
  }, [navigate]);

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

  const addWebhook = async () => {
    if (!newWebhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('webhook_integrations')
        .insert([{ url: newWebhookUrl, user_id: session.user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Webhook added successfully",
      });
      setNewWebhookUrl('');
      fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      setEditingWebhook(null);
      fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
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
      setSchedulingWebhook(null);
      fetchWebhooks();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-black hover:bg-gray-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Webhook
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Webhook</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Input
                    placeholder="Enter webhook URL"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                  />
                  <Button onClick={addWebhook}>Add Webhook</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No webhooks configured yet.</p>
              <p className="text-sm text-gray-400 mt-2">Click the button above to add your first webhook.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="font-medium">{webhook.name}</p>
                      <p className="text-sm text-gray-500">{webhook.url}</p>
                      {webhook.schedule && (
                        <p className="text-sm text-gray-500">
                          Schedule: {webhook.schedule}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Added {new Date(webhook.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingWebhook(webhook)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Rename Webhook</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Enter new name"
                            defaultValue={webhook.name}
                            onChange={(e) => setEditingWebhook({
                              ...webhook,
                              name: e.target.value
                            })}
                          />
                          <Button
                            onClick={() => updateWebhookName(webhook.id, editingWebhook.name)}
                          >
                            Save
                          </Button>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setSchedulingWebhook(webhook)}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Schedule</DialogTitle>
                          </DialogHeader>
                          <Input
                            placeholder="Enter cron schedule (e.g., * * * * *)"
                            defaultValue={webhook.schedule || ''}
                            onChange={(e) => setSchedulingWebhook({
                              ...webhook,
                              schedule: e.target.value
                            })}
                          />
                          <Button
                            onClick={() => updateWebhookSchedule(webhook.id, schedulingWebhook.schedule)}
                          >
                            Save Schedule
                          </Button>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => deleteWebhook(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className={`h-3 w-3 rounded-full ${webhook.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
