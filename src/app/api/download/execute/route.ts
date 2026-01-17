
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { url, formatId, platform, formats } = await req.json();

        // If 'formats' was passed from the client (which comes from info step), 
        // we might have the URL already.
        // However, the client doesn't send the full 'formats' array back usually, just the formatId.
        // But in the new Info route, I'm returning 'url' property in the format object.
        // If the client's 'item.formats.find(f => f.id === selectedFormat)' has the URL, we shouldn't even call execute.
        // But if we DO call execute, let's assume we need to re-fetch or extract it.

        // Wait, the client code (SocialMediaDownloader.tsx) currently calls execute regardless.
        // We should handle the case where we can just return the URL provided in the request if we update the frontend
        // to pass it, OR we just trust the client-side logic to use the direct URL if available.

        // Actually, simpler: The frontend logic I wrote previously DOES call execute. 
        // I should update the Frontend to check if the format already has a 'url' property.
        // If so, just use it. If not, call execute.
        // But for now, let's make this Execute route just return the URL if provided or re-scrape if needed.

        // Since re-scraping is expensive (Puppeteer again), we should avoid it.
        // Ideally, the Info step found the URL and sent it to the client. The client should just use it.

        // Let's UPDATE the frontend to handle 'url' property in formats.

        // But if we MUST return something here for compatibility with the current frontend code:
        // We can just error if we don't have logic, or try to scrape again.

        // For YouTube, we need to extract the specific format URL again because tokens might expire? 
        // Actually youtubei.js urls expire after some time.

        // Let's implement a re-scrape for Puppeteer platforms if absolutely needed,
        // BUT heavily rely on the Info step having done the heavy lifting.

        return NextResponse.json({ error: 'Please update frontend to use direct URL from info step.' }, { status: 400 });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
