'use client';

import { useState } from 'react';
import { Type, Code, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function JsonToXml() {
    const [jsonInput, setJsonInput] = useState('');
    const [xmlOutput, setXmlOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const convertToXml = () => {
        setError('');
        try {
            if (!jsonInput.trim()) return;
            const obj = JSON.parse(jsonInput);
            const xml = toXml(obj);
            setXmlOutput('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n' + xml + '</root>');
        } catch (e: any) {
            setError('Invalid JSON: ' + e.message);
            setXmlOutput('');
        }
    };

    const toXml = (obj: any, depth = 1): string => {
        let xml = '';
        const indent = '  '.repeat(depth);

        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (Array.isArray(obj[prop])) {
                    obj[prop].forEach((val: any) => {
                        xml += toXml({ [prop]: val }, depth);
                    });
                } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                    xml += `${indent}<${prop}>\n${toXml(obj[prop], depth + 1)}${indent}</${prop}>\n`;
                } else {
                    xml += `${indent}<${prop}>${obj[prop]}</${prop}>\n`;
                }
            }
        }
        return xml;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(xmlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="converter-layout">
                <div className="panel input-panel">
                    <div className="panel-header">
                        <label><Code size={16} /> JSON Input</label>
                    </div>
                    <textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder='{"key": "value"}'
                    />
                </div>

                <div className="controls">
                    <button onClick={convertToXml} className="convert-btn" disabled={!jsonInput}>
                        Convert <ArrowRightLeft size={18} />
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </div>

                <div className="panel output-panel">
                    <div className="panel-header">
                        <label><Type size={16} /> XML Output</label>
                        {xmlOutput && (
                            <button onClick={handleCopy} className="icon-btn">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                        )}
                    </div>
                    <textarea
                        value={xmlOutput}
                        readOnly
                        placeholder='<?xml version="1.0"...'
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
                .convert-btn:hover:not(:disabled) { transform: translateY(-2px); }
                .convert-btn:disabled { opacity: 0.7; }
                
                .error-msg { color: #ef4444; font-size: 0.9rem; font-weight: 600; text-align: center; }
                .icon-btn { padding: 0.5rem; color: var(--secondary); border-radius: 0.5rem; transition: all 0.2s; }
                .icon-btn:hover { background: var(--primary-soft); color: var(--primary); }
            `}</style>
        </div>
    );
}
