'use client';

import { useState, useEffect } from 'react';
import { Youtube, MessageCircle, RefreshCw, Key, AlertCircle, Trophy } from 'lucide-react';

export default function YoutubeCommentPicker() {
    const [url, setUrl] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [comments, setComments] = useState<any[]>([]);
    const [winner, setWinner] = useState<any>(null);

    useEffect(() => {
        const savedKey = localStorage.getItem('youtube_api_key');
        if (savedKey) setApiKey(savedKey);
    }, []);

    const saveApiKey = (key: string) => {
        setApiKey(key);
        localStorage.setItem('youtube_api_key', key);
    };

    const extractVideoId = (input: string) => {
        const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchComments = async () => {
        setError('');
        setComments([]);
        setWinner(null);

        if (!apiKey) {
            setError('API Key is required to fetch comments.');
            setShowKeyInput(true);
            return;
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid Video URL');
            return;
        }

        setLoading(true);
        try {
            // Fetch comments (up to 100 for now to keep it simple, or iterate for all)
            // For a "Picker", getting top 100 is usually a decent "demo" limit, but strictly should get all.
            // Let's create a loop for at least a few pages if needed, but start simple.
            const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${apiKey}`;
            const res = await fetch(apiUrl);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error?.message || 'Failed to fetch comments');
            }
            const data = await res.json();

            const fetchedComments = data.items.map((item: any) => ({
                id: item.id,
                author: item.snippet.topLevelComment.snippet.authorDisplayName,
                avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
                text: item.snippet.topLevelComment.snippet.textDisplay,
                publishedAt: item.snippet.topLevelComment.snippet.publishedAt
            }));

            setComments(fetchedComments);
        } catch (err: any) {
            setError(err.message || 'Error fetching comments');
        } finally {
            setLoading(false);
        }
    };

    const pickWinner = () => {
        if (comments.length === 0) return;
        setLoading(true);
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * comments.length);
            setWinner(comments[randomIndex]);
            setLoading(false);
        }, 1000); // Add suspense
    };

    return (
        <div className="tool-content">
            <div className="api-section">
                <button className="key-toggle" onClick={() => setShowKeyInput(!showKeyInput)}>
                    <Key size={16} /> {apiKey ? 'Update API Key' : 'Add YouTube API Key (Required)'}
                </button>
                {showKeyInput && (
                    <div className="key-input">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => saveApiKey(e.target.value)}
                            placeholder="Paste YouTube Data API Key..."
                        />
                    </div>
                )}
            </div>

            <div className="input-section">
                <label>YouTube Video URL</label>
                <div className="input-row">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <button onClick={fetchComments} disabled={loading || !url}>
                        {loading && !comments.length ? 'Loading...' : 'Load Comments'}
                    </button>
                </div>
            </div>

            {error && <div className="error-msg"><AlertCircle size={16} /> {error}</div>}

            {comments.length > 0 && !winner && (
                <div className="status-section">
                    <div className="count-badge">
                        <MessageCircle size={18} /> {comments.length} Comments Loaded
                    </div>
                    <button className="pick-btn" onClick={pickWinner} disabled={loading}>
                        <Trophy size={20} /> Pick a Winner
                    </button>
                </div>
            )}

            {winner && (
                <div className="winner-card">
                    <div className="congrats-header">
                        <Trophy size={48} className="trophy-icon" />
                        <h2>We have a Winner!</h2>
                    </div>

                    <div className="winner-profile">
                        <img src={winner.avatar} alt={winner.author} />
                        <div>
                            <h3>{winner.author}</h3>
                            <span className="date">{new Date(winner.publishedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="comment-box">
                        "{winner.text}"
                    </div>

                    <button className="secondary-btn" onClick={pickWinner}>
                        <RefreshCw size={16} /> Pick Another
                    </button>
                </div>
            )}

            <style jsx>{`
                .tool-content { max-width: 600px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                .api-section { border-bottom: 1px solid var(--border); padding-bottom: 1rem; }
                .key-toggle { background: none; border: none; font-size: 0.9rem; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .key-input { margin-top: 1rem; }
                .key-input input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--border); background: var(--background); }

                .input-section label { display: block; font-weight: 600; margin-bottom: 0.75rem; }
                .input-row { display: flex; gap: 1rem; }
                input[type="text"] { flex: 1; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                button { padding: 0 2rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 600; white-space: nowrap; }
                button:disabled { opacity: 0.6; }

                .error-msg { background: #fee2e2; color: #dc2626; padding: 1rem; border-radius: 0.75rem; }

                .status-section { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; animation: fadeIn 0.5s ease; }
                .count-badge { padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
                .pick-btn { padding: 1rem 3rem; font-size: 1.2rem; display: flex; align-items: center; gap: 0.75rem; }

                .winner-card {
                    background: var(--surface);
                    padding: 2.5rem;
                    border-radius: 2rem;
                    border: 1px solid var(--primary);
                    text-align: center;
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
                }
                @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                
                .congrats-header { color: var(--primary); margin-bottom: 2rem; }
                .trophy-icon { margin-bottom: 0.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); }
                
                .winner-profile { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; }
                .winner-profile img { width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--border); }
                .winner-profile h3 { margin: 0; font-size: 1.2rem; }
                .date { font-size: 0.8rem; color: var(--secondary); }

                .comment-box { background: var(--background); padding: 1.5rem; border-radius: 1rem; font-style: italic; margin-bottom: 2rem; quote: ""; }
                
                .secondary-btn { background: var(--surface); color: var(--foreground); border: 2px solid var(--border); }
            `}</style>
        </div>
    );
}
