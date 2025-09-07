import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showAuthButtons?: boolean;
  homePath?: string;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true, homePath = "/preview" }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isAuthenticated, user, logout } = useAuth();

  // Handle scroll events to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  return (
    <header className={`bg-white/30 backdrop-blur-sm shadow-sm border-b border-gray-200/30 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="w-full px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo - Far Left */}
          <div className="flex items-center">
            <Link to={homePath} className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <img src="/litestart_logo_clear2.png?v=3" alt="LiteStart logo" className="w-auto bg-transparent" style={{ height: '260px' }} />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link 
                to={homePath} 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                Home
              </Link>
              <Link 
                to={`${homePath === "/" ? "/faqs" : "/preview/faqs"}`}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                FAQs
              </Link>
              <Link 
                to={`${homePath === "/" ? "/about" : "/preview/about"}`}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                About Us
              </Link>
              <Link 
                to={`${homePath === "/" ? "/contact" : "/preview/contact"}`}
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                Contact
              </Link>
            </div>
          </nav>
            
          {/* Auth Buttons - Far Right */}
          {showAuthButtons && (
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-gray-700 hover:text-blue-600 px-6 py-3 text-xl font-medium transition-colors"
                    style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{user?.email}</span>
                    <button
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-600 px-6 py-3 text-xl font-medium transition-colors"
                      style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-blue-600 px-6 py-3 text-xl font-medium transition-colors"
                    style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-xl font-medium transition-colors"
                    style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-gray-700 hover:text-blue-600 p-4 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t border-gray-200/50">
              <Link 
                to={homePath} 
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                Home
              </Link>
              <Link 
                to={`${homePath === "/" ? "/faqs" : "/preview/faqs"}`}
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                FAQs
              </Link>
              <Link 
                to={`${homePath === "/" ? "/about" : "/preview/about"}`}
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                About Us
              </Link>
              <Link 
                to={`${homePath === "/" ? "/contact" : "/preview/contact"}`}
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              {showAuthButtons && (
                <div className="border-t border-gray-200/50 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                        onClick={closeMobileMenu}
                        style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                      >
                        Dashboard
                      </Link>
                      <div className="px-6 py-2 text-sm text-gray-600">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-gray-700 hover:text-red-600 px-6 py-4 text-xl font-medium transition-colors"
                        style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login" 
                        className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                        onClick={closeMobileMenu}
                        style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-xl font-medium transition-colors rounded-lg mx-6 mt-2"
                        onClick={closeMobileMenu}
                        style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 