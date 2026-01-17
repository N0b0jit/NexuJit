
const tiktok = require('@tobyg74/tiktok-api-dl');
const instagramGetUrl = require('instagram-url-direct');
const fbdl = require('fbdl-core');

async function testTikTok() {
    console.log('--- Testing TikTok ---');
    try {
        // Use a known public trending video or a specific one if possible. 
        // This URL might expire, but testing libraries usually need real URLs.
        // Using a generic trending logic if possible, or a specific hardcoded one.
        // For now, let's try a potentially valid URL or just check if the library initializes.
        const url = 'https://www.tiktok.com/@tiktok/video/7315582329711676718';
        const result = await tiktok.Downloader(url, { version: 'v1' });
        console.log('TikTok Result:', result.status === 'success' ? 'Success' : result);
    } catch (e) {
        console.log('TikTok Error:', e.message);
    }
}

async function testInstagram() {
    console.log('\n--- Testing Instagram ---');
    try {
        const url = 'https://www.instagram.com/reel/C2d_...'; // Need a real URL for full test, but checking import/function logic first.
        // If I don't have a real URL, I can't fully test the fetch, but I can check if it throws "module not found" or similar.
        // Let's try to fetch a dummy URL and see if it fails with "404" (good) or "crash" (bad).
        const result = await instagramGetUrl('https://www.instagram.com/p/C-dummy-id/');
        console.log('Instagram Result:', result);
    } catch (e) {
        console.log('Instagram Error:', e.message);
    }
}

async function testFacebook() {
    console.log('\n--- Testing Facebook ---');
    try {
        const url = 'https://www.facebook.com/watch/?v=10153231379946729'; // Dummy valid-looking link
        const result = await fbdl.getInfo(url);
        console.log('Facebook Result:', result ? 'Info Found' : 'No result');
    } catch (e) {
        console.log('Facebook Error:', e.message);
    }
}

(async () => {
    await testTikTok();
    await testInstagram();
    await testFacebook();
})();
