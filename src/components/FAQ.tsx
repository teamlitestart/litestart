import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do you ensure the quality of student work?',
    answer: 'We verify students through their university emails to ensure they attend reputable institutions. Additionally, we provide comprehensive training and a resource library to help students deliver quality work.',
  },
  {
    question: "What's the typical turnaround time for projects?",
    answer: 'Project timelines are set by the startup based on their specific requirements and scope. Students apply to projects with clear timelines already established by the company.',
  },
  {
    question: 'How does your pricing compare to traditional freelancers?',
    answer: 'Our pricing is competitive with premium freelance platforms, and you get access to university student talent. Our AI can help suggest potential matches, but startups should conduct their own evaluation and selection process.',
  },
  {
    question: 'Can I work with the same students on multiple projects?',
    answer: 'Absolutely! Many founders build ongoing relationships with talented students. You can request specific students for future projects.',
  },
  {
    question: "What if I'm not satisfied with the work delivered?",
    answer: 'As a platform connecting students and startups, we facilitate the initial connection and matching. Any work quality discussions would be handled directly between the student and startup.',
  },
  {
    question: 'How does the application process work?',
    answer: 'Each startup determines their own application stages and selection criteria. Our AI may suggest potential student matches, but startups conduct their own due diligence and choose the best candidates for their specific needs.',
  },
  {
    question: 'Do students work individually or in teams?',
    answer: 'Both! The startup determines how many students they need based on their project requirements. You can choose to work with an individual student or a team of students with complementary skills.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#f7f6f0] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 rounded-[2rem] border border-gray-200/80 bg-white/75 p-6 shadow-[0_24px_70px_rgba(26,47,66,0.08)] backdrop-blur-xl sm:p-10 lg:flex-row lg:gap-20 lg:p-14">
        <div className="shrink-0 lg:w-56">
          <p className="font-serif text-3xl leading-[1.05] tracking-tight text-gray-950 sm:text-4xl">
            Common
            <span className="block">Questions</span>
          </p>
        </div>

        <div className="min-w-0 flex-1">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-gray-900/10 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left font-sans text-sm font-semibold text-gray-900 transition-colors hover:text-[#0765AD] sm:py-6 sm:text-base"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  {isOpen ? <Minus className="h-5 w-5 shrink-0 text-[#0765AD]" /> : <Plus className="h-5 w-5 shrink-0 text-gray-500" />}
                </button>
                <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-6 text-sm leading-relaxed text-gray-600 sm:text-base">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
