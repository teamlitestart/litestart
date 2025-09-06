import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, Briefcase, Users, Target } from 'lucide-react';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import SignupForm from './components/SignupForm';
import SignupSelection from './components/SignupSelection';
import Dashboard from './components/Dashboard';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import StudentOnboarding from './components/StudentOnboarding';
import StartupOnboarding from './components/StartupOnboarding';
import AdminDashboard from './components/AdminDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import EmailVerification from './components/EmailVerification';
import Header from './components/Header';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import EmailDeliveryMonitor from './components/EmailDeliveryMonitor';
import StudentDashboard from './components/StudentDashboard';
import StartupDashboard from './components/StartupDashboard';
import DashboardRedirect from './components/DashboardRedirect';
import { AuthProvider } from './contexts/AuthContext';
import { trackPageView } from './services/googleAnalytics';
import { initializeGoogleAnalytics } from './config/googleAnalytics';

// Page View Tracker Component
const PageViewTracker: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Track page view when location changes
    trackPageView(location.pathname, document.title);
  }, [location]);
  
  return null;
};

// Signup Selection Page
const SignupSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectStudent = () => {
    navigate('/signup/student');
  };

  const handleSelectStartup = () => {
    navigate('/signup/startup');
  };

  return (
    <SignupSelection 
      onSelectStudent={handleSelectStudent}
      onSelectStartup={handleSelectStartup}
    />
  );
};

// Student and Startup Signup Pages
const StudentSignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at welcome screen
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  
  const handleClose = () => {
    window.location.href = '/preview';
  };

  const handleNext = () => {
    setSlideDirection('left');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setSlideDirection('right');
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {currentStep === 0 ? (
        <div className={`min-h-screen flex items-center justify-center p-4 animate-fade-in`}>
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Join LiteStart as a Student
              </h1>
              <p className="text-xl text-gray-600">
                Create your account in just 2 minutes and unlock exciting opportunities with innovative startups.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-8 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>2 min setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5" />
                  <span>Real projects</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-3"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <StudentOnboarding 
          currentStep={currentStep} 
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

const StartupSignupPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at welcome screen
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  
  const handleClose = () => {
    window.location.href = '/preview';
  };

  const handleNext = () => {
    setSlideDirection('left');
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setSlideDirection('right');
    setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 overflow-hidden">
      {currentStep === 0 ? (
        <div className={`min-h-screen flex items-center justify-center p-4 animate-fade-in`}>
          <div className="max-w-2xl w-full text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Join LiteStart as a Startup
              </h1>
              <p className="text-xl text-gray-600">
                Create your account in just 2 minutes and connect with talented university students.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="flex items-center space-x-8 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>2 min setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Access talent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Fast results</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="group bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-3"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-sm text-gray-500">
                Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <StartupOnboarding 
          currentStep={currentStep} 
          onBack={handleBack}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

// FAQs Page Component
const FAQsPage: React.FC = () => {
  const location = useLocation();
  const isPreviewRoute = location.pathname.startsWith('/preview');
  
  return (
    <div className="min-h-screen bg-white">
      <Header showAuthButtons={isPreviewRoute} homePath={isPreviewRoute ? "/preview" : "/"} />
      <div className="py-16">
        <FAQ />
      </div>
      <Footer />
    </div>
  );
};

// Placeholder components for new pages
const AboutPage: React.FC = () => {
  const location = useLocation();
  const isPreviewRoute = location.pathname.startsWith('/preview');
  
  return (
    <div className="min-h-screen bg-white">
      <Header showAuthButtons={isPreviewRoute} homePath={isPreviewRoute ? "/preview" : "/"} />
      
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden">
        {/* Background Graphics */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-teal-200 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-200 rounded-lg"></div>
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
                <div className="w-72 h-72 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-1 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/reece-forbes-new-profile.jpg" 
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
                <div className="w-72 h-72 mx-auto rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-1 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="/scott-sampson-profile.png" 
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
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-2xl text-blue-600">+</div>
                    <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Connecting Talent</h3>
                    <p className="text-gray-600">
                      Bridging the gap between ambitious students and innovative startups
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const ContactPage: React.FC = () => {
  const location = useLocation();
  const isPreviewRoute = location.pathname.startsWith('/preview');
  
  return (
    <div className="min-h-screen bg-white">
      <Header showAuthButtons={isPreviewRoute} homePath={isPreviewRoute ? "/preview" : "/"} />
      
      {/* Main Content */}
      <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions about LiteStart? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Whether you're a student looking for opportunities or a startup seeking talent, 
                  we're here to help connect you with the right match.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">@</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@litestart.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <span className="text-teal-600 font-semibold">📍</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">Bristol, UK</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Response</h3>
              <p className="text-gray-600 mb-6">
                Send us an email and we'll get back to you within 24 hours. 
                We're excited to hear about your project or answer any questions!
              </p>
              
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">For Students</p>
                  <p className="text-sm text-gray-600">Questions about opportunities, applications, or getting started</p>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">For Startups</p>
                  <p className="text-sm text-gray-600">Partnership inquiries, posting projects, or finding talent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

function MainSite() {
  const [isStudentOnboardingOpen, setIsStudentOnboardingOpen] = useState(false);
  const [isStartupOnboardingOpen, setIsStartupOnboardingOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Preview password - in production, this should be more secure
  const PREVIEW_PASSWORD = 'BES25';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PREVIEW_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError('');
      // Store authentication in session storage
      sessionStorage.setItem('preview_authenticated', 'true');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  // Check if already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('preview_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleJoinWaitlist = () => {
    // Navigate to signup page
    window.location.href = '/signup';
  };
  const handleCloseStudentOnboarding = () => setIsStudentOnboardingOpen(false);
  const handleCloseStartupOnboarding = () => setIsStartupOnboardingOpen(false);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">LiteStart Preview</h1>
            <p className="text-gray-600">Enter password to access the preview site</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="preview-password" className="block text-sm font-medium text-gray-700 mb-2">
                Preview Password
              </label>
              <input
                type="password"
                id="preview-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Access Preview
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Return the new landing page content instead of the old components
  return <LandingPage />;
}

function App() {
  // Initialize Google Analytics when the app starts
  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <PageViewTracker />
        <Routes>
          <Route path="/" element={<SignupPage />} />
          <Route path="/preview" element={<MainSite />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupSelectionPage />} />
          <Route path="/signup/student" element={<StudentSignupPage />} />
          <Route path="/signup/startup" element={<StartupSignupPage />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/startup" element={<StartupDashboard />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/email-monitor" element={<EmailDeliveryMonitor />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/preview/faqs" element={<FAQsPage />} />
          <Route path="/preview/about" element={<AboutPage />} />
          <Route path="/preview/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookie" element={<CookiePolicy />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;