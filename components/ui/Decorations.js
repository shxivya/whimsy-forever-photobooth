'use client';

import { Camera, Sparkles, Ribbon } from 'lucide-react';

export function SparkleIcon({ x, y, size = 14, delay = 0, color = '#c94b5d' }) {
  return (
    <svg
      className="sparkle pointer-events-none absolute"
      style={{ left: x, top: y, width: size, height: size, animationDelay: `${delay}s`, color }}
      viewBox="0 0 24 24" fill="currentColor" aria-hidden
    >
      <path d="M12 0 L14 9 L24 12 L14 15 L12 24 L10 15 L0 12 L10 9 Z" />
    </svg>
  );
}

export function SparklesField({ count = 22 }) {
  const items = Array.from({ length: count }).map((_, i) => ({
    x: `${(i * 53 + 7) % 100}%`,
    y: `${(i * 37 + 11) % 100}%`,
    d: (i * 0.37) % 3,
    s: 8 + ((i * 7) % 14),
    c: ['#c94b5d', '#efe3ff', '#f5a6c2', '#fff0c9'][i % 4],
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      {items.map((p, i) => (
        <SparkleIcon key={i} x={p.x} y={p.y} size={p.s} delay={p.d} color={p.c} />
      ))}
    </div>
  );
}

export function FloatingStrip({ top, left, right, rotate = 0, delay = 0, imgs, caption = 'whimsy forever ✧' }) {
  return (
    <div
      className="pointer-events-none absolute hidden md:block"
      style={{ top, left, right, transform: `rotate(${rotate}deg)` }}
    >
      <div className="string-line" style={{ height: 34 }} />
      <div className="sway" style={{ animationDelay: `${delay}s` }}>
        <div className="relative rounded-sm bg-[#fffaf5] p-2 shadow-[0_10px_30px_rgba(123,91,82,0.18)]">
          <div className="tape" style={{ top: -10, left: '50%', transform: 'translateX(-50%) rotate(-4deg)' }} />
          {imgs.map((src, i) => (
            <div key={i} className="relative mb-2 h-32 w-36 overflow-hidden bg-[#f5e6dc] last:mb-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" style={{ filter: 'sepia(0.15) saturate(1.1) contrast(1.02)' }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 0 0, rgba(255,180,160,0.3), transparent 60%)' }} />
            </div>
          ))}
          <div className="mt-1 text-center font-hand text-xs text-[#7b5b52]/80">{caption}</div>
        </div>
      </div>
    </div>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-[#c94b5d] text-[#fffaf5] shadow-md sm:h-9 sm:w-9">
        <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </div>
      <span className="font-script text-xl text-[#c94b5d] sm:text-2xl">whimsy forever photobooth</span>
    </div>
  );
}
