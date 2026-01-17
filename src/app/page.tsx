'use client';

import Link from 'next/link';
import { categories } from '@/data/tools';
import {
  ChevronRight,
  Zap,
  ShieldCheck,
  Activity,
  TrendingUp,
  Search,
  Globe,
  Layout,
  FileCode,
  Gauge,
  Sparkles,
  Command,
  ArrowUpRight,
  Cpu,
  Layers,
  Fingerprint
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import { Reveal, Card, Badge, Button, Magnetic } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="bg-bg-primary min-h-screen neural-grid">
      {/* Cinematic Hero Interface */}
      <section className="relative pt-48 pb-32 md:pt-64 md:pb-48 overflow-hidden">
        {/* Dynamic Neural Layer */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[60rem] h-[60rem] bg-accent/10 blur-[160px] rounded-full animate-glow" />
          <div className="absolute bottom-0 right-1/4 w-[50rem] h-[50rem] bg-indigo-500/10 blur-[160px] rounded-full animate-glow" style={{ animationDelay: '-4s' }} />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        </div>

        <div className="page-container relative z-10">
          <div className="max-w-[1200px] mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-2xl glass border border-accent/20 mb-16 shadow-2xl animate-float">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-fg-secondary">System Operational • v4.0 Elite</span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-8xl md:text-[13rem] font-black mb-16 tracking-[-0.08em] text-fg-primary leading-[0.75] font-heading">
                YOUR LAB. <br /> <span className="gradient-text italic">YOUR RULES.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="max-w-4xl mx-auto relative group">
                <div className="absolute -inset-2 bg-accent/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                <Magnetic>
                  <div className="relative glass p-6 rounded-[3rem] shadow-[0_80px_160px_-40px_rgba(37,99,235,0.2)] border-2 border-accent/10 hover:border-accent/30 transition-all duration-700">
                    <SearchBar />
                  </div>
                </Magnetic>

                <div className="flex flex-wrap justify-center gap-10 mt-12">
                  {[
                    { label: 'Image Lab', href: '/tools#images' },
                    { label: 'PDF Console', href: '/tools#pdf' },
                    { label: 'SEO Auditor', href: '/tools#seo' },
                    { label: 'Neural Rewrite', href: '/tools#ai' }
                  ].map((tag) => (
                    <Magnetic key={tag.label}>
                      <Link href={tag.href} className="flex items-center gap-3 text-xs font-black text-fg-tertiary hover:text-accent transition-all uppercase tracking-widest group/tag">
                        <div className="w-1.5 h-1.5 rounded-full bg-fg-tertiary group-hover/tag:bg-accent animate-pulse" />
                        {tag.label}
                      </Link>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Operational Sectors - Command Grid */}
      <section className="py-48 bg-linear-to-b from-bg-primary to-bg-secondary relative border-y border-glass-border">
        <div className="page-container">
          <div className="flex flex-col items-center mb-40 text-center">
            <Reveal>
              <Badge variant="accent" className="mb-10 px-8 py-2 glass rounded-full">CORE REGISTRY</Badge>
              <h2 className="text-6xl md:text-9xl font-black tracking-[-0.06em] text-fg-primary leading-none font-heading mb-12">
                Operational <span className="text-accent italic">Sectors</span>
              </h2>
              <div className="h-1.5 w-40 bg-accent/20 rounded-full mx-auto" />
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category, index) => (
              <Reveal key={category.id} delay={index * 0.1}>
                <div className="premium-card p-12 group h-full flex flex-col border-2 border-transparent">
                  <div className="absolute top-0 right-0 p-12 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <category.icon size={220} className="text-accent opacity-[0.03] rotate-12" />
                  </div>

                  <div className="flex items-start justify-between mb-16">
                    <Magnetic>
                      <div className="w-20 h-20 rounded-3xl bg-accent text-white flex items-center justify-center shadow-2xl shadow-accent/40 group-hover:rotate-6 transition-all duration-700">
                        <category.icon size={36} />
                      </div>
                    </Magnetic>
                    <div className="text-[11px] font-black uppercase tracking-[0.4em] text-accent/60 shimmer">
                      Sector {index + 1}
                    </div>
                  </div>

                  <h3 className="text-4xl font-black font-heading mb-6 text-fg-primary group-hover:text-accent transition-colors tracking-tighter">
                    {category.title}
                  </h3>
                  <p className="text-fg-secondary text-lg mb-12 font-medium leading-relaxed opacity-70">
                    {category.description}
                  </p>

                  <div className="space-y-5 mb-12 mt-6">
                    {category.tools.slice(0, 4).map((tool) => (
                      <Link
                        key={tool.name}
                        href={tool.href}
                        className="flex items-center group/item hover:translate-x-2 transition-transform duration-500"
                      >
                        <div className="w-2 h-2 rounded-full border border-accent/30 mr-5 group-hover/item:bg-accent group-hover/item:border-accent group-hover/item:scale-150 transition-all" />
                        <span className="text-base font-black text-fg-secondary group-hover/item:text-fg-primary transition-all tracking-tight">{tool.name}</span>
                        <ArrowUpRight size={16} className="ml-auto opacity-0 -translate-y-2 group-hover/item:opacity-100 group-hover/item:translate-y-0 transition-all text-accent" />
                      </Link>
                    ))}
                  </div>

                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

