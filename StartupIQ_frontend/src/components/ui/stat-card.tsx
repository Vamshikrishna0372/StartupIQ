import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export const StatCard = ({ title, value, icon: Icon, change, changeType = 'positive', className }: StatCardProps) => (
  <div className={cn('glass-card rounded-lg p-5 transition-all duration-200 hover:shadow-card-hover animate-scale-in', className)}>
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="metric-label">{title}</p>
        <p className="metric-value">{value}</p>
        {change && (
          <p className={cn('text-[11px] font-medium', {
            'text-success': changeType === 'positive',
            'text-destructive': changeType === 'negative',
            'text-muted-foreground': changeType === 'neutral',
          })}>
            {change}
          </p>
        )}
      </div>
      <div className="rounded-md bg-primary/8 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </div>
  </div>
);
