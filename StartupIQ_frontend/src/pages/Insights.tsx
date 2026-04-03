import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { insightsApi } from '@/services/api';
import { useIdeaStore } from '@/stores/ideaStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Insights = () => {
  const { results, getHistory } = useIdeaStore();
  const [history, setHistory] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getHistory();
      const extracted = Array.isArray(data) ? data : ((data as any).history || []);
      setHistory(extracted);
      // User explicitly requested NOT to select anything on reload.
    } catch (e) {
      toast.error('Failed to load history');
    } finally {
      setIsFetchingHistory(false);
    }
  };

  const handleAnalyze = async (idea: any) => {
    try {
      const id = idea._id || idea.id;
      setSelectedIdeaId(id);
      setIsLoading(true);
      const res = await insightsApi.analyze({
        idea_id: id,
        business_idea: idea.business_idea,
        description: idea.description
      });
      setAnalysis(res.data);
      toast.success('Deep analysis completed!');
    } catch (e) {
      toast.error('Failed to generate insights');
      // If it fails, we keep the selection but don't show new data
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingHistory) {
      return (
        <DashboardLayout title="Deep Insights" subtitle="Professional strategic analysis by Groq AI">
          <div className="flex justify-center p-20"><LoadingSpinner size="md" /></div>
        </DashboardLayout>
      );
  }

  return (
    <DashboardLayout title="Deep AI Insights" subtitle="Groq-powered professional strategic business analysis">
      <div className="space-y-6 animate-fade-in">
        {/* Idea Selector */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Concept for Insight</h3>
            <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary/70">{history.length} Saved Concepts</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {history.slice(0, 10).map((item, i) => {
              const isSelected = selectedIdeaId === (item._id || item.id);
              return (
                <button 
                  key={item._id || i} 
                  onClick={() => handleAnalyze(item)}
                  disabled={isLoading}
                  className={`text-left p-3 rounded-xl border text-[11px] transition-all duration-200 group relative ${
                    isSelected 
                      ? 'bg-primary border-primary text-primary-foreground shadow-md ring-2 ring-primary/30' 
                      : 'bg-card border-border hover:bg-muted/50 hover:border-border/80'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={cn("p-1.5 rounded-lg", isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      <Lightbulb className="h-2.5 w-2.5" />
                    </div>
                    <span className={cn("font-bold truncate", isSelected ? "text-primary-foreground" : "text-foreground")}>{item.business_idea}</span>
                  </div>
                  <div className={cn("text-[10px] line-clamp-1 group-hover:line-clamp-none transition-all", isSelected ? "text-primary-foreground/80" : "text-muted-foreground")}>{item.description}</div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="glass-card p-20 flex flex-col items-center gap-4">
             <div className="relative">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <Brain className="absolute inset-0 m-auto h-4 w-4 text-primary" />
             </div>
             <p className="text-sm font-medium animate-pulse">Groq AI is performing a strategic deep dive...</p>
             <p className="text-xs text-muted-foreground">Evaluating strengths, risks, and market velocity.</p>
          </div>
        ) : analysis ? (
          <>
            {/* Main Insight Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Strengths */}
              <Card className="glass-card border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-success/10 text-success"><ShieldCheck className="h-4 w-4" /></div>
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.strengths.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="text-success mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            
              {/* Weaknesses */}
              <Card className="glass-card border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-destructive/10 text-destructive"><AlertTriangle className="h-4 w-4" /></div>
                    Potential Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="text-destructive mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            
              {/* Opportunities */}
              <Card className="glass-card border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-warning/10 text-warning"><Zap className="h-4 w-4" /></div>
                    Market Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.opportunities.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="text-warning mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            
              {/* Risks */}
              <Card className="glass-card border-0 shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-muted text-foreground"><Target className="h-4 w-4" /></div>
                    Primary Risks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.risks.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                        <span className="text-foreground/50 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Strategy */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                   <h3 className="text-base font-bold">12-Month Growth Strategy</h3>
                   <p className="text-xs text-muted-foreground">AI-recommended sequence of operations for rapid scaling</p>
                </div>
              </div>
              <div className="space-y-4 max-w-3xl">
                {analysis.strategy.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary border border-primary/20">
                      {i + 1}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="glass-card p-8 animate-fade-in">
             <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/50">
                <div className="gradient-primary p-3 rounded-lg text-primary-foreground shadow-sm">
                   <Brain className="h-6 w-6" />
                </div>
                <div>
                   <h3 className="text-lg font-bold">General Portfolio Insights</h3>
                   <p className="text-xs text-muted-foreground">Select a specific idea above for deep analysis, or review your aggregated statistics below.</p>
                </div>
             </div>
             
             {history.length > 0 ? (
               <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                 <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Total Concepts</p>
                    <p className="text-2xl font-bold text-foreground">{history.length}</p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Average Success Rate</p>
                    <p className="text-2xl font-bold text-success">
                       {Math.round(history.reduce((acc, curr) => acc + (curr.success_rate || 50), 0) / history.length)}%
                    </p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Most Common Market</p>
                    <p className="text-lg font-bold text-foreground mt-1 capitalize text-primary">
                       {history[0]?.demand_level || 'Medium'} Demand
                    </p>
                 </div>
                 <div className="bg-card border border-border p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Latest Generated</p>
                    <p className="text-sm font-bold text-foreground mt-1 line-clamp-1">
                       {history[0]?.business_idea || 'N/A'}
                    </p>
                 </div>
               </div>
             ) : (
               <div className="text-center py-10">
                 <p className="text-sm text-muted-foreground">You don't have any ideas saved yet. Please generate some ideas to see insights.</p>
                 <Button onClick={() => window.location.href='/generate'} size="sm" className="mt-4 gap-2">
                   Go to Generator <ArrowRight className="h-3 w-3" />
                 </Button>
               </div>
             )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Insights;
