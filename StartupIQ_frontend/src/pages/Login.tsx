import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Zap, Mail, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      toast.success('Successfully logged in');
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || 'Invalid email or password';
      setErrors({ email: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-screen items-center justify-center px-4 pt-14 relative">
        <Link to="/" className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <div className="w-full max-w-sm animate-scale-in mt-8 md:mt-0">
          <div className="glass-card p-6">
            <div className="mb-6 text-center">
              <div className="gradient-primary mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Welcome Back</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Sign in to your StartupIQ account</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-8 text-xs" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-8 text-xs" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {errors.password && <p className="mt-1 text-[11px] text-destructive">{errors.password}</p>}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full gradient-primary text-primary-foreground border-0 text-xs h-9">
                {isLoading ? <LoadingSpinner size="sm" /> : 'Sign In'}
              </Button>
            </form>
            <p className="mt-5 text-center text-[11px] text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
