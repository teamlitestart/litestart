import React from 'react';
import { Search, Users, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Submit Your Project",
      description: "Post your project requirements and let our AI analyze the skills needed for success.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Get Matched Instantly",
      description: "Our AI matches you with the perfect student talent based on skills, experience, and availability.",
      color: "teal"
    },
    {
      icon: CheckCircle,
      title: "Receive High-Quality Work",
      description: "Collaborate with elite students and receive exceptional deliverables within your timeline.",
      color: "orange"
    }
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    teal: "bg-teal-100 text-teal-600", 
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How LaunchLink Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get connected with top student talent in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl ${colorClasses[step.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2" />
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;