import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f7f6f0] px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-t-[2rem] border border-white/10 border-b-0 bg-[#e7ebf4]/70 p-8 pb-0 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-10 sm:pb-0 lg:p-12 lg:pb-0">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <img
              src="/assets/images/footer-logo-trimmed.png"
              alt="Litestart"
              className="mb-0 h-[4.5rem] max-w-[12rem] object-contain object-left sm:h-[5.25rem] sm:max-w-[14rem]"
            />
            <p className="max-w-xs text-sm leading-relaxed text-gray-700">
              We match your business with the best candidates.
            </p>
            <div className="mt-5 flex space-x-4">
              <a
                href="https://www.linkedin.com/company/lite-start"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0765AD] transition-colors hover:text-[#064d83]"
              >
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-700 transition-colors hover:text-[#0765AD]">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="text-sm text-gray-700 transition-colors hover:text-[#0765AD]">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/candidates" className="text-sm text-gray-700 transition-colors hover:text-[#0765AD]">
                  For candidates
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href="mailto:info@litestart.co.uk" className="transition-colors hover:text-[#0765AD]">
                  info@litestart.co.uk
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>London, UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-900/10 pt-6">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-xs text-gray-500">
              &copy; 2026 Litestart. All rights reserved.
            </p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <Link to="/privacy" className="text-xs text-gray-500 transition-colors hover:text-[#0765AD]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-gray-500 transition-colors hover:text-[#0765AD]">
                Terms of Service
              </Link>
              <Link to="/cookie" className="text-xs text-gray-500 transition-colors hover:text-[#0765AD]">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
