
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, Bell, Mail, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`relative backdrop-blur-sm bg-white/70 rounded-full shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'} px-6`}>
          <div className="flex justify-between items-center">
            {/* Logo section */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png" 
                alt="Logo" 
                className="h-8 w-8"
              />
            </Link>

            {/* Center section with main navigation */}
            <div className="flex-1 flex justify-center items-center">
              <div className="hidden md:flex items-center space-x-6">
                <Link to="/" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                  Home
                </Link>
                <Link to="/blog" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                  Blog
                </Link>
                {!session && (
                  <Link
                    to="/auth"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Right section with additional actions */}
            <div className="hidden md:flex items-center space-x-4">
              {session && (
                <>
                  <div className="flex items-center space-x-3">
                    <Bell className="h-4 w-4 text-gray-600 hover:text-gray-900 cursor-pointer" />
                    <Mail className="h-4 w-4 text-gray-600 hover:text-gray-900 cursor-pointer" />
                    <MessageCircle className="h-4 w-4 text-gray-600 hover:text-gray-900 cursor-pointer" />
                  </div>
                  <Link
                    to="/dashboard"
                    className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="text-gray-900 hover:text-gray-600 flex items-center space-x-2 text-sm font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 hover:text-gray-600 text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 hover:text-gray-600"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg py-2 px-4">
              <Link to="/" className="block py-2 text-gray-900 hover:text-gray-600">
                Home
              </Link>
              <Link to="/blog" className="block py-2 text-gray-900 hover:text-gray-600">
                Blog
              </Link>
              {session ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-900 hover:text-gray-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 text-gray-900 hover:text-gray-600"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-gray-900 hover:text-gray-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="block py-2 text-gray-900 hover:text-gray-600"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
