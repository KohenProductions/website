import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import BorderGlow from '../BorderGlow/BorderGlow';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
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
  { id: 'models', code: '# 01', label: 'Menswear', src: publicAiVideo('Models.mp4'), expandAspect: '9/16' },
  { id: 'gracewide', code: '# 02', label: 'Authenticity', src: publicAiVideo('gracewide.mp4') },
  { id: 'grace-door', code: '# 03', label: 'Abstract', src: publicAiVideo('GraceDoor.mp4') },
  { id: 'sunglasses', code: '# 04', label: 'Style', src: publicAiVideo('Sunglasses.mp4'), expandAspect: '9/16' },
];

export default function HoverExpandGallery({ items = DEFAULT_ITEMS }) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const [finePointer, setFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );
  const [active, setActive] = useState(0);

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
        <span className="hover-expand-label hover-expand-label--tagline">
          the next step of content creation
        </span>
        <h3 id="hover-expand-heading" className="hover-expand-title">
          Ai Advertisments
        </h3>
      </header>

      <div className="hover-expand-scroll">
        <div className="hover-expand-row" role="list">
          {items.map((item, i) => {
            return (
              <div
                key={item.id}
                className={`hover-expand-strip${active === i ? ' hover-expand-strip--active' : ''}${item.expandAspect === '9/16' ? ' hover-expand-strip--expand-916' : ''}`}
                role="listitem"
                tabIndex={0}
                onPointerEnter={() => activate(i)}
                onPointerDown={() => activate(i)}
                onKeyDown={e => onKeyDown(e, i)}
                aria-selected={active === i}
                aria-label={`${item.code.replace('# ', '')} - ${item.label}`}
              >
                <div className="hover-expand-frame">
                  <BorderGlow
                    className="heg-border-glow"
                    backgroundColor="transparent"
                    borderRadius={10}
                    glowRadius={28}
                    glowColor="270 80 75"
                    colors={['#a78bfa', '#818cf8', '#7dd3fc']}
                    fillOpacity={0.12}
                    glowIntensity={1.1}
                    edgeSensitivity={20}
                  >
                    <VideoPlayer
                      src={item.src}
                      className="vp--fill-frame"
                      compactHud={item.expandAspect === '9/16'}
                    />
                  </BorderGlow>
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
