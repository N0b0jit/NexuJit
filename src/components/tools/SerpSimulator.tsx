'use client';

import { useState, useEffect } from 'react';
import { Search, Globe, Smartphone, Monitor, Info, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function SerpSimulator() {
    const [title, setTitle] = useState('Your Page Title Goes Here - SEO Studio Elite');
    const [url, setUrl] = useState('https://seostudio.tools/your-awesome-page');
    const [description, setDescription] = useState('Optimize your search appearance with our live SERP simulator. See exactly how your meta tags look on Google before you publish.');
    const [view, setView] = useState<'desktop' | 'mobile'>('desktop');

    const titleLimit = 60;
    const descLimit = 160;

    const titlePixels = title.length * 8.5; // Rough estimate for pixel width
    const descPixels = description.length * 5.2;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header section */}
            <div className="text-center space-y-4">
                <Badge variant="accent" className="px-6 py-1.5 rounded-full">SEO POWER TOOL</Badge>
                <h1 className="text-5xl font-black tracking-tighter italic">Neural <span className="text-accent">SERP</span> Simulator</h1>
                <p className="text-fg-secondary max-w-2xl mx-auto font-medium">
                    Visualize your search snippet in real-time. Optimize for click-through rates by maintaining perfect pixel lengths.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Editor Side */}
                <div className="space-y-6">
                    <Card className="p-8 space-y-6 border-2 border-accent/10">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <Search size={20} className="text-accent" />
                                Snippet Editor
                            </h3>
                            <div className="flex bg-bg-secondary p-1 rounded-xl border border-glass-border">
                                <button
                                    onClick={() => setView('desktop')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${view === 'desktop' ? 'bg-accent text-white shadow-lg' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                                >
                                    <Monitor size={14} /> Desktop
                                </button>
                                <button
                                    onClick={() => setView('mobile')}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${view === 'mobile' ? 'bg-accent text-white shadow-lg' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                                >
                                    <Smartphone size={14} /> Mobile
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-black uppercase tracking-widest text-fg-tertiary">Meta Title</label>
                                    <span className={`text-[10px] font-bold ${title.length > titleLimit ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {title.length} / {titleLimit} chars (~{Math.round(titlePixels)}px)
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="w-full bg-bg-secondary border-2 border-glass-border rounded-xl p-4 font-bold text-fg-primary focus:border-accent outline-none transition-all"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter page title"
                                />
                                <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (title.length / titleLimit) * 100)}%` }}
                                        className={`h-full ${title.length > titleLimit ? 'bg-red-500' : 'bg-accent'}`}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-black uppercase tracking-widest text-fg-tertiary">Slug / URL</label>
                                </div>
                                <div className="flex items-center gap-2 bg-bg-secondary border-2 border-glass-border rounded-xl p-4">
                                    <Globe size={16} className="text-fg-tertiary" />
                                    <input
                                        type="text"
                                        className="flex-1 bg-transparent border-none outline-none font-bold text-fg-secondary text-sm"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs font-black uppercase tracking-widest text-fg-tertiary">Meta Description</label>
                                    <span className={`text-[10px] font-bold ${description.length > descLimit ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {description.length} / {descLimit} chars (~{Math.round(descPixels)}px)
                                    </span>
                                </div>
                                <textarea
                                    className="w-full bg-bg-secondary border-2 border-glass-border rounded-xl p-4 font-medium text-fg-secondary text-sm focus:border-accent outline-none transition-all h-32 resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter meta description"
                                />
                                <div className="h-1 w-full bg-bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (description.length / descLimit) * 100)}%` }}
                                        className={`h-full ${description.length > descLimit ? 'bg-red-500' : 'bg-accent'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button className="flex-1 bg-accent/10 border-2 border-accent/20 text-accent hover:bg-accent hover:text-white transition-all">
                                Analyze Content
                            </Button>
                        </div>
                    </Card>

                    <div className="p-6 rounded-2xl bg-bg-secondary border border-glass-border">
                        <h4 className="flex items-center gap-2 text-sm font-black mb-4"><Info size={16} className="text-accent" /> SEO Analysis</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                {title.length <= titleLimit ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                                <span className="text-xs text-fg-secondary font-medium">Title length: {title.length <= titleLimit ? 'Optimal for search results.' : 'Title may be truncated.'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {description.length <= descLimit ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                                <span className="text-xs text-fg-secondary font-medium">Description length: {description.length <= descLimit ? 'Fits well within snippet area.' : 'Description exceeds the visible limit.'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CheckCircle size={16} className="text-emerald-500" />
                                <span className="text-xs text-fg-secondary font-medium">URL structure is clean and readable.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Side */}
                <div className="space-y-6 lg:sticky lg:top-24 h-fit">
                    <div className="text-xs font-black uppercase tracking-widest text-fg-tertiary mb-2 px-2">Live Google Preview</div>

                    {view === 'desktop' ? (
                        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200 overflow-hidden min-h-[300px]">
                            <div className="max-w-[600px] font-sans">
                                <div className="flex items-center text-[#202124] text-[14px] leading-relaxed mb-1 truncate opacity-70">
                                    {url}
                                    <div className="ml-1 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-gray-500"></div>
                                </div>
                                <h3 className="text-[#1a0dab] text-[20px] font-normal leading-tight mb-1 hover:underline cursor-pointer">
                                    {title}
                                </h3>
                                <p className="text-[#4d5156] text-[14px] leading-relaxed line-clamp-2">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-[360px] bg-white rounded-[3rem] shadow-2xl p-6 border-[8px] border-gray-900 overflow-hidden relative min-h-[500px]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl" />
                            <div className="mt-8 font-sans">
                                <div className="bg-white border rounded-full px-4 py-2 flex items-center gap-3 mb-6 shadow-sm border-gray-100">
                                    <Search size={14} className="text-gray-400" />
                                    <div className="text-xs font-medium text-gray-900 truncate flex-1">{title}</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50/50 rounded-xl space-y-1">
                                        <div className="text-[#202124] text-[12px] opacity-70 truncate">{url}</div>
                                        <h3 className="text-[#1a0dab] text-[18px] font-normal leading-tight">{title}</h3>
                                        <p className="text-[#4d5156] text-[14px] leading-relaxed line-clamp-3">{description}</p>
                                    </div>
                                    <div className="h-40 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-widest">
                                        More Search Results...
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Card className="p-6 bg-accent/5 border border-accent/20">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-sm mb-1 uppercase tracking-tight">AI Enhancement Idea</h4>
                                <p className="text-xs text-fg-secondary leading-relaxed italic">
                                    "Try using power words like 'Comprehensive', 'Ultimate', or 'Proven' at the start of your title to increase click-through rates by up to 28%."
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
