
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ContactForm } from './ContactForm';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bg' : 'en');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
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
            <button 
              onClick={() => scrollToSection('services')}
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
            >
              {t('services')}
            </button>
            <Link 
              to="/blog" 
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
            >
              {t('blog')}
            </Link>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-gray-700 hover:text-black px-3 py-2 text-sm font-bold transition-all duration-200 hover:scale-105 transform"
            >
              {t('pricing')}
            </button>
            <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-black font-bold">
                  {t('contact')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ContactForm onClose={() => setIsContactOpen(false)} language={language} />
              </DialogContent>
            </Dialog>
            <Button
              onClick={toggleLanguage}
              variant="ghost"
              size="icon"
              className="ml-4"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  {t('getStarted')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ContactForm language={language} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button
              onClick={toggleLanguage}
              variant="ghost"
              size="icon"
            >
              <Globe className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-2">
              <button
                onClick={() => scrollToSection('services')}
                className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200 w-full text-left"
              >
                {t('services')}
              </button>
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200"
              >
                {t('blog')}
              </Link>
              <button
                onClick={() => scrollToSection('pricing')}
                className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200 w-full text-left"
              >
                {t('pricing')}
              </button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost"
                    className="block px-4 py-3 text-lg font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all duration-200 w-full text-left"
                  >
                    {t('contact')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ContactForm language={language} />
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-black text-white hover:bg-gray-800 text-lg font-bold py-3">
                    {t('getStarted')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <ContactForm language={language} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
