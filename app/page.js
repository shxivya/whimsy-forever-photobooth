'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Music, Music2, Ribbon } from 'lucide-react';
import { useBoothSounds } from '@/hooks/use-booth-sounds';
import { FILTERS } from '@/lib/booth-config';
import { SparklesField, FloatingStrip, Logo } from '@/components/ui/Decorations';
import { PhotoBooth } from '@/components/booth/BoothComponents';

export default function App() {
  const [boothOpen, setBoothOpen] = useState(false);
  const sounds = useBoothSounds();
  const howItWorksRef = useRef(null);
  const filterRef = useRef(null);

  const openBooth = () => {
    setBoothOpen(true);
    sounds.playClick();
  };

  return (
    <main className="paper-texture relative min-h-screen overflow-x-hidden">
      {/* Mobile gate */}
      <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fffaf5] px-8 text-center md:hidden">
        <div className="text-5xl mb-6">🎀</div>
        <div className="font-script text-3xl text-[#c94b5d]">whimsy forever</div>
        <p className="mt-4 max-w-xs font-cormorant text-lg italic text-[#7b5b52]">
          this dreamy little photobooth is best experienced on a bigger screen ✧
        </p>
        <p className="mt-2 font-hand text-sm text-[#7b5b52]/60">
          come back on your laptop or desktop — we'll be here, waiting with sparkles ♡
        </p>
      </div>

      <div className="light-leak pointer-events-none fixed inset-0 z-[1]" />
      <SparklesField count={26} />

      <header className="relative z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-[#7b5b52] md:flex">
            <button onClick={() => howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#c94b5d] transition-colors">how it works</button>
            <button onClick={() => filterRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#c94b5d] transition-colors">filters</button>
            <button onClick={openBooth} className="hover:text-[#c94b5d] transition-colors">the booth</button>
            <a href="/about" className="hover:text-[#c94b5d] transition-colors">about</a>
          </nav>
        </div>
      </header>

      <Hero onEnter={openBooth} sounds={sounds} />
      <HowItWorks innerRef={howItWorksRef} />
      <FilterShowcase innerRef={filterRef} onEnter={openBooth} sounds={sounds} />
      <FinalCTA onEnter={openBooth} sounds={sounds} />

      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-14 pt-6 text-center">
        <div className="font-script text-2xl text-[#c94b5d] sm:text-3xl">made with soft hands &amp; sparkly hearts ✦</div>
        <div className="mt-2 font-hand text-base text-[#7b5b52]/80 sm:text-lg">keep a little piece of everything you love.</div>
      </footer>

      <AnimatePresence>
        {boothOpen && <PhotoBooth onClose={() => setBoothOpen(false)} sounds={sounds} />}
      </AnimatePresence>
    </main>
  );
}

function Hero({ onEnter, sounds }) {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-5 pb-16 pt-2 sm:pb-20 sm:pt-8 md:pt-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingStrip top="4%" left="3%" rotate={-8} delay={0} caption="golden days ✧" imgs={[
          '/assets/2.JPG',
          '/assets/1.PNG',
          '/assets/4.PNG',
        ]} />
        <FloatingStrip top="12%" right="3%" rotate={7} delay={0.8} caption="dreamy things ♡" imgs={[
          '/assets/5.PNG',
          '/assets/3.PNG',
          '/assets/6.jpg',
        ]} />
      </div>

      <div className="relative mx-auto mt-10 max-w-3xl text-center sm:mt-20 md:mt-24">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#c94b5d]/20 bg-[#fffaf5]/70 px-3 py-1 text-xs text-[#7b5b52] backdrop-blur sm:px-4">
          <Sparkles className="h-3 w-3 text-[#c94b5d]" />
          <span className="font-hand text-lg sm:text-xl">a dreamy little photobooth, est. forever</span>
        </div>

        <h1 className="font-serif-display text-[2.1rem] leading-[1.08] text-[#7b5b52] sm:text-[2.8rem] md:text-[4.2rem] md:leading-[1.05]">
          turn your memories
          <br />
          into <span className="font-script text-[#c94b5d]">whimsy forever</span>
          <span className="ml-1 text-[#c94b5d]">✧</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl px-2 font-cormorant text-lg italic text-[#7b5b52] sm:text-2xl md:mt-6 md:text-3xl">
          for souls who romanticize everything — a photobooth where digital memories wear analog hearts.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
          <button
            onClick={() => { onEnter(); sounds.playClick(); }}
            onMouseEnter={sounds.playHover}
            className="btn-vintage group relative w-full overflow-hidden rounded-full px-8 py-4 font-cormorant text-lg tracking-wide sm:w-auto sm:px-9 sm:text-xl"
          >
            <span className="relative z-10">enter the booth ✧</span>
            <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30" style={{ animation: 'shineSweep 2.4s ease-in-out infinite' }} />
          </button>
          <a href="#filters" className="font-hand text-base text-[#7b5b52] underline decoration-[#c94b5d]/40 underline-offset-4 hover:text-[#c94b5d] sm:text-lg transition-colors">peek at the filters →</a>
        </div>
      </div>

      <div className="pointer-events-none mt-12 flex justify-center sm:mt-16">
        <Ribbon className="h-6 w-6 text-[#c94b5d]/50 sm:h-7 sm:w-7" />
      </div>
    </section>
  );
}

function HowItWorks({ innerRef }) {
  const steps = [
    { title: 'strike a pose', desc: 'flirty, giggly, glittering — let the camera fall in love.', icon: '💋' },
    { title: 'pick a vibe', desc: 'first kiss, soft noir, digicam pro..', icon: '✨' },
    { title: 'decorate your memories', desc: 'bows, cherries, little notes..', icon: '🎀' },
    { title: 'download forever', desc: 'a tiny photostrip you can keep, tape, or tuck away.', icon: '💌' },
  ];
  return (
    <section ref={innerRef} className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="mb-10 text-center sm:mb-14">
        <div className="font-hand text-lg text-[#c94b5d] sm:text-xl">a little ritual ✦</div>
        <h2 className="font-serif-display text-3xl text-[#7b5b52] sm:text-4xl md:text-5xl">how the booth whispers</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            whileHover={{ y: -6, rotate: 0 }}
            className="polaroid relative mx-auto max-w-[280px] sm:max-w-none"
            style={{ transform: `rotate(${[-2, 1.5, -1.8, 2.2][i]}deg)` }}
          >
            <div className="tape" style={{ top: -10, left: '50%', transform: 'translateX(-50%) rotate(-3deg)' }} />
            <div className="flex aspect-[4/3] items-center justify-center rounded-sm bg-gradient-to-br from-[#f8dce3] via-[#fffaf5] to-[#efe3ff] text-5xl sm:text-6xl">
              {s.icon}
            </div>
            <div className="mt-3 px-1">
              <div className="font-hand text-sm text-[#c94b5d]">step {i + 1}</div>
              <div className="font-cormorant text-xl font-semibold text-[#7b5b52] sm:text-2xl">{s.title}</div>
              <div className="mt-1 text-sm leading-relaxed text-[#7b5b52]/75">{s.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FilterShowcase({ innerRef, onEnter, sounds }) {
  const sampleImg = '/assets/7.JPG';
  return (
    <section ref={innerRef} id="filters" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="mb-10 text-center sm:mb-14">
        <div className="font-hand text-lg text-[#c94b5d] sm:text-xl">dress your memories ✦</div>
        <h2 className="font-serif-display text-3xl text-[#7b5b52] sm:text-4xl md:text-5xl">choose a feeling, not a filter</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {FILTERS.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -6, rotate: i % 2 ? 1.2 : -1.2 }}
            className="polaroid group relative cursor-pointer"
            onClick={onEnter}
            onMouseEnter={sounds.playHover}
          >
            <div className="relative aspect-square overflow-hidden rounded-sm bg-[#f5e6dc]">
              <img src={sampleImg} alt={f.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" style={{ filter: f.css }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: f.tint, mixBlendMode: 'screen' }} />
            </div>
            <div className="mt-3 text-center">
              <div className="font-cormorant text-lg font-semibold italic text-[#c94b5d]">{f.name}</div>
              <div className="font-hand text-sm text-[#7b5b52]/80">{f.note}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA({ onEnter, sounds }) {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[32px] border border-[#c94b5d]/15 bg-[#fffaf5]/80 p-8 text-center shadow-[0_20px_60px_rgba(123,91,82,0.15)] backdrop-blur sm:p-14"
      >
        <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: 'radial-gradient(ellipse at top, rgba(248,220,227,0.7), transparent 65%), radial-gradient(ellipse at bottom right, rgba(239,227,255,0.55), transparent 60%)' }} />
        <div className="tape" style={{ top: -10, left: '18%', transform: 'rotate(-6deg)' }} />
        <div className="tape" style={{ top: -10, right: '18%', transform: 'rotate(7deg)' }} />

        <div className="relative">
          <div className="font-hand text-lg text-[#c94b5d] sm:text-xl">one more moment ✦</div>
          <h2 className="mt-2 font-serif-display text-3xl leading-tight text-[#7b5b52] sm:text-5xl">
            it&apos;s okay to want to <span className="font-script text-[#c94b5d]">keep</span> it.
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-cormorant text-lg italic text-[#7b5b52] sm:text-2xl">
            step inside, strike a pose — four little photos, a caption only you understand, yours to hold forever.
          </p>
          <button
            onClick={() => { onEnter(); sounds.playClick(); }}
            onMouseEnter={sounds.playHover}
            className="btn-vintage relative mt-8 overflow-hidden rounded-full px-8 py-4 font-cormorant text-lg sm:text-xl"
          >
            <span className="relative z-10">enter the booth ✧</span>
            <span className="absolute inset-y-0 left-0 w-1/3 bg-white/30" style={{ animation: 'shineSweep 2.4s ease-in-out infinite' }} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
