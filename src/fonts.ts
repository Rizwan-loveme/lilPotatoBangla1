import {loadFont as loadBangla} from '@remotion/google-fonts/BalooDa2';
import {loadFont as loadEnglish} from '@remotion/google-fonts/Fredoka';

// Baloo Da 2: rounded, playful, full Bengali support (conjuncts shape correctly).
export const BANGLA_FONT = loadBangla('normal', {
  weights: ['800'],
  subsets: ['bengali', 'latin'],
}).fontFamily;

export const ENGLISH_FONT = loadEnglish('normal', {
  weights: ['600'],
  subsets: ['latin'],
}).fontFamily;
