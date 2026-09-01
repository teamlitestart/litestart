import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does Litestart work?',
    answer: 'Tell us the role. We handle sourcing, screening, outreach, and scheduling end-to-end — using AI agents that work 24/7. You just show up to interviews with vetted, interested candidates.',
  },
  {
    question: 'Where do you source from?',
    answer: 'Our pool of pre-vetted candidates, your applicants, and global outbound across LinkedIn, email and WhatsApp. Every channel, deduped and ranked.',
  },
  {
    question: 'How are you different from a traditional agency?',
    answer: 'Same model — pay on hire — but cheaper and faster because AI does the heavy lifting. A human recruiter is still in the loop on every role; the AI just makes them 10× more productive.',
  },
  {
    question: 'What roles do you hire for?',
    answer: 'GTM, Sales and Marketing, anything GTM we can source and screen for it.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-[#f7f6f0] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 rounded-[2rem] border border-white/10 bg-[#e7ebf4]/70 p-6 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-10 lg:flex-row lg:gap-20 lg:p-14">
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
