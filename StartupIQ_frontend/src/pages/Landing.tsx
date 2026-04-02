import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Lightbulb, BarChart3, TrendingUp, ArrowRight, Zap, Target, Brain, ChevronRight } from 'lucide-react';

const features = [
  { icon: Lightbulb, title: 'Idea Generation', description: 'AI-powered business idea generation tailored to your skills, budget, and interests.' },
  { icon: Target, title: 'Success Prediction', description: 'Machine learning models predict the success probability of your business ideas.' },
  { icon: BarChart3, title: 'Market Analysis', description: 'Deep market insights including demand, competition, and growth projections.' },
  { icon: TrendingUp, title: 'Growth Forecasting', description: 'Data-driven growth projections to help you plan your business roadmap.' },
  { icon: Brain, title: 'Smart Comparison', description: 'Compare multiple ideas side-by-side with intelligent scoring metrics.' },
  { icon: Zap, title: 'Instant Insights', description: 'Real-time trending industry data and market intelligence at your fingertips.' },
];

const steps = [
  { step: '01', title: 'Input Your Profile', description: 'Tell us about your skills, budget, interests, and risk tolerance.' },
  { step: '02', title: 'AI Analysis', description: 'Our ML models analyze thousands of data points to generate tailored ideas.' },
  { step: '03', title: 'Get Results', description: 'Receive detailed business ideas with success predictions and market insights.' },
  { step: '04', title: 'Take Action', description: 'Compare, save, and refine your ideas to launch your startup journey.' },
];

const Landing = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden pt-14 pb-16">
      <div className="absolute inset-0 gradient-hero opacity-[0.03]" />
      <div className="absolute top-32 left-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="container relative mx-auto px-4 pt-24 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground mb-6 animate-fade-in">
          <Zap className="h-3 w-3 text-primary" /> Powered by Machine Learning
        </div>
        <h1 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl animate-slide-up !leading-tight">
          Turn Your Skills Into a{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            Winning Startup
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
          StartupIQ uses intelligent algorithms to generate, analyze, and predict the success of business ideas based on your unique profile.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/register">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-6 text-sm h-10 shadow-glow">
              Get Started Free <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="px-6 text-sm h-10">
              Sign In <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            ['10K+', 'Ideas Generated'],
            ['85%', 'Prediction Accuracy'],
            ['2K+', 'Active Users'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-foreground">{val}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Powerful Features</h2>
          <p className="mt-2 text-sm text-muted-foreground">Everything you need to validate and launch your next big idea.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card group p-5 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 animate-scale-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="rounded-md bg-primary/8 p-2 w-fit mb-3">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Four simple steps to discover your ideal business.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8">
                <span className="text-lg font-bold text-primary">{s.step}</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="gradient-primary rounded-xl p-10 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Ready to Build Your Dream Startup?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/70">
            Join thousands of entrepreneurs using AI to find and validate their next business idea.
          </p>
          <Link to="/register">
            <Button size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90 border-0 h-10 px-6 text-sm">
              Start Free Today <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border py-8">
      <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2">
          <div className="gradient-primary flex h-6 w-6 items-center justify-center rounded-md">
            <Zap className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">StartupIQ</span>
        </div>
        <p className="text-[11px] text-muted-foreground">© 2024 StartupIQ. Intelligent Business Idea Generation & Analysis System.</p>
      </div>
    </footer>
  </div>
);

export default Landing;
