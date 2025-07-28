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
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
          alt="Modern workspace with laptops and collaboration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/85 to-blue-50/80"></div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative z-10">
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
            <div className="flex justify-center items-center mb-12">
              <button 
                onClick={onJoinWaitlist}
                className="group bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center space-x-2 shadow-lg"
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