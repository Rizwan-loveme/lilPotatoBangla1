import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '../Composition';
import {BanglaWord} from './BanglaWord';
import {ENGLISH_FONT} from '../fonts';
import {LAYOUT} from '../config';

type Props = {
  caption: Caption;
  index: number;
  showEnglish: boolean;
};

export const CaptionBlock: React.FC<Props> = ({caption, index, showEnglish}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Split by spaces only (never per character: that would break Bangla conjuncts)
  const words = caption.bn.trim().split(/\s+/).filter(Boolean);
  const lengths = words.map((w) => Array.from(w).length);
  const total = lengths.reduce((a, b) => a + b, 0) || 1;

  // Words are revealed in reading order, spread over ~85% of the caption time
  const speakFrames = durationInFrames * 0.85;
  let acc = 0;
  const speakStart = words.map((_, i) => {
    const s = (acc / total) * speakFrames;
    acc += lengths[i];
    return s;
  });
  const appearFrame = speakStart.map((s) => Math.max(0, Math.round(s) - 2));
  const activeIndex = speakStart.reduce((last, s, i) => (frame >= s ? i : last), 0);

  // English pill
  const enPop = spring({
    frame: frame - 4,
    fps,
    config: {damping: 14, stiffness: 140},
  });
  const enExit = interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: LAYOUT.sidePadding,
        right: LAYOUT.sidePadding,
        bottom: LAYOUT.bottom,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Bangla (animated, colorful) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 14,
          rowGap: 0,
          textAlign: 'center',
        }}
      >
        {words.map((w, i) => (
          <BanglaWord
            key={`${w}-${i}`}
            text={w}
            index={i}
            captionIndex={index}
            appearFrame={appearFrame[i]}
            active={i === activeIndex}
          />
        ))}
      </div>

      {/* English */}
      {showEnglish && (
        <div
          style={{
            fontFamily: ENGLISH_FONT,
            fontWeight: 600,
            fontSize: LAYOUT.englishFontSize,
            color: '#fff',
            background: 'rgba(24, 10, 42, 0.78)',
            padding: '6px 24px 8px',
            borderRadius: 999,
            border: '2px solid rgba(255,255,255,0.35)',
            opacity: Math.min(1, enPop) * enExit,
            transform: `translateY(${interpolate(enPop, [0, 1], [18, 0])}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {caption.en}
        </div>
      )}
    </div>
  );
};
