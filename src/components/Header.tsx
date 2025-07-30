import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <img src="/litestart-logo.png" alt="LiteStart logo" className="h-64 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-12">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/faqs" 
              className="text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
            >
              FAQs
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-blue-600 px-6 py-4 text-xl font-medium transition-colors"
            >
              Contact
            </Link>
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
                to="/" 
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 