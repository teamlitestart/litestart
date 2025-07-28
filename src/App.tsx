import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import VenturoFeatures from './components/VenturoFeatures';
import Header from './components/Header';
import MouseTracker from './components/MouseTracker';

// Placeholder components for new pages
const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
      <div className="space-y-6">
        <p className="text-lg text-gray-600">
          We are <strong>Reece Forbes</strong> and <strong>Scott Sampson</strong>, co-presidents of the Bristol Entrepreneur Society.
        </p>
        <p className="text-lg text-gray-600">
          We started this platform to solve a problem we both experienced first-hand:
        </p>
        <ul className="text-lg text-gray-600 ml-6 space-y-2">
          <li>• Founders need fast, affordable, and high-quality help.</li>
          <li>• Students want real-world experience that actually matters.</li>
        </ul>
        <p className="text-lg text-gray-600">
          By connecting startups with top student talent from elite universities, we help both sides win. Founders grow faster. Students build skills and earn money.
        </p>
        <p className="text-lg text-gray-600">
          This is built by students, for students and startups — with the goal of unlocking the next generation of entrepreneurial talent.
        </p>
      </div>
      </p>
    </div>
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
            Have questions about Venturo? We'd love to hear from you.
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Email:</strong> info@venturo.com
            </p>
            <p className="text-gray-600">
              <strong>Location:</strong> Bristol, UK
            </p>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <textarea
              placeholder="Your Message"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
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
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Careers at Venturo</h1>
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

  const handleJoinAsStudent = () => setIsStudentOnboardingOpen(true);
  const handleJoinAsStartup = () => setIsStartupOnboardingOpen(true);
  const handleCloseStudentOnboarding = () => setIsStudentOnboardingOpen(false);
  const handleCloseStartupOnboarding = () => setIsStartupOnboardingOpen(false);

  return (
    <div className="min-h-screen">
      <MouseTracker />
      <Hero onJoinAsStudent={handleJoinAsStudent} onJoinAsStartup={handleJoinAsStartup} />
      <VenturoFeatures />
      <HowItWorks />
      <DualOfferingToggle onJoinAsStudent={handleJoinAsStudent} onJoinAsStartup={handleJoinAsStartup} />
      <TrustSection />
      <FAQ />
      <Footer onJoinAsStudent={handleJoinAsStudent} onJoinAsStartup={handleJoinAsStartup} />
      <StudentOnboarding isOpen={isStudentOnboardingOpen} onClose={handleCloseStudentOnboarding} />
      <StartupOnboarding isOpen={isStartupOnboardingOpen} onClose={handleCloseStartupOnboarding} />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/preview" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;