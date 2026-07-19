const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'assets', 'screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const PHONE = { w: 1080, h: 1920 };
const TAB7 = { w: 1200, h: 1920 };
const TAB10 = { w: 1600, h: 2560 };

function drawDotsBoard(cx, cy, size) {
  const grid = 4;
  const gap = size / (grid - 1);
  const ox = cx - size / 2;
  const oy = cy - size / 2;
  let s = '';
  const lines = [
    [0,0,'h'],[0,1,'h'],[1,0,'h'],[1,2,'h'],[2,0,'h'],[2,1,'h'],[3,1,'h'],[3,2,'h'],
    [0,0,'v'],[0,2,'v'],[1,0,'v'],[1,1,'v'],[2,1,'v'],[2,2,'v'],[0,3,'v'],[1,3,'v'],
  ];
  for (const [r, c, t] of lines) {
    const clr = Math.random() > 0.5 ? '#5C6BC0' : '#FF7043';
    if (t === 'h') {
      s += `<rect x="${ox + c * gap + 8}" y="${oy + r * gap - 3}" width="${gap - 16}" height="6" rx="3" fill="${clr}" opacity="0.9"/>`;
    } else {
      s += `<rect x="${ox + c * gap - 3}" y="${oy + r * gap + 8}" width="6" height="${gap - 16}" rx="3" fill="${clr}" opacity="0.9"/>`;
    }
  }
  const boxes = [[0,0,'#5C6BC025'],[1,1,'#FF704325'],[0,2,'#5C6BC025']];
  for (const [r, c, clr] of boxes) {
    s += `<rect x="${ox + c * gap + 8}" y="${oy + r * gap + 8}" width="${gap - 16}" height="${gap - 16}" rx="6" fill="${clr}"/>`;
  }
  for (let r = 0; r < grid; r++)
    for (let c = 0; c < grid; c++)
      s += `<circle cx="${ox + c * gap}" cy="${oy + r * gap}" r="7" fill="#37474F"/>`;
  return s;
}

function drawTicTacToe(cx, cy, size) {
  const s3 = size / 3;
  const ox = cx - size / 2;
  const oy = cy - size / 2;
  let s = '';
  s += `<line x1="${ox+s3}" y1="${oy}" x2="${ox+s3}" y2="${oy+size}" stroke="#D1C4E9" stroke-width="4"/>`;
  s += `<line x1="${ox+s3*2}" y1="${oy}" x2="${ox+s3*2}" y2="${oy+size}" stroke="#D1C4E9" stroke-width="4"/>`;
  s += `<line x1="${ox}" y1="${oy+s3}" x2="${ox+size}" y2="${oy+s3}" stroke="#D1C4E9" stroke-width="4"/>`;
  s += `<line x1="${ox}" y1="${oy+s3*2}" x2="${ox+size}" y2="${oy+s3*2}" stroke="#D1C4E9" stroke-width="4"/>`;
  const marks = [[0,0,'X'],[1,1,'X'],[2,0,'X'],[0,2,'O'],[1,0,'O'],[2,2,'O'],[0,1,'O']];
  for (const [r, c, m] of marks) {
    const mx = ox + c * s3 + s3/2;
    const my = oy + r * s3 + s3/2;
    if (m === 'X') {
      const d = s3 * 0.28;
      s += `<line x1="${mx-d}" y1="${my-d}" x2="${mx+d}" y2="${my+d}" stroke="#5C6BC0" stroke-width="5" stroke-linecap="round"/>`;
      s += `<line x1="${mx+d}" y1="${my-d}" x2="${mx-d}" y2="${my+d}" stroke="#5C6BC0" stroke-width="5" stroke-linecap="round"/>`;
    } else {
      s += `<circle cx="${mx}" cy="${my}" r="${s3*0.28}" fill="none" stroke="#FF7043" stroke-width="5"/>`;
    }
  }
  return s;
}

