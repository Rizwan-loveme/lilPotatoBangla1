// Exports src/captions.json -> out/captions.en.srt and out/captions.bn.srt
import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('src/captions.json', 'utf8'));
const pad = (n, l = 2) => String(n).padStart(l, '0');
const ts = (sec) => {
  const ms = Math.round(sec * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${pad(h)}:${pad(m)}:${pad(s)},${pad(ms % 1000, 3)}`;
};

fs.mkdirSync('out', {recursive: true});
for (const lang of ['en', 'bn']) {
  const srt = data.captions
    .map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c[lang]}\n`)
    .join('\n');
  fs.writeFileSync(`out/captions.${lang}.srt`, srt, 'utf8');
  console.log(`wrote out/captions.${lang}.srt`);
}
