import { readFileSync, writeFileSync } from 'fs';

// 修改 rollup 的 native.js：当原生模块加载失败时，不崩溃，返回空对象
const file = 'node_modules/rollup/dist/native.js';
let code = readFileSync(file, 'utf8');

// 把 throw err 替换成 console.warn + 返回空对象
code = code.replace(
  'throw err',
  'console.warn("[rollup] Native binary skipped, using fallback"); module.exports = {}; return'
);

writeFileSync(file, code);
console.log('✓ Rollup native.js patched successfully');
