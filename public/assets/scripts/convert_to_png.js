
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const inputDir = path.join(__dirname, '../assets/logos/variations');
const outputDir = path.join(__dirname, '../assets/logos/png');
const size = 1024; // High-res output

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function convertSVGs() {
    try {
        const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));
        
        console.log(`Found ${files.length} SVG files to convert...`);

        for (const file of files) {
            const inputPath = path.join(inputDir, file);
            const outputFilename = file.replace('.svg', '.png');
            const outputPath = path.join(outputDir, outputFilename);

            console.log(`Converting: ${file} -> ${outputFilename}`);

            await sharp(inputPath)
                .resize(size, size)
                .png()
                .toFile(outputPath);
        }

        console.log('✅ Conversion complete! PNGs saved to assets/logos/png/');

    } catch (err) {
        console.error('❌ Error converting files:', err);
    }
}

// Check if sharp is installed
try {
    require.resolve('sharp');
    convertSVGs();
} catch (e) {
    console.error('❌ Error: "sharp" library not found.');
    console.error('Please run: npm install sharp');
    process.exit(1);
}
