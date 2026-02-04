import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'dist', 'code-bundle.txt');

const INCLUDED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.astro',
  '.css', '.scss', 
  '.md', '.mdx',
  '.json'
];

const IGNORED_DIRS = [
  'node_modules',
  'dist',
  '.git',
  '.vscode',
  '.astro',
  '.github'
];

const SPECIFIC_FILES_TO_INCLUDE = [
  'package.json',
  'astro.config.mjs',
  'tailwind.config.mjs',
  'tsconfig.json',
  'README.md'
];

async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  let files = [];

  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    
    if (dirent.isDirectory()) {
      if (IGNORED_DIRS.includes(dirent.name)) continue;
      files = files.concat(await getFiles(res));
    } else {
      const ext = path.extname(res);
      const relativePath = path.relative(ROOT_DIR, res);
      
      // Check if file is in the specific inclusion list OR matches extension
      if (SPECIFIC_FILES_TO_INCLUDE.includes(dirent.name) || 
         (INCLUDED_EXTENSIONS.includes(ext) && !SPECIFIC_FILES_TO_INCLUDE.includes(dirent.name))) {
          
         // Avoid double adding if specific file also matches extension rule
         if (!files.includes(res)) {
             files.push(res);
         }
      }
    }
  }
  return files;
}

async function bundleCode() {
  console.log('📦 Starting code bundle...');
  
  try {
    // Ensure dist directory exists
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });

    // Get all files from src
    const srcDir = path.join(ROOT_DIR, 'src');
    let filesToBundle = [];
    
    // Add specific root config files
    for (const file of SPECIFIC_FILES_TO_INCLUDE) {
        const filePath = path.join(ROOT_DIR, file);
        try {
            await fs.access(filePath);
            filesToBundle.push(filePath);
        } catch (e) {
            // File doesn't exist, skip
        }
    }

    // Add files from src recursively
    try {
        const srcFiles = await getFiles(srcDir);
        filesToBundle = filesToBundle.concat(srcFiles);
    } catch (e) {
        console.warn('⚠️  Could not read src directory or it does not exist.');
    }

    // Remove duplicates
    filesToBundle = [...new Set(filesToBundle)];

    let bundleContent = '';
    bundleContent += `# Project Code Bundle\n\n`;
    bundleContent += `Generated: ${new Date().toISOString()}\n\n`;

    for (const filePath of filesToBundle) {
      const relativePath = path.relative(ROOT_DIR, filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      
      bundleContent += `\n\n`;
      bundleContent += `================================================================================\n`;
      bundleContent += `File: ${relativePath}\n`;
      bundleContent += `================================================================================\n\n`;
      
      let ext = path.extname(filePath).substring(1);
      if (ext === 'mjs' || ext === 'cjs') ext = 'js';
      
      bundleContent += '```' + ext + '\n';
      bundleContent += content;
      bundleContent += '\n```\n';
    }

    await fs.writeFile(OUTPUT_FILE, bundleContent);
    console.log(`✅ Bundle created successfully at: ${OUTPUT_FILE}`);
    console.log(`📄 Total files bundled: ${filesToBundle.length}`);

  } catch (error) {
    console.error('❌ Error creating bundle:', error);
    process.exit(1);
  }
}

bundleCode();
