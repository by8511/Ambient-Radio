import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

const root = readFileSync('index.html', 'utf8');
const versionedPath = 'prototypes/badcreative-radio-h5-prototype-v0-4.html';

assert.ok(root.includes('Modern People Lab Radio · H5 Prototype v0.4'), 'root index should serve v0.4 prototype');
assert.ok(root.includes('<span>氛围电台</span>'), 'root index should include v0.4 top label');
assert.ok(root.includes('BADCREATIVE 氛围电台'), 'root index should include v0.4 poster title');
assert.ok(root.includes('制作：Modern People Lab'), 'root index should include poster maker');
assert.ok(root.includes('扫码体验 H5 电台'), 'root index should include QR instruction');
assert.ok(root.length > 1_000_000, 'root index should be the full prototype, not an empty placeholder');

assert.ok(existsSync(versionedPath), 'versioned prototype path should exist');
const versioned = readFileSync(versionedPath, 'utf8');
assert.equal(versioned, root, 'root and versioned prototype should match exactly');
assert.equal(statSync('index.html').size, statSync(versionedPath).size, 'root and versioned prototype sizes should match');

assert.ok(!existsSync('badcreative-radio-h5-prototype-v0-4.html index.html'), 'malformed uploaded filename should be removed');

console.log('deploy structure checks passed');
