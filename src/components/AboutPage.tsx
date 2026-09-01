import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutPage: React.FC = () => {
  const isPreviewRoute = window.location.pathname.startsWith('/preview');
  const homePath = isPreviewRoute ? '/preview' : '/';

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-white">
      <Header showAuthButtons={isPreviewRoute} homePath={homePath} />

      <main className="px-4 pb-8 pt-28 sm:px-6 sm:pt-36 lg:px-8">
        <section className="mx-auto max-w-7xl rounded-[2rem] bg-[#171817] p-5 shadow-[0_30px_90px_rgba(23,24,23,0.18)] sm:p-8 lg:p-12">
          <div className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            <div className="overflow-hidden rounded-[1.5rem] bg-[#2a2b29]">
              <img
                src="/assets/images/image copy 2.png"
                alt="The Litestart founders"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center py-2 lg:py-6">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">A letter from the founders</p>
              <h1 className="max-w-xl font-serif text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Built from both sides of the hiring table.
              </h1>
              <div className="mt-8 space-y-6 text-base leading-relaxed text-white/78 sm:text-lg">
                <p>
                  We&apos;re Reece and Scott. We&apos;ve been on both sides of hiring — screening hundreds of applicants, and sending hundreds of applications ourselves. We saw a process that felt stuck in the past, so we started Litestart to make it work better.
                </p>
                <p>
                  We saw how much time disappears into screening. Great people get lost in the pile while candidates spend weeks adjusting CVs and writing applications for roles they may never hear back from. The conversations at the end are what matter. Everything before that should help you get there, not stand in the way.
                </p>
                <p>
                  The problem is the same on both sides: too much time spent on the wrong things. Businesses need fast, reliable access to the right people. Candidates need meaningful opportunities that actually reach them. We built Litestart to bring those two needs together.
                </p>
                <p>
                  We handle the sourcing, screening, and matching so businesses don&apos;t have to. But we don&apos;t think technology should replace the human side of hiring. It should clear the way for it — the judgement, the relationships, and the context that only people can bring.
                </p>
                <p>Thanks for being here.</p>
                <p className="font-serif text-xl italic text-white">Reece &amp; Scott</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
