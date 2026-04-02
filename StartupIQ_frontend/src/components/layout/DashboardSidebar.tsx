import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import {
  LayoutDashboard, Lightbulb, BarChart3, GitCompare,
  TrendingUp, User, LogOut, Moon, Sun, Zap,
  Bookmark, Clock, Activity, Settings,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { title: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Generate', path: '/generate', icon: Lightbulb },
  { title: 'Results', path: '/results', icon: BarChart3 },
  { title: 'Compare', path: '/compare', icon: GitCompare },
  { title: 'Insights', path: '/insights', icon: TrendingUp },
];

const libraryNav = [
  { title: 'Saved', path: '/saved', icon: Bookmark },
  { title: 'History', path: '/history', icon: Clock },
  { title: 'Activity', path: '/activity', icon: Activity },
];

const accountNav = [
  { title: 'Profile', path: '/profile', icon: User },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const location = useLocation();

  const renderNavItems = (items: typeof mainNav) =>
    items.map((item) => (
      <SidebarMenuItem key={item.path}>
        <SidebarMenuButton asChild>
          <NavLink
            to={item.path}
            end
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="gradient-sidebar px-3 py-4">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg overflow-hidden border border-border/10 shadow-sm">
            <img src="/logo.png" alt="StartupIQ" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-sidebar-accent-foreground tracking-tight">
              StartupIQ
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="gradient-sidebar px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(mainNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(libraryNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderNavItems(accountNav)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gradient-sidebar border-t border-sidebar-border px-3 py-3">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8"
          >
            {isDark ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
            {!collapsed && <span className="ml-2 text-xs">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive h-8"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2 text-xs">Logout</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
