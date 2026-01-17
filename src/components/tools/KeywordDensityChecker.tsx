'use client';

import { useState, useEffect } from 'react';
import { Type, Hash, BarChart3 } from 'lucide-react';

export default function KeywordDensityChecker() {
    const [text, setText] = useState('');
    const [keywords, setKeywords] = useState<Array<{ word: string, count: number, density: number }>>([]);
    const [totalWords, setTotalWords] = useState(0);

    useEffect(() => {
        analyzeText();
    }, [text]);

    const analyzeText = () => {
        if (!text.trim()) {
            setKeywords([]);
            setTotalWords(0);
            return;
        }

        // Remove punctuation and convert to lowercase
        const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '');
        const words = cleanText.split(/\s+/).filter(w => w.length > 2); // Ignore words less than 3 chars

        setTotalWords(words.length);

        // Count word frequency
        const wordCount: { [key: string]: number } = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        // Calculate density and sort
        const keywordData = Object.entries(wordCount)
            .map(([word, count]) => ({
                word,
                count,
                density: (count / words.length) * 100
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 20); // Top 20 keywords

        setKeywords(keywordData);
    };

    return (
        <div className="tool-ui">
            <div className="density-layout">
                <div className="input-panel">
                    <div className="panel-header">
                        <label><Type size={16} /> Paste Your Content</label>
                        <div className="word-count">
                            <Hash size={14} /> {totalWords} words
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your article or content here to analyze keyword density..."
                        rows={20}
                    />
                </div>

                <div className="results-panel">
                    <div className="panel-header">
                        <BarChart3 size={18} />
                        <span>Keyword Density Analysis</span>
                    </div>

                    {keywords.length > 0 ? (
                        <div className="keywords-table">
                            <div className="table-header">
                                <span>Keyword</span>
                                <span>Count</span>
                                <span>Density</span>
                            </div>
                            {keywords.map((kw, index) => (
                                <div key={index} className="table-row">
                                    <span className="keyword">{kw.word}</span>
                                    <span className="count">{kw.count}x</span>
                                    <span className="density">
                                        <div className="density-bar">
                                            <div className="density-fill" style={{ width: `${Math.min(kw.density * 10, 100)}%` }} />
                                        </div>
                                        {kw.density.toFixed(2)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <BarChart3 size={48} className="ghost-icon" />
                            <p>Paste your content to analyze keyword density</p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
                .density-layout { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
                @media (min-width: 1024px) { .density-layout { grid-template-columns: 1fr 450px; } }

                .input-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); font-size: 0.85rem; }
                .panel-header label { display: flex; align-items: center; gap: 0.5rem; }
                .word-count { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); font-weight: 700; }
                
                textarea { width: 100%; padding: 1.5rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1rem; line-height: 1.8; resize: none; color: var(--foreground); }

                .results-panel { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .results-panel .panel-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }

                .keywords-table { display: flex; flex-direction: column; gap: 0.5rem; }
                .table-header { display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 1rem; padding: 0.75rem 1rem; background: var(--background); border-radius: 0.75rem; font-size: 0.75rem; font-weight: 800; color: var(--secondary); text-transform: uppercase; }
                .table-row { display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 1rem; padding: 1rem; background: var(--background); border-radius: 0.75rem; align-items: center; transition: all 0.2s; }
                .table-row:hover { background: var(--primary-soft); }
                
                .keyword { font-weight: 700; color: var(--foreground); }
                .count { font-weight: 600; color: var(--secondary); }
                .density { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; color: var(--primary); }
                
                .density-bar { flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; }
                .density-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }

                .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: var(--secondary); gap: 1.5rem; padding: 5rem 2rem; }
                .ghost-icon { opacity: 0.1; }
            `}</style>
        </div>
    );
}
