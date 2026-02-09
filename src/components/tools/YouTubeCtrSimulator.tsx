'use client';

import { useState } from 'react';
import { Upload, X, Smartphone, Monitor } from 'lucide-react';

export default function YouTubeCtrSimulator() {
    const [title, setTitle] = useState('My Awesome Video Title That Might Be Too Long For Some Devices');
    const [channelName, setChannelName] = useState('My Channel');
    const [views, setViews] = useState('1.2M views');
    const [date, setDate] = useState('2 days ago');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnail(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Controls */}
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase">Video Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors"
                            />
                            <p className="text-xs text-secondary text-right">{title.length} characters</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase">Channel Name</label>
                            <input
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                className="w-full p-3 bg-background border border-border rounded-xl outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary uppercase">Thumbnail</label>
                            <div className="relative border-2 border-dashed border-border rounded-xl p-4 h-[132px] flex flex-col items-center justify-center hover:bg-background/50 transition-colors cursor-pointer group">
                                <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                {thumbnail ? (
                                    <div className="relative w-full h-full">
                                        <img src={thumbnail} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                        <button
                                            onClick={(e) => { e.preventDefault(); setThumbnail(null); }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:scale-110 transition-transform"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-secondary group-hover:text-primary mb-2" />
                                        <span className="text-sm text-secondary">Upload 1280x720</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 pt-4 border-t border-border">
                    <button
                        onClick={() => setDevice('desktop')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${device === 'desktop' ? 'bg-primary text-white shadow-lg' : 'bg-background hover:bg-surface-hover text-secondary'}`}
                    >
                        <Monitor size={18} /> Desktop
                    </button>
                    <button
                        onClick={() => setDevice('mobile')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${device === 'mobile' ? 'bg-primary text-white shadow-lg' : 'bg-background hover:bg-surface-hover text-secondary'}`}
                    >
                        <Smartphone size={18} /> Mobile
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-lg overflow-hidden flex justify-center text-black">
                <div className={`transition-all duration-500 ${device === 'mobile' ? 'w-[375px]' : 'w-[800px]'}`}>
                    {/* YouTube Video Card */}
                    <div className={`flex gap-3 ${device === 'mobile' ? 'flex-col' : 'flex-row'}`}>
                        {/* Thumbnail Container */}
                        <div className={`relative bg-gray-200 overflow-hidden flex-shrink-0 ${device === 'mobile' ? 'w-full aspect-video rounded-xl' : 'w-[360px] h-[202px] rounded-xl'
                            }`}>
                            {thumbnail ? (
                                <img src={thumbnail} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    1280x720
                                </div>
                            )}
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                10:25
                            </span>
                        </div>

                        {/* Text Content */}
                        <div className={`flex flex-col ${device === 'mobile' ? 'px-2' : ''}`}>
                            {device === 'mobile' && (
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[16px] leading-[1.4rem] line-clamp-2 mb-1 text-[#0f0f0f]">
                                            {title}
                                        </h3>
                                        <div className="text-[12px] text-[#606060] flex items-center gap-1">
                                            <span>{channelName}</span>
                                            <span>•</span>
                                            <span>{views}</span>
                                            <span>•</span>
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                    <div className="text-[#0f0f0f] rotate-90 h-fit ml-2">...</div>
                                </div>
                            )}

                            {device === 'desktop' && (
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-semibold text-[18px] leading-[1.6rem] line-clamp-2 text-[#0f0f0f] mb-1">
                                        {title}
                                    </h3>
                                    <div className="text-[12px] text-[#606060] flex flex-col">
                                        <div className="flex items-center gap-1 hover:text-[#0f0f0f] cursor-pointer">
                                            <span>{channelName}</span>
                                            <span className="bg-gray-400 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[8px] text-white">✓</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span>{views}</span>
                                            <span>•</span>
                                            <span>{date}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-start">
                                        <span className="bg-[#0000000d] text-[#606060] text-[12px] px-1 rounded-[2px]">New</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-bold mb-4">CTR Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border ${title.length > 60 ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-green-500/10 border-green-500/20 text-green-600'}`}>
                        <div className="text-sm font-bold uppercase mb-1">Title Length</div>
                        <div className="text-2xl font-black">{title.length}/100</div>
                        <div className="text-xs mt-1 opacity-80">{title.length > 60 ? 'Might get truncated on some devices' : 'Good length'}</div>
                    </div>
                    <div className="p-4 rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-600">
                        <div className="text-sm font-bold uppercase mb-1">Visibility</div>
                        <div className="text-lg font-bold">Mobile & Desktop</div>
                        <div className="text-xs mt-1 opacity-80">Check both previews</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
