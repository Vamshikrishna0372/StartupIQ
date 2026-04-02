import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizes[size])} />
    </div>
  );
};

export const PageLoader = () => (
  <div className="flex h-64 flex-col items-center justify-center gap-3">
    <LoadingSpinner size="lg" />
    <p className="text-sm text-muted-foreground animate-pulse-soft">Loading...</p>
  </div>
);
