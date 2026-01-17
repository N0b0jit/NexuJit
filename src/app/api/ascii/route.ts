import { NextRequest, NextResponse } from 'next/server';
import figlet from 'figlet';

// This is a server-side route to handle figlet generation safely
// We need to install figlet types: npm i -D @types/figlet
// And figlet itself: npm i figlet

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { text, font = 'Standard' } = body;

        if (!text) {
            return NextResponse.json({ result: '' });
        }

        const result = await new Promise<string>((resolve, reject) => {
            figlet(text, { font: font as any }, (err, data) => {
                if (err) reject(err);
                else resolve(data || '');
            });
        });

        return NextResponse.json({ result });
    } catch (e) {
        return NextResponse.json({ result: 'Error generating ASCII art.' }, { status: 500 });
    }
}
