import React, { useState, useRef } from 'react';
import VenturoFeatures from './VenturoFeatures';
import Header from './Header';
import Footer from './Footer';

const features = [
  {
    title: 'Elite Student Talent',
    description: 'Connect with top university students for high-impact freelance projects.'
  },
  {
    title: 'AI-Powered Matching',
    description: 'Our platform uses AI to match startups with the best-fit student talent.'
  },
  {
    title: 'Fast Turnaround',
    description: 'Get your projects delivered quickly—average delivery in 48 hours.'
  },
  {
    title: 'Affordable & Flexible',
    description: 'Access world-class skills at startup-friendly rates, with flexible engagement.'
  }
];

const howItWorks = [
  {
    step: '1',
    title: 'Post Your Project',
    description: 'Describe your needs and requirements in a few easy steps.'
  },
  {
    step: '2',
    title: 'Get Matched Instantly',
    description: 'Our AI matches you with the best student talent for your project.'
  },
  {
    step: '3',
    title: 'Collaborate & Launch',
    description: 'Work directly with students and launch your project faster.'
  }
];

// 3D tilt effect hook
function useTilt(ref: React.RefObject<HTMLElement>) {
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let rect: DOMRect;
    let mouseX = 0;
    let mouseY = 0;
    let isTouch = false;

    function handleMouseMove(e: MouseEvent) {
      if (isTouch) return;
      rect = node.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      const x = (mouseX / rect.width) * 2 - 1;
      const y = (mouseY / rect.height) * 2 - 1;
      node.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.04)`;
      node.style.boxShadow = `${-x * 10}px ${-y * 10}px 32px 0 rgba(0,0,0,0.10)`;
    }
    function handleMouseLeave() {
      node.style.transform = '';
      node.style.boxShadow = '';
    }
    function handleTouchStart() {
      isTouch = true;
      node.style.transform = '';
      node.style.boxShadow = '';
    }
    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('touchstart', handleTouchStart);
    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('touchstart', handleTouchStart);
    };
  }, [ref]);
}

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState<'startup' | 'student'>('startup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [benefitView, setBenefitView] = useState<'student' | 'startup'>('student');
  const formRef = useRef<HTMLDivElement>(null);
  const [bgPos, setBgPos] = useState({ x: 50, y: 50 });
  const [mouseSpeed, setMouseSpeed] = useState(0);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseTime = useRef(Date.now());

  // Mouse move handler for background
  React.useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (window.innerWidth < 768) return; // Only on desktop
      
      const now = Date.now();
      const timeDiff = now - lastMouseTime.current;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const speed = distance / timeDiff; // pixels per millisecond
      
      // Update mouse speed (with some smoothing)
      setMouseSpeed(prev => prev * 0.8 + speed * 0.2);
      
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setBgPos({ x, y });
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastMouseTime.current = now;
    }
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Toggle and CTA button refs
  const studentToggleRef = useRef<HTMLButtonElement>(null);
  const startupToggleRef = useRef<HTMLButtonElement>(null);
  const studentCtaRef = useRef<HTMLButtonElement>(null);
  const startupCtaRef = useRef<HTMLButtonElement>(null);
  useTilt(studentToggleRef);
  useTilt(startupToggleRef);
  useTilt(studentCtaRef);
  useTilt(startupCtaRef);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/signup', {
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      setSubmitted(true);
      setForm({ name: '', email: '' }); // Reset form
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex flex-col relative overflow-hidden">
      <Header />
      {/* Dynamic Mouse-Responsive Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background: `radial-gradient(400px at ${bgPos.x}% ${bgPos.y}%, rgba(56,189,248,${Math.min(mouseSpeed * 0.1, 0.35)}) 0%, transparent 100%)`,
          transition: 'background 0.18s cubic-bezier(.4,1,.7,1)',
        }}
      />
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-8" ref={formRef}>
        <div className="max-w-2xl w-full text-center mb-10">
          <img src="/vite.svg" alt="Venturo Logo" className="mx-auto mb-4 w-16 h-16" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Venturo</h1>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Launching Soon!</h2>
            <p className="text-gray-600 mb-6">Sign up to get early access and updates.</p>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-green-600 text-xl font-semibold mb-2">Check Your Email!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for signing up as a {userType === 'startup' ? 'startup' : 'student'}! 
                  We've sent a verification email to your inbox.
                </p>
                <p className="text-sm text-gray-500">
                  Please click the verification link in your email to complete your registration.
                </p>
              </div>
            ) : error ? (
              <div className="text-red-600 text-lg font-semibold py-4 bg-red-50 rounded-lg px-4">
                {error}
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
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-semibold py-3 rounded-lg text-lg transition-all duration-300 shadow-md ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? 'Signing up...' : `Notify Me as ${userType === 'startup' ? 'Startup' : 'Student'}`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Benefits Toggle */}
        <div className="max-w-2xl w-full mx-auto mb-6 flex justify-center">
          <div className="inline-flex rounded-lg shadow overflow-hidden border border-gray-200 bg-white">
            <button
              ref={studentToggleRef}
              className={`px-6 py-3 font-semibold text-lg transition-all duration-200 focus:outline-none ${benefitView === 'student' ? 'bg-blue-600 text-white' : 'text-blue-700 hover:bg-blue-50'}`}
              onClick={() => setBenefitView('student')}
            >
              👩‍🎓 For Students
            </button>
            <button
              ref={startupToggleRef}
              className={`px-6 py-3 font-semibold text-lg transition-all duration-200 focus:outline-none ${benefitView === 'startup' ? 'bg-teal-600 text-white' : 'text-teal-700 hover:bg-teal-50'}`}
              onClick={() => setBenefitView('startup')}
            >
              🧑‍💻 For Startups
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        {benefitView === 'student' && (
          <div className="max-w-2xl w-full mx-auto mb-12 bg-blue-50 rounded-2xl shadow p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 flex items-center justify-center gap-2">
              <span role="img" aria-label="student">👩‍🎓</span> For Students
            </h2>
            <ul className="text-lg text-blue-900 space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span role="img" aria-label="rocket">🚀</span>
                <span>Gain real-world startup experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="briefcase">💼</span>
                <span>Work on short-term, skill-building projects (1–3 weeks)</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="brain">🧠</span>
                <span>Build your CV with meaningful, hands-on work</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="link">🔗</span>
                <span>Connect with real founders and startup teams</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="mail">💌</span>
                <span>Get feedback, references, and exposure to career opportunities</span>
              </li>
            </ul>
            <p className="text-blue-800 mb-4">
              Whether you're exploring your first role or adding real-world proof to your passion — <span className="font-semibold">Venturo</span> is your launchpad.
            </p>
            <div className="text-center">
              <button
                onClick={scrollToForm}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
              >
                📥 Join today and start matching with live startup projects.
              </button>
            </div>
          </div>
        )}

        {benefitView === 'startup' && (
          <div className="max-w-2xl w-full mx-auto mb-12 bg-teal-50 rounded-2xl shadow p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-4 flex items-center justify-center gap-2">
              <span role="img" aria-label="startup">🧑‍💻</span> For Startups
            </h2>
            <ul className="text-lg text-teal-900 space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span role="img" aria-label="check">✅</span>
                <span>Access driven, capable student talent</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="bulb">💡</span>
                <span>Get project help in marketing, research, design, tech, and more</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="money">💰</span>
                <span>Keep costs low — ideal for early-stage, bootstrapped teams</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="puzzle">🧩</span>
                <span>Delegate tasks you don't have time to focus on</span>
              </li>
              <li className="flex items-start gap-2">
                <span role="img" aria-label="speech">💬</span>
                <span>Get a fresh perspective from tomorrow's professionals</span>
              </li>
            </ul>
            <p className="text-teal-800 mb-4">
              You get help. Students get experience. Everyone wins.
            </p>
            <div className="text-center">
              <button
                onClick={scrollToForm}
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-teal-700 transition"
              >
                📤 Post a project in minutes — we'll help match the right students to it.
              </button>
            </div>
          </div>
        )}

        {/* Venturo Features Section */}
        <VenturoFeatures showCTA={false} />
      </div>
      <Footer />
    </div>
  );
};

export default SignupPage; 