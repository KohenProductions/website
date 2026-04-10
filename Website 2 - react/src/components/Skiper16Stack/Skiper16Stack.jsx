import { useRef, useState, useCallback, Fragment } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './Skiper16Stack.css';

/**
 * Skiper UI skiper16 — sticky card stack with scroll-driven scale.
 * https://skiper-ui.com/v1/skiper16 (free tier requires attribution)
 */

/** `public/karl studio/frames/card1a.jpg` … `card1f.jpg` */
function card1GalleryFrameUrl(letter) {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  return `${root}/karl studio/frames/card1${letter}.jpg`;
}

const CARD1_GALLERY_FRAMES = ['a', 'b', 'c', 'd', 'e', 'f'].map(card1GalleryFrameUrl);

/** `public/karl studio/frames/card3a.gif` */
function card3GifUrl() {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  return `${root}/karl studio/frames/card3a.gif`;
}

const CARD3_GIF_SRC = card3GifUrl();

/** `public/karl studio/frames/card2b.jpg` — centered on card 2 */
function karlStudioFramesFile(filename) {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  return `${root}/karl studio/frames/${filename}`;
}

const CARD2_B_SRC = karlStudioFramesFile('card2b.jpg');

/** `public/bar.mp4` — card 4 with project VideoPlayer HUD */
function publicRootPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}

const CARD4_VIDEO_SRC = publicRootPath('/bar.mp4');

const CARDS = [
  { title: 'Karl Studio', kicker: 'Brand film', gradient: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)' },
  { title: 'Direction', kicker: 'Process', gradient: 'linear-gradient(145deg, #0c4a6e 0%, #164e63 50%, #0f172a 100%)' },
  { title: 'Craft', kicker: 'Production', gradient: 'linear-gradient(145deg, #4c1d95 0%, #5b21b6 45%, #1e1b4b 100%)' },
  { title: 'Motion', kicker: 'Edit & grade', gradient: 'linear-gradient(145deg, #831843 0%, #9d174d 40%, #1c1917 100%)' },
  { title: 'Delivery', kicker: 'Every format', gradient: 'linear-gradient(145deg, #14532d 0%, #166534 40%, #0f172a 100%)' },
];

/** Stack scroll p where all card scales are finished (t = n); remaining p scrolls at final state. */
const STACK_MOTION_P_END = 0.82;

/** Maps scroll p → driver t. Same relative timing between cards; t = n before p = 1. */
function scrollProgressToMotionT(p, n) {
  const pc = Math.min(1, Math.max(0, p));
  if (pc >= STACK_MOTION_P_END) return n;
  return (pc / STACK_MOTION_P_END) * n;
}

/**
 * While t < i: sSmall. On t ∈ [i, i+1): ramp to sLarge. For t ≥ i+1: sBack.
 */
function scaleForCardSequential(i, t) {
  const sFront = 0.78;
  const sBack = 1.1;

  if (t < i) {
    return sFront;
  }
  if (t < i + 1) {
    const u = Math.min(1, Math.max(0, t - i));
    return sFront + u * (sBack - sFront);
  }
  return sBack;
}

/** Max overlay opacity: card 1 → 30%, then +10% per step (40%, 50%, …). Last card never covered by a follower. */
function cardDarkenMaxOpacity(i) {
  return Math.min(1, 0.3 + i * 0.1);
}

/** While next card’s segment runs (t ∈ (i+1, i+2]), this card darkens 0 → max. Aligned with sequential scale driver. */
function cardDarkenOpacity(i, t, n) {
  if (i >= n - 1) return 0;
  const t0 = i + 1;
  const t1 = i + 2;
  if (t <= t0) return 0;
  const max = cardDarkenMaxOpacity(i);
  if (t >= t1) return max;
  const u = (t - t0) / (t1 - t0);
  return u * max;
}

