import { create } from 'zustand';
import { dashboardApi } from '../services/api';

interface DashboardActivity {
  id: string;
  type: 'generate' | 'analyze' | 'save' | 'compare';
  action: string;
  detail: string;
  time: string;
}

interface DashboardStats {
  total_analyses: number;
  avg_success_rate: number;
  saved_ideas_count: number;
  recent_activity: DashboardActivity[];
  trending_industries: { name: string; growth: number; revenue: string }[];
  trend_data: { name: string; ideas: number; success: number }[];
}

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  stats: null,
  isLoading: false,
  error: null,
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const [sum, trn, act] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getTrends(),
        dashboardApi.getActivity()
      ]);
      
      set({ 
        stats: {
          ...sum.data,
          ...trn.data,
          ...act.data
        }, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err?.response?.data?.detail || 'Failed to fetch dashboard stats', isLoading: false });
    }
  },
}));
