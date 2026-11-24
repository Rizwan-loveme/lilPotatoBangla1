import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BANGLA_FONT} from '../fonts';
import {LAYOUT, PALETTE} from '../config';

// Smooth outline built from a ring of text-shadows (no spiky -webkit-text-stroke joins)
const ring = (radius: number, color: string, steps = 24) =>
  Array.from({length: steps}, (_, i) => {
    const a = (i / steps) * Math.PI * 2;
    return `${(Math.cos(a) * radius).toFixed(2)}px ${(Math.sin(a) * radius).toFixed(2)}px 0 ${color}`;
  }).join(', ');

type Props = {
  text: string;
  index: number; // word index inside the caption (decides color + wobble direction)
  appearFrame: number; // local frame when this word pops in
  active: boolean; // currently "being spoken"
  captionIndex: number;
};

export const BanglaWord: React.FC<Props> = ({
  text,
  index,
  appearFrame,
  active,
  captionIndex,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const pop = spring({
    frame: frame - appearFrame,
    fps,
    config: {damping: 9, stiffness: 190, mass: 0.6},
  });
  const visible = frame >= appearFrame;

  const exit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dir = (index + captionIndex) % 2 === 0 ? -1 : 1;
  const scaleIn = interpolate(pop, [0, 1], [0.2, 1]);
  const lift = interpolate(pop, [0, 1], [46, 0]) + (1 - exit) * -14;
  const rotate =
    dir * interpolate(pop, [0, 1], [16, 0]) +
    Math.sin((frame + index * 5) / 6) * 1.6; // gentle idle wobble
  const activeBoost = active ? 1.14 : 1;
  const bob = Math.sin((frame + index * 7) / 5) * 3;

  const [c1, c2] = PALETTE[(index + captionIndex * 2) % PALETTE.length];

  const base: React.CSSProperties = {
    gridArea: '1 / 1',
    fontFamily: BANGLA_FONT,
    fontWeight: 800,
    fontSize: LAYOUT.banglaFontSize,
    lineHeight: 1.25,
    whiteSpace: 'nowrap',
    padding: '0 4px',
  };

  return (
    <span
      style={{
        display: 'inline-grid',
        opacity: visible ? exit : 0, // always reserve layout space, no jumping
        transform: `translateY(${lift + bob}px) rotate(${rotate}deg) scale(${
          scaleIn * activeBoost * (0.9 + 0.1 * exit)
        })`,
        transformOrigin: '50% 80%',
        filter: active ? `drop-shadow(0 0 16px ${c1})` : 'none',
      }}
    >
      {/* back layer: dark outline + chunky 3D drop */}
      <span
        aria-hidden
        style={{
          ...base,
          color: LAYOUT.outlineColor,
          textShadow: `${ring(LAYOUT.outlineRadius, LAYOUT.outlineColor)}, 0 ${
            LAYOUT.outlineRadius + 6
          }px 0 #12081f`,
        }}
      >
        {text}
      </span>
      {/* front layer: colorful gradient fill */}
      <span
        style={{
          ...base,
          backgroundImage: `linear-gradient(180deg, ${c1} 15%, ${c2} 90%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {text}
      </span>
    </span>
  );
};
