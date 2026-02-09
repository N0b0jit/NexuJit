'use client';

import { useState } from 'react';
import { Type, Code, Copy, Check, ArrowRightLeft } from 'lucide-react';

export default function XmlToJson() {
    const [xmlInput, setXmlInput] = useState('');
    const [jsonOutput, setJsonOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const convertToJson = () => {
        setError('');
        try {
            if (!xmlInput.trim()) return;

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlInput, "text/xml");

            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
                throw new Error("Invalid XML");
            }

            const json = xmlToJson(xmlDoc.documentElement);
            setJsonOutput(JSON.stringify(json, null, 2));
        } catch (e: any) {
            setError(e.message);
            setJsonOutput('');
        }
    };

    const xmlToJson = (xml: any) => {
        // Create the return object
        var obj: any = {};

        if (xml.nodeType == 1) { // element
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;

                if (nodeName === "#text" && item.nodeValue.trim() === "") continue;

                if (typeof (obj[nodeName]) == "undefined") {
                    if (nodeName === "#text") {
                        // Special case for text nodes to avoid unnecessary object wrapper if it's cleaner
                        // But strictly simulating structure:
                        var val = xmlToJson(item);
                        if (typeof val === 'string' && val.trim() !== '') obj = val;
                    } else {
                        obj[nodeName] = xmlToJson(item);
                    }
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
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
                        <label><Type size={16} /> XML Input</label>
                    </div>
                    <textarea
                        value={xmlInput}
                        onChange={(e) => setXmlInput(e.target.value)}
                        placeholder='<root><key>value</key></root>'
                    />
                </div>

                <div className="controls">
                    <button onClick={convertToJson} className="convert-btn" disabled={!xmlInput}>
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
                        placeholder='{"root": {"key": "value"}}'
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
