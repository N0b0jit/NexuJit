import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

export default function ColorContrastChecker() {
    const [bgColor, setBgColor] = useState('#ffffff');
    const [textColor, setTextColor] = useState('#000000');
    const [ratio, setRatio] = useState<number | null>(null);
    const [passes, setPasses] = useState<boolean | null>(null);

    const calculateContrast = () => {
        const luminance = (hex: string) => {
            const rgb = parseInt(hex.slice(1), 16);
            const r = ((rgb >> 16) & 0xff) / 255;
            const g = ((rgb >> 8) & 0xff) / 255;
            const b = (rgb & 0xff) / 255;
            const srgb = [r, g, b].map(c => {
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
        };
        const L1 = luminance(bgColor) + 0.05;
        const L2 = luminance(textColor) + 0.05;
        const contrast = L1 > L2 ? L1 / L2 : L2 / L1;
        setRatio(parseFloat(contrast.toFixed(2)));
        setPasses(contrast >= 4.5);
    };

    return (
        <div className="tool-card">
            <h2 className="tool-title">Color Contrast Checker</h2>
            <p>Enter background and text colors (hex) to see WCAG contrast ratio.</p>
            <div className="inputs">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} />
            </div>
            <button onClick={calculateContrast} className="calc-btn">Check Contrast</button>
            {ratio !== null && (
                <p className="result">
                    Ratio: <strong>{ratio}:1</strong> – {passes ? <Check color="green" /> : <X color="red" />}
                </p>
            )}
            <style jsx>{`\n        .tool-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-md); }\n        .tool-title { color: var(--primary); margin-bottom: 0.5rem; }\n        .inputs { display: flex; gap: 1rem; margin: 1rem 0; }\n        .calc-btn { padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; }\n        .calc-btn:hover { background: var(--primary-dark); }\n        .result { margin-top: 1rem; font-size: 1.2rem; }\n      `}</style>
        </div>
    );
}
