import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useIdeaStore } from '@/stores/ideaStore';
import { ArrowRight, Trophy, TrendingUp, BarChart3, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Compare = () => {
  const { getHistory } = useIdeaStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idea1Id, setIdea1Id] = useState('');
  const [idea2Id, setIdea2Id] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [getHistory]);

  const r1 = history.find(i => i._id === idea1Id);
  const r2 = history.find(i => i._id === idea2Id);
  const showComparison = r1 && r2;

  const getMetricValue = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high': case 'very high': return 90;
      case 'medium': return 60;
      case 'low': return 30;
      default: return 50;
    }
  };

  const metrics = r1 && r2 ? [
    { label: 'Success Rate', icon: TrendingUp, v1: r1.success_rate, v2: r2.success_rate, suffix: '%' },
    { label: 'Market Demand', icon: BarChart3, v1: getMetricValue(r1.demand_level), v2: getMetricValue(r2.demand_level), suffix: '%' },
    { label: 'Competition', icon: Target, v1: 100 - getMetricValue(r1.competition_level), v2: 100 - getMetricValue(r2.competition_level), suffix: '%' },
  ] : [];

  if (isLoading) {
    return (
      <DashboardLayout title="Compare Ideas" subtitle="Syncing your workspace...">
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Compare Ideas" subtitle="Side-by-side comparison of business ideas">
      <div className="mx-auto max-w-3xl space-y-5 animate-fade-in">
        {/* Selectors */}
        <div className="glass-card p-5">
          <div className="grid grid-cols-[1fr,auto,1fr] items-end gap-4">
            <div>
              <Label className="text-xs font-medium">First Idea</Label>
              <Select value={idea1Id} onValueChange={setIdea1Id}>
                <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select idea" /></SelectTrigger>
                <SelectContent>
                  {history.map(i => <SelectItem key={i._id} value={i._id}>{i.business_idea}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-primary/8 flex h-8 w-8 items-center justify-center">
              <ArrowRight className="h-3.5 w-3.5 text-primary rotate-90 sm:rotate-0" />
            </div>
            <div>
              <Label className="text-xs font-medium">Second Idea</Label>
              <Select value={idea2Id} onValueChange={setIdea2Id}>
                <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select idea" /></SelectTrigger>
                <SelectContent>
                  {history.filter(i => i._id !== idea1Id).map(i => <SelectItem key={i._id} value={i._id}>{i.business_idea}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Comparison */}
        {showComparison && (
          <div className="space-y-3 animate-scale-in">
            {/* Winner banner */}
            {(() => {
              const s1 = r1.success_rate;
              const s2 = r2.success_rate;
              const winner = s1 > s2 ? r1 : r2;
              return (
                <div className="rounded-lg bg-success/8 border border-success/20 p-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="h-3.5 w-3.5 text-success" />
                    <span className="text-xs font-semibold text-success">Recommended: {winner.business_idea}</span>
                  </div>
                </div>
              );
            })()}

            {/* Metric bars */}
            {metrics.map(m => {
              const max = Math.max(m.v1, m.v2);
              return (
                <div key={m.label} className="glass-card p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <m.icon className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">{m.label}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    {[{ r: r1, v: m.v1 }, { r: r2, v: m.v2 }].map(({ r, v }, idx) => (
                      <div key={idx}>
                        <div className="mb-1 flex justify-between text-[11px]">
                          <span className="text-muted-foreground truncate">{r.business_idea}</span>
                          <span className={cn('font-semibold tabular-nums', v === max ? 'text-success' : 'text-foreground')}>{v}{m.suffix}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div className={cn('h-full rounded-full transition-all duration-500', v === max ? 'bg-success' : 'bg-primary')} style={{ width: `${v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Profit comparison */}
            <div className="glass-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">Estimated Profit</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="rounded-md bg-success/6 border border-success/15 p-3 text-center">
                  <p className="text-sm font-semibold text-success">{r1.profit_estimation}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{r1.business_idea}</p>
                </div>
                <div className="rounded-md bg-success/6 border border-success/15 p-3 text-center">
                  <p className="text-sm font-semibold text-success">{r2.profit_estimation}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{r2.business_idea}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!showComparison && history.length < 2 && (
          <div className="glass-card p-10 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-xs text-muted-foreground">You need at least two generated ideas to perform a comparison.</p>
          </div>
        )}

        {!showComparison && history.length >= 2 && (
          <div className="glass-card p-10 text-center">
            <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-xs text-muted-foreground">Select two ideas above to see a detailed comparison</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Compare;
