import { create } from 'zustand';
import { ideaApi } from '../services/api';

export interface GenerateFormData {
  skills: string[];
  budget: number;
  interest: string;
  location: string;
  riskLevel: string;
  experienceLevel: string;
}

interface IdeaResponse {
  _id?: string;
  id?: string;
  business_idea: string;
  description: string;
  success_rate: number;
  demand_level: string;
  competition_level: string;
  profit_estimation: string;
  ai_insights?: {
    explanation: string;
    success_reasoning: string;
    risks: string;
    marketing_strategy: string;
    growth_plan: string;
  };
  is_saved?: boolean;
}

interface IdeaState {
  formData: GenerateFormData | null;
  results: IdeaResponse[];
  isGenerating: boolean;
  generateIdeas: (data: GenerateFormData) => Promise<void>;
  saveIdea: (ideaId: string) => Promise<void>;
  getSavedIdeas: () => Promise<any[]>;
  getHistory: () => Promise<any[]>;
  deleteSavedIdea: (id: string) => Promise<void>;
  fetchLatestIdea: () => Promise<void>;
  setResults: (results: IdeaResponse[]) => void;
}

export const useIdeaStore = create<IdeaState>((set) => ({
  formData: null,
  results: [],
  isGenerating: false,
  
  setResults: (results: IdeaResponse[]) => set({ results }),
  
  generateIdeas: async (data: GenerateFormData) => {
    console.log("Store: generateIdeas received data:", data);
    set({ formData: data, isGenerating: true });
    try {
      if (!data) throw new Error("No form data provided");
      
      // Safety checks for required fields
      const riskLevel = data.riskLevel || 'medium';
      const experienceLevel = data.experienceLevel || 'intermediate';

      // Map frontend riskLevel to backend risk
      const backendData = {
        skills: data.skills || [],
        budget: data.budget || 0,
        interest: data.interest || 'general',
        risk: riskLevel.toLowerCase(),
        location: data.location || 'global',
        experience: experienceLevel.toLowerCase()
      };
      
      const response = await ideaApi.generate(backendData);
      set({ results: [response.data], isGenerating: false });
    } catch (error) {
      console.error("Generation Store Error:", error);
      set({ isGenerating: false });
      throw error;
    }
  },

  saveIdea: async (ideaId: string) => {
    try {
      await ideaApi.save(ideaId);
      // Update local state to reflect the save
      set((state) => ({
        results: state.results.map((r) => 
          (r._id === ideaId || r.id === ideaId) ? { ...r, is_saved: true } : r
        )
      }));
    } catch (error) {
      console.error("Save Error:", error);
      throw error;
    }
  },

  getSavedIdeas: async () => {
    try {
      const response = await ideaApi.getSaved();
      return response.data;
    } catch (error) {
      console.error("Fetch Saved Ideas Error:", error);
      throw error;
    }
  },

  getHistory: async () => {
    try {
      const response = await ideaApi.getHistory();
      return response.data;
    } catch (error) {
      console.error("Fetch History Error:", error);
      throw error;
    }
  },

  deleteSavedIdea: async (id: string) => {
    try {
      await ideaApi.deleteSaved(id);
    } catch (error) {
      console.error("Delete Saved Error:", error);
      throw error;
    }
  },
  
  fetchLatestIdea: async () => {
    try {
      const response = await ideaApi.getHistory();
      if (response.data && response.data.length > 0) {
        set({ results: [response.data[0]] });
      }
    } catch (error) {
      console.error("Fetch Latest Idea Error:", error);
    }
  }
}));
