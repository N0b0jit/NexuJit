'use client';

import { useState, useEffect } from 'react';
import { Globe, Copy, Check } from 'lucide-react';

export default function UserAgentFinder() {
    const [userAgent, setUserAgent] = useState('');
    const [browserInfo, setBrowserInfo] = useState<any>({});
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const ua = navigator.userAgent;
        setUserAgent(ua);

        // Simple parsing logic
        const getBrowser = () => {
            if (ua.includes("Chrome")) return "Google Chrome";
            if (ua.includes("Firefox")) return "Mozilla Firefox";
            if (ua.includes("Safari") && !ua.includes("Chrome")) return "Apple Safari";
            if (ua.includes("Edge")) return "Microsoft Edge";
            return "Unknown";
        };

        const getOS = () => {
            if (ua.includes("Win")) return "Windows";
            if (ua.includes("Mac")) return "MacOS";
            if (ua.includes("Linux")) return "Linux";
            if (ua.includes("Android")) return "Android";
            if (ua.includes("iOS")) return "iOS";
            return "Unknown";
        };

        setBrowserInfo({
            browser: getBrowser(),
            os: getOS(),
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${window.screen.width} x ${window.screen.height}`
        });
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(userAgent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="ua-card">
                <div className="main-result">
                    <div className="label">Your User Agent String</div>
                    <div className="ua-box">
                        <p>{userAgent}</p>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">Browser</span>
                        <span className="value">{browserInfo.browser}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Operating System</span>
                        <span className="value">{browserInfo.os}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Platform</span>
                        <span className="value">{browserInfo.platform}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Language</span>
                        <span className="value">{browserInfo.language}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">Screen Size</span>
                        <span className="value">{browserInfo.screenSize}</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .tool-ui { max-width: 800px; margin: 0 auto; }
                .ua-card { background: var(--surface); border: 1px solid var(--border); border-radius: 2rem; padding: 3rem; box-shadow: var(--shadow-lg); }
                
                .main-result { margin-bottom: 3rem; }
                .main-result .label { font-weight: 800; color: var(--secondary); margin-bottom: 1rem; text-transform: uppercase; font-size: 0.9rem; }
                .ua-box { background: var(--background); border: 2px solid var(--border); padding: 1.5rem; border-radius: 1rem; position: relative; }
                .ua-box p { font-family: monospace; font-size: 1.1rem; color: var(--foreground); line-height: 1.6; word-break: break-all; padding-right: 3rem; }
                .copy-btn { position: absolute; top: 1rem; right: 1rem; padding: 0.5rem; color: var(--primary); background: var(--primary-soft); border-radius: 0.5rem; transition: all 0.2s; }
                .copy-btn:hover { background: var(--primary); color: white; }

                .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
                .detail-item { background: var(--background); padding: 1.5rem; border-radius: 1rem; border: 1px solid var(--border); }
                .detail-item .label { display: block; font-size: 0.8rem; color: var(--secondary); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; }
                .detail-item .value { font-size: 1.2rem; font-weight: 800; color: var(--foreground); }
            `}</style>
        </div>
    );
}
