import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bookmark, Trash2, Eye, Search, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useIdeaStore } from '@/stores/ideaStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useNavigate } from 'react-router-dom';

const Saved = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { getSavedIdeas, deleteSavedIdea, setResults } = useIdeaStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedIdeas();
  }, []);

  const fetchSavedIdeas = async () => {
    try {
      setIsLoading(true);
      const data: any = await getSavedIdeas();
      // Ensure we extract array whether it is embedded in a key or direct array
      const extractedIdeas = Array.isArray(data) ? data : (data.saved_ideas || []);
      setIdeas(extractedIdeas);
    } catch (e) {
      toast.error('Failed to load saved ideas');
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = ideas.filter(i => {
    const title = (i.idea?.business_idea || i.business_idea || '').toLowerCase();
    const desc = (i.idea?.description || i.description || '').toLowerCase();
    return title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedIdea(id);
      setIdeas(ideas.filter(i => (i._id || i.id) !== id));
      toast.success('Idea removed from saved list');
    } catch (e) {
      toast.error('Failed to remove idea');
    }
  };

  const totalSuccess = ideas.reduce((a, b) => a + (b.idea?.success_rate || b.success_rate || 0), 0);
  const avgSuccess = ideas.length > 0 ? Math.round(totalSuccess / ideas.length) : 0;

  return (
    <DashboardLayout title="Saved Ideas" subtitle="Your bookmarked business ideas">
      <div className="space-y-5 animate-fade-in">
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search saved ideas..." className="pl-8 text-xs h-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="rounded-md bg-primary/8 p-2"><Bookmark className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="metric-value text-xl">{ideas.length}</p>
              <p className="metric-label">Total Saved</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="rounded-md bg-success/8 p-2"><TrendingUp className="h-4 w-4 text-success" /></div>
            <div>
              <p className="metric-value text-xl">{avgSuccess}%</p>
              <p className="metric-label">Avg Success Rate</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="rounded-md bg-warning/8 p-2"><Calendar className="h-4 w-4 text-warning" /></div>
            <div>
              <p className="metric-value text-xl">{ideas.length}</p>
              <p className="metric-label">Recently Saved</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-10"><LoadingSpinner size="md" /></div>
        ) : (
          <>
            {/* Ideas Grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item, i) => {
                const ideaData = item.idea || item;
                const id = item._id || item.id;
                
                return (
                  <div key={id} className="glass-card group p-4 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 animate-scale-in" style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-[10px] h-5 capitalize">{ideaData.competition_level || 'General'}</Badge>
                      <span className="text-[11px] text-muted-foreground">{new Date(item.saved_at || ideaData.created_at || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xs font-semibold text-foreground mb-1.5 line-clamp-1">{ideaData.business_idea || 'Untitled Idea'}</h3>
                    <p className="text-[11px] text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{ideaData.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] text-muted-foreground">Success Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-success transition-all duration-500" style={{ width: `${ideaData.success_rate || 0}%` }} />
                        </div>
                        <span className="text-xs font-semibold tabular-nums text-success">{ideaData.success_rate || 0}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 h-7 text-[11px]"
                        onClick={() => {
                          setResults([ideaData]);
                          navigate('/results');
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" /> View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="glass-card p-10 text-center animate-fade-in">
                <Bookmark className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-3 text-xs text-muted-foreground">No saved ideas found</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Saved;
