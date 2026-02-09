'use client';

import { useState } from 'react';
import { Eye, Code } from 'lucide-react';

export default function OpenGraphGenerator() {
    const [meta, setMeta] = useState({
        title: '',
        description: '',
        url: '',
        image: '',
        siteName: '',
        type: 'website'
    });

    const generateCode = () => {
        return `
<!-- Open Graph / Facebook -->
<meta property="og:type" content="${meta.type}" />
<meta property="og:url" content="${meta.url}" />
<meta property="og:title" content="${meta.title}" />
<meta property="og:description" content="${meta.description}" />
<meta property="og:image" content="${meta.image}" />
<meta property="og:site_name" content="${meta.siteName}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${meta.url}" />
<meta property="twitter:title" content="${meta.title}" />
<meta property="twitter:description" content="${meta.description}" />
<meta property="twitter:image" content="${meta.image}" />
        `.trim();
    };

    return (
        <div className="tool-content">
            <div className="generator-grid">
                <div className="form-section">
                    <h3>Enter Details</h3>
                    <div className="input-group">
                        <label>Site Title</label>
                        <input
                            type="text"
                            value={meta.title}
                            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                            placeholder="My Awesome Website"
                        />
                    </div>
                    <div className="input-group">
                        <label>Site Name</label>
                        <input
                            type="text"
                            value={meta.siteName}
                            onChange={(e) => setMeta({ ...meta, siteName: e.target.value })}
                            placeholder="Brand Name"
                        />
                    </div>
                    <div className="input-group">
                        <label>Site URL</label>
                        <input
                            type="url"
                            value={meta.url}
                            onChange={(e) => setMeta({ ...meta, url: e.target.value })}
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            value={meta.description}
                            onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                            placeholder="A brief description of your content..."
                            maxLength={200}
                        />
                    </div>
                    <div className="input-group">
                        <label>Image URL</label>
                        <input
                            type="url"
                            value={meta.image}
                            onChange={(e) => setMeta({ ...meta, image: e.target.value })}
                            placeholder="https://example.com/og-image.jpg"
                        />
                    </div>
                    <div className="input-group">
                        <label>Type</label>
                        <select
                            value={meta.type}
                            onChange={(e) => setMeta({ ...meta, type: e.target.value })}
                        >
                            <option value="website">Website</option>
                            <option value="article">Article</option>
                            <option value="book">Book</option>
                            <option value="profile">Profile</option>
                        </select>
                    </div>
                </div>

                <div className="preview-section">
                    <h3><Eye size={18} /> Social Preview</h3>
                    <div className="preview-card">
                        <div className="preview-image" style={{
                            backgroundImage: meta.image ? `url(${meta.image})` : 'none',
                            backgroundColor: '#eee'
                        }}>
                            {!meta.image && <span>Image Preview</span>}
                        </div>
                        <div className="preview-content">
                            <div className="preview-domain">{meta.url ? new URL(meta.url).hostname : 'example.com'}</div>
                            <div className="preview-title">{meta.title || 'Your Title Here'}</div>
                            <div className="preview-desc">{meta.description || 'Description will appear here...'}</div>
                        </div>
                    </div>

                    <div className="code-section">
                        <h3><Code size={18} /> Generated Meta Tags</h3>
                        <div className="code-block">
                            <pre>{generateCode()}</pre>
                            <button onClick={() => navigator.clipboard.writeText(generateCode())}>Copy Code</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .generator-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
                @media (max-width: 768px) { .generator-grid { grid-template-columns: 1fr; } }

                .form-section, .preview-section {
                    background: var(--surface);
                    padding: 2rem;
                    border-radius: 1.5rem;
                    border: 1px solid var(--border);
                }
                
                h3 { font-size: 1.1rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }

                .input-group { margin-bottom: 1rem; }
                .input-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem; }
                input, textarea, select {
                    width: 100%;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    border: 2px solid var(--border);
                    background: var(--background);
                }
                textarea { height: 100px; resize: vertical; }

                .preview-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                    background: var(--surface);
                    color: black;
                }
                .preview-image {
                    height: 200px;
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #888;
                }
                .preview-content { padding: 1rem; background: #f0f2f5; border-top: 1px solid #ddd; }
                .preview-domain { font-size: 0.8rem; text-transform: uppercase; color: #606770; margin-bottom: 0.25rem; }
                .preview-title { font-weight: bold; font-size: 1rem; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .preview-desc { font-size: 0.9rem; color: #606770; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

                .code-block {
                    position: relative;
                    background: #1e293b;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 0.75rem;
                    overflow-x: auto;
                }
                .code-block button {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    padding: 0.25rem 0.5rem;
                    background: var(--primary);
                    color: white;
                    border-radius: 0.25rem;
                    font-size: 0.8rem;
                }
            `}</style>
        </div>
    );
}
