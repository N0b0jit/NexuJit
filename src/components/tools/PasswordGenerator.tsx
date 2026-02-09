'use client';

import { useState, useEffect } from 'react';
import { Shield, Copy, RefreshCw, Check, Settings, Lock } from 'lucide-react';

export default function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [useUppercase, setUseUppercase] = useState(true);
    const [useLowercase, setUseLowercase] = useState(true);
    const [useNumbers, setUseNumbers] = useState(true);
    const [useSymbols, setUseSymbols] = useState(true);
    const [password, setPassword] = useState('');
    const [strength, setStrength] = useState('');
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        let charset = '';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (!charset) {
            setPassword('Select at least one option');
            return;
        }

        let newPassword = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            newPassword += charset[array[i] % charset.length];
        }

        setPassword(newPassword);
        calculateStrength(newPassword);
    };

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length > 8) score++;
        if (pwd.length > 12) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;

        if (score <= 2) setStrength('Weak');
        else if (score <= 4) setStrength('Medium');
        else setStrength('Strong');
    };

    useEffect(() => {
        generatePassword();
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="password-card">
                <div className="password-display">
                    <div className="password-text">{password}</div>
                    <div className="password-actions">
                        <button onClick={generatePassword} title="Regenerate"><RefreshCw size={20} /></button>
                        <button onClick={handleCopy} className={copied ? 'copied' : ''}>
                            {copied ? <Check size={20} /> : <Copy size={20} />}
                        </button>
                    </div>
                </div>

                <div className="strength-bar">
                    <div className={`strength-fill ${strength.toLowerCase()}`} />
                    <span>Security Level: <strong>{strength}</strong></span>
                </div>

                <div className="settings-panel">
                    <div className="setting-header">
                        <Settings size={16} />
                        <h3>Configuration</h3>
                    </div>

                    <div className="setting-item">
                        <label>Password Length: <strong>{length}</strong></label>
                        <input
                            type="range"
                            min="4"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                        />
                    </div>

                    <div className="options-grid">
                        <label className="checkbox-item">
                            <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} />
                            <span>Uppercase (A-Z)</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} />
                            <span>Lowercase (a-z)</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
                            <span>Numbers (0-9)</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
                            <span>Symbols (&*#)</span>
                        </label>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 600px; margin: 0 auto; }
                .password-card { background: var(--surface); border-radius: 2rem; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow-lg); }
                
                .password-display { background: var(--background); padding: 3rem 2.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border); }
                .password-text { font-family: monospace; font-size: 2rem; font-weight: 700; color: var(--foreground); word-break: break-all; }
                .password-actions { display: flex; gap: 1rem; }
                .password-actions button { padding: 0.75rem; border-radius: 0.75rem; background: var(--surface); color: var(--secondary); border: 1px solid var(--border); }
                .password-actions button:hover { color: var(--primary); border-color: var(--primary); }
                .password-actions button.copied { background: #ecfdf5; color: #10b981; border-color: #10b981; }

                .strength-bar { padding: 1.5rem 2.5rem; background: var(--surface); display: flex; flex-direction: column; gap: 0.75rem; }
                .strength-fill { height: 6px; border-radius: 3px; background: #e2e8f0; position: relative; }
                .strength-fill::after { content: ''; position: absolute; left: 0; top: 0; height: 100%; border-radius: 3px; transition: all 0.3s ease; }
                .strength-fill.weak::after { width: 33%; background: #ef4444; }
                .strength-fill.medium::after { width: 66%; background: #f59e0b; }
                .strength-fill.strong::after { width: 100%; background: #10b981; }
                .strength-bar span { font-size: 0.9rem; color: var(--secondary); }
                .strength-bar strong { color: var(--foreground); }

                .settings-panel { padding: 2.5rem; border-top: 1px solid var(--border); }
                .setting-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; color: var(--secondary); }
                .setting-header h3 { font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 800; }
                
                .setting-item { margin-bottom: 2.5rem; }
                .setting-item label { display: block; margin-bottom: 1rem; font-weight: 700; color: var(--foreground); }
                .setting-item input[type="range"] { width: 100%; height: 6px; border-radius: 3px; background: var(--border); -webkit-appearance: none; }
                .setting-item input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: var(--primary); cursor: pointer; border: 4px solid var(--surface); box-shadow: var(--shadow); }

                .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .checkbox-item { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-weight: 600; color: var(--secondary); transition: color 0.2s; }
                .checkbox-item:hover { color: var(--primary); }
                .checkbox-item input { width: 20px; height: 20px; accent-color: var(--primary); }
            `}</style>
        </div>
    );
}
