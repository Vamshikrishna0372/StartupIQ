import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useThemeStore } from '@/stores/themeStore';
import { Bell, Shield, Palette, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';
import { settingsApi } from '../services/api';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Settings = () => {
  const { isDark, toggle } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [aiAdvisorStyle, setAiAdvisorStyle] = useState('Professional');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await settingsApi.get();
      if (res.data) {
        setNotifications(res.data.notifications ?? true);
        setLanguage(res.data.language ?? 'en');
        setAiAdvisorStyle(res.data.ai_advisor_style ?? 'Professional');
      }
    } catch (e) {
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await settingsApi.update({
        theme: isDark ? 'dark' : 'light',
        notifications,
        language,
        ai_advisor_style: aiAdvisorStyle
      });
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const SettingRow = ({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
      {children}
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout title="Settings" subtitle="Manage your preferences and account">
        <div className="flex justify-center p-20"><LoadingSpinner size="lg" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your preferences and account">
      <div className="mx-auto max-w-2xl space-y-4 animate-fade-in">
        {/* Appearance */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="rounded-md bg-primary/8 p-1.5"><Palette className="h-3.5 w-3.5 text-primary" /></div>
            <h3 className="text-xs font-semibold text-foreground">Appearance</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingRow label="Dark Mode" desc="Switch between light and dark themes">
              <Switch checked={isDark} onCheckedChange={toggle} />
            </SettingRow>
            <SettingRow label="AI Advisor Style" desc="Tone used by the AI when generating concepts">
              <Select value={aiAdvisorStyle} onValueChange={setAiAdvisorStyle}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Visionary">Visionary</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="rounded-md bg-warning/8 p-1.5"><Bell className="h-3.5 w-3.5 text-warning" /></div>
            <h3 className="text-xs font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingRow label="Global Notifications" desc="Receive updates, analytics, and digests">
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </SettingRow>
          </div>
        </div>

        {/* Preferences */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="rounded-md bg-primary/8 p-1.5"><Globe className="h-3.5 w-3.5 text-primary" /></div>
            <h3 className="text-xs font-semibold text-foreground">Preferences</h3>
          </div>
          <div className="divide-y divide-border">
            <SettingRow label="Language" desc="Select your preferred language">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </SettingRow>
          </div>
        </div>

        <Button disabled={isSaving} onClick={handleSave} className="gradient-primary text-primary-foreground border-0 w-full h-9 text-xs">
          {isSaving ? <LoadingSpinner size="sm" /> : <><Save className="mr-1.5 h-3.5 w-3.5" /> Save All Settings</>}
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
