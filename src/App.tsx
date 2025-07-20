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

function MainSite() {
  const [isStudentOnboardingOpen, setIsStudentOnboardingOpen] = useState(false);
  const [isStartupOnboardingOpen, setIsStartupOnboardingOpen] = useState(false);

  const handleJoinAsStudent = () => setIsStudentOnboardingOpen(true);
  const handleJoinAsStartup = () => setIsStartupOnboardingOpen(true);
  const handleCloseStudentOnboarding = () => setIsStudentOnboardingOpen(false);
  const handleCloseStartupOnboarding = () => setIsStartupOnboardingOpen(false);

  return (
    <div className="min-h-screen">
      <Hero onJoinAsStudent={handleJoinAsStudent} onJoinAsStartup={handleJoinAsStartup} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;