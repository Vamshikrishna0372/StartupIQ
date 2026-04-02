import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/stores/authStore';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      await updateProfile(name, email);
      toast.success('Your profile has been saved successfully.');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account details">
      <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
        {/* Profile Card */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="gradient-primary flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-primary-foreground">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="space-y-3.5">
            <div>
              <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
              <Input id="name" className="mt-1.5 text-xs" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <Input id="email" type="email" className="mt-1.5 text-xs" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button onClick={handleSave} className="gradient-primary text-primary-foreground border-0 text-xs h-9">
              <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Saved Ideas Redirect */}
        <div className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
             <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bookmark className="h-4 w-4 text-primary" /> Library Access
             </h3>
             <p className="text-xs text-muted-foreground mt-1">Check out all your previously saved ideas and analytics history.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link to="/saved">
              View Saved Ideas <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
