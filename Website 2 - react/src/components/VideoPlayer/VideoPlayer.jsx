import { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import './VideoPlayer.css';

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE   = 34;
const MAG    = 50;
const DIST   = 120;

const QUALITIES = ['Auto', '1080p', '720p', '480p', '360p'];

/* ── Magnified dock button ── */
function DockBtn({ mouseX, label, children, onClick, active = false, tipAlign = 'center' }) {
  const ref = useRef(null);

  const mouseDistance = useTransform(mouseX, val => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE };
    return val - rect.x - BASE / 2;
  });
  const targetSize = useTransform(mouseDistance, [-DIST, 0, DIST], [BASE, MAG, BASE]);
  const size = useSpring(targetSize, SPRING);
  const [hovered, setHovered] = useState(false);

  const tipStyle =
    tipAlign === 'right'  ? { right: 0, left: 'auto', transform: 'none' } :
    tipAlign === 'left'   ? { left: 0, transform: 'none' } :
    {};

  return (
    <motion.button
      ref={ref}
      className={`vp-btn ${active ? 'vp-btn--active' : ''}`}
      style={{ width: size, height: size }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      aria-label={label}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="vp-tooltip"
            style={tipStyle}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Icons ── */
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M8 5.14v14l11-7-11-7z"/>
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);
const IconVolume = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
  </svg>
);
const IconMute = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17 18.73l2 2L20.27 19 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
  </svg>
);
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.477.477 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.47.47 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z"/>
  </svg>
);
const IconFullscreen = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </svg>
);
const IconExitFullscreen = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
  </svg>
);

function assetUrl(path) {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}

