import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How do you ensure the quality of student work?",
      answer: "We rigorously vet all students through technical assessments, portfolio reviews, and interviews. Only the top 5% of applicants from elite universities are accepted. Additionally, all work is backed by our quality guarantee."
    },
    {
      question: "What's the typical turnaround time for projects?",
      answer: "Turnaround times vary by package: Starter (5 days), Pro (3 days), Growth (2 days). Our AI matching ensures students are available and committed to your timeline before assignment."
    },
    {
      question: "How does your pricing compare to traditional freelancers?",
      answer: "Our pricing is competitive with premium freelance platforms, but you get access to elite university talent with proven academic excellence. Plus, our AI matching reduces time-to-hire significantly."
    },
    {
      question: "Can I work with the same students on multiple projects?",
      answer: "Absolutely! Many founders build ongoing relationships with talented students. You can request specific students for future projects, and we offer discounted rates for repeat collaborations."
    },
    {
      question: "What if I'm not satisfied with the work delivered?",
      answer: "We stand behind our quality with a satisfaction guarantee. If you're not happy with the initial delivery, we'll provide additional revisions or match you with different students at no extra cost."
    },
    {
      question: "Do students work individually or in teams?",
      answer: "Both! Depending on your project complexity and chosen package, you might work with an individual student (Starter) or a curated team of 2-5 students (Pro/Growth packages) with complementary skills."
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