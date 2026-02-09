
const instagram = require('instagram-url-direct');
const fbdl = require('fbdl-core');
const tiktok = require('@tobyg74/tiktok-api-dl');

console.log('--- Inspector ---');
console.log('Instagram Export Type:', typeof instagram);
console.log('Instagram Export Keys:', Object.keys(instagram));

console.log('FBDL Export Type:', typeof fbdl);
console.log('FBDL Export Keys:', Object.keys(fbdl));

console.log('TikTok Export Type:', typeof tiktok);
console.log('TikTok Export Keys:', Object.keys(tiktok));
