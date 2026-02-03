
const fs = require('fs');
const path = 'd:/Code/Antigravity/design_concepts/kinetix/public/logo-BW.svg';

try {
    const content = fs.readFileSync(path, 'utf8');
    
    // Regex to find d attribute. [\s\S] matches newlines too.
    // We look for d=" (preceded by whitespace) and capture content until closing quote
    const match = content.match(/[\s]d="([\s\S]*?)"/);
    
    if (!match) throw new Error('No d attribute found via Regex');
    
    const dContent = match[1];
    
    // Split by M command
    const parts = dContent.split('M').filter(p => p.trim().length > 0);
    
    console.log(`Found ${parts.length} subpaths`);
    
    if (parts.length < 2) {
        console.log('Content dump start:', dContent.substring(0, 100));
        throw new Error('Not enough parts found. Ensure the SVG has distinct M commands.');
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
<filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
<feGaussianBlur in="SourceAlpha" stdDeviation="15"/> 
<feOffset dx="4" dy="8" result="offsetblur"/>
<feComponentTransfer>
<feFuncA type="linear" slope="0.3"/>
</feComponentTransfer>
<feMerge> 
<feMergeNode/>
<feMergeNode in="SourceGraphic"/> 
</feMerge>
</filter>
</defs>
<path d="${bgPath}" fill="url(#kenichi_grad)" />
<g filter="url(#dropShadow)"> 
<path d="${kPath}" fill="white"/>
</g>
</svg>`;

    fs.writeFileSync('d:/Code/Antigravity/design_concepts/kinetix/public/logo.svg', newSvg);
    console.log('Success!');
    
} catch (e) {
    console.error(e);
}
