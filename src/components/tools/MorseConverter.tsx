'use client';

import { useState } from 'react';
import { ArrowRightLeft, Copy, Check, Volume2, Mic } from 'lucide-react';

const MORSE_CODE: { [key: string]: string } = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
};

const REVERSE_MORSE: { [key: string]: string } = Object.fromEntries(
    Object.entries(MORSE_CODE).map(([k, v]) => [v, k])
);

export default function MorseConverter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'textToMorse' | 'morseToText'>('textToMorse');
    const [copied, setCopied] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const convert = (val: string, currentMode: string) => {
        setInput(val);
        if (!val.trim()) {
            setOutput('');
            return;
        }

        if (currentMode === 'textToMorse') {
            const res = val.toUpperCase().split('').map(char => {
                return MORSE_CODE[char] || char; // Keep unknown chars as is
            }).join(' ');
            setOutput(res);
        } else {
            // Morse to text
            const res = val.split(' ').map(code => {
                if (code === '/') return ' ';
                return REVERSE_MORSE[code] || code;
            }).join('');
            setOutput(res);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleMode = () => {
        const newMode = mode === 'textToMorse' ? 'morseToText' : 'textToMorse';
        setMode(newMode);
        // Swap input/output logic if needed, but easier to just clear or re-convert
        setInput(output); // Use previous output as new input
        convert(output, newMode);
    };

    const playMorse = async () => {
        if (!window.AudioContext) return;
        if (isPlaying) return; // Prevent overlapping
        setIsPlaying(true);

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const dot = 0.06; // Duration of dot

        let time = ctx.currentTime;

        const morseStr = mode === 'textToMorse' ? output : input;

        morseStr.split('').forEach(char => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 600; // Hz

            if (char === '.') {
                osc.start(time);
                time += dot;
                osc.stop(time);
                time += dot; // inter-element gap
            } else if (char === '-') {
                osc.start(time);
                time += dot * 3;
                osc.stop(time);
                time += dot; // inter-element gap
            } else if (char === ' ' || char === '/') {
                time += dot * 3; // Space between letters (3 dots) or words (7 dots total usually, we simplify)
            }
        });

        // Auto reset playing state after estimated duration
        setTimeout(() => {
            setIsPlaying(false);
            ctx.close();
        }, (time - ctx.currentTime) * 1000 + 100);
    };

    return (
        <div className="tool-ui">
            <div className="converter-card">
                <div className="header">
                    <button
                        onClick={toggleMode}
                        className="mode-btn"
                    >
                        {mode === 'textToMorse' ? 'Text → Morse' : 'Morse → Text'}
                        <ArrowRightLeft size={16} className="ml-2" />
                    </button>
                    {mode === 'textToMorse' && (
                        <button onClick={playMorse} className="play-btn" disabled={!output || isPlaying}>
                            <Volume2 size={18} /> {isPlaying ? 'Playing...' : 'Play Audio'}
                        </button>
                    )}
                </div>

                <div className="io-grid">
                    <div className="io-box">
                        <label>{mode === 'textToMorse' ? 'Text Input' : 'Morse Input'}</label>
                        <textarea
                            value={input}
                            onChange={(e) => convert(e.target.value, mode)}
                            placeholder={mode === 'textToMorse' ? "Type text here..." : "Type morse like ... --- ..."}
                        />
                    </div>

                    <div className="io-box result">
                        <div className="box-head">
                            <label>{mode === 'textToMorse' ? 'Morse Output' : 'Text Output'}</label>
                            {output && (
                                <button onClick={handleCopy} className="icon-btn">
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </button>
                            )}
                        </div>
                        <div className="output-content">
                            {output || <span className="placeholder">Translation will appear here...</span>}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .converter-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-lg); }
                
                .header { display: flex; justify-content: space-between; margin-bottom: 2rem; align-items: center; }
                .mode-btn { background: var(--primary); color: white; padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; cursor: pointer; }
                .play-btn { background: var(--surface); border: 2px solid var(--border); color: var(--foreground); padding: 0.75rem 1.5rem; border-radius: 0.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
                .play-btn:hover { border-color: var(--primary); color: var(--primary); }
                
                .io-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media(min-width: 768px) { .io-grid { grid-template-columns: 1fr 1fr; } }
                
                .io-box { display: flex; flex-direction: column; height: 300px; }
                .io-box label { font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; }
                
                textarea { flex: 1; padding: 1.5rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--background); resize: none; font-size: 1.1rem; line-height: 1.6; }
                
                .io-box.result { background: var(--background); padding: 0; border-radius: 1rem; border: 2px solid var(--border); overflow: hidden; }
                .box-head { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.02); }
                .box-head label { margin: 0; }
                
                .output-content { padding: 1.5rem; overflow-y: auto; flex: 1; font-weight: 700; font-size: 1.2rem; color: var(--primary); line-height: 1.6; word-break: break-word; }
                .placeholder { opacity: 0.4; font-weight: 500; font-style: italic; color: var(--foreground); }

                .icon-btn { padding: 0.5rem; border-radius: 0.5rem; color: var(--secondary); transition: all 0.2s; }
                .icon-btn:hover { background: var(--surface); color: var(--primary); }
                .ml-2 { margin-left: 0.5rem; }
            `}</style>
        </div>
    );
}
