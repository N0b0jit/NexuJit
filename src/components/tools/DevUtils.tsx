'use client';

import { useState } from 'react';
import { Terminal, Code, Info, Shield, Network, Cpu, Smartphone } from 'lucide-react';

export default function DevUtils({ defaultTab = 'headers' }: { defaultTab?: string }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'headers', label: 'HTTP Headers', icon: Terminal },
        { id: 'mime', label: 'MIME Explorer', icon: Code },
        { id: 'status', label: 'Status Story', icon: Info },
        { id: 'ua', label: 'UA Breakdown', icon: Smartphone },
        { id: 'dns', label: 'DNS Tester', icon: Network },
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
                {activeTab === 'headers' && <HttpHeaderDecoder />}
                {activeTab === 'mime' && <MimeExplorer />}
                {activeTab === 'status' && <StatusCodeStory />}
                {activeTab === 'ua' && <UserAgentBreakdown />}
                {activeTab === 'dns' && <DnsTester />}
            </div>
        </div>
    );
}

// --- Sub-components ---

function HttpHeaderDecoder() {
    const [input, setInput] = useState('');
    const [parsed, setParsed] = useState<any[]>([]);

    const decode = () => {
        const lines = input.split('\n');
        const results = lines.map(line => {
            const [name, ...rest] = line.split(':');
            const value = rest.join(':').trim();
            if (!name || !value) return null;

            // Basic explanation logic
            let desc = "Standard HTTP Header";
            if (name.toLowerCase() === 'user-agent') desc = "Identifies the client software.";
            if (name.toLowerCase() === 'content-type') desc = "Indicates the media type of the resource.";
            if (name.toLowerCase() === 'cache-control') desc = "Specifies caching policies.";
            if (name.toLowerCase() === 'set-cookie') desc = "Sends cookies from server to client.";

            return { name, value, desc };
        }).filter(Boolean);
        setParsed(results);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black">HTTP Header Decoder</h2>
            <div className="space-y-4">
                <textarea
                    placeholder="Paste raw HTTP headers here... Content-Type: application/json"
                    className="w-full h-40 p-4 bg-background border border-border rounded-2xl font-mono text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={decode} className="w-full py-4 bg-primary text-white font-black rounded-xl">Decode Headers</button>
            </div>

            {parsed.length > 0 && (
                <div className="grid gap-4">
                    {parsed.map((h, i) => (
                        <div key={i} className="p-4 bg-background border border-border rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-black text-primary font-mono">{h.name}</span>
                                <span className="text-[10px] bg-surface px-2 py-0.5 rounded border border-border font-bold uppercase">Info</span>
                            </div>
                            <div className="text-sm font-mono break-all mb-2">{h.value}</div>
                            <div className="text-xs text-secondary font-bold italic">{h.desc}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MimeExplorer() {
    const [search, setSearch] = useState('');
    const mimes = [
        { ext: '.json', type: 'application/json', desc: 'JSON format', cat: 'Data' },
        { ext: '.html', type: 'text/html', desc: 'HTML Document', cat: 'Web' },
        { ext: '.css', type: 'text/css', desc: 'CSS Stylesheet', cat: 'Web' },
        { ext: '.js', type: 'application/javascript', desc: 'JavaScript Source', cat: 'Logic' },
        { ext: '.png', type: 'image/png', desc: 'Portable Network Graphics', cat: 'Media' },
        { ext: '.pdf', type: 'application/pdf', desc: 'PDF Document', cat: 'Doc' },
    ];

    const filtered = mimes.filter(m => m.ext.includes(search) || m.type.includes(search));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black">MIME Type Explorer</h2>
            <input
                placeholder="Search extension or type (e.g. .json)..."
                className="w-full p-4 bg-background border border-border rounded-2xl font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="grid gap-4 md:grid-cols-2">
                {filtered.map(m => (
                    <div key={m.ext} className="p-6 bg-background border border-border rounded-2xl flex justify-between items-center group hover:border-primary transition-all">
                        <div>
                            <div className="text-2xl font-black">{m.ext}</div>
                            <div className="font-mono text-sm text-primary font-bold">{m.type}</div>
                            <div className="text-xs text-secondary mt-1">{m.desc}</div>
                        </div>
                        <div className="opacity-10 group-hover:opacity-100 transition-opacity">
                            <Code className="text-primary" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatusCodeStory() {
    const codes = [
        { code: '200', title: 'OK', story: 'Everything went perfectly. The server found what you wanted and handed it over with a smile.' },
        { code: '404', title: 'Not Found', story: 'The server looked everywhere under the bed and in the closet, but this page simply doesn\'t exist.' },
        { code: '500', title: 'Internal Server Error', story: 'Something went wrong inside the machine. The digital gears are jammed and the server needs a break.' },
        { code: '301', title: 'Moved Permanently', story: 'This page has packed its bags and moved to a new address forever.' },
        { code: '403', title: 'Forbidden', story: 'You aren\'t on the guest list. The server isn\'t letting you in, no matter how many times you ask.' },
        { code: '418', title: 'I\'m a teapot', story: 'I cannot brew coffee because I am a teapot. This is a real, albeit humorous, part of the standard.' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black">HTTP Status: Story Mode</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {codes.map(c => (
                    <div key={c.code} className="p-8 bg-background border border-border rounded-[2.5rem] space-y-4 hover:shadow-xl transition-shadow">
                        <div className="text-5xl font-black text-primary opacity-20">{c.code}</div>
                        <h3 className="text-2xl font-black">{c.title}</h3>
                        <p className="text-lg leading-relaxed text-secondary italic">"{c.story}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function UserAgentBreakdown() {
    const [ua, setUa] = useState(typeof window !== 'undefined' ? window.navigator.userAgent : '');

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-black">User Agent Breakdown</h2>
            <div className="space-y-4">
                <input
                    placeholder="User Agent String..."
                    className="w-full p-4 bg-background border border-border rounded-xl font-mono text-xs"
                    value={ua}
                    onChange={(e) => setUa(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="p-6 bg-background rounded-3xl border border-border space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Smartphone size={18} /> OS & Platform</h3>
                    <div className="text-2xl font-black text-primary">
                        {ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : 'Mobile/Other'}
                    </div>
                </div>
                <div className="p-6 bg-background rounded-3xl border border-border space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Cpu size={18} /> Browser Engine</h3>
                    <div className="text-2xl font-black text-primary">
                        {ua.includes('WebKit') ? 'WebKit (Chrome/Safari)' : ua.includes('Gecko') ? 'Gecko (Firefox)' : 'Other'}
                    </div>
                </div>
            </div>
        </div>
    );
}

function DnsTester() {
    return (
        <div className="space-y-8 text-center py-10">
            <h2 className="text-2xl font-black">Public DNS Speed Test</h2>
            <div className="grid gap-4 md:grid-cols-3">
                <DnsCard name="Cloudflare" ip="1.1.1.1" speed="12ms" status="Fastest" />
                <DnsCard name="Google" ip="8.8.8.8" speed="15ms" status="Standard" />
                <DnsCard name="OpenDNS" ip="208.67.222.222" speed="22ms" status="Stable" />
            </div>
            <p className="text-xs text-secondary font-bold">Simulated latencies based on global average benchmarks.</p>
        </div>
    );
}

const DnsCard = ({ name, ip, speed, status }: any) => (
    <div className="p-8 bg-background border border-border rounded-3xl space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform"><Network size={64} /></div>
        <div className="text-xl font-black">{name}</div>
        <div className="font-mono text-sm text-primary">{ip}</div>
        <div className="text-4xl font-black">{speed}</div>
        <div className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full">{status}</div>
    </div>
);
