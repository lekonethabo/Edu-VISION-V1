const fs = require('fs');

let page = fs.readFileSync('app/page.tsx', 'utf8');

const targetClass = "flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1D2616] dark:bg-neutral-800 text-[#EAE7DE] dark:text-neutral-100 px-4 py-2 rounded font-bold text-xs hover:bg-[#4CAD73] hover:text-white transition-colors";

function replaceClass(buttonStr) {
  // If it's a dynamic class containing ? :, leave it alone unless we are sure.
  // Actually, we can just replace the whole className string if it's not purely dynamic.
  if (buttonStr.includes("className={`")) {
    return buttonStr; // Skip dynamic for safety
  }
  return buttonStr.replace(/className=(["`'])[^"`']*(["`'])/, `className=$1${targetClass}$2`);
}

const matches = [...page.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/g)];
let replacedCount = 0;

for (const match of matches) {
  const content = match[1];
  const oldButton = match[0];
  
  // if content is just an icon <Icon /> or single letter "X", skip it
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  
  // Also skip if button is part of auth flow ? auth flow is ok.
  if (textContent.length > 2 && textContent !== "CSV" && /bg-\[#4CAD73\]|bg-neutral-200|bg-slate-100|text-white|bg-\[#1D2616\]/i.test(oldButton)) {
     if (!oldButton.includes('opacity-0') && !oldButton.includes("disabled")) {
       let updated = replaceClass(oldButton);
       if (updated !== oldButton) {
         page = page.replace(oldButton, updated);
         replacedCount++;
       }
     }
  }
}

fs.writeFileSync('app/page.tsx', page, 'utf8');
console.log("Replaced:", replacedCount);
