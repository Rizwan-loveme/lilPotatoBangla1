#!/usr/bin/env bash
# Separates the video's audio into:
#   public/audio/voice.wav    -> dubbed voice (Demucs "vocals")
#   public/audio/effects.wav  -> background music + sound effects (Demucs "no_vocals" = M&E)
# Always also writes public/audio/original.wav (plain extraction).
# If Demucs is missing or fails, the project falls back to original.wav automatically.
#
# Usage: bash scripts/separate-audio.sh [video]   (default: src/lilpotato1.mp4)
set -uo pipefail

VIDEO="${1:-src/lilpotato1.mp4}"
OUT="public/audio"
TMP=".tmp/demucs"
MODE_FILE="src/audioMode.json"

mkdir -p "$OUT" "$TMP"

echo ">> Extracting original audio from $VIDEO"
ffmpeg -v error -y -i "$VIDEO" -vn -ac 2 -ar 44100 -c:a pcm_s16le "$OUT/original.wav" || {
  echo "!! ffmpeg failed"; exit 1; }

use_original() {
  echo '{"mode":"original"}' > "$MODE_FILE"
  echo ">> Using original audio (no separation)."
  exit 0
}

if ! command -v demucs >/dev/null 2>&1; then
  echo "!! demucs not installed (pip install demucs==4.0.1) -> fallback"
  use_original
fi

echo ">> Running Demucs (htdemucs, 2 stems: vocals / no_vocals)"
if demucs -d cpu -n htdemucs --two-stems=vocals -o "$TMP" "$OUT/original.wav"; then
  SRC="$TMP/htdemucs/original"
  if [ -f "$SRC/vocals.wav" ] && [ -f "$SRC/no_vocals.wav" ]; then
    cp "$SRC/vocals.wav"    "$OUT/voice.wav"
    cp "$SRC/no_vocals.wav" "$OUT/effects.wav"
    echo '{"mode":"stems"}' > "$MODE_FILE"
    echo ">> Done: $OUT/voice.wav + $OUT/effects.wav"
    exit 0
  fi
fi

echo "!! Demucs failed -> fallback"
use_original
