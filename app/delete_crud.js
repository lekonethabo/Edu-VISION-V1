const fs = require('fs');
const content = fs.readFileSync('app/page.tsx', 'utf8');

const startMarker = "// --- Comprehensive & Sexuality Education (CSE) CRUD Helpers ---";
const endMarker = "// --- Prescribed Textbooks CRUD Helpers ---";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.log("MARKERS NOT FOUND!");
  process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

fs.writeFileSync('app/page.tsx', before + after);
console.log("Successfully deleted CSE CRUD Helpers!");
