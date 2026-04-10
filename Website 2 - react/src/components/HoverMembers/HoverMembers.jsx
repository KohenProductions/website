import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import './HoverMembers.css';

/**
 * Hover members — Skiper UI skiper6-style (API + interaction).
 * https://skiper-ui.com/v1/skiper6 · Inspired by opos.buzzworthystudio.com/directors
 *
 * Props match docs: teamMembers: { name, image }[]. Optional `role` + `gradient` for fallback.
 */
const DEFAULT_TEAM = [
  {
    name: 'Noa Klein',
    role: 'Director',
    image: 'https://picsum.photos/seed/skiper6a/480/640',
    gradient: 'linear-gradient(165deg, #4691e2 0%, #6366f1 55%, #1e1b4b 100%)',
  },
  {
    name: 'Yaron Weiss',
    role: 'Cinematographer',
    image: 'https://picsum.photos/seed/skiper6b/480/640',
    gradient: 'linear-gradient(165deg, #9f83fb 0%, #818cf8 50%, #312e81 100%)',
  },
  {
    name: 'Maya Cohen',
    role: 'Producer',
    image: 'https://picsum.photos/seed/skiper6c/480/640',
    gradient: 'linear-gradient(165deg, #7dd3fc 0%, #4691e2 45%, #0c4a6e 100%)',
  },
  {
    name: 'Dan Lev',
    role: 'Editor',
    image: 'https://picsum.photos/seed/skiper6d/480/640',
    gradient: 'linear-gradient(165deg, #a78bfa 0%, #c084fc 40%, #4c1d95 100%)',
  },
  {
    name: 'Tamar Eli',
    role: 'Color',
    image: 'https://picsum.photos/seed/skiper6e/480/640',
    gradient: 'linear-gradient(165deg, #818cf8 0%, #9f83fb 48%, #3730a3 100%)',
  },
];

/** For HoverExpandShowcase (skiper35) — same roster as this module */
export function teamToExpandShowcaseItems(team = DEFAULT_TEAM) {
  return team.map((m, i) => ({
    id: `team-${i}-${m.name.replace(/\s+/g, '-').toLowerCase()}`,
    kicker: m.role,
    title: m.name,
    year: String(2019 + ((i * 2) % 7)),
    gradient: m.gradient,
    image: m.image,
  }));
}

const springCursor = { stiffness: 500, damping: 35, mass: 0.35 };
const springCard = { stiffness: 280, damping: 28, mass: 0.45 };
const springText = { stiffness: 220, damping: 26, mass: 0.4 };

function splitName(name) {
  return name.split('').map((ch, i) => ({
    key: `${name}-${i}`,
    ch: ch === ' ' ? '\u00a0' : ch,
    isSpace: ch === ' ',
  }));
}

function CustomCursor({ x, y, active, visible }) {
  return (
    <motion.div
      className="hover-mem-cursor"
      aria-hidden
      style={{ left: x, top: y }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: active ? 1.18 : 1,
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { type: 'spring', stiffness: 420, damping: 28 },
      }}
    >
      <span className="hover-mem-cursor-ring" />
      <span className="hover-mem-cursor-dot" />
    </motion.div>
  );
}

const FALLBACK_GRADIENT =
  'linear-gradient(165deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)';

