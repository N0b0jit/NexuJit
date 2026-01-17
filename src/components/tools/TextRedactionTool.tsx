'use client';

import { useState } from 'react';
import { ShieldAlert, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function TextRedactionTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ emails: 0, phones: 0, ips: 0 });
    const [mode, setMode] = useState<string>('REDACTED');

    // Patterns
    const patterns = {
        email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        phone: /(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
        ip: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
        ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
        creditCard: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g
    };

    const process = () => {
        let text = input;
        let emails = 0;
        let phones = 0;
        let ips = 0;

        // Custom replacement logic
        const replace = (match: string) => mode === '█' ? '█'.repeat(match.length) : (mode === 'xxxx' ? 'x'.repeat(match.length) : `[${mode}]`);

        // Emails
        text = text.replace(patterns.email, (match) => {
            emails++;
            return replace(match);
        });

        // Phones
        text = text.replace(patterns.phone, (match) => {
            phones++;
            return replace(match);
        });

        // IPs
        text = text.replace(patterns.ip, (match) => {
            ips++;
            return replace(match);
        });

        setStats({ emails, phones, ips });
        setOutput(text);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-secondary uppercase text-sm">Input Text</label>
                        <button onClick={() => setInput('')} className="text-xs text-red-500 hover:underline">Clear</button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste text containing sensitive info like emails (john@example.com), phone numbers, or IPs..."
                        className="w-full h-80 p-4 bg-background border border-border rounded-xl focus:border-primary outline-none transition-colors resize-none font-mono text-sm"
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="font-bold text-secondary uppercase text-sm">Redacted Output</label>
                        <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs text-primary hover:underline flex items-center gap-1">
                            <Copy size={12} /> Copy
                        </button>
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className="w-full h-80 p-4 bg-surface border border-border rounded-xl outline-none font-mono text-sm text-foreground/80 resize-none selection:bg-red-500/30"
                        placeholder="Redacted text will appear here..."
                    />
                </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-secondary uppercase">Redaction Style</label>
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium outline-none"
                        >
                            <option value="REDACTED">[REDACTED]</option>
                            <option value="HIDDEN">[HIDDEN]</option>
                            <option value="CONFIDENTIAL">[CONFIDENTIAL]</option>
                            <option value="█">Blackout (████)</option>
                            <option value="xxxx">Mask (xxxx)</option>
                        </select>
                    </div>

                    <div className="flex gap-4 border-l border-border pl-6">
                        <div className="text-center">
                            <div className="text-xs font-bold text-secondary uppercase mb-1">Emails</div>
                            <div className="font-black text-lg">{stats.emails}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-bold text-secondary uppercase mb-1">Phones</div>
                            <div className="font-black text-lg">{stats.phones}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-bold text-secondary uppercase mb-1">IPs</div>
                            <div className="font-black text-lg">{stats.ips}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={process}
                    className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                >
                    <ShieldAlert size={20} /> Redact Sensitive Info
                </button>
            </div>
        </div>
    );
}
