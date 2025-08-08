import React from 'react';
import { User, Building, ArrowRight } from 'lucide-react';

interface SignupSelectionProps {
  onSelectStudent: () => void;
  onSelectStartup: () => void;
}

const SignupSelection: React.FC<SignupSelectionProps> = ({ onSelectStudent, onSelectStartup }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">LiteStart</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-4xl w-full">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Join LiteStart
              </h1>
              <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                Choose your path and start your journey with innovative opportunities
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Student Card */}
              <div 
                onClick={onSelectStudent}
                className="group cursor-pointer bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-all duration-300">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
                  <p className="text-gray-600 mb-6 font-medium">
                    Find real-world opportunities, build your portfolio, and earn while you learn
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Access to startup opportunities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Build real project experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Earn while you learn</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Sign up as Student</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Startup Card */}
              <div 
                onClick={onSelectStartup}
                className="group cursor-pointer bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:-rotate-12 transition-all duration-300">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Startup</h3>
                  <p className="text-gray-600 mb-6 font-medium">
                    Connect with talented students, get projects done, and scale your business
                  </p>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Access to student talent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Post projects and opportunities</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Scale your operations</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                    <span>Sign up as Startup</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupSelection; 