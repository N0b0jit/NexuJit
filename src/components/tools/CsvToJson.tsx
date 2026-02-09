'use client';

import { useState } from 'react';
import { Table, Code, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function CsvToJson() {
    const [csvInput, setCsvInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const convertToJson = () => {
        setError('');
        try {
            if (!csvInput.trim()) return;

            const lines = csvInput.trim().split('\n');
            if (lines.length < 2) throw new Error('CSV must have at least a header row and one data row');

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
            const result = [];

            for (let i = 1; i < lines.length; i++) {
                const currentLine = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, '')); // Simple split, doesn't handle commas inside quotes perfectly
                const obj: any = {};

                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = currentLine[j] || ""; // Handle missing cols
                }
                result.push(obj);
            }

            setJsonOutput(JSON.stringify(result, null, 2));
        } catch (e: any) {
            setError('Error parsing CSV: ' + e.message);
            setJsonOutput('');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(jsonOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-layout">
                <div className="panel input-panel">
                    <div className="panel-header">
                        <label><Table size={16} /> CSV Input</label>
                    </div>
                    <textarea
                        value={csvInput}
                        onChange={(e) => setCsvInput(e.target.value)}
                        placeholder="name,age,city&#10;John,30,New York&#10;Jane,25,London"
                    />
                </div>

                <div className="controls">
                    <button onClick={convertToJson} className="convert-btn" disabled={!csvInput}>
                        Convert <ArrowRightLeft size={18} />
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="panel output-panel">
                    <div className="panel-header">
                        <label><Code size={16} /> JSON Output</label>
                        {jsonOutput && (
                            <button onClick={handleCopy} className="icon-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={jsonOutput}
                        readOnly
                        placeholder='[{"name": "John", "age": "30"...}]'
                    />
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .converter-layout { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 1.5rem; display: flex; flex-direction: column; height: 300px; overflow: hidden; }
                .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.02); }
                .panel-header label { font-weight: 700; color: var(--secondary); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
                
                textarea { flex: 1; padding: 1.5rem; border: none; background: transparent; resize: none; font-family: monospace; font-size: 0.9rem; outline: none; }
                .output-panel textarea { background: var(--background); }

                .controls { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
                .convert-btn { padding: 0.8rem 2rem; background: var(--primary); color: white; border-radius: 99px; font-weight: 800; display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s; }
                
                .error-msg { color: #ef4444; font-size: 0.9rem; font-weight: 600; text-align: center; }
                .icon-btn { padding: 0.5rem; color: var(--secondary); border-radius: 0.5rem; transition: all 0.2s; }
                .icon-btn:hover { background: var(--primary-soft); color: var(--primary); }
            `}</style>
        </div>
    );
}
