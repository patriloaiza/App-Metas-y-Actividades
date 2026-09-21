const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Create exact SVG matching the user's uploaded "Logo crea y monetiza.png"
// Dimensions: 1200 x 800 (ratio 3:2 like the uploaded image)
const generateSvg = (bg = '#000000') => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <!-- 3D Red Ribbon Gradients for C -->
    <linearGradient id="redGradTop" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#EF4444" />
      <stop offset="50%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#B91C1C" />
    </linearGradient>

    <linearGradient id="redGradDark" x1="0%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#991B1B" />
      <stop offset="100%" stop-color="#651313" />
    </linearGradient>

    <linearGradient id="redGradArrow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#EF4444" />
    </linearGradient>
  </defs>

  ${bg ? `<rect width="1200" height="800" fill="${bg}" />` : ''}

  <g transform="translate(140, 220)">
    <!-- ==================== CM ISOTIPO ==================== -->
    <g id="cm-symbol">
      <!-- 1. C Inner Dark Red Shadow/Fold (Giving 3D depth) -->
      <path
        d="M 125 72
           C 112 55 92 45 70 45
           C 35 45 15 72 15 110
           C 15 150 38 180 75 180
           C 98 180 118 168 130 148
           L 100 128
           C 92 138 82 144 72 144
           C 52 144 42 128 42 110
           C 42 92 52 76 72 76
           C 84 76 95 84 102 94
           Z"
        fill="url(#redGradDark)"
      />

      <!-- 2. C Main Red Ribbon (Upper & Outer Arc) -->
      <path
        d="M 72 10
           C 122 10 162 48 162 100
           C 162 118 156 135 146 150
           L 112 128
           C 120 118 124 108 124 98
           C 124 68 100 44 72 44
           C 42 44 20 68 20 102
           C 20 118 26 134 36 146
           L 6 168
           C -8 148 -14 125 -14 100
           C -14 46 25 10 72 10
           Z"
        fill="url(#redGradTop)"
      />

      <!-- 3. C Lower White Swoosh (Curving dynamically along bottom) -->
      <path
        d="M -6 152
           C 8 186 38 214 80 214
           C 118 214 150 192 168 158
           L 132 140
           C 120 164 100 178 78 178
           C 50 178 28 160 18 136
           Z"
        fill="#FFFFFF"
      />

      <!-- 4. M Left Intersecting Dark Red Ribbon -->
      <path
        d="M 146 64
           L 182 118
           L 154 158
           L 118 108
           Z"
        fill="url(#redGradDark)"
      />

      <!-- 5. M Main Red Diagonal (Slanted inner arm) -->
      <path
        d="M 148 64
           L 194 135
           L 214 105
           L 172 45
           Z"
        fill="url(#redGradTop)"
      />

      <!-- 6. M Central White Fold (The bold upward white structure) -->
      <path
        d="M 235 68
           L 182 148
           L 198 172
           L 240 108
           L 240 212
           L 276 212
           L 276 68
           Z"
        fill="#FFFFFF"
      />

      <!-- 7. M Rising Red Arrow (Growth & Monetize Indicator) -->
      <!-- Arrow diagonal shaft -->
      <polygon
        points="276,140 276,80 318,12 342,28 298,110"
        fill="url(#redGradArrow)"
      />

      <!-- Arrowhead -->
      <polygon
        points="265,12 330,12 330,76 308,54 286,68"
        fill="#DC2626"
      />
    </g>

    <!-- ==================== TYPOGRAPHY ==================== -->
    <g id="typography" transform="translate(340, 15)">
      <!-- Line 1: CREA Y -->
      <text
        x="0"
        y="95"
        fill="#FFFFFF"
        font-family="'Montserrat', 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        font-weight="800"
        font-size="82"
        letter-spacing="4"
      >CREA Y</text>

      <!-- Line 2: MONETIZA -->
      <text
        x="0"
        y="180"
        fill="#FFFFFF"
        font-family="'Montserrat', 'Outfit', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        font-weight="900"
        font-size="94"
        letter-spacing="2"
      >MONETIZA</text>

      <!-- Red underline rule exactly spanning MONETIZA -->
      <rect
        x="2"
        y="198"
        width="476"
        height="9"
        fill="#DC2626"
      />
    </g>
  </g>
</svg>`;

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Write SVG on black background
  const svgBlack = generateSvg('#000000');
  fs.writeFileSync(path.join(publicDir, 'logo-crea-y-monetiza.svg'), svgBlack);

  // 2. Write SVG with transparent background
  const svgTrans = generateSvg('');
  fs.writeFileSync(path.join(publicDir, 'logo-crea-y-monetiza-transparent.svg'), svgTrans);

  // 3. Render High-Res PNG with sharp
  const bufferBlack = Buffer.from(svgBlack);
  await sharp(bufferBlack)
    .resize(1600, 1066)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo-crea-y-monetiza.png'));

  // Also write with exact name: "Logo crea y monetiza.png"
  await sharp(bufferBlack)
    .resize(1600, 1066)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'Logo crea y monetiza.png'));

  // Also write "logo.png"
  await sharp(bufferBlack)
    .resize(1600, 1066)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, 'logo.png'));

  console.log('Successfully generated:');
  console.log(' - public/logo-crea-y-monetiza.svg');
  console.log(' - public/logo-crea-y-monetiza-transparent.svg');
  console.log(' - public/logo-crea-y-monetiza.png');
  console.log(' - public/Logo crea y monetiza.png');
  console.log(' - public/logo.png');
}

main().catch(console.error);
