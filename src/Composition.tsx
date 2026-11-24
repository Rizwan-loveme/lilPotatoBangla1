import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';
import videoSrc from './lilpotato1.mp4';
import {AUDIO_MODE, FPS} from './config';
import {CaptionBlock} from './components/CaptionBlock';
import './fonts';

export type Caption = {
  start: number;
  end: number;
  en: string;
  bn: string;
};

export type CaptionsProps = {
  captions: Caption[];
  showEnglish: boolean;
  voiceVolume: number;
  effectsVolume: number;
};

export const LilPotatoCaptions: React.FC<CaptionsProps> = ({
  captions,
  showEnglish,
  voiceVolume,
  effectsVolume,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#fff'}}>
      {/* Video is muted: audio is mixed from separate tracks below */}
      <OffthreadVideo
        src={videoSrc}
        muted
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {AUDIO_MODE === 'stems' ? (
        <>
          <Audio src={staticFile('audio/voice.wav')} volume={voiceVolume} />
          <Audio src={staticFile('audio/effects.wav')} volume={effectsVolume} />
        </>
      ) : (
        <Audio src={staticFile('audio/original.wav')} volume={voiceVolume} />
      )}

      {captions.map((caption, i) => {
        const from = Math.round(caption.start * FPS);
        const to = Math.round(caption.end * FPS);
        return (
          <Sequence
            key={`${i}-${caption.start}`}
            from={from}
            durationInFrames={Math.max(1, to - from)}
            layout="none"
          >
            <CaptionBlock caption={caption} index={i} showEnglish={showEnglish} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
