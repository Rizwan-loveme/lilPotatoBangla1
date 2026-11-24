# Lil Potatoes: English + Animated Colorful Bangla Captions

React + Remotion প্রজেক্ট। `src/lilpotato1.mp4` ভিডিওর উপর **রঙিন অ্যানিমেটেড বাংলা ক্যাপশন** ও **ইংরেজি ক্যাপশন** বসায়,
অডিও থেকে **ভয়েস** ও **ইফেক্ট/মিউজিক** আলাদা করে, এবং GitHub Actions দিয়ে অটো রেন্ডার করে।

## ফোল্ডার স্ট্রাকচার

```
.
├── .github/workflows/render.yml   # GitHub Action: Demucs + Remotion render
├── public/audio/
│   ├── original.wav               # ভিডিও থেকে বের করা মূল অডিও (fallback)
│   ├── voice.wav                  # (অটো তৈরি) শুধু কণ্ঠ
│   └── effects.wav                # (অটো তৈরি) ব্যাকগ্রাউন্ড মিউজিক + সাউন্ড ইফেক্ট
├── scripts/
│   ├── separate-audio.sh          # ffmpeg + Demucs দিয়ে অডিও আলাদা করে
│   └── export-srt.mjs             # captions.json -> .srt (en + bn)
├── src/
│   ├── lilpotato1.mp4             # মূল ভিডিও
│   ├── captions.json              # ক্যাপশন টেক্সট ও টাইমিং (এখানে এডিট করুন)
│   ├── config.ts                  # fps, ভলিউম, রং, লেআউট
│   ├── audioMode.json             # "stems" বা "original" (স্ক্রিপ্ট অটো লেখে)
│   ├── fonts.ts                   # Baloo Da 2 (বাংলা) + Fredoka (English)
│   ├── Composition.tsx            # ভিডিও + অডিও + ক্যাপশন Sequence
│   ├── Root.tsx / index.ts
│   └── components/
│       ├── CaptionBlock.tsx       # একটি ক্যাপশন: বাংলা শব্দগুলো + ইংরেজি পিল
│       └── BanglaWord.tsx         # প্রতিটি শব্দের পপ-ইন, রং, আউটলাইন, উইবল
└── package.json, tsconfig.json, remotion.config.ts
```

## লোকালি চালানো

```bash
npm install
npm run dev        # Remotion Studio: লাইভ প্রিভিউ
npm run render     # out/lilpotato1-captioned.mp4
npm run srt        # out/captions.en.srt + out/captions.bn.srt
```

অডিও আলাদা করতে (ঐচ্ছিক, Python 3.9+ লাগবে):

```bash
pip install torch==2.5.1 torchaudio==2.5.1 --index-url https://download.pytorch.org/whl/cpu
pip install "numpy<2" demucs==4.0.1 soundfile
npm run separate   # public/audio/voice.wav + effects.wav তৈরি হবে
```

## GitHub Action (render.yml)

1. প্রজেক্টটা একটা GitHub repo-তে push করুন (ভিডিও `src/lilpotato1.mp4` নামেই থাকবে)।
2. `main` ব্রাঞ্চে push করলে অথবা **Actions → Render captioned video → Run workflow** চাপলে রেন্ডার শুরু হয়।
3. ধাপগুলো: checkout → Node/Python setup → ffmpeg ও Chrome লাইব্রেরি ইনস্টল → `npm ci` → typecheck →
   Demucs ইনস্টল → অডিও আলাদা (voice/effects) → SRT export → Remotion render → artifact আপলোড।
4. শেষে Actions রানের **Artifacts** থেকে `lilpotato1-captioned` ডাউনলোড করুন
   (MP4, দুইটি SRT, এবং আলাদা করা `voice.wav` / `effects.wav`)।
5. Run workflow-এ `publish_release` টিক দিলে MP4 একটি GitHub Release-এও যুক্ত হবে।
   `separate_audio` বন্ধ করলে Demucs ছাড়াই দ্রুত রেন্ডার হবে।

## অডিও কিভাবে আলাদা হয়

- `ffmpeg` ভিডিও থেকে `original.wav` বের করে।
- **Demucs (htdemucs, 2-stem)** দুইটি ট্র্যাক বানায়:
  - `voice.wav` = ডাব করা কণ্ঠ
  - `effects.wav` = ব্যাকগ্রাউন্ড মিউজিক + সাউন্ড ইফেক্ট (M&E)
