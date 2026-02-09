
const instagramLib = require('instagram-url-direct');
const fbdl = require('fbdl-core');
const tiktok = require('@tobyg74/tiktok-api-dl');
const axios = require('axios');
const cheerio = require('cheerio');

async function testTikTok(url) {
    console.log(`\nTesting TikTok: ${url}`);
    try {
        const result = await tiktok.Downloader(url, { version: 'v1' });
        console.log('Success:', result.status === 'success');
        if (result.status === 'success') console.log('Video:', result.result?.video?.[0]);
        else console.log('Error:', result);
    } catch (e) {
        console.log('Exception:', e.message);
    }
}

async function testInstagram(url) {
    console.log(`\nTesting Instagram: ${url}`);
    try {
        const getUrl = instagramLib.default || instagramLib.instagramGetUrl;
        const result = await getUrl(url);
        console.log('Success:', !!result.url_list);
        if (result.url_list) console.log('Media Count:', result.url_list.length);
        else console.log('Result:', result);
    } catch (e) {
        console.log('Exception:', e.message);
    }
}

async function testFacebook(url) {
    console.log(`\nTesting Facebook: ${url}`);
    try {
        // Based on "export type: function", let's try calling it directly?
        // Or check if it has properties attached to the function.
        // Actually fbdl-core usually exports an object, but maybe this version is diff.
        // Let's try likely known methods
        if (typeof fbdl === 'function') {
            console.log('Calling fbdl as function...');
            // Some libs are const link = await fbdl(url);
        }

        // However, standard usage is fbdl.getInfo()
        // Let's try to see if getInfo exists on the function object?
        if (fbdl.getInfo) {
            const result = await fbdl.getInfo(url);
            console.log('Success (getInfo):', result.title);
        } else {
            console.log('fbdl.getInfo missing. Trying direct call...');
            // const result = await fbdl(url); // risky if it expects args
        }
    } catch (e) {
        console.log('Exception:', e.message);
    }
}

async function testPinterest(url) {
    console.log(`\nTesting Pinterest (Scraper): ${url}`);
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);

        let videoUrl = $('video source').attr('src');
        if (!videoUrl) videoUrl = $('meta[property="og:video"]').attr('content');
        if (!videoUrl) videoUrl = $('meta[property="og:video:secure_url"]').attr('content');

        let imageUrl = $('meta[property="og:image"]').attr('content');

        console.log('Video Found:', videoUrl || 'No');
        console.log('Image Found:', imageUrl || 'No');

    } catch (e) {
        console.log('Exception:', e.message);
    }
}

(async () => {
    // Pinterest Test
    await testPinterest('https://www.pinterest.com/pin/1068690186562091490/'); // Dummy/Random pin

    // Instagram Test
    // Use a public reel if possible. 
    await testInstagram('https://www.instagram.com/reel/C2d_B4gL3xX/');

    // TikTok Test
    await testTikTok('https://www.tiktok.com/@tiktok/video/7315582329711676718');
})();
