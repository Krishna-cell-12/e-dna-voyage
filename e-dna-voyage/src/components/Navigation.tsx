import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Upload, BarChart3, LayoutDashboard, FolderOpen, User } from 'lucide-react';

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/results', label: 'Results', icon: BarChart3 },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img src="/samudrayan-favicon.jpg" alt="Samudrayan" className="w-8 h-8" />
            <span className="text-2xl font-montserrat font-bold bioluminescent-text">
              Samudrayan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center space-x-2 transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground shadow-bioluminescent'
                        : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-inter">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`p-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-foreground shadow-bioluminescent'
                        : 'hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};