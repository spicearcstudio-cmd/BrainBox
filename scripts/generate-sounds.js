const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 22050;

function generateWav(samples) {
  const numSamples = samples.length;
  const byteRate = SAMPLE_RATE * 2;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const val = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(val * 32767), 44 + i * 2);
  }
  return buffer;
}

function sine(freq, duration, volume = 0.5) {
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const env = Math.min(1, (n - i) / (n * 0.3)) * Math.min(1, i / (n * 0.05));
    samples[i] = Math.sin(2 * Math.PI * freq * i / SAMPLE_RATE) * volume * env;
  }
  return samples;
}

function concat(...arrays) {
  const total = arrays.reduce((s, a) => s + a.length, 0);
  const result = new Float64Array(total);
  let offset = 0;
  for (const a of arrays) { result.set(a, offset); offset += a.length; }
  return result;
}

function mix(...arrays) {
  const len = Math.max(...arrays.map(a => a.length));
  const result = new Float64Array(len);
  for (const a of arrays) for (let i = 0; i < a.length; i++) result[i] += a[i];
  return result;
}

const outDir = path.join(__dirname, '..', 'assets', 'sounds');
fs.mkdirSync(outDir, { recursive: true });

// tap.wav - short click
const tap = sine(800, 0.04, 0.3);
fs.writeFileSync(path.join(outDir, 'tap.wav'), generateWav(Array.from(tap)));

// move.wav - subtle blip
const move = sine(600, 0.06, 0.25);
fs.writeFileSync(path.join(outDir, 'move.wav'), generateWav(Array.from(move)));

// match.wav - bright double ding
const match = concat(sine(880, 0.1, 0.4), sine(1100, 0.15, 0.4));
fs.writeFileSync(path.join(outDir, 'match.wav'), generateWav(Array.from(match)));

// win.wav - ascending happy chime
const win = concat(sine(523, 0.12, 0.4), sine(659, 0.12, 0.4), sine(784, 0.12, 0.4), sine(1047, 0.25, 0.5));
fs.writeFileSync(path.join(outDir, 'win.wav'), generateWav(Array.from(win)));

// lose.wav - descending sad tone
const lose = concat(sine(400, 0.2, 0.35), sine(300, 0.2, 0.35), sine(220, 0.35, 0.3));
fs.writeFileSync(path.join(outDir, 'lose.wav'), generateWav(Array.from(lose)));

// drop.wav - falling disc sound for Connect Four
const drop = sine(350, 0.08, 0.3);
fs.writeFileSync(path.join(outDir, 'drop.wav'), generateWav(Array.from(drop)));

console.log('Sound files generated in assets/sounds/');
