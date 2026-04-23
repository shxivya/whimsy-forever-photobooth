'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, RotateCcw, Download, Loader2 } from 'lucide-react';
import { FILTERS, STICKERS } from '@/lib/booth-config';
import { snapOne, composeStrip } from '@/lib/canvas-utils';

export function PhotoBooth({ onClose, sounds }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const previewRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [filter, setFilter] = useState(FILTERS[0]);
  const [photos, setPhotos] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [flashing, setFlashing] = useState(false);
  const [stage, setStage] = useState('booth');
  const [caption, setCaption] = useState('');
  const [stickers, setStickers] = useState([]);
  const [developing, setDeveloping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, 
          audio: false 
        });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setReady(true);
      } catch (e) {
        setPermissionError(e.message || 'camera permission denied');
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const runSequence = async () => {
    if (!ready || capturing) return;
    setCapturing(true);
    setPhotos([]);
    const collected = [];
    for (let i = 0; i < 4; i++) {
      for (let c = 3; c > 0; c--) {
        setCountdown(c);
        sounds.playCountdownTick();
        await wait(700);
      }
      setCountdown(0);
      setFlashing(true);
      sounds.playShutter();
      await wait(120);
      const data = await snapOne({ videoRef, filter });
      await wait(280);
      setFlashing(false);
      if (data) {
        collected.push(data);
        setPhotos([...collected]);
      }
      await wait(450);
    }
    setCapturing(false);
    setDeveloping(true);
    await wait(1200);
    setDeveloping(false);
    setStage('strip');
  };

  const addSticker = (emoji) => {
    setStickers(prev => [...prev, { 
      id: Math.random().toString(36).slice(2), 
      emoji, 
      x: 100 + Math.random() * 100, 
      y: 200 + Math.random() * 200 
    }]);
  };

  const updateStickerPos = (id, info) => {
    setStickers(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, x: s.x + info.offset.x, y: s.y + info.offset.y };
      }
      return s;
    }));
  };

  const download = async () => {
    const data = await composeStrip({ photos, caption, stickers, previewRef });
    const a = document.createElement('a');
    a.href = data;
    a.download = `whimsy-forever-${Date.now()}.png`;
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col overflow-auto bg-[#1a0f10]/75 backdrop-blur-md"
    >
      <div className="light-leak pointer-events-none fixed inset-0" />

      <div className="relative flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center gap-2 text-[#fffaf5]">
          <Camera className="h-5 w-5" />
          <span className="font-script text-xl sm:text-2xl">the booth</span>
        </div>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#fffaf5]/90 text-[#7b5b52] hover:bg-[#fffaf5]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 pb-10 sm:gap-6 sm:px-5 lg:grid-cols-[1.25fr_1fr] items-center min-h-[calc(100vh-80px)]">
        <div className="flex justify-center">
          {stage === 'booth' ? (
            <div className="relative w-full max-w-[600px] overflow-hidden rounded-[22px] border-[8px] border-[#fffaf5] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.4)] sm:rounded-[28px] sm:border-[14px]">
              <div className="relative aspect-square w-full overflow-hidden">
                {permissionError ? (
                  <div className="flex h-full items-center justify-center bg-[#2a1818] p-8 text-center text-[#fffaf5]">
                    <div>
                      <p className="font-cormorant text-2xl">oh no — we need camera access</p>
                      <p className="mt-2 text-sm text-[#fffaf5]/70">please allow webcam permission and refresh.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} playsInline muted autoPlay
                      className="h-full w-full object-cover"
                      style={{ transform: 'scaleX(-1)', filter: filter.css }} />
                    <div className="pointer-events-none absolute inset-0" style={{ background: filter.tint, mixBlendMode: 'screen' }} />
                    
                    {countdown > 0 && (
                      <motion.div key={countdown}
                        initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 grid place-items-center font-serif-display text-[180px] text-[#fffaf5] drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]">
                        {countdown}
                      </motion.div>
                    )}

                    {flashing && <div className="flash-screen absolute inset-0 bg-white" />}
                    {developing && (
                      <div className="absolute inset-0 grid place-items-center bg-[#1a0f10]/90">
                        <div className="text-center text-[#fffaf5]">
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#f8dce3]" />
                          <p className="mt-3 font-script text-2xl">developing your memory...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2 bg-[#fffaf5] p-3">
                {[0,1,2,3].map(i => (
                  <div key={i} className="relative h-16 w-16 flex-1 overflow-hidden rounded-md bg-[#f5e6dc]">
                    {photos[i] ? (
                      <img src={photos[i]} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-hand text-xs text-[#7b5b52]/50">{i + 1}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <StripPreview
              previewRef={previewRef}
              photos={photos}
              caption={caption}
              stickers={stickers} 
              setStickers={setStickers}
              onStickerDragEnd={updateStickerPos}
            />
          )}
        </div>

        <div className="relative rounded-3xl border border-[#fffaf5]/20 bg-[#fffaf5]/95 p-4 shadow-2xl sm:p-5">
          {stage === 'booth' ? (
            <BoothControls
              filter={filter} setFilter={setFilter}
              onCapture={runSequence}
              capturing={capturing}
              ready={ready && !permissionError}
              sounds={sounds}
            />
          ) : (
            <StripControls
              caption={caption} setCaption={setCaption}
              onAddSticker={addSticker}
              onRetake={() => { setPhotos([]); setStage('booth'); setStickers([]); setCaption(''); }}
              onDownload={download}
              sounds={sounds}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BoothControls({ filter, setFilter, onCapture, capturing, ready, sounds }) {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Label>pick your vibe</Label>
        <div className="grid grid-cols-2 gap-2">
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => { setFilter(f); sounds.playClick(); }} onMouseEnter={sounds.playHover}
              className={`rounded-xl border p-2 text-left text-xs transition ${filter.id === f.id ? 'border-[#c94b5d] bg-[#f8dce3]' : 'border-[#7b5b52]/15 bg-[#fffaf5] hover:border-[#c94b5d]/40'}`}>
              <span className="block font-cormorant text-sm italic text-[#c94b5d]">{f.name}</span>
              <span className="block text-[10px] text-[#7b5b52]/70">{f.note}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button onClick={onCapture} disabled={!ready || capturing}
          onMouseEnter={sounds.playHover}
          className="btn-vintage flex w-full items-center justify-center gap-2 rounded-full py-4 font-cormorant text-xl disabled:opacity-60">
          {capturing ? <><Loader2 className="h-4 w-4 animate-spin" /> capturing...</> : <><Camera className="h-5 w-5" /> capture 4 photos ✧</>}
        </button>
        <p className="mt-3 text-center font-hand text-sm text-[#7b5b52]/70">smile — you&apos;re becoming a memory ♡</p>
      </div>
    </div>
  );
}

function StripControls({ caption, setCaption, onAddSticker, onRetake, onDownload, sounds }) {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <Label>your little caption</Label>
        <input value={caption} onChange={e => setCaption(e.target.value)} maxLength={80}
          placeholder="write something tender..."
          className="w-full rounded-xl border border-[#7b5b52]/20 bg-[#fffaf5] px-3 py-3 font-hand text-lg text-[#7b5b52] placeholder:text-[#7b5b52]/40 focus:outline-none" />
      </div>

      <div>
        <Label>sprinkle stickers</Label>
        <div className="grid max-h-52 grid-cols-6 gap-1.5 overflow-y-auto rounded-2xl border border-[#7b5b52]/10 bg-[#fffaf5]/70 p-2 sm:grid-cols-8">
          {STICKERS.map(s => (
            <button key={s} onClick={() => { onAddSticker(s); sounds.playClick(); }} onMouseEnter={sounds.playHover}
              className="sticker-wobble grid aspect-square place-items-center rounded-xl bg-[#fffaf5] text-2xl transition hover:bg-[#f8dce3] active:scale-90">
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2 font-hand text-xs text-[#7b5b52]/70">tap a sticker — then drag it on the strip ♡</p>
      </div>

      <div className="flex gap-2">
        <button onClick={onRetake} onMouseEnter={sounds.playHover}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#7b5b52]/20 bg-[#fffaf5] py-3 text-sm text-[#7b5b52] hover:bg-[#f8dce3]">
          <RotateCcw className="h-4 w-4" /> retake
        </button>
        <button onClick={onDownload} onMouseEnter={sounds.playHover}
          className="btn-vintage flex flex-[1.4] items-center justify-center gap-2 rounded-full py-3 text-sm sm:text-base">
          <Download className="h-4 w-4" /> download forever
        </button>
      </div>
    </div>
  );
}

function StripPreview({ photos, caption, stickers, setStickers, previewRef, onStickerDragEnd }) {
  return (
    <div className="relative mx-auto w-[clamp(240px,20vh,380px)] developing" ref={previewRef}>
      <div className="string-line" style={{ height: 40 }} />
      <div className="relative rounded-md bg-[#fffaf5] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="tape" style={{ top: -12, left: '50%', transform: 'translateX(-50%) rotate(-4deg)' }} />
        <div className="mb-3 text-center">
          <div className="font-script text-xl sm:text-2xl text-[#c94b5d]">whimsy forever</div>
          <div className="font-hand text-[10px] sm:text-xs text-[#7b5b52]/70">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}  ✦  forever</div>
        </div>
        <div className="relative space-y-1.5 sm:space-y-2">
          {photos.map((p, i) => (
            <img key={i} src={p} alt="" className="aspect-square w-full rounded-sm object-cover" />
          ))}

          {stickers.map(s => (
            <motion.div
              key={s.id}
              data-sticker-id={s.id}
              drag
              dragMomentum={false}
              onDragEnd={(e, info) => onStickerDragEnd(s.id, info)}
              initial={{ x: s.x, y: s.y, scale: 0.6, opacity: 0 }}
              animate={{ x: s.x, y: s.y, scale: 1, opacity: 1 }}
              className="absolute cursor-grab text-3xl sm:text-4xl active:cursor-grabbing"
              style={{ left: 0, top: 0 }}
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              onDoubleClick={() => setStickers(prev => prev.filter(x => x.id !== s.id))}
            >
              {s.emoji}
            </motion.div>
          ))}
        </div>
        <div className="mt-3 border-t border-dashed border-[#7b5b52]/20 pt-2 text-center">
          <div className="font-hand text-base sm:text-lg text-[#7b5b52] min-h-[28px]">{caption || '...'}</div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }) {
  return <div className="mb-2 font-hand text-base text-[#c94b5d]">{children}</div>;
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
