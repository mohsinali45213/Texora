import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const outDir = path.join(process.cwd(), 'public', 'logo');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Colors based on globals.css
const lightThemeColor = 'hsl(167, 34%, 30%)'; // Primary for light theme
const darkThemeColor = 'hsl(166, 38%, 56%)';  // Primary for dark theme
const monochromeColor = '#ffffff';

const getIconSvg = (color) => `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="160" height="48" rx="24" fill="${color}" opacity="0.9" />
    <rect x="56" y="56" width="48" height="104" rx="24" fill="${color}" />
    <circle cx="136" cy="136" r="24" fill="${color}" opacity="0.6" />
  </g>
</svg>`;

const getLogoSvg = (color, textColor) => `<svg viewBox="0 0 800 240" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(40, 40)">
    <rect x="0" y="0" width="160" height="48" rx="24" fill="${color}" opacity="0.9" />
    <rect x="56" y="56" width="48" height="104" rx="24" fill="${color}" />
    <circle cx="136" cy="136" r="24" fill="${color}" opacity="0.6" />
  </g>
  <text x="240" y="165" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="110" letter-spacing="-0.03em" fill="${textColor}">Texora</text>
</svg>`;

async function generate() {
  const iconDefault = getIconSvg(lightThemeColor);
  const iconLight = getIconSvg(lightThemeColor);
  const iconDark = getIconSvg(darkThemeColor);
  
  const logoDefault = getLogoSvg(lightThemeColor, 'hsl(162, 26%, 12%)'); // light theme text foreground
  const logoLight = getLogoSvg(lightThemeColor, 'hsl(162, 26%, 12%)');
  const logoDark = getLogoSvg(darkThemeColor, 'hsl(90, 12%, 95%)'); // dark theme text foreground
  
  // Write SVGs
  fs.writeFileSync(path.join(outDir, 'icon.svg'), iconDefault);
  fs.writeFileSync(path.join(outDir, 'icon-light.svg'), iconLight);
  fs.writeFileSync(path.join(outDir, 'icon-dark.svg'), iconDark);
  fs.writeFileSync(path.join(outDir, 'logo.svg'), logoDefault);
  fs.writeFileSync(path.join(outDir, 'logo-light.svg'), logoLight);
  fs.writeFileSync(path.join(outDir, 'logo-dark.svg'), logoDark);

  console.log('SVGs generated.');

  // Generate PNGs from SVGs using sharp
  const iconBuffer = Buffer.from(iconDefault);
  const logoBuffer = Buffer.from(logoDefault);
  
  // favicon PNGs
  await sharp(iconBuffer).resize(16, 16).png().toFile(path.join(outDir, 'favicon-16.png'));
  await sharp(iconBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon-32.png'));
  
  // app icons
  await sharp(iconBuffer).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  await sharp(iconBuffer).resize(192, 192).png().toFile(path.join(outDir, 'android-chrome-192.png'));
  await sharp(iconBuffer).resize(512, 512).png().toFile(path.join(outDir, 'android-chrome-512.png'));

  // Write favicon.ico
  const icoBuffer = await pngToIco([
    path.join(outDir, 'favicon-16.png'),
    path.join(outDir, 'favicon-32.png')
  ]);
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuffer);

  // Logo PNGs
  // scale width/height to make a nice logo
  await sharp(logoBuffer).resize({ height: 80 }).png().toFile(path.join(outDir, 'logo.png'));
  await sharp(logoBuffer).resize({ height: 160 }).png().toFile(path.join(outDir, 'logo@2x.png'));

  console.log('PNGs and ICO generated successfully.');
}

generate().catch(console.error);
