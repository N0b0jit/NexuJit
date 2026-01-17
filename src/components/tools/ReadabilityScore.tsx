'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Clock, BarChart3, Info, Copy, Check, Trash2 } from 'lucide-react';

export default function ReadabilityScore() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({
        words: 0,
        sentences: 0,
        syllables: 0,
        readingTime: 0,
        readabilityScore: 0,
        gradeLevel: 'N/A'
    });

    const countSyllables = (word: string) => {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const syllables = word.match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 1;
    };

    const calculateStats = (inputText: string) => {
        if (!inputText.trim()) {
            return {
                words: 0,
                sentences: 0,
                syllables: 0,
                readingTime: 0,
                readabilityScore: 0,
                gradeLevel: 'N/A'
            };
        }

        const words = inputText.trim().split(/\s+/).filter(word => word.length > 0);
        const sentences = inputText.split(/[.!?]+/).filter(s => s.trim().length > 0);

        let totalSyllables = 0;
        words.forEach(word => {
            totalSyllables += countSyllables(word);
        });

        const wordCount = words.length;
        const sentenceCount = sentences.length || 1;

        // Flesch Reading Ease Formula
        // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
        const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount);
        const readabilityScore = Math.max(0, Math.min(100, Math.round(score)));

        // Reading time (average 225 words per minute)
        const readingTime = Math.ceil(wordCount / 225);

        // Determine Grade Level based on score
        let gradeLevel = 'Graduate';
        if (readabilityScore >= 90) gradeLevel = '5th Grade';
        else if (readabilityScore >= 80) gradeLevel = '6th Grade';
        else if (readabilityScore >= 70) gradeLevel = '7th Grade';
        else if (readabilityScore >= 60) gradeLevel = '8th & 9th Grade';
        else if (readabilityScore >= 50) gradeLevel = '10th to 12th Grade';
        else if (readabilityScore >= 30) gradeLevel = 'College';

        return {
            words: wordCount,
            sentences: sentenceCount,
            syllables: totalSyllables,
            readingTime,
            readabilityScore,
            gradeLevel
        };
    };

    useEffect(() => {
        setStats(calculateStats(text));
    }, [text]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleClear = () => {
        setText('');
    };

    return (
        <div className="tool-ui">
            <div className="readability-layout">
                <div className="editor-panel">
                    <div className="panel-header">
                        <div className="header-info">
                            <label>Input Text</label>
                            <span>Analyze your content for readability</span>
                        </div>
                        <div className="header-actions">
                            <button onClick={handleClear} className="action-btn-danger" title="Clear All">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={copyToClipboard} className="action-btn" title="Copy Text">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <textarea
                        placeholder="Paste your article or content here to analyze reading time and complexity..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div className="stats-panel">
                    <div className="stats-card-main">
                        <div className="score-circle">
                            <div className="score-value">{stats.readabilityScore}</div>
                            <div className="score-label">Flesch Score</div>
                        </div>
                        <div className="score-info">
                            <h3>{stats.gradeLevel}</h3>
                            <p>Ease of reading: {stats.readabilityScore >= 60 ? 'Easy' : stats.readabilityScore >= 30 ? 'Moderate' : 'Difficult'}</p>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="mini-stat-card">
                            <div className="stat-icon"><Clock size={16} /></div>
                            <div className="stat-data">
                                <label>Reading Time</label>
                                <span>{stats.readingTime} min</span>
                            </div>
                        </div>
                        <div className="mini-stat-card">
                            <div className="stat-icon"><BookOpen size={16} /></div>
                            <div className="stat-data">
                                <label>Total Words</label>
                                <span>{stats.words}</span>
                            </div>
                        </div>
                        <div className="mini-stat-card">
                            <div className="stat-icon"><BarChart3 size={16} /></div>
                            <div className="stat-data">
                                <label>Sentences</label>
                                <span>{stats.sentences}</span>
                            </div>
                        </div>
                        <div className="mini-stat-card">
                            <div className="stat-icon"><Info size={16} /></div>
                            <div className="stat-data">
                                <label>Syllables</label>
                                <span>{stats.syllables}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grade-guide">
                        <label>Readability Guide</label>
                        <div className="guide-row"><span className="tag green">90-100</span> Highly readable, simple language.</div>
                        <div className="guide-row"><span className="tag blue">60-70</span> Plain English, easily understood.</div>
                        <div className="guide-row"><span className="tag orange">30-50</span> Difficult to read, academic style.</div>
                        <div className="guide-row"><span className="tag red">0-29</span> Very difficult, specialized audience.</div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .tool-ui { display: flex; flex-direction: column; gap: 2rem; }
        .readability-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) {
          .readability-layout { grid-template-columns: 1fr 320px; }
        }

        .editor-panel {
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .panel-header {
          padding: 1.25rem 1.75rem;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-info label {
          display: block;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--foreground);
        }

        .header-info span {
          font-size: 0.75rem;
          color: var(--secondary);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn, .action-btn-danger {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: var(--background);
          border: 1px solid var(--border);
          color: var(--secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn:hover { color: var(--primary); border-color: var(--primary); }
        .action-btn-danger:hover { color: #ef4444; border-color: #ef4444; }

        textarea {
          width: 100%;
          min-height: 500px;
          padding: 2rem;
          border: none;
          background: transparent;
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--foreground);
          resize: vertical;
        }

        textarea:focus { outline: none; }

        .stats-panel {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .stats-card-main {
          background: var(--primary-soft);
          border: 1px solid var(--primary);
          padding: 2rem;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.25rem;
        }

        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--background);
          border: 6px solid var(--primary);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }

        .score-value {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1;
        }

        .score-label {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--secondary);
          margin-top: 2px;
        }

        .score-info h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
          color: var(--foreground);
        }

        .score-info p {
          font-size: 0.85rem;
          color: var(--secondary);
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .mini-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 1rem;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-data label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--secondary);
        }

        .stat-data span {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--foreground);
        }

        .grade-guide {
          background: var(--background);
          border: 1px solid var(--border);
          padding: 1.5rem;
          border-radius: 1.25rem;
        }

        .grade-guide label {
          display: block;
          font-size: 0.85rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--foreground);
        }

        .guide-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: var(--secondary);
          margin-bottom: 0.75rem;
          font-weight: 500;
        }

        .tag {
          padding: 0.2rem 0.6rem;
          border-radius: 0.4rem;
          font-weight: 800;
          font-size: 0.7rem;
          min-width: 55px;
          text-align: center;
        }

        .tag.green { background: #dcfce7; color: #166534; }
        .tag.blue { background: #dbeafe; color: #1e40af; }
        .tag.orange { background: #ffedd5; color: #9a3412; }
        .tag.red { background: #fee2e2; color: #991b1b; }
      `}</style>
        </div>
    );
}
