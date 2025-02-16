
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-gray-700 hover:text-black font-bold transition-all duration-200 hover:scale-105 transform"
            >
              Sign Out
            </Button>
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
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-base font-bold text-gray-700 hover:text-black hover:bg-gray-50"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
