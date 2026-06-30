const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'assets', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const PHONE = { w: 1080, h: 1920 };
const TAB7 = { w: 1200, h: 1920 };
const TAB10 = { w: 1600, h: 2560 };

function makeScreenshot(width, height, config) {
  const { title, subtitle, emoji, features, bgGrad1, bgGrad2, accentColor } = config;

  const featureItems = (features || []).map((f, i) => {
    const y = 1100 + i * 120;
    const barW = Math.min(width - 160, 800);
    const barX = (width - barW) / 2;
    return `
      <rect x="${barX}" y="${y}" width="${barW}" height="90" rx="20" fill="#fff" opacity="0.15"/>
      <text x="${width/2}" y="${y + 55}" font-family="Arial, sans-serif" font-size="${Math.floor(height/60)}"
            font-weight="700" fill="#fff" text-anchor="middle">${f}</text>
    `;
  }).join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgGrad1}"/>
        <stop offset="100%" style="stop-color:${bgGrad2}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>

    <!-- Status bar area -->
    <rect x="0" y="0" width="${width}" height="80" fill="#000" opacity="0.1"/>

    <!-- Main emoji -->
    <text x="${width/2}" y="${Math.floor(height * 0.28)}" font-size="${Math.floor(height/8)}"
          text-anchor="middle">${emoji}</text>

    <!-- Title -->
    <text x="${width/2}" y="${Math.floor(height * 0.40)}" font-family="Arial, Helvetica, sans-serif"
          font-size="${Math.floor(height/22)}" font-weight="900" fill="#fff" text-anchor="middle"
          letter-spacing="2">${title}</text>

    <!-- Subtitle -->
    <text x="${width/2}" y="${Math.floor(height * 0.46)}" font-family="Arial, sans-serif"
          font-size="${Math.floor(height/48)}" font-weight="600" fill="#E8EAF6" text-anchor="middle"
          opacity="0.9">${subtitle}</text>

    ${featureItems}

    <!-- Bottom branding -->
    <text x="${width/2}" y="${height - 80}" font-family="Arial, sans-serif" font-size="${Math.floor(height/60)}"
          font-weight="700" fill="#fff" text-anchor="middle" opacity="0.5">Brain Box</text>
  </svg>`;
}

const screenshots = [
  {
    name: '01-home',
    title: 'Brain Box',
    subtitle: '7 Classic Strategy Games in One App',
    emoji: '&#x1F9E0;',
    features: [
      '&#x1F3B2; Dots &amp; Boxes  &#x2716; Tic Tac Toe  &#x1F534; Connect Four',
      '&#x1F0CF; Memory Match  &#x1F308; Color Flood',
      '&#x26AB; Reversi (Lv 25)  &#x1F522; 2048 (Lv 50)',
    ],
    bgGrad1: '#5C6BC0', bgGrad2: '#7E57C2',
  },
  {
    name: '02-ai-opponents',
    title: 'Smart AI Rivals',
    subtitle: 'Each with unique personality &amp; trash-talk',
    emoji: '&#x1F916;',
    features: [
      '&#x1F60A; Buddy \u2014 Friendly &amp; encouraging',
      '&#x1F31F; Nova \u2014 Competitive &amp; witty',
      '&#x1F525; Apex \u2014 Ruthless &amp; strategic',
      '&#x1F480; Omega \u2014 The ultimate challenge',
    ],
    bgGrad1: '#E53935', bgGrad2: '#D81B60',
  },
  {
    name: '03-progression',
    title: 'Level Up &amp; Unlock',
    subtitle: '52 levels from Newbie to Brain God',
    emoji: '&#x2B50;',
    features: [
      '&#x1F4CA; Earn XP from every game you play',
      '&#x1F3C5; 18 achievements to collect',
      '&#x2B50; 1-3 star ratings per game',
      '&#x1F513; Unlock Reversi at Lv25, 2048 at Lv50',
    ],
    bgGrad1: '#FF8F00', bgGrad2: '#F4511E',
  },
  {
    name: '04-daily-tournament',
    title: 'Daily &amp; Weekly',
    subtitle: 'Fresh challenges every single day',
    emoji: '&#x1F3C6;',
    features: [
      '&#x1F4C5; New daily challenge every 24 hours',
      '&#x1F525; Build your streak \u2014 don\'t break it!',
      '&#x1F3C6; Weekly tournament with 5 puzzles',
      '&#x1F4E4; Share results with friends',
    ],
    bgGrad1: '#00897B', bgGrad2: '#00695C',
  },
  {
    name: '05-powerups-skins',
    title: 'Power-Ups &amp; Skins',
    subtitle: 'Customize your experience',
    emoji: '&#x26A1;',
    features: [
      '&#x1F440; Peek \u2014 Reveal hidden cards',
      '&#x1F504; Undo \u2014 Take back a move in 2048',
      '&#x2744; Freeze Timer \u2014 Pause the clock',
      '&#x1F3A8; 8 unlockable board skins',
    ],
    bgGrad1: '#6A1B9A', bgGrad2: '#4527A0',
  },
  {
    name: '06-multiplayer-themes',
    title: '2-Player &amp; Themes',
    subtitle: 'Play with friends, make it yours',
    emoji: '&#x1F46B;',
    features: [
      '&#x1F3AE; Pass &amp; play on the same device',
      '&#x1F3A8; 9 beautiful themes to choose from',
      '&#x1F319; Auto dark mode support',
      '&#x1F512; Parental controls for screen time',
    ],
    bgGrad1: '#1565C0', bgGrad2: '#0D47A1',
  },
];

async function generate() {
  for (const s of screenshots) {
    // Phone
    const phoneSvg = makeScreenshot(PHONE.w, PHONE.h, s);
    await sharp(Buffer.from(phoneSvg)).png().toFile(path.join(OUT, `phone-${s.name}.png`));

    // 7-inch tablet
    const tab7Svg = makeScreenshot(TAB7.w, TAB7.h, s);
    await sharp(Buffer.from(tab7Svg)).png().toFile(path.join(OUT, `tab7-${s.name}.png`));

    // 10-inch tablet
    const tab10Svg = makeScreenshot(TAB10.w, TAB10.h, s);
    await sharp(Buffer.from(tab10Svg)).png().toFile(path.join(OUT, `tab10-${s.name}.png`));
  }

  console.log(`Generated ${screenshots.length * 3} screenshots in ${OUT}`);
  console.log(`  Phone:      ${PHONE.w}x${PHONE.h} (9:16)`);
  console.log(`  7" Tablet:  ${TAB7.w}x${TAB7.h} (9:16)`);
  console.log(`  10" Tablet: ${TAB10.w}x${TAB10.h} (9:16)`);
}

generate().catch(console.error);
