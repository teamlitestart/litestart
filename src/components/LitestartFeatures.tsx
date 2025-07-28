import React from 'react';
import { Clock, FileText, Handshake, MapPin } from 'lucide-react';

interface LitestartFeaturesProps {
  showCTA?: boolean;
}

const LitestartFeatures: React.FC<LitestartFeaturesProps> = ({ showCTA = true }) => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "⏱️ Micro-internships, not months-long commitments",
      description: "Short, structured placements that fit around student schedules — typically 1 to 3 weeks."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "📋 Project-based, with defined scope and time commitment",
      description: "Each opportunity is outcome-focused and time-bound — so students know exactly what they're signing up for, and LiteStart respect that."
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "🤝 Win-win model — built for both students and LiteStart",
      description: "Students gain experience. LiteStart get real support. Both sides grow."
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "📍 Rooted in the UK student/LiteStart ecosystem",
      description: "Born out of the Bristol entrepreneurial community, with strong ties to university networks and early-stage founders."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why LiteStart Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is designed around the real needs of students and LiteStart, creating meaningful connections that benefit everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl text-white">
                  {feature.icon}
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
          ))}
        </div>
        
        {showCTA && (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join hundreds of students and LiteStart who are already building their futures together through LiteStart.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                  Post a Project
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Join as Student
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LitestartFeatures; 