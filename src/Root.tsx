import React from 'react';
import {Composition} from 'remotion';
import {LilPotatoCaptions, type CaptionsProps} from './Composition';
import captionData from './captions.json';
import {
  DURATION_IN_FRAMES,
  EFFECTS_VOLUME,
  FPS,
  HEIGHT,
  SHOW_ENGLISH,
  VOICE_VOLUME,
  WIDTH,
} from './config';

const defaultProps: CaptionsProps = {
  captions: captionData.captions,
  showEnglish: SHOW_ENGLISH,
  voiceVolume: VOICE_VOLUME,
  effectsVolume: EFFECTS_VOLUME,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LilPotatoCaptions"
      component={LilPotatoCaptions}
      durationInFrames={DURATION_IN_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaultProps}
    />
  );
};
