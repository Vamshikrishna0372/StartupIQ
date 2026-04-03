import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Lightbulb, Target, FolderOpen, GitCompare, Filter, Calendar, ArrowRight } from 'lucide-react';
import { useIdeaStore } from '@/stores/ideaStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const typeIcons: Record<string, any> = { generate: Lightbulb, analyze: Target, save: FolderOpen, compare: GitCompare };

const History = () => {
  const [filter, setFilter] = useState('all');
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getHistory, setResults } = useIdeaStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getHistory();
      const extracted = Array.isArray(data) ? data : ((data as any).history || []);
      setHistoryItems(extracted);
    } catch (e) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const searchString = searchParams.get('search')?.toLowerCase() || '';

  const filtered = historyItems.filter(h => {
    if (filter !== 'all' && h.action_type !== filter) return false;
    if (searchString) {
      const matchIdea = h.business_idea?.toLowerCase().includes(searchString);
      const matchDesc = h.description?.toLowerCase().includes(searchString);
      if (!matchIdea && !matchDesc) return false;
    }
    return true;
  });

  return (
    <DashboardLayout title="History" subtitle="Your past idea generations and analyses">
      <div className="space-y-5 animate-fade-in">
        {/* Filter */}
        <div className="flex items-center gap-2.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="generate">Generated</SelectItem>
              <SelectItem value="save">Saved</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="text-[10px] h-5">{filtered.length} entries</Badge>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="flex justify-center p-10"><LoadingSpinner size="md" /></div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-3">
                      {filtered.map((item, i) => {
                const Icon = Lightbulb;
                return (
                  <div key={item._id || i} className="relative flex gap-3.5 pl-1 animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="glass-card flex-1 p-4">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <h4 className="text-[11px] font-medium text-muted-foreground capitalize">Generated Idea</h4>
                          <p className="text-xs font-semibold text-foreground">{item.business_idea || 'Untitled Concept'}</p>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
                          <Calendar className="h-2.5 w-2.5" />
                          {new Date(item.timestamp || Date.now()).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground bg-muted/40 rounded-md px-2.5 py-1.5 mt-2 mb-3">
                        {item.description}
                      </p>
                      <div className="flex justify-end">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-7 text-[11px] text-primary hover:text-primary hover:bg-primary/5"
                           onClick={() => {
                             setResults([item]);
                             navigate('/results');
                           }}
                         >
                           View Analysis <ArrowRight className="ml-1.5 h-3 w-3" />
                         </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="glass-card p-10 text-center animate-fade-in mt-4">
                <Clock className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-xs text-muted-foreground">No history entries found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default History;

