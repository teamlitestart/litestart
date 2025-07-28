import React from 'react';
import { ArrowRight, Users, Zap } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinWaitlist }) => {
  return (
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Single Large Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Students and startups collaborating" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-blue-800/60 to-teal-800/70"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Talent Matching</span>
          </div>
        </div>
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-12">
          {/* Hero Content */}
          <div className="w-full">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Build Your Future.<br />
              <span className="bg-gradient-to-r from-blue-200 to-teal-200 bg-clip-text text-transparent block">
                Real Projects. Real Startups. Real Impact.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              The AI-powered platform connecting elite university students with early-stage startups for high-impact freelance work.
            </p>
            <div className="flex justify-center items-center mb-12">
              <button 
                onClick={onJoinWaitlist}
                className="group bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
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