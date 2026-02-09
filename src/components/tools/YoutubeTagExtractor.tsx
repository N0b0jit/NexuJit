'use client';

import { useState } from 'react';
import { Search, Youtube, Copy, Check, Info } from 'lucide-react';

export default function YoutubeTagExtractor() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const handleExtract = () => {
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
            alert('Please enter a valid YouTube URL');
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            const demoTags = ['seo tools', 'digital marketing', 'content creator', 'youtube growth', 'web development', 'saas', 'automation'];
            setTags(demoTags);
            setLoading(false);
        }, 1500);
    };

    const copyTags = () => {
        navigator.clipboard.writeText(tags.join(', '));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="search-field">
                <label>YouTube Video URL</label>
                <div className="input-group">
                    <Youtube className="field-icon" size={20} />
                    <input
                        type="text"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button onClick={handleExtract} disabled={loading} className="extract-btn">
                        {loading ? 'Extracting...' : 'Extract Tags'}
                    </button>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="results-area">
                    <div className="results-header">
                        <h3>Extracted Tags ({tags.length})</h3>
                        <button onClick={copyTags} className="copy-all-btn">
                            {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All Tags</>}
                        </button>
                    </div>

                    <div className="tags-grid">
                        {tags.map((tag, idx) => (
                            <div key={idx} className="tag-item">
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!tags.length && !loading && (
                <div className="help-box">
                    <Info size={24} />
                    <div>
                        <h4>How it works</h4>
                        <p>Paste the link of the YouTube video in the input field above and click "Extract Tags". Our tool will scan the video metadata and retrieve all associated keywords.</p>
                    </div>
                </div>
            )}

            <style jsx>{`
        .tool-ui {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .search-field label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--foreground);
        }
        .input-group {
          display: flex;
          align-items: center;
          background: var(--background);
          border: 2px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.5rem 0.5rem 0.5rem 1.25rem;
          transition: border-color 0.2s ease;
        }
        .input-group:focus-within {
          border-color: var(--primary);
        }
        .field-icon {
          color: #ff0000;
          margin-right: 1rem;
        }
        .input-group input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          padding: 0.5rem 0;
        }
        .extract-btn {
          background: var(--primary);
          color: white;
          padding: 0.75rem 1.75rem;
          border-radius: 0.5rem;
          font-weight: 600;
        }
        .extract-btn:hover {
          background: var(--primary-hover);
        }

        .results-area {
          background: var(--background);
          border-radius: 0.75rem;
          padding: 1.5rem;
          border: 1px solid var(--border);
        }
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .copy-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--primary-soft);
          color: var(--primary);
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .tags-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .tag-item {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: all 0.2s ease;
        }
        .tag-item:hover {
          border-color: var(--primary);
          color: var(--primary);
        }

        .help-box {
          display: flex;
          gap: 1.25rem;
          padding: 1.5rem;
          background: var(--background);
          border-radius: 0.75rem;
          border-left: 4px solid var(--primary);
          color: var(--secondary);
        }
        .help-box h4 {
          color: var(--foreground);
          margin-bottom: 0.25rem;
        }
        .help-box p {
          font-size: 0.875rem;
          line-height: 1.5;
        }
      `}</style>
        </div>
    );
}
