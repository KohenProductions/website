/**
 * Elastic Slider — from React Bits (MIT / Commons Clause)
 * https://reactbits.dev · https://github.com/DavidHDev/react-bits
 */
import { animate, motion as Motion, useMotionValue, useMotionValueEvent, useTransform } from 'motion/react';
import { useCallback, useRef, useState } from 'react';

import './ElasticSlider.css';

const MAX_OVERFLOW = 50;

const DefaultVolumeLowIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </svg>
);

const DefaultVolumeHighIcon = () => (
  <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

export default function ElasticSlider({
  value: controlledValue,
  defaultValue = 50,
  onValueChange,
  startingValue = 0,
  maxValue = 100,
  className = '',
  showValue = true,
  isStepped = false,
  stepSize = 1,
  /** When true, render only the elastic track (no end slots). */
  onlyTrack = false,
  /** Replaces default volume icons when set (including `null` to omit one side). */
  leftSlot,
  rightSlot,
  leftIcon,
  rightIcon,
  /** Whole control scales on hover/touch (can overflow tight layouts). */
  hoverMagnify = true,
  /** Playhead on the track at the current value (e.g. video timeline). */
  showProgressThumb = false,
}) {
  return (
    <div
      className={`slider-container${className ? ` ${className}` : ''}`.trim()}
      style={showValue ? { position: 'relative' } : undefined}
    >
      <Slider
        key={
          controlledValue !== undefined && controlledValue !== null
            ? 'controlled'
            : String(defaultValue)
        }
        controlledValue={controlledValue}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        startingValue={startingValue}
        maxValue={maxValue}
        showValue={showValue}
        isStepped={isStepped}
        stepSize={stepSize}
        onlyTrack={onlyTrack}
        leftSlot={leftSlot}
        rightSlot={rightSlot}
        leftIcon={leftIcon ?? <DefaultVolumeLowIcon />}
        rightIcon={rightIcon ?? <DefaultVolumeHighIcon />}
        hoverMagnify={hoverMagnify}
        showProgressThumb={showProgressThumb}
      />
    </div>
  );
}

function Slider({
  controlledValue,
  defaultValue,
  onValueChange,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  onlyTrack,
  leftSlot,
  rightSlot,
  leftIcon,
  rightIcon,
  showValue,
  hoverMagnify,
  showProgressThumb,
}) {
  const isControlled = controlledValue !== undefined && controlledValue !== null;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const sliderRef = useRef(null);
  const [region, setRegion] = useState('middle');
  const clientX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacityFromScale = useTransform(scale, [1, 1.2], [0.7, 1]);
  const trackHeightFromScale = useTransform(scale, [1, 1.2], [6, 12]);
  const trackMarginFromScale = useTransform(scale, [1, 1.2], [0, -3]);

  const commitValue = useCallback(
    newValue => {
      const clamped = Math.min(Math.max(newValue, startingValue), maxValue);
      if (!isControlled) setInternalValue(clamped);
      onValueChange?.(clamped);
    },
    [isControlled, startingValue, maxValue, onValueChange],
  );

  useMotionValueEvent(clientX, 'change', latest => {
    if (sliderRef.current) {
      const { left, right } = sliderRef.current.getBoundingClientRect();
      let newValue;

      if (latest < left) {
        setRegion('left');
        newValue = left - latest;
      } else if (latest > right) {
        setRegion('right');
        newValue = latest - right;
      } else {
        setRegion('middle');
        newValue = 0;
      }

      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = e => {
    if (e.buttons > 0 && sliderRef.current) {
      const { left, width } = sliderRef.current.getBoundingClientRect();
      let newValue = startingValue + ((e.clientX - left) / width) * (maxValue - startingValue);

      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }

      commitValue(newValue);
      clientX.jump(e.clientX);
    }
  };

  const handlePointerDown = e => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: 'spring', bounce: 0.5 });
  };

  const getRangePercentage = () => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;

    return ((value - startingValue) / totalRange) * 100;
  };

  const leftEl = leftSlot !== undefined ? leftSlot : leftIcon;
  const rightEl = rightSlot !== undefined ? rightSlot : rightIcon;

  const trackBlock = (
    <div
      ref={sliderRef}
      className="slider-root"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Motion.div
        style={{
          scaleX: useTransform(() => {
            if (sliderRef.current) {
              const { width } = sliderRef.current.getBoundingClientRect();
              return 1 + overflow.get() / width;
            }
          }),
          scaleY: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
          transformOrigin: useTransform(() => {
            if (sliderRef.current) {
              const { left, width } = sliderRef.current.getBoundingClientRect();
              return clientX.get() < left + width / 2 ? 'right' : 'left';
            }
          }),
          height: hoverMagnify ? trackHeightFromScale : 6,
          marginTop: hoverMagnify ? trackMarginFromScale : 0,
          marginBottom: hoverMagnify ? trackMarginFromScale : 0,
        }}
        className="slider-track-wrapper"
      >
        <div className={`slider-track${showProgressThumb ? ' slider-track--with-thumb' : ''}`}>
          <div className="slider-range" style={{ width: `${getRangePercentage()}%` }} />
          {showProgressThumb ? (
            <div
              className="slider-progress-thumb"
              style={{ left: `${getRangePercentage()}%` }}
              aria-hidden
            />
          ) : null}
        </div>
      </Motion.div>
    </div>
  );

  const wrapperClass =
    `slider-wrapper${onlyTrack ? ' slider-wrapper--only-track' : ''}`.trim();

  return (
    <>
      <Motion.div
        onHoverStart={hoverMagnify ? () => animate(scale, 1.2) : undefined}
        onHoverEnd={hoverMagnify ? () => animate(scale, 1) : undefined}
        onTouchStart={hoverMagnify ? () => animate(scale, 1.2) : undefined}
        onTouchEnd={hoverMagnify ? () => animate(scale, 1) : undefined}
        style={
          hoverMagnify
            ? { scale, opacity: opacityFromScale }
            : { scale: 1, opacity: 1 }
        }
        className={wrapperClass}
      >
        <Motion.div
          animate={{
            scale: onlyTrack ? 1 : region === 'left' ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              onlyTrack || region !== 'left' ? 0 : -overflow.get() / scale.get(),
            ),
          }}
          className="slider-end slider-end--left"
          aria-hidden={onlyTrack}
        >
          {onlyTrack ? null : leftEl}
        </Motion.div>

        {trackBlock}

        <Motion.div
          animate={{
            scale: onlyTrack ? 1 : region === 'right' ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            x: useTransform(() =>
              onlyTrack || region !== 'right' ? 0 : overflow.get() / scale.get(),
            ),
          }}
          className="slider-end slider-end--right"
          aria-hidden={onlyTrack}
        >
          {onlyTrack ? null : rightEl}
        </Motion.div>
      </Motion.div>
      {showValue ? <p className="value-indicator">{Math.round(value)}</p> : null}
    </>
  );
}

function decay(val, max) {
  if (max === 0) {
    return 0;
  }

  const entry = val / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);

  return sigmoid * max;
}
