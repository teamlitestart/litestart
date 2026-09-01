import React from 'react';

const partners = [
  { name: 'Revgentic', src: '/client-logos/revgentic.jpeg' },
  { name: 'Rebellious', src: '/client-logos/rebellious.png' },
  { name: 'Arkadian', src: '/client-logos/arkadian.jpeg' },
  { name: 'JunoChat', src: '/client-logos/junochat.jpeg' },
  { name: 'Recurso', src: '/client-logos/recurso.png' },
  { name: 'NatWest', src: '/client-logos/natwest-transparent.png' },
  { name: 'University of Bristol', src: '/client-logos/university-of-bristol.png' },
  { name: 'BES', src: '/client-logos/bes-transparent.png' },
  { name: 'Unifi', src: '/client-logos/unifi-black.png' },
];

const TrustedBySection: React.FC = () => {
  const items = [...partners, ...partners];

  return (
    <section id="journey-begins" className="overflow-hidden border-y border-gray-900/10 bg-[#f7f6f0] py-[5.25rem] sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          Trusted by ambitious teams and universities
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-trusted-marquee items-center gap-[3.75rem]">
            {items.map((partner, index) => (
              <div
                key={`${partner.name}-${index}`}
                className="flex h-[7.5rem] min-w-[13.5rem] items-center justify-center"
              >
                <img
                  src={partner.src}
                  alt={partner.name}
                  className="h-24 max-w-[15rem] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