/* ── Main VideoPlayer ── */
export default function VideoPlayer({
  src,
  className = '',
  placeholder = false,
  placeholderSrc,
  /** Click/tap anywhere on the video or photo surface toggles play/pause (HUD chrome still uses its own handlers). */
  tapToTogglePlay = true,
}) {
  const videoRef     = useRef(null);
  const containerRef = useRef(null);
  const mouseX       = useMotionValue(Infinity);

  const [playing,    setPlaying]    = useState(() => !placeholder);
  const [muted,      setMuted]      = useState(true);
  const [volume,     setVolume]     = useState(1);
  const [progress,   setProgress]   = useState(0);
  const [hover,      setHover]      = useState(false);
  const [quality,    setQuality]    = useState('Auto');
  const [showVol,    setShowVol]    = useState(false);
  const [showQual,   setShowQual]   = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [duration,   setDuration]   = useState(0);
  const [current,    setCurrent]    = useState(0);

  const hideTimer = useRef(null);

  const resetHideTimer = useCallback(() => {
    setHover(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setHover(false), 2500);
  }, []);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  /* Fullscreen change listener */
  useEffect(() => {
    const onFSChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  const togglePlay = useCallback(() => {
    if (placeholder) {
      setPlaying(p => !p);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, [placeholder]);

  const toggleMute = useCallback(() => {
    if (placeholder) {
      setMuted(m => !m);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, [placeholder]);

  const setVol = useCallback((val) => {
    const vol = Math.max(0, Math.min(1, val));
    if (placeholder) {
      setVolume(vol);
      setMuted(vol === 0);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    v.volume = vol;
    v.muted  = vol === 0;
    setVolume(vol);
    setMuted(vol === 0);
  }, [placeholder]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!document.fullscreenElement) el?.requestFullscreen();
    else document.exitFullscreen();
  }, []);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrent(v.currentTime);
    setProgress(v.currentTime / v.duration);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration ?? 0);
  }, []);

  const scrub = useCallback((e) => {
    if (placeholder) return;
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  }, [placeholder]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const onSurfaceClick = useCallback(
    e => {
      if (!tapToTogglePlay) return;
      togglePlay();
      resetHideTimer();
    },
    [tapToTogglePlay, togglePlay, resetHideTimer],
  );

  const onHudOverlayClick = useCallback(
    e => {
      if (!tapToTogglePlay) return;
      e.stopPropagation();
      togglePlay();
      resetHideTimer();
    },
    [tapToTogglePlay, togglePlay, resetHideTimer],
  );

  return (
    <div
      ref={containerRef}
      className={`vp${placeholder ? ' vp--placeholder' : ''} ${className}`.trim()}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => { clearTimeout(hideTimer.current); setHover(false); setShowVol(false); setShowQual(false); }}
      onClick={tapToTogglePlay ? onSurfaceClick : undefined}
    >
      {placeholder ? (
        <div
          className={`vp__placeholder-surface${placeholderSrc ? ' vp__placeholder-surface--photo' : ''}`}
          aria-hidden
          style={
            placeholderSrc
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.12) 0%, transparent 45%), url(${assetUrl(placeholderSrc)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          autoPlay muted loop playsInline
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          className="vp__video"
        />
      )}

      {/* HUD */}
      <AnimatePresence>
        {hover && (
          <motion.div
            className="vp__hud"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={tapToTogglePlay ? onHudOverlayClick : undefined}
          >
            {/* Timeline */}
            <div className="vp__timeline-wrap" onClick={e => e.stopPropagation()}>
              <span className="vp__time">{formatTime(current)}</span>
              <div className="vp__timeline" onClick={scrub}>
                <div className="vp__timeline-buf" />
                <motion.div
                  className="vp__timeline-fill"
                  style={{ width: `${progress * 100}%` }}
                />
                <motion.div
                  className="vp__timeline-thumb"
                  style={{ left: `${progress * 100}%` }}
                />
              </div>
              <span className="vp__time">{formatTime(duration)}</span>
            </div>

            {/* Dock bar */}
            <div
              className="vp__dock"
              onMouseMove={e => mouseX.set(e.pageX)}
              onMouseLeave={() => mouseX.set(Infinity)}
              onClick={e => e.stopPropagation()}
            >
              {/* Play / Pause */}
              <DockBtn mouseX={mouseX} label={playing ? 'Pause' : 'Play'} onClick={togglePlay}>
                {playing ? <IconPause /> : <IconPlay />}
              </DockBtn>

              {/* Volume */}
              <div className="vp__popover-wrap">
                <DockBtn mouseX={mouseX} label="Volume" onClick={e => { e.stopPropagation(); if (muted) setVol(1); else setVol(0); setShowVol(v => !v); setShowQual(false); }}>
                  {muted ? <IconMute /> : <IconVolume />}
                </DockBtn>
                <AnimatePresence>
                  {showVol && (
                    <motion.div
                      className="vp__popover"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button className="vp__pop-row" onClick={toggleMute}>
                        {muted ? <IconMute /> : <IconVolume />}
                        <span>{muted ? 'Unmute' : 'Mute'}</span>
                      </button>
                      <div className="vp__vol-slider-wrap">
                        <input
                          type="range" min="0" max="1" step="0.01"
                          value={muted ? 0 : volume}
                          onChange={e => setVol(parseFloat(e.target.value))}
                          className="vp__vol-slider"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Quality */}
              <div className="vp__popover-wrap">
                <DockBtn mouseX={mouseX} label="Quality" tipAlign="right" onClick={e => { e.stopPropagation(); setShowQual(v => !v); setShowVol(false); }}>
                  <IconQuality />
                </DockBtn>
                <AnimatePresence>
                  {showQual && (
                    <motion.div
                      className="vp__popover vp__popover--right"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      onClick={e => e.stopPropagation()}
                    >
                      {QUALITIES.map(q => (
                        <button
                          key={q}
                          className={`vp__pop-row ${quality === q ? 'vp__pop-row--active' : ''}`}
                          onClick={() => { setQuality(q); setShowQual(false); }}
                        >
                          {q}
                          {quality === q && <span className="vp__check">✓</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fullscreen */}
              <DockBtn mouseX={mouseX} label={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'} tipAlign="right" onClick={toggleFullscreen}>
                {fullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
              </DockBtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
