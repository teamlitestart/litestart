import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showAuthButtons?: boolean;
  homePath?: string;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true, homePath = '/preview' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const handleFAQsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMobileMenu();
    const faq = document.getElementById('faq');
    if (faq) {
      faq.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(homePath);
      setTimeout(() => {
        document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  const navLinks = [
    { label: 'Home', to: homePath },
    { label: 'About', to: homePath === '/' ? '/about' : '/preview/about' },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHeaderVisible ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        padding: isHeaderVisible ? '16px 32px' : '0px 0px',
      }}
    >
      <div
        className="mx-auto max-w-7xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          borderRadius: isHeaderVisible ? '9999px' : '0px',
          background: isHeaderVisible ? 'rgba(231, 235, 244, 0.7)' : 'rgba(231, 235, 244, 0)',
          backdropFilter: isHeaderVisible ? 'blur(24px)' : 'blur(0px)',
          boxShadow: isHeaderVisible
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.1)'
            : '0 0 0 0px rgba(0,0,0,0)',
        }}
      >
        <div className="relative flex h-14 items-center justify-between px-6 py-2 sm:h-16 sm:px-8">
          {/* Logo — slides in from left */}
          <Link
            to={homePath}
            className="relative z-10 flex shrink-0 items-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            onClick={closeMobileMenu}
            style={{
              opacity: isHeaderVisible ? 1 : 0,
              transform: isHeaderVisible ? 'translateX(0)' : 'translateX(-80px)',
            }}
          >
            <img src="/assets/images/1 copy.png" alt="LiteStart" className="h-[6.8rem] w-[11.9rem] object-contain object-left sm:h-[8.5rem] sm:w-[17rem]" />
          </Link>

          {/* Nav links — centered, slide in from top */}
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:flex">
            {navLinks.map((link, i) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMobileMenu}
                className="px-4 py-2 text-sm font-medium text-gray-950/65 transition-all hover:text-gray-950"
                style={{
                  opacity: isHeaderVisible ? 1 : 0,
                  transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-20px)',
                  transitionProperty: 'opacity, transform, color',
                  transitionDuration: '700ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: isHeaderVisible ? `${i * 50}ms` : '0ms',
                }}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleFAQsClick}
              className="px-4 py-2 text-sm font-medium text-gray-950/65 transition-all hover:text-gray-950"
              style={{
                opacity: isHeaderVisible ? 1 : 0,
                transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-20px)',
                transitionProperty: 'opacity, transform, color',
                transitionDuration: '700ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: isHeaderVisible ? `${navLinks.length * 50}ms` : '0ms',
              }}
            >
              FAQs
            </button>
          </nav>

          {/* Right side — slides in from right */}
          <div
            className="relative z-10 hidden items-center gap-3 md:flex transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              opacity: isHeaderVisible ? 1 : 0,
              transform: isHeaderVisible ? 'translateX(0)' : 'translateX(80px)',
            }}
          >
            {showAuthButtons && isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-gray-950/65 transition-colors hover:text-gray-950">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
                  Logout
                </button>
              </>
            ) : (
              <>
                {showAuthButtons && (
                  <Link to="/login" className="text-sm font-medium text-gray-950/65 transition-colors hover:text-gray-950">
                    Login
                  </Link>
                )}
                <Link to="/signup" className="rounded-full bg-gray-950 px-5 py-2.5 font-serif text-sm font-normal text-white transition-transform hover:scale-105">
                  Start hiring
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="p-2 text-gray-950/70 transition-all duration-700 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            style={{
              opacity: isHeaderVisible ? 1 : 0,
              transform: isHeaderVisible ? 'translateX(0)' : 'translateX(40px)',
            }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && isHeaderVisible && (
          <div className="border-t border-black/5 bg-white/60 px-3 pb-4 pt-2 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={closeMobileMenu}
                className="block rounded-2xl px-4 py-3 text-base font-medium text-gray-950/75 transition-colors hover:bg-black/5 hover:text-gray-950"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleFAQsClick}
              className="block w-full rounded-2xl px-4 py-3 text-left text-base font-medium text-gray-950/75 transition-colors hover:bg-black/5 hover:text-gray-950"
            >
              FAQs
            </button>
            <div className="mt-2 border-t border-black/5 pt-3">
              {showAuthButtons && isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-gray-950/75">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mt-2 w-full rounded-full bg-gray-950 px-4 py-3 text-base font-semibold text-white">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {showAuthButtons && (
                    <Link to="/login" onClick={closeMobileMenu} className="block px-4 py-3 text-base font-medium text-gray-950/75">
                      Login
                    </Link>
                  )}
                  <Link to="/signup" onClick={closeMobileMenu} className="mt-2 block rounded-full bg-gray-950 px-4 py-3 text-center font-serif text-base font-normal text-white">
                    Start hiring
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
