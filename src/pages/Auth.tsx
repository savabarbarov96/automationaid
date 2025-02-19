
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get('mode') === 'signup';
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for password reset token
    const checkPasswordReset = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        const accessToken = hash.split('&')[0].split('=')[1];
        console.log('Found recovery token, handling password reset');
        navigate('/auth?mode=reset&token=' + accessToken);
      }
    };

    checkPasswordReset();

    // Initialize Supabase auth listener
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Existing session found, redirecting to home');
          // Set up auto-logout timer
          const logoutTime = 60 * 60 * 1000; // 1 hour
          const timer = setTimeout(async () => {
            console.log('Auto-logout triggered');
            await supabase.auth.signOut();
            toast({
              title: "Session Expired",
              description: "You have been logged out due to inactivity.",
            });
            navigate('/auth');
          }, logoutTime);

          // Clean up timer on unmount
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };

    initAuth();

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
    });

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} user`);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: {
              email,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        console.log('Sign in successful');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your password has been updated. Please sign in with your new password.",
      });
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if we're in password reset mode
  const isReset = searchParams.get('mode') === 'reset';
  const resetToken = searchParams.get('token');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png"
            alt="Logo"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isReset ? 'Reset Password' : (isSignUp ? 'Create your account' : 'Welcome back')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isReset 
              ? 'Enter your new password'
              : (isSignUp 
                ? 'Join us and start building amazing things'
                : 'Sign in to your account to continue'
              )
            }
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={isReset ? (resetToken ? handlePasswordUpdate : handlePasswordReset) : handleAuth}>
          <div className="rounded-md space-y-4">
            <div>
              <Input
                type="email"
                required={!isReset || !resetToken}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="h-12"
                disabled={isReset && resetToken}
              />
            </div>
            {(!isReset || resetToken) && (
              <div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isReset ? "New password" : "Password"}
                  minLength={6}
                  className="h-12"
                />
              </div>
            )}
          </div>

          <div>
            <Button
              type="submit"
              className={`w-full h-12 ${isSignUp ? 'bg-green-600 hover:bg-green-700' : 'bg-black hover:bg-gray-800'}`}
              disabled={loading}
            >
              {loading ? 'Loading...' : (
                isReset 
                  ? (resetToken ? 'Update Password' : 'Send Reset Instructions')
                  : (isSignUp ? 'Sign up' : 'Sign in')
              )}
            </Button>
          </div>
          
          {!isReset && (
            <div className="text-center space-y-2">
              <a
                href={isSignUp ? '/auth' : '/auth?mode=signup'}
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </a>
              <a
                href="/auth?mode=reset"
                className="block text-sm text-gray-600 hover:text-gray-900"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
