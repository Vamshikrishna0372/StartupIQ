import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useIdeaStore } from '@/stores/ideaStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, IndianRupee, Brain, ShieldCheck, Megaphone, Rocket, AlertTriangle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const tooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '6px',
  color: 'hsl(var(--foreground))',
  fontSize: '11px',
  boxShadow: 'var(--shadow-md)',
};

const Results = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { results, saveIdea, fetchLatestIdea } = useIdeaStore();

  useEffect(() => {
    if (!results || results.length === 0) {
      console.log("Results page: No results in store, fetching latest from history...");
      fetchLatestIdea();
    }
  }, []);

  const handleSave = async (id: string | undefined, isSaved: boolean = false) => {
    if (!id) return;
    
    if (isSaved) {
      toast.info('This concept is already saved in your library.');
      return;
    }

    try {
      setIsSaving(true);
      await saveIdea(id);
      toast.success('Concept added to your library!');
    } catch (e: any) {
       const msg = e?.response?.data?.detail || 'Failed to save concept';
       toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!results || results.length === 0) {
    return (
      <DashboardLayout title="Results" subtitle="AI-generated business ideas based on your profile">
        <div className="flex flex-col items-center justify-center p-10 mt-10 text-center animate-fade-in gap-4">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-semibold">No Ideas Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You haven't generated any ideas during this session. Head back to the generator to craft a new business.
          </p>
          <Link to="/generate">
            <Button className="gradient-primary mt-2">Generate New Ideas</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const r = results[0];

  const aiInsightsData = r.ai_insights ? [
    { icon: Brain, title: 'Explanation', content: r.ai_insights.explanation },
    { icon: ShieldCheck, title: 'Success Reasoning', content: r.ai_insights.success_reasoning },
    { icon: AlertTriangle, title: 'Key Risks', content: r.ai_insights.risks },
    { icon: Megaphone, title: 'Marketing Strategy', content: r.ai_insights.marketing_strategy },
    { icon: Rocket, title: 'Growth Plan', content: r.ai_insights.growth_plan },
  ] : [];

  const barData = [
    { name: 'Success Prop.', probability: r.success_rate },
    { name: 'Demand Level', probability: r.demand_level === 'High' ? 90 : r.demand_level === 'Medium' ? 60 : 30 }
  ];

  const demandColor = (d: string) => (d === 'High' ? 'default' : d === 'Medium' ? 'secondary' : 'outline') as any;

  return (
    <DashboardLayout title="Your Primary Concept" subtitle="AI-powered analysis of your requested model">
      <div className="space-y-5 animate-fade-in">
        {/* Core Idea Card */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-card group p-5 transition-all duration-200 shadow-sm animate-scale-in flex flex-col h-full">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-lg font-bold text-foreground leading-snug">{r.business_idea}</h3>
              <Button 
                onClick={() => handleSave(r._id || r.id, !!r.is_saved)} 
                variant={r.is_saved ? "default" : "outline"} 
                size="sm" 
                disabled={isSaving}
                className={`shrink-0 gap-2 h-8 ${r.is_saved ? 'bg-success hover:bg-success/90 text-success-foreground font-bold' : ''}`}
              >
                {r.is_saved ? (
                  <><ShieldCheck className="h-3 w-3" /> Saved</>
                ) : (
                  <><Bookmark className="h-3 w-3" /> {isSaving ? 'Saving...' : 'Save Concept'}</>
                )}
              </Button>
            </div>
            <p className="mb-5 text-sm text-muted-foreground leading-relaxed flex-1">{r.description}</p>
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Success Probability</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${r.success_rate}%` }} />
                  </div>
                  <span className="text-xs font-bold tabular-nums text-success">{r.success_rate}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Market Demand</span>
                <Badge variant={demandColor(r.demand_level)} className="text-xs h-6">{r.demand_level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Local Competition</span>
                <span className="text-xs font-bold text-foreground capitalize">{r.competition_level}</span>
              </div>
              <div className="flex items-center gap-2 rounded-md bg-success/10 border border-success/20 p-2.5">
                <IndianRupee className="h-4 w-4 text-success" />
                <span className="text-sm font-bold text-success">Est. Output: {r.profit_estimation}</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-5 flex flex-col justify-center">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Score Metrics</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} cursor={{fill: 'transparent'}} />
                <Bar dataKey="probability" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        {r.ai_insights && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="gradient-primary rounded-lg p-2.5 shadow-sm">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Deep Groq AI Insights</h3>
                <p className="text-xs text-muted-foreground">Detailed strategic analysis tailored by our Llama 3 engine</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {aiInsightsData.map((insight, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-muted/20 p-5 transition-all hover:bg-muted/40 hover:shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <insight.icon className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-bold text-foreground leading-none">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {typeof insight.content === 'object' ? JSON.stringify(insight.content, null, 2) : insight.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Results;
