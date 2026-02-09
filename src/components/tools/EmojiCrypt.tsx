'use client';

import { useState, useEffect } from 'react';
import { Shield, Sparkles, Copy, Check, Info, Lock, Unlock, Eye, Ghost, AlertCircle } from 'lucide-react';
import { Card, Reveal, Button, Badge } from '@/components/ui/Core';

// Zero Width Characters used for steganography
// We use a prefix and suffix to uniquely identify our hidden payload
const ZWC = {
    ONE: '\u200B',   // Zero Width Space
    ZERO: '\u200C',  // Zero Width Non-Joiner
    START: '\u200D', // Zero Width Joiner as start marker
    END: '\uFEFF',   // Byte Order Mark as end marker (invisible)
};

export default function EmojiCrypt() {
    const [mounted, setMounted] = useState(false);
    const [publicText, setPublicText] = useState('Type your cover message here...');
    const [secretMessage, setSecretMessage] = useState('');
    const [result, setResult] = useState('');
    const [decodeInput, setDecodeInput] = useState('');
    const [decodedSecret, setDecodedSecret] = useState('');
    const [copied, setCopied] = useState(false);
    const [mode, setMode] = useState<'smuggle' | 'extract'>('smuggle');
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const textToBinary = (text: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        return Array.from(data).map(byte => byte.toString(2).padStart(8, '0')).join('');
    };

    const binaryToText = (binary: string) => {
        const bytes = [];
        for (let i = 0; i < binary.length; i += 8) {
            bytes.push(parseInt(binary.slice(i, i + 8), 2));
        }
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(bytes));
    };

    const binaryToZWC = (binary: string) => {
        const encoded = binary.split('').map(bit => bit === '1' ? ZWC.ONE : ZWC.ZERO).join('');
        return ZWC.START + encoded + ZWC.END;
    };

    const smuggle = () => {
        setError('');
        if (!secretMessage.trim()) {
            setError('Please enter a secret message to hide.');
            return;
        }

        try {
            const binary = textToBinary(secretMessage);
            const zwcEncoded = binaryToZWC(binary);

            // Inject after the first character or at index 1
            const injectionIndex = publicText.length > 0 ? 1 : 0;
            const final = publicText.slice(0, injectionIndex) + zwcEncoded + publicText.slice(injectionIndex);
            setResult(final);
        } catch (err) {
            setError('Encryption failed. Check your input.');
        }
    };

    const extract = () => {
        setError('');
        if (!decodeInput.trim()) {
            setError('Paste some text to analyze.');
            return;
        }

        // Find the sequence between START and END
        const startIndex = decodeInput.indexOf(ZWC.START);
        const endIndex = decodeInput.indexOf(ZWC.END);

        let zwcSequence = '';
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
            zwcSequence = decodeInput.slice(startIndex + 1, endIndex);
        } else {
            // Fallback: try to find any ZWC sequence if markers aren't perfectly placed
            zwcSequence = decodeInput.split('').filter(char => char === ZWC.ONE || char === ZWC.ZERO).join('');
        }

        if (!zwcSequence) {
            setDecodedSecret('No hidden payload detected in this string.');
            return;
        }

        try {
            const binary = zwcSequence.split('').map(char => {
                if (char === ZWC.ONE) return '1';
                if (char === ZWC.ZERO) return '0';
                return '';
            }).join('');

            // Ensure binary length is multiple of 8
            const cleanBinary = binary.slice(0, Math.floor(binary.length / 8) * 8);
            if (!cleanBinary) throw new Error('Invalid payload');

            const secret = binaryToText(cleanBinary);
            setDecodedSecret(secret);
        } catch (e) {
            setDecodedSecret('Forensic match found, but data is corrupted or encrypted differently.');
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-12" suppressHydrationWarning>
            <div className="flex gap-4 p-2 glass rounded-2xl w-fit mx-auto mb-12">
                <button
                    onClick={() => { setMode('smuggle'); setError(''); }}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'smuggle' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-fg-tertiary hover:text-accent'}`}
                >
                    Smuggle Payload
                </button>
                <button
                    onClick={() => { setMode('extract'); setError(''); }}
                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'extract' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-fg-tertiary hover:text-accent'}`}
                >
                    Forensic Extraction
                </button>
            </div>

            {error && (
                <Reveal>
                    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-bold uppercase tracking-wider mb-6">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                </Reveal>
            )}

            {mode === 'smuggle' ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                                <Eye size={14} /> Cover Media (Visible Text)
                            </label>
                            <textarea
                                value={publicText}
                                onChange={(e) => setPublicText(e.target.value)}
                                className="w-full h-40 glass rounded-3xl p-6 text-lg font-medium border-2 border-transparent focus:border-accent/40 outline-none transition-all resize-none"
                                placeholder="Example: Wow, this is a great photo! 📸"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
                                <Ghost size={14} /> Ghost Payload (Hidden Message)
                            </label>
                            <textarea
                                value={secretMessage}
                                onChange={(e) => setSecretMessage(e.target.value)}
                                className="w-full h-40 glass rounded-3xl p-6 text-lg font-medium border-2 border-transparent focus:border-rose-500/40 outline-none transition-all resize-none"
                                placeholder="Example: Meet me at 9 PM behind the fountain."
                            />
                        </div>
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        onClick={smuggle}
                        className="rounded-3xl shadow-2xl shadow-accent/20 h-20 text-xl"
                    >
                        <Lock className="mr-3" size={24} /> Inject Invisible Payload
                    </Button>

                    {result && (
                        <Reveal>
                            <Card className="bg-accent/5 border-accent/10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="accent">Smuggled Output</Badge>
                                        <span className="text-[8px] font-black uppercase text-accent/60 opacity-60 tracking-[0.2em]">Encrypted Byte Stream</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(result)}
                                        className="p-3 glass rounded-xl text-accent hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-6"
                                    >
                                        {copied ? <Check size={18} /> : <Copy size={18} />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                </div>
                                <div className="p-8 glass rounded-2xl bg-white/5 border border-white/10">
                                    <p className="text-2xl font-medium text-fg-primary break-all selection:bg-accent/30">
                                        {result}
                                    </p>
                                </div>
                                <div className="mt-8 flex items-center justify-center gap-4 text-center">
                                    <div className="h-px bg-accent/20 flex-1" />
                                    <p className="text-[10px] font-bold text-fg-tertiary uppercase tracking-[0.3em] opacity-60">
                                        Message Successfully Smuggled
                                    </p>
                                    <div className="h-px bg-accent/20 flex-1" />
                                </div>
                            </Card>
                        </Reveal>
                    )}
                </div>
            ) : (
                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-accent flex items-center gap-2">
                            <Unlock size={14} /> Paste Suspect Text
                        </label>
                        <textarea
                            value={decodeInput}
                            onChange={(e) => setDecodeInput(e.target.value)}
                            className="w-full h-56 glass rounded-[2.5rem] p-10 text-xl font-medium border-2 border-transparent focus:border-accent/40 outline-none transition-all resize-none"
                            placeholder="Right-click and paste target text here..."
                        />
                    </div>

                    <Button
                        fullWidth
                        size="lg"
                        onClick={extract}
                        variant="secondary"
                        className="rounded-3xl h-20 text-xl border-accent/20 hover:border-accent transition-all"
                    >
                        <Sparkles className="mr-3 text-accent animate-pulse" size={24} /> Run Deep Scan & Extract
                    </Button>

                    {decodedSecret && (
                        <Reveal>
                            <Card className="bg-rose-500/5 border-rose-500/10">
                                <div className="flex items-center justify-between mb-6">
                                    <Badge variant="danger">Recovered Metadata</Badge>
                                    {decodedSecret !== 'No hidden payload detected in this string.' && (
                                        <button
                                            onClick={() => handleCopy(decodedSecret)}
                                            className="p-3 glass rounded-xl text-rose-500 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 px-6"
                                        >
                                            {copied ? <Check size={18} /> : <Copy size={18} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'Copied' : 'Copy'}</span>
                                        </button>
                                    )}
                                </div>
                                <div className="p-10 glass rounded-3xl bg-white/5 border border-white/10 min-h-[120px] flex items-center justify-center">
                                    <p className={`text-2xl tracking-tight text-center ${decodedSecret.includes('No hidden payload') ? 'text-fg-tertiary opacity-40 italic font-medium' : 'text-fg-primary font-black'}`}>
                                        {decodedSecret}
                                    </p>
                                </div>
                            </Card>
                        </Reveal>
                    )}
                </div>
            )}

            <div className="pt-20 border-t border-glass-border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                            <Shield size={24} />
                        </div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-fg-primary">Steganographic Core</h4>
                        <p className="text-[11px] font-semibold leading-relaxed text-fg-tertiary opacity-80">
                            Utilizes non-printable Unicode scalars (U+200B through U+200D) to embed high-entropy data within visible strings.
                        </p>
                    </div>
                    <div className="space-y-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <Lock size={24} />
                        </div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-fg-primary">Cross-Platform Ghosting</h4>
                        <p className="text-[11px] font-semibold leading-relaxed text-fg-tertiary opacity-80">
                            Messages are technically valid Unicode and can be transmitted via Twitter, Discord, and Telegram without detection.
                        </p>
                    </div>
                    <div className="space-y-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Info size={24} />
                        </div>
                        <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-fg-primary">Forensic Analysis</h4>
                        <p className="text-[11px] font-semibold leading-relaxed text-fg-tertiary opacity-80">
                            A educational utility designed for security professionals to understand how binary data can leak through text channels.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
