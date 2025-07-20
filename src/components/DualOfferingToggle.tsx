import React, { useState } from 'react';
import { Code, Megaphone, ArrowRight } from 'lucide-react';

interface DualOfferingToggleProps {
  onJoinAsStudent: () => void;
  onJoinAsStartup: () => void;
}

const DualOfferingToggle: React.FC<DualOfferingToggleProps> = ({ onJoinAsStudent, onJoinAsStartup }) => {
  const [activeTab, setActiveTab] = useState('talent');

  const offerings = {
    talent: {
      title: "Hire Student Talent",
      subtitle: "Connect with elite university students for technical projects",
      icon: Code,
      services: [
        {
          title: "Full-Stack Development",
          description: "End-to-end web and mobile app development",
          price: "From $599"
        },
        {
          title: "AI/ML Solutions", 
          description: "Machine learning models and AI integrations",
          price: "From $799"
        },
        {
          title: "Product Design",
          description: "UX/UI design and user research",
          price: "From $399"
        },
        {
          title: "Data Analytics",
          description: "Business intelligence and data visualization",
          price: "From $499"
        }
      ]
    },
    promotion: {
      title: "Social Media Promotion",
      subtitle: "Amplify your startup with strategic social media campaigns",
      icon: Megaphone,
      services: [
        {
          title: "Content Strategy",
          description: "Comprehensive social media content planning",
          price: "From $299"
        },
        {
          title: "Influencer Outreach",
          description: "Connect with student influencers and micro-creators",
          price: "From $499"
        },
        {
          title: "Community Building",
          description: "Build engaged communities around your brand",
          price: "From $399"
        },
        {
          title: "Campaign Management",
          description: "Full-service social media campaign execution",
          price: "From $699"
        }
      ]
    }
  };

  const currentOffering = offerings[activeTab];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Service Offerings
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the type of support your startup needs most
          </p>
          
          <div className="inline-flex bg-gray-100 p-2 rounded-xl">
            <button
              onClick={() => setActiveTab('talent')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'talent'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hire Student Talent
            </button>
            <button
              onClick={() => setActiveTab('promotion')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'promotion'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Social Media Promotion
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <currentOffering.icon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentOffering.title}</h3>
            <p className="text-gray-600">{currentOffering.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentOffering.services.map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300 group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">{service.title}</h4>
                  <span className="text-blue-600 font-semibold">{service.price}</span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onJoinAsStartup}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Post Your Project</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onJoinAsStudent}
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Join as Student</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DualOfferingToggle;