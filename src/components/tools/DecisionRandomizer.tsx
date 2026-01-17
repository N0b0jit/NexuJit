'use client';

import { useState } from 'react';
import { Dices, RefreshCw, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DecisionRandomizer() {
    const [mode, setMode] = useState<'wheel' | 'dice' | 'coin'>('wheel');
    const [history, setHistory] = useState<string[]>([]);

    // Wheel State
    const [items, setItems] = useState<string[]>(['Yes', 'No', 'Maybe', 'Ask Again']);
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);

    // Dice State
    const [diceValue, setDiceValue] = useState(1);

    // Coin State
    const [coinSide, setCoinSide] = useState<'Heads' | 'Tails'>('Heads');

    // -- Logic --

    const spinWheel = () => {
        if (spinning) return;
        setSpinning(true);
        setWinner(null);

        const spinAmount = 1800 + Math.random() * 1800; // At least 5 spins
        const newRotation = rotation + spinAmount;
        setRotation(newRotation);

        setTimeout(() => {
            setSpinning(false);
            const normalizedRotation = newRotation % 360;
            const sliceAngle = 360 / items.length;
            // Calculate index: pointing down (90deg) or top (-90)? CSS rotate starts 0 at top. Pointer is usually at top.
            // Actually let's assume pointer is at top (0deg).
            // The item at top is 360 - (normalizedRotation % 360).
            const winningIndex = Math.floor(((360 - (normalizedRotation % 360)) % 360) / sliceAngle);
            const winItem = items[winningIndex];
            setWinner(winItem);
            addToHistory(`Wheel: ${winItem}`);
        }, 3000);
    };

    const rollDice = () => {
        if (spinning) return;
        setSpinning(true);

        const interval = setInterval(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const val = Math.floor(Math.random() * 6) + 1;
            setDiceValue(val);
            setSpinning(false);
            addToHistory(`Dice: ${val}`);
        }, 1000);
    };

    const flipCoin = () => {
        if (spinning) return;
        setSpinning(true);

        const interval = setInterval(() => {
            setCoinSide(Math.random() > 0.5 ? 'Heads' : 'Tails');
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const side = Math.random() > 0.5 ? 'Heads' : 'Tails';
            setCoinSide(side);
            setSpinning(false);
            addToHistory(`Coin: ${side}`);
        }, 1000);
    };

    const addToHistory = (result: string) => {
        setHistory(prev => [result, ...prev].slice(0, 10));
    };

    const updateWheelItems = (text: string) => {
        setItems(text.split('\n').filter(i => i.trim() !== ''));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-surface p-6 rounded-2xl border border-border space-y-6">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => setMode('wheel')}
                            className={`p-3 rounded-xl font-bold text-left transition-all ${mode === 'wheel' ? 'bg-primary text-white' : 'hover:bg-background'}`}
                        >
                            🎡 Spin Wheel
                        </button>
                        <button
                            onClick={() => setMode('dice')}
                            className={`p-3 rounded-xl font-bold text-left transition-all ${mode === 'dice' ? 'bg-primary text-white' : 'hover:bg-background'}`}
                        >
                            🎲 Roll Dice
                        </button>
                        <button
                            onClick={() => setMode('coin')}
                            className={`p-3 rounded-xl font-bold text-left transition-all ${mode === 'coin' ? 'bg-primary text-white' : 'hover:bg-background'}`}
                        >
                            🪙 Flip Coin
                        </button>
                    </div>

                    {mode === 'wheel' && (
                        <div className="space-y-2">
                            <label className="text-secondary font-bold text-xs uppercase">Options (One per line)</label>
                            <textarea
                                value={items.join('\n')}
                                onChange={(e) => updateWheelItems(e.target.value)}
                                className="w-full h-40 p-3 bg-background border border-border rounded-xl font-medium outline-none text-sm resize-none"
                            />
                        </div>
                    )}

                    <div className="max-h-40 overflow-y-auto space-y-1">
                        <label className="text-secondary font-bold text-xs uppercase">History</label>
                        {history.map((h, i) => (
                            <div key={i} className="text-sm border-b border-border/50 pb-1">{h}</div>
                        ))}
                    </div>
                </div>

                {/* Playground */}
                <div className="md:col-span-2 bg-surface p-8 rounded-2xl border border-border shadow-lg flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">

                    {/* WHEEL MODE */}
                    {mode === 'wheel' && (
                        <>
                            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8">
                                {/* Pointer */}
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 text-red-500">▼</div>

                                <motion.div
                                    className="w-full h-full rounded-full border-4 border-primary overflow-hidden relative"
                                    animate={{ rotate: rotation }}
                                    transition={{ duration: 3, ease: 'easeOut' }}
                                    style={{ background: 'conic-gradient(from 0deg, #3b82f6 0%, #8b5cf6 100%)' }} // Placeholder gradient
                                >
                                    {items.map((item, i) => {
                                        const angle = 360 / items.length;
                                        return (
                                            <div
                                                key={i}
                                                className="absolute w-full h-full top-0 left-0 flex justify-center pt-4 text-white font-bold text-sm"
                                                style={{
                                                    transform: `rotate(${i * angle}deg)`,
                                                    transformOrigin: '50% 50%'
                                                }}
                                            >
                                                <span className="bg-black/20 px-2 rounded">{item.substring(0, 10)}</span>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>

                            <button
                                onClick={spinWheel}
                                disabled={spinning}
                                className="px-8 py-3 bg-primary text-white font-black text-xl rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {spinning ? 'Spinning...' : 'SPIN!'}
                            </button>

                            {winner && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm"
                                    onClick={() => setWinner(null)}
                                >
                                    <div className="bg-surface p-8 rounded-2xl border border-primary text-center shadow-2xl">
                                        <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
                                        <div className="text-secondary uppercase font-bold text-sm">Winner</div>
                                        <div className="text-4xl font-black text-primary mt-2">{winner}</div>
                                        <div className="mt-6 text-sm opacity-50">Click to close</div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* DICE MODE */}
                    {mode === 'dice' && (
                        <div className="flex flex-col items-center gap-8">
                            <motion.div
                                className="w-32 h-32 bg-white rounded-2xl border-4 border-gray-800 flex items-center justify-center shadow-xl"
                                animate={spinning ? { rotate: [0, 90, 180, 270, 360], scale: [1, 0.8, 1.2, 1] } : {}}
                                transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
                            >
                                <span className="text-6xl font-black text-black">{diceValue}</span>
                            </motion.div>
                            <button
                                onClick={rollDice}
                                disabled={spinning}
                                className="px-8 py-3 bg-primary text-white font-black text-xl rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {spinning ? 'Rolling...' : 'ROLL'}
                            </button>
                        </div>
                    )}

                    {/* COIN MODE */}
                    {mode === 'coin' && (
                        <div className="flex flex-col items-center gap-8">
                            <motion.div
                                className="w-32 h-32 rounded-full border-4 border-yellow-600 bg-yellow-400 flex items-center justify-center shadow-xl relative"
                                animate={spinning ? { rotateX: [0, 180, 360], scale: [1, 0.8, 1.2, 1] } : {}}
                                transition={{ duration: 0.2, repeat: spinning ? Infinity : 0 }}
                            >
                                <span className="text-2xl font-black text-yellow-900 uppercase">{coinSide}</span>
                            </motion.div>
                            <button
                                onClick={flipCoin}
                                disabled={spinning}
                                className="px-8 py-3 bg-primary text-white font-black text-xl rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {spinning ? 'Flipping...' : 'FLIP'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
