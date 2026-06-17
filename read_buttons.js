const fs = require('fs');
const lines = fs.readFileSync('buttons.txt', 'utf8').split('\n').slice(0, 50).join('\n');
console.log(lines);
