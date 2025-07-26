import React from 'react';
import { Quote, Star } from 'lucide-react';

const TrustSection = () => {
  const testimonials = [
    {
              quote: "Project 1 connected us with incredible student talent that delivered our MVP in record time. The quality exceeded our expectations.",
      author: "Sarah Chen",
      role: "Co-founder, TechFlow",
      university: "Stanford Graduate",
      rating: 5
    },
    {
              quote: "As a student, Project 1 has been game-changing. I've worked on real startup projects and built invaluable experience while earning great money.",
      author: "Marcus Rodriguez", 
      role: "Computer Science Student",
      university: "MIT",
      rating: 5
    },
    {
      quote: "The AI matching is incredibly accurate. We got students who understood our vision immediately and delivered exceptional work.",
      author: "David Park",
      role: "Founder, GrowthHack",
      university: "Ex-Y Combinator",
      rating: 5
    }
  ];

  const partners = [
    "Stanford University",
    "MIT",
    "Harvard",
    "UC Berkeley",
    "Carnegie Mellon",
    "Caltech"
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Founders & Students
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how Project 1 is helping students and startups build the future—together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-blue-600 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-gray-600 text-sm">{testimonial.role}</div>
                <div className="text-blue-600 text-sm font-medium">{testimonial.university}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-8">
            Proudly Partnered with Top Universities
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Our student talent comes from the world’s best institutions. Join a network of ambitious students and innovative founders.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-sm font-medium text-gray-700 text-center">
                  {partner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;