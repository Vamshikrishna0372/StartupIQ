import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useIdeaStore, type GenerateFormData } from '@/stores/ideaStore';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { SkillsInput } from '@/components/ui/skills-input';

const interests = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'SaaS', 'Real Estate', 'Food & Beverage', 'Clean Energy', 'Entertainment'];
const locations = ['United States', 'Europe', 'Asia', 'India', 'Latin America', 'Africa', 'Middle East', 'Australia'];

const Generate = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [budget, setBudget] = useState([50000]);
  const [interest, setInterest] = useState('');
  const [location, setLocation] = useState('');
  const [riskLevel, setRiskLevel] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { generateIdeas, isGenerating } = useIdeaStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (skills.length === 0) e.skills = 'Select at least one skill';
    if (!interest) e.interest = 'Required';
    if (!location) e.location = 'Required';
    if (!riskLevel) e.riskLevel = 'Required';
    if (!experienceLevel) e.experienceLevel = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    
    try {
      const data: GenerateFormData = { 
        skills, 
        budget: budget[0], 
        interest, 
        location, 
        riskLevel, 
        experienceLevel 
      };
      await generateIdeas(data);
      toast.success('Idea generation complete!');
      navigate('/results');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Failed to generate ideas. Please try again.');
    }
  };

  return (
    <DashboardLayout title="Generate Ideas" subtitle="Fill in your profile to get AI-powered business ideas">
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Skills */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-xs font-medium">Skills & Expertise</Label>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground italic font-normal">
                  <Sparkles className="h-2.5 w-2.5 text-primary" /> AI suggestions enabled
                </div>
              </div>
              <SkillsInput 
                value={skills} 
                onChange={setSkills} 
                maxSkills={7} 
              />
              {errors.skills && <p className="mt-1 text-[11px] text-destructive">{errors.skills}</p>}
              <p className="mt-1.5 text-[10px] text-muted-foreground">Type a skill to see AI-powered suggestions related to your expertise.</p>
            </div>

            {/* Budget */}
            <div>
              <Label className="text-xs font-medium">Budget: ₹{budget[0].toLocaleString('en-IN')}</Label>
              <Slider className="mt-2.5" min={1000} max={500000} step={1000} value={budget} onValueChange={setBudget} />
              <div className="mt-1 flex justify-between text-[11px] text-muted-foreground"><span>₹1K</span><span>₹500K</span></div>
            </div>

            {/* Interest & Location */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-medium">Interest Area</Label>
                <Select value={interest} onValueChange={setInterest}>
                  <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select interest" /></SelectTrigger>
                  <SelectContent>{interests.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
                {errors.interest && <p className="mt-1 text-[11px] text-destructive">{errors.interest}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium">Location</Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select location" /></SelectTrigger>
                  <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                </Select>
                {errors.location && <p className="mt-1 text-[11px] text-destructive">{errors.location}</p>}
              </div>
            </div>

            {/* Risk & Experience */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs font-medium">Risk Level</Label>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select risk level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.riskLevel && <p className="mt-1 text-[11px] text-destructive">{errors.riskLevel}</p>}
              </div>
              <div>
                <Label className="text-xs font-medium">Experience Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="mt-1.5 text-xs"><SelectValue placeholder="Select level" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experienceLevel && <p className="mt-1 text-[11px] text-destructive">{errors.experienceLevel}</p>}
              </div>
            </div>

            <Button type="submit" disabled={isGenerating} className="w-full gradient-primary text-primary-foreground border-0 text-sm h-10">
              {isGenerating ? <LoadingSpinner size="sm" /> : <><Sparkles className="mr-1.5 h-4 w-4" /> Generate Ideas</>}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Generate;
