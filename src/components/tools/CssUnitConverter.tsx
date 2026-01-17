'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

export default function CssUnitConverter() {
    const [px, setPx] = useState<number>(16);
    const [baseSize, setBaseSize] = useState<number>(16);

    // Derived values
    const em = px / baseSize;
    const rem = px / baseSize;
    const percent = (px / baseSize) * 100;
    const pt = px * 0.75;

    const handleChange = (type: 'px' | 'em' | 'rem' | 'percent' | 'pt', value: number) => {
        if (isNaN(value)) return;
        switch (type) {
            case 'px': setPx(value); break;
            case 'em':
            case 'rem': setPx(value * baseSize); break;
            case 'percent': setPx((value / 100) * baseSize); break;
            case 'pt': setPx(value / 0.75); break;
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-lg">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                    <h2 className="text-xl font-bold">Base Font Size</h2>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={baseSize}
                            onChange={(e) => setBaseSize(Number(e.target.value))}
                            className="w-20 p-2 bg-background border border-border rounded-lg font-bold text-center outline-none focus:border-primary"
                        />
                        <span className="text-secondary font-bold text-sm">px</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UnitInput
                        label="Pixels"
                        unit="px"
                        value={px}
                        onChange={(v) => handleChange('px', v)}
                        autoFocus
                    />
                    <UnitInput
                        label="REM / EM"
                        unit="rem"
                        value={rem}
                        onChange={(v) => handleChange('rem', v)}
                    />
                    <UnitInput
                        label="Percentage"
                        unit="%"
                        value={percent}
                        onChange={(v) => handleChange('percent', v)}
                    />
                    <UnitInput
                        label="Points"
                        unit="pt"
                        value={pt}
                        onChange={(v) => handleChange('pt', v)}
                    />
                </div>
            </div>

            <div className="text-center text-sm text-secondary">
                <p>Based on default browser font size of <strong>{baseSize}px</strong>.</p>
                <p>Formula: 16px = 1rem = 100% = 12pt</p>
            </div>
        </div>
    );
}

interface UnitInputProps {
    label: string;
    unit: string;
    value: number;
    onChange: (val: number) => void;
    autoFocus?: boolean;
}

function UnitInput({ label, unit, value, onChange, autoFocus }: UnitInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase block">{label}</label>
            <div className="relative group">
                <input
                    type="number"
                    value={value % 1 !== 0 ? value.toFixed(3).replace(/\.?0+$/, '') : value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-full p-4 bg-background border border-border rounded-xl font-mono text-xl font-bold outline-none focus:border-primary transition-all group-hover:bg-background/80"
                    autoFocus={autoFocus}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-secondary">{unit}</div>
            </div>
        </div>
    );
}
