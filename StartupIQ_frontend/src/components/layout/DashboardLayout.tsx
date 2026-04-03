import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { Bell, Search, LogOut, User, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground" />
              <Separator orientation="vertical" className="h-5" />
              <div>
                <h1 className="text-sm font-semibold text-foreground leading-none">{title}</h1>
                {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ideas..." 
                  className="h-8 w-56 pl-8 text-xs bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary" 
                />
              </form>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-medium text-destructive-foreground">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <DropdownMenuLabel className="flex justify-between items-center italic mb-2">
                    <span>Notifications</span>
                    <span className="text-[10px] text-primary">Mark all read</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-2 cursor-default">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <p className="text-xs font-medium">Idea Analysis Complete</p>
                        <p className="text-[10px] text-muted-foreground">Your "Eco-Friendly Tech" idea has been analyzed.</p>
                        <p className="text-[9px] text-primary/60 mt-1">2 mins ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-2 cursor-default">
                    <div className="flex gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <p className="text-xs font-medium">New Market Opportunity</p>
                        <p className="text-[10px] text-muted-foreground">Check out the latest insights on Green Energy.</p>
                        <p className="text-[9px] text-primary/60 mt-1">1 hour ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-xs text-primary font-medium cursor-pointer" onClick={() => navigate('/activity')}>
                    View all activity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Separator orientation="vertical" className="h-5 hidden sm:block" />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted/50">
                    <div className="gradient-primary flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-semibold text-primary-foreground">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="hidden text-xs font-medium text-foreground sm:block">
                      {user?.name || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
