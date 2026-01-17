'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Facebook, Linkedin, Image as ImageIcon } from 'lucide-react';

export default function SocialMediaPreviewer() {
    const [title, setTitle] = useState('My Awesome Page Title');
    const [description, setDescription] = useState('This is an engaging description that will appear on social media cards. It should be catchy and concise.');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80');
    const [url, setUrl] = useState('example.com');
    const [activeTab, setActiveTab] = useState('facebook');

    return (
        <div className="social-preview max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 bg-surface p-6 rounded-2xl border border-border shadow-sm h-fit">
                <h3 className="font-bold text-lg mb-6">Meta Content</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-secondary text-xs uppercase font-bold">Page Title</label>
                        <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} maxLength={60} />
                        <div className="text-right text-xs text-secondary">{title.length}/60</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-secondary text-xs uppercase font-bold">Description</label>
                        <textarea className="input-field h-24" value={description} onChange={e => setDescription(e.target.value)} maxLength={160} />
                        <div className="text-right text-xs text-secondary">{description.length}/160</div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-secondary text-xs uppercase font-bold">Image URL</label>
                        <input className="input-field" value={image} onChange={e => setImage(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-secondary text-xs uppercase font-bold">Website URL</label>
                        <input className="input-field" value={url} onChange={e => setUrl(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <div className="flex gap-4 border-b border-border pb-4 mb-6">
                    <Tab active={activeTab === 'facebook'} onClick={() => setActiveTab('facebook')} icon={<Facebook size={18} />} label="Facebook" />
                    <Tab active={activeTab === 'twitter'} onClick={() => setActiveTab('twitter')} icon={<span className="text-lg leading-none font-bold">𝕏</span>} label="Twitter" />
                    <Tab active={activeTab === 'linkedin'} onClick={() => setActiveTab('linkedin')} icon={<Linkedin size={18} />} label="LinkedIn" />
                </div>

                <div className="bg-[#f0f2f5] p-8 rounded-xl min-h-[400px] flex items-center justify-center overflow-hidden">
                    {/* Facebook Preview */}
                    {activeTab === 'facebook' && (
                        <div className="bg-white max-w-[500px] w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="h-[260px] w-full overflow-hidden bg-gray-100 relative">
                                {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon size={48} /></div>}
                            </div>
                            <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
                                <div className="uppercase text-xs text-gray-500 font-medium mb-1 truncate">{url.replace(/^https?:\/\//, '')}</div>
                                <div className="font-bold text-gray-900 text-[16px] leading-tight mb-1 line-clamp-2">{title}</div>
                                <div className="text-gray-500 text-sm line-clamp-1">{description}</div>
                            </div>
                        </div>
                    )}

                    {/* Twitter Preview */}
                    {activeTab === 'twitter' && (
                        <div className="bg-black max-w-[500px] w-full rounded-2xl overflow-hidden border border-gray-800">
                            <div className="h-[260px] w-full overflow-hidden bg-gray-900 relative">
                                {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-700"><ImageIcon size={48} /></div>}
                            </div>
                            <div className="p-3 bg-black">
                                <div className="text-gray-500 text-sm mb-0.5 truncate">{url.replace(/^https?:\/\//, '')}</div>
                                <div className="font-bold text-white text-[15px] mb-1">{title}</div>
                                <div className="text-gray-500 text-sm">{description}</div>
                            </div>
                        </div>
                    )}

                    {/* LinkedIn Preview */}
                    {activeTab === 'linkedin' && (
                        <div className="bg-white max-w-[500px] w-full border border-gray-300 rounded overflow-hidden shadow-sm">
                            <div className="h-[260px] w-full overflow-hidden bg-gray-100 relative">
                                {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="absolute inset-0 flex items-center justify-center text-gray-400"><ImageIcon size={48} /></div>}
                            </div>
                            <div className="p-4 bg-white border-t border-gray-200">
                                <div className="font-semibold text-gray-900 text-[16px] mb-1 truncate">{title}</div>
                                <div className="text-gray-500 text-xs truncate">{url.replace(/^https?:\/\//, '')}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem;
                    background: var(--background);
                    border: 1px solid var(--border);
                    border-radius: 0.5rem;
                    font-size: 0.95rem;
                    transition: all 0.2s;
                    color: var(--foreground);
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--primary);
                }
            `}</style>
        </div>
    );
}

function Tab({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${active ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-surface-hover'}`}
        >
            {icon} {label}
        </button>
    );
}
