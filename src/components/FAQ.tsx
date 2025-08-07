import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do you ensure the quality of student work?",
      answer: "We verify students through their university emails to ensure they attend reputable institutions. Additionally, we provide comprehensive training and a resource library to help students deliver quality work."
    },
    {
      question: "What's the typical turnaround time for projects?",
      answer: "Project timelines are set by the startup based on their specific requirements and scope. Students apply to projects with clear timelines already established by the company."
    },
    {
      question: "How does your pricing compare to traditional freelancers?",
      answer: "Our pricing is competitive with premium freelance platforms, and you get access to university student talent. Our AI can help suggest potential matches, but startups should conduct their own evaluation and selection process."
    },
    {
      question: "Can I work with the same students on multiple projects?",
      answer: "Absolutely! Many founders build ongoing relationships with talented students. You can request specific students for future projects."
    },
    {
      question: "What if I'm not satisfied with the work delivered?",
      answer: "As a platform connecting students and startups, we facilitate the initial connection and matching. Any work quality discussions would be handled directly between the student and startup."
    },
    {
      question: "How does the application process work?",
      answer: "Each startup determines their own application stages and selection criteria. Our AI may suggest potential student matches, but startups conduct their own due diligence and choose the best candidates for their specific needs."
    },
    {
      question: "Do students work individually or in teams?",
      answer: "Both! The startup determines how many students they need based on their project requirements. You can choose to work with an individual student or a team of students with complementary skills."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Get answers to common questions about quality, pricing, and process
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-xl overflow-hidden hover:bg-gray-100 transition-colors duration-300">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-8 pb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;