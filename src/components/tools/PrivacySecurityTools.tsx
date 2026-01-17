'use client';

import { useState } from 'react';
import { Shield, Eye, Lock, FileSearch, Trash2, ShieldCheck, AlertTriangle, Fingerprint } from 'lucide-react';

export default function PrivacySecurityTools({ defaultTab = 'breach' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'breach', label: 'Breach Check', icon: Shield },
        { id: 'safety', label: 'URL Safety', icon: Eye },
        { id: 'email', label: 'Email Analyzer', icon: Lock },
        { id: 'metadata', label: 'Metadata Edu', icon: FileSearch },
        { id: 'cleaner', label: 'Link Cleaner', icon: Trash2 },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-2 justify-center bg-surface p-2 rounded-xl border border-border sticky top-4 z-20 backdrop-blur-md">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'hover:bg-background text-secondary'}`}
                    >
                        <tab.icon size={18} />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="bg-surface p-8 rounded-3xl border border-border shadow-lg min-h-[500px]">
                {activeTab === 'breach' && <BreachAwareness />}
                {activeTab === 'safety' && <UrlSafetyHint />}
                {activeTab === 'email' && <EmailHeaderAnalyzer />}
                {activeTab === 'metadata' && <MetadataEducation />}
                {activeTab === 'cleaner' && <TrackingCleaner />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function BreachAwareness() {
    return (
        <div className="space-y-10 py-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black">Public Breach Awareness</h2>
                <p className="text-secondary">Understanding risks without compromising your email address</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] space-y-4">
                    <AlertTriangle className="text-red-500" size={32} />
                    <h3 className="text-xl font-black">What is a Data Breach?</h3>
                    <p className="text-secondary leading-relaxed font-medium">Occurs when sensitive information is accessed without authorization. Compromised data often includes passwords, emails, and personal IDs.</p>
                </div>
                <div className="p-8 bg-green-500/5 border border-green-500/20 rounded-[2.5rem] space-y-4">
                    <ShieldCheck className="text-green-500" size={32} />
                    <h3 className="text-xl font-black">How to Stay Safe?</h3>
                    <p className="text-secondary leading-relaxed font-medium">Use a unique password for every service, enable Multi-Factor Authentication (MFA), and use a password manager.</p>
                </div>
            </div>

            <div className="p-8 bg-background border border-border rounded-3xl text-center">
                <h4 className="font-bold mb-4">Historical Major Breaches</h4>
                <div className="flex flex-wrap justify-center gap-2">
                    {['Yahoo (3B)', 'Aadhaar (1.1B)', 'Canva (137M)', 'LinkedIn (164M)'].map(b => (
                        <span key={b} className="text-[10px] font-black uppercase bg-surface px-4 py-2 rounded-full border border-border">{b}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}

function UrlSafetyHint() {
    const [url, setUrl] = useState('');
    const [score, setScore] = useState<any>(null);

    const check = () => {
        let sc = 100;
        const hints = [];
        if (!url.startsWith('https')) { sc -= 40; hints.push("Insecure connection (No HTTPS)"); }
        if (url.length > 50) { sc -= 10; hints.push("Long URL often hides phishing components"); }
        if (/[0-9]{1,3}\.[0-9]{1,3}/.test(url)) { sc -= 30; hints.push("Uses IP address instead of domain name"); }

        setScore({ value: sc, hints });
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto py-10">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black">URL Safety Hint Tool</h2>
                <p className="text-secondary">Heuristic-based check for suspicious links</p>
            </div>

            <div className="flex gap-2">
                <input
                    placeholder="Enter URL (e.g., http://unknown-site.tk)..."
                    className="flex-1 p-4 bg-background border border-border rounded-2xl font-bold"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button onClick={check} className="px-8 py-4 bg-primary text-white font-black rounded-2xl">Analyze</button>
            </div>

            {score && (
                <div className="p-8 bg-background border border-border rounded-[3rem] space-y-6 text-center">
                    <div className="text-6xl font-black" style={{ color: score.value > 70 ? '#22c55e' : score.value > 40 ? '#f59e0b' : '#ef4444' }}>
                        {score.value}%
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest bg-surface px-4 py-1 rounded-full border border-border inline-block">Safety Score</div>

                    <div className="text-left space-y-2 mt-6">
                        {score.hints.map((h: string) => (
                            <div key={h} className="text-sm font-bold text-secondary flex items-start gap-2">
                                <span className="text-red-500 shrink-0">●</span> {h}
                            </div>
                        ))}
                        {score.hints.length === 0 && <p className="text-center text-green-500 font-bold">Looks clean to our basic scanner!</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

function EmailHeaderAnalyzer() {
    return (
        <div className="space-y-8 py-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-center">Email Security Analyzer</h2>
            <div className="space-y-4">
                <div className="p-6 bg-background border border-border rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary"><ShieldCheck size={18} /> SPF (Sender Policy Framework)</div>
                    <p className="text-sm text-secondary">Specifies which mail servers are authorized to send email on behalf of your domain.</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary"><Lock size={18} /> DKIM (DomainKeys Identified Mail)</div>
                    <p className="text-sm text-secondary">Adds a digital signature to emails, allowing the receiver to verify that the email was authorized by the owner of that domain.</p>
                </div>
                <div className="p-6 bg-background border border-border rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-primary"><Eye size={18} /> DMARC</div>
                    <p className="text-sm text-secondary">A policy layer on top of SPF/DKIM that tells the receiver what to do if these checks fail (e.g., quarantine or reject).</p>
                </div>
            </div>
            <div className="p-8 bg-primary/5 border-2 border-dashed border-primary/20 rounded-3xl text-center">
                <p className="text-primary font-black">Paste headers to test validation logic.</p>
            </div>
        </div>
    );
}

function MetadataEducation() {
    return (
        <div className="space-y-10 py-10 text-center">
            <h2 className="text-2xl font-black">Hidden Metadata Education</h2>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="p-8 bg-background border border-border rounded-3xl space-y-4">
                    <Fingerprint className="mx-auto text-primary" size={32} />
                    <h3 className="font-bold">EXIF Data</h3>
                    <p className="text-xs text-secondary">Can reveal GPS coordinates, camera model, and exact timestamp of a photo.</p>
                </div>
                <div className="p-8 bg-background border border-border rounded-3xl space-y-4">
                    <FileSearch className="mx-auto text-primary" size={32} />
                    <h3 className="font-bold">Doc History</h3>
                    <p className="text-xs text-secondary">PDFs/Word files can hide author names, edit history, and internal file paths.</p>
                </div>
                <div className="p-8 bg-background border border-border rounded-3xl space-y-4">
                    <Eye className="mx-auto text-primary" size={32} />
                    <h3 className="font-bold">Tracking Pixels</h3>
                    <p className="text-xs text-secondary">Tiny 1x1 images in emails let senders know when, where, and how often you opened the mail.</p>
                </div>
            </div>
        </div>
    );
}

function TrackingCleaner() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const clean = () => {
        try {
            const url = new URL(input);
            const params = new URLSearchParams(url.search);
            const bad = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'mc_eid', '_hsenc'];
            bad.forEach(b => params.delete(b));
            url.search = params.toString();
            setOutput(url.toString());
        } catch (e) {
            setOutput('Invalid URL entered.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black">Tracking Parameter Cleaner</h2>
                <p className="text-secondary text-sm">Remove UTM, Facebook, and Google tracking IDs for clean sharing.</p>
            </div>

            <div className="space-y-4">
                <textarea
                    placeholder="Paste URL with trackers..."
                    className="w-full p-4 bg-background border border-border rounded-2xl font-mono text-xs h-24"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={clean} className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg">Clean URL</button>
            </div>

            {output && (
                <div className="p-8 bg-background border border-border rounded-[2.5rem] relative group">
                    <div className="text-sm font-mono break-all font-bold pr-10">{output}</div>
                    <button
                        onClick={() => navigator.clipboard.writeText(output)}
                        className="absolute top-4 right-4 p-2 bg-primary/10 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        Copy
                    </button>
                    <div className="mt-4 text-[10px] font-black uppercase text-green-500">Trackers Stripped ✓</div>
                </div>
            )}
        </div>
    );
}
