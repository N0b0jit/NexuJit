import { Innertube } from 'youtubei.js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function extractVideoId(url: string) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const id = extractVideoId(url);
        if (!id) {
            return new Response(JSON.stringify({ error: 'Invalid YouTube URL' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Use WEB_REMIX client which is the YouTube Music client, often more permissive for audio
        const youtube = await Innertube.create();
        const info = await youtube.getBasicInfo(id);

        const stream = await youtube.download(id, {
            type: 'audio',
            quality: 'best'
        });

        if (!stream) {
            throw new Error('Streaming data not found');
        }

        return new Response(stream, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Access-Control-Allow-Origin': '*',
                'X-Video-Title': encodeURIComponent(info.basic_info.title || 'YouTube Audio'),
                'Cache-Control': 'no-cache',
            }
        });

    } catch (e: any) {
        console.error('YouTube Proxy Error:', e);
        return new Response(JSON.stringify({
            error: e.message,
            type: e.constructor.name,
            url: url
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
