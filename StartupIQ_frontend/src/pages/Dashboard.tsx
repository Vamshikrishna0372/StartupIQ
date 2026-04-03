import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { BarChart3, TrendingUp, Lightbulb, Zap, Target, FolderOpen, GitCompare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const activityIcons: Record<string, any> = { 
  generate: Lightbulb, 
  analyze: Target, 
  save: FolderOpen, 
  compare: GitCompare 
};

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  color: 'hsl(var(--foreground))',
  fontSize: '12px',
  boxShadow: 'var(--shadow-md)',
};

const Dashboard = () => {
  const { stats, isLoading, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading && !stats) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading your workspace...">
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const chartData = stats?.trend_data || [];

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back! Here's your overview.">
      <div className="space-y-5 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={BarChart3} title="Total Analyses" value={stats?.total_analyses || 0} />
          <StatCard icon={TrendingUp} title="Avg Success Rate" value={`${stats?.avg_success_rate || 0}%`} />
          <StatCard icon={Lightbulb} title="Saved Ideas" value={stats?.saved_ideas_count || 0} change="Real-time live data" changeType="neutral" />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ideas Generated</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                  contentStyle={tooltipStyle}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: 'hsl(var(--primary))' }}
                />
                <Bar 
                  dataKey="ideas" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="glass-card p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Success Rate Trend</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  stroke="hsl(var(--success))" 
                  fill="url(#areaGradient)" 
                  strokeWidth={3}
                  animationDuration={2000}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4, stroke: 'hsl(var(--background))' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
          <div className="space-y-2">
            {stats?.recent_activity.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">No recent activity. Start by generating an idea!</p>
            ) : (
              stats?.recent_activity.map((a) => {
                const Icon = activityIcons[a.type] || Lightbulb;
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-md bg-muted/40 p-3 transition-colors hover:bg-muted/60">
                    <div className="rounded-md bg-primary/8 p-1.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{a.action}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{a.detail}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(a.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
