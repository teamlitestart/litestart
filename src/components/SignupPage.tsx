import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Hero from './Hero';
import MouseTracker from './MouseTracker';
import TrustedBySection from './TrustedBySection';
import FAQ from './FAQ';
import ComparisonSection from './ComparisonSection';
import StartHiringCTA from './StartHiringCTA';


// Intersection Observer hook for scroll animations
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting] as const;
};

// Animated section component
const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ 
  children, 
  className = '', 
  delay = 0 
}) => {
  const [ref, isIntersecting] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isIntersecting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState<'startup' | 'student' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    if (window.location.hash === '#faq') {
      setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://litestart-backend.onrender.com/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          userType: userType
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setSubmitted(true);
      setForm({ name: '', email: '' });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSignup = () => {
    setShowSignupModal(true);
  };

  const handleJoinWaitlist = () => {
    // Redirect to signup page
    window.location.href = '/signup';
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewProjects = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };





  return (
    <div className="min-h-screen bg-[#f7f6f0] relative">

      
      <MouseTracker />
      <Header showAuthButtons={false} homePath="/" />
      
      {/* Hero Section */}
      <Hero onJoinWaitlist={handleJoinWaitlist} />
      
      <TrustedBySection />

      {/* How It Works — Conversation to Introduction */}
      <section className="relative bg-[#f7f6f0] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-16 sm:mb-20 text-center">
              <h2 className="font-serif text-4xl leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                From conversation
                <span className="block">to introduction.</span>
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {[
              {
                num: "01",
                title: "Spotting the gap",
                desc: "You need GTM, marketing, or sales support and don't have time to hire.",
              },
              {
                num: "02",
                title: "Mapping the role",
                desc: "One call to scope the exact role, skills, and timeline you need.",
              },
              {
                num: "03",
                title: "End to End Selection",
                desc: "We source, screen, and interview candidates from our network for you.",
              },
              {
                num: "04",
                title: "Meet your intern",
                desc: "You're introduced to one vetted, ready to start candidate.",
              },
            ].map((step, index) => (
              <AnimatedSection key={index} delay={index * 150}>
                <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#e7ebf4]/70 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1">
                  <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-gray-200/40 to-gray-300/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full border-2 border-gray-400/30" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <span className="font-serif text-sm font-medium tracking-wide text-gray-500">{step.num}</span>
                    <h3 className="mt-2 font-serif text-xl leading-tight tracking-tight text-gray-950 sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <ComparisonSection />

      <StartHiringCTA onJoinWaitlist={handleJoinWaitlist} />

      <FAQ />



      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-4 text-center overflow-hidden">
                            <img src="/litestart-logo.png" alt="LiteStart Logo" className="mx-auto mb-0 -mt-16 w-72 h-72" />
            <h2 className="text-3xl font-bold mb-2 text-gray-900 -mt-16">Launching Soon!</h2>
            <p className="text-gray-600 mb-4">Sign up to get early access and updates.</p>
            
            {submitted ? (
              <div className="py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-green-600 text-xl font-semibold mb-2">Thank you for signing up!</h3>
                <p className="text-gray-600 mb-4">
                  You have been added to the waitlist as a {userType === 'startup' ? 'startup' : 'student'}.
                </p>
                <button
                  onClick={() => setShowSignupModal(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            ) : error ? (
              <div>
                <div className="text-red-600 text-lg font-semibold py-4 bg-red-50 rounded-lg px-4 mb-6">
                  {error}
                </div>
                <button
                  onClick={() => setError('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('student')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2 ${
                      userType === 'student'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : userType === null
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-pointer hover:bg-gray-200'
                        : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    👩‍🎓 Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('startup')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-200 border-2 ${
                      userType === 'startup'
                        ? 'bg-teal-600 text-white border-teal-600'
                        : userType === null
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-pointer hover:bg-gray-200'
                        : 'bg-white text-teal-600 border-teal-600 hover:bg-teal-50'
                    }`}
                  >
                    🧑‍💻 Startup
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSignupModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || userType === null}
                    className={`flex-1 font-semibold py-3 rounded-lg text-lg transition-all duration-300 shadow-md ${
                      loading || userType === null
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {loading ? 'Signing up...' : 'Join Waitlist'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SignupPage;