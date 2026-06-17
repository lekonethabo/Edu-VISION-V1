const fs = require('fs');
const path = require('path');

const MAP = {
  '#002652': 'prussian',
  '#F7FAFC': 'snow',
  '#97620C': 'golden',
  '#00A3A3': 'sea',
  '#000A14': 'ink',
  '#0a7272': 'sea', // Add mapping for slightly off colors requested if needed?
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const [hex, name] of Object.entries(MAP)) {
    // Regex for basic properties with exact hex match (case-insensitive for hex)
    const regex = new RegExp(`(bg|text|border|ring|fill|stroke)-\\[${hex}\\]`, 'gi');
    content = content.replace(regex, `$1-${name}`);
    
    // Also handle fill/stroke properties in JSX, e.g., fill="#002652", color="#002652"
    // Wait, replacing fill="#002652" -> hmm, it's probably better to keep hex in normal react props unless we can use tailwind classes.
    // Actually, sometimes recharts uses fill="#002652". If we leave it as hex, that's fine since the user said "Implement these (Tailwind classes) throughout the website"
  }
  
  // also handle some variants like hover:text-[#00A3A3] -> hover:text-sea
  // The regex above will actually match `hover:text-[#00A3A3]` as `hover:` is ignored, and it replaces `text-[#00A3A3]` with `text-sea` resulting in `hover:text-sea`. This is perfect!

  // Some alpha variants like bg-[#00A3A3]/10
  for (const [hex, name] of Object.entries(MAP)) {
    const regexWithAlpha = new RegExp(`(bg|text|border|ring|fill|stroke)-\\[${hex}\\]\\/([0-9]+)`, 'gi');
    content = content.replace(regexWithAlpha, `$1-${name}/$2`);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated: ' + filePath);
  }
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.svg')) {
      processFile(fullPath);
    }
  }
}

processDirectory('./app');
