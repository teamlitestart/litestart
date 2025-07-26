import React, { useState } from 'react';

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

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState<'startup' | 'student'>('startup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-12 pb-8">
        <div className="max-w-2xl w-full text-center mb-10">
                  <img src="/vite.svg" alt="Project 1 Logo" className="mx-auto mb-4 w-16 h-16" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Project 1</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-6">
            The AI-powered platform connecting elite university students with early-stage startups for high-impact freelance work.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-auto mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900">Launching Soon!</h2>
            <p className="text-gray-600 mb-6">Sign up to get early access and updates.</p>
            
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('startup')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                    userType === 'startup'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  🚀 Startup
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`py-3 px-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                    userType === 'student'
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                  }`}
                >
                  👨‍🎓 Student
                </button>
              </div>
            </div>
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

        {/* Features Section */}
        <div className="max-w-4xl mx-auto w-full mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Project 1?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl shadow p-6 text-left">
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="max-w-3xl mx-auto w-full mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="bg-white rounded-xl shadow p-6 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4">{step.step}</div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="font-bold text-lg">Project 1</span> &copy; {new Date().getFullYear()}
          </div>
          <div className="flex space-x-6">
            <a href="mailto:info@project1.com" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignupPage; 