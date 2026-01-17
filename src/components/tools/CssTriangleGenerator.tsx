'use client';

import { useState } from 'react';
import { Copy, Check, Settings2, Play } from 'lucide-react';

const DIRECTIONS = ['up', 'down', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

export default function CssTriangleGenerator() {
    const [direction, setDirection] = useState('up');
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [color, setColor] = useState('#6366f1');
    const [copied, setCopied] = useState(false);

    const getTriangleStyles = () => {
        const styles: any = {
            width: 0,
            height: 0,
            borderStyle: 'solid',
        };

        const w = width / 2;
        const h = height / 2;

        switch (direction) {
            case 'up':
                styles.borderWidth = `0 ${w}px ${height}px ${w}px`;
                styles.borderColor = `transparent transparent ${color} transparent`;
                break;
            case 'down':
                styles.borderWidth = `${height}px ${w}px 0 ${w}px`;
                styles.borderColor = `${color} transparent transparent transparent`;
                break;
            case 'left':
                styles.borderWidth = `${h}px ${width}px ${h}px 0`;
                styles.borderColor = `transparent ${color} transparent transparent`;
                break;
            case 'right':
                styles.borderWidth = `${h}px 0 ${h}px ${width}px`;
                styles.borderColor = `transparent transparent transparent ${color}`;
                break;
            case 'top-left':
                styles.borderWidth = `${height}px ${width}px 0 0`;
                styles.borderColor = `${color} transparent transparent transparent`;
                break;
            case 'top-right':
                styles.borderWidth = `0 ${width}px ${height}px 0`;
                styles.borderColor = `transparent ${color} transparent transparent`;
                break;
            case 'bottom-left':
                styles.borderWidth = `${height}px 0 0 ${width}px`;
                styles.borderColor = `transparent transparent transparent ${color}`;
                break;
            case 'bottom-right':
                styles.borderWidth = `0 0 ${height}px ${width}px`;
                styles.borderColor = `transparent transparent ${color} transparent`;
                break;
        }

        return styles;
    };

    const cssCode = `width: 0;
height: 0;
border-style: solid;
border-width: ${getTriangleStyles().borderWidth};
border-color: ${getTriangleStyles().borderColor};`;

    const handleCopy = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="layout">
                <div className="preview-area">
                    <div style={getTriangleStyles()}></div>
                </div>

                <div className="controls">
                    <div className="card">
                        <div className="card-header"><Settings2 size={16} /> Triangle Settings</div>

                        <div className="grid-selection">
                            {DIRECTIONS.map(d => (
                                <button
                                    key={d}
                                    className={`dir-btn ${direction === d ? 'active' : ''}`}
                                    onClick={() => setDirection(d)}
                                    title={d}
                                >
                                    <div className={`arrow ${d}`} />
                                </button>
                            ))}
                        </div>

                        <div className="input-group">
                            <label>Width: {width}px</label>
                            <input type="range" min="10" max="200" value={width} onChange={e => setWidth(parseInt(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Height: {height}px</label>
                            <input type="range" min="10" max="200" value={height} onChange={e => setHeight(parseInt(e.target.value))} />
                        </div>

                        <div className="input-group">
                            <label>Triangle Color</label>
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                        </div>

                        <div className="code-display">
                            <div className="code-header">
                                <span>CSS Export</span>
                                <button onClick={handleCopy}>
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre><code>{cssCode}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .layout { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; }
                .preview-area { height: 400px; background: white; border-radius: 1.5rem; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; }
                
                .grid-selection { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1.5rem; }
                .dir-btn { height: 50px; border-radius: 0.5rem; background: var(--background); display: flex; align-items: center; justify-content: center; border: 2px solid transparent; }
                .dir-btn.active { border-color: var(--primary); background: #f0f7ff; }
                
                .arrow { width: 0; height: 0; border-style: solid; border-width: 0 8px 12px 8px; border-color: transparent transparent #64748b transparent; }
                .arrow.down { transform: rotate(180deg); }
                .arrow.left { transform: rotate(-90deg); }
                .arrow.right { transform: rotate(90deg); }
                .arrow.top-left { border-width: 12px 12px 0 0; border-color: #64748b transparent transparent transparent; }
                /* ... more arrow icons if needed, but simple rotations work for basic 4 */
                
                .input-group label { display: block; font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; }
                .input-group { margin-bottom: 1rem; }
                input[type="range"] { width: 100%; }
                
                .code-display { background: #1e293b; border-radius: 1rem; overflow: hidden; margin-top: 1rem; }
                .code-header { background: #0f172a; padding: 0.5rem 1rem; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 0.7rem; font-weight: 700; }
                pre { padding: 1rem; margin: 0; overflow-x: auto; color: #38bdf8; font-family: monospace; font-size: 0.7rem; line-height: 1.5; }

                @media (max-width: 800px) {
                    .layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
