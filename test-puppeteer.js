
const puppeteer = require('puppeteer');

async function scrape(url, platform) {
    console.log(`Testing ${platform}: ${url}`);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a real user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        let title = await page.title();
        let thumbnail = '';
        let videoUrl = '';

        if (platform === 'pinterest') {
            // Pinterest logic
            // Look for og:image and potentially <video> tag
            thumbnail = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => '');
            // Use evaluate to find video src
            videoUrl = await page.evaluate(() => {
                const video = document.querySelector('video');
                return video ? video.src : '';
            });
        }
        else if (platform === 'tiktok') {
            // TikTok logic
            thumbnail = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => '');
            videoUrl = await page.evaluate(() => {
                const video = document.querySelector('video');
                return video ? video.src : '';
            });
        }
        else if (platform === 'instagram') {
            // Instagram logic
            thumbnail = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => '');
            videoUrl = await page.evaluate(() => {
                const video = document.querySelector('video');
                return video ? video.src : '';
            });
        }

        console.log(`[${platform}] Title:`, title);
        console.log(`[${platform}] Thumbnail:`, thumbnail);
        console.log(`[${platform}] Video URL:`, videoUrl);

    } catch (e) {
        console.error(`[${platform}] Error:`, e.message);
    } finally {
        await browser.close();
    }
}

(async () => {
    // Pinterest
    await scrape('https://www.pinterest.com/pin/1068690186562091490/', 'pinterest');

    // TikTok
    await scrape('https://www.tiktok.com/@tiktok/video/7315582329711676718', 'tiktok');

})();
