'use client';

import { useState, useRef } from 'react';
import { Download, Upload, Image as ImageIcon } from 'lucide-react';

export default function TwitterCardGenerator() {
    const [title, setTitle] = useState('Your Article Title Here');
    const [desc, setDesc] = useState('This is a short description of your content. It should be engaging and concise to attract clicks from Twitter users.');
    const [domain, setDomain] = useState('example.com');
    const [image, setImage] = useState<string | null>(null);

    const cardRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setImage(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Need html2canvas or similar to download, but for now we'll just show preview
    // Installing html2canvas in specific might be overkill if not requested, assuming visual only first.
    // Actually user said "generator" usually implies downloading the image or code.
    // I will generate the Meta Tags code which is the primary SEO purpose.

    const getMetaCode = () => {
        return `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@yourhandle">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${image ? 'https://example.com/image.jpg' : ''}">`;
    };

    return (
        <div className="tool-ui">
            <div className="grid-layout">
                <div className="form-col">
                    <div className="input-group">
                        <label>Card Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} maxLength={70} />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} maxLength={200} />
                    </div>
                    <div className="input-group">
                        <label>Website Domain</label>
                        <input type="text" value={domain} onChange={e => setDomain(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Card Image</label>
                        <div className="file-upload">
                            <input type="file" accept="image/*" onChange={handleImageUpload} id="tw-img" hidden />
                            <label htmlFor="tw-img" className="upload-btn">
                                <Upload size={18} /> Upload Image
                            </label>
                            {image && <button onClick={() => setImage(null)} className="clear-btn">Remove</button>}
                        </div>
                    </div>
                </div>

                <div className="preview-col">
                    <h3>Preview</h3>
                    <div className="twitter-card" ref={cardRef}>
                        <div className="card-image">
                            {image ? (
                                <img src={image} alt="Card preview" />
                            ) : (
                                <div className="placeholder-img"><ImageIcon size={48} opacity={0.2} /></div>
                            )}
                        </div>
                        <div className="card-content">
                            <div className="card-title">{title}</div>
                            <div className="card-desc">{desc}</div>
                            <div className="card-domain">
                                <ImageIcon size={14} className="icon" /> {domain}
                            </div>
                        </div>
                    </div>

                    <h3>Meta Tags Code</h3>
                    <div className="code-block">
                        <pre>{getMetaCode()}</pre>
                        <button className="copy-btn" onClick={() => navigator.clipboard.writeText(getMetaCode())}>Copy Code</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .grid-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
                
                .input-group { margin-bottom: 1.5rem; }
                label { display: block; font-weight: 700; margin-bottom: 0.5rem; color: var(--secondary); font-size: 0.9rem; }
                input, textarea { width: 100%; padding: 0.8rem; border: 2px solid var(--border); border-radius: 0.75rem; background: var(--background); font-size: 1rem; }
                input:focus, textarea:focus { border-color: var(--primary); outline: none; }

                .file-upload { display: flex; gap: 1rem; align-items: center; }
                .upload-btn { background: var(--surface); border: 2px dashed var(--border); padding: 0.75rem 1.5rem; border-radius: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--secondary); transition: all 0.2s; }
                .upload-btn:hover { border-color: var(--primary); color: var(--primary); }
                .clear-btn { color: #ef4444; font-size: 0.9rem; font-weight: 600; text-decoration: underline; }

                .twitter-card { border: 1px solid #e1e8ed; border-radius: 1rem; overflow: hidden; background: var(--surface); max-width: 500px; cursor: pointer; transition: box-shadow 0.2s; margin-bottom: 2rem; }
                .twitter-card:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                
                .card-image { aspect-ratio: 1.91/1; background: #cfd9de; position: relative; overflow: hidden; }
                .card-image img { width: 100%; height: 100%; object-fit: cover; }
                .placeholder-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }

                .card-content { padding: 0.75rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                .card-title { font-weight: 700; color: #0f1419; margin-bottom: 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .card-desc { color: #536471; font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 0.2rem; line-height: 1.3; }
                .card-domain { color: #536471; font-size: 0.9rem; display: flex; align-items: center; gap: 0.3rem; text-transform: lowercase; }

                .code-block { background: #1e1e1e; padding: 1rem; border-radius: 0.75rem; position: relative; }
                .code-block pre { color: #d4d4d4; font-family: monospace; white-space: pre-wrap; font-size: 0.85rem; }
                .copy-btn { position: absolute; top: 0.5rem; right: 0.5rem; background: rgba(255,255,255,0.1); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; }
                .copy-btn:hover { background: rgba(255,255,255,0.2); }

                @media (max-width: 768px) {
                    .grid-layout { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
