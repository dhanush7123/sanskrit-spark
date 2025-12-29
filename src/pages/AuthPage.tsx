import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

const AuthPage = () => {
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useStore();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Simple redirect for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    console.log('AuthPage: Setting up auth state listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthPage: Auth state changed:', event, !!session?.user);
        if (session?.user) {
          console.log('AuthPage: User authenticated, setting user data');
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Seeker',
            karma_points: 0,
          });

          toast({
            title: "Welcome, Seeker! 🙏",
            description: "Your journey through Sanskrit begins now.",
          });

          console.log('AuthPage: Redirecting to home after auth');
          navigate('/');
        } else {
          console.log('AuthPage: No user session');
        }
      }
    );

    return () => {
      console.log('AuthPage: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [setUser, navigate]);

  const resendConfirmationEmail = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) throw error;

      toast({
        title: "Email Sent! 📧",
        description: "Confirmation email has been resent. Please check your inbox.",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name,
            },
          },
        });

        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Already a Seeker",
              description: "This email is already registered. Please login instead.",
              variant: "destructive",
            });
          } else {
            console.error('Signup error:', error);
            throw error;
          }
        } else if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Account Created! 📧",
            description: "Please check your email and click the confirmation link to activate your account.",
            variant: "default",
          });
        } else if (data.user) {
          toast({
            title: "Welcome to Sanskrit Spark! 🙏",
            description: "Your journey through Sanskrit begins now.",
            variant: "default",
          });
          navigate('/');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: "Login Failed",
              description: "Please check your email and password, or confirm your email if you just signed up.",
              variant: "destructive",
            });
          } else if (error.message.includes('Email not confirmed')) {
            toast({
              title: "Email Not Confirmed",
              description: "Please check your email and click the confirmation link before logging in.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'twitter') => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('OAuth Error:', error);
        const providerName = provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'X (Twitter)';
        toast({
          title: `${providerName} Login Not Configured`,
          description: `${providerName} OAuth is not set up in Supabase. Please contact the administrator.`,
          variant: "destructive",
        });
        return;
      }

      console.log('OAuth initiated:', data);

    } catch (error: any) {
      console.error('OAuth Exception:', error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to authentication service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center px-4">
      <motion.button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </motion.button>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-900">Loading...</p>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-20"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Join the Journey'}
            </h1>
            <p className="text-gray-600">
              {mode === 'login' ? 'Continue your Sanskrit exploration' : 'Begin your path to wisdom'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="name" className="text-gray-900">
                  Your Name
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required={mode === 'signup'}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-gray-900">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-900">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>

            {mode === 'login' && (
              <Button
                type="button"
                variant="ghost"
                onClick={resendConfirmationEmail}
                disabled={resendLoading || !formData.email}
                className="w-full text-sm text-gray-500 hover:text-blue-600"
              >
                {resendLoading ? 'Sending...' : 'Resend confirmation email'}
              </Button>
            )}
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or continue with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('facebook')}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Continue with Facebook
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('twitter')}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
              Continue with X
            </Button>
          </div>

          <p className="text-center mt-6 text-gray-600">
            {mode === 'login' ? "New to the path? " : "Already a seeker? "}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-blue-600 hover:underline font-semibold"
            >
              {mode === 'login' ? 'Join here' : 'Login here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
