'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useBoothSounds() {
  const [sfxOn] = useState(true);
  const audioCtxRef = useRef(null);
  const noiseBufferRef = useRef(null);

  const getCtx = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtxRef.current = new Ctx();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }, []);

  const getNoiseBuffer = useCallback((ctx) => {
    if (!ctx) return null;
    if (noiseBufferRef.current) return noiseBufferRef.current;
    const len = ctx.sampleRate * 0.5;
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = b.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    noiseBufferRef.current = b;
    return b;
  }, []);

  const envGain = useCallback((ctx, attack, decay, peak = 0.4) => {
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    return g;
  }, []);

  const playShutter = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const buf = getNoiseBuffer(ctx);
      if (!buf) return;
      const t = ctx.currentTime;

      // 1st curtain — sharp mechanical click
      const noise1 = ctx.createBufferSource();
      noise1.buffer = buf;
      const bp1 = ctx.createBiquadFilter();
      bp1.type = 'bandpass';
      bp1.frequency.value = 4500;
      bp1.Q.value = 1.5;
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(0.3, t + 0.002);
      g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      noise1.connect(bp1).connect(g1).connect(ctx.destination);
      noise1.start(t); noise1.stop(t + 0.04);

      // Mirror slap — brief low thump
      const slap = ctx.createOscillator();
      slap.type = 'sine';
      slap.frequency.setValueAtTime(120, t + 0.005);
      slap.frequency.exponentialRampToValueAtTime(40, t + 0.04);
      const sg = ctx.createGain();
      sg.gain.setValueAtTime(0, t + 0.005);
      sg.gain.linearRampToValueAtTime(0.15, t + 0.008);
      sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      slap.connect(sg).connect(ctx.destination);
      slap.start(t + 0.005); slap.stop(t + 0.08);

      // 2nd curtain — softer closing click
      const noise2 = ctx.createBufferSource();
      noise2.buffer = buf;
      const bp2 = ctx.createBiquadFilter();
      bp2.type = 'bandpass';
      bp2.frequency.value = 3800;
      bp2.Q.value = 1.2;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0, t + 0.06);
      g2.gain.linearRampToValueAtTime(0.18, t + 0.062);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      noise2.connect(bp2).connect(g2).connect(ctx.destination);
      noise2.start(t + 0.06); noise2.stop(t + 0.12);
    } catch (e) {}
  }, [getCtx, getNoiseBuffer]);

  const playHover = useCallback(() => {
    if (!sfxOn) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Soft warm chime — lower frequencies, very quiet
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(620, t);  // Eb5 — warm, not piercing
      o.frequency.exponentialRampToValueAtTime(780, t + 0.08); // gentle rise

      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.012, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.3);
    } catch (e) {}
  }, [sfxOn, getCtx]);

  const playClick = useCallback(() => {
    if (!sfxOn) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(1200, t);
      o.frequency.exponentialRampToValueAtTime(520, t + 0.08);
      const g = envGain(ctx, 0.002, 0.08, 0.08);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 0.12);
    } catch (e) {}
  }, [sfxOn, getCtx, envGain]);

  const playCountdownTick = useCallback(() => {
    if (!sfxOn) return;
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(660, t);
      const g = envGain(ctx, 0.002, 0.09, 0.09);
      o.connect(g).connect(ctx.destination);
      o.start(t); o.stop(t + 0.12);
    } catch (e) {}
  }, [sfxOn, getCtx, envGain]);

  const toggleSfx = useCallback(() => {
    setSfxOn(prev => {
      const next = !prev;
      if (next) {
        const ctx = getCtx();
        if (ctx) {
          // Play a small click on unlock
          const t = ctx.currentTime;
          const o = ctx.createOscillator();
          o.type = 'sine';
          o.frequency.setValueAtTime(1000, t);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.05, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          o.connect(g).connect(ctx.destination);
          o.start(t); o.stop(t + 0.1);
        }
      }
      return next;
    });
  }, [getCtx]);

  return {
    sfxOn,
    toggleSfx,
    playShutter,
    playHover,
    playClick,
    playCountdownTick
  };
}
