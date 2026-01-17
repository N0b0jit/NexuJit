'use client';

import { useState } from 'react';
import FlipImage from './FlipImage';
import RotateImage from './RotateImage';
import { ArrowLeftRight, RotateCw } from 'lucide-react';

export default function FlipRotateImage() {
    const [mode, setMode] = useState<'flip' | 'rotate'>('flip');

    return (
        <div className="tool-wrapper">
            <div className="mode-switcher">
                <button
                    className={mode === 'flip' ? 'active' : ''}
                    onClick={() => setMode('flip')}
                >
                    <ArrowLeftRight size={18} /> Flip Image
                </button>
                <button
                    className={mode === 'rotate' ? 'active' : ''}
                    onClick={() => setMode('rotate')}
                >
                    <RotateCw size={18} /> Rotate Image
                </button>
            </div>

            <div className="tool-container">
                {mode === 'flip' ? <FlipImage /> : <RotateImage />}
            </div>

            <style jsx>{`
                .tool-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }
                .mode-switcher {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    background: var(--surface);
                    padding: 0.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    width: fit-content;
                    margin: 0 auto;
                }
                button {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.75rem;
                    border: none;
                    background: transparent;
                    color: var(--secondary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                button.active {
                    background: var(--primary);
                    color: white;
                }
            `}</style>
        </div>
    );
}
