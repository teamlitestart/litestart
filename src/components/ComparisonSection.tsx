import React, { useState } from 'react';
import { Clock, FileSearch, AlertTriangle, Repeat, Phone, CheckCircle2, UserCheck, Infinity as InfinityIcon, ArrowRight } from 'lucide-react';

interface ComparisonItem {
  number: string;
  without: string;
  with: string;
  withoutIcon: React.ReactNode;
  withIcon: React.ReactNode;
}

const comparisonItems: ComparisonItem[] = [
  {
    number: '01',
    without: 'Post the Role, Wait Weeks',
    with: 'One Call, Matched in Days',
    withoutIcon: <Clock className="h-5 w-5" />,
    withIcon: <Phone className="h-5 w-5" />,
  },
  {
    number: '02',
    without: 'Hundreds of CVs, No Fit',
    with: 'One Shortlist, Already Vetted',
    withoutIcon: <FileSearch className="h-5 w-5" />,
    withIcon: <CheckCircle2 className="h-5 w-5" />,
  },
  {
    number: '03',
    without: 'One Hire, Real Risk',
    with: 'Pre-Interviewed, Proven Fit',
    withoutIcon: <AlertTriangle className="h-5 w-5" />,
    withIcon: <UserCheck className="h-5 w-5" />,
  },
  {
    number: '04',
    without: 'Every Hire, Start From Scratch',
    with: 'One Partner, Hire On Demand',
    withoutIcon: <Repeat className="h-5 w-5" />,
    withIcon: <InfinityIcon className="h-5 w-5" />,
  },
];

const ComparisonSection: React.FC = () => {
  const [showLitestart, setShowLitestart] = useState(false);
  const [clickPulse, setClickPulse] = useState(false);
  const [contentPhase, setContentPhase] = useState<'stable' | 'fadeout' | 'fadein'>('stable');

  const handleToggle = (value: boolean) => {
    if (value === showLitestart) return;
    setClickPulse(true);
    setTimeout(() => setClickPulse(false), 250);
    setContentPhase('fadeout');
    setTimeout(() => {
      setShowLitestart(value);
      setContentPhase('fadein');
      setTimeout(() => setContentPhase('stable'), 400);
    }, 200);
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f6f0] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
        <div>
          <div className="mb-10 max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Why Litestart, why now</p>
            <div className="mb-4 w-48">
              <svg viewBox="0 0 200 12" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2 6 Q 12 1, 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 122 6 T 142 6 T 162 6 T 182 6 T 198 6"
                  stroke="#0765AD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              The shortcut to your next great hire.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              Stop losing weeks to hiring admin. Litestart helps you move from role to ready-to-start intern with less risk and more momentum.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-[#e7ebf4]/70 p-5 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-6">
              <div className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">1000+</div>
              <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">Students represented</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#e7ebf4]/70 p-5 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-6">
              <div className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">&lt;8 days</div>
              <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">Average time to a matched candidate</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-[#e7ebf4]/70 p-4 shadow-[0_24px_70px_rgba(26,47,66,0.10)] backdrop-blur-xl sm:p-6">
          <div className="relative grid grid-cols-2 rounded-full border border-gray-200 bg-gray-100/80 p-1">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`relative z-10 rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                !showLitestart ? 'pill-shimmer-red text-[#8e3935]' : 'text-gray-500 hover:text-gray-900'
              } ${clickPulse ? 'scale-95' : 'scale-100'}`}
            >
              Without Litestart
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`relative z-10 rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                showLitestart ? 'pill-shimmer-blue text-white' : 'text-gray-500 hover:text-gray-900'
              } ${clickPulse ? 'scale-95' : 'scale-100'}`}
            >
              With Litestart
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {comparisonItems.map((item) => {
              const isFading = contentPhase === 'fadeout';
              const isFadingIn = contentPhase === 'fadein';
              return (
                <div
                  key={item.number}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 sm:px-4 sm:py-4 ${
                    isFading
                      ? 'border-gray-200 bg-white text-transparent'
                      : showLitestart
                        ? 'border-[#b9dcf2] bg-[#e8f2fb] text-[#164d70]'
                        : 'border-[#f1c8c4] bg-[#fdf0ee] text-[#873f3a]'
                  } ${isFadingIn ? 'duration-500' : ''}`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/85 text-gray-700 shadow-sm sm:h-10 sm:w-10">
                    {showLitestart ? item.withIcon : item.withoutIcon}
                  </span>
                  <div className="min-w-0">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] opacity-60">
                      {showLitestart ? 'With Litestart' : 'Without Litestart'}
                    </span>
                    <p className="text-sm font-semibold leading-snug sm:text-base">
                      {showLitestart ? item.with : item.without}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
