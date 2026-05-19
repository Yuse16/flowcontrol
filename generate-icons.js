// Script para generar iconos PWA usando Canvas nativo de Node.js
// Se ejecuta una sola vez durante la configuración
const fs = require('fs');
const path = require('path');

// Creamos iconos SVG profesionales y los convertimos a archivos estáticos
const sizes = [192, 512];

const publicDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

sizes.forEach(size => {
  const padding = Math.round(size * 0.12);
  const innerSize = size - padding * 2;
  const cornerRadius = Math.round(size * 0.18);
  const cx = size / 2;
  const cy = size / 2;

  // Diseño: Fondo degradado oscuro + símbolo "FC" futurista
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5b4fc" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="url(#bg)"/>
  
  <!-- Subtle glow circle -->
  <circle cx="${cx * 0.7}" cy="${cy * 0.6}" r="${size * 0.35}" fill="url(#glow)" opacity="0.5"/>
  
  <!-- Border -->
  <rect x="2" y="2" width="${size - 4}" height="${size - 4}" rx="${cornerRadius}" fill="none" stroke="url(#accent)" stroke-width="${Math.max(2, size * 0.005)}" opacity="0.3"/>
  
  <!-- FC Letters -->
  <text x="${cx}" y="${cy + size * 0.12}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${size * 0.38}" fill="url(#accent)" text-anchor="middle" letter-spacing="${size * -0.02}">FC</text>
  
  <!-- Small tagline -->
  <text x="${cx}" y="${cy + size * 0.24}" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="${size * 0.065}" fill="#94a3b8" text-anchor="middle" letter-spacing="${size * 0.015}">FLOWCONTROL</text>
</svg>`;

  fs.writeFileSync(path.join(publicDir, `icon-${size}.svg`), svg);
  console.log(`✅ Generado: icon-${size}.svg`);
});

// Crear favicon.ico placeholder como SVG
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#0f172a"/>
  <text x="16" y="22" font-family="Arial" font-weight="900" font-size="14" fill="#818cf8" text-anchor="middle">FC</text>
</svg>`;
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSvg);
console.log('✅ Generado: favicon.svg');

console.log('\n🎉 Iconos generados exitosamente en /public/icons/');
console.log('📌 Nota: Para producción, convierte los SVGs a PNG usando un servicio online o Sharp.');
