
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (type === 'ping') {
        return new NextResponse('pong', { status: 200 });
    }

    if (type === 'download') {
        // Generate a 5MB buffer of random data (or just zeros for speed)
        // Creating a large buffer might be memory intensive on serverless, 
        // but 5MB is generally safe.
        const sizeInfo = searchParams.get('size'); // query defaults to 5MB
        const size = sizeInfo ? parseInt(sizeInfo) : 5 * 1024 * 1024;

        // Chunked response might be better for "streaming" measurement feeling,
        // but a simple blob works for basic calculation.
        const buffer = new Uint8Array(size);
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': size.toString(),
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
            }
        });
    }

    return new NextResponse('Invalid Type', { status: 400 });
}

export async function POST(req: NextRequest) {
    // For upload testing, we just receive the body and return "ok".
    // We don't prefer reading the whole body if we want raw speed, but Next.js
    // might buffer it. We just acknowledge receipt.
    const blob = await req.blob(); // Consume the stream
    return new NextResponse(JSON.stringify({ received: blob.size }), { status: 200 });
}
