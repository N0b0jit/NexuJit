import { Suspense } from 'react';
import { categories } from '@/data/tools';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowRight, Zap, ShieldCheck, Activity, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import ToolClientWrapper from '@/components/ToolClientWrapper';

// Core UI Components
import { ToolShell, Card, Reveal, Badge } from '@/components/ui/Core';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params;
    let tool = null;

    for (const cat of categories) {
        const found = cat.tools.find(t => t.href === `/tools/${slug}`);
        if (found) {
            tool = found;
            break;
        }
    }

    if (!tool) return { title: 'Tool Not Found' };

    return {
        title: `${tool.name} - Free Online Utility | NexuJit`,
        description: tool.description,
        openGraph: {
            title: tool.name,
            description: tool.description,
            type: 'website',
            url: `https://nexujit.app/tools/${slug}`,
        }
    };
}

// Loading Component
const ToolLoader = () => (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
        <p className="text-fg-tertiary font-medium animate-pulse">Initializing tool module...</p>
    </div>
);


export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    let currentTool = null;
    let currentCategory = null;

    for (const cat of categories) {
        const tool = cat.tools.find(t => t.href === `/tools/${slug}`);
        if (tool) {
            currentTool = tool;
            currentCategory = cat;
            break;
        }
    }

    if (!currentTool || !currentCategory) notFound();

    const relatedTools = currentCategory.tools
        .filter(t => t.href !== `/tools/${slug}`)
        .slice(0, 4);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: currentTool.name,
        description: currentTool.description,
        applicationCategory: 'Utility',
        operatingSystem: 'Any',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        }
    };

    return (
        <div className="bg-bg-primary min-h-screen">
            <Script
                id="tool-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Premium Breadcrumbs Interaction */}
            <div className="glass border-b border-accent/10 py-5 sticky top-24 z-40 shadow-sm shadow-accent/5 backdrop-blur-2xl">
                <div className="page-container flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-fg-tertiary">
                    <Link href="/" className="hover:text-accent transition-all hover:scale-105 active:scale-95">Home</Link>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                    <Link href={`/#${currentCategory.id}-tools`} className="hover:text-accent transition-all hover:scale-105 active:scale-95">{currentCategory.title}</Link>
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/20" />
                    <span className="text-accent shimmer">{currentTool.name}</span>
                </div>
            </div>

            <ToolShell
                title={currentTool.name}
                description={currentTool.description}
                secondaryArea={
                    <div className="space-y-12">
                        <div className="glass p-10 rounded-[2.5rem] border border-accent/10">
                            <h5 className="font-black text-xs uppercase tracking-[0.3em] text-fg-primary mb-6 flex items-center gap-3">
                                <Activity size={18} className="text-accent animate-pulse" />
                                Processing Protocol
                            </h5>
                            <p className="text-sm font-medium leading-relaxed text-fg-secondary opacity-70">
                                This module is an integral part of our <span className="text-accent font-black">{currentCategory.title}</span> neural network,
                                optimized for high-fidelity extraction and professional throughput.
                            </p>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-glass-border">
                            <h5 className="font-black text-xs uppercase tracking-[0.3em] text-fg-primary mb-2">Technical Purity</h5>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { text: 'Uncapped Execution', icon: Zap },
                                    { text: 'Quantum Privacy', icon: ShieldCheck },
                                    { text: '0-Server Latency', icon: Activity },
                                    { text: 'Adaptive Interface', icon: Sparkles }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-xs font-black text-fg-secondary uppercase tracking-widest bg-bg-tertiary/40 p-4 rounded-xl border border-transparent hover:border-accent/10 transition-all group">
                                        <item.icon size={16} className="text-accent group-hover:scale-125 transition-transform" />
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            >
                <div className="min-h-[400px]">
                    <ToolClientWrapper slug={slug} />
                </div>
            </ToolShell>

            {/* Comprehensive Intelligence Layer */}
            <div className="page-container pb-48">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Knowledge Core */}
                    <div className="lg:col-span-8 space-y-16">
                        <Reveal>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter font-heading">Intelligence: {currentTool.name}</h2>
                                <p className="text-xl text-fg-secondary leading-relaxed mb-12 font-medium opacity-70 max-w-3xl">
                                    Our {currentTool.name} architecture is meticulously crafted for professionals who demand
                                    precision. By utilizing client-side computational power, we provide a secure environment
                                    that far exceeds traditional server-based alternatives.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
                                    <Card padding="p-10" className="bg-bg-tertiary/30 border-accent/5">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                                            <ShieldCheck className="text-accent" />
                                        </div>
                                        <h4 className="font-black text-xl mb-4 tracking-tight">
                                            Vault Security
                                        </h4>
                                        <p className="text-sm font-medium leading-relaxed text-fg-secondary opacity-60">
                                            Your input never migrates to external nodes. All logic is executed within
                                            your browser's transient memory, ensuring total data sovereignty.
                                        </p>
                                    </Card>
                                    <Card padding="p-10" className="bg-bg-tertiary/30 border-accent/5">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                                            <Zap className="text-emerald-500" />
                                        </div>
                                        <h4 className="font-black text-xl mb-4 tracking-tight">
                                            High-Thrust Engine
                                        </h4>
                                        <p className="text-sm font-medium leading-relaxed text-fg-secondary opacity-60">
                                            Experience immediate feedback with zero network overhead. Our modules
                                            are compiled for speed, delivering results in milliseconds.
                                        </p>
                                    </Card>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Registry Neighbors Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <Reveal delay={0.2}>
                            <h3 className="font-black text-xl mb-8 uppercase tracking-[0.2em] opacity-60">Sector Neighbors</h3>
                            <div className="grid grid-cols-1 gap-5">
                                {relatedTools.map((tool, i) => (
                                    <Link key={tool.name} href={tool.href} className="group">
                                        <div className="p-6 glass rounded-[1.75rem] border border-accent/10 group-hover:border-accent group-hover:shadow-2xl transition-all duration-500">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex flex-col gap-1 overflow-hidden">
                                                    <span className="font-black text-base text-fg-primary group-hover:text-accent transition-colors truncate">{tool.name}</span>
                                                    <span className="text-[10px] uppercase font-black tracking-widest text-fg-tertiary opacity-40 line-clamp-1">{tool.description}</span>
                                                </div>
                                                <ArrowRight size={18} className="text-accent shrink-0 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link href={`/#${currentCategory.id}`} className="group flex items-center justify-center gap-3 px-8 py-5 rounded-2xl glass border border-accent/10 mt-10 hover:border-accent transition-all">
                                <span className="text-xs font-black uppercase tracking-[0.3em] group-hover:text-accent">Full Registry Analysis</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 group-hover:text-accent transition-all" />
                            </Link>
                        </Reveal>
                    </div>
                </div>
            </div>
        </div>
    );
}
