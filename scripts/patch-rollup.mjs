import { readFileSync, writeFileSync } from 'fs';

const file = 'node_modules/rollup/dist/native.js';
let code = readFileSync(file, 'utf8');

// 按行读取，找到 throw err 那一行，改成 return null
const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('throw err') && lines[i].includes('MODULE_NOT_FOUND')) {
    lines[i] = lines[i].replace('throw err', 'return null');
    console.log(`✓ Patched line ${i + 1}: ${lines[i].trim()}`);
    break;
  }
}
code = lines.join('\n');
writeFileSync(file, code);
console.log('✓ Done');