function MemberCard({ name, role, image, gradient, reduceMotion, onCardHover }) {
  const rootRef = useRef(null);
  const [on, setOn] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const rotateX = useSpring(0, springCard);
  const rotateY = useSpring(0, springCard);
  const textX = useSpring(0, springText);
  const textY = useSpring(0, springText);

  const chars = splitName(name);
  const n = chars.length;

  const resetMotion = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    textX.set(0);
    textY.set(0);
  }, [rotateX, rotateY, textX, textY]);

  const handleMove = useCallback(
    e => {
      if (reduceMotion || !rootRef.current) return;
      const r = rootRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const px = (e.clientX - cx) / (r.width / 2);
      const py = (e.clientY - cy) / (r.height / 2);
      rotateX.set(-py * 8);
      rotateY.set(px * 8);
      textX.set(px * 18);
      textY.set(py * 12);
    },
    [reduceMotion, rotateX, rotateY, textX, textY],
  );

  const handleEnter = useCallback(() => {
    setOn(true);
    onCardHover?.(true);
  }, [onCardHover]);

  const handleLeave = useCallback(() => {
    setOn(false);
    onCardHover?.(false);
    resetMotion();
  }, [onCardHover, resetMotion]);

  return (
    <div className="hover-mem-card">
      <motion.div
        ref={rootRef}
        className="hover-mem-inner"
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onPointerMove={handleMove}
        onFocus={() => {
          setOn(true);
          onCardHover?.(true);
        }}
        onBlur={e => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setOn(false);
            onCardHover?.(false);
            resetMotion();
          }
        }}
        tabIndex={0}
        role="group"
        aria-label={`${name}${role ? `, ${role}` : ''}. Hover or focus to reveal name.`}
      >
        <motion.div
          className="hover-mem-photo-wrap"
          style={{
            rotateX: reduceMotion ? 0 : rotateX,
            rotateY: reduceMotion ? 0 : rotateY,
          }}
        >
          <motion.div
            className="hover-mem-photo"
            style={{ background: gradient || FALLBACK_GRADIENT }}
            animate={{ scale: reduceMotion ? 1 : on ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {imgOk ? (
              <img
                src={image}
                alt=""
                className="hover-mem-img"
                draggable={false}
                loading="lazy"
                decoding="async"
                onError={() => setImgOk(false)}
              />
            ) : null}
          </motion.div>
        </motion.div>
        <div className="hover-mem-copy">
          <motion.div
            className="hover-mem-name"
            aria-hidden
            style={{
              x: reduceMotion ? 0 : textX,
              y: reduceMotion ? 0 : textY,
            }}
          >
            {chars.map(({ key, ch, isSpace }, i) => (
              <motion.span
                key={key}
                className="hover-mem-char"
                initial={false}
                animate={
                  on
                    ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 22, x: -6, filter: 'blur(10px)' }
                }
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 26,
                  delay: on ? 0.03 + i * 0.032 : (n - 1 - i) * 0.014,
                }}
                style={{ width: isSpace ? '0.28em' : undefined }}
              >
                {ch}
              </motion.span>
            ))}
          </motion.div>
          {role ? (
            <motion.p
              className="hover-mem-role"
              aria-hidden
              style={{
                x: reduceMotion ? 0 : textX,
                y: reduceMotion ? 0 : textY,
              }}
              initial={false}
              animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{
                duration: on ? 0.38 : 0.22,
                delay: on ? 0.12 + n * 0.028 : 0,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="hover-mem-role-inner">{role}</span>
            </motion.p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

export default function HoverMembers({ teamMembers }) {
  const members = teamMembers?.length ? teamMembers : DEFAULT_TEAM;
  const reduceMotion = useReducedMotion();
  const [inSection, setInSection] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [cursorActive, setCursorActive] = useState(false);

  const cursorX = useSpring(0, springCursor);
  const cursorY = useSpring(0, springCursor);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setFinePointer(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!inSection || !finePointer || reduceMotion) return undefined;
    const onMove = e => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [inSection, finePointer, reduceMotion, cursorX, cursorY]);

  const showCursor = inSection && finePointer && !reduceMotion;

  return (
    <section
      className={`hover-members ${showCursor ? 'hover-members--hide-system-cursor' : ''}`}
      aria-labelledby="hover-members-heading"
      onPointerEnter={() => setInSection(true)}
      onPointerLeave={() => {
        setInSection(false);
        setCursorActive(false);
      }}
    >
      <CustomCursor x={cursorX} y={cursorY} active={cursorActive} visible={showCursor} />

      <header className="hover-members-head">
        <span className="hover-members-label">People</span>
        <h3 id="hover-members-heading" className="hover-members-title">
          Core team
        </h3>
      </header>

      <div className="hover-members-row">
        {members.map(m => (
          <MemberCard
            key={m.name}
            name={m.name}
            role={m.role}
            image={m.image}
            gradient={m.gradient ?? FALLBACK_GRADIENT}
            reduceMotion={reduceMotion}
            onCardHover={showCursor ? setCursorActive : undefined}
          />
        ))}
      </div>

      <p className="hover-members-foot">
        Layout &amp; interaction from{' '}
        <a href="https://skiper-ui.com/v1/skiper6" target="_blank" rel="noreferrer">
          Skiper UI — skiper6
        </a>
        {' · '}
        <a href="https://opos.buzzworthystudio.com/directors" target="_blank" rel="noreferrer">
          Buzzworthy — directors
        </a>
      </p>
    </section>
  );
}
