import React, { useState } from 'react';

interface ComparisonItem {
  number: string;
  without: string;
  with: string;
}

const comparisonItems: ComparisonItem[] = [
  {
    number: '01',
    without: 'Post the Role, Wait Weeks',
    with: 'One Call, Matched in Days',
  },
  {
    number: '02',
    without: 'Hundreds of CVs, No Fit',
    with: 'One Shortlist, Already Vetted',
  },
  {
    number: '03',
    without: 'One Hire, Real Risk',
    with: 'Pre-Interviewed, Proven Fit',
  },
  {
    number: '04',
    without: 'Every Hire, Start From Scratch',
    with: 'One Partner, Hire On Demand',
  },
];

const ComparisonSection: React.FC = () => {
  const [showLitestart, setShowLitestart] = useState(true);

  return (
    <section className="relative overflow-hidden bg-[#f7f6f0] px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-24">
        <div>
          <div className="mb-10 max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Why LiteStart, why now</p>
            <h2 className="font-serif text-4xl leading-[1.05] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
              The shortcut to your next great hire.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg">
              Stop losing weeks to hiring admin. LiteStart helps you move from role to ready-to-start intern with less risk and more momentum.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-gray-200/80 bg-white/75 p-5 shadow-sm sm:p-6">
              <div className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">&lt;8 days</div>
              <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">Average time to a matched candidate</p>
            </div>
            <div className="rounded-2xl border border-gray-200/80 bg-white/75 p-5 shadow-sm sm:p-6">
              <div className="font-serif text-3xl tracking-tight text-gray-950 sm:text-4xl">1000+</div>
              <p className="mt-3 text-xs font-medium leading-relaxed text-gray-500 sm:text-sm">Students represented</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-gray-200/80 bg-white/80 p-4 shadow-[0_24px_70px_rgba(26,47,66,0.10)] backdrop-blur-xl sm:p-6">
          <div className="grid grid-cols-2 rounded-full border border-gray-200 bg-gray-100/80 p-1">
            <button
              type="button"
              onClick={() => setShowLitestart(false)}
              className={`rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                !showLitestart ? 'bg-[#f6d9d6] text-[#8e3935] shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Without Litestart
            </button>
            <button
              type="button"
              onClick={() => setShowLitestart(true)}
              className={`rounded-full px-3 py-3 text-xs font-semibold transition-all duration-300 sm:text-sm ${
                showLitestart ? 'bg-[#0765AD] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              With Litestart
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {comparisonItems.map((item) => (
              <div
                key={item.number}
                className={`flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 sm:px-4 sm:py-4 ${
                  showLitestart
                    ? 'border-[#b9dcf2] bg-[#e8f2fb] text-[#164d70]'
                    : 'border-[#f1c8c4] bg-[#fdf0ee] text-[#873f3a]'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/85 font-serif text-sm text-gray-700 shadow-sm sm:h-10 sm:w-10">
                  {item.number}
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
