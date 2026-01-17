'use client';

import { useState } from 'react';
import { Globe, Download, Plus, Trash2, Check, RefreshCw, FileCode, PlusCircle, Link2, Code2 } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function SitemapGenerator() {
    const [baseUrl, setBaseUrl] = useState('');
    const [pages, setPages] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [sitemap, setSitemap] = useState('');

    const addPage = () => setPages([...pages, '']);
    const removePage = (index: number) => {
        const newPages = pages.filter((_, i) => i !== index);
        setPages(newPages.length ? newPages : ['']);
    };

    const updatePage = (index: number, value: string) => {
        const newPages = [...pages];
        newPages[index] = value;
        setPages(newPages);
    };

    const generateSitemap = () => {
        if (!baseUrl.trim()) return;
        setLoading(true);

        setTimeout(() => {
            const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
            xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
            xml += `  <url>\n    <loc>${cleanBase}/</loc>\n    <priority>1.0</priority>\n  </url>\n`;
            pages.forEach(p => {
                if (p.trim()) {
                    const cleanPath = p.startsWith('/') ? p : `/${p}`;
                    xml += `  <url>\n    <loc>${cleanBase}${cleanPath}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
                }
            });
            xml += `</urlset>`;
            setSitemap(xml);
            setLoading(false);
        }, 1200);
    };

    const downloadSitemap = () => {
        const blob = new Blob([sitemap], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Configuration Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg px-1 flex items-center gap-2">
                            <Globe size={12} className="text-accent" /> Domain Authority
                        </label>
                        <Input
                            placeholder="https://yourwebsite.com"
                            value={baseUrl}
                            onChange={(e: any) => setBaseUrl(e.target.value)}
                            className="font-bold text-lg"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg">Crawl Paths</label>
                            <span className="text-[10px] font-bold text-accent">{pages.filter(p => p.trim()).length + 1} URLS Total</span>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                            <AnimatePresence initial={false}>
                                {pages.map((page, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="flex gap-2 group"
                                    >
                                        <div className="relative flex-1">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-fg pointer-events-none group-focus-within:text-accent transition-fast italic text-[10px] font-bold">/</div>
                                            <Input
                                                placeholder="about, contact, blog/post-name"
                                                value={page}
                                                onChange={(e: any) => updatePage(index, e.target.value)}
                                                className="pl-6 py-2 text-sm font-medium"
                                            />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removePage(index)} className="text-red-500 hover:bg-red-500/10">
                                            <Trash2 size={14} />
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <Button variant="secondary" onClick={addPage} className="w-full border-dashed">
                            <PlusCircle size={16} /> Add URI segment
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full py-4 shadow-xl"
                        onClick={generateSitemap}
                        loading={loading}
                        disabled={!baseUrl || loading}
                    >
                        {loading ? 'Compiling Registry...' : 'Generate XML Map'} <FileCode size={16} fill="currentColor" />
                    </Button>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-7 space-y-4 h-full min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg flex items-center gap-2">
                            <Code2 size={12} className="text-accent" /> Compiled Output
                        </label>
                        {sitemap && (
                            <Button variant="ghost" size="sm" onClick={downloadSitemap} className="text-accent">
                                <Download size={14} /> Fetch XML File
                            </Button>
                        )}
                    </div>

                    <div className="relative flex-1 bg-muted/10 border-2 border-border rounded-2xl overflow-hidden min-h-[450px]">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <RefreshCw size={48} className="text-accent/20 animate-spin" />
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold italic">Building Site Graph...</h3>
                                        <p className="text-xs text-muted-fg font-medium italic">Mapping URI fragments to XML schema</p>
                                    </div>
                                </motion.div>
                            ) : sitemap ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-6 h-full font-mono text-[13px] leading-relaxed overflow-auto no-scrollbar"
                                >
                                    <div className="text-muted-fg select-none mb-4">// Sitemap Engine Analysis Successful</div>
                                    <pre className="text-fg whitespace-pre-wrap">{sitemap}</pre>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 opacity-30"
                                >
                                    <FileCode size={64} className="text-muted-fg group-hover:scale-110 transition-fast" />
                                    <p className="text-sm font-bold italic max-w-xs uppercase tracking-widest">Awaiting Domain Initialization</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
