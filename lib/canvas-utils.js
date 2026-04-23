export async function snapOne({ videoRef, filter }) {
  const video = videoRef.current;
  if (!video || !video.videoWidth) return null;
  
  const canvas = document.createElement('canvas');
  const W = 720, H = 720;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  
  const vw = video.videoWidth, vh = video.videoHeight;
  const side = Math.min(vw, vh);
  const sx = (vw - side) / 2, sy = (vh - side) / 2;
  
  ctx.save();
  ctx.translate(W, 0); 
  ctx.scale(-1, 1);
  ctx.filter = filter.css;
  ctx.drawImage(video, sx, sy, side, side, 0, 0, W, H);
  ctx.restore();
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = filter.tint;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
  
  // Subtler Grain
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * W, y = Math.random() * H;
    const a = Math.random() * 0.04;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(255,250,240,${a})` : `rgba(60,50,50,${a})`;
    ctx.fillRect(x, y, 1, 1);
  }
  
  // Soft Bloom / Glow
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.filter = 'blur(20px) brightness(1.2)';
  ctx.globalAlpha = 0.15;
  ctx.drawImage(canvas, 0, 0);
  ctx.restore();
  
  // Light leak
  const g = ctx.createRadialGradient(W * 0.05, H * 0.15, 10, W * 0.05, H * 0.15, W * 0.8);
  g.addColorStop(0, 'rgba(255,180,160,0.35)');
  g.addColorStop(1, 'rgba(255,180,160,0)');
  ctx.fillStyle = g; 
  ctx.globalCompositeOperation = 'screen'; 
  ctx.fillRect(0, 0, W, H);
  ctx.globalCompositeOperation = 'source-over';
  
  return canvas.toDataURL('image/jpeg', 0.92);
}
// Preload fonts for canvas rendering
let fontsLoaded = false;
async function ensureCanvasFonts() {
  if (fontsLoaded) return;
  try {
    const parisienne = new FontFace(
      'Parisienne',
      'url(/fonts/Parisienne-Regular.ttf)'
    );
    const caveat = new FontFace(
      'Caveat',
      'url(/fonts/Caveat-VariableFont_wght.ttf)'
    );
    const [f1, f2] = await Promise.all([parisienne.load(), caveat.load()]);
    document.fonts.add(f1);
    document.fonts.add(f2);
    fontsLoaded = true;
  } catch (e) {
    console.warn('Font preload failed, using fallbacks', e);
  }
}

export async function composeStrip({ photos, caption, stickers, previewRef }) {
  await ensureCanvasFonts();
  const W = 600;
  const photoH = 540;
  const pad = 24;
  const headerH = 120;
  const footerH = 100;
  const gap = 12;
  const H = headerH + (photoH + gap) * photos.length - gap + footerH + pad * 2;
  
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#fffaf5';
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, H);
  grad.addColorStop(0, 'rgba(248,220,227,0.35)');
  grad.addColorStop(1, 'rgba(255,250,245,0)');
  ctx.fillStyle = grad; 
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.fillStyle = '#c94b5d';
  ctx.textAlign = 'center';
  ctx.font = 'italic 44px "Parisienne", cursive';
  ctx.fillText('whimsy forever', W/2, 65);
  ctx.fillStyle = '#7b5b52';
  ctx.font = '22px "Caveat", cursive';
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  ctx.fillText(`${dateStr}  \u2726  forever`, W/2, 95);

  // Photos
  let y = headerH + pad;
  const photoW = W - pad * 2;
  for (const p of photos) {
    await new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, pad, y, photoW, photoH);
        resolve();
      };
      img.onerror = resolve;
      img.src = p;
    });
    y += photoH + gap;
  }

  // Footer
  if (caption) {
    ctx.fillStyle = '#7b5b52';
    ctx.font = '36px "Caveat", cursive';
    ctx.fillText(caption, W/2, H - 60);
  }
  ctx.fillStyle = '#c94b5d';
  ctx.font = '20px "Caveat", cursive';
  ctx.fillText('made with whimsy forever photobooth \u2726', W/2, H - 28);

  // Stickers - read actual DOM positions relative to the preview container
  if (previewRef?.current && stickers.length > 0) {
    const previewRect = previewRef.current.getBoundingClientRect();
    const scaleX = W / previewRect.width;
    const scaleY = H / previewRect.height;
    
    ctx.font = '52px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Find all sticker elements inside the preview
    const stickerEls = previewRef.current.querySelectorAll('[data-sticker-id]');
    stickerEls.forEach(el => {
      const stickerRect = el.getBoundingClientRect();
      // Get center of sticker relative to the preview container
      const relX = (stickerRect.left + stickerRect.width / 2) - previewRect.left;
      const relY = (stickerRect.top + stickerRect.height / 2) - previewRect.top;
      // Scale to canvas coordinates
      const cx = relX * scaleX;
      const cy = relY * scaleY;
      ctx.fillText(el.textContent, cx, cy);
    });
  }

  return canvas.toDataURL('image/png');
}
