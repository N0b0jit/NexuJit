'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Twitter,
    Github,
    Linkedin,
    Globe,
    MessageCircle
} from 'lucide-react';
import { Button } from './ui/Core';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [whatsappUrl, setWhatsappUrl] = useState('');

    useEffect(() => {
        const text = encodeURIComponent(`Hello NexuJit Team! I have a feature request/feedback.\n\nTimestamp: ${new Date().toLocaleString()}`);
        setWhatsappUrl(`https://wa.me/8801615999193?text=${text}`);
    }, []);

    return (
        <footer className="bg-bg-secondary border-t border-glass-border pt-24 pb-12 transition-colors duration-300">
            <div className="page-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Area */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 shadow-lg shadow-accent/20">
                                <Image
                                    src="/logo.png"
                                    alt="NexuJit"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-heading text-xl font-extrabold tracking-tight text-fg-primary">NexuJit</span>
                                <span className="text-[10px] uppercase font-bold text-accent tracking-widest leading-none">Your Browser. Your Lab.</span>
                            </div>
                        </Link>
                        <p className="text-fg-secondary text-sm leading-relaxed max-w-sm font-body">
                            No account. No tracking. No backdoors. Just professional digital tools that run entirely on your device.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, MessageCircle].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-bg-tertiary/40 border border-glass-border flex items-center justify-center text-fg-tertiary hover:border-accent hover:text-accent hover:shadow-lg transition-all"
                                >
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="font-heading text-sm font-bold text-fg-primary uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-4">
                            {['Home', 'All Tools', 'API Access', 'Newsletter'].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-medium text-fg-secondary hover:text-accent transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="lg:col-span-2 space-y-6">
                        <h4 className="font-heading text-sm font-bold text-fg-primary uppercase tracking-widest">Legal</h4>
                        <ul className="space-y-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((link) => (
                                <li key={link}>
                                    <Link href="#" className="text-sm font-medium text-fg-secondary hover:text-accent transition-colors">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / CTA */}
                    <div className="lg:col-span-4">
                        <div className="glass bg-bg-tertiary/20 rounded-2xl border border-glass-border p-8 shadow-sm">
                            <h4 className="font-heading text-lg font-bold text-fg-primary mb-2">Request Upgrades</h4>
                            <p className="text-sm text-fg-secondary mb-6 font-body">Direct line to the dev team for features & bug reports.</p>
                            <div className="space-y-3">
                                <a
                                    href={whatsappUrl || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full"
                                >
                                    <Button variant="primary" size="md" fullWidth className="shadow-lg shadow-accent/20 flex items-center gap-3">
                                        <MessageCircle size={20} />
                                        <span>Chat on WhatsApp</span>
                                    </Button>
                                </a>
                                <p className="text-[10px] text-center text-fg-tertiary opacity-70">
                                    Typical response time: &lt; 2 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs font-medium text-fg-tertiary">
                        © {currentYear} NexuJit. The open-source digital playground.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">All Systems Operational</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-fg-tertiary">
                            <Globe size={14} />
                            <span>US East (Global)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
