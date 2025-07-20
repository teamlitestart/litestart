import React, { useState } from 'react';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import DualOfferingToggle from './components/DualOfferingToggle';
import TrustSection from './components/TrustSection';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import StudentOnboarding from './components/StudentOnboarding';

function App() {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleJoinAsStudent = () => {
    setIsOnboardingOpen(true);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
  };

  return (
    <div className="min-h-screen">
      <Hero onJoinAsStudent={handleJoinAsStudent} />
      <HowItWorks />
      <DualOfferingToggle />
      <TrustSection />
      <FAQ />
      <Footer onJoinAsStudent={handleJoinAsStudent} />
      <StudentOnboarding 
        isOpen={isOnboardingOpen} 
        onClose={handleCloseOnboarding} 
      />
    </div>
  );
}

export default App;