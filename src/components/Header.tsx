import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showAuthButtons?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

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
    <header className="bg-white shadow-sm border-b border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/preview" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <img src="/litestart-logo.png" alt="LiteStart logo" className="h-64 w-auto bg-transparent" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link 
                to="/preview" 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/faqs" 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
              >
                FAQs
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
            
            {/* Auth Buttons */}
            {showAuthButtons && (
              <div className="flex items-center space-x-4 ml-8">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{user?.email}</span>
                      <button
                        onClick={handleLogout}
                        className="text-gray-700 hover:text-red-600 px-4 py-2 text-lg font-medium transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-blue-600 px-4 py-2 text-lg font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg font-medium transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>

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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <Link 
                to="/preview" 
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/faqs" 
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                FAQs
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              
              {/* Mobile Auth Buttons */}
              {showAuthButtons && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="block text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                      <div className="px-6 py-2 text-sm text-gray-600">
                        {user?.email}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-gray-700 hover:text-red-600 px-6 py-4 text-xl font-medium transition-colors"
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
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup" 
                        className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-xl font-medium transition-colors rounded-lg mx-6 mt-2"
                        onClick={closeMobileMenu}
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