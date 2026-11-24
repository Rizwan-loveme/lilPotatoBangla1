import audioMode from './audioMode.json';

// ---- Video / output settings -------------------------------------------
export const FPS = 30; // source is 12 fps; 30 fps keeps caption animation smooth
export const WIDTH = 720;
export const HEIGHT = 1280;
export const VIDEO_SECONDS = 10.166667; // length of src/lilpotato1.mp4
export const DURATION_IN_FRAMES = Math.ceil(VIDEO_SECONDS * FPS);

// ---- Audio ---------------------------------------------------------------
// "stems"    -> public/audio/voice.wav + public/audio/effects.wav (made by scripts/separate-audio.sh / Demucs)
// "original" -> public/audio/original.wav (plain extracted audio, fallback)
export const AUDIO_MODE = audioMode.mode as 'original' | 'stems';
export const VOICE_VOLUME = 1;
export const EFFECTS_VOLUME = 1;

// ---- Caption look --------------------------------------------------------
export const SHOW_ENGLISH = true;

export const LAYOUT = {
  bottom: 28, // px from bottom edge (English pill sits here, Bangla above it)
  sidePadding: 40,
  banglaFontSize: 66,
  englishFontSize: 30,
  outlineColor: '#24103a',
  outlineRadius: 8,
};

// [top color, bottom color] gradient pairs, cycled per word
export const PALETTE: [string, string][] = [
  ['#FFF36B', '#FFB300'], // sunshine
  ['#7CF7FF', '#1E90FF'], // sky
  ['#FF9AF0', '#FF3D8B'], // candy pink
  ['#C8FF6B', '#1FD18B'], // lime mint
  ['#FFFFFF', '#FFC8F2'], // cloud
  ['#C69BFF', '#7A4DFF'], // grape
];
