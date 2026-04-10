import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './HoverExpandShowcase.css';

/**
 * Horizontal hover/click expand panels — skiper35-style (reimplemented).
 * Collapsed: vertical strip labels. Open: spine (year + title) + large image.
 * https://skiper-ui.com/v1/skiper35
 */

const DEFAULT_ITEMS = [
  {
    id: '1',
    kicker: 'Commercial',
    title: 'North wind',
    year: '2025',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #0f172a 100%)',
  },
  {
    id: '2',
    kicker: 'Social',
    title: 'Day run',
    year: '2024',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #082f49 100%)',
  },
  {
    id: '3',
    kicker: 'Brand film',
    title: 'Soft light',
    year: '2025',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 48%, #1e1b4b 100%)',
  },
  {
    id: '4',
    kicker: 'Product',
    title: 'Chrome line',
    year: '2023',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #0d9488 50%, #042f2e 100%)',
  },
  {
    id: '5',
    kicker: 'Documentary',
    title: 'Field notes',
    year: '2024',
    gradient: 'linear-gradient(135deg, #713f12 0%, #ca8a04 48%, #422006 100%)',
  },
];

function publicPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  const root = base === '/' ? '' : base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${root}${p}`;
}

/** Seven stills from `public/Fashion/` */
export const FASHION_HOVER_EXPAND_ITEMS = [
  {
    id: 'fe-1',
    kicker: 'Magazine',
    title: 'Feel',
    year: '2025',
    image: publicPath('/Fashion/1.jpg'),
    stripLabel: 'FEEL',
  },
  {
    id: 'fe-2',
    kicker: 'Magazine',
    title: 'High Volt',
    year: '2025',
    image: publicPath('/Fashion/2.jpg'),
    stripLabel: 'HIGH VOLT',
  },
  {
    id: 'fe-3',
    kicker: 'Magazine',
    title: 'Hottest',
    year: '2025',
    image: publicPath('/Fashion/3.png'),
    stripLabel: 'HOTTEST',
  },
  {
    id: 'fe-4',
    kicker: 'Magazine',
    title: 'Marika',
    year: '2025',
    image: publicPath('/Fashion/4.jpg'),
    stripLabel: 'MARIKA',
  },
  {
    id: 'fe-5',
    kicker: 'Magazine',
    title: 'Moevir',
    year: '2025',
    image: publicPath('/Fashion/5.jpg'),
    stripLabel: 'MOEVIR',
  },
  {
    id: 'fe-6',
    kicker: 'Magazine',
    title: 'Roidx',
    year: '2025',
    image: publicPath('/Fashion/6.jpg'),
    stripLabel: 'ROIDX',
  },
  {
    id: 'fe-7',
    kicker: 'Magazine',
    title: 'Charisma',
    year: '2025',
    image: publicPath('/Fashion/7.png'),
    stripLabel: 'CHARISMA',
  },
];

const springOpen = { type: 'spring', stiffness: 200, damping: 26, mass: 0.55 };
const springInner = { type: 'spring', stiffness: 170, damping: 30, mass: 0.48 };

function defaultPanelIndex(len) {
  return Math.min(len - 1, Math.max(0, Math.floor(len / 2)));
}

function panelBgStyle(item) {
  if (item.image) {
    return {
      backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.22) 0%, transparent 42%), url(${item.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }
  return { background: item.gradient };
}

/** Text along collapsed strip (reference-style long label); falls back to title */
function stripLabel(item) {
  return item.stripLabel ?? item.title;
}

export default function HoverExpandShowcase({
  items = DEFAULT_ITEMS,
  label = 'Showcase',
  title = 'Hover expand',
  headingId = 'hover-expand-showcase-heading',
  variant = 'showcase',
}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(() => defaultPanelIndex(items.length));
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const onRowLeave = useCallback(() => {
    if (canHover) setActive(defaultPanelIndex(items.length));
  }, [canHover, items.length]);

  const onKeyDown = useCallback((e, i) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(i);
    }
  }, []);

  const panelTransition = reduceMotion ? { duration: 0.12 } : springOpen;
  const innerTransition = reduceMotion ? { duration: 0.12 } : springInner;

  return (
    <section className="hover-expand-showcase" aria-labelledby={headingId}>
      <header className="hes-head">
        <span className="hes-label">{label}</span>
        <h3 id={headingId} className="hes-title">
          {title}
        </h3>
        <p className="hes-hint">
          {canHover ? 'Hover a panel to expand' : 'Tap a panel to expand'}
        </p>
      </header>

      <div className="hes-row-shell">
        <div className="hes-row" role="list" onPointerLeave={onRowLeave}>
          {items.map((item, i) => {
            const isOpen = active === i;
            return (
              <motion.div
                key={item.id}
                className={`hes-panel${isOpen ? ' hes-panel--open' : ''}`}
                role="listitem"
                tabIndex={0}
                initial={false}
                animate={{ flexGrow: isOpen ? 1.45 : 0.55 }}
                transition={panelTransition}
                onPointerEnter={() => canHover && setActive(i)}
                onPointerDown={() => setActive(i)}
                onKeyDown={e => onKeyDown(e, i)}
                aria-expanded={isOpen}
                aria-label={`${item.title}, ${item.kicker}`}
              >
                <motion.div
                  className="hes-panel-bg"
                  style={panelBgStyle(item)}
                  initial={false}
                  animate={{
                    scale: isOpen ? 1 : 1.14,
                    filter: isOpen ? 'brightness(1.02)' : 'brightness(0.48)',
                  }}
                  transition={innerTransition}
                />
                <div className="hes-panel-scrim" aria-hidden />

                {!isOpen ? (
                  <div className="hes-collapsed-strip">
                    <span className="hes-collapsed-title">{stripLabel(item)}</span>
                  </div>
                ) : (
                  <div className="hes-expanded-ui">
                    <div className="hes-spine">
                      <span className="hes-spine-year">{item.year ?? '—'}</span>
                      <span className="hes-spine-name">{item.title}</span>
                    </div>
                    <div className="hes-expanded-right">
                      <div className="hes-expanded-meta">
                        <span className="hes-kicker">{item.kicker}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="hes-foot">
        {variant === 'team' || variant === 'fashion' ? (
          <>
            {variant === 'team' ? 'Core team panels' : 'International panels'} — layout inspired by{' '}
            <a href="https://skiper-ui.com/v1/skiper35" target="_blank" rel="noreferrer">
              Skiper UI — Hover expand
            </a>
            {' · Prior interaction reference '}
            <a href="https://skiper-ui.com/v1/skiper6" target="_blank" rel="noreferrer">
              Skiper UI — skiper6
            </a>
            {' · '}
            <a href="https://opos.buzzworthystudio.com/directors" target="_blank" rel="noreferrer">
              Buzzworthy — directors
            </a>
          </>
        ) : (
          <>
            Layout inspired by{' '}
            <a href="https://skiper-ui.com/v1/skiper35" target="_blank" rel="noreferrer">
              Skiper UI — Hover expand
            </a>
            {' · Demo refs '}
            <a href="https://lummi.ai" target="_blank" rel="noreferrer">
              Lummi
            </a>
          </>
        )}
      </p>
    </section>
  );
}
