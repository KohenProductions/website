import { forwardRef, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import './VariableProximity.css';

function useAnimationFrame(callback) {
  useEffect(() => {
    let frameId;
    const loop = () => { callback(); frameId = requestAnimationFrame(loop); };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const updatePosition = (x, y) => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        positionRef.current = { x: x - rect.left, y: y - rect.top };
      } else {
        positionRef.current = { x, y };
      }
    };
    const handleMouseMove = ev => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = ev => { const t = ev.touches[0]; updatePosition(t.clientX, t.clientY); };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);
  return positionRef;
}

const VariableProximity = forwardRef((props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = str =>
      new Map(str.split(',').map(s => s.trim()).map(s => {
        const [name, value] = s.split(' ');
        return [name.replace(/['"]/g, ''), parseFloat(value)];
      }));
    const from = parseSettings(fromFontVariationSettings);
    const to   = parseSettings(toFontVariationSettings);
    return Array.from(from.entries()).map(([axis, fromValue]) => ({
      axis, fromValue, toValue: to.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calcDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calcFalloff = distance => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    if (falloff === 'exponential') return norm ** 2;
    if (falloff === 'gaussian')    return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
    return norm;
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const { x, y } = mousePositionRef.current;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;
    lastPositionRef.current = { x, y };

    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef) return;
      const rect = letterRef.getBoundingClientRect();
      const lx = rect.left + rect.width / 2 - containerRect.left;
      const ly = rect.top  + rect.height / 2 - containerRect.top;
      const dist = calcDistance(mousePositionRef.current.x, mousePositionRef.current.y, lx, ly);

      if (dist >= radius) { letterRef.style.fontVariationSettings = fromFontVariationSettings; return; }

      const f = calcFalloff(dist);
      const newSettings = parsedSettings.map(({ axis, fromValue, toValue }) =>
        `'${axis}' ${fromValue + (toValue - fromValue) * f}`
      ).join(', ');

      interpolatedSettingsRef.current[index] = newSettings;
      letterRef.style.fontVariationSettings = newSettings;
    });
  });

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      className={`variable-proximity ${className}`}
      onClick={onClick}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wi) => (
        <span key={wi} className={word.toLowerCase() === 'right' ? 'vp-word vp-word--highlight' : 'vp-word'} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map(letter => {
            const idx = letterIndex++;
            return (
              <motion.span
                key={idx}
                ref={el => { letterRefs.current[idx] = el; }}
                style={{ display: 'inline-block', fontVariationSettings: interpolatedSettingsRef.current[idx] }}
                aria-hidden="true"
              >
                {letter}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span style={{ display: 'inline-block' }}>&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
