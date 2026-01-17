'use client';

import { useState } from 'react';
import { Upload, X, Laptop, Smartphone, Tablet } from 'lucide-react';

export default function ImageSafeAreaChecker() {
    const [image, setImage] = useState<string | null>(null);
    const [platform, setPlatform] = useState('youtube');

    // Safety Overlays configuration
    // Percentages are represented as css indents
    const overlays: any = {
        youtube: {
            // YouTube Banner (2560 x 1440)
            // Safe Text & Logo Area: 1546 x 423 (Centered)
            aspect: 'aspect-[16/9]',
            safeZone: { top: '35%', bottom: '35%', left: '20%', right: '20%' }, // Approx
            label: 'YouTube Channel Art'
        },
        instagram_story: {
            aspect: 'aspect-[9/16]',
            safeZone: { top: '15%', bottom: '15%', left: '0%', right: '0%' }, // Avoid UI
            label: 'Instagram Story / Reel'
        },
        instagram_post: {
            aspect: 'aspect-[4/5]',
            safeZone: { top: '0%', bottom: '0%', left: '0%', right: '0%' }, // Usually fully safe, but focus center
            label: 'Instagram Portrait'
        }
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const currentOverlay = overlays[platform];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border">
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-6">
                    <div className="flex gap-2">
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="p-3 bg-background border border-border rounded-xl font-bold outline-none"
                        >
                            <option value="youtube">YouTube Banner</option>
                            <option value="instagram_story">Instagram Story/Reel</option>
                            <option value="instagram_post">Instagram Portrait (4:5)</option>
                        </select>
                    </div>

                    {!image && (
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                accept="image/*"
                            />
                            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors">
                                <Upload size={20} /> Upload Image
                            </button>
                        </div>
                    )}

                    {image && (
                        <button onClick={() => setImage(null)} className="flex items-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors">
                            <Trash2 size={16} /> Clear
                        </button>
                    )}
                </div>

                <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[400px]">
                    {image ? (
                        <div className={`relative w-full max-w-2xl ${currentOverlay.aspect}`}>
                            {/* The Image */}
                            <img src={image} className="absolute inset-0 w-full h-full object-cover" />

                            {/* The Overlay */}
                            <div className="absolute inset-0 pointer-events-none bg-black/50">
                                {/* Safe Zone Cutout */}
                                <div
                                    className="absolute border-2 border-green-500 bg-transparent flex items-center justify-center"
                                    style={{
                                        top: currentOverlay.safeZone.top,
                                        bottom: currentOverlay.safeZone.bottom,
                                        left: currentOverlay.safeZone.left,
                                        right: currentOverlay.safeZone.right,
                                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)' // The dark overlay outside
                                    }}
                                >
                                    <span className="text-green-500 font-bold bg-black/50 px-2 py-1 rounded text-sm">SAFE ZONE</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <Upload size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Upload an image to check safe zones</p>
                        </div>
                    )}
                </div>

                <p className="mt-4 text-center text-secondary text-sm">
                    The darkened areas are masked by platform UI or may be cropped on some devices. Keep important text/logos in the bright box.
                </p>
            </div>
        </div>
    );
}

function Trash2(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>;
}
