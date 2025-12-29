import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, User, Flame } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/timeline', label: 'Timeline' },
  { path: '/quiz', label: 'Quiz Arena' },
  { path: '/explore', label: 'Saraswati' },
  { path: '/articles', label: 'Articles' },
];

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, karmaPoints, logout } = useStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    toast({
      title: "Farewell, seeker",
      description: "May your journey continue with wisdom.",
    });
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              className="text-2xl font-cinzel font-bold text-primary"
              whileHover={{ scale: 1.05 }}
            >
              संस्कृत
            </motion.span>
            <span className="text-sm font-mukta text-muted-foreground hidden sm:block">
              for Curious
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span className={`font-mukta text-sm transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary font-semibold'
                    : 'text-foreground hover:text-primary'
                }`}>
                  {link.label}
                </span>
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-secondary"
              >
                <Flame className="w-4 h-4 text-primary" />
                <span className="font-mukta font-semibold text-secondary">
                  {karmaPoints}
                </span>
              </motion.div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-card">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mukta text-foreground">
                    {user?.name || 'Seeker'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-primary"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="default" className="font-mukta saffron-glow">
                  Enter Gurukul
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
