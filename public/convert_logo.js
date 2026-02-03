
const fs = require('fs');
const path = 'd:/Code/Antigravity/design_concepts/kinetix/public/logo-BW.svg';

try {
    const content = fs.readFileSync(path, 'utf8');
    // Find the d attribute. It's usually d="..." or d='...'
    // We look for the first occurrence which is the main logo path
    const dStart = content.indexOf('d="');
    if (dStart === -1) throw new Error('No d attribute found');
    
    const dEnd = content.indexOf('"', dStart + 3);
    const dContent = content.substring(dStart + 3, dEnd);
    
    // Split by M command
    // The M might be surrounded by newlines or spaces
    const parts = dContent.split('M').filter(p => p.trim().length > 0);
    
    console.log(`Found ${parts.length} subpaths`);
    
    if (parts.length < 2) {
        console.log('Content dump:', dContent.substring(0, 100));
        throw new Error('Not enough parts found');
    }
    
    // Part 0 is the background
    const bgPath = 'M' + parts[0].trim() + 'z'; 
    // Rest are the logo marks (K)
    const kParts = parts.slice(1).map(p => 'M' + p.trim());
    const kPath = kParts.join(' ') + 'z';
    
    const newSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="kenichi_grad" x1="100" y1="0" x2="924" y2="1024" gradientUnits="userSpaceOnUse">
<stop stop-color="#3B82F6" />
<stop offset="1" stop-color="#1D4ED8" />
</linearGradient>
</defs>
<path d="${bgPath}" fill="url(#kenichi_grad)"/>
<path d="${kPath}" fill="white"/>
</svg>`;

    fs.writeFileSync('d:/Code/Antigravity/design_concepts/kinetix/public/logo.svg', newSvg);
    console.log('Success!');
    
} catch (e) {
    console.error(e);
}
