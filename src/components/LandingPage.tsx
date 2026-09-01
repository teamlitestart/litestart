import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
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

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waitlistForm, setWaitlistForm] = useState({
    name: '',
    email: '',
    userType: ''
  });
  useEffect(() => {
    if (window.location.hash === '#faq') {
      setTimeout(() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://litestart-backend.onrender.com'}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(waitlistForm),
      });

      if (response.ok) {
        alert('Successfully added to waitlist! We\'ll contact you directly about available opportunities.');
        // Close modal
        const modal = document.getElementById('waitlist-modal');
        if (modal) {
          modal.classList.add('hidden');
        }
        // Reset form
        setWaitlistForm({ name: '', email: '', userType: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="min-h-screen bg-[#f7f6f0] w-full">
      <MouseTracker />
      <Header homePath="/preview" />
      
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-[#f7f6f0] px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:pb-24">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Modern workspace with laptops and collaboration"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7f6f0]/95 via-[#f7f6f0]/75 to-[#f7f6f0]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f7f6f0]/90 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-7xl">
          <AnimatedSection>
            <div className="max-w-xl text-left">
              <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                Fill critical positions,
                <span className="text-shimmer block italic leading-[1.15]">a lot faster.</span>
              </h1>
              <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-gray-800 sm:text-lg">
                We hire interns for you end-to-end — faster and cheaper than traditional agencies. You only pay when you hire.
              </p>
              <div className="flex max-w-xl items-center rounded-full border border-white/10 bg-[#e7ebf4]/70 p-2 shadow-xl backdrop-blur-xl">
                <input
                  type="text"
                  placeholder="What role are you hiring for?"
                  aria-label="What role are you hiring for?"
                  className="min-w-0 flex-1 bg-transparent px-5 py-3 text-left text-sm text-gray-900 outline-none placeholder:text-gray-500 sm:text-base"
                />
                <button type="button" aria-label="Submit hiring role" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white transition-transform hover:scale-105">
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

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
                  {/* Image placeholder */}
                  <div className="relative aspect-[2/1] w-full overflow-hidden bg-gradient-to-br from-gray-200/40 to-gray-300/30">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full border-2 border-gray-400/30" />
                    </div>
                  </div>
                  {/* Text content */}
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

      <StartHiringCTA />

      <FAQ />

      {/* Waitlist Modal */}
      <div id="waitlist-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
          <button
            onClick={() => {
              const modal = document.getElementById('waitlist-modal');
              if (modal) {
                modal.classList.add('hidden');
              }
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Waitlist</h2>
            <p className="text-gray-600">Be the first to know when we launch</p>
          </div>

          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={waitlistForm.name}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={waitlistForm.email}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <select
                value={waitlistForm.userType}
                onChange={(e) => setWaitlistForm({ ...waitlistForm, userType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">I am a...</option>
                <option value="student">Student</option>
                <option value="startup">Startup</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding to Waitlist...' : 'Join Waitlist'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-medium text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• You'll be added to our waitlist</li>
              <li>• We'll contact you directly about opportunities</li>
              <li>• You'll get early access when we launch</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LandingPage; 