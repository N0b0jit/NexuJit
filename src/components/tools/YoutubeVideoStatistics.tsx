import { useState, useEffect } from 'react';
import { Youtube, BarChart2, ThumbsUp, Eye, MessageCircle, AlertCircle, Key } from 'lucide-react';

export default function YoutubeVideoStatistics() {
    const [url, setUrl] = useState('');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('youtube_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('youtube_api_key', key);
    };

    const extractVideoId = (input: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
            /youtube\.com\/embed\/([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
            const match = input.match(pattern);
            if (match && match[1]) return match[1];
        }
        return null;
    };

    const fetchStats = async () => {
        setError('');
        setStats(null);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        setLoading(true);
        try {
            let data: any = {};

            if (apiKey) {
                // Real API Call
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error?.message || 'Failed to fetch from YouTube API');
                }
                const json = await response.json();
                if (!json.items || json.items.length === 0) throw new Error('Video not found.');

                const item = json.items[0];
                data = {
                    title: item.snippet.title,
                    author: item.snippet.channelTitle,
                    views: parseInt(item.statistics.viewCount),
                    likes: parseInt(item.statistics.likeCount),
                    comments: parseInt(item.statistics.commentCount),
                    thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url
                };

            } else {
                // Fallback to oEmbed + Mock
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                if (!response.ok) throw new Error('Failed to fetch oEmbed data');
                const oembed = await response.json();

                data = {
                    title: oembed.title,
                    author: oembed.author_name,
                    views: Math.floor(Math.random() * 1000000) + 50000,
                    likes: Math.floor(Math.random() * 50000) + 1000,
                    comments: Math.floor(Math.random() * 5000) + 100,
                    thumbnail: oembed.thumbnail_url,
                    isSimulated: true
                };
            }

            setStats(data);

        } catch (err: any) {
            setError(err.message || 'Could not fetch video data. Please check the URL and API Key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tool-ui">
            <div className="stats-card">
                <div className="api-section">
                    <button className="key-toggle" onClick={() => setShowKeyInput(!showKeyInput)}>
                        <Key size={16} /> {apiKey ? 'Update API Key' : 'Add YouTube API Key (Recommended)'}
                    </button>
                    {showKeyInput && (
                        <div className="key-input">
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => saveApiKey(e.target.value)}
                                placeholder="Paste YouTube Data API Key..."
                            />
                            <p className="help">Get a free key from <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank">Google Cloud Console</a></p>
                        </div>
                    )}
                </div>

                <div className="input-section">
                    <label><Youtube size={18} /> YouTube Video URL</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <button onClick={fetchStats} className="analyze-btn" disabled={loading || !url}>
                            {loading ? 'Analyzing...' : <><BarChart2 size={20} /> Get Stats</>}
                        </button>
                    </div>
                </div>

                {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

                {stats && (
                    <div className="results-section">
                        <div className="video-header">
                            <img src={stats.thumbnail} alt="Thumbnail" className="thumb" />
                            <div className="video-info">
                                <h3>{stats.title}</h3>
                                <p>by {stats.author}</p>
                            </div>
                        </div>

                        <div className="metrics-grid">
                            <div className="metric-card">
                                <div className="metric-icon views"><Eye size={24} /></div>
                                <div className="metric-val">{stats.views.toLocaleString()}</div>
                                <div className="metric-label">Views</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon likes"><ThumbsUp size={24} /></div>
                                <div className="metric-val">{stats.likes.toLocaleString()}</div>
                                <div className="metric-label">Likes</div>
                            </div>
                            <div className="metric-card">
                                <div className="metric-icon comments"><MessageCircle size={24} /></div>
                                <div className="metric-val">{stats.comments.toLocaleString()}</div>
                                <div className="metric-label">Comments</div>
                            </div>
                        </div>

                        <div className="ratios-grid">
                            <div className="ratio-card">
                                <h3>Engagement Rate</h3>
                                <div className="ratio-val">
                                    {((stats.likes + stats.comments) / stats.views * 100).toFixed(2)}%
                                </div>
                                <p>(Likes + Comments) / Views</p>
                            </div>
                            <div className="ratio-card">
                                <h3>Like Ratio</h3>
                                <div className="ratio-val">
                                    {(stats.likes / stats.views * 100).toFixed(2)}%
                                </div>
                                <p>Likes / Views</p>
                            </div>
                            <div className="ratio-card">
                                <h3>Comment Ratio</h3>
                                <div className="ratio-val">
                                    {(stats.comments / stats.views * 100).toFixed(2)}%
                                </div>
                                <p>Comments / Views</p>
                            </div>
                        </div>

                        {stats.isSimulated && (
                            <div className="demo-note warning">
                                <AlertCircle size={14} />
                                Showing simulated data. Add your API Key above for real-time statistics.
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .ratios-grid { 
                    display: grid; 
                    grid-template-columns: repeat(3, 1fr); 
                    gap: 1rem; 
                    margin-top: 1.5rem; 
                }
                @media(max-width: 640px) { .ratios-grid { grid-template-columns: 1fr; } }

                .ratio-card {
                    background: var(--surface);
                    padding: 1.5rem;
                    border-radius: 1rem;
                    border: 1px solid var(--border);
                    text-align: center;
                }
                .ratio-card h3 { font-size: 0.9rem; color: var(--secondary); margin-bottom: 0.5rem; }
                .ratio-val { font-size: 1.5rem; font-weight: 800; color: var(--primary); }
                .ratio-card p { font-size: 0.7rem; color: var(--secondary); margin-top: 0.25rem; }

                .tool-ui { max-width: 800px; margin: 0 auto; }
                .stats-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 2rem; box-shadow: var(--shadow-lg); }
                
                .api-section { margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; }
                .key-toggle { background: none; border: none; font-size: 0.9rem; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .key-input { margin-top: 1rem; }
                .key-input input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); margin-bottom: 0.5rem; }
                .help { font-size: 0.8rem; color: var(--secondary); }
                .help a { color: var(--primary); text-decoration: underline; }

                .input-section label { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; color: var(--secondary); margin-bottom: 1rem; }
                .input-wrapper { display: flex; gap: 1rem; flex-direction: column; }
                @media(min-width: 640px) { .input-wrapper { flex-direction: row; } }
                
                input { flex: 1; padding: 1.25rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-size: 1.1rem; }
                .analyze-btn { padding: 1.25rem 2rem; background: var(--primary); color: white; border-radius: 1rem; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; justify-content: center; min-width: 160px; }
                .analyze-btn:disabled { opacity: 0.7; }

                .error-msg { margin-top: 1.5rem; padding: 1rem; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; border-radius: 1rem; display: flex; align-items: center; gap: 0.5rem; }

                .results-section { margin-top: 3rem; animation: fadeIn 0.5s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                .video-header { display: flex; gap: 1.5rem; margin-bottom: 2rem; align-items: center; flex-wrap: wrap; }
                .thumb { width: 120px; border-radius: 1rem; border: 1px solid var(--border); }
                .video-info h3 { font-size: 1.1rem; margin-bottom: 0.5rem; line-height: 1.4; color: var(--foreground); }
                .video-info p { color: var(--secondary); font-weight: 600; }

                .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
                @media(max-width: 640px) { .metrics-grid { grid-template-columns: 1fr; } }

                .metric-card { background: var(--background); padding: 1.5rem; border-radius: 1.5rem; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; text-align: center; }
                .metric-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; }
                .metric-icon.views { background: #e0f2fe; color: #0ea5e9; }
                .metric-icon.likes { background: #dcfce7; color: #22c55e; }
                .metric-icon.comments { background: #f3e8ff; color: #a855f7; }

                .metric-val { font-size: 1.5rem; font-weight: 800; color: var(--foreground); margin-bottom: 0.25rem; }
                .metric-label { font-size: 0.8rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; }

                .demo-note { margin-top: 2rem; font-size: 0.85rem; color: var(--secondary); font-style: italic; text-align: center; padding: 1rem; border-radius: 0.5rem; background: var(--background); display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
                .demo-note.warning { color: #d97706; background: #fffbeb; }
            `}</style>
        </div>
    );
}
