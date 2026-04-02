import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search, Plus, Loader2 } from 'lucide-react';
import { skillsApi } from '@/services/api';

interface SkillsInputProps {
  value: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
}

export const SkillsInput: React.FC<SkillsInputProps> = ({ 
  value, 
  onChange, 
  maxSkills = 7 
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsLoading(true);
        try {
          const res = await skillsApi.suggest(query);
          setSuggestions(res.data.skills || []);
          setShowDropdown(true);
        } catch (e) {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !value.includes(s) && value.length < maxSkills) {
      onChange([...value, s]);
    }
    setQuery('');
    setShowDropdown(false);
  };

  const removeSkill = (skill: string) => {
    onChange(value.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(query);
    }
  };

  return (
    <div className="relative space-y-2.5 w-full">
      {/* Input Wrapper */}
      <div className="relative group">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
        </div>
        <Input 
          placeholder={value.length < maxSkills ? "Search or type a skill..." : `Max ${maxSkills} skills reached`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length > 1 && setShowDropdown(true)}
          disabled={value.length >= maxSkills}
          className="pl-8 text-xs h-9 bg-background/50 border-border/60 focus:border-primary/50"
        />
        {query.trim() && (
          <button 
            onClick={() => addSkill(query)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-card border border-border shadow-lg rounded-xl overflow-hidden animate-slide-down max-h-[220px] overflow-y-auto"
        >
          <div className="p-1">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">AI Suggestions</div>
            {suggestions.filter(s => !value.includes(s)).map((s, idx) => (
              <button
                key={idx}
                onClick={() => addSkill(s)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
              >
                <span>{s}</span>
                <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tags Display */}
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {value.map((skill, index) => (
          <Badge 
            key={index} 
            variant="secondary"
            className="h-7 pl-2.5 pr-1 gap-1 text-[11px] font-medium animate-scale-in"
          >
            {skill}
            <button 
              onClick={() => removeSkill(skill)}
              className="p-1 rounded-full hover:bg-muted-foreground/20 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {value.length === 0 && !query && (
          <span className="text-[10px] text-muted-foreground/60 italic ml-1">No skills added yet</span>
        )}
      </div>
    </div>
  );
};
