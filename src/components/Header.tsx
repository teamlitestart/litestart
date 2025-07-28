import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/vite.svg" alt="Venturo Logo" className="w-16 h-16" />
              <span className="text-4xl font-bold text-gray-900">Venturo</span>
            </Link>
          </div>

          {/* Navigation */}
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
            <button className="text-gray-700 hover:text-blue-600 p-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 