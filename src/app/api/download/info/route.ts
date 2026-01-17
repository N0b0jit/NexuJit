
import { NextRequest, NextResponse } from 'next/server';
import { Innertube } from 'youtubei.js';
import puppeteer from 'puppeteer';

export const dynamic = 'force-dynamic';

function getPlatform(url: string) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('tiktok.com')) return 'tiktok';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('pinterest.com')) return 'pinterest';
    return 'unknown';
}

async function scrapeWithPuppeteer(url: string, platform: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // Set user agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

        // Platform specific extraction
        let title = await page.title();
        let thumbnail = await page.$eval('meta[property="og:image"]', el => (el as HTMLMetaElement).content).catch(() => '');
        let directUrl = '';

        if (platform === 'pinterest') {
            // Try to find video src first
            directUrl = await page.evaluate(() => {
                const v = document.querySelector('video');
                if (v && v.src && v.src.startsWith('http')) return v.src;
                return '';
            });
            // Fallback to image if no video
            if (!directUrl) directUrl = thumbnail;
        }
        else if (platform === 'tiktok') {
            // Wait for video element
            try {
                await page.waitForSelector('video');
                directUrl = await page.evaluate(() => {
                    const v = document.querySelector('video');
                    return v ? v.src : '';
                });
            } catch (e) { }

            // If blob, we might need a different approach, checking for SIGI_STATE
            if (directUrl.startsWith('blob:')) {
                // Try extracting from hydrating script
                const state = await page.evaluate(() => {
                    const el = document.getElementById('SIGI_STATE');
                    return el ? JSON.parse(el.textContent || '{}') : null;
                });
                if (state) {
                    // Try to find url in state (simplified logic)
                    const keys = Object.keys(state.ItemModule || {});
                    if (keys.length > 0) {
                        directUrl = state.ItemModule[keys[0]]?.video?.playAddr || '';
                    }
                }
            }
        }
        else if (platform === 'instagram') {
            try {
                await page.waitForSelector('video', { timeout: 5000 });
                directUrl = await page.evaluate(() => {
                    const v = document.querySelector('video');
                    return v ? v.src : '';
                });
            } catch (e) {
                // Image fallback
                if (!directUrl) directUrl = thumbnail;
            }
        }
        else if (platform === 'facebook') {
            // Facebook often has SD/HD links in meta or Scripts
            // Simple video tag check
            try {
                // Often inside shadow DOM or complex divs, but let's try simple selector
                directUrl = await page.evaluate(() => {
                    // Check for SD/HD src in scripts could be better, but basic attempt:
                    const v = document.querySelector('video');
                    return v ? v.src : '';
                });
            } catch (e) { }
        }

        return { title, thumbnail, directUrl };

    } finally {
        await browser.close();
    }
}

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();
        const platform = getPlatform(url);

        // YouTube uses youtubei.js (Reliable, fast)
        if (platform === 'youtube') {
            const yt = await Innertube.create();
            const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop()?.split('?')[0];
            const info = await yt.getBasicInfo(id || '');

            const formats = info.streaming_data?.formats || [];
            const adaptiveFormats = info.streaming_data?.adaptive_formats || [];
            const allFormats = [...formats, ...adaptiveFormats];

            return NextResponse.json({
                platform,
                title: info.basic_info.title,
                thumbnail: info.basic_info.thumbnail?.[0]?.url,
                formats: allFormats.filter((f: any) => f.has_video || f.mime_type?.includes('video')).map((f: any) => ({
                    id: f.itag,
                    label: `${f.quality_label || 'Video'} (${f.mime_type?.split(';')[0]})`,
                    size: f.content_length ? (parseInt(f.content_length) / (1024 * 1024)).toFixed(1) + ' MB' : 'Auto',
                    url: f.url // Pass URL directly if available to skip execute step
                }))
            });
        }

        // Other platforms use Puppeteer (Robust for local)
        if (['tiktok', 'instagram', 'facebook', 'pinterest'].includes(platform)) {
            const data = await scrapeWithPuppeteer(url, platform);

            if (!data.directUrl) {
                // Try one more fallback for TikTok/FB if libraries were better, but Puppeteer is usually best.
                // We can return error if we really couldn't find it.
                throw new Error(`Could not extract media from ${platform}. The link might be private or blocked.`);
            }

            return NextResponse.json({
                platform,
                title: data.title,
                thumbnail: data.thumbnail,
                formats: [
                    {
                        id: 'default',
                        label: 'High Quality',
                        size: 'Auto',
                        url: data.directUrl // Direct URL from scraper
                    }
                ]
            });
        }

        return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });

    } catch (e: any) {
        console.error('Info Error:', e);
        return NextResponse.json({ error: e.message || 'Internal Server Error' }, { status: 500 });
    }
}
