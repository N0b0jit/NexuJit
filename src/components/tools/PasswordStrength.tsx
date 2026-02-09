'use client';

import { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff, Lock, Clock, ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

export default function PasswordStrength() {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: 'Very Weak', color: '#ef4444' });
    const [crackedTime, setCrackedTime] = useState('0 seconds');

    const checkStrength = (pass: string) => {
        let score = 0;
        if (!pass) return { score: 0, label: 'None', color: '#666' };

        if (pass.length > 8) score++;
        if (pass.length > 12) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        // Calculate simulated crack time
        const entropy = pass.length * Math.log2(pass.match(/[a-z]/) ? 26 : 0 + (pass.match(/[A-Z]/) ? 26 : 0) + (pass.match(/[0-9]/) ? 10 : 0) + (pass.match(/[^A-Za-z0-9]/) ? 32 : 0) || 1);
        const combinations = Math.pow(2, entropy);
        const hashesPerSec = 10000000000; // 10 billion
        const seconds = combinations / hashesPerSec;

        let timeText = '';
        if (seconds < 1) timeText = 'Instantly';
        else if (seconds < 60) timeText = `${Math.floor(seconds)} seconds`;
        else if (seconds < 3600) timeText = `${Math.floor(seconds / 60)} minutes`;
        else if (seconds < 86400) timeText = `${Math.floor(seconds / 3600)} hours`;
        else if (seconds < 31536000) timeText = `${Math.floor(seconds / 86400)} days`;
        else if (seconds < 3153600000) timeText = `${Math.floor(seconds / 31536000)} years`;
        else timeText = 'Centuries';

        setCrackedTime(timeText);

        if (score <= 1) return { score, label: 'Very Weak', color: '#ef4444' };
        if (score === 2) return { score, label: 'Weak', color: '#f97316' };
        if (score === 3) return { score, label: 'Medium', color: '#eab308' };
        if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
        return { score, label: 'Very Strong', color: '#10b981' };
    };

    useEffect(() => {
        setStrength(checkStrength(password));
    }, [password]);

    const requirements = [
        { label: 'At least 8 characters', met: password.length >= 8 },
        { label: 'Uppercase letters', met: /[A-Z]/.test(password) },
        { label: 'Numbers (0-9)', met: /[0-9]/.test(password) },
        { label: 'Special characters (!@#$)', met: /[^A-Za-z0-9]/.test(password) }
    ];

    return (
        <div className="tool-ui">
            <div className="password-layout">
                <div className="main-panel">
                    <div className="input-box">
                        <Lock className="lock-icon" size={20} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={() => setShowPassword(!showPassword)} className="toggle-btn">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="strength-meter">
                        <div className="meter-label">
                            <span>Password Security</span>
                            <span style={{ color: strength.color, fontWeight: 800 }}>{strength.label}</span>
                        </div>
                        <div className="meter-bar">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div
                                    key={step}
                                    className="step"
                                    style={{
                                        background: step <= strength.score ? strength.color : 'var(--border)',
                                        opacity: step <= strength.score ? 1 : 0.3
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <Clock size={20} className="icon" />
                            <div className="stat-info">
                                <label>Time to Crack</label>
                                <span>{crackedTime}</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <ShieldCheck size={20} className="icon" />
                            <div className="stat-info">
                                <label>Security Level</label>
                                <span>{strength.score > 3 ? 'Excellent' : strength.score > 1 ? 'Moderate' : 'Danger'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="side-panel">
                    <h3>Requirements</h3>
                    <div className="req-list">
                        {requirements.map((req, i) => (
                            <div key={i} className={`req-item ${req.met ? 'met' : ''}`}>
                                {req.met ? <Check size={16} /> : <X size={16} />}
                                <span>{req.label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="security-tip">
                        <ShieldAlert size={20} />
                        <p>Never reuse passwords across different sites. Use a password manager for better security.</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .tool-ui { max-width: 900px; margin: 0 auto; }
        .password-layout { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        @media (min-width: 1024px) { .password-layout { grid-template-columns: 1fr 300px; } }

        .main-panel { background: var(--surface); border: 1px solid var(--border); padding: 2.5rem; border-radius: 1.5rem; display: flex; flex-direction: column; gap: 2rem; }
        .input-box { position: relative; background: var(--background); border: 2px solid var(--border); border-radius: 1rem; display: flex; align-items: center; padding: 0.5rem 1rem; transition: border-color 0.2s; }
        .input-box:focus-within { border-color: var(--primary); }
        .lock-icon { color: var(--secondary); margin-right: 1rem; }
        .input-box input { flex: 1; min-height: 50px; border: none; background: transparent; font-size: 1.25rem; font-weight: 500; }
        .input-box input:focus { outline: none; }
        .toggle-btn { color: var(--secondary); padding: 0.5rem; }

        .strength-meter { display: flex; flex-direction: column; gap: 1rem; }
        .meter-label { display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; color: var(--secondary); text-transform: uppercase; }
        .meter-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; height: 10px; }
        .step { border-radius: 999px; transition: all 0.3s; }

        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
        .stat-card { background: var(--background); border: 1px solid var(--border); padding: 1.5rem; border-radius: 1rem; display: flex; align-items: center; gap: 1rem; }
        .stat-card .icon { color: var(--primary); }
        .stat-info label { display: block; font-size: 0.75rem; font-weight: 700; color: var(--secondary); text-transform: uppercase; margin-bottom: 0.25rem; }
        .stat-info span { font-size: 1.1rem; font-weight: 800; color: var(--foreground); }

        .side-panel { background: var(--background); border: 1px solid var(--border); border-radius: 1.5rem; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; height: fit-content; }
        .side-panel h3 { font-size: 1.1rem; font-weight: 800; color: var(--foreground); }
        .req-list { display: flex; flex-direction: column; gap: 1rem; }
        .req-item { display: flex; align-items: center; gap: 0.75rem; color: var(--secondary); font-size: 0.95rem; font-weight: 500; }
        .req-item.met { color: #10b981; }
        .security-tip { padding: 1.25rem; background: var(--primary-soft); color: var(--primary); border-radius: 1rem; display: flex; gap: 1rem; font-size: 0.85rem; font-weight: 500; line-height: 1.5; }
      `}</style>
        </div>
    );
}
