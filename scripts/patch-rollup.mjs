import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'fs';

const rollupNativeDir = 'node_modules/@rollup/rollup-linux-x64-gnu';

// 1. 删除无法加载的二进制模块
if (existsSync(rollupNativeDir)) {
  rmSync(rollupNativeDir, { recursive: true, force: true });
  console.log('✓ Removed @rollup/rollup-linux-x64-gnu');
}

// 2. 创建一个空壳模块，让 Rollup 能 require 到但不会报错
mkdirSync(rollupNativeDir, { recursive: true });
writeFileSync(`${rollupNativeDir}/package.json`, JSON.stringify({
  name: '@rollup/rollup-linux-x64-gnu',
  version: '0.0.0',
  main: 'index.js'
}));
writeFileSync(`${rollupNativeDir}/index.js`, 'module.exports = {};\n');

console.log('✓ Created stub @rollup/rollup-linux-x64-gnu');

// 3. 修改 rollup 的 native.js，让它不因为空模块而报错
const nativeJs = 'node_modules/rollup/dist/native.js';
let code = readFileSync(nativeJs, 'utf8');

// 把 require(id) 替换成安全的版本，找不到或加载失败就返回空对象
code = code.replace(
  "require(id)",
  "(function(){try{return require(id)}catch(e){return {}}})()"
);

writeFileSync(nativeJs, code);
console.log('✓ Patched rollup/dist/native.js');