function Card1GalleryVisual({ frames, fallbackGradient }) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(() => ({}));
  const len = frames.length;

  const bump = useCallback(
    delta => {
      if (len < 2) return;
      setIdx(j => (j + delta + len) % len);
    },
    [len],
  );

  const src = len ? frames[idx] : '';
  const imgBroken = Boolean(src && failed[src]);

  return (
    <div
      className="skiper16-visual skiper16-visual--gallery"
      style={{ background: fallbackGradient }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Karl Studio frames"
    >
      {src && !imgBroken ? (
        <img
          key={src}
          className="skiper16-gallery-img"
          src={src}
          alt=""
          decoding="async"
          loading={idx === 0 ? 'eager' : 'lazy'}
          draggable={false}
          onError={() => setFailed(f => (f[src] ? f : { ...f, [src]: true }))}
        />
      ) : null}
      {len > 1 ? (
        <>
          <button
            type="button"
            className="skiper16-gallery-btn skiper16-gallery-btn--prev"
            aria-label="Previous frame"
            onClick={() => bump(-1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                fill="currentColor"
                d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="skiper16-gallery-btn skiper16-gallery-btn--next"
            aria-label="Next frame"
            onClick={() => bump(1)}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
              <path
                fill="currentColor"
                d="M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
              />
            </svg>
          </button>
        </>
      ) : null}
    </div>
  );
}

function Card2CenterFrameVisual({ src, fallbackGradient }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="skiper16-visual skiper16-visual--center-frame"
      style={{ background: fallbackGradient }}
    >
      {!failed ? (
        <img
          className="skiper16-center-frame-img"
          src={src}
          alt=""
          decoding="async"
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}

function Card3GifVisual({ src, fallbackGradient }) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="skiper16-visual skiper16-visual--gallery"
      style={{ background: fallbackGradient }}
    >
      {!failed ? (
        <img
          className="skiper16-gallery-img"
          src={src}
          alt=""
          decoding="async"
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}

function StickyCard({ i, n, title, kicker, gradient, scrollYProgress }) {
  const scale = useTransform(scrollYProgress, p => {
    const t = scrollProgressToMotionT(p, n);
    return scaleForCardSequential(i, t);
  });

  const darkenOpacity = useTransform(scrollYProgress, p => {
    const t = scrollProgressToMotionT(p, n);
    return cardDarkenOpacity(i, t, n);
  });

  const num = String(i + 1).padStart(2, '0');

  return (
    <div
      className="skiper16-stick"
      style={{
        zIndex: i + 1,
        top: `calc(${i} * var(--skiper16-peek))`,
      }}
    >
      <motion.div className="skiper16-card" style={{ scale }}>
        {i === 0 ? (
          <Card1GalleryVisual frames={CARD1_GALLERY_FRAMES} fallbackGradient={gradient} />
        ) : i === 1 ? (
          <Card2CenterFrameVisual src={CARD2_B_SRC} fallbackGradient={gradient} />
        ) : i === 2 ? (
          <Card3GifVisual src={CARD3_GIF_SRC} fallbackGradient={gradient} />
        ) : i === 3 ? (
          <div className="skiper16-visual skiper16-visual--embed-vp">
            <VideoPlayer src={CARD4_VIDEO_SRC} />
          </div>
        ) : (
          <div className="skiper16-visual" style={{ background: gradient }} />
        )}
        <motion.div
          className="skiper16-card-darken"
          style={{ opacity: darkenOpacity }}
          aria-hidden
        />
        <span className="skiper16-num" aria-hidden="true">
          {num}
        </span>
        <div className="skiper16-meta">
          <span className="skiper16-kicker">{kicker}</span>
          <h3 className="skiper16-title">{title}</h3>
        </div>
      </motion.div>
    </div>
  );
}

export default function Skiper16Stack() {
  const stackTrackRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: stackTrackRef,
    offset: ['start start', 'end end'],
  });

  const n = CARDS.length;

  return (
    <div className="skiper16-root">
      <div className="skiper16-stack-track" ref={stackTrackRef}>
        {CARDS.map((card, i) => (
          <Fragment key={card.title}>
            <StickyCard
              i={i}
              n={n}
              title={card.title}
              kicker={card.kicker}
              gradient={card.gradient}
              scrollYProgress={scrollYProgress}
            />
            {(i === 1 || i === 2 || i === 3) ? (
              <div className="skiper16-stack-section-gap" aria-hidden />
            ) : null}
          </Fragment>
        ))}
        {/* Lets every sticky row (esp. the last) keep the same pin/scroll physics as rows above */}
        <div className="skiper16-stack-end-spacer" aria-hidden />
      </div>
      <div className="skiper16-tail" aria-hidden />
      <p className="skiper16-attribution">
        Card stack layout based on{' '}
        <a href="https://skiper-ui.com/v1/skiper16" target="_blank" rel="noreferrer">
          Skiper UI — skiper16
        </a>
      </p>
    </div>
  );
}
