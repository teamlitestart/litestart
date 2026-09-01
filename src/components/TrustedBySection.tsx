import React from 'react';

const partners = [
  'Company placeholder',
  'Northstar Labs',
  'University placeholder',
  'Futureworks',
  'Bristol University',
  'Company placeholder',
  'Northstar Labs',
  'University placeholder',
];

const TrustedBySection: React.FC = () => {
  const items = [...partners, ...partners];

  return (
    <section id="journey-begins" className="overflow-hidden border-y border-gray-900/10 bg-[#f7f6f0] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          Trusted by ambitious teams and universities
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-trusted-marquee items-center gap-4">
            {items.map((partner, index) => (
              <div
                key={`${partner}-${index}`}
                className="flex h-14 min-w-44 items-center justify-center rounded-full border border-gray-900/10 bg-white/60 px-6 text-sm font-medium text-gray-700 shadow-sm"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
