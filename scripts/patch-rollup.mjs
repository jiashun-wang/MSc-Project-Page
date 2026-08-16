import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';

// 1. 删除我们之前创建的空壳模块（让 rollup 知道它不存在）
const dir = 'node_modules/@rollup/rollup-linux-x64-gnu';
if (existsSync(dir)) {
  rmSync(dir, { recursive: true, force: true });
  console.log('✓ Removed stub module');
}

// 2. 修改 native.js，让 require 失败时返回 null 而不是抛错
//    这样 rollup 就知道原生模块不可用，自动走 WASM 回退
const file = 'node_modules/rollup/dist/native.js';
let code = readFileSync(file, 'utf8');

code = code.replace(
  `function requireWithFriendlyError (id) {
	const err = new Error(\`Cannot find module \${id}.\\n\\nnpm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try \\\`npm i\\\` again after removing both package-lock.json and node_modules directory.\`);
	try {
		return require(id);
	} catch (error) {
		if (error.code === 'MODULE_NOT_FOUND' || error.code === 'ERR_DLOPEN_FAILED') {
			throw err;
		}
		throw error;
	}
}`,
  `function requireWithFriendlyError (id) {
	try {
		return require(id);
	} catch {
		return null;
	}
}`
);

writeFileSync(file, code);
console.log('✓ Patched rollup native.js to return null on failure');
