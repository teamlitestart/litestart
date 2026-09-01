import React from 'react';
import Header from './Header';
import Footer from './Footer';

const AboutPage: React.FC = () => {
  const isPreviewRoute = window.location.pathname.startsWith('/preview');
  const homePath = isPreviewRoute ? '/preview' : '/';

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-white">
      <Header showAuthButtons={isPreviewRoute} homePath={homePath} />

      <main className="px-4 pb-40 pt-28 sm:px-6 sm:pb-52 sm:pt-36 lg:px-8">
        <section className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-[#e7ebf4]/70 p-5 shadow-lg shadow-black/5 backdrop-blur-xl sm:p-8 lg:p-12">
          <div className="flex flex-col items-center">
            <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-[2rem] bg-white/40">
                <img
                  src="/assets/images/founder-1.jpg"
                  alt="Scott, Litestart co-founder"
                  className="aspect-square w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] bg-white/40">
                <img
                  src="/assets/images/founder-2.png"
                  alt="Reece, Litestart co-founder"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-10 max-w-2xl py-2">
              <p className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-gray-950/55">A letter from the founders</p>
              <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
                Built from both sides of the hiring table.
              </h1>
              <div className="mt-8 space-y-8 text-lg leading-relaxed text-gray-800 sm:text-xl">
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
                <p className="font-serif text-2xl italic text-gray-950">Reece &amp; Scott</p>
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
