'use client';

import { useState } from 'react';
import { Youtube, BarChart2, Users, Video, Eye, AlertCircle } from 'lucide-react';

export default function YoutubeChannelStatistics() {
    const [url, setUrl] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setError('');
        setStats(null);
        if (!url.trim()) return;

        setLoading(true);
        setTimeout(() => {
            // Simulated data for demo purposes since we don't have API access
            if (url.includes('youtube.com')) {
                setStats({
                    name: "Demo Channel Name",
                    subscribers: Math.floor(Math.random() * 500000) + 1000,
                    totalViews: Math.floor(Math.random() * 50000000) + 100000,
                    videoCount: Math.floor(Math.random() * 500) + 10,
                    description: "This is a simulated channel description regarding the channel you entered. In a production environment, this would be fetched from the YouTube Data API."
                });
            } else {
                setError('Please enter a valid YouTube channel URL');
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="tool-ui">
            <div className="stats-card">
                <div className="input-section">
                    <label><Youtube size={18} /> YouTube Channel URL</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/channel/..."
                        />
                        <button onClick={fetchStats} className="analyze-btn" disabled={loading || !url}>
                            {loading ? 'Analyzing...' : <><BarChart2 size={20} /> Get Stats</>}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {stats && (
                    <div className="results-section">
                        <div className="channel-header">
                            <div className="avatar-placeholder">{stats.name[0]}</div>
                            <div className="channel-info">
                                <h3>{stats.name}</h3>
                                <p className="desc">{stats.description}</p>
                            </div>
                        </div>

                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-icon subs"><Users size={24} /></div>
                                <div className="metric-val">{stats.subscribers.toLocaleString()}</div>
                                <div className="metric-label">Subscribers</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon views"><Eye size={24} /></div>
                                <div className="metric-val">{stats.totalViews.toLocaleString()}</div>
                                <div className="metric-label">Total Views</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon videos"><Video size={24} /></div>
                                <div className="metric-val">{stats.videoCount.toLocaleString()}</div>
                                <div className="metric-label">Videos</div>
                            </div>
                        </div>

                        <div className="demo-note">
                            * Note: Data simulated for demonstration. Real-time stats require YouTube Data API Key.
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .stats-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .analyze-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 160px; }
                .analyze-btn:disabled { opacity: 0.7; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem; }

                .results-section { margin-top: 3rem; animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .channel-header { display: flex; gap: 1.5rem; margin-bottom: 2rem; align-items: center; }
                .avatar-placeholder { width: 80px; height: 80px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; }
                .channel-info h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
                .channel-info .desc { color: var(--secondary); font-size: 0.9rem; line-height: 1.5; max-width: 500px; }

                .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                @media(max-width: 640px) { .metrics-grid { grid-template-columns: 1fr; } }

                .metric-card { background: var(--background); padding: 1.5rem; border-radius: 1.5rem; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; text-align: center; }
                .metric-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                .metric-icon.subs { background: #fee2e2; color: #ef4444; }
                .metric-icon.views { background: #dbeafe; color: #3b82f6; }
                .metric-icon.videos { background: #fef3c7; color: #d97706; }

                .metric-val { font-size: 1.5rem; font-weight: 800; color: var(--foreground); margin-bottom: 0.25rem; }
                .metric-label { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }

                .demo-note { margin-top: 2rem; font-size: 0.8rem; color: var(--secondary); font-style: italic; text-align: center; }
            `}</style>
        </div>
    );
}
