const sharp = require('sharp');
const path = require('path');

async function main() {
  const w = 1284;
  const h = 2778;
  const dotR = 12;
  const lineW = 8;
  const cellSize = 100;
  const gridOffset = { x: (w - 3 * cellSize) / 2, y: h / 2 - 3 * cellSize / 2 - 80 };
  const BG = '#0f0f23';
  const DOT = '#e2e8f0';
  const LINE = '#e94560';
  const AI = '#0ea5e9';

  const dots = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      dots.push(`<circle cx="${gridOffset.x + c * cellSize}" cy="${gridOffset.y + r * cellSize}" r="${dotR}" fill="${DOT}" />`);
    }
  }

  const lines = [];
  const hLines = [[0, 0], [0, 1], [1, 2], [2, 0], [3, 1], [3, 2]];
  for (const [r, c] of hLines) {
    const x1 = gridOffset.x + c * cellSize;
    const y = gridOffset.y + r * cellSize;
    const x2 = gridOffset.x + (c + 1) * cellSize;
    const color = (r + c) % 2 === 0 ? LINE : AI;
    lines.push(`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`);
  }
  const vLines = [[0, 0], [1, 0], [0, 3], [2, 3]];
  for (const [r, c] of vLines) {
    const x = gridOffset.x + c * cellSize;
    const y1 = gridOffset.y + r * cellSize;
    const y2 = gridOffset.y + (r + 1) * cellSize;
    const color = (r + c) % 2 === 0 ? LINE : AI;
    lines.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${color}" stroke-width="${lineW}" stroke-linecap="round" />`);
  }

  const titleY = gridOffset.y + 3 * cellSize + 80;
  const subtitleY = titleY + 50;

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${w}" height="${h}" fill="${BG}" />
    <rect x="${gridOffset.x}" y="${gridOffset.y}" width="${cellSize}" height="${cellSize}" fill="rgba(233, 69, 96, 0.25)" rx="6" />
    ${lines.join('\n    ')}
    ${dots.join('\n    ')}
    <text x="${w / 2}" y="${titleY}" text-anchor="middle" fill="#f1f5f9" font-family="system-ui, sans-serif" font-size="52" font-weight="800">Dots &amp; Boxes</text>
    <text x="${w / 2}" y="${subtitleY}" text-anchor="middle" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="22" font-weight="500" letter-spacing="4">STRATEGY GAME</text>
  </svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(__dirname, '..', 'assets', 'splash-icon.png'));
  console.log('Created splash-icon.png');
}

main().catch(console.error);
