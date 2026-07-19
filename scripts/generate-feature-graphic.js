const sharp = require('sharp');
const path = require('path');

const WIDTH = 1024;
const HEIGHT = 500;

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#5C6BC0"/>
      <stop offset="50%" style="stop-color:#7E57C2"/>
      <stop offset="100%" style="stop-color:#AB47BC"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background gradient -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Decorative dots pattern -->
  ${Array.from({length: 12}, (_, i) => {
    const x = 60 + (i % 6) * 180;
    const y = i < 6 ? 60 : 440;
    const opacity = 0.08 + Math.random() * 0.07;
    const r = 8 + Math.random() * 12;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${opacity}"/>`;
  }).join('\n  ')}

  <!-- Floating game icons background -->
  <text x="80" y="120" font-size="42" opacity="0.12">&#x1F3B2;</text>
  <text x="920" y="140" font-size="38" opacity="0.12">&#x2B50;</text>
  <text x="140" y="420" font-size="36" opacity="0.12">&#x1F3AF;</text>
  <text x="860" y="400" font-size="40" opacity="0.12">&#x1F3C6;</text>
  <text x="500" y="90" font-size="34" opacity="0.10">&#x26A1;</text>
  <text x="750" y="440" font-size="36" opacity="0.10">&#x1F9E9;</text>

  <!-- Main icon/brain emoji -->
  <text x="512" y="180" font-size="80" text-anchor="middle" filter="url(#shadow)">&#x1F9E0;</text>

  <!-- App name -->
  <text x="512" y="270" font-family="Arial, Helvetica, sans-serif" font-size="72" font-weight="900"
        fill="#FFFFFF" text-anchor="middle" letter-spacing="6" filter="url(#shadow)">Brainio</text>

  <!-- Tagline -->
  <text x="512" y="320" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="600"
        fill="#E8EAF6" text-anchor="middle" letter-spacing="2">7 Classic Strategy Games</text>

  <!-- Feature pills row -->
  <!-- Pill 1: AI -->
  <rect x="170" y="355" width="130" height="38" rx="19" fill="#fff" opacity="0.2"/>
  <text x="235" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="700"
        fill="#fff" text-anchor="middle">&#x1F916; Smart AI</text>

  <!-- Pill 2: Daily -->
  <rect x="320" y="355" width="160" height="38" rx="19" fill="#fff" opacity="0.2"/>
  <text x="400" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="700"
        fill="#fff" text-anchor="middle">&#x1F3C6; Daily Challenge</text>

  <!-- Pill 3: 2 Player -->
  <rect x="500" y="355" width="140" height="38" rx="19" fill="#fff" opacity="0.2"/>
  <text x="570" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="700"
        fill="#fff" text-anchor="middle">&#x1F46B; 2-Player</text>

  <!-- Pill 4: XP -->
  <rect x="660" y="355" width="170" height="38" rx="19" fill="#fff" opacity="0.2"/>
  <text x="745" y="380" font-family="Arial, sans-serif" font-size="15" font-weight="700"
        fill="#fff" text-anchor="middle">&#x2B50; 52 Levels &amp; XP</text>

  <!-- Bottom tagline -->
  <text x="512" y="450" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="500"
        fill="#E8EAF6" text-anchor="middle" opacity="0.8">Train your brain. Challenge your friends.</text>
</svg>`;

async function generate() {
  const outPath = path.join(__dirname, '..', 'assets', 'feature-graphic.png');
  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png()
    .toFile(outPath);
  console.log(`Feature graphic generated: ${outPath}`);
}

generate().catch(console.error);
