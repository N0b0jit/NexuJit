'use client';

import { useState } from 'react';
import { FileText, Copy, Check, Wand2 } from 'lucide-react';

export default function TermsGenerator() {
    const [companyName, setCompanyName] = useState('');
    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [terms, setTerms] = useState('');
    const [copied, setCopied] = useState(false);

    const generateTerms = () => {
        if (!companyName || !websiteName || !websiteUrl) return;

        const date = new Date().toLocaleDateString();

        const template = `TERMS AND CONDITIONS
Last updated: ${date}

1. AGREEMENT TO TERMS
These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ${companyName} ("we," "us" or "our"), concerning your access to and use of the ${websiteUrl} website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").

2. INTELLECTUAL PROPERTY RIGHTS
Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.

3. USER REPRESENTATIONS
By using the Site, you represent and warrant that:
(1) all registration information you submit will be true, accurate, current, and complete;
(2) you will maintain the accuracy of such information and promptly update such registration information as necessary;
(3) you have the legal capacity and you agree to comply with these Terms and Conditions.

4. CONTACT US
In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
${companyName}
${websiteUrl}`;

        setTerms(template);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(terms);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="tool-ui">
            <div className="generator-card">
                <div className="inputs-grid">
                    <div className="input-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g., Acme Corp"
                        />
                    </div>
                    <div className="input-group">
                        <label>Website Name</label>
                        <input
                            type="text"
                            value={websiteName}
                            onChange={(e) => setWebsiteName(e.target.value)}
                            placeholder="e.g., My Awesome Site"
                        />
                    </div>
                    <div className="input-group">
                        <label>Website URL</label>
                        <input
                            type="text"
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="e.g., https://example.com"
                        />
                    </div>

                    <button onClick={generateTerms} className="generate-btn" disabled={!companyName || !websiteName || !websiteUrl}>
                        <Wand2 size={20} /> Generate Terms
                    </button>
                </div>

                {terms && (
                    <div className="result-section">
                        <div className="panel-header">
                            <span>Generated Terms & Conditions</span>
                            <button className="copy-btn" onClick={handleCopy}>
                                {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                            </button>
                        </div>
                        <textarea value={terms} readOnly rows={20} />
                    </div>
                )}
            </div>

            <style jsx>{`
                .tool-ui { max-width: 1000px; margin: 0 auto; }
                .generator-card { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                @media(min-width: 768px) { .generator-card { grid-template-columns: 350px 1fr; } }
                
                .inputs-grid { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); height: fit-content; }
                .input-group { margin-bottom: 1.5rem; }
                .input-group label { display: block; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem; font-size: 0.9rem; }
                .input-group input { width: 100%; padding: 1rem; border-radius: 0.75rem; border: 2px solid var(--border); background: var(--background); }
                
                .generate-btn { width: 100%; padding: 1rem; background: var(--primary); color: white; border-radius: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.2s; }
                .generate-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px var(--primary-soft); }
                .generate-btn:disabled { opacity: 0.7; }

                .result-section { background: var(--background); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); }
                .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-weight: 800; color: var(--secondary); }
                .result-section textarea { width: 100%; padding: 1.5rem; border-radius: 1rem; border: 2px solid var(--border); background: var(--surface); resize: none; font-family: monospace; line-height: 1.6; }
                .copy-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: var(--primary-soft); color: var(--primary); border-radius: 0.6rem; font-weight: 700; }
            `}</style>
        </div>
    );
}
