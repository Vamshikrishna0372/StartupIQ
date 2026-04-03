import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Moon, Sun, Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === '/';
  const isAuth = ['/login', '/register'].includes(location.pathname);

  if (!isLanding && !isAuth) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden border border-border/10 shadow-sm">
            <img src="/logo.png" alt="StartupIQ" className="h-full w-full object-cover" />
          </div>
          <span className="text-base font-semibold text-foreground tracking-tight">StartupIQ</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 md:flex">
          {isLanding && (
            <>
              <a href="#features" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
              <a href="#how-it-works" className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          {location.pathname === '/login' ? (
            <Link to="/register">
              <Button size="sm" className="h-8 gradient-primary text-primary-foreground border-0 text-xs">
                Sign Up
              </Button>
            </Link>
          ) : location.pathname === '/register' ? (
            <Link to="/login"><Button variant="ghost" size="sm" className="h-8 text-xs">Sign In</Button></Link>
          ) : isAuthenticated ? (
            <>
              <Link to="/dashboard"><Button variant="outline" size="sm" className="h-8 text-xs">Dashboard</Button></Link>
              <Button variant="ghost" size="sm" onClick={logout} className="h-8 text-xs">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm" className="h-8 text-xs">Login</Button></Link>
              <Link to="/register">
                <Button size="sm" className="h-8 gradient-primary text-primary-foreground border-0 text-xs">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background p-3 md:hidden animate-fade-in">
          <div className="flex flex-col gap-2">
            {isLanding && (
              <>
                <a href="#features" className="text-xs text-muted-foreground px-2 py-1.5" onClick={() => setMobileOpen(false)}>Features</a>
                <a href="#how-it-works" className="text-xs text-muted-foreground px-2 py-1.5" onClick={() => setMobileOpen(false)}>How It Works</a>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={toggle} className="justify-start h-8 text-xs">
              {isDark ? <Sun className="mr-2 h-3.5 w-3.5" /> : <Moon className="mr-2 h-3.5 w-3.5" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>
            {location.pathname === '/login' ? (
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button size="sm" className="w-full h-8 gradient-primary text-primary-foreground border-0 text-xs">Sign Up</Button>
              </Link>
            ) : location.pathname === '/register' ? (
              <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full h-8 text-xs">Sign In</Button></Link>
            ) : isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full h-8 text-xs">Dashboard</Button></Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); setMobileOpen(false); }} className="h-8 text-xs">Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" size="sm" className="w-full h-8 text-xs">Login</Button></Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full h-8 gradient-primary text-primary-foreground border-0 text-xs">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
