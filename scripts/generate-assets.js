import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const sourcePath = 'd:/Code/Antigravity/design_concepts/kenichi-profile/assets/logos/source/refine-logo.svg';
const targetPath = 'src/features/svg-lab/DefaultAssets.ts';

const content = readFileSync(sourcePath, 'utf8');

// robust extraction based on the known file structure
// 1. BG Path is the first <path> tag before the <g>
const bgMatch = content.match(/<path d="([^"]+)"/);
const bgPath = bgMatch ? bgMatch[1] : "";

// 2. Logo Path is the <path> inside the <g> (second path in file)
const allPaths = content.match(/d="([^"]+)"/g);
const logoPath = allPaths && allPaths[1] ? allPaths[1].match(/d="([^"]+)"/)[1] : "";

const fileContent = `export const DEFAULT_BG_PATH = \`${bgPath}\`;
export const DEFAULT_LOGO_PATH = \`${logoPath}\`;
export const DEFAULT_VIEWBOX = "0 0 1024 1024";
`;

writeFileSync(targetPath, fileContent);
console.log(`Generated ${targetPath}`);
