import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, Clock, Play, Terminal } from 'lucide-react';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Dashboard = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
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

  useEffect(() => {
    if (session) {
      fetchLogs();
    }
  }, [session]);

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

  const executeWebhook = async (webhook: any) => {
    setIsExecuting(webhook.id);
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timestamp: new Date().toISOString() }),
      });

      const responseData = await response.text();
      const status = response.ok ? 'success' : 'error';

      const { error } = await supabase
        .from('webhook_logs')
        .insert([{
          webhook_id: webhook.id,
          user_id: session.user.id,
          request_data: { timestamp: new Date().toISOString() },
          response_data: { status: response.status, data: responseData },
          status
        }]);

      if (error) throw error;

      toast({
        title: status === 'success' ? "Success" : "Error",
        description: `Webhook ${status === 'success' ? 'executed' : 'failed'}`,
        variant: status === 'success' ? "default" : "destructive",
      });

      fetchLogs();
    } catch (error: any) {
      const { error: logError } = await supabase
        .from('webhook_logs')
        .insert([{
          webhook_id: webhook.id,
          user_id: session.user.id,
          request_data: { timestamp: new Date().toISOString() },
          response_data: { error: error.message },
          status: 'error'
        }]);

      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(null);
    }
  };

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
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Webhooks</h1>
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
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-green-500 text-white hover:bg-green-600 transition-all hover:scale-105"
                            onClick={() => executeWebhook(webhook)}
                            disabled={isExecuting === webhook.id}
                          >
                            {isExecuting === webhook.id ? (
                              <div className="animate-spin">
                                <Terminal className="h-4 w-4" />
                              </div>
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>

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
          </TabsContent>

          <TabsContent value="logs">
            <div className="bg-black/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-green-500 font-mono">
              <h2 className="text-2xl font-bold mb-8 text-green-400">System Logs</h2>
              
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-green-500">No logs available.</p>
                  <p className="text-sm text-green-600 mt-2">Execute a webhook to see logs here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="border border-green-900/30 rounded-lg p-4 hover:border-green-700/50 transition-colors"
                    >
                      <div className="grid grid-cols-[auto,1fr] gap-4">
                        <div className="text-green-600">$</div>
                        <div className="space-y-2">
                          <p className="text-green-400">
                            Webhook: {log.webhook_integrations?.name}
                          </p>
                          <p className="text-sm text-green-600">
                            URL: {log.webhook_integrations?.url}
                          </p>
                          <p className="text-sm">
                            Status: <span className={log.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                              {log.status.toUpperCase()}
                            </span>
                          </p>
                          <div className="text-xs text-green-700">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                          {log.response_data && (
                            <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.response_data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
