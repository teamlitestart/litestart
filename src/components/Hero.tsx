import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = (_props) => {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-[#f7f6f0] px-6 pb-20 pt-32 sm:px-10 lg:px-16 lg:pb-24">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Modern workspace with laptops and collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f6f0]/95 via-[#f7f6f0]/75 to-[#f7f6f0]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f6f0]/90 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        <div className="max-w-xl text-left">
          <h1 className="mb-6 font-serif text-5xl leading-[1.1] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
            Fill critical positions,
            <span className="block italic leading-[1.15] text-[#0765AD]">a lot faster.</span>
          </h1>
          <p className="mb-8 max-w-lg text-base font-medium leading-relaxed text-gray-800 sm:text-lg">
            We hire interns for you end-to-end — faster and cheaper than traditional agencies.
          </p>

          <div className="flex max-w-xl items-center rounded-full border border-gray-300/30 bg-white/20 p-2 shadow-xl backdrop-blur-md">
            <input
              type="text"
              placeholder="What role are you hiring for?"
              aria-label="What role are you hiring for?"
              className="min-w-0 flex-1 bg-transparent px-5 py-3 text-left text-sm text-gray-900 outline-none placeholder:text-gray-500 sm:text-base"
            />
            <button
              type="button"
              aria-label="Submit hiring role"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white transition-transform hover:scale-105"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
