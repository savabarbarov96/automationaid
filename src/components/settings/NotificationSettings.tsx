
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface NotificationSettings {
  email: boolean;
  slack: boolean;
  discord: boolean;
  viber: boolean;
  slack_webhook_url?: string;
  discord_webhook_url?: string;
}

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: false,
    slack: false,
    discord: false,
    viber: false,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      } else {
        // Create default settings if none exist
        const { error: insertError } = await supabase
          .from('notification_settings')
          .insert([{
            user_id: session.user.id,
            email: false,
            slack: false,
            discord: false,
            viber: false,
          }]);

        if (insertError) throw insertError;
      }
    } catch (error: any) {
      console.error('Error fetching notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting: keyof NotificationSettings, value: boolean | string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const newSettings = { ...settings, [setting]: value };
      setSettings(newSettings);

      const { error } = await supabase
        .from('notification_settings')
        .update(newSettings)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error: any) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose how you want to receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={settings.email}
              onCheckedChange={(checked) => handleSettingChange('email', !!checked)}
            />
            <Label htmlFor="email">Email Notifications</Label>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="slack"
                checked={settings.slack}
                onCheckedChange={(checked) => handleSettingChange('slack', !!checked)}
              />
              <Label htmlFor="slack">Slack Notifications</Label>
            </div>
            {settings.slack && (
              <div className="ml-6">
                <Input
                  type="text"
                  placeholder="Slack Webhook URL"
                  value={settings.slack_webhook_url || ''}
                  onChange={(e) => handleSettingChange('slack_webhook_url', e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discord"
                checked={settings.discord}
                onCheckedChange={(checked) => handleSettingChange('discord', !!checked)}
              />
              <Label htmlFor="discord">Discord Notifications</Label>
            </div>
            {settings.discord && (
              <div className="ml-6">
                <Input
                  type="text"
                  placeholder="Discord Webhook URL"
                  value={settings.discord_webhook_url || ''}
                  onChange={(e) => handleSettingChange('discord_webhook_url', e.target.value)}
                  className="max-w-md"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="viber"
              checked={settings.viber}
              onCheckedChange={(checked) => handleSettingChange('viber', !!checked)}
            />
            <Label htmlFor="viber">Viber Notifications</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
