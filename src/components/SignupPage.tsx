import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Users, Clock, Target, Briefcase, Star, Quote, CheckCircle, Search, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import Hero from './Hero';
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

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState<'startup' | 'student' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused) return; // Don't auto-advance when paused
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const nextTestimonial = () => {
    setIsPaused(true); // Pause when manually navigating
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsPaused(true); // Pause when manually navigating
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsPaused(true); // Pause when manually navigating
    setCurrentTestimonial(index);
  };

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

  const testimonials = [
    {
      quote: "I'm excited about LiteStart because most internships are either unpaid or require huge time commitments. The idea of short, paid projects that actually relate to my economics degree makes so much sense. I can work around my studies and still gain relevant experience.",
      author: "Eshaan Walia",
      role: "Economics Student",
      university: "University of Bristol",
      rating: 5
    },
    {
      quote: "The physics job market is so competitive, and most opportunities want years of experience. I'm looking forward to LiteStart giving me a chance to apply my technical skills in real scenarios without the pressure of a full-time commitment.",
      author: "Tyler Bains", 
      role: "Physics Student",
      university: "University of Bristol",
      rating: 5
    },
    {
      quote: "Traditional graduate schemes don't start until after graduation, but I need experience now. I'm excited that LiteStart will connect me with biotech startups where I can contribute meaningfully while still completing my degree.",
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
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600"
  };

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

  const journeySteps = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-white to-blue-50/30 relative">

      
      <MouseTracker />
      <Header showAuthButtons={false} homePath="/" />
      
      {/* Hero Section */}
      <Hero onJoinWaitlist={handleJoinWaitlist} />
      
      {/* Journey Introduction - Quote Section */}
      <section id="journey-begins" className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 relative overflow-hidden">
        {/* Flowing background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 text-sm font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>Your Journey Begins Here</span>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              {/* Left Chameleon Image */}
              <div className="flex-shrink-0">
                <img 
                  src="/Chameleon avatar/litestart_chameleon_cartoon_1.png" 
                  alt="LiteStart Chameleon" 
                  className="w-48 h-48 lg:w-56 lg:h-56 object-contain drop-shadow-lg"
                />
              </div>
              
              {/* Center Quote */}
              <div className="flex-1 text-center">
                <blockquote className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                  "Litestart eliminates all of your admin work whilst finding you the most relevant candidates for your business"
                </blockquote>
              </div>
            </div>
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
              <div className="inline-flex items-center space-x-2 bg-blue-50 rounded-full px-4 py-2 text-blue-600 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                <span>Step 1: Discover the Opportunity</span>
              </div>


                
                {/* Centered heading */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                Built for Success Together
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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

      {/* Journey Stage 2: The Path Forward */}
      <section id="how-it-works" className="py-24 bg-gray-50 relative">
        {/* Journey connector line */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-white to-gray-300"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-gray-300 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16 relative">
              <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 text-gray-700 text-sm font-medium mb-4 shadow-sm">
                <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                <span>Step 2: Navigate Your Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Your Success Starts Here
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow this proven path to unlock opportunities, drive results, and build your future together.
              </p>
              
              {/* Chameleon Image positioned absolutely on the right */}
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block">
                <img
                  src="/Chameleon avatar/litestart_chameleon_cartoon_sitting.png"
                  alt="LiteStart Chameleon Sitting"
                  className="w-48 h-48 object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
            {journeySteps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 300}>
                <div className="text-center group relative">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 mx-auto rounded-full ${colorClasses[step.color]} flex items-center justify-center group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-500 shadow-lg group-hover:shadow-xl relative z-10`}>
                      <step.icon className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-sm font-bold text-gray-700 border-2 border-gray-200 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>

                    {/* Connecting Arrow (except for last item) */}
                    {index < journeySteps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform -translate-y-1/2 animate-pulse"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
              <div className="inline-flex items-center space-x-2 bg-green-50 rounded-full px-4 py-2 text-green-600 text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span>Step 3: See Real Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Our Students Are Looking For
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the opportunities and experiences that students are excited to pursue through LiteStart.
              </p>
            </div>
          </AnimatedSection>

          <div className="relative max-w-4xl mx-auto">
          <div 
              className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >

              
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
        
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span>Final Step: Join the Journey</span>
              </div>
            </div>
          </AnimatedSection>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Let's Build Success Together
            </h2>
                <p className="text-xl text-blue-100 mb-12 max-w-2xl lg:max-w-none">
                  Your journey to success starts with a single step. Students: Launch your career with real experience. Startups: Access fresh talent fast.
            </p>
              </AnimatedSection>
              
              <AnimatedSection delay={200}>
                <div className="flex justify-center lg:justify-start">
            <button
              onClick={handleJoinWaitlist}
                    className="group bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-3 shadow-lg"
            >
              <span>Join the Waitlist</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
                </div>
              </AnimatedSection>
            </div>
            
            {/* Right Chameleon Image */}
            <div className="flex-shrink-0">
              <AnimatedSection delay={300}>
                <img 
                  src="/Chameleon avatar/litestart_chameleon_cartoon_2.png" 
                  alt="LiteStart Chameleon" 
                  className="w-60 h-60 lg:w-80 lg:h-80 object-contain drop-shadow-lg"
                />
          </AnimatedSection>
            </div>
          </div>
        </div>
      </section>



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