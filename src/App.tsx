import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SignupPage from './components/SignupPage';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import DualOfferingToggle from './components/DualOfferingToggle';
import TrustSection from './components/TrustSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import StudentOnboarding from './components/StudentOnboarding';
import StartupOnboarding from './components/StartupOnboarding';
import AdminPanel from './components/AdminPanel';
import EmailVerification from './components/EmailVerification';
import LitestartFeatures from './components/LitestartFeatures';
import Header from './components/Header';
import MouseTracker from './components/MouseTracker';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';

// FAQs Page Component
const FAQsPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="py-16">
      <FAQ />
    </div>
    <Footer />
  </div>
);

// Placeholder components for new pages
const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    
    {/* Header Section */}
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
      {/* Background Graphics */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-200 rounded-full blur-lg"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Built by student founders —<br />
          <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            for startups and students
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
          We created this platform to solve the problem we were living.
        </p>
      </div>
    </section>

    {/* Founders Section */}
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet the Founders</h2>
          <p className="text-xl text-gray-600">Co-presidents of the Bristol Entrepreneur Society</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Reece Forbes */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-96 h-96 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-teal-500 p-1 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/litestart/reece-forbes-profile.jpg" 
                  alt="Reece Forbes - Co-founder" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Reece Forbes</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Startup builder, marketer, and co-president of the Bristol Entrepreneur Society.
            </p>
          </div>
          
          {/* Scott Sampson */}
          <div className="text-center group">
            <div className="relative mb-6">
              <div className="w-96 h-96 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-1 group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="/litestart/scott-sampson-profile.png" 
                  alt="Scott Sampson - Co-founder" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Scott Sampson</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Finance specialist, marketing enthusiast, entrepreneur, and co-president of the Bristol Entrepreneur Society.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Mission Statement Section */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Block */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why we built this
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700">
                  Founders need fast, affordable, reliable talent.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700">
                  Students need meaningful, paid, real-world experience.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                </div>
                <p className="text-lg text-gray-700">
                  We lived both sides — and decided to fix it.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Illustration */}
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl p-12 text-center">
              <div className="space-y-8">
                {/* Handshake Icon */}
                <div className="flex justify-center items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🎓</span>
                  </div>
                  <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                </div>
                
                {/* Connecting Lines */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-full opacity-50"></div>
                  </div>
                  <div className="relative z-10 bg-white rounded-full p-6 mx-auto w-fit">
                    <span className="text-3xl">🤝</span>
                  </div>
                </div>
                
                <p className="text-lg font-semibold text-gray-700">
                  Connecting talent with opportunity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Have questions about LiteStart? We'd love to hear from you.
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Email:</strong> info@litestart.com
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong> Bristol, UK
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

const CareersPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers at LiteStart</h1>
      <p className="text-lg text-gray-600 mb-8">
        Join our team and help us build the future of student-startup collaboration.
      </p>
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Software Engineer</h2>
          <p className="text-gray-600 mb-4">
            Help us build and scale our AI-powered matching platform.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-2">Business Development</h2>
          <p className="text-gray-600 mb-4">
            Grow our partnerships with universities and startups across the UK.
          </p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

function MainSite() {
  const [isStudentOnboardingOpen, setIsStudentOnboardingOpen] = useState(false);
  const [isStartupOnboardingOpen, setIsStartupOnboardingOpen] = useState(false);

  const handleJoinWaitlist = () => {
    // Navigate to signup page
    window.location.href = '/';
  };
  const handleCloseStudentOnboarding = () => setIsStudentOnboardingOpen(false);
  const handleCloseStartupOnboarding = () => setIsStartupOnboardingOpen(false);

  return (
    <div className="min-h-screen">
      <MouseTracker />
      <Hero onJoinWaitlist={handleJoinWaitlist} />
      <LitestartFeatures />
      <HowItWorks />
      <DualOfferingToggle onJoinAsStudent={() => window.location.href = '/'} onJoinAsStartup={() => window.location.href = '/'} />
      <TrustSection />
      <FAQ />
      <Footer />
      <StudentOnboarding isOpen={isStudentOnboardingOpen} onClose={handleCloseStudentOnboarding} />
      <StartupOnboarding isOpen={isStartupOnboardingOpen} onClose={handleCloseStartupOnboarding} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter basename="/litestart">
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/preview" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookie" element={<CookiePolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;