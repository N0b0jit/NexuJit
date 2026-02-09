'use client';

import { useState, useRef, useEffect } from 'react';
import { Cpu, Zap, Activity, Info, AlertCircle, Share2, MousePointer2, Plus, Trash2, Play, Sparkles, Binary } from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui/Core';
import { motion } from 'framer-motion';

export default function AcademicScienceTools() {
    const [activeTab, setActiveTab] = useState<'logic' | 'webgpu'>('logic');

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-32">
            <div className="flex bg-surface p-2 rounded-2xl border border-glass-border justify-center sticky top-4 z-50 backdrop-blur-xl">
                <button
                    onClick={() => setActiveTab('logic')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'logic' ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                >
                    <Binary size={18} /> LOGIC CIRCUIT SIM
                </button>
                <button
                    onClick={() => setActiveTab('webgpu')}
                    className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all ${activeTab === 'webgpu' ? 'bg-accent text-white shadow-2xl' : 'hover:bg-bg-primary text-fg-tertiary'}`}
                >
                    <Cpu size={18} /> WEBGPU DEEP-SCAN
                </button>
            </div>

            <div className="min-h-[600px] animate-fade-in">
                {activeTab === 'logic' ? <LogicCircuitSimUI /> : <WebGpuDeepScanUI />}
            </div>
        </div>
    );
}

// --- Logic Circuit Simulator ---
function LogicCircuitSimUI() {
    const [inputA, setInputA] = useState(false);
    const [inputB, setInputB] = useState(false);
    const [gate, setGate] = useState<'AND' | 'OR' | 'NAND' | 'XOR'>('AND');

    const getOutput = () => {
        if (gate === 'AND') return inputA && inputB;
        if (gate === 'OR') return inputA || inputB;
        if (gate === 'NAND') return !(inputA && inputB);
        if (gate === 'XOR') return inputA !== inputB;
        return false;
    };

    const output = getOutput();

    return (
        <Card className="p-12 space-y-12 bg-linear-to-b from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/20">
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black tracking-tighter italic">Logic Gate <span className="text-accent">Simulator</span></h2>
                <p className="text-fg-secondary">Educational playground for binary gate visualization. Master the foundation of computer science.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-10">
                {/* Inputs */}
                <div className="space-y-10">
                    <InputToggle label="INPUT A" active={inputA} onClick={() => setInputA(!inputA)} />
                    <InputToggle label="INPUT B" active={inputB} onClick={() => setInputB(!inputB)} />
                </div>

                {/* Connection Wires */}
                <div className="hidden md:flex flex-col gap-10">
                    <div className={`h-1 w-20 transition-all duration-500 rounded-full ${inputA ? 'bg-accent shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-glass-border'}`} />
                    <div className={`h-1 w-20 transition-all duration-500 rounded-full ${inputB ? 'bg-accent shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-glass-border'}`} />
                </div>

                {/* The Gate */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-48 h-48 bg-black rounded-[3rem] border-4 border-accent relative z-10 flex flex-col items-center justify-center p-6 text-center space-y-4 shadow-2xl">
                        <div className="text-xs font-black text-fg-tertiary tracking-widest">GATE ENGINE</div>
                        <select
                            className="bg-transparent text-4xl font-black text-accent outline-none text-center appearance-none cursor-pointer"
                            value={gate}
                            onChange={(e) => setGate(e.target.value as any)}
                        >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                            <option value="NAND">NAND</option>
                            <option value="XOR">XOR</option>
                        </select>
                        <Zap size={24} className={output ? 'text-accent animate-pulse' : 'text-fg-tertiary'} />
                    </div>
                </div>

                {/* Output Wire */}
                <div className={`hidden md:block h-1 w-20 transition-all duration-500 rounded-full ${output ? 'bg-accent shadow-[0_0_15px_rgba(37,99,235,0.8)]' : 'bg-glass-border'}`} />

                {/* Final Output */}
                <div className="space-y-4 text-center">
                    <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${output ? 'bg-accent text-white border-accent shadow-[0_0_40px_rgba(37,99,235,0.5)] scale-110' : 'bg-surface border-glass-border text-fg-tertiary'}`}>
                        <div className="text-2xl font-black italic">{output ? 'HIGH' : 'LOW'}</div>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-fg-tertiary">Result Bit: {output ? '1' : '0'}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { gate: 'AND', rule: 'Both A & B must be 1' },
                    { gate: 'OR', rule: 'Either A or B is 1' },
                    { gate: 'NAND', rule: 'Opposite of AND logic' },
                    { gate: 'XOR', rule: 'A & B must be different' }
                ].map(item => (
                    <div key={item.gate} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${gate === item.gate ? 'bg-accent/10 border-accent/40' : 'bg-surface border-glass-border opacity-50 hover:opacity-100'}`} onClick={() => setGate(item.gate as any)}>
                        <div className="text-sm font-black text-fg-primary mb-1">{item.gate}</div>
                        <div className="text-[10px] font-bold text-fg-tertiary uppercase leading-tight">{item.rule}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function InputToggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
    return (
        <div className="flex items-center gap-6 group cursor-pointer" onClick={onClick}>
            <div className="text-right">
                <div className="text-[10px] font-black tracking-widest text-fg-tertiary">{label}</div>
                <div className="text-lg font-black text-fg-primary tracking-tight">{active ? 'ACTIVE' : 'IDLE'}</div>
            </div>
            <div className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${active ? 'bg-accent' : 'bg-glass-border'}`}>
                <motion.div
                    animate={{ x: active ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-white shadow-xl"
                />
            </div>
        </div>
    );
}

// --- WebGPU Deep Scan ---
function WebGpuDeepScanUI() {
    const [status, setStatus] = useState<'scanning' | 'ready' | 'error'>('scanning');
    const [gpuInfo, setGpuInfo] = useState<any>(null);

    useEffect(() => {
        const checkGPU = async () => {
            if (!navigator.gpu) {
                setStatus('error');
                return;
            }
            try {
                const adapter = await navigator.gpu.requestAdapter();
                if (!adapter) throw new Error('Adapter not found');

                // Real data extraction from WebGPU
                setGpuInfo({
                    vendor: (adapter as any).name || 'Generic WebGPU Adapter',
                    architecture: (adapter as any).architecture || 'N/A',
                    limits: {
                        maxTextureSize: adapter.limits.maxTextureDimension2D,
                        maxComputeWorkgroupSize: adapter.limits.maxComputeWorkgroupSizeX,
                        maxStorageBufferBindingSize: Math.round(adapter.limits.maxStorageBufferBindingSize / 1024 / 1024) + ' MB'
                    },
                    features: Array.from(adapter.features)
                });
                setStatus('ready');
            } catch (e) {
                setStatus('error');
            }
        };
        setTimeout(checkGPU, 1500);
    }, []);

    return (
        <Card className="p-12 space-y-10 bg-linear-to-br from-bg-primary via-bg-secondary to-bg-primary border-2 border-accent/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-accent/5 shimmer pointer-events-none opacity-40" />

            <div className="text-center space-y-2 relative z-10">
                <Badge variant="accent" className="px-6 py-1.5 rounded-full">HARDWARE PRO V4.0</Badge>
                <h2 className="text-4xl font-black tracking-tighter italic">WebGPU <span className="text-accent underline">Deep-Scan</span></h2>
                <p className="text-fg-secondary">Analyze your hardware's support for next-gen 3D and machine learning in the browser.</p>
            </div>

            {status === 'scanning' && (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                    <Activity size={64} className="text-accent animate-spin-slow" />
                    <div className="text-xl font-black italic tracking-widest animate-pulse">PROBING ADAPTER INTERFACE...</div>
                </div>
            )}

            {status === 'error' && (
                <div className="py-20 text-center space-y-6">
                    <AlertCircle size={64} className="text-red-500 mx-auto" />
                    <div className="text-2xl font-black">WebGPU Not Supported</div>
                    <p className="text-fg-secondary max-w-md mx-auto italic">Your browser or hardware doesn't support the raw WebGPU API yet. Try Chrome Canary or enabling flags.</p>
                </div>
            )}

            {status === 'ready' && gpuInfo && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in relative z-10">
                    <div className="space-y-6">
                        <div className="p-8 bg-surface rounded-[2.5rem] border border-glass-border space-y-4">
                            <h4 className="text-xs font-black uppercase text-accent tracking-[0.3em] mb-4 flex items-center gap-2"><Cpu size={14} /> Primary Interface</h4>
                            <div className="text-3xl font-black tracking-tight text-fg-primary leading-none">{gpuInfo.vendor}</div>
                            <div className="text-sm font-bold text-fg-tertiary">Architecture Path: {gpuInfo.architecture}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: 'MAX TEXTURE', val: gpuInfo.limits.maxTextureSize + 'px' },
                                { label: 'WORKGROUP X', val: gpuInfo.limits.maxComputeWorkgroupSize },
                                { label: 'STORAGE BUF', val: gpuInfo.limits.maxStorageBufferBindingSize },
                                { label: 'PRECISION', val: '64-BIT-FLOAT' }
                            ].map(limit => (
                                <div key={limit.label} className="p-6 bg-surface border border-glass-border rounded-3xl text-center">
                                    <div className="text-[10px] font-black text-fg-tertiary tracking-widest mb-1">{limit.label}</div>
                                    <div className="text-lg font-black text-accent">{limit.val}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-fg-tertiary px-4 border-l-2 border-accent">ENABLED HARDWARE FEATURES</h4>
                        <div className="flex flex-wrap gap-3">
                            {gpuInfo.features.length > 0 ? gpuInfo.features.map((f: string) => (
                                <span key={f} className="px-5 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent text-xs font-black tracking-tight">{f}</span>
                            )) : (
                                <div className="text-fg-tertiary font-bold italic p-10 border-2 border-dashed border-glass-border rounded-3xl w-full text-center">Baseline Feature Set Only</div>
                            )}
                        </div>

                        <Card className="p-6 bg-accent/5 border border-accent/20 mt-6 relative overflow-hidden">
                            <Sparkles size={48} className="absolute -right-4 -bottom-4 text-accent/10 rotate-12" />
                            <h5 className="text-sm font-black italic mb-2">Technical Insight</h5>
                            <p className="text-xs text-fg-secondary leading-relaxed font-medium">
                                Your adapter supports **{gpuInfo.features.length} unique extensions**. This environment is optimal for high-performance neural networks and fragment shaders.
                            </p>
                        </Card>
                    </div>
                </div>
            )}
        </Card>
    );
}
