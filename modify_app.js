const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./app');

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // 1. Replace word ECE with ECCE
    content = content.replace(/\bECE\b/g, 'ECCE');

    // 2. Remove "Enter " from "Enter STUDENT NAME" etc in placeholders or labels.
    content = content.replace(/(placeholder=["']|placeholder:\s*["'])Enter\s+/gi, '$1');
    content = content.replace(/("name":\s*["'])Enter\s+/gi, '$1');
    content = content.replace(/(label=["']|label:\s*["'])Enter\s+/gi, '$1');
    
    // In TSX, we might have <label>Enter Student Name</label> or >Enter ...<
    content = content.replace(/>Enter\s+([^<]+?)</gi, '>$1<');

    // Also look for placeholder={...}
    // But since it's hard to parse, we can do a global replace for "Enter " inside attributes if we are careful.
    // Let's replace placeholder="Enter " with placeholder=""
    content = content.replace(/placeholder="Enter\s+([^"]+)"/gi, 'placeholder="$1"');

    // 3. Remove 2025 references like (2025), ( 2025), etc.
    content = content.replace(/\s*\(\s*2025\s*\)/gi, '');
    content = content.replace(/\(Previous Year 2025\)/gi, '(Previous Year)');
    content = content.replace(/Previous Year 2025/gi, 'Previous Year');
    
    // Specifically target specific cases from the grep
    content = content.replace(/TYPES OF ABUSE\s*2025/gi, 'TYPES OF ABUSE');
    content = content.replace(/TYPE OF ABUSE\s*2025/gi, 'TYPE OF ABUSE');
    content = content.replace(/In-Service Training 2025/gi, 'In-Service Training');
    content = content.replace(/Teacher Movement 2025/gi, 'Teacher Movement');
    content = content.replace(/Accidents Registry 2025/gi, 'Accidents Registry');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated', file);
    }
}
