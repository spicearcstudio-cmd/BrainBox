const sharp = require('sharp');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');

async function generateIcons() {
  const iconSvg = `
  <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
    <rect width="1024" height="1024" rx="220" fill="#5C6BC0"/>
    <rect x="40" y="40" width="944" height="944" rx="190" fill="#7986CB" opacity="0.3"/>
    <text x="512" y="440" font-family="Arial,sans-serif" font-size="300" text-anchor="middle" fill="white">🧠</text>
    <text x="512" y="700" font-family="Arial,sans-serif" font-weight="900" font-size="160" text-anchor="middle" fill="white" letter-spacing="-5">BRAIN</text>
    <text x="512" y="860" font-family="Arial,sans-serif" font-weight="900" font-size="160" text-anchor="middle" fill="#E8EAF6" letter-spacing="-5">BOX</text>
  </svg>`;

  // Main icon 1024x1024
  await sharp(Buffer.from(iconSvg)).resize(1024, 1024).png().toFile(path.join(OUT, 'icon.png'));
  console.log('Generated icon.png (1024x1024)');

  // Adaptive icon foreground (with safe zone padding)
  const fgSvg = `
  <svg width="108" height="108" xmlns="http://www.w3.org/2000/svg">
    <text x="54" y="42" font-family="Arial,sans-serif" font-size="28" text-anchor="middle" fill="#5C6BC0">🧠</text>
    <text x="54" y="68" font-family="Arial,sans-serif" font-weight="900" font-size="16" text-anchor="middle" fill="#5C6BC0">BRAIN</text>
    <text x="54" y="86" font-family="Arial,sans-serif" font-weight="900" font-size="16" text-anchor="middle" fill="#7986CB">BOX</text>
  </svg>`;

  await sharp(Buffer.from(fgSvg)).resize(432, 432).png().toFile(path.join(OUT, 'android-icon-foreground.png'));
  console.log('Generated android-icon-foreground.png');

  // Adaptive icon background (solid color)
  const bgSvg = `<svg width="432" height="432" xmlns="http://www.w3.org/2000/svg"><rect width="432" height="432" fill="#EDE7F6"/></svg>`;
  await sharp(Buffer.from(bgSvg)).resize(432, 432).png().toFile(path.join(OUT, 'android-icon-background.png'));
  console.log('Generated android-icon-background.png');

  // Monochrome icon
  const monoSvg = `
  <svg width="108" height="108" xmlns="http://www.w3.org/2000/svg">
    <rect width="108" height="108" fill="white"/>
    <text x="54" y="64" font-family="Arial,sans-serif" font-weight="900" font-size="24" text-anchor="middle" fill="black">BB</text>
  </svg>`;

  await sharp(Buffer.from(monoSvg)).resize(432, 432).png().toFile(path.join(OUT, 'android-icon-monochrome.png'));
  console.log('Generated android-icon-monochrome.png');

  // Favicon
  await sharp(Buffer.from(iconSvg)).resize(48, 48).png().toFile(path.join(OUT, 'favicon.png'));
  console.log('Generated favicon.png');
}

generateIcons().catch(console.error);
