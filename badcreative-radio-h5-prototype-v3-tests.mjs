import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('prototypes/badcreative-radio-h5-prototype-v3.html', 'utf8');

function mustInclude(snippet, label = snippet) {
  assert.ok(html.includes(snippet), `missing ${label}`);
}

function mustNotInclude(snippet, label = snippet) {
  assert.ok(!html.includes(snippet), `unexpected ${label}`);
}

mustInclude('<title>BADCREATIVE Ambient Radio · H5 Prototype V3</title>', 'V3 title');
mustInclude('const VERSION_PATH = \'/prototypes/badcreative-radio-h5-prototype-v3.html\';', 'V3 share path constant');

mustNotInclude('<span class="track-label">正在播放</span>', 'track label');
mustNotInclude('<span class="track" id="trackText">等待第一段信号</span>', 'track name');
mustNotInclude('<div class="progress" aria-hidden="true">', 'progress bar');
mustNotInclude('id="currentTime"', 'current time');
mustNotInclude('id="duration"', 'duration');

mustInclude('<audio id="ambientAudio" preload="auto" loop crossorigin="anonymous"></audio>', 'audio element');
mustInclude('const streamSources = {', 'stream source map');
mustInclude('ambientAudio.play()', 'playback call');
mustInclude('ambientAudio.pause()', 'pause call');

mustInclude('<p class="disclaimer">本页面为 BADCREATIVE 氛围电台 H5 原型，仅用于音乐体验与页面演示；曲目、频道与分享海报不构成商业发行、版权授权或收益承诺。</p>', 'bottom disclaimer');
mustInclude('.disclaimer {', 'disclaimer styling');

mustInclude('const logoImage = new Image();', 'poster should load main logo image');
mustInclude('logoImage.src = brandLogo.src;', 'poster logo source should match main page');
mustInclude('await ensurePosterLogo();', 'poster should await logo load');
mustNotInclude('function drawPosterLogo(context, x, y, width) {', 'old text-only poster logo');
mustNotInclude("context.fillText('Modern',", 'old drawn Modern logo');

mustInclude('p.fillText(\'BADCREATIVE AMBIENT RADIO\', 112, 690);', 'refined poster title');
mustInclude('drawRealQr(p, 744, 1100, 206, getShareUrl());', 'poster QR uses V3 share URL');
mustInclude('p.fillText(\'扫码体验 V3 电台\', 112, 1180);', 'V3 poster QR instruction');

console.log('random radio V3 static checks passed');
