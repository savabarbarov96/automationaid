import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    message: '',
    email: '',
    phone: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        supabase.auth.signOut();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setSession(session);
      
      if (event === 'SIGNED_OUT') {
        localStorage.clear();
        sessionStorage.clear();
        if ('caches' in window) {
          try {
            const cacheKeys = await caches.keys();
            await Promise.all(cacheKeys.map(key => caches.delete(key)));
          } catch (err) {
            console.error('Error clearing caches:', err);
          }
        }
        navigate('/');
      } else if (event === 'SIGNED_IN') {
        window.location.reload();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        try {
          const cacheKeys = await caches.keys();
          await Promise.all(cacheKeys.map(key => caches.delete(key)));
        } catch (err) {
          console.error('Error clearing caches:', err);
        }
      }
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
      }
      await supabase.auth.clearSession();
      setSession(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/';
    }
  };

  const handleContactSubmit = async () => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([contactForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your message has been sent successfully!",
      });
      setIsContactOpen(false);
      setContactForm({
        name: '',
        company: '',
        message: '',
        email: '',
        phone: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-5xl mx-auto">
        <div className={`relative backdrop-blur-sm bg-white/70 rounded-full shadow-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'} px-6`}>
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png" 
                alt="Logo" 
                className="h-8 w-8"
              />
            </Link>

            <div className="flex-1 flex justify-center items-center">
              <div className="hidden md:flex items-center space-x-6">
                {!session ? (
                  <>
                    <Link to="/" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                      Home
                    </Link>
                    <Link to="/blog" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                      Blog
                    </Link>
                    <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                      <DialogTrigger asChild>
                        <button className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                          Contact Us
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Contact Us</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <Input
                            placeholder="Name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                          <Input
                            placeholder="Company"
                            value={contactForm.company}
                            onChange={(e) => setContactForm(prev => ({ ...prev, company: e.target.value }))}
                          />
                          <Input
                            type="email"
                            placeholder="Email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                          <div className="phone-input-container">
                            <PhoneInput
                              country={'us'}
                              value={contactForm.phone}
                              onChange={(phone) => setContactForm(prev => ({ ...prev, phone }))}
                              containerClass="w-full"
                              inputClass="w-full !h-10 !py-2 !px-3 !text-base"
                            />
                          </div>
                          <Textarea
                            placeholder="Message"
                            value={contactForm.message}
                            onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          />
                          <Button onClick={handleContactSubmit}>Send Message</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors text-sm"
                    >
                      Dashboard
                    </Link>
                    <Link to="/" className="text-gray-900 hover:text-gray-600 text-sm font-medium">
                      Home
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
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
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/auth"
                    className="text-gray-900 hover:text-gray-600 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 hover:text-gray-600"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg py-2 px-4">
              {!session ? (
                <>
                  <Link to="/" className="block py-2 text-gray-900 hover:text-gray-600">
                    Home
                  </Link>
                  <Link to="/blog" className="block py-2 text-gray-900 hover:text-gray-600">
                    Blog
                  </Link>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="block w-full text-left py-2 text-gray-900 hover:text-gray-600"
                  >
                    Contact Us
                  </button>
                  <Link
                    to="/auth"
                    className="block py-2 text-gray-900 hover:text-gray-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    className="block py-2 text-gray-900 hover:text-gray-600"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="block py-2 text-gray-900 hover:text-gray-600"
                  >
                    Dashboard
                  </Link>
                  <Link to="/" className="block py-2 text-gray-900 hover:text-gray-600">
                    Home
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
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
