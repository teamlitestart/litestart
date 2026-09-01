import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onJoinWaitlist: () => void;
}

const Hero: React.FC<HeroProps> = (_props) => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f6f0] px-4 pt-24 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Modern workspace with laptops and collaboration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f7f6f0]/95 via-[#f7f6f0]/85 to-blue-50/75" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl text-center">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center">
          <div className="w-full max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 drop-shadow-sm md:text-6xl lg:text-7xl">
              We match <span className="relative inline-block italic text-blue-700">
                your
                <span className="absolute bottom-0 left-0 h-1 w-full rounded-full bg-blue-700" />
              </span> business with the best intern.
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl font-medium leading-relaxed text-gray-800 drop-shadow-sm md:text-2xl">
              We use our tech to connect you with the most elite university students who are seeking internships.
            </p>

            <div className="mx-auto flex max-w-2xl items-center rounded-full border border-gray-900/15 bg-white/75 p-2 shadow-lg backdrop-blur-sm">
              <input
                type="text"
                placeholder="What role are you hiring interns for?"
                aria-label="What role are you hiring interns for?"
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
      </div>
    </section>
  );
};

export default Hero;
