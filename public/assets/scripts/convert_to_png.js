import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const inputDir = path.resolve(__dirname, '../logos/variations');
const outputDir = path.resolve(__dirname, '../logos/png');
// size is now hardcoded in the sharp resize function

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function convertSVGs() {
    try {
        // Get all SVG files
        const svgFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));
        
        console.log(`Found ${svgFiles.length} SVG files to convert...`);

        // Convert each SVG to PNG
        for (const file of svgFiles) {
            const inputPath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, file.replace('.svg', '.png'));
            
            try {
                await sharp(inputPath)
                    .resize(1024, 1024) // Hardcoded size
                    .png()
                    .toFile(outputPath);
                
                console.log(`✓ Converted ${file} → ${path.basename(outputPath)}`);
            } catch (error) {
                console.error(`✗ Failed to convert ${file}:`, error.message);
            }
        }

        console.log('\nConversion complete!');
        console.log(`Output directory: ${outputDir}`);

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
