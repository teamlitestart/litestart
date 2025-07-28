import React from 'react';
import { ArrowRight, Users, Zap } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" 
          alt="Students working" 
          className="absolute top-10 left-10 w-64 h-48 object-cover rounded-2xl opacity-20 transform rotate-12 shadow-2xl"
        />
        <img 
          src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" 
          alt="Startup team" 
          className="absolute top-32 right-16 w-56 h-40 object-cover rounded-2xl opacity-20 transform -rotate-6 shadow-2xl"
        />
        <img 
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" 
          alt="Collaboration" 
          className="absolute bottom-20 left-20 w-48 h-36 object-cover rounded-2xl opacity-20 transform rotate-6 shadow-2xl"
        />
        <img 
          src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" 
          alt="Innovation" 
          className="absolute bottom-32 right-10 w-52 h-44 object-cover rounded-2xl opacity-20 transform -rotate-12 shadow-2xl"
        />
      </div>
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Talent Matching</span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-12">
          {/* Hero Content */}
          <div className="w-full">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your Future.<br />
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent block">
                Real Projects. Real Startups. Real Impact.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The AI-powered platform connecting elite university students with early-stage startups for high-impact freelance work.
            </p>
            <div className="flex justify-center items-center mb-12">
              <button 
                onClick={onJoinWaitlist}
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
              >
                <span>Join the Waitlist</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;