const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/logo');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Brand Colors based on the globals.css (HSL: 167 34% 30% -> #32665B)
const C_PRIMARY = '#32665B';
const C_PRIMARY_LIGHT = '#4CA390';
const C_PRIMARY_DARK = '#1C3A33';
const C_FOREGROUND = '#172722';
const C_FOREGROUND_DARK = '#FAFAF9';

// The Icon: A sleek, modern isometric fabric roll / structural 'T'
const IconMarkup = `
  <!-- Top Layer (Lightest) -->
  <path d="M24 6L6 15L24 24L42 15L24 6Z" fill="url(#gradTop)" />
  <!-- Left Layer (Darkest) -->
  <path d="M6 15V33L24 42V24L6 15Z" fill="url(#gradLeft)" />
  <!-- Right Layer (Midtone) -->
  <path d="M42 15V33L24 42V24L42 15Z" fill="url(#gradRight)" />
  
  <!-- Fabric Fold Accents (Lines to give textile/weaving feel) -->
  <path d="M6 21L24 30L42 21" stroke="white" stroke-width="1.5" stroke-opacity="0.15" stroke-linejoin="round" fill="none" />
  <path d="M6 27L24 36L42 27" stroke="white" stroke-width="1.5" stroke-opacity="0.15" stroke-linejoin="round" fill="none" />
  <path d="M24 24V42" stroke="white" stroke-width="2" stroke-opacity="0.2" fill="none" />
`;

const DefsMarkup = `
  <defs>
    <linearGradient id="gradTop" x1="6" y1="6" x2="42" y2="24" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C_PRIMARY_LIGHT}"/>
      <stop offset="1" stop-color="${C_PRIMARY}"/>
    </linearGradient>
    <linearGradient id="gradLeft" x1="6" y1="15" x2="24" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C_PRIMARY_DARK}"/>
      <stop offset="1" stop-color="#122521"/>
    </linearGradient>
    <linearGradient id="gradRight" x1="24" y1="24" x2="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C_PRIMARY}"/>
      <stop offset="1" stop-color="${C_PRIMARY_DARK}"/>
    </linearGradient>
  </defs>
`;

const wordmarkMarkup = (color) => `
  <text x="56" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="24" letter-spacing="-0.03em" fill="${color}">Texora</text>
`;

const svgs = {
  // 1. Primary Logo (Icon + Text, adapting color for light mode)
  'logo.svg': `
<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${IconMarkup}
  ${wordmarkMarkup(C_FOREGROUND)}
  ${DefsMarkup}
</svg>`,

  // 2. Dark Mode Logo (Icon + Text, white text for dark backgrounds)
  'logo-dark.svg': `
<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${IconMarkup}
  ${wordmarkMarkup(C_FOREGROUND_DARK)}
  ${DefsMarkup}
</svg>`,

  // 3. Icon Only
  'icon.svg': `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${IconMarkup}
  ${DefsMarkup}
</svg>`,

  // 4. Monochrome (Solid black for print/simple)
  'logo-mono.svg': `
<svg width="180" height="48" viewBox="0 0 180 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 6L6 15L24 24L42 15L24 6Z" fill="#000000" />
  <path d="M6 15V33L24 42V24L6 15Z" fill="#000000" opacity="0.8" />
  <path d="M42 15V33L24 42V24L42 15Z" fill="#000000" opacity="0.6" />
  ${wordmarkMarkup('#000000')}
</svg>`,

  // 5. App Icon / Favicon (Rounded square with icon inside)
  'app-icon.svg': `
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="28" fill="url(#bgGrad)" />
  <g transform="translate(36, 36) scale(1)">
    <path d="M24 6L6 15L24 24L42 15L24 6Z" fill="#FFFFFF" />
    <path d="M6 15V33L24 42V24L6 15Z" fill="#FFFFFF" fill-opacity="0.7" />
    <path d="M42 15V33L24 42V24L42 15Z" fill="#FFFFFF" fill-opacity="0.4" />
    <path d="M24 24V42" stroke="url(#bgGrad)" stroke-width="2" stroke-opacity="0.4" fill="none" />
  </g>
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="${C_PRIMARY_LIGHT}"/>
      <stop offset="1" stop-color="${C_PRIMARY_DARK}"/>
    </linearGradient>
  </defs>
</svg>`
};

Object.entries(svgs).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(outDir, filename), content.trim());
  console.log(`Generated ${filename}`);
});
