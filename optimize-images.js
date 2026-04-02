const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGES = [
    // Menu accordion images — 600px wide is enough
    { src: 'pizza.jpg',           out: 'pizza.webp',           width: 800,  quality: 78 },
    { src: 'drink.jpg',           out: 'drink.webp',           width: 800,  quality: 78 },
    { src: 'artisian.jpg.png',    out: 'artisian.webp',        width: 800,  quality: 75 },
    
    // Gallery images — shown at 60vw so ~900px is plenty
    { src: 'grand.jpg',           out: 'grand.webp',           width: 1100, quality: 78 },
    { src: 'signature.jpg',       out: 'signature.webp',       width: 1100, quality: 78 },
    { src: 'culinery.jpg',        out: 'culinery.webp',        width: 1100, quality: 78 },
    { src: 'coffee.jpg.png',      out: 'coffee.webp',          width: 1100, quality: 78 },
    { src: 'evening-patio.jpg.jpg', out: 'evening-patio.webp', width: 1100, quality: 78 },
];

// Also create tiny placeholders (20px wide, heavily blurred) for LQIP
const PLACEHOLDERS = IMAGES.map(img => ({
    src: img.src,
    out: img.out.replace('.webp', '-placeholder.webp'),
    width: 20,
    quality: 20,
}));

async function optimize() {
    console.log('═══ OPTIMIZING IMAGES ═══\n');
    
    for (const img of [...IMAGES, ...PLACEHOLDERS]) {
        const srcPath = path.join(__dirname, img.src);
        const outPath = path.join(__dirname, img.out);
        
        if (!fs.existsSync(srcPath)) {
            console.log(`  ⚠ SKIP: ${img.src} not found`);
            continue;
        }
        
        const srcSize = fs.statSync(srcPath).size;
        
        await sharp(srcPath)
            .resize(img.width)
            .webp({ quality: img.quality })
            .toFile(outPath);
        
        const outSize = fs.statSync(outPath).size;
        const savings = ((1 - outSize / srcSize) * 100).toFixed(1);
        
        console.log(`  ✓ ${img.src} (${(srcSize/1024).toFixed(0)}KB) → ${img.out} (${(outSize/1024).toFixed(0)}KB) [${savings}% smaller]`);
    }
    
    console.log('\n═══ DONE ═══');
}

optimize().catch(console.error);
