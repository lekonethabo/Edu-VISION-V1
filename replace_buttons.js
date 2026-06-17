const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

// The new class string:
const newClass = "bg-[#1D2616] dark:bg-neutral-800 text-[#EAE7DE] dark:text-neutral-100 px-4 py-2 rounded font-bold text-xs hover:bg-[#4CAD73] hover:text-white transition-colors";

function replaceClass(buttonStr) {
  return buttonStr.replace(/className=(["`'])[^"`']*(["`'])/, `className=$1${newClass}$2`);
}

// let's do this: matches any <button ...>Text or Text+Icon</button>
// but avoid icon-only buttons like `<button ...><Icon /></button>` or `<button ...>X</button>`

const matches = [...page.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)];
let replacedCount = 0;

for (const match of matches) {
  const content = match[1];
  const oldButton = match[0];
  
  // if content has at least 3 letters of text (like "Save", "Cancel", etc.)
  if (/[a-zA-Z]{3,}/.test(content) && !oldButton.includes('opacity-0')) {
     let updated = replaceClass(oldButton);
     page = page.replace(oldButton, updated);
     replacedCount++;
  }
}

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Replaced:", replacedCount);
