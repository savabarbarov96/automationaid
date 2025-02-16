
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";

const Navigation = () => {
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
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-black px-3 py-2 text-sm font-medium transition-colors">
              Blog
            </Link>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-gray-700 hover:text-black font-medium"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
