import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  showAuthButtons?: boolean;
  homePath?: string;
}

const Header: React.FC<HeaderProps> = ({ showAuthButtons = true, homePath = '/preview' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

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

  const navLinks = [
    { label: 'Home', to: homePath },
    { label: 'FAQs', to: `${homePath}#faq` },
    { label: 'About Us', to: homePath === '/' ? '/about' : '/preview/about' },
  ];

  return (
    <header
      className={`fixed inset-x-4 top-4 z-50 origin-center transition-all duration-500 ease-out lg:inset-x-8 ${
        isHeaderVisible
          ? 'scale-x-100 opacity-100'
          : 'pointer-events-none scale-x-0 opacity-0'
      }`}
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/40 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link to={homePath} className="flex shrink-0 items-center" onClick={closeMobileMenu}>
            <img src="/assets/images/2.png" alt="LiteStart" className="h-9 w-16 object-contain sm:h-10 sm:w-20" />
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-950/65 transition-colors hover:bg-black/5 hover:text-gray-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
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
                <Link to="/signup" className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            className="p-2 text-gray-950/70 transition-colors hover:text-gray-950 md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
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

        {isMobileMenuOpen && (
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
                  <Link to="/signup" onClick={closeMobileMenu} className="mt-2 block rounded-full bg-gray-950 px-4 py-3 text-center text-base font-semibold text-white">
                    Get started
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
