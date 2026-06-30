const sharp = require('sharp');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');

async function generateSplash() {
  const width = 512;
  const height = 512;

  const svg = `
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" fill="#EDE7F6" rx="0"/>
    <text x="256" y="200" font-family="Arial,sans-serif" font-size="120" text-anchor="middle" fill="#5C6BC0">🧠</text>
    <text x="256" y="310" font-family="Arial,sans-serif" font-weight="900" font-size="56" text-anchor="middle" fill="#5C6BC0">Brain Box</text>
    <text x="256" y="370" font-family="Arial,sans-serif" font-weight="600" font-size="22" text-anchor="middle" fill="#9575CD" letter-spacing="4">CLASSIC STRATEGY GAMES</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(OUT, 'splash-icon.png'));

  console.log('Generated splash-icon.png (512x512)');
}

generateSplash().catch(console.error);
