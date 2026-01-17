'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Download, Settings2, Volume2, Languages, Type, RefreshCw } from 'lucide-react';

export default function TextToSpeech() {
    const [text, setText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !voice) {
                setVoice(availableVoices.find(v => v.default) || availableVoices[0]);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
    }, [voice]);

    const speak = () => {
        if (!text) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        if (voice) utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="tool-ui">
            <div className="tts-card">
                <div className="editor-side">
                    <div className="label-group">
                        <Type size={18} />
                        <span>Enter your text here</span>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type or paste something to convert into speech..."
                        maxLength={5000}
                    />
                    <div className="char-count">{text.length}/5000 characters</div>
                </div>

                <div className="settings-side">
                    <div className="setting-item">
                        <label><Languages size={16} /> Choose Voice</label>
                        <select
                            value={voice?.name || ''}
                            onChange={(e) => setVoice(voices.find(v => v.name === e.target.value) || null)}
                        >
                            {voices.map(v => (
                                <option key={v.name} value={v.name}>
                                    {v.name} ({v.lang})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sliders-grid">
                        <div className="setting-item">
                            <label><Settings2 size={16} /> Speed ({rate}x)</label>
                            <input
                                type="range"
                                min="0.5" max="2" step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="setting-item">
                            <label><Volume2 size={16} /> Pitch ({pitch})</label>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={pitch}
                                onChange={(e) => setPitch(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="actions">
                        {!isSpeaking ? (
                            <button onClick={speak} disabled={!text} className="btn-play">
                                <Play size={20} fill="currentColor" />
                                Listen Now
                            </button>
                        ) : (
                            <button onClick={stop} className="btn-stop">
                                <Square size={20} fill="currentColor" />
                                Stop playback
                            </button>
                        )}
                        <p className="hint">Speech is generated natively in your browser for maximum privacy.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 900px; margin: 0 auto; }
                .tts-card { 
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 2rem;
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                }
                
                .editor-side { padding: 2.5rem; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
                .label-group { display: flex; align-items: center; gap: 0.5rem; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; color: var(--secondary); margin-bottom: 1.5rem; }
                
                textarea { 
                    flex: 1; min-height: 300px; padding: 1.5rem; border-radius: 1.5rem; border: 1px solid var(--border);
                    background: var(--background); font-family: inherit; font-size: 1.1rem; resize: none; line-height: 1.6;
                }
                textarea:focus { border-color: var(--primary); }
                .char-count { margin-top: 1rem; font-size: 0.75rem; color: var(--secondary); text-align: right; font-weight: 600; }

                .settings-side { padding: 2.5rem; background: var(--background); display: flex; flex-direction: column; gap: 2rem; }
                .setting-item label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 1rem; }
                
                select { 
                    width: 100%; padding: 1rem; border-radius: 1rem; border: 1px solid var(--border); background: var(--surface);
                    font-size: 0.9rem; font-weight: 600; cursor: pointer;
                }
                
                .sliders-grid { display: grid; gap: 1.5rem; }
                input[type="range"] { 
                    width: 100%; height: 6px; border-radius: 3px; background: var(--border); cursor: pointer;
                }

                .actions { margin-top: auto; display: flex; flex-direction: column; gap: 1rem; }
                .btn-play { 
                    width: 100%; padding: 1.25rem; border-radius: 1.25rem; border: none; background: var(--primary); color: white;
                    font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
                    box-shadow: 0 10px 25px var(--primary-soft);
                }
                .btn-stop { 
                    width: 100%; padding: 1.25rem; border-radius: 1.25rem; background: #f43f5e; color: white;
                    font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
                }
                .hint { font-size: 0.75rem; color: var(--secondary); text-align: center; font-style: italic; }

                @media (max-width: 768px) {
                    .tts-card { grid-template-columns: 1fr; }
                    .editor-side { border-right: none; border-bottom: 1px solid var(--border); }
                }
            `}</style>
        </div>
    );
}
