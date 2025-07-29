import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Users, Zap, Clock, Target, Briefcase, Star, Quote, CheckCircle, Search } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Hero from './Hero';
import MouseTracker from './MouseTracker';
import { apiCall } from '../config/api';

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
  const [userType, setUserType] = useState<'startup' | 'student'>('startup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await apiCall.signup({
        name: form.name,
        email: form.email,
        userType: userType
      });
      
      setSubmitted(true);
      setForm({ name: '', email: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSignup = () => {
    setShowSignupModal(true);
  };

  const handleJoinWaitlist = () => {
    scrollToSignup();
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

  const testimonials = [
    {
      quote: "Most internships are either unpaid or require a huge time commitment. LiteStart's approach of short, paid projects that actually relate to my economics degree makes sense. I can work around my studies and still gain relevant experience.",
      author: "Eshaan Walia",
      role: "Economics Student",
      university: "University of Bristol",
      rating: 5
    },
    {
      quote: "The physics job market is competitive, and most opportunities want years of experience. Working with startups through LiteStart gives me a chance to apply technical skills in real scenarios without the pressure of a full-time commitment.",
      author: "Tyler Bains", 
      role: "Physics Student",
      university: "University of Bristol",
      rating: 5
    },
    {
      quote: "Traditional graduate schemes don't start until after graduation, but I need experience now. LiteStart connects me with biotech startups where I can contribute meaningfully while still completing my degree.",
      author: "Alfie Shores",
      role: "Biochemistry Student",
      university: "University of Bristol",
      rating: 5
    }
  ];

  const steps = [
    {
      icon: Search,
      title: "Find Real Startup Projects",
      description: "Browse and discover exciting, real-world projects from innovative startups looking for student talent.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Get Matched Instantly",
      description: "Our AI matches you with the perfect project based on your skills, interests, and availability. No more endless searching!",
      color: "teal"
    },
    {
      icon: CheckCircle,
      title: "Build, Launch, and Get Paid",
      description: "Collaborate with founders, gain hands-on experience, and get paid for your work. Boost your resume and make an impact!",
      color: "orange"
    }
  ];

  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-100 text-blue-600",
    teal: "bg-teal-100 text-teal-600", 
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="min-h-screen bg-white">
      <MouseTracker />
      <Header />
      
      {/* Hero Section */}
      <Hero onJoinWaitlist={handleJoinWaitlist} />
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        {/* Background Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why LiteStart Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform is designed around the real needs of students and startups, creating meaningful connections that benefit everyone.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      ⏱️ Micro-internships, not months-long commitments
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Short, structured placements that fit around student schedules — typically 1 to 3 weeks.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={400}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      📋 Project-based, with defined scope and time commitment
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Each opportunity is outcome-focused and time-bound — so students know exactly what they're signing up for.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={600}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      🤝 Win-win model — built for both students and startups
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Students gain experience. Startups get real support. Both sides grow.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={800}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                    <Briefcase className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                      📍 Rooted in the UK student/startup ecosystem
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Born out of the Bristol entrepreneurial community, with strong ties to university networks.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How LiteStart Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Land real experience, earn money, and launch your career in three simple steps
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <div className="text-center group">
                  <div className="relative mb-8">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${colorClasses[step.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* Visual Section with Images */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  For Students: Real Experience, Real Growth
                </h2>
                <p className="text-xl text-gray-600">
                  Work on meaningful projects with real startups. Build your portfolio, gain experience, and get paid while you learn.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Gain real-world startup experience</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Work on short-term, skill-building projects (1–3 weeks)</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Build your CV with meaningful, hands-on work</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                  alt="Students working on laptops" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-2xl"></div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Startup Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                  alt="Startup team meeting" 
                  className="rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-600/20 to-transparent rounded-2xl"></div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection delay={300}>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  For Startups: Access Top Talent Fast
                </h2>
                <p className="text-xl text-gray-600">
                  Get help from driven, capable students. Keep costs low while accessing fresh perspectives and cutting-edge skills.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Access driven, capable student talent</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Get project help in marketing, research, design, tech, and more</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">Keep costs low — ideal for early-stage, bootstrapped teams</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               What Bristol Students Say
              </h2>
              <p className="text-xl text-gray-600">
               Hear from University of Bristol students who've gained real experience through LiteStart.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="border-t pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    <div className="text-blue-600 text-sm font-medium">{testimonial.university}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build the Future Together?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of students and startups who are already creating meaningful connections and real impact.
            </p>
            <button
              onClick={handleJoinWaitlist}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <span>Join the Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
            <img src="/litestart-logo.png" alt="LiteStart Logo" className="mx-auto mb-2 mt-2 w-48 h-48" />
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Launching Soon!</h2>
            <p className="text-gray-600 mb-6">Sign up to get early access and updates.</p>
            
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
                    disabled={loading}
                    className={`flex-1 font-semibold py-3 rounded-lg text-lg transition-all duration-300 shadow-md ${
                      loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {loading ? 'Signing up...' : `Join Waitlist`}
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