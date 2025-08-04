import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Users, Clock, Target, Briefcase, Star, Quote, CheckCircle, Search, ChevronLeft, ChevronRight, Zap, Award, Globe, Shield } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MouseTracker from './MouseTracker';

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
  const [form, setForm] = useState({ name: '', email: '', userType: 'student' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const nextTestimonial = () => {
    setIsPaused(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsPaused(true);
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsPaused(true);
    setCurrentTestimonial(index);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSignup = () => {
    const signupSection = document.getElementById('signup');
    if (signupSection) {
      signupSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const testimonials = [
    {
      quote: "LiteStart connected me with a fintech startup for a 2-week project. I gained real experience, got paid, and now have a reference for my CV. It's exactly what I needed!",
      author: "Sarah Chen",
      role: "Computer Science Student",
      university: "University of Bristol",
      rating: 5
    },
    {
      quote: "As a startup founder, finding reliable student talent was always a challenge. LiteStart's AI matching is incredible - we found the perfect student for our marketing project in days.",
      author: "Marcus Rodriguez",
      role: "Founder",
      company: "TechFlow Solutions",
      rating: 5
    },
    {
      quote: "The micro-internship format is perfect for my schedule. I can work on real projects without committing to months of unpaid work. LiteStart is changing the game for students.",
      author: "Emma Thompson",
      role: "Economics Student",
      university: "University of Bristol",
      rating: 5
    }
  ];

  const stats = [
    { number: "500+", label: "Students Connected" },
    { number: "150+", label: "Startups Partnered" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "£2.5K", label: "Avg. Project Value" }
  ];

  const features = [
    {
      icon: Clock,
      title: "⏱️ Micro-internships",
      description: "Short, structured placements that fit around student schedules — typically 1 to 3 weeks.",
      color: "blue"
    },
    {
      icon: Target,
      title: "📋 Project-based",
      description: "Each opportunity is outcome-focused and time-bound — clear scope and expectations.",
      color: "teal"
    },
    {
      icon: Users,
      title: "🤝 Win-win model",
      description: "Students gain experience. Startups get real support. Both sides grow together.",
      color: "purple"
    },
    {
      icon: Briefcase,
      title: "📍 UK ecosystem",
      description: "Born from the Bristol entrepreneurial community, with strong university networks.",
      color: "orange"
    }
  ];

  const steps = [
    {
      icon: Search,
      title: "Browse Projects",
      description: "Discover exciting, real-world projects from innovative startups looking for student talent.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Get Matched",
      description: "Our AI matches you with the perfect project based on your skills and interests.",
      color: "teal"
    },
    {
      icon: CheckCircle,
      title: "Build & Earn",
      description: "Collaborate with founders, gain hands-on experience, and get paid for your work.",
      color: "orange"
    }
  ];

  const colorClasses: { [key: string]: string } = {
    blue: "bg-blue-100 text-blue-600",
    teal: "bg-teal-100 text-teal-600", 
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50/30">
      <MouseTracker />
      <Header homePath="/preview" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden -mt-24 pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
            alt="Modern workspace with laptops and collaboration" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/80"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-12">
                {/* Hero Content */}
                <div className="w-full">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight drop-shadow-sm">
                    Build Your Future.<br />
                    <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent block">
                      Real Projects. Real Startups. Real Impact.
                    </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                    The AI-powered platform connecting elite university students with early-stage startups for high-impact freelance work.
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                      <AnimatedSection key={index} delay={index * 200}>
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">
                            {stat.number}
                          </div>
                          <div className="text-sm md:text-base text-gray-600">
                            {stat.label}
                          </div>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button 
                      onClick={scrollToSignup}
                      className="group bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>Learn How It Works</span>
                    </button>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
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
            {features.map((feature, index) => (
              <AnimatedSection key={index} delay={index * 200}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
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
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get started in minutes and find your perfect match in just three simple steps.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 300}>
                <div className="text-center group">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full ${colorClasses[step.color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-10 h-10" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-100 transform translate-x-4"></div>
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

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Community Says
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Join hundreds of students and startups who are already building their futures together.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="relative max-w-4xl mx-auto">
            <div 
              className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex items-center justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic text-center leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[currentTestimonial].role}
                  {testimonials[currentTestimonial].university && (
                    <span> • {testimonials[currentTestimonial].university}</span>
                  )}
                  {testimonials[currentTestimonial].company && (
                    <span> • {testimonials[currentTestimonial].company}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Signup Section */}
      <section id="signup" className="py-24 bg-gradient-to-br from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Join the future of student-startup collaboration. Sign up today and start building your future.
            </p>
          </AnimatedSection>
          
          {!submitted ? (
            <AnimatedSection delay={200}>
              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    required
                  />
                </div>
                
                <select
                  name="userType"
                  value={form.userType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <option value="student">I'm a student looking for opportunities</option>
                  <option value="startup">I'm a startup looking for talent</option>
                </select>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-blue-600 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Signing up...' : 'Get Started Free'}
                </button>
              </form>
            </AnimatedSection>
          ) : (
            <AnimatedSection delay={200}>
              <div className="bg-white rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LiteStart!</h3>
                <p className="text-gray-600 mb-6">
                  We've sent you a confirmation email. Check your inbox to complete your registration and start exploring opportunities.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up Another Account
                </button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage; 