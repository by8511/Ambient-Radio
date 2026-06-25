import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('./badcreative-radio-h5-prototype-v0-4.html', import.meta.url), 'utf8');

function mustInclude(snippet, label = snippet) {
  assert.ok(html.includes(snippet), `missing ${label}`);
}

function mustNotInclude(snippet, label = snippet) {
  assert.ok(!html.includes(snippet), `unexpected ${label}`);
}

mustInclude('<title>Modern People Lab Radio · H5 Prototype v0.4</title>', 'v0.4 title');
mustInclude('<div class="badge"><i></i><span>氛围电台</span></div>', 'top status renamed to 氛围电台');
mustNotInclude('67 首在线 · 不定期更新', 'old 67 songs update label');

const badgeRule = html.match(/\.badge\s*\{(?<body>[\s\S]*?)\n\s*\}/)?.groups.body ?? '';
const aboutRule = html.match(/\.icon-pill\s*\{(?<body>[\s\S]*?)\n\s*\}/)?.groups.body ?? '';
assert.match(badgeRule, /font-size:\s*12px;/, 'badge should use 12px text');
assert.match(aboutRule, /font-size:\s*12px;/, 'about button should match badge text size');
assert.match(aboutRule, /font-weight:\s*760;/, 'about button should match badge weight');

const mobileHeroRule = html.match(/@media \(max-width: 759px\)[\s\S]*?\.hero\s*\{(?<body>[\s\S]*?)\n\s*\}/)?.groups.body ?? '';
assert.match(mobileHeroRule, /min-height:\s*42vh;/, 'mobile hero should move logo area upward');
assert.match(mobileHeroRule, /align-content:\s*start;/, 'mobile hero should anchor logo near top');
assert.match(mobileHeroRule, /padding-top:\s*clamp\(36px,\s*9vh,\s*84px\);/, 'mobile hero should create top breathing room');

const desktopLayoutRule = html.match(/@media \(min-width: 760px\)[\s\S]*?\.desktop-layout\s*\{(?<body>[\s\S]*?)\n\s*\}/)?.groups.body ?? '';
assert.match(desktopLayoutRule, /align-items:\s*center;/, 'desktop layout should keep player in its original vertical position');
assert.match(desktopLayoutRule, /padding-top:\s*clamp\(36px,\s*8vh,\s*92px\);/, 'desktop layout should leave atmosphere in the middle');
const desktopHeroRule = html.match(/@media \(min-width: 760px\)[\s\S]*?\.hero\s*\{(?<body>[\s\S]*?)\n\s*\}/)?.groups.body ?? '';
assert.match(desktopHeroRule, /align-self:\s*start;/, 'desktop hero should move brand to top area');
assert.match(desktopHeroRule, /padding-top:\s*clamp\(8px,\s*2vh,\s*24px\);/, 'desktop hero should avoid dragging player upward');

mustInclude('p.fillText(\'BADCREATIVE 氛围电台\', 150, 610);', 'poster title');
mustInclude('p.fillText(\'制作：Modern People Lab\', 150, 972);', 'poster maker');
mustInclude('wrapPosterText(p, \'一个受 badcreative.cn 雨夜影像启发的在线氛围电台。打开即可在冷光电子与暖灯低保真之间随机进入一段背景音乐，把页面当作夜里的声音房间。\', 150, 782, 720, 48);', 'poster intro');
mustInclude('drawRealQr(p, 690, 1050, 210, location.href || \'https://badcreative.cn/\');', 'real QR code target');
mustInclude('p.fillText(\'扫码体验 H5 电台\', 120, 1128);', 'poster QR instruction');

console.log('random radio v0.4 static checks passed');
