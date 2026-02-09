'use client';

import { useState } from 'react';
import { Type, Copy, Check, Hash } from 'lucide-react';

export default function LoremIpsumGenerator() {
    const [paragraphs, setParagraphs] = useState('3');
    const [wordsPerPara, setWordsPerPara] = useState('50');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
        'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
        'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];

    const generateLorem = () => {
        const numParas = parseInt(paragraphs) || 1;
        const wordsCount = parseInt(wordsPerPara) || 50;

        const paras = [];
        for (let i = 0; i < numParas; i++) {
            const words = [];
            for (let j = 0; j < wordsCount; j++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            let para = words.join(' ');
            para = para.charAt(0).toUpperCase() + para.slice(1) + '.';
            paras.push(para);
        }

        setResult(paras.join('\n\n'));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="lorem-layout">
                <div className="config-panel">
                    <div className="config-group">
                        <label><Hash size={16} /> Number of Paragraphs</label>
                        <input
                            type="number"
                            value={paragraphs}
                            onChange={(e) => setParagraphs(e.target.value)}
                            min="1"
                            max="20"
                        />
                    </div>

                    <div className="config-group">
                        <label><Type size={16} /> Words per Paragraph</label>
                        <input
                            type="number"
                            value={wordsPerPara}
                            onChange={(e) => setWordsPerPara(e.target.value)}
                            min="10"
                            max="200"
                        />
                    </div>

                    <button onClick={generateLorem} className="generate-btn">
                        Generate Lorem Ipsum
                    </button>
                </div>

                <div className="result-panel">
                    <div className="panel-header">
                        <span>Generated Text</span>
                        {result && (
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={result}
                        readOnly
                        placeholder="Click generate to create Lorem Ipsum text..."
                        rows={15}
                    />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .lorem-layout { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
                @media (min-width: 1024px) { .lorem-layout { grid-template-columns: 300px 1fr; } }

                .config-panel { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 1.5rem; height: fit-content; }
                .config-group { display: flex; flex-direction: column; gap: 0.75rem; }
                .config-group label { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: var(--secondary); font-size: 0.9rem; }
                .config-group input { padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); font-weight: 700; font-size: 1.1rem; }

                .generate-btn { padding: 1.25rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; transition: all 0.2s; }
                .generate-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px var(--primary-soft); }

                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); font-size: 0.85rem; text-transform: uppercase; }
                textarea { width: 100%; padding: 1.5rem; border-radius: 1.25rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; line-height: 1.8; resize: none; color: var(--foreground); }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; font-size: 0.85rem; }
            `}</style>
        </div>
    );
}
