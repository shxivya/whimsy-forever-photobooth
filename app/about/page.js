'use client';

import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="paper-texture relative min-h-screen overflow-x-hidden">
      <div className="light-leak pointer-events-none fixed inset-0 z-[1]" />

      <header className="relative z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-5 sm:py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-[#c94b5d] text-[#fffaf5] shadow-md sm:h-9 sm:w-9">
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <span className="font-script text-xl text-[#c94b5d] sm:text-2xl">whimsy forever photobooth</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-[#7b5b52]/20 bg-[#fffaf5]/70 px-4 py-2 text-sm text-[#7b5b52] backdrop-blur transition-colors hover:bg-[#f8dce3] hover:text-[#c94b5d]"
          >
            <ArrowLeft className="h-4 w-4" />
            back home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-3xl px-5 pb-20 pt-8 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#c94b5d]/20 bg-[#fffaf5]/70 px-4 py-1.5 text-xs text-[#7b5b52] backdrop-blur">
            <Heart className="h-3 w-3 text-[#c94b5d]" />
            <span className="font-hand text-lg">a little note</span>
          </div>
          <h1 className="font-serif-display text-4xl leading-tight text-[#7b5b52] sm:text-5xl md:text-6xl">
            about <span className="font-script text-[#c94b5d]">whimsy forever</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-12 space-y-8"
        >
          <div className="relative overflow-hidden rounded-[28px] border border-[#c94b5d]/10 bg-[#fffaf5]/80 p-8 shadow-[0_20px_60px_rgba(123,91,82,0.1)] backdrop-blur sm:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: 'radial-gradient(ellipse at top left, rgba(248,220,227,0.6), transparent 60%)' }} />
            <div className="relative space-y-6 font-cormorant text-lg italic leading-relaxed text-[#7b5b52] sm:text-xl">
              <p>
                i made this website because i thought it would be cute.
              </p>
              <p>
                that’s honestly it.
              </p>
              <p>
                i wanted to create a tiny dreamy photobooth where people could take silly little pictures and keep silly little memories.
              </p>
              <p>
                the world needs more whimsy sometimes ♡
              </p>
            </div>
          </div>
        </motion.div>

        <div
          className="mt-16 text-center"
        >
          <p className="mt-4 font-hand text-xl text-[#7b5b52]/70">
            go make some whimsy forever memories ♡
          </p>
        </div>
      </section>
    </main>
  );
}
