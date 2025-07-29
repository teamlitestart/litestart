import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';


const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token found. Please check your email for the correct verification link.');
        return;
      }

      // For now, simulate successful verification
      setTimeout(() => {
        setStatus('success');
        setMessage('Your email has been successfully verified! Welcome to LiteStart.');
      }, 1000);
    };

    verifyEmail();
  }, [searchParams]);

  const handleGoToSignup = () => {
    navigate('/');
  };

  const handleGoToPreview = () => {
    navigate('/preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <img src="/vite.svg" alt="Venturo Logo" className="mx-auto mb-4 w-16 h-16" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verification</h1>
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleGoToPreview}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Go to Main Site
              </button>
              <button
                onClick={handleGoToSignup}
                className="w-full border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Back to Signup
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleGoToSignup}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Back to Signup
              </button>
              <p className="text-sm text-gray-500">
                Need help? Contact us at{' '}
                <a href="mailto:info@venturo.com" className="text-blue-600 hover:underline">
                  info@venturo.com
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification; 