
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, KeyRound } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const isSignUp = searchParams.get('mode') === 'signup';
  const navigate = useNavigate();
  const { toast } = useToast();

  // Parse hash parameters for password reset
  const getHashParams = () => {
    const hash = location.hash.substring(1); // Remove the # symbol
    return Object.fromEntries(new URLSearchParams(hash));
  };

  const hashParams = getHashParams();
  const isPasswordReset = hashParams.type === 'recovery';
  const accessToken = hashParams.access_token;

  useEffect(() => {
    console.log('Hash params:', hashParams);
    // If we have a recovery token, prepare for password reset
    if (isPasswordReset && accessToken) {
      console.log('Password reset mode with token:', accessToken);
    }
  }, [isPasswordReset, accessToken]);

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
            data: { email },
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
      if (isPasswordReset && accessToken) {
        // Verify passwords match
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Your password has been updated. Please sign in with your new password.",
        });
        
        // Clear hash and redirect to login
        window.location.hash = '';
        navigate('/auth');
      } else {
        // Send reset email
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        
        if (error) throw error;
        
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for the password reset link.",
        });
      }
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="relative">
          <Link 
            to="/"
            className="absolute left-0 top-0 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="h-6 w-6" />
          </Link>
          <div className="text-center">
            <img
              src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png"
              alt="Logo"
              className="mx-auto h-12 w-auto"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isPasswordReset ? 'Reset Your Password' : (isSignUp ? 'Create your account' : 'Welcome back')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isPasswordReset 
                ? 'Enter your new password below'
                : (isSignUp 
                  ? 'Join us and start building amazing things'
                  : 'Sign in to your account to continue'
                )
              }
            </p>
          </div>
        </div>

        <form 
          className="mt-8 space-y-6" 
          onSubmit={isPasswordReset || (!isSignUp && searchParams.get('mode') === 'reset') 
            ? handlePasswordReset 
            : handleAuth
          }
        >
          <div className="rounded-md space-y-4">
            {(!isPasswordReset) && (
              <div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-12"
                />
              </div>
            )}
            
            {(isPasswordReset || !searchParams.get('mode')?.includes('reset')) && (
              <div>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isPasswordReset ? "New password" : "Password"}
                  minLength={6}
                  className="h-12"
                />
              </div>
            )}

            {isPasswordReset && (
              <div>
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  minLength={6}
                  className="h-12"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full h-12 ${
              isPasswordReset 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : (isSignUp 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-black hover:bg-gray-800')
            }`}
            disabled={loading}
          >
            {loading ? (
              'Loading...'
            ) : (
              isPasswordReset 
                ? 'Update Password'
                : (searchParams.get('mode') === 'reset' 
                  ? 'Send Reset Instructions'
                  : (isSignUp ? 'Sign Up' : 'Sign In'))
            )}
          </Button>

          {!isPasswordReset && (
            <div className="flex flex-col space-y-2 text-center text-sm">
              <Link
                to={isSignUp ? '/auth' : '/auth?mode=signup'}
                className="text-gray-600 hover:text-gray-900"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </Link>
              {!isSignUp && !searchParams.get('mode')?.includes('reset') && (
                <Link
                  to="/auth?mode=reset"
                  className="text-gray-600 hover:text-gray-900 flex items-center justify-center"
                >
                  <KeyRound className="h-4 w-4 mr-1" />
                  Forgot your password?
                </Link>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Auth;
