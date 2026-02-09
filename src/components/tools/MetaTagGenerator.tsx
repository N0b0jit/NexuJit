'use client';

import { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';

export default function MetaTagGenerator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [author, setAuthor] = useState('');
    const [copied, setCopied] = useState(false);

    const generateMetaTags = () => {
        return `<!-- Primary Meta Tags -->
<title>${title || 'Your Page Title'}</title>
<meta name="title" content="${title || 'Your Page Title'}">
<meta name="description" content="${description || 'Your page description'}">
<meta name="keywords" content="${keywords || 'keyword1, keyword2, keyword3'}">
<meta name="author" content="${author || 'Your Name'}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:title" content="${title || 'Your Page Title'}">
<meta property="og:description" content="${description || 'Your page description'}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title || 'Your Page Title'}">
<meta property="twitter:description" content="${description || 'Your page description'}">`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMetaTags());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="meta-layout">
                <div className="input-panel">
                    <div className="input-group">
                        <label>Page Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter your page title (50-60 characters)"
                        />
                        <span className="char-count">{title.length}/60</span>
                    </div>

                    <div className="input-group">
                        <label>Meta Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter meta description (150-160 characters)"
                            rows={3}
                        />
                        <span className="char-count">{description.length}/160</span>
                    </div>

                    <div className="input-group">
                        <label>Keywords (comma-separated)</label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            placeholder="seo, tools, optimization"
                        />
                    </div>

                    <div className="input-group">
                        <label>Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="Your name or company"
                        />
                    </div>
                </div>

                <div className="output-panel">
                    <div className="panel-header">
                        <span>Generated Meta Tags</span>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy All</>}
                        </button>
                    </div>
                    <textarea value={generateMetaTags()} readOnly rows={18} />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1200px; margin: 0 auto; }
                .meta-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media (min-width: 1024px) { .meta-layout { grid-template-columns: 1fr 1fr; } }

                .input-panel, .output-panel { background: var(--surface); padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow); }
                .input-group { margin-bottom: 1.5rem; position: relative; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.75rem; font-size: 0.9rem; }
                .input-group input, .input-group textarea { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                .char-count { position: absolute; right: 0; top: 0; font-size: 0.75rem; color: var(--secondary); }

                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); }
                .output-panel textarea { width: 100%; padding: 1.5rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); font-family: monospace; font-size: 0.85rem; resize: none; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
