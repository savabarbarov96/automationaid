
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      // Clear session state
      setSession(null);
      // Navigate to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSignUp = () => {
    navigate('/auth?mode=signup');
  };

  // Clear local data if no session exists
  useEffect(() => {
    if (!session) {
      console.log('No session found, clearing local state');
      // You might want to clear any local state here
    }
  }, [session]);

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
                className="text-gray-700 hover:text-black font-bold transition-all duration-200 hover:scale-105 transform"
              >
                Sign Out
              </Button>
            ) : (
              <Button
                onClick={handleSignUp}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 transform"
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
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
              >
                Home
              </Link>
              {session && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/blog"
                    className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-3 py-2 text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
                  >
                    <Settings className="inline-block w-5 h-5 mr-2" />
                    Settings
                  </Link>
                </>
              )}
              {session ? (
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50"
                >
                  Sign Out
                </Button>
              ) : (
                <Button
                  onClick={handleSignUp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
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
