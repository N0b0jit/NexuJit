'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Check, Fingerprint } from 'lucide-react';

export default function UuidGenerator() {
    const [uuid, setUuid] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [history, setHistory] = useState<string[]>([]);

    const generateUUID = () => {
        let newUuids: string[] = [];
        for (let i = 0; i < quantity; i++) {
            newUuids.push(crypto.randomUUID());
        }
        const result = newUuids.join('\n');
        setUuid(result);
        setHistory(prev => [...newUuids, ...prev].slice(0, 10));
        setCopied(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(uuid);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg space-y-6">
                <div className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-bold text-secondary uppercase tracking-wider">Quantity</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={quantity}
                            onChange={e => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-full p-3 bg-background border border-border rounded-xl outline-none focus:border-primary font-bold text-lg"
                        />
                    </div>
                    <button
                        onClick={generateUUID}
                        className="flex-[2] py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={20} /> Generate UUIDs
                    </button>
                </div>

                <div className="relative">
                    <textarea
                        value={uuid}
                        readOnly
                        className="w-full h-48 p-4 bg-background border border-border rounded-xl font-mono text-lg resize-none focus:border-primary outline-none"
                        placeholder="Click generate to create UUIDs..."
                    />
                    {uuid && (
                        <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 p-2 bg-surface border border-border rounded-lg hover:text-primary transition-colors"
                        >
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    )}
                </div>
            </div>

            {history.length > 0 && (
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-secondary">
                        <Fingerprint size={18} /> Recent Generations
                    </h3>
                    <div className="space-y-2">
                        {history.map((h, i) => (
                            <div key={i} className="font-mono text-sm text-secondary border-b border-border/50 last:border-0 pb-2">
                                {h}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