function drawMemoryCards(cx, cy, size) {
  const cols = 4, rows = 3;
  const gap = 6;
  const cw = (size - gap * (cols - 1)) / cols;
  const ch = cw * 1.2;
  const totalH = rows * ch + (rows - 1) * gap;
  const ox = cx - size / 2;
  const oy = cy - totalH / 2;
  let s = '';
  const symbols = ['A','B','C','A','B','C','D','E','D','E','F','F'];
  const flipped = [0, 2, 5, 6, 9, 10];
  const matched = [0, 6];
  const emojis = { A: '🌟', B: '🎯', C: '🎪', D: '🎨', E: '🎭', F: '🎵' };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = ox + c * (cw + gap);
      const y = oy + r * (ch + gap);
      const show = flipped.includes(i);
      const match = matched.includes(i);
      const bg = match ? '#5C6BC020' : show ? '#FFFFFF' : '#5C6BC0';
      const border = match ? '#5C6BC0' : '#D1C4E9';
      s += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="10" fill="${bg}" stroke="${border}" stroke-width="2"/>`;
      if (show) {
        s += `<text x="${x+cw/2}" y="${y+ch/2+8}" font-size="${cw*0.35}" text-anchor="middle" fill="#5C6BC0" font-weight="700">${symbols[i]}</text>`;
      } else {
        s += `<text x="${x+cw/2}" y="${y+ch/2+6}" font-size="${cw*0.3}" text-anchor="middle" fill="#fff" font-weight="700">?</text>`;
      }
    }
  return s;
}

function draw2048Board(cx, cy, size) {
  const grid = 4, gap = 8;
  const cellSz = (size - gap * (grid + 1)) / grid;
  const ox = cx - size / 2;
  const oy = cy - size / 2;
  let s = `<rect x="${ox}" y="${oy}" width="${size}" height="${size}" rx="12" fill="#BBADA0"/>`;
  const vals = [2,4,0,2, 8,16,4,0, 32,8,2,4, 64,32,16,8];
  const colors = {0:'#CDC1B4',2:'#EEE4DA',4:'#EDE0C8',8:'#F2B179',16:'#F59563',32:'#F67C5F',64:'#F65E3B'};
  const textColors = {0:'#776E65',2:'#776E65',4:'#776E65',8:'#F9F6F2',16:'#F9F6F2',32:'#F9F6F2',64:'#F9F6F2'};
  for (let r = 0; r < grid; r++)
    for (let c = 0; c < grid; c++) {
      const v = vals[r * grid + c];
      const x = ox + gap + c * (cellSz + gap);
      const y = oy + gap + r * (cellSz + gap);
      s += `<rect x="${x}" y="${y}" width="${cellSz}" height="${cellSz}" rx="8" fill="${colors[v] || '#3C3A32'}"/>`;
      if (v > 0) {
        const fs = v >= 10 ? cellSz * 0.3 : cellSz * 0.38;
        s += `<text x="${x+cellSz/2}" y="${y+cellSz/2+fs*0.35}" font-size="${fs}" text-anchor="middle" fill="${textColors[v] || '#F9F6F2'}" font-weight="900" font-family="Arial, sans-serif">${v}</text>`;
      }
    }
  return s;
}

function makePhoneFrame(width, height) {
  return `
    <rect x="0" y="0" width="${width}" height="80" fill="#000" opacity="0.08"/>
    <circle cx="${width/2}" cy="40" r="8" fill="#000" opacity="0.05"/>
    <rect x="${width*0.35}" y="${height-60}" width="${width*0.3}" height="5" rx="3" fill="#000" opacity="0.1"/>
  `;
}

function makeScreenshot(width, height, config) {
  const { title, subtitle, bgGrad1, bgGrad2, gameBoard, headerTitle, scoreSection, featureList } = config;
  const scale = height / 1920;

  let boardContent = '';
  const boardCx = width / 2;
  const boardCy = height * 0.48;
  const boardSize = Math.min(width * 0.7, 500 * scale);

  if (gameBoard === 'dots') boardContent = drawDotsBoard(boardCx, boardCy, boardSize);
  else if (gameBoard === 'ttt') boardContent = drawTicTacToe(boardCx, boardCy, boardSize);
  else if (gameBoard === 'memory') boardContent = drawMemoryCards(boardCx, boardCy, boardSize);
  else if (gameBoard === '2048') boardContent = draw2048Board(boardCx, boardCy, boardSize);

  const headerH = 140 * scale;
  const headerContent = headerTitle ? `
    <rect x="0" y="${80*scale}" width="${width}" height="${headerH}" fill="#fff" opacity="0.08"/>
    <circle cx="${50*scale}" cy="${80*scale + headerH/2}" r="${20*scale}" fill="#fff" opacity="0.15"/>
    <text x="${50*scale}" y="${80*scale + headerH/2 + 6*scale}" font-size="${16*scale}" text-anchor="middle" fill="#fff">←</text>
    <text x="${width/2}" y="${80*scale + headerH/2 + 7*scale}" font-family="Arial, sans-serif" font-size="${22*scale}"
          font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">${headerTitle}</text>
  ` : '';

  const scoreContent = scoreSection ? `
    <rect x="${width*0.08}" y="${(headerH + 100)*scale}" width="${width*0.38}" height="${80*scale}" rx="${16*scale}" fill="#fff" opacity="0.15" stroke="#fff" stroke-width="2" stroke-opacity="0.3"/>
    <text x="${width*0.27}" y="${(headerH + 130)*scale}" font-family="Arial, sans-serif" font-size="${14*scale}" font-weight="800" fill="#BBDEFB" text-anchor="middle">YOU</text>
    <text x="${width*0.27}" y="${(headerH + 160)*scale}" font-family="Arial, sans-serif" font-size="${32*scale}" font-weight="900" fill="#fff" text-anchor="middle">${scoreSection[0]}</text>
    <text x="${width*0.5}" y="${(headerH + 148)*scale}" font-family="Arial, sans-serif" font-size="${14*scale}" font-weight="700" fill="#fff" text-anchor="middle" opacity="0.5">VS</text>
    <rect x="${width*0.54}" y="${(headerH + 100)*scale}" width="${width*0.38}" height="${80*scale}" rx="${16*scale}" fill="#fff" opacity="0.15" stroke="#fff" stroke-width="2" stroke-opacity="0.3"/>
    <text x="${width*0.73}" y="${(headerH + 130)*scale}" font-family="Arial, sans-serif" font-size="${14*scale}" font-weight="800" fill="#FFCDD2" text-anchor="middle">AI</text>
    <text x="${width*0.73}" y="${(headerH + 160)*scale}" font-family="Arial, sans-serif" font-size="${32*scale}" font-weight="900" fill="#fff" text-anchor="middle">${scoreSection[1]}</text>
  ` : '';

  const features = (featureList || []).map((f, i) => {
    const y = height * 0.72 + i * (65 * scale);
    const barW = width * 0.82;
    const barX = (width - barW) / 2;
    return `
      <rect x="${barX}" y="${y}" width="${barW}" height="${50*scale}" rx="${14*scale}" fill="#fff" opacity="0.12"/>
      <text x="${width/2}" y="${y + 32*scale}" font-family="Arial, sans-serif" font-size="${17*scale}"
            font-weight="700" fill="#fff" text-anchor="middle">${f}</text>
    `;
  }).join('');

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" style="stop-color:${bgGrad1}"/>
        <stop offset="100%" style="stop-color:${bgGrad2}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    ${makePhoneFrame(width, height)}
    ${headerContent}
    ${scoreContent}

    ${gameBoard ? `
      <rect x="${boardCx - boardSize/2 - 15*scale}" y="${boardCy - boardSize/2 - 15*scale}"
            width="${boardSize + 30*scale}" height="${boardSize + 30*scale}" rx="${18*scale}"
            fill="#fff" opacity="0.08"/>
    ` : ''}
    ${boardContent}

    ${!gameBoard ? `
      <text x="${width/2}" y="${height*0.32}" font-size="${80*scale}" text-anchor="middle">${config.emoji || ''}</text>
      <text x="${width/2}" y="${height*0.42}" font-family="Arial, Helvetica, sans-serif"
            font-size="${42*scale}" font-weight="900" fill="#fff" text-anchor="middle" letter-spacing="2">${title}</text>
      <text x="${width/2}" y="${height*0.47}" font-family="Arial, sans-serif"
            font-size="${22*scale}" font-weight="600" fill="#E8EAF6" text-anchor="middle" opacity="0.9">${subtitle}</text>
    ` : ''}

    ${features}

    <text x="${width/2}" y="${height - 50*scale}" font-family="Arial, sans-serif" font-size="${16*scale}"
          font-weight="800" fill="#fff" text-anchor="middle" opacity="0.4" letter-spacing="3">BRAINIO</text>
  </svg>`;
}