- Remotion-এ ভিডিও `muted` থাকে, আর দুই ট্র্যাক আলাদা `<Audio>` হিসেবে চলে।
  `src/config.ts`-এ `VOICE_VOLUME` ও `EFFECTS_VOLUME` দিয়ে আলাদা ভলিউম ঠিক করা যায়।
- Demucs না থাকলে বা ফেইল করলে স্ক্রিপ্ট নিজে `original.wav`-এ ফিরে যায়, রেন্ডার আটকায় না।
- Demucs একটি AI মডেল, তাই কণ্ঠ আর ইফেক্ট একদম নিখুঁত আলাদা নাও হতে পারে।

## ক্যাপশন এডিট করা

`src/captions.json`-এ প্রতিটি ক্যাপশনে `start`/`end` (সেকেন্ড), `en`, `bn` আছে।

| সময় (সে.) | English | বাংলা |
|---|---|---|
| 0.0 – 0.8 | One day | একদিন |
| 0.8 – 2.5 | I got stung by a bee | আমাকে একটা মৌমাছি হুল ফুটিয়ে দিল |
| 2.5 – 3.8 | It hurt | খুব ব্যথা লাগল |
| 3.8 – 5.6 | But not as much as a day | কিন্তু ততটা না, যতটা |
| 5.6 – 10.17 | Without You | তোমাকে ছাড়া একটা দিনে লাগে |

**গুরুত্বপূর্ণ:** এই বাংলা অনুবাদ ভিডিওর স্ক্রিনে থাকা ইংরেজি লেখা থেকে করা। ডাব করা বাংলা অডিও
আমি টেক্সটে রূপান্তর করতে পারিনি, তাই ডাবের শব্দের সঙ্গে মিলিয়ে দেখে দরকারে বদলে নিন।
টাইমিং ভিডিওর ক্যাপশন বদল ও অডিওর নীরবতা থেকে ধরা হয়েছে।

## অ্যানিমেশন ও ডিজাইন

- শব্দগুলো পড়ার ক্রমে একে একে স্প্রিং পপ-ইন করে (স্কেল + উপরে ওঠা + হালকা ঘোরা)।
- প্রতিটি শব্দের আলাদা গ্র্যাডিয়েন্ট রং (`PALETTE` in `config.ts`), মোটা গাঢ় আউটলাইন ও 3D ছায়া।
- যে শব্দ এই মুহূর্তে "বলা হচ্ছে" সেটি একটু বড় হয় ও গ্লো করে।
- শব্দের ভেতর হালকা ভাসা/উইবল, ক্যাপশনের শেষে ফেড-আউট।
- বাংলা শব্দ কখনো অক্ষর ধরে ভাঙা হয় না (যুক্তাক্ষর ঠিক থাকে), শুধু স্পেস ধরে ভাগ হয়।
- ইংরেজি ক্যাপশন ছোট গাঢ় পিল আকারে বাংলার নিচে আসে। বন্ধ করতে `SHOW_ENGLISH = false` করুন।
  (মূল ভিডিওর উপরে আগে থেকেই ইংরেজি লেখা বসানো আছে, তাই দুবার দেখাতে না চাইলে এটি বন্ধ রাখতে পারেন।)
- অবস্থান ও সাইজ বদলাতে `LAYOUT` (`bottom`, `banglaFontSize`, `englishFontSize` ...) এডিট করুন।

## আউটপুট স্পেক

720x1280 (9:16), 30 fps (মূল ভিডিও 12 fps, ক্যাপশন অ্যানিমেশন মসৃণ রাখতে 30 fps), H.264, CRF 18, দৈর্ঘ্য প্রায় 10.17 সেকেন্ড।

## সমস্যা হলে

- **ফন্ট লোড হচ্ছে না:** রেন্ডারের সময় Google Fonts-এ ইন্টারনেট লাগে। অফলাইনে থাকলে ফন্ট ফাইল `public/`-এ রেখে `@font-face` ব্যবহার করুন।
- **Chrome লাইব্রেরি এরর (Linux):** `render.yml`-এর apt লাইনের প্যাকেজগুলো ইনস্টল করুন।
- **Demucs ইনস্টল ধীর:** CPU torch বড় (প্রায় 200 MB), প্রথমবার কয়েক মিনিট লাগতে পারে।
- **ভিডিওর নাম বদলালে:** `src/Composition.tsx`-এর `import videoSrc from './lilpotato1.mp4'` ও `scripts`/`render.yml`-এর পাথ বদলান।
