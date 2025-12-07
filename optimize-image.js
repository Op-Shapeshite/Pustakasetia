const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'img', 'si-management-pendidikan.png');
const outputPath = path.join(__dirname, 'public', 'img', 'book-cover-optimized.png');

async function optimizeImage() {
  try {
    // Get original image info
    const metadata = await sharp(inputPath).metadata();
    console.log('Original image:', metadata);
    
    // Resize to 240px width (2x for retina, will display at 120px)
    await sharp(inputPath)
      .resize(240, null, { // width 240px, height auto
        fit: 'inside',
        withoutEnlargement: true
      })
      .png({ quality: 85, compressionLevel: 9 })
      .toFile(outputPath);
    
    console.log('Optimized image created:', outputPath);
    
    // Get new image info
    const newMetadata = await sharp(outputPath).metadata();
    console.log('New image:', newMetadata);
  } catch (error) {
    console.error('Error:', error);
  }
}

optimizeImage();
