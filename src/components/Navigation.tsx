
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Enhanced session initialization with better error handling
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (mounted) {
          setSession(initialSession);
          setIsLoading(false);
        }

        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('Auth state changed:', event, currentSession);
          
          if (mounted) {
            setSession(currentSession);
          }

          switch (event) {
            case 'SIGNED_IN':
              if (location.pathname === '/auth') {
                navigate('/dashboard');
              }
              break;
            case 'SIGNED_OUT':
              // Clear any local state here
              setSession(null);
              navigate('/auth');
              break;
            case 'TOKEN_REFRESHED':
            case 'USER_UPDATED':
              if (mounted) {
                setSession(currentSession);
              }
              break;
          }
        });

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Session initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Failed to initialize session",
            variant: "destructive"
          });
        }
      }
    };

    initializeSession();
  }, [navigate, location.pathname, toast]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);

      // First check if we have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      // Handle 403 error gracefully
      if (error) {
        console.warn('Sign out error:', error);
        
        // If it's a 403 error, we'll handle it gracefully
        if (error.status === 403) {
          console.warn('Received 403 on logout, clearing local session manually.');
          // Clear local session state
          setSession(null);
          
          // Note: Don't show error toast for 403
          toast({
            title: "Signed out",
            description: "You have been successfully signed out",
          });
          
          navigate('/auth');
          return;
        }
        
        // For other errors, throw them to be caught below
        throw error;
      }

      // Success path
      setSession(null);
      navigate('/auth');
      
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigate('/auth?mode=signup');
  };

  // Prevent flash of authenticated content
  if (isLoading) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 backdrop-blur-sm bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-semibold">
              <img src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
            >
              Home
            </Link>
            {session && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/blog" 
                  className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
                >
                  Blog
                </Link>
                <Link 
                  to="/settings" 
                  className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
                >
                  Settings
                </Link>
              </>
            )}
            {session ? (
              <Button
                onClick={handleSignOut}
                variant="ghost"
                disabled={isLoading}
                className="text-gray-700 hover:text-black font-bold transition-all duration-200 hover:scale-105 transform min-w-[100px]"
              >
                {isLoading ? 'Signing out...' : 'Sign Out'}
              </Button>
            ) : (
              <Button
                onClick={handleSignUp}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 transform min-w-[100px]"
              >
                Sign Up
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 p-3"
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
              >
                Home
              </Link>
              {session && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/blog"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    <Settings className="inline-block w-6 h-6 mr-2" />
                    Settings
                  </Link>
                </>
              )}
              {session ? (
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  disabled={isLoading}
                  variant="ghost"
                  className="w-full justify-center text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 py-3"
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignUp();
                  }}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-3"
                >
                  Sign Up
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
