'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function Marquee() {
    return (
        <div className="marquee-container">
            <div className="marquee-content">
                <span><Sparkles size={14} /> Free SEO Tools</span>
                <span><Sparkles size={14} /> AI Content Generator</span>
                <span><Sparkles size={14} /> Video Downloader</span>
                <span><Sparkles size={14} /> Format Converters</span>
                <span><Sparkles size={14} /> Image Tools</span>
                <span><Sparkles size={14} /> PDF Utilities</span>
                {/* Duplicate for seamless loop */}
                <span><Sparkles size={14} /> Free SEO Tools</span>
                <span><Sparkles size={14} /> AI Content Generator</span>
                <span><Sparkles size={14} /> Video Downloader</span>
                <span><Sparkles size={14} /> Format Converters</span>
                <span><Sparkles size={14} /> Image Tools</span>
                <span><Sparkles size={14} /> PDF Utilities</span>
            </div>

            <style jsx>{`
                .marquee-container {
                    background: linear-gradient(90deg, #4f46e5, #ec4899);
                    color: white;
                    overflow: hidden;
                    white-space: nowrap;
                    padding: 0.5rem 0;
                    font-size: 0.85rem;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    position: relative;
                    z-index: 101; /* Above navbar if placed top */
                }

                .marquee-content {
                    display: inline-block;
                    animation: marquee 30s linear infinite;
                }

                .marquee-content span {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-right: 3rem;
                }

                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .marquee-container:hover .marquee-content {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
