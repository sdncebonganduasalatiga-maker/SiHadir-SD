/**
 * High-quality SVG Logos and image compression helper for School Profile
 */

export const PRESET_LOGOS = [
  {
    id: 'kemendikbud',
    name: 'Logo Tut Wuri Handayani (Resmi Kemendikbud)',
    description: 'Lambang pendidikan nasional resmi dengan sayap, buku, dan nyala api.',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="%230284c7" stroke="%23f59e0b" stroke-width="4"/><polygon points="50,15 58,35 80,35 62,48 69,70 50,57 31,70 38,48 20,35 42,35" fill="%23fbbf24"/><path d="M50 42 L65 78 L35 78 Z" fill="%23dc2626"/><path d="M50 48 Q55 58 60 75 L40 75 Q45 58 50 48" fill="%23fef08a"/><path d="M22 68 Q50 82 78 68" stroke="%23ffffff" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="50" cy="38" r="4" fill="%23ffffff"/></svg>`
  },
  {
    id: 'sd_negeri_emblem',
    name: 'Logo Lingkaran SD Negeri (Bintang & Buku)',
    description: 'Logo klasik sekolah dasar negeri dengan buku terbuka dan obor pengetahuan.',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47" fill="%231e3a8a" stroke="%23fbbf24" stroke-width="4"/><path d="M25 65 Q50 55 50 40 Q50 55 75 65 L75 75 Q50 65 50 50 Q50 65 25 75 Z" fill="%23ffffff"/><polygon points="50,18 54,28 65,28 56,35 60,46 50,39 40,46 44,35 35,28 46,28" fill="%23f59e0b"/><path d="M48 38 Q50 28 52 38 Q50 44 48 38" fill="%23ef4444"/><text x="50" y="88" font-size="9" font-family="Arial, sans-serif" font-weight="bold" fill="%23fbbf24" text-anchor="middle">SD NEGERI</text></svg>`
  },
  {
    id: 'perisai_prestasi',
    name: 'Logo Perisai Prestasi & Karakter SD',
    description: 'Lambang perisai modern sekolah penggerak dan berprestasi.',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 8 L85 22 L85 55 Q85 85 50 95 Q15 85 15 55 L15 22 Z" fill="%23047857" stroke="%23fef08a" stroke-width="3"/><path d="M50 16 L78 27 L78 54 Q78 78 50 86 Q22 78 22 54 L22 27 Z" fill="%23065f46"/><polygon points="50,28 55,39 67,39 57,47 61,59 50,51 39,59 43,47 33,39 45,39" fill="%23f59e0b"/><path d="M30 68 Q50 60 70 68" stroke="%23ffffff" stroke-width="3" fill="none"/></svg>`
  }
];

/**
 * Compresses an uploaded image file into a compact base64 data URL
 * so it safely fits into localStorage without performance degradation.
 */
export function compressImageFile(file: File, maxWidth = 250, maxHeight = 250): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, read as text data URL directly to preserve sharpness
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Export as PNG or WebP for transparency
        const dataUrl = canvas.toDataURL('image/png', 0.9);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
