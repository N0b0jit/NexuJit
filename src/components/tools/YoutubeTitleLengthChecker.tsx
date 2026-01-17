'use client';

import { useState } from 'react';
import { Ruler, AlertTriangle, CheckCircle } from 'lucide-react';

export default function YoutubeTitleLengthChecker() {
    const [title, setTitle] = useState('');

    // Limits
    const MAX_LENGTH = 100;
    const OPTIMAL_MAX = 70; // Truncated in search sometimes
    const OPTIMAL_MIN = 30;

    const getStatus = () => {
        const len = title.length;
        if (len === 0) return { color: 'var(--secondary)', text: 'Enter a title', icon: null };
        if (len < OPTIMAL_MIN) return { color: '#f59e0b', text: 'Too Short', icon: <AlertTriangle size={20} /> };
        if (len > MAX_LENGTH) return { color: '#ef4444', text: 'Too Long', icon: <AlertTriangle size={20} /> };
        if (len > OPTIMAL_MAX) return { color: '#f59e0b', text: 'Risks Truncation', icon: <AlertTriangle size={20} /> };
        return { color: '#10b981', text: 'Perfect Length', icon: <CheckCircle size={20} /> };
    };

    const status = getStatus();

    return (
        <div className="tool-ui">
            <div className="checker-card">
                <div className="input-section">
                    <label><Ruler size={18} /> YouTube Video Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your video title to check..."
                    />
                </div>

                <div className="status-bar">
                    <div className="progress-bg">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${Math.min((title.length / MAX_LENGTH) * 100, 100)}%`,
                                backgroundColor: status.color
                            }}
                        />
                    </div>
                    <div className="status-info" style={{ color: status.color }}>
                        <span className="count">{title.length} / {MAX_LENGTH} characters</span>
                        <span className="status-label">
                            {status.icon} {status.text}
                        </span>
                    </div>
                </div>

                <div className="recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                        <li>YouTube allows up to 100 characters for titles.</li>
                        <li>Optimal length is around <strong>60-70 characters</strong> to avoid truncation in search results.</li>
                        <li>Put the most important keywords at the beginning of the title.</li>
                        <li>Use compelling language to increase CTR (Click-Through Rate).</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .checker-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-section input { width: 100%; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }

                .status-bar { margin: 2rem 0; }
                .progress-bg { height: 12px; background: var(--border); border-radius: 6px; overflow: hidden; margin-bottom: 1rem; }
                .progress-fill { height: 100%; transition: width 0.3s ease, background-color 0.3s ease; }
                
                .status-info { display: flex; justify-content: space-between; align-items: center; font-weight: 700; }
                .status-label { display: flex; align-items: center; gap: 0.5rem; }

                .recommendations { background: var(--background); padding: 2rem; border-radius: 1.5rem; margin-top: 2rem; }
                .recommendations h4 { margin-top: 0; color: var(--primary); margin-bottom: 1rem; }
                .recommendations ul { padding-left: 1.5rem; color: var(--secondary); line-height: 1.6; }
                .recommendations li { margin-bottom: 0.5rem; }
                .recommendations strong { color: var(--foreground); }
            `}</style>
        </div>
    );
}
