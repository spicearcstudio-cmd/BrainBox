const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

const BG_COLOR = '#0f0f23';
const DOT_COLOR = '#e2e8f0';
const LINE_COLOR = '#e94560';
const BOX_COLOR = 'rgba(233, 69, 96, 0.4)';
const AI_LINE = '#0ea5e9';

async function createIcon(size, filename) {
  const s = size;
  const pad = Math.round(s * 0.18);
  const gridArea = s - pad * 2;
  const cellSize = Math.round(gridArea / 3);
  const dotR = Math.round(s * 0.028);
  const lineW = Math.round(s * 0.018);

  const dots = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cx = pad + c * cellSize;
      const cy = pad + r * cellSize;
      dots.push(`<circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${DOT_COLOR}" />`);
    }
  }

  const lines = [];
  const drawnH = [
    [0, 0], [0, 1],
    [1, 0], [1, 2],
    [2, 1], [2, 2],
    [3, 0], [3, 1], [3, 2],
  ];
  for (const [r, c] of drawnH) {
    const x1 = pad + c * cellSize;
    const y1 = pad + r * cellSize;
    const x2 = pad + (c + 1) * cellSize;
    const color = (r + c) % 3 === 0 ? AI_LINE : LINE_COLOR;
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y1}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`
    );
  }

  const drawnV = [
    [0, 0], [0, 3],
    [1, 0], [1, 1],
    [2, 0], [2, 2], [2, 3],
  ];
  for (const [r, c] of drawnV) {
    const x1 = pad + c * cellSize;
    const y1 = pad + r * cellSize;
    const y2 = pad + (r + 1) * cellSize;
    const color = (r + c) % 2 === 0 ? LINE_COLOR : AI_LINE;
    lines.push(
      `<line x1="${x1}" y1="${y1}" x2="${x1}" y2="${y2}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`
    );
  }

  const boxSvg = `
    <rect x="${pad}" y="${pad}" width="${cellSize}" height="${cellSize}" fill="${BOX_COLOR}" rx="4" />
    <rect x="${pad + cellSize * 2}" y="${pad + cellSize * 2}" width="${cellSize}" height="${cellSize}" fill="rgba(14, 165, 233, 0.35)" rx="4" />
  `;

  const svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${s}" height="${s}" fill="${BG_COLOR}" rx="${Math.round(s * 0.08)}" />
    ${boxSvg}
    ${lines.join('\n    ')}
    ${dots.join('\n    ')}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS_DIR, filename));
  console.log(`Created ${filename} (${s}x${s})`);
}

async function createAdaptiveForeground(size, filename) {
  const s = size;
  const safeZone = Math.round(s * 0.66);
  const offset = Math.round((s - safeZone) / 2);
  const cellSize = Math.round(safeZone / 3);
  const dotR = Math.round(s * 0.022);
  const lineW = Math.round(s * 0.014);

  const dots = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cx = offset + c * cellSize;
      const cy = offset + r * cellSize;
      dots.push(`<circle cx="${cx}" cy="${cy}" r="${dotR}" fill="${DOT_COLOR}" />`);
    }
  }

  const lines = [];
  const drawnH = [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2], [3, 0], [3, 1], [3, 2]];
  for (const [r, c] of drawnH) {
    const x1 = offset + c * cellSize;
    const y = offset + r * cellSize;
    const x2 = offset + (c + 1) * cellSize;
    const color = (r + c) % 3 === 0 ? AI_LINE : LINE_COLOR;
    lines.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`);
  }

  const drawnV = [[0, 0], [0, 3], [1, 0], [1, 1], [2, 0], [2, 2], [2, 3]];
  for (const [r, c] of drawnV) {
    const x = offset + c * cellSize;
    const y1 = offset + r * cellSize;
    const y2 = offset + (r + 1) * cellSize;
    const color = (r + c) % 2 === 0 ? LINE_COLOR : AI_LINE;
    lines.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`);
  }

  const boxSvg = `
    <rect x="${offset}" y="${offset}" width="${cellSize}" height="${cellSize}" fill="${BOX_COLOR}" rx="4" />
    <rect x="${offset + cellSize * 2}" y="${offset + cellSize * 2}" width="${cellSize}" height="${cellSize}" fill="rgba(14, 165, 233, 0.35)" rx="4" />
  `;

  const svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
    ${boxSvg}
    ${lines.join('\n    ')}
    ${dots.join('\n    ')}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS_DIR, filename));
  console.log(`Created ${filename} (${s}x${s})`);
}

async function createSolidColor(size, color, filename) {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${color}" />
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS_DIR, filename));
  console.log(`Created ${filename} (${size}x${size})`);
}

async function createMonochrome(size, filename) {
  const s = size;
  const safeZone = Math.round(s * 0.66);
  const offset = Math.round((s - safeZone) / 2);
  const cellSize = Math.round(safeZone / 3);
  const dotR = Math.round(s * 0.022);
  const lineW = Math.round(s * 0.014);

  const dots = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      dots.push(`<circle cx="${offset + c * cellSize}" cy="${offset + r * cellSize}" r="${dotR}" fill="white" />`);
    }
  }

  const lines = [];
  const drawnH = [[0, 0], [0, 1], [1, 0], [3, 0], [3, 1], [3, 2]];
  for (const [r, c] of drawnH) {
    lines.push(`<line x1="${offset + c * cellSize}" y1="${offset + r * cellSize}" x2="${offset + (c + 1) * cellSize}" y2="${offset + r * cellSize}" stroke="white" stroke-width="${lineW}" stroke-linecap="round" />`);
  }
  const drawnV = [[0, 0], [0, 3], [2, 0], [2, 3]];
  for (const [r, c] of drawnV) {
    lines.push(`<line x1="${offset + c * cellSize}" y1="${offset + r * cellSize}" x2="${offset + c * cellSize}" y2="${offset + (r + 1) * cellSize}" stroke="white" stroke-width="${lineW}" stroke-linecap="round" />`);
  }

  const svg = `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
    ${lines.join('\n    ')}
    ${dots.join('\n    ')}
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ASSETS_DIR, filename));
  console.log(`Created ${filename} (${s}x${s})`);
}

async function main() {
  const fs = require('fs');
  if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

  await createIcon(1024, 'icon.png');
  await createAdaptiveForeground(1024, 'android-icon-foreground.png');
  await createSolidColor(1024, BG_COLOR, 'android-icon-background.png');
  await createMonochrome(1024, 'android-icon-monochrome.png');
  await createIcon(48, 'favicon.png');

  console.log('\nAll icons generated in assets/');
}

main().catch(console.error);
