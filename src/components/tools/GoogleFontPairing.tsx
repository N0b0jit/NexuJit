'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink, Copy, Check } from 'lucide-react';

const FONT_PAIRS = [
    { heading: 'Playfair Display', body: 'Source Sans Pro', tags: ['Classic', 'Elegant'] },
    { heading: 'Montserrat', body: 'Open Sans', tags: ['Modern', 'Clean'] },
    { heading: 'Roboto', body: 'Roboto Mono', tags: ['Technical', 'Structured'] },
    { heading: 'Lora', body: 'Merriweather', tags: ['Serif', 'Literary'] },
    { heading: 'Oswald', body: 'Quattrocento', tags: ['Bold', 'Punchy'] },
    { heading: 'Abril Fatface', body: 'Lato', tags: ['Stylish', 'High Contrast'] },
    { heading: 'Raleway', body: 'Cabin', tags: ['Soft', 'Friendly'] },
    { heading: 'Ubuntu', body: 'Lora', tags: ['Unique', 'Balanced'] },
    { heading: 'Work Sans', body: 'Tisa Sans Pro', tags: ['Professional', 'Readable'] },
    { heading: 'Space Grotesk', body: 'Inter', tags: ['Futuristic', 'Minimal'] },
];

export default function GoogleFontPairing() {
    const [currentPair, setCurrentPair] = useState(FONT_PAIRS[0]);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Load fonts dynamically
        const fontsToLoad = [currentPair.heading, currentPair.body].map(f => f.replace(' ', '+')).join('|');
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css?family=${fontsToLoad}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            document.head.removeChild(link);
        };
    }, [currentPair]);

    const randomize = () => {
        let next;
        do {
            next = FONT_PAIRS[Math.floor(Math.random() * FONT_PAIRS.length)];
        } while (next === currentPair);
        setCurrentPair(next);
    };

    const copyCSS = () => {
        const css = `/* Heading */\nfont-family: '${currentPair.heading}', serif;\n\n/* Body */\nfont-family: '${currentPair.body}', sans-serif;`;
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="preview-card">
                <div className="card-header">
                    <div className="tags">
                        {currentPair.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                    <button onClick={randomize} className="refresh-btn">
                        <RefreshCw size={18} /> New Pairing
                    </button>
                </div>

                <div className="preview-content">
                    <h1 style={{ fontFamily: currentPair.heading }}>The quick brown fox jumps over the lazy dog</h1>
                    <p style={{ fontFamily: currentPair.body }}>
                        This is a preview of the body text. <strong>${currentPair.body}</strong> pairs beautifully with <strong>${currentPair.heading}</strong>.
                        Google Fonts offers a wide range of typography that can transform your website's aesthetic.
                        Experimenting with different weights and styles can create a unique visual hierarchy.
                    </p>
                    <button className="cta-button" style={{ fontFamily: currentPair.body }}>Get Started Today</button>
                </div>

                <div className="card-footer">
                    <div className="font-info">
                        <div>
                            <span className="label">Heading:</span>
                            <span className="font-name">{currentPair.heading}</span>
                        </div>
                        <div>
                            <span className="label">Body:</span>
                            <span className="font-name">{currentPair.body}</span>
                        </div>
                    </div>
                    <div className="actions">
                        <button onClick={copyCSS} className="icon-btn">
                            {copied ? <Check size={18} color="#10b981" /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy CSS'}
                        </button>
                        <a
                            href={`https://fonts.google.com/?query=${currentPair.heading}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-btn"
                        >
                            <ExternalLink size={18} /> Google Fonts
                        </a>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .preview-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
                }
                .card-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .tags {
                    display: flex;
                    gap: 0.5rem;
                }
                .tag {
                    background: var(--background);
                    padding: 0.25rem 0.75rem;
                    border-radius: 2rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--secondary);
                }
                .preview-content {
                    padding: 3rem 2rem;
                    min-height: 300px;
                }
                .preview-content h1 {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                    line-height: 1.2;
                }
                .preview-content p {
                    font-size: 1.125rem;
                    line-height: 1.7;
                    color: #4b5563;
                    max-width: 600px;
                    margin-bottom: 2rem;
                }
                .cta-button {
                    background: #000;
                    color: #fff;
                    padding: 0.75rem 2rem;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .card-footer {
                    padding: 1.5rem 2rem;
                    background: var(--background);
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .font-info {
                    display: flex;
                    gap: 2rem;
                }
                .label {
                    font-size: 0.75rem;
                    color: var(--secondary);
                    display: block;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .font-name {
                    font-size: 1rem;
                    font-weight: 600;
                }
                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    color: var(--primary);
                }
                .icon-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    background: white;
                    border: 1px solid var(--border);
                    font-size: 0.875rem;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .icon-btn:hover {
                    border-color: var(--primary);
                    color: var(--primary);
                }
                .actions {
                    display: flex;
                    gap: 1rem;
                }
                @media (max-width: 640px) {
                    .card-footer {
                        flex-direction: column;
                        gap: 1.5rem;
                        align-items: flex-start;
                    }
                    .preview-content h1 {
                        font-size: 2rem;
                    }
                }
            `}</style>
        </div>
    );
}
