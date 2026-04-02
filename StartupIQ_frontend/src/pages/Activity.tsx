import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { useDashboardStore } from '@/stores/dashboardStore';
import { Bell, Lightbulb, Target, FolderOpen, GitCompare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const activityIcons: Record<string, any> = { 
  generate: { icon: Lightbulb, color: 'text-success', bg: 'bg-success/8' },
  analyze: { icon: Target, color: 'text-primary', bg: 'bg-primary/8' },
  save: { icon: FolderOpen, color: 'text-success', bg: 'bg-success/8' },
  compare: { icon: GitCompare, color: 'text-info', bg: 'bg-info/8' }
};

const Activity = () => {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <DashboardLayout title="Activity" subtitle="Syncing your recent actions...">
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const activities = stats?.recent_activity || [];

  return (
    <DashboardLayout title="Activity" subtitle="Your recent actions and notifications">
      <div className="mx-auto max-w-2xl space-y-5 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">{activities.length} recent activities</span>
          </div>
          <Badge variant="secondary" className="text-[10px] h-5">Last 7 days</Badge>
        </div>

        <div className="space-y-2">
          {activities.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-xs text-muted-foreground">No recent activity found. Start exploring!</p>
            </div>
          ) : (
            activities.map((item, i) => {
              const config = activityIcons[item.type] || activityIcons.generate;
              const Icon = config.icon;
              return (
                <div key={item.id} className="glass-card p-3.5 flex items-start gap-3 transition-all duration-200 hover:shadow-card-hover animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className={cn('rounded-md p-2 shrink-0', config.bg)}>
                    <Icon className={cn('h-3.5 w-3.5', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-semibold text-foreground">{item.action}</h4>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(item.time).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed truncate">{item.detail}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
