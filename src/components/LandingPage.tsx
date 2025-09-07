import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    // Redirect to signup page
    window.location.href = '/signup';
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



  const features = [
    {
      icon: Clock,
      title: "⚡ Fast & Efficient",
      description: "Get skilled students working on your projects in days, not months. Boost productivity while students gain real experience.",
      color: "blue"
    },
    {
      icon: Target,
      title: "🎯 High-Impact Results",
      description: "Outcome-focused projects deliver measurable ROI. Students build portfolios while you achieve your goals.",
      color: "teal"
    },
    {
      icon: Users,
      title: "🚀 Grow Together",
      description: "Access fresh talent and innovative thinking. Students gain career-defining experience. Let's build success together.",
      color: "purple"
    },
    {
      icon: Briefcase,
      title: "💡 Smart Investment",
      description: "Cost-effective access to university talent. Students earn while they learn. Maximum value for everyone.",
      color: "orange"
    }
  ];

  const steps = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description: "Find projects that accelerate your career growth. Real companies, real impact, real learning.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Get Matched Smart",
      description: "Our AI connects you with projects that build your skills and help startups achieve their goals faster.",
      color: "teal"
    },
    {
      icon: Briefcase,
      title: "Apply & Connect",
      description: "Join innovative teams ready to invest in your growth. Show your potential, land the opportunity.",
      color: "purple"
    },
    {
      icon: CheckCircle,
      title: "Learn & Deliver",
      description: "Build your portfolio while delivering results. Gain experience, earn money, launch your career.",
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
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50/30 w-full">
      <MouseTracker />
      <Header homePath="/preview" />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                  <p className="text-xl md:text-2xl text-gray-800 mb-12 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                    The AI-powered platform connecting university students with startups and SMEs for high-impact microinternships.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    <button 
                      onClick={scrollToSignup}
                      className="group bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2 shadow-lg"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => document.getElementById('journey-begins')?.scrollIntoView({ behavior: 'smooth' })}
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

      {/* Journey Introduction - Quote Section */}
      <section id="journey-begins" className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        {/* Flowing background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm font-medium" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>Your Journey Begins Here</span>
              </div>
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
              "Litestart eliminates all of your admin work whilst finding you the most relevant candidates for your business"
            </blockquote>
          </AnimatedSection>
        </div>
      </section>

      {/* Journey Stage 1: Why Choose This Path */}
      <section className="py-24 bg-white relative">
        {/* Journey connector line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-teal-600 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 text-blue-600 text-sm font-medium mb-4" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>Step 1: Discover the Opportunity</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Built for Success Together
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Startups get skilled talent fast. Students gain career-defining experience. Everyone wins when we work together.
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
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

      {/* Journey Stage 2: The Path Forward */}
      <section id="how-it-works" className="py-24 bg-gray-50 relative">
        {/* Journey connector line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-white to-gray-300"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-300 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 text-gray-700 text-sm font-medium mb-4 shadow-sm" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                <span>Step 2: Navigate Your Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Your Success Starts Here
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Follow this proven path to unlock opportunities, drive results, and build your future together.
              </p>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 300}>
                <div className="text-center group relative">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full ${colorClasses[step.color]} flex items-center justify-center group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500 shadow-lg group-hover:shadow-xl relative z-10`}>
                      <step.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-700 border-2 border-gray-200 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                      {index + 1}
                    </div>

                    {/* Connecting Arrow (except for last item) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2 animate-pulse"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                    {step.description}
                  </p>
                  
                  {/* Animated background on hover */}
                  <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg -z-10 -m-4"></div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Stage 3: Proof of Success */}
      <section className="py-24 bg-white relative">
        {/* Journey connector line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-300 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 text-green-600 text-sm font-medium mb-4" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span>Step 3: See Real Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Success Stories We're Proud Of
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                Others have walked this path and achieved amazing results. Your success story is next.
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
              
              <blockquote className="text-xl md:text-2xl text-gray-700 mb-8 italic text-center leading-relaxed" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                  {testimonials[currentTestimonial].author}
                </div>
                <div className="text-gray-600" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
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

      {/* Journey Destination: Take Action */}
      <section id="signup" className="py-24 bg-gradient-to-br from-blue-600 to-teal-600 relative overflow-hidden">
        {/* Journey connector line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-white to-blue-500"></div>
        
        {/* Celebration elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-3 h-3 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-16 w-2 h-2 bg-white/35 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <AnimatedSection>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>Final Step: Join the Journey</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
              Let's Build Success Together
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
              Your journey to success starts with a single step. Students: Launch your career with real experience. Startups: Access fresh talent fast.
            </p>
          </AnimatedSection>
          
                      <AnimatedSection delay={200}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto">
              <Link 
                to="/signup"
                className="group bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-3 shadow-lg w-full sm:w-auto justify-center"
                style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}
              >
                <Users className="w-6 h-6" />
                <span>Sign Up Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="mt-8 text-blue-100 text-sm" style={{ fontFamily: "'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif" }}>
              <p>Already have an account? <Link to="/login" className="underline hover:text-white transition-colors">Login here</Link></p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage; 