'use client';

import { useState, useEffect } from 'react';
import { Percent, Eye, MessageSquare, ThumbsUp, Share2, Info } from 'lucide-react';
import { Card, Input, Button } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

export default function YoutubeViewsRatio() {
    const [views, setViews] = useState('100000');
    const [likes, setLikes] = useState('5000');
    const [comments, setComments] = useState('250');
    const [shares, setShares] = useState('150');

    const [ratios, setRatios] = useState({
        likeToView: 0,
        commentToView: 0,
        shareToView: 0,
        engagement: 0
    });

    const calculate = () => {
        const v = parseFloat(views) || 0;
        const l = parseFloat(likes) || 0;
        const c = parseFloat(comments) || 0;
        const s = parseFloat(shares) || 0;

        if (v === 0) return;

        setRatios({
            likeToView: (l / v) * 100,
            commentToView: (c / v) * 100,
            shareToView: (s / v) * 100,
            engagement: ((l + c + s) / v) * 100
        });
    };

    useEffect(() => {
        calculate();
    }, [views, likes, comments, shares]);

    const getStatus = (val: number, type: 'likes' | 'comments' | 'engagement') => {
        const benchmarks = {
            likes: { good: 4, average: 2 },
            comments: { good: 0.5, average: 0.2 },
            engagement: { good: 5, average: 2 }
        };
        const b = (benchmarks as any)[type];
        if (val >= b.good) return { label: 'Excellent', color: 'text-emerald-500' };
        if (val >= b.average) return { label: 'Good', color: 'text-amber-500' };
        return { label: 'Needs Growth', color: 'text-rose-500' };
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Input Panel */}
                <Card className="lg:col-span-5 p-8 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-fg px-1">Video Performance Data</label>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold flex items-center gap-2"><Eye size={14} className="text-accent" /> Total Views</label>
                                <Input type="number" value={views} onChange={(e: any) => setViews(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold flex items-center gap-2"><ThumbsUp size={14} className="text-emerald-500" /> Total Likes</label>
                                <Input type="number" value={likes} onChange={(e: any) => setLikes(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold flex items-center gap-2"><MessageSquare size={14} className="text-blue-500" /> Total Comments</label>
                                <Input type="number" value={comments} onChange={(e: any) => setComments(e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold flex items-center gap-2"><Share2 size={14} className="text-amber-500" /> Total Shares</label>
                                <Input type="number" value={shares} onChange={(e: any) => setShares(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-xl border border-border flex gap-3">
                        <Info size={18} className="text-accent shrink-0" />
                        <p className="text-[10px] text-muted-fg leading-relaxed">
                            Ratios help identify if your content truly resonates with your audience beyond just the view count. High engagement ratios signal healthy organic growth.
                        </p>
                    </div>
                </Card>

                {/* Analysis Dashboard */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatioCard
                            title="Engagement Rate"
                            val={ratios.engagement}
                            icon={Percent}
                            status={getStatus(ratios.engagement, 'engagement')}
                        />
                        <RatioCard
                            title="Like-to-View"
                            val={ratios.likeToView}
                            icon={ThumbsUp}
                            status={getStatus(ratios.likeToView, 'likes')}
                        />
                        <RatioCard
                            title="Comment-to-View"
                            val={ratios.commentToView}
                            icon={MessageSquare}
                            status={getStatus(ratios.commentToView, 'comments')}
                        />
                        <RatioCard
                            title="Share-to-View"
                            val={ratios.shareToView}
                            icon={Share2}
                            status={getStatus(0, 'engagement')} // Simplified
                        />
                    </div>

                    <Card className="p-8 bg-accent/5 border-accent/20">
                        <h3 className="text-xl font-black text-fg mb-6 tracking-tight">Intelligence Report</h3>
                        <div className="space-y-4">
                            <ReportItem
                                label="Retention Strength"
                                score={ratios.engagement > 3 ? 'High' : 'Targeted'}
                                desc="Based on your interaction volume per view."
                            />
                            <ReportItem
                                label="Viral Potential"
                                score={ratios.shareToView > 0.5 ? 'Strong' : 'Stable'}
                                desc="Social sharing velocity relative to audience."
                            />
                            <ReportItem
                                label="Discussion Health"
                                score={ratios.commentToView > 0.8 ? 'Excellent' : 'Average'}
                                desc="The frequency of user dialogue within your content."
                            />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

const RatioCard = ({ title, val, icon: Icon, status }: any) => (
    <Card className="p-6 space-y-4 hover:border-accent/30 transition-all group">
        <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                <Icon size={20} />
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</div>
        </div>
        <div>
            <div className="text-3xl font-black tracking-tighter">{val.toFixed(2)}%</div>
            <div className="text-[10px] font-bold text-muted-fg uppercase tracking-widest">{title}</div>
        </div>
    </Card>
);

const ReportItem = ({ label, score, desc }: any) => (
    <div className="flex items-start justify-between py-3 border-b border-accent/10 last:border-0">
        <div>
            <div className="text-xs font-black uppercase text-accent mb-1">{label}</div>
            <div className="text-xs text-muted-fg font-medium">{desc}</div>
        </div>
        <div className="text-lg font-black">{score}</div>
    </div>
);
