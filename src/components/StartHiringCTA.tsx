import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface StartHiringCTAProps {
  onJoinWaitlist?: () => void;
}

const StartHiringCTA: React.FC<StartHiringCTAProps> = ({ onJoinWaitlist }) => {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 200);
    if (onJoinWaitlist) {
      onJoinWaitlist();
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f6f0] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-base leading-relaxed text-gray-700 sm:text-lg lg:text-xl">
          You tell us the role. We source, screen, and interview from our network of 1000+ vetted students. We introduce you to the best fits.
        </p>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleClick}
            className={`text-shimmer group flex items-center gap-3 rounded-full border border-[#b9dcf2] bg-[#0765AD] px-8 py-4 font-serif text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#0765AD]/20 sm:text-lg ${pressed ? 'scale-95' : 'hover:scale-105'}`}
          >
            <span>Start hiring</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default StartHiringCTA;
