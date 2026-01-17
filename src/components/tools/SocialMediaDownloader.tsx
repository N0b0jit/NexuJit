'use client';

import React, { useState } from 'react';
import { Download, Link as LinkIcon, Trash2, List, Settings2, Loader2, CheckCircle2, AlertCircle, Video } from 'lucide-react';
import { ToolShell, Card, Button, Textarea, Select, Badge } from '@/components/ui/Core';

interface DownloadItem {
    id: string;
    url: string;
    status: 'idle' | 'fetching' | 'ready' | 'downloading' | 'completed' | 'error';
    title?: string;
    thumbnail?: string;
    platform?: 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'pinterest' | 'unknown';
    formats?: any[];
    selectedFormat?: string;
    error?: string;
    progress?: number;
    downloadUrl?: string;
}

export default function SocialMediaDownloader() {
    const [urlsText, setUrlsText] = useState('');
    const [items, setItems] = useState<DownloadItem[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const addBatch = () => {
        const lines = urlsText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const newItems: DownloadItem[] = lines.map(url => ({
            id: Math.random().toString(36).substring(7),
            url,
            status: 'idle'
        }));
        setItems([...items, ...newItems]);
        setUrlsText('');
    };

    const fetchInfo = async (index: number) => {
        const item = items[index];
        updateItem(index, { status: 'fetching', error: undefined });

        try {
            const res = await fetch('/api/download/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: item.url })
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch info');

            updateItem(index, {
                status: 'ready',
                title: data.title,
                thumbnail: data.thumbnail,
                platform: data.platform,
                formats: data.formats,
                selectedFormat: data.formats?.[0]?.id || 'default'
            });
        } catch (err: any) {
            updateItem(index, { status: 'error', error: err.message });
        }
    };

    const startDownload = async (index: number) => {
        const item = items[index];
        updateItem(index, { status: 'downloading', progress: 0 });

        try {
            const selectedFormat = item.formats?.find(f => f.id === item.selectedFormat);

            if (selectedFormat && selectedFormat.url) {
                const a = document.createElement('a');
                a.href = selectedFormat.url;
                a.download = `${item.title || 'video'}.mp4`;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                updateItem(index, { status: 'completed', progress: 100 });
                return;
            }

            const res = await fetch('/api/download/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: item.url, formatId: item.selectedFormat, platform: item.platform })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Download failed');
            }

            const data = await res.json();

            if (data.directUrl) {
                const a = document.createElement('a');
                a.href = data.directUrl;
                a.download = `${item.title || 'video'}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                updateItem(index, { status: 'completed', progress: 100 });
            } else {
                throw new Error('No download link received');
            }

        } catch (err: any) {
            updateItem(index, { status: 'error', error: err.message });
        }
    };

    const processAll = async () => {
        setIsProcessing(true);
        for (let i = 0; i < items.length; i++) {
            if (items[i].status === 'idle') {
                await fetchInfo(i);
            }
        }
        setIsProcessing(false);
    };

    const updateItem = (index: number, updates: Partial<DownloadItem>) => {
        setItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], ...updates };
            return next;
        });
    };

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id));
    };

    const clearAll = () => setItems([]);

    const getPlatformColor = (p?: string) => {
        switch (p) {
            case 'youtube': return 'danger';
            case 'tiktok': return 'neutral';
            case 'instagram': return 'accent';
            case 'facebook': return 'info';
            case 'pinterest': return 'danger';
            default: return 'neutral';
        }
    };

    return (
        <ToolShell
            title="Global Media Downloader"
            description="Universal media extraction engine for high-fidelity content retrieval from major social networks."
        >
            <div className="space-y-12">
                {/* Input Section */}
                <Card className="border-accent/20 shadow-2xl shadow-accent/5">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-4 text-accent mb-2">
                            <List size={32} />
                            <h2 className="text-2xl font-black uppercase tracking-widest">Target URLs</h2>
                        </div>

                        <Textarea
                            label="Paste Video Links (One per line)"
                            placeholder={`https://www.youtube.com/watch?...\nhttps://www.tiktok.com/@user/video/...\nhttps://www.instagram.com/reels/...`}
                            value={urlsText}
                            onChange={(e: any) => setUrlsText(e.target.value)}
                            className="font-mono text-sm leading-relaxed"
                            rows={6}
                        />

                        <div className="flex flex-wrap gap-4">
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={addBatch}
                                disabled={!urlsText.trim()}
                                className="flex-1"
                            >
                                <LinkIcon size={20} className="mr-3" />
                                EXECUTE BATCH ADD
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={clearAll}
                                disabled={items.length === 0}
                            >
                                <Trash2 size={20} className="mr-3" />
                                FLUSH QUEUE
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Queue Control */}
                {items.length > 0 && (
                    <div className="flex flex-wrap justify-between items-center gap-6 glass p-6 rounded-[2rem] border border-accent/20">
                        <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-fg-tertiary">Queue Status</span>
                            <span className="text-2xl font-black text-white">{items.length} TARGETS <span className="text-accent opacity-50 mx-2">/</span> {items.filter(i => i.status === 'completed').length} COMPLETED</span>
                        </div>
                        <Button variant="secondary" onClick={processAll} disabled={isProcessing} className="bg-accent/10 hover:bg-accent/20 border-accent/20">
                            {isProcessing ? <Loader2 className="animate-spin mr-3" size={20} /> : <Download size={20} className="mr-3" />}
                            INITIATE ALL FETCHES
                        </Button>
                    </div>
                )}

                {/* List Items */}
                <div className="grid gap-6">
                    {items.map((item, idx) => (
                        <Card key={item.id} padding="p-0" className="overflow-hidden border-white/5 hover:border-accent/20 group">
                            <div className="flex flex-col md:flex-row h-full">
                                {/* Thumbnail */}
                                <div className="relative w-full md:w-[280px] aspect-video md:aspect-auto bg-black/40 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                                    {item.thumbnail ? (
                                        <>
                                            <img src={item.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                                            {item.platform && (
                                                <div className="absolute top-4 left-4">
                                                    <Badge variant={getPlatformColor(item.platform) as any} className="shadow-xl backdrop-blur-md">
                                                        {item.platform}
                                                    </Badge>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Video size={48} className="text-white/10" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1 overflow-hidden">
                                                <div className="text-xs font-mono text-accent truncate opacity-60">{item.url}</div>
                                                {item.title && <h3 className="text-xl font-bold text-white line-clamp-2">{item.title}</h3>}
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-white/20 hover:text-rose-500 transition-colors p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Status Indicators */}
                                        <div className="flex items-center gap-3 text-sm font-medium">
                                            {item.status === 'fetching' && <span className="text-amber-400 flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> ANALYZING METADATA...</span>}
                                            {item.status === 'ready' && <span className="text-emerald-400 flex items-center gap-2"><CheckCircle2 size={14} /> READY FOR EXTRACTION</span>}
                                            {item.status === 'downloading' && (
                                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden relative max-w-[200px]">
                                                    <div className="absolute inset-y-0 left-0 bg-accent w-1/2 animate-shimmer-fast" />
                                                </div>
                                            )}
                                            {item.status === 'completed' && <span className="text-accent flex items-center gap-2"><CheckCircle2 size={14} /> DOWNLOAD COMPLETE</span>}
                                            {item.status === 'error' && <span className="text-rose-500 flex items-center gap-2"><AlertCircle size={14} /> {item.error?.toUpperCase()}</span>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {item.status === 'ready' && (
                                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
                                            {item.formats && item.formats.length > 0 && (
                                                <div className="flex-1 min-w-[200px]">
                                                    <select
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-fg-secondary focus:outline-none focus:border-accent/40"
                                                        value={item.selectedFormat}
                                                        onChange={(e) => updateItem(idx, { selectedFormat: e.target.value })}
                                                    >
                                                        {item.formats.map((f: any) => (
                                                            <option key={f.id} value={f.id}>{f.label} ({f.size || 'UNK'})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                            <Button
                                                size="sm"
                                                onClick={() => startDownload(idx)}
                                                className="shrink-0"
                                            >
                                                <Download size={16} className="mr-2" />
                                                DOWNLOAD NOW
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </ToolShell>
    );
}
