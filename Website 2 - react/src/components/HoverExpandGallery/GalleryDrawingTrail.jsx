import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import './GalleryDrawingTrail.css';

const MAX_POINTS = 34;
const MIN_DIST = 2.6;

const STRIP_SEL = '.hover-expand-strip';
const STROKE_LILAC = 'rgba(186, 164, 238, 0.62)';
const STROKE_ON_TILE = 'rgba(255, 255, 255, 0.82)';

/**
 * Canvas trail + light custom cursor while pointer moves inside the gallery section.
 * Inspired by Skiper UI skiper59 / Artemiy Lebedev-style drawing cursor (reimplemented).
 * https://skiper-ui.com/v1/skiper59
 */
export default function GalleryDrawingTrail({ sectionRef, enabled }) {
  const canvasRef = useRef(null);
  const pointsRef = useRef([]);
  const rafRef = useRef(0);
  const [inSection, setInSection] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const root = sectionRef?.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pts = pointsRef.current;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (pts.length < 2) return;
    ctx.lineWidth = 1.75;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      ctx.beginPath();
      ctx.strokeStyle = b.onTile ? STROKE_ON_TILE : STROKE_LILAC;
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }, [sectionRef]);

  const scheduleDraw = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = sectionRef?.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return undefined;

    const resize = () => {
      const rect = root.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      scheduleDraw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    const pushPoint = (clientX, clientY, onTile) => {
      const rect = root.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < -8 || y < -8 || x > rect.width + 8 || y > rect.height + 8) return;
      const pts = pointsRef.current;
      const last = pts[pts.length - 1];
      if (last && Math.hypot(x - last.x, y - last.y) < MIN_DIST) return;
      pts.push({ x, y, onTile });
      if (pts.length > MAX_POINTS) pts.shift();
      scheduleDraw();
    };

    const pointerInRoot = (clientX, clientY) => {
      const r = root.getBoundingClientRect();
      return (
        clientX >= r.left &&
        clientX <= r.right &&
        clientY >= r.top &&
        clientY <= r.bottom
      );
    };

    const onMove = e => {
      if (!pointerInRoot(e.clientX, e.clientY)) return;
      setCursor({ x: e.clientX, y: e.clientY });
      const t = e.target;
      const onTile =
        t instanceof Element && Boolean(t.closest(STRIP_SEL));
      pushPoint(e.clientX, e.clientY, onTile);
    };

    const onEnter = () => setInSection(true);
    const onLeave = () => {
      setInSection(false);
      pointsRef.current = [];
      scheduleDraw();
    };

    const opts = { passive: true, capture: true };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointermove', onMove, opts);
    window.addEventListener('resize', resize);

    return () => {
      ro.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointermove', onMove, opts);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [enabled, sectionRef, scheduleDraw]);

  if (!enabled) return null;

  return (
    <>
      <canvas ref={canvasRef} className="heg-drawing-canvas" aria-hidden />
      {inSection ? (
        <motion.div
          className="heg-drawing-cursor"
          aria-hidden
          initial={false}
          animate={{
            left: cursor.x - 4,
            top: cursor.y - 4,
          }}
          transition={{ type: 'spring', stiffness: 480, damping: 36, mass: 0.2 }}
        />
      ) : null}
    </>
  );
}
