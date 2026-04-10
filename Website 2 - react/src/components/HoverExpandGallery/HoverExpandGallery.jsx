import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import GalleryDrawingTrail from './GalleryDrawingTrail';
import './HoverExpandGallery.css';

/**
 * Horizontal hover-expand strips — same interaction family as Skiper UI ExpandOnHover.
 * https://skiper-ui.com/v1/skiper52 — layout & motion reimplemented here (not copied source).
 */

function publicAiVideo(filename) {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  return `${root}/ai/${filename}`;
}

const DEFAULT_ITEMS = [
  { id: 'models', code: '# 01', label: 'Models', src: publicAiVideo('Models.mp4'), expandAspect: '9/16' },
  { id: 'gracewide', code: '# 02', label: 'Grace wide', src: publicAiVideo('gracewide.mp4') },
  { id: 'grace-door', code: '# 03', label: 'Grace door', src: publicAiVideo('GraceDoor.mp4') },
  { id: 'sunglasses', code: '# 04', label: 'Sunglasses', src: publicAiVideo('Sunglasses.mp4'), expandAspect: '9/16' },
];

/* Slower, relaxed overlay fades (matches calmer strip width transition) */
const easeStrip = { duration: 0.52, ease: [0.22, 1, 0.36, 1] };

export default function HoverExpandGallery({ items = DEFAULT_ITEMS }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );
  const [active, setActive] = useState(0);
  const transition = reduceMotion ? { duration: 0.01 } : easeStrip;

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const onChange = () => setFinePointer(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const drawingEnabled = finePointer && !reduceMotion;

  const activate = useCallback(i => {
    setActive(i);
  }, []);

  const onKeyDown = useCallback(
    (e, i) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate(i);
      }
    },
    [activate],
  );

  const rootClass = [
    'hover-expand-gallery',
    reduceMotion ? 'hover-expand-gallery--reduce-motion' : '',
    drawingEnabled ? 'hover-expand-gallery--drawing-cursor' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={sectionRef} className={rootClass} aria-labelledby="hover-expand-heading">
      <header className="hover-expand-head">
        <span className="hover-expand-label">Gallery</span>
        <h3 id="hover-expand-heading" className="hover-expand-title">
          Still selects
        </h3>
      </header>

      <div className="hover-expand-scroll">
        <div className="hover-expand-row" role="list">
          {items.map((item, i) => {
            const isActive = active === i;
            return (
              <div
                key={item.id}
                className={`hover-expand-strip${isActive ? ' hover-expand-strip--active' : ''}${item.expandAspect === '9/16' ? ' hover-expand-strip--expand-916' : ''}`}
                role="listitem"
                tabIndex={0}
                onPointerEnter={() => activate(i)}
                onPointerDown={() => activate(i)}
                onKeyDown={e => onKeyDown(e, i)}
                aria-selected={isActive}
                aria-label={`${item.label}, ${item.code}`}
              >
                <div className="hover-expand-frame">
                  <video
                    className="hover-expand-video"
                    src={item.src}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    aria-hidden
                  />

                  <AnimatePresence>
                    {isActive ? (
                      <motion.div
                        key="shade"
                        className="hover-expand-shade"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={transition}
                      />
                    ) : null}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isActive ? (
                      <motion.div
                        key="meta"
                        className="hover-expand-meta"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={transition}
                      >
                        <span className="hover-expand-code">{item.code}</span>
                        <span className="hover-expand-strip-label">{item.label}</span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="hover-expand-foot">
        Interaction pattern inspired by{' '}
        <a href="https://skiper-ui.com/v1/skiper52" target="_blank" rel="noreferrer">
          Skiper UI — ExpandOnHover
        </a>
        {' · '}
        Drawing trail inspired by{' '}
        <a href="https://skiper-ui.com/v1/skiper59" target="_blank" rel="noreferrer">
          Skiper UI — Drawing cursor
        </a>
        {' / '}
        <a href="https://www.artlebedev.com/" target="_blank" rel="noreferrer">
          Artemiy Lebedev
        </a>
      </p>

      <GalleryDrawingTrail sectionRef={sectionRef} enabled={drawingEnabled} />
    </section>
  );
}
