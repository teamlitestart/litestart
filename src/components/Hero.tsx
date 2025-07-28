import React from 'react';
import { ArrowRight, Users, Zap } from 'lucide-react';

interface HeroProps {
  onJoinAsStudent: () => void;
  onJoinAsStartup: () => void;
}

const Hero: React.FC<HeroProps> = ({ onJoinAsStudent, onJoinAsStartup }) => {
  return (
    <section className="relative min-h-[200vh] bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-gray-600">Top University Students</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">150+</div>
                <p className="text-gray-600">Startups Served</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">48hr</div>
                <p className="text-gray-600">Average Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;