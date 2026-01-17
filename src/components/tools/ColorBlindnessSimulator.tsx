'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ColorBlindnessSimulator() {
    const [mode, setMode] = useState('normal');

    // SVG Filters for different types of color blindness
    // https://www.w3.org/TR/filter-effects-1/#feColorMatrixElement
    const filters: any = {
        normal: [],
        protanopia: [ // Red-blind
            0.567, 0.433, 0, 0, 0,
            0.558, 0.442, 0, 0, 0,
            0, 0.242, 0.758, 0, 0,
            0, 0, 0, 1, 0
        ],
        deuteranopia: [ // Green-blind
            0.625, 0.375, 0, 0, 0,
            0.7, 0.3, 0, 0, 0,
            0, 0.3, 0.7, 0, 0,
            0, 0, 0, 1, 0
        ],
        tritanopia: [ // Blue-blind
            0.95, 0.05, 0, 0, 0,
            0, 0.433, 0.567, 0, 0,
            0, 0.475, 0.525, 0, 0,
            0, 0, 0, 1, 0
        ],
        achromatopsia: [ // Total color blindness
            0.299, 0.587, 0.114, 0, 0,
            0.299, 0.587, 0.114, 0, 0,
            0.299, 0.587, 0.114, 0, 0,
            0, 0, 0, 1, 0
        ]
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="flex flex-wrap justify-center gap-2">
                    {Object.keys(filters).map(bg => (
                        <button
                            key={bg}
                            onClick={() => setMode(bg)}
                            className={`px-4 py-2 rounded-lg font-bold capitalize transition-all ${mode === bg ? 'bg-primary text-white shadow-lg scale-105' : 'bg-surface border border-border hover:border-primary'}`}
                        >
                            {bg}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-secondary max-w-lg mx-auto">
                    Select a color blindness type to simulate how users with that condition perceive colors.
                    This uses SVG Color Matrix filters.
                </p>
            </div>

            {/* Test Image Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <div className="font-bold text-center text-secondary uppercase text-xs">Original</div>
                    <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                        <img
                            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=800&auto=format&fit=crop"
                            alt="Test"
                            className="w-full h-64 object-cover"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="font-bold text-center text-primary uppercase text-xs flex items-center justify-center gap-2">
                        <EyeOff size={14} /> Simulated: {mode}
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg border border-border relative">
                        <img
                            src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=800&auto=format&fit=crop"
                            alt="Simulated"
                            className="w-full h-64 object-cover"
                            style={{ filter: mode !== 'normal' ? `url(#filter-${mode})` : 'none' }}
                        />
                        {/* SVG Filter Definition */}
                        <svg className="absolute w-0 h-0">
                            <defs>
                                <filter id={`filter-${mode}`}>
                                    <feColorMatrix
                                        type="matrix"
                                        values={filters[mode].join(' ')}
                                    />
                                </filter>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Spectrum Test */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-border h-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                <div
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                    style={{ filter: mode !== 'normal' ? `url(#filter-${mode})` : 'none' }}
                />
                <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none">
                    <span className="text-xs font-bold text-white drop-shadow-md">Original Spectrum</span>
                    <span className="text-xs font-bold text-white drop-shadow-md text-right">Simulated Spectrum</span>
                </div>
            </div>
        </div>
    );
}