const screenshots = [
  {
    name: '01-home',
    title: 'Brainio',
    subtitle: '7 Classic Strategy Games',
    emoji: '&#x1F9E0;',
    featureList: [
      '&#x25A6; Dots &amp; Boxes  &#x2716; Tic Tac Toe  &#x25CF; Connect Four',
      '&#x2663; Memory Match  &#x25D0; Color Flood',
      '&#x25D1; Reversi (Unlock Lv25)  &#xB2; 2048 (Unlock Lv50)',
      '&#x1F3C6; Daily Challenges  &#x26A1; Power-Ups  &#x1F3A8; 8 Skins',
    ],
    bgGrad1: '#5C6BC0', bgGrad2: '#7E57C2',
  },
  {
    name: '02-dots-gameplay',
    headerTitle: 'DOTS &amp; BOXES',
    gameBoard: 'dots',
    scoreSection: ['5', '3'],
    featureList: [
      '&#x1F916; Smart AI with personality &amp; trash talk',
      '&#x1F4CA; Grids from 4&#xD7;4 to 7&#xD7;7',
    ],
    bgGrad1: '#5C6BC0', bgGrad2: '#3949AB',
  },
  {
    name: '03-tictactoe-gameplay',
    headerTitle: 'TIC TAC TOE',
    gameBoard: 'ttt',
    scoreSection: ['3', '2'],
    featureList: [
      '&#x1F46B; Local 2-player pass &amp; play',
      '&#x23F1; Speed mode with bonus XP',
    ],
    bgGrad1: '#E53935', bgGrad2: '#C62828',
  },
  {
    name: '04-memory-gameplay',
    headerTitle: 'MEMORY MATCH',
    gameBoard: 'memory',
    featureList: [
      '&#x1F440; Peek power-up reveals hidden cards',
      '&#x2B50; Earn 3 stars for perfect games',
    ],
    bgGrad1: '#AB47BC', bgGrad2: '#7B1FA2',
  },
  {
    name: '05-2048-gameplay',
    headerTitle: '2048',
    gameBoard: '2048',
    featureList: [
      '&#x1F504; Undo power-up for tricky moments',
      '&#x1F3C6; 52 levels from Newbie to Brain God',
    ],
    bgGrad1: '#FF7043', bgGrad2: '#E64A19',
  },
  {
    name: '06-features',
    title: 'Loaded with Features',
    subtitle: 'Everything you need',
    emoji: '&#x2B50;',
    featureList: [
      '&#x1F916; 4 AI personalities: Buddy, Nova, Apex, Omega',
      '&#x26A1; Power-Ups: Peek, Undo, Extra Move, Freeze',
      '&#x1F3A8; 9 themes + 8 board skins + auto dark mode',
      '&#x1F4C5; Daily challenges &amp; weekly tournaments',
      '&#x1F46B; 2-Player mode &amp; parental controls',
    ],
    bgGrad1: '#00897B', bgGrad2: '#00695C',
  },
];

async function generate() {
  for (const s of screenshots) {
    const phoneSvg = makeScreenshot(PHONE.w, PHONE.h, s);
    await sharp(Buffer.from(phoneSvg)).png().toFile(path.join(OUT, `phone-${s.name}.png`));

    const tab7Svg = makeScreenshot(TAB7.w, TAB7.h, s);
    await sharp(Buffer.from(tab7Svg)).png().toFile(path.join(OUT, `tab7-${s.name}.png`));

    const tab10Svg = makeScreenshot(TAB10.w, TAB10.h, s);
    await sharp(Buffer.from(tab10Svg)).png().toFile(path.join(OUT, `tab10-${s.name}.png`));
  }

  console.log(`Generated ${screenshots.length * 3} screenshots in ${OUT}`);
  console.log(`  Phone:      ${PHONE.w}x${PHONE.h} (9:16)`);
  console.log(`  7" Tablet:  ${TAB7.w}x${TAB7.h} (9:16)`);
  console.log(`  10" Tablet: ${TAB10.w}x${TAB10.h} (9:16)`);
}

generate().catch(console.error);
