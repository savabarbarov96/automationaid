
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              AI Agency
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-gray-600 transition-colors">
              Home
            </Link>
            <Link to="/blog" className="text-gray-900 hover:text-gray-600 transition-colors">
              Blog
            </Link>
            <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
                    className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Contact Us
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg animate-fade-down">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" 
                    className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/blog" 
                    className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}>
                Blog
              </Link>
              <button onClick={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                setIsOpen(false);
              }} 
                      className="w-full text-left px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-md">
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
